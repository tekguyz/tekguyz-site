'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/button';
import { sendContactEmail } from '@/app/actions/contact';
import {
  interestOptions,
  detailsPlaceholder,
  DEFAULT_DETAILS_PLACEHOLDER,
  budgetOptions,
} from '@/content/solutions';
import { site } from '@/lib/site';
import { optionalPhone, optionalWebsite } from '@/lib/validation';

/**
 * Two steps, inside a bordered card: 1px hairline, 16px radius, 40px padding,
 * with a header row carrying the step title and an "01 / 02" counter over a
 * 24px-padded rule.
 *
 * Step 1 qualifies (interest, name, email); step 2 collects the detail. The
 * split exists so the first ask is three short fields rather than a wall.
 *
 * Area of Interest arrives pre-selected from a solution CTA's ?interest= param
 * and is SHOWN selected rather than hidden — the visitor should be able to see
 * and change what the link assumed about them.
 *
 * Both anti-bot measures are invisible: the honeypot — named hp_confirm, NEVER
 * `website`, which is a real CRM column — and a minimum fill time.
 */

const schema = z.object({
  projectType: z.string().min(1, 'Pick the closest match'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  company: z.string().optional(),
  // Same rules the server enforces — see lib/validation.ts. Optional means the
  // field may be blank, not that a filled value goes unchecked.
  phone: optionalPhone,
  website: optionalWebsite,
  message: z.string().min(10, 'Tell us a little more — at least 10 characters'),
  budget: z.string().optional(),
  // Not `.max(0)` on the client either: a client-side rule on a hidden field
  // makes handleSubmit fail silently and the request never reaches the server,
  // so the server's silent-accept path would never actually run.
  hp_confirm: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const field =
  'w-full h-11 px-3 rounded-[4px] border border-border bg-transparent text-[1rem] ' +
  'outline-none transition-colors duration-[240ms] focus-visible:border-border-strong';

const label =
  'block mb-[10px] text-[0.75rem] font-bold tracking-[0.1em] uppercase leading-[1.4] text-secondary';

export function ContactForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2>(1);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const mountedAt = useRef(Date.now());
  const step2Ref = useRef<HTMLDivElement>(null);

  const presetInterest = useMemo(() => {
    const slug = searchParams.get('interest');
    if (!slug) return '';
    return interestOptions.find((o) => o.slug === slug)?.value ?? '';
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { projectType: presetInterest },
  });

  useEffect(() => {
    if (presetInterest) setValue('projectType', presetInterest);
  }, [presetInterest, setValue]);

  const interest = watch('projectType');
  const placeholder = detailsPlaceholder[interest] ?? DEFAULT_DETAILS_PLACEHOLDER;

  async function goToStep2() {
    const ok = await trigger(['projectType', 'name', 'email']);
    if (ok) setStep(2);
  }

  // Focus into step 2 once it has actually rendered, so a keyboard user isn't
  // dropped back to <body>. A rAF after setStep fires before React commits.
  useEffect(() => {
    if (step === 2) step2Ref.current?.querySelector('input')?.focus();
  }, [step]);

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const result = await sendContactEmail({ ...values, timestamp: mountedAt.current });
    if (result.success) setSent(true);
    else setServerError(result.error ?? 'Something went wrong.');
  }

  return (
    <div className="rounded-[16px] border border-border p-10">
      {sent ? (
        <div role="status">
          <div className="flex items-center gap-2 text-[0.875rem] leading-[1.55] tracking-[0.04em]">
            <span
              aria-hidden
              className="h-[6px] w-[6px] flex-none rounded-full"
              style={{ background: 'var(--tg-success)' }}
            />
            <span className="font-semibold">Message sent</span>
          </div>
          <p className="mt-[14px] text-[length:var(--text-body)] text-secondary">
            We&rsquo;ll reply within one business day.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Honeypot. Deliberately NOT named `website` — that is a real CRM
              column, and the collision silently dropped legitimate leads. */}
          <div aria-hidden className="absolute h-px w-px overflow-hidden opacity-0">
            <label htmlFor="hp_confirm">Leave this field empty</label>
            <input
              id="hp_confirm"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register('hp_confirm')}
            />
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
            <p className="text-[length:var(--text-title)] leading-[1.2] font-semibold tracking-[-0.02em]">
              {step === 1 ? 'What do you need?' : 'Tell us more.'}
            </p>
            <span className="text-[0.875rem] tracking-[0.04em] tabular-nums text-secondary">
              0{step} / 02
            </span>
          </div>

          {/* The `key` on each step is load-bearing, not decoration. Without it
              React reconciles the two branches of this ternary in place: both
              render a <div> at the same position, so the <input> at index 1
              becomes phone and the one at index 2 becomes website — the SAME DOM
              nodes that were name and email, still holding their uncontrolled
              values. That is what looked like browser autofill leaking across
              steps. Distinct keys force a real unmount/mount, so step 2 gets
              fresh, empty inputs. React Hook Form keeps the values it already
              collected (shouldUnregister is false), so Back still restores them. */}
          {step === 1 ? (
            <div key="step-1" className="mt-8 flex flex-col gap-6">
              <div>
                <label htmlFor="projectType" className={label}>
                  Area of Interest
                </label>
                <select
                  id="projectType"
                  className={field}
                  autoComplete="off"
                  {...register('projectType')}
                >
                  <option value="">Select one</option>
                  {interestOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.value}
                    </option>
                  ))}
                </select>
                {errors.projectType && <FieldError>{errors.projectType.message}</FieldError>}
              </div>

              <div>
                <label htmlFor="name" className={label}>
                  Name
                </label>
                <input
                  id="name"
                  className={field}
                  placeholder="Your name"
                  autoComplete="name"
                  {...register('name')}
                />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </div>

              <div>
                <label htmlFor="email" className={label}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={field}
                  placeholder="you@company.com"
                  autoComplete="email"
                  {...register('email')}
                />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </div>

              <Button type="button" size="form" onClick={goToStep2} className="mt-2 self-start">
                Continue
              </Button>
            </div>
          ) : (
            <div key="step-2" ref={step2Ref} className="mt-8 flex flex-col gap-6">
              <div>
                <label htmlFor="company" className={label}>
                  Company <Optional />
                </label>
                <input
                  id="company"
                  className={field}
                  placeholder="Company name"
                  autoComplete="organization"
                  {...register('company')}
                />
              </div>

              <div>
                <label htmlFor="phone" className={label}>
                  Phone <Optional />
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={field}
                  placeholder="(xxx) xxx-xxxx"
                  autoComplete="tel"
                  aria-describedby="phone-hint"
                  aria-invalid={errors.phone ? true : undefined}
                  {...register('phone')}
                />
                {errors.phone ? (
                  <FieldError>{errors.phone.message}</FieldError>
                ) : (
                  <p id="phone-hint" className="mt-2 text-[0.75rem] text-secondary">
                    A second way to reach you, in case email&rsquo;s slow on your end.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="website" className={label}>
                  Website <Optional />
                </label>
                {/* Stays type="text". lib/validation.ts deliberately accepts a
                    bare `tekguyz.com`, which type="url" would reject as
                    malformed — inputMode gives the same mobile keyboard without
                    importing a second, stricter rule the schema doesn't share. */}
                <input
                  id="website"
                  className={field}
                  placeholder="yoursite.com"
                  autoComplete="url"
                  inputMode="url"
                  aria-invalid={errors.website ? true : undefined}
                  {...register('website')}
                />
                {errors.website && <FieldError>{errors.website.message}</FieldError>}
              </div>

              <div>
                <label htmlFor="message" className={label}>
                  Project details
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className={`${field} h-auto resize-y py-3 leading-[1.6]`}
                  placeholder={placeholder}
                  autoComplete="off"
                  {...register('message')}
                />
                {errors.message && <FieldError>{errors.message.message}</FieldError>}
              </div>

              <div>
                <label htmlFor="budget" className={label}>
                  Estimated budget <Optional />
                </label>
                <select
                  id="budget"
                  className={`${field} tabular-nums`}
                  autoComplete="off"
                  {...register('budget')}
                >
                  <option value="">Select one</option>
                  {budgetOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {serverError && (
                <p role="alert" className="text-[0.875rem]" style={{ color: 'var(--tg-error)' }}>
                  {serverError} Or email us directly at{' '}
                  <a href={`mailto:${site.publicEmail}`} className="link-underline">
                    {site.publicEmail}
                  </a>
                  .
                </p>
              )}

              <div className="mt-2 flex items-center gap-6">
                <Button type="button" variant="secondary" size="nav" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" size="form" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send Inquiry'}
                </Button>
              </div>

              <p className="text-[0.875rem] leading-[1.55] text-secondary">
                We reply within one business day.
              </p>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

function Optional() {
  return (
    <span className="font-normal tracking-normal normal-case text-secondary">(optional)</span>
  );
}

function FieldError({ children }: { children?: React.ReactNode }) {
  return (
    <p role="alert" className="mt-2 text-[0.875rem]" style={{ color: 'var(--tg-error)' }}>
      {children}
    </p>
  );
}
