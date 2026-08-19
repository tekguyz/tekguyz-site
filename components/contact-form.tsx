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
import { useForm, useWatch } from 'react-hook-form';
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

/* A <select>'s popup list is painted by the browser, and Chrome takes its fill
   from the control's own computed background-color. `bg-transparent` therefore
   resolves to the platform default — pure white — while the option text still
   inherits --tg-fg, so in dark mode the list read as a blank white box until a
   row was highlighted. The fill has to be a real colour, and the options need
   it declared on them too. `bg-bg` is what sits behind the control anyway
   (nothing between the select and <body> paints a background), so the closed
   control is unchanged in both themes. */
const selectField =
  `${field.replace('bg-transparent', 'bg-bg')} [&>option]:bg-bg [&>option]:text-fg`;

const labelClass =
  'block mb-[10px] tg-eyebrow text-secondary';

export function ContactForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2>(1);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  /*
   * The bot fill-time stamp — `app/actions/contact.ts:191` rejects a submission
   * that arrives under 2000ms after this. A lazy `useState` initializer, NOT
   * `useRef(Date.now())`: `useRef`'s argument is evaluated on every render, so
   * calling `Date.now()` there is an impure call during render
   * (`react-hooks/purity`). The lazy initializer runs exactly once. Same value,
   * same lifetime — and it is now a plain number rather than a ref, which is
   * also what stops `handleSubmit(onSubmit)` from being flagged for reading a
   * ref during render (`react-hooks/refs`), since `onSubmit` closed over it.
   */
  const [mountedAt] = useState(() => Date.now());
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
    control,
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

  /*
   * `useWatch`, not `watch`. `watch` is a function `useForm()` hands back fresh
   * on every render, so the React Compiler cannot memoize this component while
   * it is called here — that was the repo's one remaining lint warning
   * (`react-hooks/incompatible-library`), and the compiler's answer to it is to
   * silently skip optimising the file. `useWatch` is RHF's own subscription
   * hook: it returns the VALUE, subscribes only to `projectType`, and re-renders
   * only this component.
   *
   * This does not touch the step-1/step-2 reconciliation. The only consumer is
   * the details placeholder below; the field registration, the `key` discipline
   * that fixed the field-contamination bug, and the schema are all unchanged.
   */
  const interest = useWatch({ control, name: 'projectType' });
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
    const result = await sendContactEmail({ ...values, timestamp: mountedAt });
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
              <Field id="projectType" label="Area of Interest" error={errors.projectType?.message}>
                <select
                  id="projectType"
                  className={selectField}
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
              </Field>

              <Field id="name" label="Name" error={errors.name?.message}>
                <input
                  id="name"
                  className={field}
                  placeholder="Your name"
                  autoComplete="name"
                  {...register('name')}
                />
              </Field>

              <Field id="email" label="Email" error={errors.email?.message}>
                <input
                  id="email"
                  type="email"
                  className={field}
                  placeholder="you@company.com"
                  autoComplete="email"
                  {...register('email')}
                />
              </Field>

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
              <Field id="company" label="Company" optional>
                <input
                  id="company"
                  className={field}
                  placeholder="Company name"
                  autoComplete="organization"
                  {...register('company')}
                />
              </Field>

              {/* The hint is passed to Field, which renders it with
                  id="phone-hint" ONLY while there is no error — the hint
                  element is REPLACED by the error, not stacked above it. That
                  is why aria-describedby below is conditional and stays at this
                  call site rather than being derived inside Field: an
                  unconditional value dangles at exactly the moment a
                  screen-reader user most needs the description to resolve. When
                  the error is showing, FieldError's role="alert" is what
                  announces, so there is nothing to re-point this at. */}
              <Field
                id="phone"
                label="Phone"
                optional
                error={errors.phone?.message}
                hint={<>A second way to reach you, in case email&rsquo;s slow on your end.</>}
              >
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
              </Field>

              <Field id="website" label="Website" optional error={errors.website?.message}>
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
              </Field>

              <Field id="message" label="Project details" error={errors.message?.message}>
                <textarea
                  id="message"
                  rows={5}
                  className={`${field} h-auto resize-y py-3 leading-[1.6]`}
                  placeholder={placeholder}
                  autoComplete="off"
                  {...register('message')}
                />
              </Field>

              <Field id="budget" label="Estimated budget" optional>
                <select
                  id="budget"
                  className={`${selectField} tabular-nums`}
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
              </Field>

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

/**
 * The label / control / error triple, local to this file — eight uses, one
 * consumer, so it deliberately is NOT a shared component.
 *
 * What it owns: the wrapper <div>, the <label>, the `(optional)` marker, and
 * the one slot below the control that holds EITHER the error OR the hint. The
 * hint is rendered only while `error` is absent, because the two swap rather
 * than stack — see the phone call site.
 *
 * What it deliberately does NOT own: `aria-invalid` and `aria-describedby`.
 * Those stay on the controls at the call sites. Deriving them here would make
 * every field carry them uniformly, which is a behaviour change, and it would
 * bury `aria-describedby`'s conditional — the exact wiring whose whole point is
 * that it must vanish the moment the element it points at is replaced.
 *
 * It also owns no `key`. The `key="step-1"` / `key="step-2"` discipline lives
 * on the step branches above and must stay there: it forces a real
 * unmount/mount so step 2 does not inherit step 1's uncontrolled inputs.
 */
function Field({
  id,
  label,
  optional,
  error,
  hint,
  children,
}: {
  id: string;
  label: React.ReactNode;
  optional?: boolean;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {optional ? <> <Optional /></> : null}
      </label>
      {children}
      {error ? (
        <FieldError>{error}</FieldError>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-[0.75rem] text-secondary">
          {hint}
        </p>
      ) : null}
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
