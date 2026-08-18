'use server';

import { createHmac } from 'node:crypto';
import { Resend } from 'resend';
import { z } from 'zod';
import { after } from 'next/server';
import { headers } from 'next/headers';
import { site } from '@/lib/site';
import { checkContactLimit } from '@/lib/rate-limit';
import { optionalPhone, optionalWebsite, personName, stripUiCopy } from '@/lib/validation';
import {
  archiveFailedLead,
  LEAD_FAILURE_MARKER,
  LEAD_HONEYPOT_MARKER,
  type LeadFailureStage,
} from '@/lib/lead-archive';

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
 *
 * ---------------------------------------------------------------------------
 * WHAT THE VISITOR WAITS FOR, AND WHAT THEY DON'T (2026-08-11)
 *
 * Measured against production: 7.36s to return, with every dependency awaited.
 * Most of that is the CRM endpoint, which takes 2–5s because it awaits its own
 * Gemini spam-shield call and its own Resend send before responding. None of
 * that gets faster from this side, so none of it is waited on from this side.
 *
 * The action now returns as soon as validation and the rate limit have run, and
 * the CRM write plus both emails happen in `after()`. Two rules fall out of
 * that, and both are load-bearing:
 *
 *  1. THE RESULT DEPENDS ON VALIDATION AND THE RATE LIMIT ONLY. It previously
 *     returned { success: false } whenever the internal notification errored —
 *     even when the CRM write had already succeeded. That inverts the priority:
 *     the CRM row IS the lead, email is a notification about it. And because
 *     the CRM upserts BY EMAIL, a visitor told to try again does not create a
 *     duplicate — they OVERWRITE their own captured enquiry with a second,
 *     usually shorter attempt. Failing on a notification failure was destroying
 *     the very thing it was reporting on.
 *
 *  2. EVERY FAILURE INSIDE after() IS RECORDED TWICE. The visitor is already
 *     gone by then, so an unlogged failure is a lead that exists nowhere. Each
 *     one emits a greppable marker carrying the submitter's email and an ISO
 *     timestamp, AND persists the full payload to Upstash (lib/lead-archive).
 *
 * The CRM write fires EXACTLY ONCE and is never retried, for the upsert reason
 * above: a retry from stale data can overwrite a row a later submission fixed.
 * There is no queue and no job runner — after() plus one Upstash write is the
 * whole mechanism.
 * ---------------------------------------------------------------------------
 */

/**
 * Constructed lazily, NOT at module scope.
 *
 * `new Resend(undefined)` throws "Missing API key" on construction. At module
 * scope that means merely importing this file explodes when the key is absent —
 * which is exactly what happens during a build, since Next collects page data
 * for every route that imports the action. The build broke on Vercel for this
 * reason while passing locally, purely because .env.local existed here.
 *
 * A build must never require runtime secrets. Deferring construction to the
 * first send keeps the failure at the point where it is genuinely actionable.
 */
let resendClient: Resend | null = null;
function resend(): Resend {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY is not set');
    resendClient = new Resend(key);
  }
  return resendClient;
}

const contactSchema = z.object({
  /**
   * Shape-checked, not just length-checked. The CRM enforces nothing on
   * client_name, which is how 160 characters of scraped page prose became a
   * lead's name. Rule in lib/validation.ts, shared with the client schema.
   */
  name: personName,
  email: z.email('Please enter a valid email address'),
  company: z.string().optional(),
  /**
   * Optional means "may be blank", not "unchecked when present". Both of these
   * previously accepted any string, so garbage reached the CRM as a real value.
   * Rules live in lib/validation.ts so this and the client schema can't drift.
   */
  phone: optionalPhone,
  /** The lead's own business site — a REAL CRM column, not the honeypot. */
  website: optionalWebsite,
  projectType: z.string().min(1, 'Please select a project type'),
  budget: z.string().optional(),
  /**
   * Optional HERE, min 10 on the client — a deliberate asymmetry, and the one
   * direction of drift this file's own rules allow.
   *
   * Incoming copy is run through stripUiCopy first, so a message that was
   * nothing but scraped page prose arrives blank. Blank must then be ACCEPTED
   * and omitted from the CRM payload, not rejected: message is optional to the
   * CRM, and the alternative is telling a visitor their submission failed over
   * a field they never filled in. The client still asks a real person for at
   * least 10 characters, so this looseness is only ever reached by a caller
   * that bypassed the form.
   */
  message: z
    .string()
    .optional()
    .refine((v) => v === undefined || v.trim() === '' || v.trim().length >= 10, {
      message: 'Message must be at least 10 characters',
    }),
  /**
   * Honeypot. Deliberately not a real CRM field name.
   *
   * NOT `.max(0)`. The ported code declared it that way, which meant a filled
   * honeypot failed schema parsing and returned "Invalid fields" — so the
   * silent-accept branch below was unreachable dead code, and a bot got a clear
   * signal that it had been caught. Parsing accepts any value; the explicit
   * check underneath is what does the work.
   */
  hp_confirm: z.string().optional(),
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
  /**
   * Strip site copy BEFORE validation, so a message that was only scraped prose
   * reduces to blank and takes the "absent" path rather than the "invalid" one.
   * Running it after would mean validating a string nobody typed.
   */
  const sanitized: ContactFormData = {
    ...data,
    name: typeof data.name === 'string' ? data.name.trim() : data.name,
    message: typeof data.message === 'string' ? stripUiCopy(data.message) : data.message,
  };

  const validatedFields = contactSchema.safeParse(sanitized);
  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields. Please check your input and try again.' };
  }

  const { name, email, company, phone, website, projectType, budget, message, hp_confirm, timestamp } =
    validatedFields.data;

  // Silently accept bots — report success, dispatch nothing. Anything that
  // looked like an error here would tell a bot exactly which field caught it.
  //
  // Silent to the BOT, not to us. This branch used to be invisible from the
  // outside: a false positive (a password manager or an accessibility tool
  // filling a hidden input) was indistinguishable from a real catch, because
  // both produced the same nothing. The marker below carries enough shape to
  // tell them apart — a bot fills the honeypot and pads the visible fields,
  // a mis-filled human still has a real name and a real message. The honeypot
  // VALUE is never logged, only its length; it is attacker-controlled text.
  if (hp_confirm && hp_confirm.trim().length > 0) {
    console.warn(
      `${LEAD_HONEYPOT_MARKER} at=${new Date().toISOString()} source="${source}" ` +
        `email=${email} hpLength=${hp_confirm.trim().length} nameLength=${name.length} ` +
        `messageLength=${message?.trim().length ?? 0} fillMs=${timestamp ? Date.now() - timestamp : 'n/a'}`,
    );
    return { success: true };
  }

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

  /**
   * Everything below happens after the response. Nothing in it can change what
   * the visitor is told — that decision is already made, one line down.
   */
  after(() => deliver({ name, email, company, phone, website, projectType, budget, message }, source));

  return { success: true };
}

