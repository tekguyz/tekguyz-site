import { cn } from '@/lib/utils';
import { SignatureStripe } from '@/components/signature-stripe';

/**
 * DESIGN.md §4 — top-of-page treatment for every inner route: /solutions (the
 * index), each /solutions/[slug] detail page, /work, /process, /contact, and
 * /privacy.
 *
 * Eyebrow -> headline at --text-display (NOT hero scale) -> one-line
 * description at --text-body, muted, capped around 60ch.
 *
 * No media, no flourish-mark — that stays home-only. Left-anchored, like
 * everything on the site except the closing CTA.
 */
export function PageHero({
  eyebrow,
  headline,
  description,
  className,
}: {
  eyebrow: string;
  headline: string;
  description?: string;
  className?: string;
}) {
  return (
    <>
      {/* Stripe 1 of the three every page carries. The home hero renders its own;
          every inner route gets it here, so the count can't drift per page. */}
      <SignatureStripe />
      <section className={cn('pt-32 pb-16 md:pt-32', className)}>
        <div className="tg-container">
          <p className="reveal mb-5 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
            {eyebrow}
          </p>
          <h1 className="reveal max-w-[18ch] text-[length:var(--text-display)] leading-[1.05] font-bold tracking-[-0.03em]">
            {headline}
          </h1>
          {description && (
            <p className="reveal mt-6 max-w-[60ch] text-[length:var(--text-body)] text-secondary">
              {description}
            </p>
          )}
        </div>
      </section>
    </>
  );
}

/**
 * The section head used inside pages: eyebrow + display headline on the left
 * (cols 1-7), description bottom-aligned on the right (cols 8-13). The
 * asymmetry and the baseline alignment are compositional choices confirmed
 * against the Claude Design reference, which DESIGN.md leaves open.
 */
export function SectionHead({
  eyebrow,
  headline,
  description,
}: {
  eyebrow: string;
  headline: string;
  description?: string;
}) {
  return (
    <div className="tg-container tg-grid">
      <div className="reveal" style={{ gridColumn: '1 / 7' }}>
        <p className="mb-5 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
          {eyebrow}
        </p>
        <h2 className="text-[length:var(--text-display)] leading-[1.05] font-bold tracking-[-0.03em]">
          {headline}
        </h2>
      </div>
      {description && (
        <div className="reveal flex items-end" style={{ gridColumn: '8 / 13' }}>
          <p className="max-w-[46ch] text-[length:var(--text-body)] text-secondary">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
