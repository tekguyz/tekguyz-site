import Link from 'next/link';
import { AccentDot } from '@/components/solution-tag';
import type { Solution } from '@/content/solutions';

/**
 * DESIGN.md §4 — replaces solution-card. Full-width row, hairline top border,
 * 48px vertical padding. Accent dot (10px) + display-size title on the left
 * (cols 1-5), one-line hook + arrow on the right (cols 7-12). The gap at col 6
 * is intentional.
 *
 * Hover: title shifts 4px right, arrow shifts 4px right, hairline darkens.
 *
 * No icons — the dot IS the icon. No card fill, no box. The four-identical-cards
 * grid is a named anti-pattern and is exactly what this replaces.
 */
export function SolutionRow({ solution }: { solution: Solution }) {
  return (
    <Link
      href={`/solutions/${solution.slug}`}
      className="hover-row tg-grid items-center border-t border-border py-12"
    >
      <div className="flex items-center gap-[22px]" style={{ gridColumn: '1 / 6' }}>
        <AccentDot solution={solution.slug} />
        <h3 className="hover-shift text-[length:var(--text-display)] leading-[1.1] font-semibold tracking-[-0.025em]">
          {solution.name}
        </h3>
      </div>

      <div
        className="flex items-center justify-between gap-6"
        style={{ gridColumn: '7 / 13' }}
      >
        <p className="max-w-[44ch] text-[length:var(--text-body)] text-secondary">
          {solution.hook}
        </p>
        <span aria-hidden className="hover-shift flex-none text-[1.25rem] text-secondary">
          →
        </span>
      </div>
    </Link>
  );
}
