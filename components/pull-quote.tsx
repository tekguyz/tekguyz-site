import { accentForSolution, type SolutionSlug } from '@/config/solutions';
import { cn } from '@/lib/utils';

/**
 * DESIGN.md §4 — --text-display in Geist 600, max-width 22ch, NO quotation marks
 * (the copy is a stated outcome, not dialogue), 2px left border in that build's
 * accent, 24px left padding.
 *
 * The only place an accent touches anything larger than a dot or a tag.
 */
export function PullQuote({
  children,
  solution,
  className,
}: {
  children: React.ReactNode;
  solution: SolutionSlug;
  className?: string;
}) {
  const a = accentForSolution(solution);
  return (
    <p
      className={cn(
        'max-w-[22ch] pl-6 text-[length:var(--text-display)] leading-[1.1] font-semibold tracking-[-0.025em]',
        className,
      )}
      style={{ borderLeft: `2px solid ${a.dot}` }}
    >
      {children}
    </p>
  );
}
