'use client';

import { Frame } from '@/components/live-frame';
import { StatusLine } from '@/components/status-line';
import { ButtonLink } from '@/components/button';
import { SequenceRoot, SequenceItem, SequenceDots } from '@/components/load-sequence';
import type { StatusResult } from '@/lib/status';

/**
 * The asymmetric hero.
 *
 * Text spans cols 1-7. The media column is a SURFACE-FILLED PANEL — not a bare
 * image — that bleeds off the right viewport edge:
 *
 *   margin-right: calc(-1 * max(0px, (100vw - 1216px) / 2) - 10vw)
 *   background surface · 1px hairline with NO right border
 *   border-radius 16px 0 0 16px · padding 32px 0 32px 32px
 *
 * so the panel visibly runs off the page rather than sitting politely inset.
 * Inside it: a 16:9 poster (its own ratio, distinct from the 16:10 used
 * everywhere else) that also drops its right border and right radius, then the
 * status line, the demo link, and the hourly-check note.
 *
 * The earlier "empty space around the hero image" complaint was a ratio
 * mismatch inside the image container, not this panel — `aspect-ratio:16/9`
 * with `object-fit:cover` is what fixes it, and the panel is real design.
 *
 * BELOW 1024px THERE IS NO PANEL. The bleed is the panel's entire argument, and
 * the bleed cannot exist in a 327px column — so what survived the old ≤1023px
 * branch was a surface-filled card with a 24px mat, which is precisely the
 * "plate, not panel" failure DESIGN.md §4.9 forbids at card scale. Measured
 * before removal: 33.2% of the panel box at 375px was empty `--tg-surface`,
 * wrapping a 278px poster. Stripped, the poster is the media — its own 12px
 * radius and hairline, the status block 12px beneath it — and it gains 49px of
 * width at 375px (+38% area) for free. The panel is desktop-only now, which is
 * the only place it was ever describing something true.
 *
 * INTERNAL RHYTHM — 24 · 32 · 48/64 · 80, and the numbers are the hierarchy.
 * It ran 36 / 32 / 40: a near-linear ramp in which every gap reads the same, so
 * nothing groups. That is the identical defect v2.5 diagnosed and fixed in
 * `closing-cta` (24 · 48 · 24 · 16) and never applied here — this section was
 * simply never revisited. Same grammar, one amplitude up, step = 32:
 *
 *   dots     -> headline   24    under a step; the flourish belongs to the headline
 *   headline -> subhead    32    one step; they are one statement
 *   subhead  -> CTA row    48/64 the break, statement -> ask
 *   CTA row  -> media      80    the largest break, text block -> proof
 *
 * Three groups, not four evenly-spaced elements. The break is 64 (two steps) on
 * desktop and 48 on mobile — NOT a clean 2x at both widths, and the honest
 * reason is vertical budget, not geometry: 48 is what mobile can pay while
 * keeping the CTA row above the fold. What has to hold everywhere is only that
 * the break is decisively the largest gap inside the text block, which 48
 * against 32 achieves and the old 40 against 32 did not.
 *
 * `closing-cta`'s step is 24 where this one is 32 — the bookends share the
 * grammar and differ in amplitude, which is what makes them rhyme rather than
 * match. Watch the desktop value if this copy ever changes: measured 2026-08-13,
 * the CTA row clears the fold by 18px at 1280x720, the tightest realistic
 * laptop. `items-center` means the taller media panel drives the row, so a 24px
 * text-column change moved the row only 6px — but the margin is thin.
 *
 * The 80px is 24 + 56, NOT the `gap-y-14` this grid used to declare. That class
 * never once applied: `.tg-grid`'s `gap` is unlayered, so it beats any
 * `row-gap` from `@layer utilities` regardless of source order — the same
 * silent drop documented for the case-study rows' `gap-y-12`. The real 56px was
 * always `.tg-hero-frame`'s own `margin-top`, and it is left there, alone, so
 * one number means one thing.
 *
 * Media is a static poster. The looped sarah-demo.mp4 still shows the retired
 * phone-call simulator and must not ship.
 */
