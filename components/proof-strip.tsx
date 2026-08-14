'use client';

import { motion, type Variants } from 'motion/react';
import { BadgeCheck, MapPin, SquareArrowOutUpRight } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { site } from '@/lib/site';

/**
 * The proof strip — DESIGN.md §4.18. Replaces the one-line `proof-line` band.
 *
 * WHAT IT REPLACES AND WHAT SURVIVES. §4.4's band was a single sentence between
 * two hairlines: "Eight live builds. Open any of them right now." One sentence
 * was carrying the entire "this is real, not a mockup" argument — the site's
 * only genuine differentiator — on a page whose next 2000px are full of
 * evidence for it. Three verifiable facts replace it. What survives the swap is
 * §4.4's hard-won decision about the AFFORDANCE: `tg-rule tg-rule-rest` on the
 * one invitation link, drawn to 0.34 at rest and completing on hover and focus,
 * because `.link-underline` draws nothing at rest and a band whose only
 * actionable element is invisible until you are already on it is no affordance
 * at all for touch. That link now lives at the end of `fold-board.tsx` — the
 * gesture moved, it was not dropped.
 *
 * THE THREE FACTS ARE FACTS, and each one is checkable by the reader without
 * taking our word for it: eight builds you can open, a review on someone else's
 * property, and a location. Nothing here is a claim about quality. That is the
 * whole design — the strip is evidence, the hero above it is the statement.
 *
 * NO ACCENT ANYWHERE ON THIS COMPONENT, deliberately. The four accents mean
 * *solution line* and nothing else, and these three facts span all four lines
 * (or none) — §4.4 rejected an accent dot on the old proof line for exactly
 * this reason and the reasoning is unchanged by the shape change. The icons are
 * ink; the strip's only colour is the status of the shadow under it.
 *
 * ICONS — the site's second icon site after the footer's social row, allowed
 * under the Icon policy's own test ("what is this control / what kind of thing
 * is this"), not decoration. One set (lucide), `strokeWidth={1.5}`, 20px, so
 * they read as the same drawn hairline as the 1px borders and the 2px
 * `.tg-rule`. The stroke weight is the entire reason a library was chosen over
 * hand-drawn SVG: one set, one weight, no glyph heavier than its neighbours.
 *
 * ELEVATION — `.tg-elevate`, the scoped exception. See globals.css for why it
 * exists and why it must not spread.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/** The panel rises as one object. The icons then arrive inside it, staggered. */
function panelVariants(instant: boolean): Variants {
  return {
    hidden: { opacity: 0, y: 20 },
    shown: {
      opacity: 1,
      y: 0,
      transition: instant
        ? { duration: 0 }
        : {
            duration: 0.5,
            ease: EASE,
            delayChildren: 0.16,
            staggerChildren: 0.07,
          },
    },
  };
}

/**
 * Variants propagate through the plain `<li>` between the panel and the icon —
 * Motion's variant context is React context, not DOM traversal, so the
 * intermediate element does not break the chain.
 */
function iconVariants(instant: boolean): Variants {
  return {
    hidden: { opacity: 0, scale: 0.72 },
    shown: {
      opacity: 1,
      scale: 1,
      transition: instant ? { duration: 0 } : { duration: 0.32, ease: EASE },
    },
  };
}

/**
 * ICON INLINE WITH THE CLAIM, support indented to the claim's left edge.
 *
 * The first build stacked all three — icon, then claim, then support — and it
 * measured 154px tall with a 400px cell carrying a three-word claim, so every
 * cell had an empty right half and an empty bottom third. An elevated panel
 * that is mostly air argues against itself. Inline, the icon reads as part of
 * the claim's line rather than as a decoration sitting above it, the cell loses
 * ~30px of height, and the strip goes from a band to an object.
 *
 * The 32px indent on the support line is the icon's 20px plus the 12px gap, so
 * the two text rows share a left edge and the icon hangs in its own gutter.
 */
const CELL =
  'flex flex-col border-border p-6 lg:p-8 max-md:border-t max-md:first:border-t-0 md:border-l md:first:border-l-0';
