'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEventHandler,
  type CSSProperties,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/button';
import { OutcomeBlock } from '@/components/outcome-block';
import { sendContactEmail } from '@/app/actions/contact';
import {
  interestOptions,
  detailsPlaceholder,
  DEFAULT_DETAILS_PLACEHOLDER,
  budgetOptions,
} from '@/content/solutions';
import { site } from '@/lib/site';
import {
  capPhoneDigits,
  isUiCopy,
  optionalPhone,
  optionalWebsite,
  personName,
} from '@/lib/validation';

/**
 * Two steps, inside a bordered card: 1px hairline, 16px radius, 40px padding —
 * 24px below `sm`, see the step header below — with a header row carrying the
 * step title and an "01 / 02" counter over a 24px-padded rule.
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
  // Shape as well as length. A 160-character block of scraped page prose used
  // to pass as a name, because neither this schema nor the CRM checked for it.
  name: personName,
  email: z.email('Please enter a valid email address'),
  company: z.string().optional(),
  // Same rules the server enforces — see lib/validation.ts. Optional means the
  // field may be blank, not that a filled value goes unchecked.
  phone: optionalPhone,
  website: optionalWebsite,
  /**
   * Still required of a person, and still 10 characters — the server is looser
   * here on purpose (it accepts blank), because it also serves the concierge
   * and anything that bypasses this form. The boilerplate refusal is the half
   * that has to hold on BOTH sides: the placeholder never reaches the CRM as
   * content, and a human who somehow pasted the page copy in gets told so here
   * rather than having it silently stripped after they hit send.
   */
  message: z
    .string()
    .min(10, 'Tell us a little more — at least 10 characters')
    .refine((v) => !isUiCopy(v), {
      message: 'Tell us in your own words — that text is from this page.',
    }),
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
  'block mb-[10px] tg-eyebrow text-secondary';

