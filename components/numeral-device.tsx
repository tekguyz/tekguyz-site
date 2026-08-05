import { accent, type AccentKey } from '@/config/solutions';

/**
 * DESIGN.md §4 — Process steps only. --text-hero size, accent at 8% opacity,
 * positioned BEHIND the step title. Nothing else on the site gets numbers.
 *
 * Geist Mono, per §2's locked second use.
 */
export function NumeralDevice({ numeral, accentKey }: { numeral: string; accentKey: AccentKey }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -top-[0.35em] -left-[0.08em] font-mono text-[length:var(--text-hero)] leading-none font-bold tabular-nums select-none"
      style={{ color: accent(accentKey).dot, opacity: 0.08 }}
    >
      {numeral}
    </span>
  );
}
