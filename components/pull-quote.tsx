import { accentForSolution, type SolutionSlug } from '@/config/solutions';
import { cn } from '@/lib/utils';

/**
 * Geist 600, 2px left border in that build's accent, 24px left padding,
 * max-width 22ch, no quotation marks — the copy is a stated outcome, not
 * dialogue. (The testimonial is the opposite case: someone else's words, so
 * that one DOES carry real quotation marks.)
 *
 * The export runs two sizes: `display` on canvas contexts (work index, detail
 * pages) and a slightly tighter `band` size on the home ink band, where the
 * quote sits in a narrower column.
 *
 * The only place accent touches anything larger than a dot or tag.
 */
export function PullQuote({
  children,
  solution,
  size = 'display',
  className,
}: {
  children: React.ReactNode;
  solution: SolutionSlug;
  size?: 'display' | 'band';
  className?: string;
}) {
  const a = accentForSolution(solution);
  return (
    <blockquote
      className={cn(
        'max-w-[22ch] pl-6 font-semibold tracking-[-0.03em]',
        size === 'display'
          ? 'text-[length:var(--text-display)] leading-[1.05]'
          : 'text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08]',
        className,
      )}
      style={{
        borderLeft: `2px solid ${a.dot}`,
        color: 'var(--tg-fg)',
        textWrap: 'pretty',
      }}
    >
      {children}
    </blockquote>
  );
}
