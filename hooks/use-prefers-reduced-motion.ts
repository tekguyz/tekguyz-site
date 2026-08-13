'use client';

import { useEffect, useState } from 'react';

/**
 * `prefers-reduced-motion: reduce`, read after mount and kept live.
 *
 * **This is a relocation, not a redesign.** The body below is the implementation
 * that shipped in `load-sequence.tsx` (as `useReducedAfterMount`) and was
 * character-identically re-inlined in `process-steps.tsx` — same query, same
 * `change` subscription, same mount-gated initial `false`. It was moved here
 * verbatim on 2026-08-13 so the two copies cannot diverge; nothing about its
 * behaviour was changed in the move, and nothing should be "improved" here
 * without re-verifying both consumers.
 *
 * MOUNT-GATED, AND THAT IS THE LOAD-BEARING PART. The initial state is `false`
 * on both sides of hydration, and the real value arrives from an effect. Reading
 * the media query during render — which is what Motion's `useReducedMotion()`
 * does — resolves `false` on the server and `true` on a client that has the
 * preference set, which is a guaranteed hydration mismatch and one that actually
 * fired in `load-sequence.tsx` before this shape existed.
 *
 * The consequence is deliberate: the first client render always animates-capable
 * and the preference applies one commit later. `load-sequence.tsx` covers that
 * window with the `tg-seq` rule in `globals.css`, which pins those elements
 * visible before JS runs at all.
 *
 * WHY `reveal.tsx` DOES NOT USE THIS, and should not be folded in: its read is a
 * one-shot `.matches` inside the effect with no `change` listener, because it
 * decides whether to arm an IntersectionObserver at all rather than tracking a
 * value across a component's life. Subscribing there would raise a question this
 * hook does not answer — what happens to already-revealed elements when the
 * preference flips mid-route. Left as its own implementation on purpose
 * (docs/audits/2026-08-13-component-audit.md, finding #1).
 *
 * Note for verification on this machine: Windows animations are off
 * (`MinAnimate = 0`), so this returns `true` here after mount. An inert entrance
 * is the expected local result, not a defect — see CLAUDE.md.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return reduced;
}