export function ContactForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2>(1);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const mountedAt = useRef(Date.now());
  const step2Ref = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

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

  // Real-time cap on the phone field. The input is uncontrolled (RHF), so the
  // guard rewrites the event's own value before handing it to RHF's onChange —
  // no second source of truth, and no controlled-input caret jump.
  const phoneField = register('phone');
  const onPhoneChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const capped = capPhoneDigits(e.target.value);
    if (capped !== e.target.value) e.target.value = capped;
    return phoneField.onChange(e);
  };

  async function goToStep2() {
    const ok = await trigger(['projectType', 'name', 'email']);
    if (ok) setStep(2);
  }

  // Focus into step 2 once it has actually rendered, so a keyboard user isn't
  // dropped back to <body>. A rAF after setStep fires before React commits.
  useEffect(() => {
    if (step === 2) step2Ref.current?.querySelector('input')?.focus();
  }, [step]);

  // See the D-03 note on the success block for why this is a focus move rather
  // than a scroll: the scroll is a side effect of it, not the point.
  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const result = await sendContactEmail({ ...values, timestamp: mountedAt.current });
    if (result.success) setSent(true);
    else setServerError(result.error ?? 'Something went wrong.');
  }

  return (
    // 40px of card padding is 22% of a 360px viewport. Dropping it to 24 below
    // `sm` is where the 30px the step header is short actually comes from; the
    // step-header comment below has the arithmetic.
    <div className="rounded-[16px] border border-border p-10 max-sm:p-6">
      {sent ? (
        /* D-03. Submitting unmounts the form, so the focused Send button goes
           with it and focus falls to <body>; the next Tab — or Chrome's own
           "resume from where the document is" behaviour — lands on the first
           FAQ trigger, which is far enough down the page that the success
           message the visitor just earned is off screen above and never read.
           Moving focus here is what fixes both halves at once: it scrolls the
           message into view and it is what a screen reader announces.

           On whether this was announced before: it was already in a live
           region — `role="status"` carries an implicit
           `aria-live="polite"`. It just could not be relied on, because the
           region and its content mount in the same commit and a live region
           announces CHANGES to a region that was already there. `aria-live` is
           now explicit for the same reason it always should be, but the focus
           move is the mechanism that actually guarantees it is heard. */
        <div ref={successRef} role="status" aria-live="polite" tabIndex={-1}>
          <OutcomeBlock
            tone="success"
            label="Message sent"
            bodyClassName="text-[length:var(--text-body)]"
            message="Thank you for taking the time to walk us through this. A real person reads every submission; expect a reply within one business day."
          />
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

          {/* M-07 + M-08, and they are ONE defect with one arithmetic behind
              it. The row is title + counter + a 16px gap inside the card's
              content box. At 360 that box is 230.4px and the row needs
              193 + 16 + 51.3 = 260.3px, so flexbox shrinks both children and
              both wrap: `01 /` over `02`, and `need?` onto a second line. The
              same sum is 0.3px short at 390 and clears comfortably from 414 up,
              which is exactly the width where the reported symptom stops.

              Both changes are scoped `max-sm` (below 640px) so 767, 768 and 844
              — the rows Prompt 8 fixed — are not in the query at all and stay
              byte-identical. `whitespace-nowrap` on the counter is not the fix
              on its own: it makes "01 / 02" one atom, which without the room
              below would just push the whole deficit onto the title. */}
          {/* The step rail. This header already ended in a hairline, so the
              progress indicator IS that hairline drawing to 50% and then to
              100% — the same `.tg-rule` primitive as the nav's current-page
              bar, not a second progress mechanism bolted on. `data-on` gives
              it the persistent ink weight; the inline custom property says how
              far. Inline beats `.tg-rule:hover`, so pointing at the header
              cannot make the rail claim a step the visitor has not reached.

              Deliberately on the HEADER and not on the step branches: the
              `key` discipline below is what keeps step 1's inputs from
              becoming step 2's, and nothing here touches it. */}
          <div
            data-on="true"
            style={{ '--tg-rule-scale': step === 1 ? 0.5 : 1 } as CSSProperties}
            className="tg-rule flex items-center justify-between gap-4 border-b border-border pb-6 max-sm:gap-3"
          >
            <p className="text-[length:var(--text-title)] leading-[1.2] font-semibold tracking-[-0.02em]">
              {step === 1 ? 'What do you need?' : 'Tell us more.'}
            </p>
            <span className="text-[0.875rem] tracking-[0.04em] whitespace-nowrap tabular-nums text-secondary">
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

              {/* `data-primary-cta` is the concierge launcher's yield target.
                  `/contact` had none, so the launcher never yielded on the
                  site's highest-value conversion surface. Step 1's `Continue`
                  and step 2's `Send Inquiry` are the same slot at different
                  times — the two steps are exclusive branches, so exactly one
                  is ever in the DOM and the observer only ever sees one. */}
              <Button
                type="button"
                size="form"
                onClick={goToStep2}
                className="mt-2 self-start"
                data-primary-cta
              >
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
                {/* aria-describedby is conditional because the hint element it
                    points at is REPLACED by the error, not stacked above it —
                    an unconditional value dangles at exactly the moment a
                    screen-reader user most needs the description to resolve.
                    When the error is showing, FieldError's role="alert" is what
                    announces, so there is nothing to re-point this at. */}
                <input
                  id="phone"
                  type="tel"
                  className={field}
                  placeholder="(xxx) xxx-xxxx"
                  autoComplete="tel"
                  aria-describedby={errors.phone ? undefined : 'phone-hint'}
                  aria-invalid={errors.phone ? true : undefined}
                  {...phoneField}
                  onChange={onPhoneChange}
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
                  <a href={`mailto:${site.publicEmail}`} className="tap-24 link-underline">
                    {site.publicEmail}
                  </a>
                  .
                </p>
              )}

              <div className="mt-2 flex items-center gap-6">
                <Button type="button" variant="secondary" size="nav" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" size="form" disabled={isSubmitting} data-primary-cta>
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
