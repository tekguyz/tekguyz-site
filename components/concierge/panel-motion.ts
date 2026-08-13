/**
 * The concierge panel's PRESENCE recipe (Build Phase 2). DESIGN.md §4.13.
 *
 * Presence is not state. DESIGN.md §6.1 names the concierge panel and the nav
 * drawer as the two surfaces that genuinely *arrive and leave*, and says they
 * may carry more weight than a row toggle. Until this file existed the panel
 * used `.reveal`'s recipe — fade + 8/12px rise — which is the ENTRANCE layer's
 * gesture, for an element scrolling into view for the first time. The panel
 * does not scroll into view; it is summoned, and it goes away again.
 *
 * Each mode moves from where that surface actually comes from:
 *
 *   Desktop  Scales up from its own bottom-right corner, which is exactly
 *            where the launcher sits (both are anchored right/bottom 24px), so
 *            the panel reads as unfolding out of the button that was just
 *            pressed. Opacity carries the rest. No translate — a corner-
 *            anchored scale already says "from here," and adding a slide would
 *            be two statements about one origin.
 *   Sheet    Rises from the bottom edge it is attached to, full travel, and
 *            does NOT fade: an opaque full-screen surface that fades shows the
 *            page through itself mid-flight, which reads as unfinished rather
 *            than as arriving.
 *
 * **Asymmetric on purpose.** Arriving is the considered moment; leaving is not.
 * Once the visitor has hit close they have already made the decision, and
 * playing the arrival back at them in reverse makes them wait for it. Out is
 * the next duration down, on `--ease-hover` rather than `--ease-entrance` —
 * getting out of the way, not settling into place.
 *
 * **No overshoot**, per the standing v2.2 decision (DESIGN.md §6.1). Both
 * easings hold their control points at or below 1, so neither can overshoot;
 * this was tested against a spring and rejected, and it is not reopened for a
 * panel just because a panel arrives.
 *
 * The numbers mirror the motion tokens in `app/globals.css` because Motion's
 * JS API cannot read a CSS custom property. That duplication is the exact trap
 * `nav.tsx:104` is on the STATUS board for — a value that agrees with its token
 * by coincidence rather than by reference. So it is pinned:
 * `panel-motion.test.ts` parses `globals.css` and fails the build on drift.
 * Change a token, and the test tells you this file is stale.
 */

/** Seconds — Motion's unit. Mirrors `--dur-*` in `app/globals.css`. */
export const PANEL_DUR = {
  /** `--dur-fast` 120ms — colour and opacity only. The desktop panel leaving. */
  fast: 0.12,
  /** `--dur-base` 240ms — the desktop panel arriving; the sheet leaving. */
  base: 0.24,
  /** `--dur-state` 320ms — the sheet arriving. A full-viewport traversal is a
   *  longer trip than a 4% scale, and `--dur-state` is the site's existing
   *  "a box changes size" duration; the sheet is the largest box there is. */
  state: 0.32,
} as const;

/** Motion's `BezierDefinition` — four control-point coordinates, not a list. */
type Bezier = [number, number, number, number];

/** Mirrors `--ease-*` in `app/globals.css`. Neither overshoots. */
export const PANEL_EASE = {
  /** `--ease-entrance` — settles in and stops. */
  entrance: [0.16, 1, 0.3, 1] as Bezier,
  /** `--ease-hover` — gets out of the way. */
  hover: [0.4, 0, 0.2, 1] as Bezier,
} as const;
