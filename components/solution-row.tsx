import Link from 'next/link';
import { AccentDot } from '@/components/solution-tag';
import type { Solution } from '@/content/solutions';

/**
 * Full-width row, hairline top border, 48px vertical padding.
 *
 * Export layout: accent dot (10px) + display-size title on cols 1-6 with a 22px
 * gap; hook + arrow on cols 7-13, space-between. On hover the row's hairline
 * darkens to border-strong and both the title and the arrow shift 4px right.
 *
 * No icons — the dot is the icon. No card fill, no box. The four-identical-cards
 * grid is a named anti-pattern and this is what replaces it.
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
      className={`reveal hover-row tg-grid items-center border-t border-border py-12 ${last ? 'border-b' : ''}`}
    >
      <div className="flex items-center gap-[22px]" style={{ gridColumn: '1 / 6' }}>
        <AccentDot solution={solution.slug} />
        <span
          data-shift
          className="hover-shift inline-block text-[length:var(--text-display)] leading-[1.1] font-semibold tracking-[-0.025em]"
        >
          {solution.name}
        </span>
      </div>

      <div
        className="flex items-center justify-between gap-8"
        style={{ gridColumn: '7 / 13' }}
      >
        <p className="max-w-[46ch] text-[length:var(--text-body)] text-secondary">
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
