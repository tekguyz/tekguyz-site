'use server';

import { Resend } from 'resend';
import { z } from 'zod';
import { headers } from 'next/headers';
import { site } from '@/lib/site';
import { checkContactLimit } from '@/lib/rate-limit';

/**
 * THE shared lead-capture action. Called by the contact form AND the concierge
 * with a different `source`. There is never a second implementation.
 *
 * Ported from the live site's app/actions/contact.ts. Changes, all required by
 * CANONICAL §7's confirmed CRM contract:
 *
 *  1. HONEYPOT RENAMED `website` -> `hp_confirm`. The CRM's real optional column
 *     is also called `website`, so the old naming meant a legitimate lead typing
 *     their actual business URL into a visible Website field collided with the
 *     honeypot key and was SILENTLY DROPPED as a suspected bot — no error shown
 *     to them, nothing logged. The rename and the new visible field land in this
 *     same change; doing either alone reintroduces the bug.
 *  2. `phone` and `website` added as real optional fields, wired to the CRM.
 *  3. A confirmation email now goes to the submitter. Previously only the
 *     internal inbox was notified and the person who wrote in heard nothing.
 *
 * Kept as-is: Zod validation, the minimum-fill-time check, the silent bot
 * accept, and parallel dispatch via Promise.allSettled.
 */

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  /** The lead's own business site — a REAL CRM column, not the honeypot. */
  website: z.string().optional(),
  projectType: z.string().min(1, 'Please select a project type'),
  budget: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  /** Honeypot. Must stay blank. Deliberately not a real CRM field name. */
  hp_confirm: z.string().max(0).optional(),
  /** Paired with a minimum-fill-time check. */
  timestamp: z.number().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export type ContactResult = { success: boolean; error?: string };

const GENERIC_ERROR = `Something didn't go through. Try again, or email us directly at ${site.publicEmail}.`;

export async function sendContactEmail(
  data: ContactFormData,
  source: string = 'Website Contact Form',
): Promise<ContactResult> {
  const validatedFields = contactSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields. Please check your input and try again.' };
  }

  const { name, email, company, phone, website, projectType, budget, message, hp_confirm, timestamp } =
    validatedFields.data;

  // Silently accept bots — don't tip them off that they were caught.
  if (hp_confirm && hp_confirm.length > 0) return { success: true };

  if (timestamp && Date.now() - timestamp < 2000) {
    return { success: false, error: GENERIC_ERROR };
  }

  // Shared durable limiter. The concierge path is already limited at the route,
  // so only the form path pays this cost.
  if (source === 'Website Contact Form') {
    const hdrs = await headers();
    const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const allowed = await checkContactLimit(ip);
    if (!allowed) {
      return { success: false, error: 'Too many submissions at once — give it a minute.' };
    }
  }

  try {
    const crmEndpoint = process.env.CRM_TRIAGE_ENDPOINT;
    const crmPromise = crmEndpoint
      ? fetch(crmEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Confirmed CRM contract. client_name and email are the only
            // required fields; everything else is optional.
            client_name: name,
            email,
            company,
            phone,
            website,
            service_category: projectType,
            // The CRM has no budget column, so it rides along in the message.
            message: budget ? `Budget: ${budget}\n\n${message}` : message,
            // Server-set, never a user-facing field.
            lead_source: source,
          }),
        })
      : Promise.resolve(null);

    const notifyPromise = resend.emails.send({
      from: `TEKGUYZ <${site.publicEmail}>`,
      to: site.formDeliveryEmail,
      subject: `New ${source} Submission from ${name}`,
      replyTo: email,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || 'N/A'}`,
        `Phone: ${phone || 'N/A'}`,
        `Website: ${website || 'N/A'}`,
        `Project Type: ${projectType}`,
        `Budget: ${budget || 'N/A'}`,
        '',
        'Message:',
        message,
      ].join('\n'),
    });

    // Confirmation to the submitter. Transactional reply to a message they just
    // sent — no marketing footer, no unsubscribe block.
    const confirmPromise = resend.emails.send({
      from: `TEKGUYZ <${site.publicEmail}>`,
      to: email,
      subject: 'We got your message — TEKGUYZ',
      replyTo: site.formDeliveryEmail,
      text: [
        'Thanks for reaching out. Your message is in, and you’ll hear back from us within one business day.',
        '',
        "Here's what you sent us:",
        `${projectType} · ${message}`,
        '',
        'If you need to add anything, just reply to this email — it comes straight to us.',
        '',
        '— TEKGUYZ',
        `${site.publicEmail} · ${site.hours} · ${site.location}`,
      ].join('\n'),
    });

    const [crmResult, notifyResult, confirmResult] = await Promise.allSettled([
      crmPromise,
      notifyPromise,
      confirmPromise,
    ]);

    if (crmResult.status === 'rejected') {
      console.error('CRM Webhook error:', crmResult.reason);
    } else if (
      crmResult.status === 'fulfilled' &&
      crmResult.value &&
      'ok' in crmResult.value &&
      !crmResult.value.ok
    ) {
      console.error('CRM Webhook non-ok response:', crmResult.value.status);
    }

    // A failed confirmation must never fail the submission — the lead is
    // already captured at this point and the person did nothing wrong.
    if (confirmResult.status === 'rejected') {
      console.error('Confirmation email dispatch failed:', confirmResult.reason);
    } else if (confirmResult.status === 'fulfilled' && confirmResult.value.error) {
      console.error('Confirmation email error:', confirmResult.value.error);
    }

    // The internal notification is the one that decides success: if nobody at
    // TEKGUYZ hears about the lead, the submission genuinely did not go through.
    if (notifyResult.status === 'fulfilled') {
      const { error } = notifyResult.value;
      if (error) {
        console.error('Resend API error:', error);
        return { success: false, error: GENERIC_ERROR };
      }
      return { success: true };
    }

    console.error('Resend API dispatch failed:', notifyResult.reason);
    return { success: false, error: GENERIC_ERROR };
  } catch (error) {
    console.error('Contact form unexpected error:', error);
    return { success: false, error: GENERIC_ERROR };
  }
}
