import { accentForSolution, type SolutionSlug } from '@/config/solutions';
import { cn } from '@/lib/utils';

/**
 * Geist 600, 2px left border in that build's accent, 24px left padding,
 * no quotation marks — the copy is a stated outcome, not dialogue. (The
 * testimonial is the opposite case: someone else's words, so that one DOES
 * carry real quotation marks.)
 *
 * Two sizes: `display` on canvas contexts (work index, detail pages) and a
 * larger `band` size on the home ink band, where the quote sits in a narrower
 * column. `display` moved from `--text-display` (56px, 22ch) to `--text-subhead`
 * (36px, 30ch) on 2026-10-07: a 95-character quote wrapped to 6-7 lines and
 * was 353-412px tall, about 40% of each /work row.
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
        'pl-6 font-semibold tracking-[-0.03em]',
        size === 'display'
          ? 'max-w-[30ch] text-[length:var(--text-subhead)] leading-[1.15]'
          : 'max-w-[22ch] text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08]',
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
