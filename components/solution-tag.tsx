import { accentForSolution, type SolutionSlug } from '@/config/solutions';
import { cn } from '@/lib/utils';

/**
 * The Solution tag, Seam form: the lamp dot, then the label in the ground's own
 * text colour. No tinted pill: a lamp is a dot or a field, and a lamp is never
 * text on paper. `variant` and `onInk` are kept for call sites; the ground's
 * scope root (`.on-ink` / `.on-paper`) already resolves the colour.
 */
export function SolutionTag({
  solution,
  label,
  className,
}: {
  solution: SolutionSlug;
  label: string;
  variant?: 'default' | 'card';
  onInk?: boolean;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2 tg-eyebrow text-fg', className)}>
      <AccentDot solution={solution} size={10} />
      {label}
    </span>
  );
}

/** The lamp dot. Same lamp on either ground. */
export function AccentDot({
  solution,
  size = 10,
  className,
  style,
}: {
  solution: SolutionSlug;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const a = accentForSolution(solution);
  return (
    <span
      aria-hidden
      className={cn('flex-none rounded-full', className)}
      style={{ width: size, height: size, background: a.dot, ...style }}
    />
  );
}