interface LeadFields {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  website?: string;
  projectType: string;
  budget?: string;
  message?: string;
}

/**
 * The CRM payload, built once and shared by the write and the failure record —
 * so what gets archived on failure is literally what would have been sent, not
 * a second construction of it that could drift.
 *
 * Blank optional fields are OMITTED rather than sent empty. Under upsert-by-
 * email an empty string is a value: it would overwrite a phone number the CRM
 * already had with nothing.
 */
function crmPayload(lead: LeadFields, source: string): Record<string, string> {
  const message = lead.message?.trim() ?? '';
  const withBudget = lead.budget
    ? message
      ? `Budget: ${lead.budget}\n\n${message}`
      : `Budget: ${lead.budget}`
    : message;

  const payload: Record<string, string> = {
    // Confirmed CRM contract. client_name and email are the only required
    // fields; everything else is optional.
    client_name: lead.name,
    email: lead.email,
    service_category: lead.projectType,
    // Server-set, never a user-facing field.
    lead_source: source,
  };
  if (lead.company?.trim()) payload.company = lead.company.trim();
  if (lead.phone?.trim()) payload.phone = lead.phone.trim();
  if (lead.website?.trim()) payload.website = lead.website.trim();
  // The CRM has no budget column, so it rides along in the message.
  if (withBudget) payload.message = withBudget;
  return payload;
}

/** One place to record a post-response failure, so neither channel can be forgotten. */
async function recordFailure(
  stage: LeadFailureStage,
  lead: LeadFields,
  source: string,
  payload: unknown,
  error: unknown,
): Promise<void> {
  const at = new Date().toISOString();
  const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  console.error(
    `${LEAD_FAILURE_MARKER} stage=${stage} at=${at} email=${lead.email} source="${source}" ${detail}`,
  );
  await archiveFailedLead({ stage, at, source, email: lead.email, payload, error: detail });
}

/**
 * Runs inside after(). Never throws — a throw here is a failure with no record,
 * which is the one outcome this whole path exists to prevent.
 */
async function deliver(lead: LeadFields, source: string): Promise<void> {
  const payload = crmPayload(lead, source);
  // The CRM write and the emails are independent, and each records its own
  // failure. They are kicked off together and settled together — the two Resend
  // sends run in parallel with each other inside sendEmails.
  await Promise.all([sendToCrm(lead, source, payload), sendEmails(lead, source, payload)]);
}

