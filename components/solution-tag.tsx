import { accentForSolution, type SolutionSlug } from '@/config/solutions';
import { cn } from '@/lib/utils';

/**
 * Solution tag / pill. Accent-tinted fill with the accent's -text variant on top
 * — the -text rule applies anywhere an accent renders as small bold text against
 * any light background, not just literal badges.
 *
 * Geist Mono, confirmed for tag labels (DESIGN.md §2's third, optional Mono use).
 * Radius 6px per the tag step of the scale. Never a button, never interactive.
 */
export function SolutionTag({
  solution,
  label,
  className,
}: {
  solution: SolutionSlug;
  label: string;
  className?: string;
}) {
  const a = accentForSolution(solution);
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[6px] px-[9px] py-[4px]',
        'font-mono text-[0.75rem] font-semibold tracking-[0.08em] uppercase',
        className,
      )}
      style={{ background: a.tint, color: a.text }}
    >
      {label}
    </span>
  );
}

/** The 10px accent dot used by solution rows and the footer's Solutions column. */
export function AccentDot({
  solution,
  size = 10,
  className,
}: {
  solution: SolutionSlug;
  size?: number;
  className?: string;
}) {
  const a = accentForSolution(solution);
  return (
    <span
      aria-hidden
      className={cn('flex-none rounded-full', className)}
      // Dots use the full accent in both themes and never theme-swap.
      style={{ width: size, height: size, background: a.dot }}
    />
  );
}
