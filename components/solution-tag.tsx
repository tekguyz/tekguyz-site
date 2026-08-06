import { accentForSolution, type SolutionSlug } from '@/config/solutions';
import { cn } from '@/lib/utils';

/**
 * The solution tag is a BORDERED pill in the design export, not a bare tint:
 *   border 1px rgba(accent, 0.35) · background rgba(accent, 0.12) · radius 6px
 *   padding 5px 10px · 0.75rem / 700 / 0.1em tracking / uppercase
 *
 * project-card uses a slightly tighter variant — 4px 9px padding and a 0.14
 * background alpha — so the tag reads correctly against the card's surface fill
 * rather than the page canvas.
 *
 * Text uses the accent's -text variant, which is what keeps amber legible
 * (5.92:1 rather than the plain accent's 2.00:1 on white).
 */
export function SolutionTag({
  solution,
  label,
  variant = 'default',
  /** Ink contexts are dark in both themes, so they need fixed values. */
  onInk = false,
  className,
}: {
  solution: SolutionSlug;
  label: string;
  variant?: 'default' | 'card';
  onInk?: boolean;
  className?: string;
}) {
  const a = accentForSolution(solution);
  const alpha = variant === 'card' ? 0.14 : 0.12;

  return (
    <span
      className={cn(
        'inline-block rounded-[6px] text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] uppercase',
        variant === 'card' ? 'px-[9px] py-[4px]' : 'px-[10px] py-[5px]',
        className,
      )}
      style={{
        color: onInk ? a.darkTextHex : a.text,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: `color-mix(in srgb, ${a.dot} 35%, transparent)`,
        background: `color-mix(in srgb, ${a.dot} ${alpha * 100}%, transparent)`,
      }}
    >
      {label}
    </span>
  );
}

/** The accent dot. Full accent in both themes — dots never theme-swap. */
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