/** The lead itself. One request, no retry — see the upsert note at the top. */
async function sendToCrm(
  lead: LeadFields,
  source: string,
  payload: Record<string, string>,
): Promise<void> {
  const crmEndpoint = process.env.CRM_TRIAGE_ENDPOINT;
  if (!crmEndpoint) {
    await recordFailure('crm', lead, source, payload, 'CRM_TRIAGE_ENDPOINT is not set');
    return;
  }

  /**
   * Read here, never at module scope, for the same reason as the Resend client
   * above: a build must pass with no secrets present.
   */
  const signingSecret = process.env.CRM_SIGNING_SECRET;
  if (!signingSecret) {
    await recordFailure('crm', lead, source, payload, 'CRM_SIGNING_SECRET is not set');
    return;
  }

  /**
   * SERIALIZED ONCE. This exact string is both what gets signed and what gets
   * sent, and those must be the same bytes — the CRM verifies the HMAC against
   * the raw request body it receives, before it parses anything.
   *
   * Building the object, signing JSON.stringify(obj), then handing `obj` to a
   * client that serializes it a second time is the standard way this breaks:
   * two serializations of the same value are not guaranteed byte-identical
   * (key order, whitespace, unicode escaping), and the mismatch fails 100% of
   * the time with a 401 rather than intermittently. Do not inline this back
   * into the fetch call.
   */
  const body = JSON.stringify(payload);
  const signature = createHmac('sha256', signingSecret).update(body, 'utf8').digest('hex');

  try {
    /**
     * The timeout is 20s against a measured 2–5s endpoint: generous enough that
     * it is never hit in normal operation, present so a hung socket cannot pin
     * the function open for its whole duration.
     */
    const response = await fetch(crmEndpoint, {
      method: 'POST',
      /**
       * The signature header is what authenticates this request (2026-08-18).
       * The CRM endpoint URL now carries only the organization id, which grants
       * nothing on its own — possession of the URL is no longer credential.
       *
       * This used to read "Content-Type only. The CRM's CORS allows no other
       * header, and a custom one fails preflight." That was wrong, and it was
       * the reason a custom header looked impossible: CORS and preflight are
       * BROWSER mechanisms. This is a server-side fetch from a Server Action —
       * no origin, no preflight, no CORS involvement of any kind. The CRM's
       * allowed-origin list has never applied to this call.
       */
      headers: {
        'Content-Type': 'application/json',
        'X-TekGuyz-Signature': signature,
      },
      body,
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      // 401 means the endpoint URL's org id or the signing secret is wrong —
      // most likely the secret was rotated in the CRM and not updated here. 429
      // is per-organization rather than per-IP, so the status is worth keeping.
      await recordFailure(
        'crm',
        lead,
        source,
        payload,
        `HTTP ${response.status}${
          response.status === 429
            ? ` (retry-after ${response.headers.get('retry-after') ?? 'unset'})`
            : ''
        }`,
      );
      return;
    }

    // Log the leadId, so a submission can be traced from this line to a CRM row
    // without opening the CRM.
    const leadId = await response
      .json()
      .then((body: { leadId?: string }) => body?.leadId ?? 'unreported')
      .catch(() => 'unparseable');
    console.info(
      `[contact] CRM accepted leadId=${leadId} email=${lead.email} source="${source}" at=${new Date().toISOString()}`,
    );
  } catch (error) {
    await recordFailure('crm', lead, source, payload, error);
  }
}

/** Notification and confirmation. Both are ABOUT the lead, never the lead itself. */
async function sendEmails(
  lead: LeadFields,
  source: string,
  payload: Record<string, string>,
): Promise<void> {
  const { name, email, company, phone, website, projectType, budget, message } = lead;

  try {
    const notifyPromise = resend().emails.send({
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
        message?.trim() || '(none given)',
      ].join('\n'),
    });

    // Confirmation to the submitter. Transactional reply to a message they just
    // sent — no marketing footer, no unsubscribe block.
    const confirmPromise = resend().emails.send({
      from: `TEKGUYZ <${site.publicEmail}>`,
      to: email,
      subject: 'We got your message — TEKGUYZ',
      replyTo: site.formDeliveryEmail,
      text: [
        'Thanks for reaching out. Your message is in, and you’ll hear back from us within one business day.',
        '',
        "Here's what you sent us:",
        message?.trim() ? `${projectType} · ${message.trim()}` : projectType,
        '',
        'If you need to add anything, just reply to this email — it comes straight to us.',
        '',
        '— TEKGUYZ',
        `${site.publicEmail} · ${site.hours} · ${site.location}`,
      ].join('\n'),
    });

    // The two sends run in parallel with each other, and neither can fail a
    // submission any more: by the time either settles the visitor has already
    // been told it went through, and it did.
    const [notifyResult, confirmResult] = await Promise.allSettled([
      notifyPromise,
      confirmPromise,
    ]);

    if (notifyResult.status === 'rejected') {
      await recordFailure('notify', lead, source, payload, notifyResult.reason);
    } else if (notifyResult.value.error) {
      await recordFailure('notify', lead, source, payload, notifyResult.value.error);
    } else {
      console.info(`[contact] notification sent id=${notifyResult.value.data?.id}`);
    }

    if (confirmResult.status === 'rejected') {
      await recordFailure('confirm', lead, source, payload, confirmResult.reason);
    } else if (confirmResult.value.error) {
      await recordFailure('confirm', lead, source, payload, confirmResult.value.error);
    } else {
      console.info(`[contact] confirmation sent id=${confirmResult.value.data?.id}`);
    }
  } catch (error) {
    // Reached when construction itself throws — a missing RESEND_API_KEY does
    // so before either promise exists to settle, taking both sends with it.
    await recordFailure('notify', lead, source, payload, error);
    await recordFailure('confirm', lead, source, payload, error);
  }
}
