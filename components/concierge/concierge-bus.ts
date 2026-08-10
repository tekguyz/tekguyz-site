'use client';

import { useEffect, useSyncExternalStore } from 'react';

/**
 * A one-event bus so the closing CTA's quiet text link can open the concierge
 * panel without threading a provider through every page.
 *
 * Deliberately not React context: the panel is mounted once in the root layout
 * and the only cross-tree interaction is "open" — a context provider would be
 * more machinery than the single message justifies.
 */
export const CONCIERGE_OPEN_EVENT = 'tg:open-concierge';

export function openConcierge() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(CONCIERGE_OPEN_EVENT));
}

/* -------------------------------------------------------------- suppression */

/**
 * The launcher's SECOND yield input, and the reason it is a separate mechanism
 * from the first.
 *
 * Input one is an IntersectionObserver over `[data-primary-cta]` — geometric,
 * scroll-driven, and deliberately scoped to two elements because widening it
 * makes the launcher flicker on any scroll-heavy route (M-06 / M-15).
 *
 * An open nav drawer (D-01) and an expanded FAQ row (D-02) are neither
 * geometric nor scroll-driven: they are discrete booleans set by a user action
 * and they carry none of the flicker risk. Observing them would mean widening
 * the target set — reintroducing exactly the problem that scope prevents — so
 * they arrive as app state instead, on this channel, and the launcher ANDs the
 * two inputs together.
 *
 * A counted Set rather than a boolean: two suppressors can overlap (a drawer
 * opened over a page whose FAQ row is expanded), and the last one to close must
 * be the one that releases the launcher. `useSyncExternalStore` rather than
 * context so a component anywhere in the tree can feed it without the root
 * layout knowing the channel exists.
 */
const suppressors = new Set<symbol>();
const listeners = new Set<() => void>();
let suppressed = false;

function sync() {
  const next = suppressors.size > 0;
  if (next === suppressed) return;
  suppressed = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => suppressed;
/** The launcher never renders suppressed on the server — nothing is open yet. */
const getServerSnapshot = () => false;

/**
 * Suppress the launcher for as long as `active` is true. The token is created
 * inside the effect, so mount/unmount and the false→true→false cycle both go
 * through the same add/remove pair and a component can never leak a suppressor.
 */
export function useSuppressLauncher(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const token = Symbol('launcher-suppressor');
    suppressors.add(token);
    sync();
    return () => {
      suppressors.delete(token);
      sync();
    };
  }, [active]);
}

export function useLauncherSuppressed() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