export function HomeHero({
  poster,
  posterMobile,
  url,
  alt,
  status,
}: {
  poster: string;
  posterMobile?: string;
  url: string;
  alt: string;
  status: StatusResult;
}) {
  return (
    <section className="overflow-x-clip pt-16 md:pt-24 pb-20 md:pb-32">
      <SequenceRoot trigger="load">
        {/* No `gap-y-*` here: `.tg-grid`'s `gap` is unlayered and would eat it
            silently. The stacked gap is 24 (grid) + 56 (`.tg-hero-frame`). */}
        <div data-hero-grid className="tg-container tg-grid items-center">
          <div style={{ gridColumn: '1 / 7' }}>
            <SequenceDots className="mb-6" />

            <SequenceItem role="headline">
              <h1
                className="text-[length:var(--text-hero)] leading-[0.95] font-bold tracking-[-0.045em]"
                style={{ textWrap: 'pretty' }}
              >
                We build tech that actually works for your business.
              </h1>
            </SequenceItem>

            <SequenceItem role="subhead">
              <p
                className="mt-8 max-w-[52ch] text-[length:var(--text-body)] text-secondary"
                style={{ textWrap: 'pretty' }}
              >
                Most businesses don&rsquo;t need more software. They need the right system, built
                correctly, by people who actually understand how they work. That&rsquo;s what we do.
              </p>
            </SequenceItem>

            <SequenceItem role="cta">
              {/* The concierge launcher yields while this row is on screen
                  (M-15). Tagged on the row, not the two buttons, so the
                  launcher yields to the pair as one conversion moment.

                  SIZE STAYS `default` (15×24), re-justified rather than
                  inherited. `large` is `closing-cta`'s documented exception and
                  does not belong here for three reasons, none of them padding:
                  this ask is a PAIR, and the 14×24 secondary exists to paint
                  the same height as a 15×24 primary — there is no `large`
                  secondary to pair with, so bumping one half breaks the
                  compensation `button.tsx` documents; the hero's ink button
                  points at /work, so making it the loudest control on the site
                  would put *browse* above *talk to us* and invert the narrative
                  the closing band exists to finish; and a taller row pushes
                  against TOKENS.md's standing hero constraint that the CTA row
                  stay inside the first viewport. The hero was underweighted in
                  its SPACING, not its button. */}
              <div data-primary-cta className="mt-12 flex flex-wrap gap-3 md:mt-16">
                <ButtonLink href="/work">See Our Work</ButtonLink>
                <ButtonLink href="/contact" variant="secondary" size="nav">
                  Let&rsquo;s Talk
                </ButtonLink>
              </div>
              {/* No status line here. COPY.md's hero spec attaches it to the
                  media, DESIGN.md §5 lists the hero's status line once, and
                  nothing specifies a text-column instance — this one rendered
                  the same string twice on one screen (D-06). The specified
                  instance is the one inside `tg-hero-frame` below. */}
            </SequenceItem>
          </div>

          <SequenceItem role="media" className="[grid-column:7/13] max-lg:[grid-column:1/-1]">
            <div data-hero-frame className="tg-hero-frame">
              <div data-hero-poster className="tg-hero-poster">
                <Frame
                  poster={poster}
                  posterMobile={posterMobile}
                  alt={alt}
                  ratio="16/9"
                  priority
                  className="tg-hero-img"
                />
              </div>
              <div className="flex max-w-[52ch] flex-col gap-[14px]">
                <StatusLine result={status} />
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-44 link-underline self-start text-[14.5px] font-semibold"
                >
                  Open it in a new tab
                </a>
                <p className="text-[0.875rem] leading-[1.55] text-secondary italic">
                  We check every demo hourly. This is the real status, not a badge.
                </p>
              </div>
            </div>
          </SequenceItem>
        </div>
      </SequenceRoot>
    </section>
  );
}
