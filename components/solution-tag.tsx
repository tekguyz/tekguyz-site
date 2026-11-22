import { accentForSolution, type SolutionSlug } from '@/config/solutions';
import { getSolution } from '@/content/solutions';
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
  // The Solution's own name, in normal case ("AI Voice Agents"). The `tag`
  // fields in content are capitals for the OG cards; on the page they read as
  // a shouted kicker, and over "AI Voice Receptionist" they said "AI voice"
  // twice in caps (#98). `label` stays the fallback for an unknown slug.
  const name = getSolution(solution)?.name ?? label;
  return (
    <span className={cn('inline-flex items-center gap-2 tg-eyebrow text-fg', className)}>
      <AccentDot solution={solution} />
      {name}
    </span>
  );
}

/**
 * The lamp dot. Same lamp on either ground. 7px beside 14-16px text (#98:
 * at 10px it read as a capital O; sizes had drifted to 6, 8, 9 and 10). The
 * footer keeps its own 6px.
 */
export function AccentDot({
  solution,
  size = 7,
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
