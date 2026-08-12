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

## 2. The finding that invalidates the original discriminator — on 7 of 8 routes

**`overlapsAtMaxScroll` is degenerate on every route that ends in `closing-cta`,
which is 7 of the 8 route patterns. On those routes its emptiness is not
evidence. On `/contact` it is.**

`scripts/audit-mobile.ts:517-548` measures overlaps a second time at maximum
scroll, on the stated reasoning that at the bottom of the document there is
nowhere left to scroll an overlap out from under a fixed launcher. Prompt 10
read that field as empty and concluded all 143 pairs were transient.

`components/closing-cta.tsx:98` is one of the two `[data-primary-cta]` elements
the launcher's IntersectionObserver watches. Where that element is in view at
maximum scroll, **the launcher is already yielded** — `opacity: 0`,
`pointer-events: none`, `aria-hidden="true"`, `tabIndex={-1}` — and the probe
intersects rectangles against a launcher that is not presented. The test cannot
fail there regardless of what sits under the launcher's corner.

**`<ClosingCta />` renders on exactly 7 route patterns** — `/`, `/privacy`,
`/process`, `/solutions`, `/solutions/[slug]`, `/work`, `/work/[slug]` —
measured by direct grep for the JSX element, 2026-08-11. **`/contact` has none:**
the design export has no closing CTA there because the page itself is the ask
(`docs/PROGRESS.md:1538`). An earlier draft of this spec asserted "every route's
bottom carries `closing-cta`" on the strength of a filename grep that matched
two prose comments in `app/contact/page.tsx`; that assertion was false and is
corrected here.

**`/contact` is therefore the non-degenerate case, and it is the strongest one
available for the footer class.** Its only `[data-primary-cta]` elements are the
form's step and submit buttons (`components/contact-form.tsx:294,412`), which sit
near the top of the page. If they are out of view at maximum scroll, the launcher
is *presented* there, and Prompt 10's empty max-scroll reading on `/contact` is a
real measurement rather than a degenerate one.

That result generalises to the footer on every route, and the reason is
geometric: at maximum scroll the document's bottom edge aligns with the
viewport's, `footer-dark` is the last element on every route, and its height is
route-independent. **The bottom band of the viewport at maximum scroll is the
same on all 18 routes.** What differs is only whether `closing-cta` is *also* in
view and yielding the launcher.

The degeneracy still matters for the other three classes, and for the footer at
viewports where §4's precondition fails. It is the same class of error as D-02,
one level up: a partition resting on a check that structurally cannot produce the
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

**Provisional decision: those criteria stand unchanged and no scroll-bottom
feeder is added — conditional on P1 below, which is unmeasured.**

The reasoning is not that the wording binds us. It is that the bottom of the
document is the one place a permanent-at-rest overlap could live, and on the 7
`closing-cta` routes it is already covered by the terminal yield that CTA
produces. Adding a scroll-derived feeder would reintroduce precisely the flicker
risk the two-channel split exists to prevent, to solve a case already solved.

**That argument rests on an unmeasured precondition, and is void without it:**

> **P1 — `[data-primary-cta]` is intersecting the viewport at maximum scroll.**

If `footer-dark` is taller than the viewport, `closing-cta` is pushed out of view
at maximum scroll, the observer releases, **the launcher is re-presented, and
footer and prev/next overlaps can persist at rest** — the exact case this section
would otherwise declare impossible. `footer-dark` stacks a masthead, a tagline, a
link column, a social row that wraps at narrow widths, and a divider; at 360, 375
and 390 its height against those viewports is not obviously smaller. **This is
the failure mode the no-feeder decision must survive, not an edge case appended
to it.**

So `[data-primary-cta]` intersection state at maximum scroll becomes **a measured
field, recorded per route × viewport**, alongside the launcher's own presented
state. §4's conclusion is drawn *after* that field is read, never asserted ahead
of it.

- **If P1 holds at every route × viewport:** the no-feeder decision stands as
  argued.
