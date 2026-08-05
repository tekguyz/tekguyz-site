import { relativeTime } from '@/lib/utils';
import type { StatusResult } from '@/lib/status';
import { cn } from '@/lib/utils';

/**
 * DESIGN.md §5 — the signature component. Replaces the decorative LIVE badge.
 *
 * Every competitor's badge is a graphic asserting a fact. This one reports the
 * result of a real HEAD request. The dot colors sit below the 3:1 non-text
 * contrast threshold; that is accepted deliberately because the text label
 * beside them carries the same information independently.
 */
export function StatusLine({
  result,
  className,
}: {
  result: StatusResult;
  className?: string;
}) {
  const live = result.status === 'live';
  const stamp = relativeTime(result.checkedAt);

  return (
    <p
      className={cn(
        'flex items-center gap-[10px] font-mono text-[0.875rem] tracking-[0.04em]',
        className,
      )}
      title="We check every demo hourly. This is the real status, not a badge."
    >
      <span
        aria-hidden
        className={cn('h-[6px] w-[6px] flex-none rounded-full', live && 'status-dot-live')}
        style={{ background: live ? 'var(--tg-success)' : 'var(--tg-muted-soft)' }}
      />
      {live ? (
        <span className="font-semibold text-fg">Live</span>
      ) : (
        <span className="text-secondary">Temporarily unreachable</span>
      )}
      <span className="tabular text-secondary">· checked {stamp}</span>
    </p>
  );
}