const CLAIM_ROW = 'flex items-start gap-3';
const CLAIM = 'text-[length:var(--text-body)] leading-[1.35] font-semibold tracking-[-0.01em]';
const SUPPORT = 'text-secondary mt-2 ml-8 text-[0.875rem] leading-[1.55]';

export function ProofStrip() {
  const instant = usePrefersReducedMotion();
  const panel = panelVariants(instant);
  const icon = iconVariants(instant);

  return (
    <motion.ul
      /* `tg-seq` is the belt-and-braces the load sequence already uses: under
         `prefers-reduced-motion` globals.css pins opacity to 1 and transform to
         none with `!important`, which is the only thing that can beat the
         inline styles Motion writes. The hook above zeroes the durations; this
         class guarantees nothing is ever left hidden even for a frame. */
      className="tg-seq tg-elevate bg-surface border-border grid list-none rounded-[12px] border p-0 md:grid-cols-3"
      style={{ margin: 0 }}
      variants={panel}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.35 }}
    >
      <Fact
        icon={<SquareArrowOutUpRight size={20} strokeWidth={1.5} aria-hidden />}
        iconVariants={icon}
        claim="Eight live builds"
        support="Real, running apps you can open and use yourself."
      />

      <Fact
        icon={<BadgeCheck size={20} strokeWidth={1.5} aria-hidden />}
        iconVariants={icon}
        claim="A verified Google review"
        support={
          <>
            {/* Leans on the SOURCE, not the name. PLAYBOOK §11 is explicit that
                third-party verifiability carries more weight here than a partial
                first name does, so the reviewer is named in the testimonial's
                own attribution block and not in the fold. */}
            Not a quote we typed.{' '}
            {/* COPY.md's authored link text, and `site.gbp` — the `cid=` form
                already wired in `testimonial.tsx`, not a second URL. `tap-24`,
                not `tap-44`: this one IS a link inline in running prose, which
                is the exact case the 24px tier exists for, and it is the only
                interactive element inside the strip, so the overlay has nothing
                to collide with. */}
            <a
              href={site.gbp}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-24 link-underline text-fg font-semibold"
            >
              Read it on Google →
            </a>
          </>
        }
      />

      <Fact
        icon={<MapPin size={20} strokeWidth={1.5} aria-hidden />}
        iconVariants={icon}
        /* `site.locationLong` is "South Florida, remote nationwide" — read from
           lib/site.ts rather than retyped, so a change to the company facts
           cannot leave this line behind. */
        claim={site.locationLong}
        /* PLAYBOOK §9's delivery model, in plain words. Not an invented
           service-area claim: the GBP is configured as a Service Area Business
           covering South Florida plus remote delivery nationwide, and the
           business is explicitly remote and cloud-based rather than on-site. */
        support="Remote and cloud-based, wherever your team sits."
      />
    </motion.ul>
  );
}

/**
 * One cell. Extracted rather than copy-pasted three times so the parallel
 * structure PLAYBOOK §4 asks for within a set is enforced by the markup instead
 * of maintained by hand — a fourth fact cannot accidentally get a different
 * shape, and the claim/support lengths stay the only thing that varies.
 */
function Fact({
  icon,
  iconVariants,
  claim,
  support,
}: {
  icon: React.ReactNode;
  iconVariants: Variants;
  claim: React.ReactNode;
  support: React.ReactNode;
}) {
  return (
    <li className={CELL}>
      <div className={CLAIM_ROW}>
        {/* `mt-[2px]` is optical, not structural: `items-start` aligns the 20px
            glyph's box to the top of a 23px line box, which sets the icon ~1.5px
            high against the cap height it is meant to sit beside. */}
        <motion.span className="tg-seq text-fg mt-[2px] block flex-none" variants={iconVariants}>
          {icon}
        </motion.span>
        <p className={CLAIM}>{claim}</p>
      </div>
      <p className={SUPPORT}>{support}</p>
    </li>
  );
}