- **If P1 fails anywhere:** that route × viewport pair is a genuine
  static-at-rest case with no user action behind it — the case the delegated
  question anticipated. It is **named individually in the report and the row and
  left open for a decision**, not absorbed into a mechanism chosen before the
  data existed. Pre-committing a fix to an unmeasured case is how the original
  partition went wrong; so is pre-committing a *refusal* to fix one.

`data-primary-cta` is not widened under any outcome.

## 5. Expected outcome, stated in advance

All four classes are expected to land **transient, accepted** — the same verdict
the row currently carries, reached through a valid discriminator instead of an
invalid one. Meta-rail and inline `link-underline` are mid-page by construction;
prev/next nav and the footer sit below the closing CTA and are expected to be
reached only while the launcher is yielded.

**That expectation is conditional on P1 (§4) and is not load-bearing.** If the
footer outgrows the viewport at 360–390, prev/next and footer are expected to
land **static** at those viewports and the plan changes shape. Both outcomes are
written down here so neither can be presented afterwards as the one that was
anticipated.

Stating the expectation in advance is deliberate: it makes a contradicting
measurement visible as a contradiction rather than something to be rationalised.

**If that expectation holds, no application code changes.** The deliverable is a
corrected basis and a corrected row. That is the honest outcome of the task, not
a shortfall against it.

## 6. Method

**Ordering is load-bearing.** The two measurements that can invalidate §4 run
**before** any probe-building or class verdict, because either one changes the
shape of the rest:

1. **`footer-dark` height against the viewport at 360, 375 and 390** — does it
   push `closing-cta` out of view at maximum scroll? (P1)
2. **`/contact` at maximum scroll** — the non-degenerate case: is the launcher
   presented there, and does anything overlap it?

Only once both are known does the probe get built and the four classes get
verdicts.

- **Runner:** `node --experimental-strip-types`, from inside the project
  directory. **The real script is confirmed working end-to-end, 2026-08-11** —
  `node --experimental-strip-types scripts/audit-mobile.ts sweep` passed its own
  stylesheet guard (`status 200`, 46759 bytes, 2 `.tg-pin` rules) and measured 20+
  route × viewport rows before being stopped. Not a bare `launch()` smoke test;
  the actual harness.

  **What fixed it was reinstalling the browsers** — `playwright install chromium
  --with-deps` and `playwright install chromium-headless-shell`. Prompt 14's
  "browser launch fails on this machine" and the earlier `MODULE_NOT_FOUND` were
  a missing/incomplete headless-shell install plus cwd resolution, not a defect
  in the harness.

  **`docs/PROGRESS.md:1182` attributes the failure to Bun's stdio handling
  breaking `--remote-debugging-pipe` on Windows. That mechanism is not verified
  here and must not be repeated as established.** What is measured is narrower
  and runner-shaped: post-reinstall, bare `chromium.launch()` succeeds under node
  (151.0.7922.34) and still times out at 60s under Bun. That is consistent with
  the Bun explanation but does not establish the stated cause, and an incomplete
  install was an equally plausible account of the original symptom. **PROGRESS.md
  records the browser reinstall as the fix; the Bun mechanism stays flagged as
  unverified.**
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

## 7. Positive control — the probe proves itself before it is trusted

**A discriminator that has never emitted `static` has not been shown able to.**
The old one could not, and that is the whole finding of §2. The replacement must
not be trusted on four unmeasured classes until it is shown to produce both
verdicts.

**Control case: reproduce D-02's pre-fix geometry.** `/contact` with an FAQ
accordion expanded, with the `concierge-bus` suppression temporarily disabled so
the launcher is presented over the expanded body text — the exact state D-02
recorded on a phone before Prompt 13 shipped the channel.

- **Pass:** the probe emits `static` for that pair.
- **Fail:** the probe cannot detect the one overlap already known to be static,
  and **no verdict it produces on the four classes may be reported.**

The suppression is disabled for the control run only, in the probe's own setup,
and restored before any class is measured. The run records that it was disabled,
so a control result can never be mistaken for a shipped-state measurement.

