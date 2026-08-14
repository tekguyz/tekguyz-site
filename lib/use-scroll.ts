'use client';

import { useEffect, useState } from 'react';

/**
 * The two viewport primitives the nav and the concierge both need, in one place
 * so there is one contract for each rather than two nearly-identical copies.
 *
 * Nothing here is concierge- or nav-specific: both hooks take their whole
 * configuration as an argument, and neither knows what is calling it.
 */

/**
 * `true` once the page is scrolled past `threshold` pixels.
 *
 * The listener is mounted once and never re-created, because `threshold` is
 * expected to be a module-level constant (a number) or a module-level function
 * (a value derived per-event, e.g. from `window.innerHeight`). A function is the
 * form that matters: the concierge's hero threshold is a fraction of the
 * viewport height, which changes on rotation, so it has to be read at event time
 * rather than captured once. Pass a stable reference — an inline arrow would be
 * a new identity every render and would tear the listener down and rebuild it on
 * each one.
 *
 * `onScroll()` runs once on mount so a page restored mid-document (a reload at
 * an anchor, a back-forward restore) reports the right answer before the visitor
 * touches the wheel. The initial state is `false` in both callers and stays that
 * way: it is the value the server renders, and correcting it in the effect is
 * what keeps hydration clean.
 */
export function useScrolledPast(threshold: number | (() => number)): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setPast(window.scrollY > (typeof threshold === 'function' ? threshold() : threshold));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return past;
}

/**
 * Lock body scroll for as long as `active` is true, and **restore whatever was
 * there before** — never clobber with `''`.
 *
 * That is the whole contract, and it is the concierge's, adopted site-wide. An
 * unlock that writes `''` removes any pre-existing inline `overflow` the page
 * had, including one set by another lock that is still meant to be holding; a
 * save-and-restore pair cannot do that, because the value it puts back is the
 * one it found. The two locks on this site are the nav drawer and the
 * concierge's sheet, and while they cannot currently be open at the same time
 * (the sheet's full-screen surface sits over the hamburger at every width where
 * the hamburger is rendered), that is a layout coincidence, not a guarantee —
 * so the safe restore is the one both use.
 *
 * Inactive means *untouched*: the hook writes nothing when `active` is false, so
 * mounting a component that happens to own a closed drawer cannot disturb an
 * inline `overflow` that something else owns.
 *
 * `active` is the caller's whole condition, so a mode-gated lock passes the mode
 * in (`open && sheet`) rather than the hook knowing about modes.
 */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}
