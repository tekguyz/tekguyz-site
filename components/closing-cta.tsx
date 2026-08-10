'use client';

import { SignatureStripe } from '@/components/signature-stripe';
import { ButtonLink } from '@/components/button';
import { openConcierge } from '@/components/concierge/concierge-bus';
import { SequenceRoot, SequenceItem } from '@/components/load-sequence';

/**
 * Centered — the one section permitted to be.
 *
 * Export values: max-width 760px, padding 40px 32px 48px (32px top below 768).
 * Deliberately more compact than a standard 128px section; that spacing leak has
 * happened twice. The top padding used to be 64px, which stacked a second full
 * gap on top of the preceding section's own 128px across a 6px stripe — 202px
 * of dead space, measured on `/`. That half is fixed at the collision, in
 * `globals.css` (`:has(+ .tg-closing)`), NOT here and NOT at the global rhythm.
 *
 * INTERNAL RHYTHM — 24 · 48 · 24 · 16, and the numbers are the hierarchy.
 * It ran 24 / 32 / 36: a near-linear ramp in which every gap reads the same,
 * so nothing groups and a centered stack with nothing grouping it reads flat.
 * The elements were all correct; only the gaps were wrong.
 *
 *   headline -> subhead   24   one step; they are one statement
 *   subhead  -> trust     48   two steps; the only break, statement -> ask
 *   trust    -> button    24   one step; the facts belong to the ask
 *   button   -> link      16   half a step; the link is subordinate
 *
 * One step for a pair, two for the break, half for the subordinate. No fill,
 * border, card or divider was added — the flatness was never in the elements.
 *
 * The subhead and the trust line are TWO SEPARATE ELEMENTS. The trust row is
 * its own flex-wrap row with 3px muted-soft dot separators, so it reflows to
 * multiple lines on narrow viewports instead of becoming an unreadable run-on.
 * Merging them into one paragraph was a mistake in an earlier pass.
 *
 * The button is the site's ONE documented size exception: 18px 32px, 16px text.
 * Beneath it, one quiet text link to the concierge — a lower-commitment path,
 * not a competing CTA, and the concierge's only second entry point.
 *
 * On scroll into view this replays the hero's load sequence once.
 */
export function ClosingCta() {
  return (
    <section className="tg-closing">
      <SignatureStripe />
      <SequenceRoot trigger="inView">
        <div className="mx-auto max-w-[760px] px-8 pt-8 pb-12 text-center md:pt-10">
          <SequenceItem role="headline">
            <h2 className="text-[length:var(--text-display)] leading-[1.05] font-bold tracking-[-0.03em]">
              Let&rsquo;s talk about your business.
            </h2>
          </SequenceItem>

          <SequenceItem role="subhead">
            <p
              className="mx-auto mt-6 max-w-[48ch] text-[length:var(--text-body)] text-secondary"
              style={{ textWrap: 'pretty' }}
            >
              Tell us what you&rsquo;re working with and what you&rsquo;re trying to fix.
              We&rsquo;ll take it from there.
            </p>
          </SequenceItem>

          {/* Its own element, not merged into the subhead.

              M-04. Below the wrap point this row broke one-fact-per-line, and
              the breaks fell AFTER each fact — so each 3px dot terminated a
              line instead of separating two visible items. A separator with
              nothing after it is not a separator; it reads as a typo.

              The mechanism is a media query at 766px rather than a
              `:not(:last-child)` selector, because CSS selectors see DOM order
              and the defect is about the RENDERED break — the last dot in the
              DOM is not the dot that ends a line. 766 is the measured
              threshold: the row is one line at 767 (and everything above) and
              wrapped at every viewport below it, so the query switches exactly
              where the wrap does, and the row never renders in the broken
              in-between state where it wraps with the dots still on.

              Below it the row becomes a deliberate stack and the dots do not
              render at all. They are `aria-hidden`, so removing them costs
              nothing semantically. */}
          <SequenceItem role="trust">
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-[22px] gap-y-[10px] text-[0.875rem] leading-[1.55] text-secondary max-[766px]:flex-col">
              <span>Free first conversation</span>
              <Dot />
              <span>A flat quote before anything starts</span>
              <Dot />
              <span>We reply within one business day</span>
            </div>
          </SequenceItem>

          <SequenceItem role="cta">
            <div className="mt-6 flex flex-col items-center gap-4">
              {/* `data-primary-cta` is the concierge launcher's yield-rule
                  target (M-15). Exactly two elements carry it site-wide: this
                  button and the home hero's CTA row. */}
              <ButtonLink href="/contact" size="large" data-primary-cta>
                Let&rsquo;s Talk
              </ButtonLink>
              <button
                type="button"
                onClick={openConcierge}
                className="tap-44 link-underline cursor-pointer text-[0.875rem] leading-[1.55] text-secondary"
              >
                Or ask our AI what we&rsquo;d build for you
              </button>
            </div>
          </SequenceItem>
        </div>
      </SequenceRoot>
    </section>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      className="h-[3px] w-[3px] flex-none rounded-full max-[766px]:hidden"
      style={{ background: 'var(--tg-muted-soft)' }}
    />
  );
}
