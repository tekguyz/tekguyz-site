import { FlourishMark } from '@/components/flourish-mark';
import { SignatureStripe } from '@/components/signature-stripe';

/**
 * Top-of-page treatment for every inner route.
 *
 * Export layout: signature stripe, then a 96px/104px section with the flourish
 * dots, eyebrow and headline on cols 1-8 and the one-line description on cols
 * 9-13, both bottom-aligned (`align-items:end`).
 *
 * The headline is at HERO scale — clamp(2.5rem, 6vw, 4.5rem) — not the display
 * scale DESIGN.md's prose describes. The export is ground truth here.
 */
export function PageHero({
  eyebrow,
  headline,
  description,
  paddingBottom = 104,
}: {
  eyebrow: string;
  headline: string;
  description?: string;
  paddingBottom?: number;
}) {
  return (
    <>
      <SignatureStripe />
      <section style={{ paddingTop: 96, paddingBottom }}>
        <div className="tg-container tg-grid items-end">
          {/* 768–1023: the hero headline is single-column content at every width,
              so it takes all 8 tracks. A 12-track placement left here reaches past
              line 9 on an 8-track grid, which manufactures implicit tracks and
              squeezes the h1 into ~144px. */}
          <div className="[grid-column:1/8] max-lg:[grid-column:1/-1]">
            <FlourishMark className="mb-9" />
            <p className="mb-6 text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-secondary uppercase">
              {eyebrow}
            </p>
            <h1
              className="text-[length:var(--text-hero)] leading-[0.95] font-bold tracking-[-0.045em]"
              style={{ textWrap: 'pretty' }}
            >
              {headline}
            </h1>
          </div>
          {description && (
            <div className="[grid-column:9/13] max-lg:[grid-column:1/-1]">
              <p
                className="text-[length:var(--text-body)] text-secondary"
                style={{ textWrap: 'pretty' }}
              >
                {description}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/**
 * The in-page section head: eyebrow + display headline on cols 1-7, description
 * bottom-aligned on cols 8-13.
 */
export function SectionHead({
  eyebrow,
  headline,
  description,
  onInk = false,
}: {
  eyebrow: string;
  headline: string;
  description?: string;
  onInk?: boolean;
}) {
  const dim = onInk ? '#9CA3AF' : 'var(--tg-secondary)';
  return (
    <div className="tg-container tg-grid">
      <div className="[grid-column:1/7] max-lg:[grid-column:1/-1]">
        <p
          className="mb-5 text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] uppercase"
          style={{ color: dim }}
        >
          {eyebrow}
        </p>
        <h2
          className="text-[length:var(--text-display)] leading-[1.05] font-bold tracking-[-0.03em]"
          style={{ color: onInk ? '#F5F5F5' : 'var(--tg-fg)' }}
        >
          {headline}
        </h2>
      </div>
      {description && (
        <div className="flex items-end [grid-column:8/13] max-lg:[grid-column:1/-1]">
          <p className="text-[length:var(--text-body)]" style={{ color: dim }}>
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
