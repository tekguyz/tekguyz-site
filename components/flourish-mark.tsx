import { STRIPE_ORDER, accent } from '@/config/solutions';
import { cn } from '@/lib/utils';

/**
 * Four dots, blue -> violet -> amber -> teal. 9px each, 9px gap.
 *
 * The design export places these at the top of EVERY route's first section —
 * home, solutions, work, both detail types, process and contact — not home
 * only. DESIGN.md's "one flourish-mark per page, home only" describes an
 * earlier pass; the export is ground truth, and "one per page" still holds.
 */
export function FlourishMark({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('flex items-center gap-[9px]', className)}>
      {STRIPE_ORDER.map((key) => (
        <span
          key={key}
          className="h-[9px] w-[9px] rounded-full"
          style={{ background: accent(key).dot }}
        />
      ))}
    </div>
  );
}
