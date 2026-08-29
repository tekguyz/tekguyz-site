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
 * Colours are read from the scope, never re-derived. A surface that stays dark
 * in both themes (`.ink-band`, `.footer-dark`) redeclares `--tg-fg` and
 * `--tg-secondary` at its own root, so this component needs no `onInk` branch
 * and never names a hex — the two used to disagree, and the literal won.
 */
/**
 * `variant="compact"` — added for the homepage fold's build cards, which give
 * this line 222px at 1440px and 190px at 768px. The default line needs 273px,
 * so it wrapped after "checked" and orphaned "minutes ago" on the site's
 * signature component. Two changes, both token values, and NOTHING else about
 * §5's contract moves: the size steps down to `--text-caption` (12px), and the
 * word "checked" is dropped, because on an index card the dot and "Live"
 * already say a check happened and the stamp says when.
 *
 * The two states stay structured differently, which is §5's actual decision —
 * verified splits into an ink-weighted "Live" plus a muted stamp, unreachable
 * stays a single muted string. Compact's unreachable string drops the stamp
 * entirely: at 12px "Temporarily unreachable · 32 minutes ago" is still wider
 * than the card, and the age of a failed check is not information a visitor
 * scanning four cards can use.
 *
 * `default` renders identically to what shipped before this prop existed —
 * verified by computed style, not assumed. See the class-order note below for
 * the one way that quietly stopped being true.
 */
export function StatusLine({
  result,
  variant = 'default',
  className,
}: {
  result: StatusResult;
  variant?: 'default' | 'compact';
  className?: string;
}) {
  const live = result.status === 'live';
  const compact = variant === 'compact';

  // Server and first client render both produce the absolute stamp; the
  // relative one is only ever computed after hydration, so the swap is an
  // update rather than a mismatch. `useSyncExternalStore` is the hook that
  // expresses "server value, then client value" without a setState-in-effect.
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  const stamp = hydrated ? relativeTime(result.checkedAt) : absoluteTime(result.checkedAt);

  const fg = 'var(--tg-fg)';
  const dim = 'var(--tg-secondary)';

  return (
    <p
      className={cn(
        /* THE FONT-SIZE CLASS COMES FIRST, AND THAT ORDER IS LOAD-BEARING.
           `cn()` is tailwind-merge, and a `text-*` size utility conflicts with
           `leading-*`: whichever is passed LATER wins, so a font-size argument
           placed after the base string DELETES `leading-[1.55]` before it ever
           reaches the DOM. Measured when this prop was first written that way —
           every StatusLine on the site, `default` included, silently rendered a
           22.4px line box (the inherited 1.6) instead of 21.7px. Same mechanism
           as `button.tsx`'s dropped `leading-none`; the fix is the same shape. */
        compact ? 'text-[length:var(--text-caption)]' : 'text-[0.875rem]',
        'flex items-center gap-2 font-mono leading-[1.55] tracking-[0.04em] tabular-nums',
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
          <span style={{ color: dim }}>{compact ? `· ${stamp}` : `· checked ${stamp}`}</span>
        </>
      ) : (
        <span style={{ color: dim }}>
          {compact ? 'Unreachable' : `Temporarily unreachable · checked ${stamp}`}
        </span>
      )}
    </p>
  );
}
