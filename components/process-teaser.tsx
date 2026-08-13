import Link from 'next/link';
import type { CSSProperties } from 'react';
import { SectionHead } from '@/components/page-hero';
import { processSteps } from '@/content/process';

/**
 * The homepage's "How We Work" teaser — four steps, linking to `/process`.
 *
 * Extracted from `app/page.tsx` on 2026-08-13 (Wave 3). It had never been a
 * component, which is why `DESIGN.md` §4 had nothing to describe; the four
 * lines lived inline in the page beside seven other sections.
 *
 * **The differentiation is a progress rail, and it is the same object as the
 * contact form's.** `.tg-rule` with `data-on="true"` and a partial
 * `--tg-rule-scale` — 0.25 / 0.5 / 0.75 / 1 — so the ink bar above each step
 * grows across the row. Read left to right on desktop, or down the page on
 * mobile, it is a staircase: how far through the engagement you are when that
 * step ends. That is real information, not decoration, which is the test §4
 * applies to every structural device.
 *
 * It reuses the site's ONE state primitive rather than adding vocabulary, and
 * specifically its partial-draw channel, which already exists precisely because
 * the contact form needed to show a step reached. `data-on` is that rail's
 * weight too: the transient `border-strong` would have been invisible here,
 * one shade off the `border` hairline it is drawn over.
 *
 * **Inline `--tg-rule-scale` is correct here and would be a bug elsewhere.** It
 * beats `.tg-rule:hover`, which is only safe because nothing in this list
 * hovers — the same reasoning `contact-form.tsx` records for the step header.
 *
 * **[decided] No hover state, deliberately.** These are not links. Giving a
 * non-interactive element a hover response advertises an affordance that is not
 * there, and `.tg-rule`'s hover weight is reserved for things that respond to a
 * click. The one interactive element in the section is the link beneath it.
 *
 * **`<ol>`, not four `<div>`s.** The rail says "sequence" visually; the list
 * says it to a screen reader, which gets "list, 4 items" and a position for
 * each. The two now carry the same fact.
 *
 * Reserved systems untouched: no numerals (`numeral-device` is `/process` only,
 * §4.11), no pin (CANONICAL §6), and none of the four solution accents — those
 * mean solution line, and four steps happening to also be four is a coincidence.
 */
export function ProcessTeaser() {
  return (
    <section className="border-t border-border py-20 md:py-32">
      <SectionHead
        eyebrow="How We Work"
        headline="How We Work"
        description="Four steps. No surprises. No disappearing acts."
      />

      {/* Not `tg-grid`: at the 8-column tablet breakpoint a 12-column `span 3`
          leaves a ragged 2 + 2 with a stray gap. Plain responsive columns. */}
      <ol className="tg-container mt-16 grid list-none grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((s, i) => (
          <li
            key={s.title}
            /* The 80ms stagger was ALREADY wired here before Wave 3 — `reveal`
               plus this attribute, resolved in `reveal.tsx` as
               `Math.min(index, 3) * 80`. It is not new work and was not
               missing; it is invisible on a machine with animations off. */
            data-reveal-index={i}
            data-on="true"
            style={{ '--tg-rule-scale': (i + 1) / processSteps.length } as CSSProperties}
            className="reveal tg-rule tg-rule-top border-t border-border pt-6"
          >
            <h3 className="text-[1.125rem] leading-[1.3] font-semibold tracking-[-0.02em]">
              {s.title}
            </h3>
            <p className="mt-2 text-[0.875rem] leading-[1.55] text-secondary">{s.teaser}</p>
          </li>
        ))}
      </ol>

      <div className="tg-container mt-14">
        <Link href="/process" className="tap-44 link-underline text-[14.5px] font-semibold text-fg">
          See our full process →
        </Link>
      </div>
    </section>
  );
}
