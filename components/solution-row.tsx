import Link from 'next/link';
import { AccentDot } from '@/components/solution-tag';
import type { Solution } from '@/content/solutions';

/**
 * Full-width row, hairline top border, 48px vertical padding.
 *
 * Export layout: accent dot (10px) + title on cols 1-6 with a 22px gap; hook +
 * arrow on cols 7-13, space-between. On hover the row's hairline darkens to
 * border-strong and both the title and the arrow shift 4px right.
 *
 * No icons — the dot is the icon. No card fill, no box. The four-identical-cards
 * grid is a named anti-pattern and this is what replaces it.
 *
 * The title is `--text-subhead`, a step DOWN from the export's `--text-display`.
 * A row title and the `SectionHead` above it were the same size token separated
 * only by ~100 weight units, which is a difference you can find in a type table
 * and not one you can see at a glance. Section level owns `display`; item level
 * owns `subhead`. This is shared with /solutions, where the same step keeps the
 * rows under, not level with, the `--text-hero` page head. DESIGN.md §2, §4.6.
 */
export function SolutionRow({
  solution,
  last = false,
  index = 0,
}: {
  solution: Solution;
  last?: boolean;
  /** Position within the list, for the 80ms reveal stagger. */
  index?: number;
}) {
  return (
    <Link
      href={`/solutions/${solution.slug}`}
      data-row
      data-reveal-index={index}
      /* `tg-rule` is additive to `hover-row`, not a replacement for it: the
         border still darkens (that is the row's own edge responding) and the
         2px ink bar draws along the bottom on top of it. The bar is what makes
         the four rows read as a list you are moving through rather than four
         things that happen to change colour. */
      className={`reveal hover-row tg-rule tg-grid items-center border-t border-border py-12 ${last ? 'border-b' : ''}`}
    >
      {/* 768–1023: 5/gap/6 of 12 scales to 3/gap/4 of 8. The gap track is DESIGN.md
          §3's deliberate one and survives the collapse. */}
      <div className="flex items-center gap-[22px] [grid-column:1/6] max-lg:[grid-column:1/4]">
        <AccentDot solution={solution.slug} />
        <span
          data-shift
          className="hover-shift inline-block text-[length:var(--text-subhead)] leading-[1.1] font-semibold tracking-[-0.025em]"
        >
          {solution.name}
        </span>
      </div>

      <div
        className="flex items-center justify-between gap-8 [grid-column:7/13] max-lg:[grid-column:5/9]"
      >
        {/* `--text-sm`, not `--text-body`: the hook is item-level supporting
            text and it sits in the same column band as the section's lede. At
            body size the two were the same treatment twice and the band read as
            one flat column of secondary sentences. */}
        <p className="max-w-[52ch] text-[length:var(--text-sm)] leading-[1.55] text-secondary">
          {solution.hook}
        </p>
        <span
          aria-hidden
          data-shift
          className="hover-shift flex-none text-[22px] leading-none"
        >
          →
        </span>
      </div>
    </Link>
  );
}
