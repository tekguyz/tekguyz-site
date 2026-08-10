'use client';

import { useSyncExternalStore } from 'react';
import { relativeTime, cn } from '@/lib/utils';
import type { StatusResult } from '@/lib/status';

/**
 * Deterministic on both sides of hydration: fixed UTC, no locale, no timezone
 * lookup. `relativeTime` cannot be — the elapsed interval differs between
 * prerender and hydration, which is the #418 this replaces. An absolute stamp
 * is never wrong, only less friendly, so first paint is complete on its own.
 */
/** The stamp never changes after mount, so there is nothing to subscribe to. */
const subscribeNever = () => () => {};

function absoluteTime(from: number): string {
  const d = new Date(from);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `at ${hh}:${mm} UTC`;
}

/**
 * The signature component. Replaces the decorative LIVE badge everywhere.
 *
 * Export values: gap 8px · 0.875rem · line-height 1.55 · 0.04em tracking ·
 * tabular numerals · 6px dot.
 *
 * The two states are structured differently on purpose, and the export is
 * explicit about it: verified splits into an ink-weighted "Live" plus a muted
 * timestamp, while unreachable is a SINGLE muted string. An unreachable demo
 * loses the ink weight entirely — a HEAD request timing out is not a failure
 * state for the visitor, so it doesn't get emphasis or an error color.
 *
 * `onInk` covers the home ink band and any other surface that stays dark in
 * both themes, where the theme-aware tokens would resolve to light-mode values.
 */
export function StatusLine({
  result,
  onInk = false,
  className,
}: {
  result: StatusResult;
  onInk?: boolean;
  className?: string;
}) {
  const live = result.status === 'live';

  // Server and first client render both produce the absolute stamp; the
  // relative one is only ever computed after hydration, so the swap is an
  // update rather than a mismatch. `useSyncExternalStore` is the hook that
  // expresses "server value, then client value" without a setState-in-effect.
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  const stamp = hydrated ? relativeTime(result.checkedAt) : absoluteTime(result.checkedAt);

  const fg = onInk ? '#F5F5F5' : 'var(--tg-fg)';
  const dim = onInk ? '#9CA3AF' : 'var(--tg-secondary)';

  return (
    <p
      className={cn(
        'flex items-center gap-2 font-mono text-[0.875rem] leading-[1.55] tracking-[0.04em] tabular-nums',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn('h-[6px] w-[6px] flex-none rounded-full', live && 'status-dot-live')}
        style={{ background: live ? 'var(--tg-success)' : 'var(--tg-muted-soft)' }}
      />
      {live ? (
        <>
          <span className="font-semibold" style={{ color: fg }}>
            Live
          </span>
          <span style={{ color: dim }}>· checked {stamp}</span>
        </>
      ) : (
        <span style={{ color: dim }}>Temporarily unreachable · checked {stamp}</span>
      )}
    </p>
  );
}
