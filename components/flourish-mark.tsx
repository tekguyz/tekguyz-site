import { STRIPE_ORDER, accent } from '@/config/solutions';
import { cn } from '@/lib/utils';

/**
 * DESIGN.md §4 — four dots, blue -> violet -> amber -> teal, ONCE per page,
 * near the hero headline. Home only.
 *
 * The home hero renders the animated variant via <SequenceDots> so the dots are
 * the first beat of the load sequence; this static version exists for any
 * non-animated context. DESIGN.md's Do list ("one flourish-mark per page, home
 * only") governs over the closing-CTA entry's parenthetical, so the closing CTA
 * replays the sequence's TIMING without adding a second set of dots.
 */
export function FlourishMark({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('flex items-center gap-[10px]', className)}>
      {STRIPE_ORDER.map((key) => (
        <span
          key={key}
          className="h-[10px] w-[10px] rounded-full"
          style={{ background: accent(key).dot }}
        />
      ))}
    </div>
  );
}
