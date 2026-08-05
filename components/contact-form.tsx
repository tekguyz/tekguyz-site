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

/**
 * COPY.md — two steps.
 *
 * Step 1 qualifies (interest, name, email); step 2 collects the detail. The
 * split exists so the first ask is three short fields rather than a wall.
 *
 * The Area of Interest arrives pre-selected from a solution CTA's
 * ?interest= param, and is SHOWN selected rather than hidden — the visitor
 * should be able to see and change what the link assumed about them.
 *
 * Both anti-bot measures are invisible: the honeypot (named hp_confirm, NEVER
 * `website`, which is a real CRM column) and a minimum fill time.
 */

const schema = z.object({
  projectType: z.string().min(1, 'Pick the closest match'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  message: z.string().min(10, 'Tell us a little more — at least 10 characters'),
  budget: z.string().optional(),
  hp_confirm: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  'h-11 w-full rounded-[4px] border border-border bg-transparent px-3 text-[0.9375rem] ' +
  'outline-none transition-colors duration-[var(--dur-base)] focus-visible:border-border-strong';

const labelClass = 'mb-2 block text-[0.875rem] text-secondary';

export function ContactForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2>(1);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const mountedAt = useRef(Date.now());
  const step2Ref = useRef<HTMLFieldSetElement>(null);

  // Map ?interest=custom-web-apps -> the matching option value.
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

  // Move focus into step 2 once it has actually rendered, so a keyboard user
  // isn't dropped back to <body> and forced to tab from the top of the page.
  // A rAF after setStep fires before React commits, which left focus on body.
  useEffect(() => {
    if (step === 2) step2Ref.current?.querySelector('input')?.focus();
  }, [step]);

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const result = await sendContactEmail({ ...values, timestamp: mountedAt.current });
    if (result.success) {
      setSent(true);
    } else {
      setServerError(result.error ?? 'Something went wrong.');
    }
  }

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-[12px] border border-border bg-surface p-8"
      >
        <p className="flex items-center gap-3 text-[length:var(--text-title)] font-semibold">
          <span
            aria-hidden
            className="h-[8px] w-[8px] flex-none rounded-full"
            style={{ background: 'var(--tg-success)' }}
          />
          Message sent.
        </p>
        <p className="mt-3 text-[length:var(--text-body)] text-secondary">
          We&rsquo;ll reply within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot. Deliberately NOT named `website` — that is a real CRM column,
          and the collision silently dropped legitimate leads as suspected bots. */}
      <div aria-hidden className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="hp_confirm">Leave this field empty</label>
        <input id="hp_confirm" type="text" tabIndex={-1} autoComplete="off" {...register('hp_confirm')} />
      </div>

      <ol className="m-0 mb-8 flex list-none items-center gap-3 p-0 font-mono text-[0.75rem] tracking-[0.1em] text-secondary uppercase">
        <li style={{ color: step === 1 ? 'var(--tg-fg)' : undefined }}>01 What you need</li>
        <li aria-hidden>—</li>
        <li style={{ color: step === 2 ? 'var(--tg-fg)' : undefined }}>02 Tell us more</li>
      </ol>

      {step === 1 ? (
        <fieldset className="m-0 border-0 p-0">
          <legend className="sr-only">What do you need?</legend>

          <div className="mb-6">
            <label htmlFor="projectType" className={labelClass}>
              Area of Interest
            </label>
            <select id="projectType" className={inputClass} {...register('projectType')}>
              <option value="">Select one</option>
              {interestOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.value}
                </option>
              ))}
            </select>
            {errors.projectType && <FieldError>{errors.projectType.message}</FieldError>}
          </div>

          <div className="mb-6">
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input id="name" className={inputClass} placeholder="Your name" {...register('name')} />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </div>

          <div className="mb-8">
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={inputClass}
              placeholder="you@company.com"
              {...register('email')}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </div>

          <Button type="button" onClick={goToStep2}>
            Continue
          </Button>
        </fieldset>
      ) : (
        <fieldset ref={step2Ref} className="m-0 border-0 p-0">
          <legend className="sr-only">Tell us more</legend>

          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="company" className={labelClass}>
                Company <span className="text-secondary">(optional)</span>
              </label>
              <input
                id="company"
                className={inputClass}
                placeholder="Company name"
                {...register('company')}
              />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone <span className="text-secondary">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                className={inputClass}
                placeholder="(xxx) xxx-xxxx"
                aria-describedby="phone-hint"
                {...register('phone')}
              />
              <p id="phone-hint" className="mt-2 text-[0.75rem] text-secondary">
                A second way to reach you, in case email&rsquo;s slow on your end.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="website" className={labelClass}>
              Website <span className="text-secondary">(optional)</span>
            </label>
            <input
              id="website"
              className={inputClass}
              placeholder="yoursite.com"
              {...register('website')}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className={labelClass}>
              Project details
            </label>
            <textarea
              id="message"
              rows={5}
              className={`${inputClass} h-auto resize-y py-3`}
              placeholder={placeholder}
              {...register('message')}
            />
            {errors.message && <FieldError>{errors.message.message}</FieldError>}
          </div>

          <div className="mb-8">
            <label htmlFor="budget" className={labelClass}>
              Estimated budget <span className="text-secondary">(optional)</span>
            </label>
            <select id="budget" className={inputClass} {...register('budget')}>
              <option value="">Select one</option>
              {budgetOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {serverError && (
            <p role="alert" className="mb-6 text-[0.875rem]" style={{ color: 'var(--tg-error)' }}>
              {serverError} Or email us directly at{' '}
              <a href={`mailto:${site.publicEmail}`} className="link-underline">
                {site.publicEmail}
              </a>
              .
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send Inquiry'}
            </Button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="link-underline text-[0.875rem] text-secondary hover:text-fg"
            >
              Back
            </button>
          </div>

          <p className="mt-4 text-[0.875rem] text-secondary">
            We reply within one business day.
          </p>
        </fieldset>
      )}
    </form>
  );
}

function FieldError({ children }: { children?: React.ReactNode }) {
  return (
    <p role="alert" className="mt-2 text-[0.875rem]" style={{ color: 'var(--tg-error)' }}>
      {children}
    </p>
  );
}
