'use client';

import Link from 'next/link';
import { motion, type Variants } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { SolutionTag } from '@/components/solution-tag';
import { StatusLine } from '@/components/status-line';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import type { WorkEntry } from '@/content/work';
import type { StatusResult } from '@/lib/status';

/**
 * The fold's build board — DESIGN.md §4.18.
 *
 * Four live builds, one per solution line, in `STRIPE_ORDER`. Selection and its
 * reasoning live in `content/work.ts` (`foldSlugs`), not here.
 *
 * A FIFTH CARD TIER, AND IT IS DELIBERATE. `case-study-row` is the deep tier,
 * `project-card` the compact one, and the weight gap between them is real
 * signal about the depth of a build. This is neither: it is an INDEX ENTRY, one
 * step below `project-card` again — no image, no summary paragraph, four
 * elements only (what line, what it is, is it up, does it open). It carries the
 * elevation exception precisely because it is the smallest card on the site and
 * still has to read as a discrete object rather than a table row.
 *
 * THE WHOLE CARD OPENS THE LIVE PRODUCT, in a new tab, and that is the one
 * genuinely arguable decision in this section. `project-card` deliberately
 * refuses a second "open the live demo" action, because on the /work index the
 * job is *read the story* and two competing actions on a compact card is the
 * ambiguity that tier exists to avoid. In the fold the job is the opposite —
 * PLAYBOOK §2's differentiator is that a prospect can open the thing and use it
 * themselves, right now — so this tier resolves the same ambiguity the other
 * way and keeps one action per card. New tab, so the site stays open behind it.
 * The route to every case study is one link below the board and the ink band
 * carries two of them at full size; nothing is orphaned.
 *
 * THE ACCENT TAG IS THE CARD'S ONLY COLOUR. An accent left-spine was drawn and
 * cut: the tag already names the line in words *and* colour, and a second
 * accent signal on a 150px card is decoration by the time it is read.
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
           145, while the proof strip directly above it and the "See all eight
           builds" link directly below it both sat at 73 / 73. It was the only
           element on the homepage not centred, which is why the row read as
           neither centred nor aligned to anything.

           The reset is still needed — the UA stylesheet gives `<ul>` a 1em
           block margin — but only the BLOCK axis was ever the thing to reset.
           Any future `.tg-container` element that also needs a margin reset
           has this same trap waiting in it. */
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
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="tg-lift bg-surface border-border flex h-full flex-col rounded-[12px] border"
              style={{ padding: 'var(--pad-card)' }}
            >
              <span className="flex items-start justify-between gap-3">
                <SolutionTag solution={entry.solution} label={entry.tag} variant="card" />
                {/* Names the control, per the Icon policy: this card leaves the
                    site. `text-secondary` at rest so it never competes with the
                    tag; the card's own hover does the rest. */}
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden
                  className="text-secondary mt-[3px] flex-none"
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

              <StatusLine result={statuses[entry.slug]!} className="mt-5" />
            </a>
          </motion.li>
        ))}
      </motion.ul>

      {/* §4.4's affordance, carried forward rather than dropped. `tg-rule
          tg-rule-rest` draws the state primitive to 0.34 at rest and completes
          it on hover and focus — the one thing `.link-underline` can never do,
          and the reason the old proof line stopped using it. `tap-44`, not
          `tap-24`: it is its own element on its own line, not inline in prose.
          The nearest interactive neighbour is a card bottom edge 32px above, so
          the 44px overlay (extending ~11px above a ~21px text box) cannot
          intersect it. Verified with `bun run audit:mobile taps`. */}
      <div className="tg-container mt-8">
        <Link
          href="/work"
          className="tap-44 tg-rule tg-rule-rest text-[length:var(--text-body)] font-semibold"
        >
          See all eight builds
        </Link>
      </div>
    </div>
  );
}
