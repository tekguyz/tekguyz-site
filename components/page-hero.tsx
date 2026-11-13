/**
 * Inner-page hero, Seam form: the ink ground, where the problem and the promise
 * sit. The paper ground starts directly below it, on a straight seam.
 *
 * Headline in lettering at `--text-hero`. The eyebrow is kept as a small bold
 * label above it (the words are copy; Seam drops only the uppercase kicker
 * costume), and is skipped when it repeats the headline word for word.
 */
export function PageHero({
  eyebrow,
  headline,
  description,
  paddingBottom = 96,
}: {
  eyebrow: string;
  headline: string;
  description?: string;
  paddingBottom?: number;
}) {
  return (
    <section className="on-ink pt-16 md:pt-24" style={{ paddingBottom }}>
      <div className="tg-container tg-grid items-end">
        <div className="[grid-column:1/9] max-lg:[grid-column:1/-1]">
          {!same(eyebrow, headline) && (
            <p className="tg-eyebrow text-secondary mb-5">{eyebrow}</p>
          )}
          <h1 className="lettering text-[length:var(--text-hero)]">{headline}</h1>
        </div>
        {description && (
          <div className="[grid-column:9/13] max-lg:[grid-column:1/-1]">
            <p className="text-secondary text-[length:var(--text-body)] leading-[1.55]">
              {description}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * A section heading on either ground: lettering headline, the description
 * beside it. Colours come from the ground's scope root (`.on-ink` /
 * `.on-paper`), so this needs no `onInk` branch.
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
      <div className="[grid-column:1/7] max-lg:[grid-column:1/-1]">
        {!same(eyebrow, headline) && (
          <p className="tg-eyebrow text-secondary mb-4">{eyebrow}</p>
        )}
        <h2 className="text-fg text-[length:var(--text-display)]">{headline}</h2>
      </div>
      {description && (
        <div className="flex items-end [grid-column:8/13] max-lg:[grid-column:1/-1]">
          <p className="text-secondary text-[length:var(--text-body)] leading-[1.5]">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}

function same(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}
