'use client';

import { HeroMedia } from '@/components/hero-media';
import type { HeroMedia as HeroMediaData } from '@/content/work';
import { StatusLine } from '@/components/status-line';
import { ButtonLink } from '@/components/button';
import { SequenceRoot, SequenceItem, SequenceDots } from '@/components/load-sequence';
import type { StatusResult } from '@/lib/status';

/**
 * The asymmetric hero.
 *
 * Text spans cols 1-7. The media column is a plain plate at EVERY width: a 16:9
 * poster (its own ratio, distinct from the 16:10 used everywhere else) with its
 * own 12px radius and 1px hairline, the status line and the demo link 12px
 * beneath it, and no panel behind it.
 *
 * [changed 2026-10-06] It was a surface-filled panel that bled off the right
 * viewport edge (`margin-right` of the container gutter plus 10vw, 16px radius,
 * 32px padding). Measured on the live site, that hid 13% to 18% of the picture
 * at 1024 to 1920px wide and cut "You (Guest)" mid-word, and the panel gray sat
 * on the picture's own near-identical gray margin, which the owner read as a
 * strange border and padding. Below 1024px the panel had already been removed
 * for the reasons in DESIGN.md §4.9 (a plate has zero padding), so desktop now
 * uses the same rule. The picture itself was also re-cut tight to the app
 * (1040x585) so its text reads about 40% larger than before.
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
 * Media is a real desktop poster, a short loop of the same screen over it, and
 * a real phone capture overlapping its corner — see `hero-media.tsx`. The
 * retired phone-call-simulator video loop was deleted 2026-08-28; the current
 * loop is a fresh capture from `tools/capture` (2026-10-02).
 */
export function HomeHero({
  poster,
  posterMobile,
  url,
  alt,
  media,
  status,
}: {
  poster: string;
  posterMobile?: string;
  url: string;
  alt: string;
  /** Optional video loop and phone capture layered on the poster. */
  media?: HeroMediaData;
  status: StatusResult;
}) {
  // `pb-16 md:pb-20` (64/80), not the section rhythm's `pb-20 md:pb-32`. The
  // proof strip directly below is not the next SECTION — it is the evidence for
  // the statement in this one, and the two have to read as one fold. Full rhythm
  // resumes below the build board, where the Solutions section's own
  // `py-20 md:py-32` provides it. Same "count the gap once" reasoning the
  // `closing-cta` boundary uses, applied at the top of the page instead of the
  // bottom.
  return (
    <section className="overflow-x-clip pt-16 md:pt-24 pb-16 md:pb-20">
      <SequenceRoot trigger="load">
        {/* No `gap-y-*` here: `.tg-grid`'s `gap` is unlayered and would eat it
            silently. The stacked gap is 24 (grid) + 56 (`.tg-hero-frame`). */}
        <div data-hero-grid className="tg-container tg-grid items-center">
          <div style={{ gridColumn: '1 / 7' }}>
            <SequenceDots className="mb-6" />

            <SequenceItem role="headline">
              {/* A LOCAL CLAMP, NOT `--text-hero`, and the token is deliberately
                  left alone: `page-hero` sets every other route's h1 from it, and
                  the constraint TOKENS.md attaches to the 72px ceiling — three
                  lines maximum on desktop with the CTA row inside the first
                  viewport — is a HOME constraint being paid for by six routes
                  that do not have a bleeding media panel next to their headline.
                  Raising it here only is the honest scope.

                  44 → 76px, against the token's 40 → 72. It is affordable
                  because the copy got shorter, not because the constraint moved:
                  43 characters at 76px wraps to 3 lines in the 564px text column
                  (the old 51-character line needed 4 at 72px), and the subhead
                  below dropped a sentence. Measured at 1280x720 after the change
                  — see DESIGN.md §4.18. If this copy ever grows, re-measure
                  against the three-line rule before assuming the ceiling holds.

                  0.92 leading and -0.05em tracking, from 0.95 / -0.045em. The
                  block reads as one mass rather than three stacked lines, which
                  is where most of the added confidence actually comes from —
                  more than the 4px. */}
              <h1
                className="text-[clamp(2.75rem,6.6vw,4.75rem)] min-[1024px]:text-[clamp(2.75rem,calc(6vw-2px),4.75rem)] leading-[0.92] font-bold tracking-[-0.05em]"
                style={{ textWrap: 'pretty' }}
              >
                We build the systems your business runs on.
              </h1>
            </SequenceItem>

            <SequenceItem role="subhead">
              {/* PLAYBOOK §1's core belief, verbatim to its second clause and
                  then stopped. The line that used to close it — "…by people who
                  actually understand how they work. That's what we do." —
                  explained the claim a third time and then asserted authorship
                  of it, which is the hedge a confident hero does not need. Two
                  sentences, one idea, and the vertical budget it returns is what
                  paid for the headline above. */}
              <p
                className="text-secondary mt-8 max-w-[46ch] text-[length:var(--text-body)]"
                style={{ textWrap: 'pretty' }}
              >
                Most businesses don&rsquo;t need more software. They need the right system, built
                correctly.
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
                <HeroMedia
                  poster={poster}
                  posterMobile={posterMobile}
                  alt={alt}
                  media={media}
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
              </div>
            </div>
          </SequenceItem>
        </div>
      </SequenceRoot>
    </section>
  );
}
