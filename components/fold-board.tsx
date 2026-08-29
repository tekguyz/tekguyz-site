'use client';

import Link from 'next/link';
import { motion, type Variants } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { AccentDot } from '@/components/solution-tag';
import { StatusLine } from '@/components/status-line';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { site } from '@/lib/site';
import type { WorkEntry } from '@/content/work';
import type { StatusResult } from '@/lib/status';

/**
 * The homepage fold — DESIGN.md §4.18.
 *
 * Four live builds, one per solution line, in `STRIPE_ORDER`, then one muted
 * caption line. Selection and its reasoning live in `content/work.ts`
 * (`foldSlugs`), not here.
 *
 * A FIFTH CARD TIER, AND IT IS DELIBERATE. `case-study-row` is the deep tier,
 * `project-card` the compact one, and the weight gap between them is real
 * signal about the depth of a build. This is neither: it is an INDEX ENTRY, one
 * step below `project-card` again — no image, no summary paragraph, four
 * elements only (what line, what it is, is it up, where it goes). It carries
 * the elevation exception precisely because it is the smallest card on the site
 * and still has to read as a discrete object rather than a table row.
 *
 * ===========================================================================
 * [decided 2026-08-29] THE 2026-08-14 SHAPE HAD FOUR DEFECTS. All four are
 * fixed here, and each is recorded because none of them is visible to a linter
 * or to a token guard.
 * ===========================================================================
 *
 * 1. THE STATUS LINE WRAPPED. `StatusLine variant="compact"`. Measured cause,
 *    not a guess: the default line needs 273px and this card's content box is
 *    222px at 1440px, so "Live · checked 32 minutes ago" broke after "checked"
 *    and orphaned "minutes ago" — on the site's signature component, in the
 *    first block under the hero. The compact variant measures 176px.
 *
 * 2. THE TAG PILL OUT-SHOUTED THE PRODUCT NAME. It was a 12px/700/0.1em
 *    uppercase label inside a 14%-alpha accent fill AND a 35%-alpha accent
 *    border — four signals for one fact, and the loudest object on a card whose
 *    loudest object should be the name. It is now `AccentDot` plus the same
 *    label in `secondary`. The information is identical — the dot is the
 *    colour, the label is the words — which is exactly the pair §4.18 named
 *    when it rejected an accent left-spine as a redundant second signal. This
 *    is that rejection applied to the tag itself.
 *
 *    `AccentDot` is not a new primitive: `solution-row`, `nav`, and both detail
 *    page templates already use it for this job.
 *
 * 3. NO TYPE HIERARCHY. 17px semibold name / 12px 700 tag / 14px mono status is
 *    three near-peers, and nothing receded. Now one ink step and two quiet
 *    ones: label `--text-caption` secondary, name `--text-body` ink, status
 *    `--text-caption` mono. The name wins on two channels — size AND weight —
 *    rather than on neither.
 *
 * 4. THE GRID WAS NOT CENTRED. `style={{ marginBlock: 0 }}`, never `margin: 0`.
 *    Full reasoning at the call site below; it shipped 73px left of every other
 *    block on the page.
 *
 * ===========================================================================
 * [decided 2026-08-29] THE CARD GOES TO THE CASE STUDY, NOT OFF-SITE.
 * ===========================================================================
 * This re-opens what §4.18 itself called "the one genuinely arguable call", and
 * settles it the other way.
 *
 * §4.18 sent the whole card to `entry.url` in a new tab, reasoning that
 * PLAYBOOK §2's differentiator is a prospect opening the thing and using it.
 * That argument is about the BUILD; it is not an argument about THIS POSITION
 * ON THE PAGE. This board is the second block a visitor meets, inches under the
 * hero, while they are still deciding who we are — and the old card answered
 * that moment by ejecting them to an unfamiliar app with no story, no context,
 * and no way back except a tab they may not notice is open.
 *
 * `/work/<slug>` keeps them here and loses nothing: the detail page carries the
 * live link, the ink band below carries two builds at full size, and this
 * card's status line is still the live proof — it is measured hourly, which is
 * the whole claim, and the claim does not need the visitor to leave to be true.
 *
 * It also makes the row internally consistent. All four cards and the "See all
 * eight builds" link now resolve to the same tier, so the board reads as one
 * index rather than as four exits with a link tacked on.
 *
 * THE ICON CHANGES WITH THE DESTINATION, and that is the Icon policy working
 * rather than decoration: `ArrowUpRight` MEANS "this leaves the site". Keeping
 * it on an internal link would be a lie about what the control does. It is
 * `ArrowRight`, 14px — down from 16 so it sits WITH the 12px label rather than
 * over it.
 *
 * ===========================================================================
 * [decided 2026-08-29] THE PROOF STRIP IS GONE. Its facts are this caption.
 * ===========================================================================
 * `components/proof-strip.tsx` is deleted. It was an elevated three-cell panel
 * directly above this board, and its three facts were:
 *
 *   "Eight live builds"                — THIS BOARD IS THAT. Four live builds
 *                                        on screen, a measured status on each,
 *                                        and "See all eight builds" directly
 *                                        beneath them. A panel asserting it two
 *                                        inches above the evidence is the page
 *                                        arguing with itself.
 *   "A verified Google review"         — not provable by the board. Kept.
 *   "South Florida, remote nationwide" — not provable by the board. Kept.
 *
 * So this is not "three facts deleted". It is one fact demoted from a claim to
 * a demonstration, and two facts moved to the place this site already puts
 * facts of exactly that kind.
 *
 * THE CAPTION IS THE SITE'S EXISTING TRUST-FACT PATTERN, not a new one.
 * `closing-cta` and `/contact` both render trust facts as one `--text-sm`
 * secondary row with 3px `muted-soft` mid-dots, stacking below 766px with the
 * dots switched off — because the last dot in the DOM is not the dot that ends
 * a wrapped line, and a trailing dot reads as a typo. That query is reused
 * exactly, at the same 766px, for the same reason.
 *
 * WHAT THIS COST, stated rather than buried: the strip's two support sentences
 * ("Real, running apps you can open and use yourself" and "Remote and
 * cloud-based, wherever your team sits") have no home in a one-line caption and
 * are gone. The claims survive; the elaborations do not.
 *
 * WHAT IT BOUGHT: one elevated object in the fold instead of two, 262px of page
 * height back at 1440px (502 -> 240), and a first block under the hero that is
 * a thing you can click into rather than a sentence about things you can click
 * into.
 *
 * KNOCK-ON: `.tg-elevate` (the static class) lost its only consumer with the
 * strip and is removed from `globals.css`. `.tg-lift` and both `--tg-elevate*`
 * custom properties stay — the cards still use them.
 *
 * TWO GAP SIZES ON THE CAPTION ROW, AND THEY MUST DIFFER BY MORE THAN A HAIR.
 * 48px between the link and the facts, 22px between the two facts —
 * `closing-cta`'s own rhythm note, "one step for a pair, two for the break".
 * The first build shipped 32/22 and the link read as the first item in the fact
 * list rather than as the row's one action.
 *
 * NOT `justify-between` on that row. §4.9 records what that did to `FrameMeta`
 * on a wide frame: two labels thrown to opposite corners read as two blocks
 * rather than as one caption. Both halves are left-anchored with a gap.
 *
 * MOTION. Cards land staggered 80ms apart, rising 18px and settling from a
 * 0.985 scale — an object arriving, not a paragraph fading in. The scale step
 * is what separates this from the site's one existing fade+rise and it is kept
 * that shallow on purpose; anything deeper blurs the text in transit.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

function boardVariants(instant: boolean): Variants {
  return {
    hidden: {},
    shown: {
      transition: instant ? { duration: 0 } : { staggerChildren: 0.08 },
    },
  };
}

function cardVariants(instant: boolean): Variants {
  return {
    hidden: { opacity: 0, y: 18, scale: 0.985 },
    shown: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: instant ? { duration: 0 } : { duration: 0.5, ease: EASE },
    },
  };
}

export function FoldBoard({
  entries,
  statuses,
}: {
  entries: WorkEntry[];
  statuses: Record<string, StatusResult>;
}) {
  const instant = usePrefersReducedMotion();

  return (
    <div>
      <motion.ul
        /* `.tg-grid` — 12 tracks, 8 below 1024px, 1 below 768px. Both bands get
           an explicit span so the 8-track grid is never asked to fit a 12-track
           placement: 4 x span-3 on desktop, 2 x span-4 at tablet. Below 768px
           `.tg-grid > *` forces `1 / -1 !important` and the spans are moot. */
        className="tg-container tg-grid list-none p-0"
        /* `marginBlock`, NOT `margin`, and the difference is the whole fix.
           This element IS the `.tg-container` — the class that centres every
           block on the site with `margin-inline: auto`. An inline style beats
           any class, so `margin: 0` was silently deleting that centring.

           MEASURED at 1440px before the fix: this grid sat at left 0 / right
           145 while the strip above it and the "See all eight builds" link
           below it both sat at 73 / 73. It was the only element on the homepage
           not centred, which is why the row read as neither centred nor aligned
           to anything.

           The reset is still needed — the UA stylesheet gives `<ul>` a 1em
           block margin — but only the BLOCK axis was ever the thing to reset.
           Any future `.tg-container` element that also wants a margin reset has
           this same trap waiting in it. */
        style={{ marginBlock: 0 }}
        variants={boardVariants(instant)}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.2 }}
      >
        {entries.map((entry) => (
          <motion.li
            key={entry.slug}
            className="tg-seq [grid-column:span_3] max-lg:[grid-column:span_4]"
            variants={cardVariants(instant)}
          >
            <Link
              href={`/work/${entry.slug}`}
              className="tg-lift bg-surface border-border flex h-full flex-col rounded-[var(--radius-card)] border"
              style={{ padding: 'var(--pad-card)' }}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2">
                  <AccentDot solution={entry.solution} size={8} />
                  <span className="tg-eyebrow text-secondary truncate">{entry.tag}</span>
                </span>
                <ArrowRight
                  size={14}
                  strokeWidth={1.75}
                  aria-hidden
                  className="text-secondary flex-none"
                />
              </span>

              {/* `entry.name`, not `entry.headline`. The board is an index — a
                  visitor scanning it needs the product's NAME, and the headline
                  is a full sentence that would turn four cards into four
                  paragraphs. The headline is what the detail page and the ink
                  band lead with. */}
              <span className="mt-4 flex-1 text-[length:var(--text-body)] leading-[1.3] font-semibold tracking-[-0.01em]">
                {entry.name}
              </span>

              <StatusLine result={statuses[entry.slug]!} variant="compact" className="mt-5" />
            </Link>
          </motion.li>
        ))}
      </motion.ul>

      <div className="tg-container mt-8">
        <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
          {/* §4.4's affordance, carried forward across two shape changes rather
              than dropped. `tg-rule tg-rule-rest` draws the state primitive to
              0.34 at rest and completes it on hover and focus — the one thing
              `.link-underline` can never do, and the reason the old proof line
              stopped using it. `tap-44`, not `tap-24`: it is its own element on
              its own line, not inline in prose. */}
          <Link
            href="/work"
            className="tap-44 tg-rule tg-rule-rest text-[length:var(--text-body)] font-semibold"
          >
            See all eight builds
          </Link>

          <div className="text-secondary flex flex-wrap items-center gap-x-[22px] gap-y-[10px] text-[length:var(--text-sm)] leading-[1.55] max-[766px]:flex-col max-[766px]:items-start">
            <span>
              {/* Leans on the SOURCE, not the name. PLAYBOOK §11 is explicit
                  that third-party verifiability carries more weight here than a
                  partial first name does, so the reviewer is named in the
                  testimonial's own attribution block and not in the fold.

                  `tap-24`, not `tap-44`: this IS a link inline in running prose,
                  the exact case the 24px tier exists for. Hit-tested against the
                  `tap-44` link above it — at 375px the two overlays clear each
                  other by 6px. */}
              A verified Google review.{' '}
              <a
                href={site.gbp}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-24 link-underline text-fg font-semibold"
              >
                Read it on Google &rarr;
              </a>
            </span>
            <Dot />
            {/* `site.locationLong` is read from lib/site.ts rather than
                retyped, so a change to the company facts cannot leave this line
                behind. */}
            <span>{site.locationLong}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 3px `muted-soft`, off below 766px. Same device and same query as
 * `closing-cta`'s trust row — see this file's header for why the threshold is a
 * media query rather than `:not(:last-child)`.
 */
function Dot() {
  return (
    <span
      aria-hidden
      className="h-[3px] w-[3px] flex-none rounded-full max-[766px]:hidden"
      style={{ background: 'var(--tg-muted-soft)' }}
    />
  );
}
