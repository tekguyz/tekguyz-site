# Partitioning the four untouched launcher-overlap classes

**Date:** 2026-08-11
**Scope:** The Known Gaps row *"44 launcher overlaps above 25% remain on non-CTA
elements"*, specifically its four untouched classes — `/work/[slug]` meta-rail
links (12), inline `link-underline` text links (11), prev/next case-study nav
(9), footer links (6).
**Out of scope:** the `/contact` FAQ accordion class (already shipped through the
suppression channel by Prompt 13), and widening `data-primary-cta` — explicitly
forbidden.

---

## 1. Why this is a re-measurement and not a fix pass

The row directs that the 44 pairs be re-partitioned into *transient-during-scroll*
(accepted, documented) and *static-after-user-action* (fixed through the
suppression channel). One class — the FAQ accordion — has already been through
that partition and shipped. The other four have not been re-measured at all.

The row also records why the partition has to be redone rather than trusted:
D-02 disproved the original claim that *"all 143 are transient"* by producing a
static overlap from an expanded accordion. The partition was drawn once, wrongly.

## 2. The finding that invalidates the original discriminator

**`overlapsAtMaxScroll` cannot report a hit on any route, so its emptiness is
not evidence.**

`scripts/audit-mobile.ts:517-548` measures overlaps a second time at maximum
scroll, on the stated reasoning that at the bottom of the document there is
nowhere left to scroll an overlap out from under a fixed launcher. Prompt 10
read that field as empty and concluded all 143 pairs were transient.

But every route's bottom carries `closing-cta`, and `components/closing-cta.tsx:98`
is one of the two `[data-primary-cta]` elements the launcher's IntersectionObserver
watches. At maximum scroll that element is in view, so **the launcher is already
yielded** — `opacity: 0`, `pointer-events: none`, `aria-hidden="true"`,
`tabIndex={-1}`. The probe intersects rectangles against a launcher that is not
presented.

The test therefore cannot fail, on any route, regardless of what sits under the
launcher's corner. An empty result is the expected output of a degenerate test,
not a measurement of transience. This is the same class of error as D-02, one
level up: a partition resting on a check that structurally cannot produce the
other answer.

A second, smaller defect in the same probe: the mid-scroll loop
(`audit-mobile.ts:486-516`) also intersects rects without consulting the
launcher's presented state. Pairs sampled while the launcher is mid-fade, or
fully yielded, are counted at full rect area. The recorded "worst 99.6%" is a
rectangle fact and may not be a visibility fact.

## 3. The replacement discriminator

Replace *"does the overlap survive to maximum scroll"* with:

> **Is the launcher actually presented at the scroll position where this overlap
> peaks, and is there a scroll position reachable from there that clears it?**

At each scroll step the probe reads the launcher's computed `opacity` and
`pointer-events` alongside the rects. An overlap pair is admitted only when the
launcher is opaque and hit-testable at that step. Admitted pairs classify as:

- **Transient** — the overlap exists only at scroll positions the user passes
  through, and scrolling in either direction clears it. Accepted, documented.
- **Static** — the overlap persists with the launcher presented and no reachable
  scroll position clears it; or it is produced by a discrete state (drawer,
  accordion) and persists at rest. Feeds the suppression channel.

Both halves are measured, so a class landing in either bucket does so on
evidence.

## 4. What feeds the suppression channel

`components/concierge/concierge-bus.ts` admits *"discrete booleans set by a user
action"* that *"carry none of the flicker risk"* of a widened observer.

**Decision: those criteria stand unchanged, and no scroll-bottom feeder is
added.** The reasoning is not that the wording binds us — it is that the finding
in §2 removes the case that would have justified widening. The bottom of the
document is the one place a permanent-at-rest overlap could live, and it is
already covered by the terminal yield the closing CTA produces. Adding a
scroll-derived feeder would reintroduce precisely the flicker risk the two-channel
split exists to prevent, in order to solve a case that is already solved.

