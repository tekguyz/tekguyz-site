/* The dot + label + body triplet that reports the outcome of a lead-capture
   attempt. Three call sites render it: the contact form's success state and
   the concierge's captured and error states.

   It is the CONTENTS only, not the wrapper. The three wrappers genuinely
   differ — the contact form's carries the focus target that announces the
   success (`ref`/`role`/`aria-live`/`tabIndex`), the concierge's carry the
   rule that separates the outcome from the message list — and folding those
   into props would trade one duplication for a wider, vaguer surface. */
type Tone = 'success' | 'error';

const TONE_VAR: Record<Tone, string> = {
  success: 'var(--tg-success)',
  error: 'var(--tg-error)',
};

export function OutcomeBlock({
  tone,
  label,
  message,
  bodyClassName = 'text-[0.875rem] leading-[1.55]',
}: {
  tone: Tone;
  label: React.ReactNode;
  message: React.ReactNode;
  /* The contact form sets its body at `--text-body`; the concierge panel runs
     one step down at 0.875rem. Same block, two densities — not a default to
     unify without a design decision behind it. */
  bodyClassName?: string;
}) {
  return (
    <>
      <div className="flex items-center gap-2 text-[0.875rem] leading-[1.55] tracking-[0.04em]">
        <span
          aria-hidden
          className="h-[6px] w-[6px] flex-none rounded-full"
          style={{ background: TONE_VAR[tone] }}
        />
        <span className="font-semibold">{label}</span>
      </div>
      <p className={`mt-[14px] ${bodyClassName} text-secondary`}>{message}</p>
    </>
  );
}