A negative control comes free: any mid-page class the probe calls `transient`
must show a scroll position that clears it, recorded as evidence rather than
asserted.

## 8. Deliverable — and what happens to the existing numbers

1. The probe phase, committed to `scripts/audit-mobile.ts`.
2. The positive-control result (§7), reported before any class verdict.
3. `[data-primary-cta]` intersection state at maximum scroll, per route ×
   viewport — the P1 field (§4).
4. Per-class numbers for all four classes: admitted pairs, peak covered
   fraction, and the transient/static verdict with its evidence.
5. Per CLAUDE.md, any partially resolved class is either qualified in every
   summary or split into its own ID. A class that resolves for three viewports
   and not a fourth is **partial**, not resolved.

### The three documents the rewrite touches

The claim being corrected is duplicated in three places. All three are updated in
the same pass, or the correction lands in one and the old number keeps being
quoted from the others.

| Document | The text being corrected |
| --- | --- |
| `docs/PROGRESS.md` | The Known Gaps row — *"All 143 are transient — 0 at maximum scroll"* and the four-class deferral |
| `docs/DESIGN.md` §8, line 747 | *"All 143 remain transient — 0 at maximum scroll"* |
| `docs/MOBILE-AUDIT.md`, M-06/M-15 banner, line 57 | *"**0 at maximum scroll**, unchanged"* |

**PROGRESS.md's row states, in this order:** that the original partition's basis
was invalid on the 7 `closing-cta` routes and why; that `/contact` is the
non-degenerate case and what it shows for the footer; the replacement
discriminator; the P1 result; the per-class verdicts; that `data-primary-cta` was
not widened; and what remains open.

### Rebaseline or freeze — this commits to freeze

**The historical numbers (143 pairs / 44 above 25% / worst 99.6%, and the Prompt
11 re-read of 140 / 45 / 100.0%) are FROZEN, not rebaselined.** The yielded-state
probe publishes a **separate, named baseline** beside them.

Three reasons:

1. They are a valid measurement of a different quantity — rect intersection
   regardless of the launcher's presented state. Overwriting them would destroy
   the record that the discriminator changed, which is the finding.
2. This repo's convention is already erratum-over-edit. `docs/MOBILE-AUDIT.md`
   states it outright — *"Erratum (2026-08-09), banner-level — the row below it
   is not edited"* — and the D- register carries the same rule.
3. The two baselines are not comparable, so a single moving number would invite
   exactly the false continuity that produced this gap.

So each of the three documents keeps its original figure, gains a dated erratum
naming the degeneracy, and cites the new baseline by name. **No historical number
is edited in place.**

## 9. Risks

- **P1 (§4) can invalidate §4 and part of §5.** This is the largest risk and it
  is why P1 is measured first (§6). If the footer outgrows the viewport at
  360–390, the no-feeder decision falls and the work becomes a mechanism
  question, not a documentation one.
- **The production build may not be reachable** if `prebuild` fails on the known
  off-ratio media guard. The 2026-08-11 confirmation run used `next dev -p 3210`,
  and the report must say which build served each number. A dev build differs in
  chunking, not in the layout geometry this probe reads — but that is an
  assumption, so any P1-boundary result at 360–390 gets re-confirmed against a
  production build before it is written down as a verdict.
- **A targeted probe can miss a class the full sweep would catch.** Mitigated by
  probing the four classes by their actual selectors rather than by route
  sampling, and by reporting the admitted-pair count against the 38 pairs
  (12 + 11 + 9 + 6) the row attributes to them.
- **The positive control (§7) temporarily disables shipped suppression.** It must
  be restored before any class is measured, and the run must record that it was
  disabled — otherwise a control artefact can be read later as a shipped-state
  finding.
- **The row is already long and has twice been summarised into error.** The
  rewrite adds a correction rather than replacing history, consistent with how
  the row's own prior corrections were handled and with the freeze decision in §8.