If measurement contradicts this — a pair static with the launcher presented — it
is **named individually in the report and the row, and left open for a decision**,
not absorbed into a mechanism chosen before the data existed. Pre-committing a
fix to an unmeasured case is how the original partition went wrong.

`data-primary-cta` is not widened under any outcome.

## 5. Expected outcome, stated in advance

All four classes are expected to land **transient, accepted** — the same verdict
the row currently carries, reached through a valid discriminator instead of an
invalid one. Meta-rail and inline `link-underline` are mid-page by construction;
prev/next nav and the footer sit below the closing CTA and are expected to be
reached only while the launcher is yielded.

Stating the expectation in advance is deliberate: it makes a contradicting
measurement visible as a contradiction rather than something to be rationalised.

**If that expectation holds, no application code changes.** The deliverable is a
corrected basis and a corrected row. That is the honest outcome of the task, not
a shortfall against it.

## 6. Method

- **Runner:** `node --experimental-strip-types`, not Bun. Confirmed on this
  machine 2026-08-11: chromium 151.0.7922.34 launches, page created, content read
  back. Under Bun, `launch()` times out with the process spawned — the constraint
  is already recorded at `docs/PROGRESS.md:1182` and is Bun's stdio handling
  breaking `--remote-debugging-pipe` on Windows. **Prompt 14's note that the
  audit script "could not run (Playwright browser launch fails on this machine)"
  describes the Bun invocation only and is superseded.**
- **Target:** a production build served locally (`bun run build`, then
  `next start -p 3210` — `AUDIT_BASE` defaults to `http://localhost:3210` while
  `next start` defaults to 3000, so the port must be passed explicitly). A dev
  build is acceptable only if the production path is blocked, and the report must
  say which was used. Per CLAUDE.md, confirm the served HTML's stylesheet returns
  200 before drawing any conclusion — a stale server on that port serves a
  previous build.
- **Route selection is selector-driven, not guessed.** First locate each of the
  four classes by its actual selector across `ROUTES`, then probe only the
  routes where that class renders. Meta-rail and prev/next are `/work/[slug]`;
  the inline `link-underline` and footer route sets are to be discovered, not
  assumed. Not the full 18 × 7 sweep — this is a targeted re-measurement of four
  classes, not a new site sweep.
- **Viewports:** the existing `VIEWPORTS` list, which is where the launcher
  overlaps were found.
- **Probe placement:** a new phase in `scripts/audit-mobile.ts` rather than a
  throwaway script, so the result is re-runnable and the yielded-state fix
  benefits the existing occlusion phase too.
- **Reduced motion:** the machine matches `reduce` (`MinAnimate = 0`). The yield
  transition is `.tg-yield`, which `reduce` sets to `transition: none` — so the
  launcher's presented state resolves instantly here, which makes the
  opacity read *cleaner*, not less valid. Confirm the yielded/presented reading
  is binary in the captured data and say so.

## 7. Deliverable

1. The probe phase, committed.
2. Per-class numbers for all four classes: admitted pairs, peak covered
   fraction, and the transient/static verdict with its evidence.
3. The Known Gaps row rewritten to state, in this order: that the original
   partition's basis was invalid and why; the replacement discriminator; the
   per-class result; that `data-primary-cta` was not widened; and what remains
   open, if anything.
4. Per CLAUDE.md, any partially resolved class is either qualified in every
   summary or split into its own ID. A class that resolves for three viewports
   and not a fourth is **partial**, not resolved.

## 8. Risks

- **The production build may not be reachable** if `prebuild` fails on the known
  off-ratio media guard. Fall back to `bun run start` on an existing `.next`, or
  to dev, and state which.
- **A targeted probe can miss a class the full sweep would catch.** Mitigated by
  probing the four classes by their actual selectors rather than by route
  sampling, and by reporting the admitted-pair count against the 38 pairs
  (12 + 11 + 9 + 6) the row attributes to them.
- **The row is already long and has twice been summarised into error.** The
  rewrite adds a correction rather than replacing history, consistent with how
  the row's own prior corrections were handled.
