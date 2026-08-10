# Mobile & Motion Audit — measured inventory

*Prompt 7, 2026-08-08. **Measurement only. Nothing on the site was changed by this
pass.** No finding row states a cause; everything inferred is quarantined in
[Hypotheses (unverified)](#hypotheses-unverified) at the bottom.*

> ### Status — 16 resolved · 1 partial (M-16) · 2 open (M-07, M-08 at sub-767)
>
> *Corrected 2026-08-10. This banner previously read "all 19 findings closed as of
> Prompt 11 (2026-08-09)". That was false: M-07 and M-08 were resolved at 768/844
> only, the exception was written into the same cell as the word **Resolved**, and
> the next summarisation dropped it. A real-device pass on a Pixel 9A (2026-08-09)
> found both still live at sub-767.*
>
> **Nothing below this banner has been edited.** Every finding row, number and
> hypothesis is exactly as measured at commit `51ee09c`, because this file is the
> record that the fix passes measure *against* — rewriting a row would destroy the
> before/after comparison. Read the rows as "what was true at `51ee09c`", and this
> banner for what is true now.
>
> | Finding | Now | Measured after |
> | --- | --- | --- |
> | **M-01** `page-hero` h1 squeezed, 11 routes | **Resolved** | `/solutions` 144.0 L4 → **704 L1**; `/work` 144.0 L5 → **704 L2**; `/process` → **704 L1**; `/work/[slug]` 212.3–246.0 L6–L7 → **522 L2–L3** |
> | **M-02** `/contact` card + counter | **Resolved** | card 230.0 → **704**; counter 3 lines → **1** |
> | **M-17** `/work` 5px scroll @844 | **Resolved** | **0px**. It was an H-1 consequence, not a separate bug — no `overflow-x: hidden` was shipped |
> | **M-18** footer columns unequal | **Resolved** | 265.2/265.2/125.5 → **249 / 158 / 249** |
> | **M-04** `/contact` trust row, **768/844 rows only** | **Resolved** | 3 lines @768 → **1**; 2 lines @844 → **1**. Its `closing-cta` and sub-767 rows are untouched |
> | **M-07 / M-08** step counter + title, **768/844 rows only** | **Resolved** | both **1 line**. Their sub-767 rows are untouched — **and are reopened, two rows below** |
> | **M-07** step counter, **sub-767 rows** | **Open** (reopened 2026-08-10) | Never fixed. Pre-fix measurement stands: counter rect **44.9 × 44.8 @360**, **2 rendered lines**; one line at 414 and 767. The 768/844 row above remains correct and is **not** reopened |
> | **M-08** step title, **sub-767 rows** | **Open** (reopened 2026-08-10) | Never fixed. Pre-fix measurement stands: title rect **169.1 × 52.8 @360 at 22px**, **2 rendered lines**; single line at 414 and 767. The 768/844 row above remains correct and is **not** reopened |
> | **M-16** orphan lines, **768/844 rows** | **Partial** (never resolved) | `Four ways we help.` L4-in-144px → **L1 in 704px**. Case-study headlines still orphan in a now-deliberate 249px column. No copy changed. **Any cell naming M-16 anywhere in this file says partial — it is not a resolved finding** |
> | **M-03** panel overshoots the top edge, `blocking` | **Resolved** (Prompt 10, 2026-08-09) | `top: -119.0` at 844×390 → **sheet mode, `top: 0`, `overflowsViewportTop: false`**. Panel bound to `max-height: calc(100dvh - 48px)`; **no top overflow at any of the 8 viewports**, close control on-screen at all 8. **No `blocking` finding remains open** |
> | **M-14** 32px close control | **Resolved** (Prompt 10) | 32.0 × 32.0 → **44.0 × 44.0 at all 8 viewports**, grown by padding; the `✕` glyph stays at **16px** |
> | **M-06 / M-15** launcher size + CTA occlusion | **Resolved** (Prompt 10) | Launcher unchanged at 234 × 50 **by decision** — it now *yields*, going to `opacity: 0` / `pointer-events: none` / `aria-hidden` / out of the tab order while a `data-primary-cta` element is in view. Full 162-row sweep re-run: **primary-CTA overlaps 174 → 0** (worst case was 81.1%). **Across all interactive elements 174 → 143, 44 still >25%, worst 99.6%** — five non-CTA element classes the rule deliberately does not cover, itemised in DESIGN.md §8 and tracked as a new gap in PROGRESS.md. **0 at maximum scroll**, unchanged |
> | **M-19** launcher animates under `reduce` | **Resolved** (Prompt 10) | **H-4 confirmed first**, then fixed by removing the entrance rather than pinning it. See §7 H-4 |
> | ~~**M-05, M-09 – M-13**~~ | **Resolved** (Prompt 11) | See the seven rows below — this row is the pre-Prompt-11 state and is kept so the batch's history reads straight |
> | **M-04** `closing-cta` + `/contact`, **sub-767 rows** | **Resolved** (Prompt 11, 2026-08-09) | Both rows stack below 766px with the separators **not rendered** (`display: none`, 0×0 rect) — no dot terminates a line at 360 / 375 / 390 / 414. Both still render **one line, 21.7px, with both 3×3 dots** at 767, 768 and 844. `/contact`'s stack stays left-anchored: all three facts at `left: 24.0` |
> | **M-05** footer masthead, **sub-767** | **Resolved** (Prompt 11) | tagline-bottom → social-top **48.0 → 24.0px** at all four phone widths; social-bottom → divider **32.0px, unchanged**; `socialRow_isLeftAligned: true`, still at the lockup's `left: 24.0`. At ≥767 `wrapped: false` and the social row stays right-aligned — **byte-identical**, only `row-gap` is touched and an un-wrapped row never uses it |
> | **M-09** theme toggle 38×38 | **Resolved** (Prompt 11) | **The 38px box paints** — a 1px hairline at rest that darkens to `border-strong` on hover — so it was **not resized**. Hit area **38×38 → 44×44** by pseudo overlay; all 38 painted pixels unmoved |
> | **M-10** footer links 22.4px | **Resolved** (Prompt 11) | Column `gap: 12px → 22px`, then 44×44 overlays. The arithmetic that forced it: 44 needs 10.8px each side, and two adjacent links expanding into a 12px gap **overlap by 9.6px**. At 22px they tile with 0.4px clearance. **0 overlapping hit areas** measured |
> | **M-11** `a.link-underline`, 17 routes | **Resolved** (Prompt 11) | 20 call sites tiered — **17 standalone (44×44), 3 prose (24×24)**. `Open it in a new tab` renders two ways and got **44 in both**: neither occurrence is mid-sentence. Expansion is `::before` overlay throughout, so no line box moved |
> | **M-12** nav lockup 120.9×30.4 | **Resolved** (Prompt 11) | Hit area 44×44, mark and wordmark unmoved; nearest neighbour is 40px away |
> | **M-13** nav links 23.2px | **Resolved** (Prompt 11) | Hit area 44×44 via `::before` — `::after` is the active-page indicator, which is why the overlay uses the other pseudo. The drawer's sub-768 counterpart (the `hello@` link, not in M-13) was fixed alongside |
>
> **The tap-target sweep, before → after: 2,739 tier failures → 0**, across all
> 18 routes × 7 viewports (× light/dark at `narrow` and `standard`), and
> **0 overlapping hit areas**. **No painted box changed size**: the undersized-box
> inventory is identical at **2,729 instances** before and after, with byte-equal
> width and height on all 162 route/viewport/theme combos — which is the point,
> since §8 expands targets and never resizes them.
>
> **That last number is why phase A cannot verify this fix and phase E exists.**
> Phase A's tap check reads `getBoundingClientRect`, so a pseudo-element hit-area
> expansion is invisible to it and it reports every fixed target as still
> failing. `scripts/audit-mobile.ts taps` hit-tests instead — it probes the tier
> box's corners with `elementFromPoint` and asks who owns each point, which also
> makes an overlap between two invisible targets a measurable result rather than
> an argument.
>
> **`.tg-seq` under `reduce` — re-tested, the pin holds** (Prompt 11,
> `scripts/audit-concierge.ts seq`). This was the half of M-19 that Prompt 10
> left on Prompt 7's reading, and the doubt was specific: the pin is
> `opacity: 1 !important; transform: none !important`, and `transform: none` does
> not beat a `translate`. Measured with the same MutationObserver-armed rAF
> sampler that inverted the launcher's reading: **all 12 `.tg-seq` elements on
> `/` are constant at `opacity: 1` / `transform: none` / `translate: none`** over
> 69–90 sampled frames (~2.7s from DOM insertion) at both `standard` and
> `bp-at`. The same sampler under `no-preference` reads 28–32 distinct opacity
> values and full `matrix(1,0,0,1,0,32) → none` ramps on the same elements, so it
> demonstrably sees the entrance when there is one. **Motion writes `transform`
> here, not `translate`; no `translate: none` pin was needed and none was added.**
>
> **One light/dark difference, and it is not a layout difference.** The original
> audit recorded dark as returning counts identical to light on all 18 routes for
> every check. After Prompt 11 that still holds for every *layout* check — tap
> targets, wrapping and overflow are identical on all 36 route/viewport/theme
> combos — but `/` at 360 returns **1 launcher-occlusion pair in light and 4 in
> dark**, all under 25%, at scroll steps y=960/1440/1920. Those are the home
> solution rows. **Cause not isolated, both under threshold — closed on that
> basis** (2026-08-10). This entry previously asserted a scroll-step timing race
> as the cause; no kill test was ever run against it, and an unverified cause
> stated as fact is exactly what this file's preamble forbids. Recorded rather
> than folded into "identical", because the parity claim is only useful if a
> break in it gets reported.
>
> **Launcher occlusion, re-measured as an observation only** — nothing about the
> yield rule was touched. **143 → 140 pairs, 44 → 45 above 25%, worst 99.6% →
> 100.0%; primary-CTA overlaps remain 0.** Effectively unmoved, as expected: tap
> targets grew by overlay, and overlay area is not in the sweep's rects. The
> recorded gap stands unchanged.
>
> **Erratum (2026-08-09), banner-level — the row below it is not edited.** `/work`'s
> `page-hero` h1 at 767 measures **2 rendered lines, not 1**. The **719.0px width in
> M-01 and §4.3 is correct** and is unchanged by Prompt 8; only the line count was
> misrecorded. `docs/PROGRESS.md` repeated the wrong count in its Prompt 7 summary
> and has been corrected there too.
>
> **H-1 confirmed** by its own kill test before any fix shipped; the diagnostic was
> then reverted and DESIGN.md §8's 8-column layout implemented instead. One thing
> §7's phrasing omits: **the kill test needs `!important`** — it is fighting inline
> `style` attributes. **H-3 resolved** as an H-1 consequence. **H-2 re-measured, not
> acted on**: the clamp still resolves to 46.08px at 768, but with the column now
> full-container no `page-hero` h1 exceeds 2 lines, so it is not a second
> contributor at these widths.
>
> **H-4 CONFIRMED and H-6 CONFIRMED** by Prompt 10 (2026-08-09); **H-5 was not
> tested and is now moot** — its kill test was "reduce the launcher's width and
> re-run the sweep", and the launcher's width was deliberately not reduced. What
> H-5 asked (are M-06 and M-15 one problem?) was answered a different way: yielding
> the launcher without changing its width resolved both, so they share a cause, but
> that cause is the launcher's *presence*, not its width. H-4's confirmation
> required exactly the sampler §7 specified — a `MutationObserver` arming a `rAF`
> loop from DOM insertion. The post-hoc sample it replaced was not merely weak; it
> read the opposite result.

Every number below came out of `scripts/audit-mobile.ts`, which is committed
alongside this file. Re-run it against the same commit and the same numbers come
back. Where a number could not be obtained, that is said plainly in
[What was not measured](#what-was-not-measured-and-why) rather than estimated.

---

## 1. Run environment, and the stylesheet-200 confirmation

**The served stylesheet returned 200.** Checked before any measurement was taken,
and re-checked at the start of every phase — a stale `next start` holding the port
serves HTML referencing chunks that no longer exist, and every number in this file
would be garbage that reads as catastrophic breakage.

```
stylesheet guard: {
  "href":   "/_next/static/chunks/2jhuu8e85udez.css",
  "status": 200,
  "bytes":  33803,
  "tgPinRules": 2
}
```

Both `.tg-pin` rules are present in the served CSS (the `min-width: 1024px` sticky
rule and the `prefers-reduced-motion` `position: static !important` override), which
is the cheapest confirmation that this is the current build and not a previous one.

| | |
| --- | --- |
| Commit under test | `51ee09c` (clean tree; only `docs/MOBILE-AUDIT.md`, `scripts/audit-mobile.ts`, `.gitignore` differ) |
| Build | `bun run build` — exit 0, 45 routes prerendered |
| Server | `bunx next start -p 3210`, port cleared by `Get-NetTCPConnection -LocalPort 3210` first |
| Driver | Playwright 1.62.1 Chromium, headless, under `node --experimental-strip-types` (**not** Bun — Bun's stdio breaks `--remote-debugging-pipe` on Windows) |
| Theme | seeded via `localStorage.theme` before first paint (`next-themes`, `attribute="class"`, `defaultTheme="light"`, `enableSystem={false}`) |
| Machine | Windows 11, `MinAnimate = 0` — OS reduced-motion is ON and **was not changed** |

### Viewports

The harness scans Playwright's `devices` table for a Chromium descriptor whose
viewport matches exactly and which sets `isMobile` and `hasTouch`; **none of the
seven sizes in this matrix matched one**, so all seven are constructed contexts with
`isMobile: true`, `hasTouch: true` and a plausible `deviceScaleFactor`. A resized
desktop context was not used anywhere — it leaves `isMobile`/`hasTouch` at desktop
values, which changes how `dvh` resolves and how tap targets hit-test. The
`descriptor` field is recorded on every row in `.audit/sweep.json`.

| Label | Size | Descriptor source |
| --- | --- | --- |
| `narrow` | 360×800 | constructed, dsf 3 |
| `se` | 375×667 | constructed, dsf 2 |
| `standard` | 390×844 | constructed, dsf 3 |
| `large-phone` | 414×896 | constructed, dsf 2 |
| `bp-below` | 767×1024 | constructed, dsf 2 |
| `bp-at` | 768×1024 | constructed, dsf 2 |
| `landscape` | 844×390 | constructed, dsf 3 |
| `desktop-1440` | 1440×900 | plain desktop context, comparison only |

Coverage: **18 routes × 7 viewports in light = 126 rows**, plus **18 routes × 2
viewports (`narrow`, `standard`) in dark = 36 rows**. 162 rows, **0 errors**.

### Which motion state produced which number

This matters for reading the rest of the file, and it is the one thing this pass
could do that no previous pass could.

- **Every §2/§3/§4 layout number was taken under `reducedMotion: 'reduce'`.** That is
  both the machine's own state and a deliberate choice: an entrance transition
  mid-flight makes a rect a snapshot of an animation, not a layout measurement.
- **Every §5 motion-on number came from Playwright's `reducedMotion: 'no-preference'`
  context override, not from the OS.** Proof it took: inside that context,
  `matchMedia('(prefers-reduced-motion: reduce)').matches === false`, while the OS
  preference was untouched throughout.

---

## 2. Severity rule

Applied once here rather than justified per row.

| Severity | Rule |
| --- | --- |
| `blocking` | A control or its content is unreachable, illegible, or the document scrolls horizontally. |
| `defect` | Measurably violates a value DESIGN.md states (the 44×44 tap-target floor, a documented breakpoint layout), but the page remains usable. |
| `polish` | Meets spec and works; reads badly. |

---

## 3. Findings

| ID | Route | Viewport | Theme | Surface / selector | Symptom (observable) | Measured | How measured | Severity |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **M-01** | `/solutions`, `/work`, `/process`, all 8 `/work/[slug]` — **11 of 18** (not `/`, not `/contact`, not the 4 `/solutions/[slug]`) | `bp-at` 768, `landscape` 844 | light | `page-hero` `h1` inside `.tg-container.tg-grid` | Page headline is squeezed into a narrow left column and wraps to 4–7 lines at near-hero type size, with most of the row's width left empty beside it. `Four ways we help.` stacks as four single-word lines. | h1 width / line count, `bp-at` 768 → `landscape` 844: `/solutions` **144.0px L4 → 144.0px L4** (font 46.08 → 50.64px) · `/work` **144.0 L5 → 144.0 L6** · `/work/team-performance` **212.3 L7 → 278.8 L6** · `/work/restaurant-menu` **212.3 L6 → 278.8 L5** · `/work/field-photo-reports` **246.0 L6 → 322.0 L5** · `/process` **274.1 L2** (no `landscape` h1 row). For contrast, the same `/work` h1 at `bp-below` 767 is **719.0px wide, 1 line**, and `/` and `/contact` — which do not use `page-hero` — measure 522.0 L3 and 371.0 L2 at 768. | `sweep.json` → `wrapping[]`, `elementWidth` + `lineCount` from Range rects per word, grouped by rendered `top` | `blocking` |
| **M-02** | `/contact` | `bp-at` 768, `landscape` 844 | light | contact form card, `form > div.border-b` step header | The form card collapses to roughly a third of its width one pixel above the breakpoint, and the `01 / 02` step counter breaks across three lines with the slash alone on its own line. | Card **230.0px wide at 768** vs **719.0px at 767**. Counter rect **27.7 × 67.2px**, **3 rendered lines** — `01` / `/` / `02`. Header container width **148.0px**. | `surfaces.json` → `contactForm[]`, `cardRect.w`, `stepHeader.counter.lines` | `blocking` |
| **M-03** | all (concierge is global) | `landscape` 844×390 | light | `div[role="dialog"]` | With the panel open, its header — title and the only close button — sits above the top of the viewport and cannot be reached. | Panel **380 × 485px**, `top: -119.0`, `bottom: 366.0`, against a **390px** viewport height. Close button rect is therefore off-screen. `position: fixed`, `bottom: 24px`. | `surfaces.json` → `panel[]` at `844x390`, `panelTop` / `overflowsViewportTop` | `blocking` |
| **M-04** | `closing-cta` on 17 of 18 routes, **plus `/contact`'s own trust column** | `closing-cta`: `narrow`, `se`, `standard`, `large-phone`. `/contact`: those **plus `bp-at` 768 and `landscape` 844** | light + dark, identical | `div.flex.flex-wrap` carrying the three trust facts, in both places | The three trust facts wrap to one-per-line, leaving a 3px dot dangling at the end of lines 1 and 2 rather than separating two visible items. | `closing-cta`: **3 lines, 85.1px tall** at 296.0 / 311.0 / 326.0 / 350.0px wide, vs **1 line, 21.7px** at ≥767. `/contact`: **3 lines, 85.1px** @360 (312.0 wide), @390 (342.0), **and @768 (371.0)**; **2 lines, 53.4px** @844 (418.5); **1 line, 21.7px** @767 (719.0) — so it regresses from one line to three across the 767→768 boundary. Both are `flex-wrap: wrap`, `gap: 10px row / 22px column`. | `surfaces.json` → `closingCta[].trustRow.lines`; `/contact` row re-measured directly with the same Range-rect line count | `defect` |
| **M-05** | all (footer is global) | `narrow`, `se`, `standard`, `large-phone` | light + dark, identical | `footer.footer-dark` masthead, `div.flex.flex-wrap.items-start` | The social row drops below the tagline and left-aligns under it, leaving a wide empty band between the two, then a second gap before the divider. | Masthead `flex-wrap: wrap` **has wrapped**; gap tagline-bottom → social-top **48.0px**; social-bottom → divider-top **32.0px**. Social row `left: 24.0`, identical to the lockup's `left: 24.0` (left-aligned). At ≥767 it does not wrap: social row `left: 565.0`, right-aligned. | `surfaces.json` → `footer[].gaps`, `masthead.wrapped` | `defect` |
| **M-06** | all | every viewport 360 → 1440 | light + dark, identical | `button.fixed.right-6.bottom-6` (concierge launcher) | The launcher renders at exactly the same physical size on a 360px phone as on a 1440px desktop, where it takes up nearly two-thirds of the phone's width. | **234.0 × 50.0px at all eight viewports.** `padding: 16px 24px`, `font-size: 14.5px`, `border-radius: 8px`, `position: fixed`, `right: 24px`, `bottom: 24px`. Share of viewport width: **65.0%** @360 · 62.4% @375 · 60.0% @390 · 56.5% @414 · 30.5% @768 · 27.7% @844 · **16.3% @1440**. | `surfaces.json` → `fab[]` + `fabDesktop[]`, `getBoundingClientRect` + `getComputedStyle` | `defect` |
| **M-07** | `/contact` | `narrow`, `se`, `standard`, `landscape` | light | `form > div.border-b > span` | The `01 / 02` step counter wraps onto two lines, reading `01 /` above `02`. | Counter rect **44.9 × 44.8px** @360, 48.1 × 44.8 @375, 51.2 × 44.8 @390, 31.7 × 44.8 @844 — **2 rendered lines** in each. One line (51.3 × 22.4) at `large-phone` 414 and `bp-below` 767. | `surfaces.json` → `contactForm[].stepHeader.counter.lines` | `defect` |
| **M-08** | `/contact` | `narrow`, `se`, `standard`, `bp-at`, `landscape` | light | `form > div.border-b > p` | The step title `What do you need?` wraps to two lines beside the counter. | **2 rendered lines**, title rect 169.1 × 52.8px @360 (font 22px), 104.3px wide @768. Single line at `large-phone` 414 and `bp-below` 767 (193.0 × 26.4). | `surfaces.json` → `contactForm[].stepHeader.title.lines` | `defect` |
| **M-09** | all 18 | all 7 | light + dark, identical | `components/theme-toggle.tsx` button, `button.flex.h-[38px].w-[38px]` | The theme toggle is smaller than the stated minimum tap target in both dimensions. | **38.0 × 38.0px** against DESIGN.md §8's ≥44×44 floor. 162 of 162 rows. | `sweep.json` → `smallTapTargets[]`, all `a/button/input/select/summary/[role=button]` filtered to visible | `defect` |
| **M-10** | all 18 | all 7 | light + dark, identical | `footer.footer-dark` link rows — Solutions ×4, Company ×4, `hello@tekguyz.com` | Every footer link is half the stated minimum tap-target height, stacked 12px apart. | **22.4px tall** each. Widths: `Smart Operations` 130.0 · `AI Voice Agents` 118.3 · `Business Systems` 134.6 · `Custom Web Apps` 136.3 · `Work` 33.7 · `Process` 51.2 · `Contact` 50.9 · `Privacy` 46.8 · `hello@tekguyz.com` 125.5. Column `gap: 12px`. | `sweep.json` → `smallTapTargets[]` | `defect` |
| **M-11** | **17 of 18** (all but `/privacy`) | all 7 | light + dark, identical | `a.link-underline` in body content | Standalone text CTAs and prev/next links are 18–23px tall. | `Open it in a new tab` **137.1 × 23.2** (block) and **137.1 × 19.0** (inline) · `Read the full story →` **143.3 × 23.2** · `← Work` **50.1 × 18.0** · `← Solutions` **78.1 × 18.0** · `Read it on Google →` **137.4 × 23.2** · `Or ask our AI what we'd build for you` **235.2 × 21.7** (17 routes) | `sweep.json` → `smallTapTargets[]` | `defect` |
| **M-12** | all 18 | all 7 | light + dark, identical | `header a[aria-label="TEKGUYZ home"]` | The nav logo link — the site's home affordance — is 30px tall. | **120.9 × 30.4px** | `surfaces.json` → `nav[].lockup.rect` | `defect` |
| **M-13** | all 18 | `bp-at` 768, `landscape` 844 | light | `header nav a[data-navlink]` | Once the horizontal nav appears at 768, its four links are 23px tall. | `Solutions` **64.0 × 23.2** · `Work` **35.9 × 23.2** · `Process` **54.6 × 23.2** · `Contact` **54.2 × 23.2**. Not present below 768 (`desktopLinksVisible: 0`). | `sweep.json` + `surfaces.json` → `nav[].desktopLinksVisible` | `defect` |
| **M-14** | all (concierge is global) | all 7 + desktop | light | `div[role="dialog"] button[aria-label="Close"]` | The panel's only close control is a 32px square. | **32.0 × 32.0px** at every viewport. | `surfaces.json` → `panel[].closeAffordance.rect` | `defect` |
| **M-15** | **all 18** | all 7 | light + dark, identical | launcher rect ∩ every interactive element, sampled every 0.6 × viewport height | While scrolling, the fixed launcher passes over and covers other controls — including each page's own primary `Let's Talk` button, the footer email link, and footer social icons. | **174 distinct route/element pairs. 65 of them ≥50% covered; 6 fully covered (≥99%).** Fully covered: `hello@tekguyz.com` (125.5 × 22.4) on `/`, `/privacy`, `/solutions/smart-operations`, `/solutions/ai-voice-agents`, `/solutions/business-systems`; one 44 × 44 footer social icon on `/work/ai-voice-receptionist`. Primary CTA worst cases: `/work` `Let's Talk` **81.1%** (6850px²; button 137.1 × 61.6) · `/work/team-performance` **69.4%** · `/solutions/ai-voice-agents` **64.9%** · `/solutions/custom-web-apps` **63.8%** · `/work/auto-detailer` **60.4%**. Launcher rect at each: 234 × 50. **At maximum scroll, where nothing can be scrolled clear any more: 0 overlaps on all 162 rows** — every overlap is transient. | `sweep.json` → `occlusion.overlaps[]` (per scroll step) and `occlusion.overlapsAtMaxScroll[]`, rect intersection | `defect` |
| **M-16** | **all 18** | varies per string, see below | light + dark, identical | headings and prev/next links | 23 distinct strings end on a line holding a single word. | `Record the meeting, get the follow-up automatically.` — L3 @360/375/390/414, **L4 @768 and @844**, last line `automatically.` · `Turn your files and recordings into automatic summaries and a searchable archive.` — **L5 @375/390, L6 @768/844**, last line `archive.` · `Four ways we help.` — **L4 @768/844** in a 144px box, last line `help.` · `Team Performance & Automated Customer Feedback` — L3 @360–768, last line `Feedback` · `Let's talk about your business.` — L2 @375/390/414, last line `business.` Full list of 23 in `.audit/sweep.json`. | `sweep.json` → `wrapping[]` where `orphan === true` | `polish` |
| **M-17** | `/work` | `landscape` 844×390 | light | document | The page scrolls horizontally by 5px, and no element's rect crosses the right edge. | `documentElement.scrollWidth` **849**, `clientWidth` **844**, delta **+5.0px**. `body.scrollWidth` **848**. Widest element rect: `header.sticky` right edge **844.0** — exactly flush. **Zero elements** with `rect.right > clientWidth`. Every other 161 route/viewport/theme row measures **0px overflow**. | `sweep.json` → `overflowPx`, `overflowOffenders` (empty), `widestElementWhenOverflowing` | `defect` |
| **M-18** | all 18 (footer is global) | `bp-at` 768, `landscape` 844 | light | `footer .tg-grid` third column, `div[style="grid-column: 9 / 13"]` | The footer's three columns are unequal — `Get In Touch` is less than half the width of the other two. | @768: **265.2 / 265.2 / 125.5px**. @844: **303.2 / 303.2 / 125.5px**. Computed `grid-template-columns` is **8 explicit tracks at 48.2969px plus 4 implicit tracks at 13.375px**. At ≤767 all three stack to one 312–719px column; at ≥1024 the grid is 12 equal tracks. | `surfaces.json` → `footer[].navGrid.columns[].rect`, `gridTemplateColumns` | `defect` |
| **M-19** | all (concierge is global) | `standard`, `bp-at` | light | `document.getAnimations()` under `reducedMotion: 'reduce'` | With reduced motion requested, `getAnimations()` is not empty — Motion-created `Animation` objects remain on the launcher and on the hero sequence. **No visible movement was observed from them; see the caveat.** | Under `reduce`: **1 `Animation` on 7 of the 8 walked routes** (target `body > button.fixed.right-6.bottom-6`) and **8 on `/`** (hero `.tg-seq` items), at both `standard` and `bp-at`. Sampling the launcher's computed style 8× at 60ms intervals returns **`opacity: 1`, `transform: none` on every sample, every route, both viewports** — `fabMovedUnderReduce: false`, 16 of 16 runs. Declared timing in the motion-on context: 240ms, `cubic-bezier(0.16, 1, 0.3, 1)`, `opacity 0→1` + `y 8→0`. | `motion.json` → `reduce@*`, `runningSample` + `fabSamplesUnderReduce` | `polish` |

### Routes and viewports that produced no findings

Stated rather than omitted, per check:

- **Horizontal overflow — clean on 161 of 162 rows.** All 18 routes at `narrow`,
  `se`, `standard`, `large-phone`, `bp-below`, `bp-at` (light and dark) measure
  `scrollWidth − clientWidth = 0`. At `landscape` all routes measure 0 **except
  `/work`** (M-17).
- **Element-to-viewport-edge — clean on 162 of 162 rows.** No interactive element
  starts within 8px of the left or right edge or is clipped by it, at any route,
  viewport or theme. (An earlier harness pass flagged the `sr-only focus:not-sr-only`
  skip link on all 18 routes; that was a harness false positive — `px-4 py-3`
  overrides `sr-only`'s padding reset, so it reports a 32×24 rect while
  `clip: rect(0px, 0px, 0px, 0px)` keeps it invisible. The check now excludes
  clipped-to-zero elements and the finding is withdrawn.)
- **Input height — clean everywhere.** Every `/contact` control measures **44.0px**
  tall, meeting DESIGN.md §8's "Inputs 44px tall". The `Continue` button is
  **118.8 × 53.2px** — over the floor.
- **Hero right-edge bleed below `md` — clean.** DESIGN.md §8 turns the bleed off
  under 768 and it is off: the home hero media panel's right edge sits **49px inside**
  the viewport at 360/375/390/414/767, and **57px inside** at 768/844. No route
  overflows because of it.
- **Launcher occlusion at the bottom of the page — clean on 162 of 162 rows.** With
  the document scrolled to its maximum, the launcher intersects **zero** interactive
  elements on every route, viewport and theme. Nothing is permanently covered; M-15
  is entirely a mid-scroll condition.
- **`/contact` (11–15) and `/privacy` (12–16) carry the fewest tap-target failures**,
  against 22–26 on `/work`. `/privacy` in particular has **no route-specific layout
  finding at any viewport**: it does not use `page-hero`, so M-01 does not reach it,
  and it is the only route with **zero** in-content `link-underline` failures — its
  count is the shared nav/footer set alone. It also ships **0 `.reveal` hooks**,
  deliberately, per PROGRESS.md.
- **Dark mode adds nothing.** At `narrow` and `standard`, the dark rows return
  **identical counts to light on all 18 routes** for every check. No finding in this
  report is theme-dependent.

Tap-target failures per route (light; dark is identical at `narrow`/`standard`):

| Route | narrow | se | standard | large-phone | bp-below | bp-at | landscape |
|---|---|---|---|---|---|---|---|
| `/` | 18 | 18 | 18 | 18 | 19 | 23 | 23 |
| `/solutions` | 12 | 12 | 12 | 12 | 12 | 16 | 16 |
| `/solutions/smart-operations` | 14 | 14 | 14 | 14 | 14 | 18 | 18 |
| `/solutions/ai-voice-agents` | 14 | 14 | 14 | 14 | 14 | 18 | 18 |
| `/solutions/business-systems` | 14 | 14 | 14 | 14 | 14 | 18 | 18 |
| `/solutions/custom-web-apps` | 14 | 14 | 14 | 14 | 14 | 18 | 18 |
| `/work` | 22 | 22 | 22 | 23 | 24 | 25 | 26 |
| `/work/field-photo-reports` | 18 | 18 | 18 | 18 | 18 | 21 | 22 |
| `/work/ai-voice-receptionist` | 18 | 18 | 18 | 18 | 18 | 21 | 22 |
| `/work/bundle-builder` | 18 | 18 | 18 | 18 | 18 | 21 | 22 |
| `/work/ai-audio-file-insights` | 18 | 18 | 18 | 18 | 18 | 21 | 22 |
| `/work/team-performance` | 20 | 20 | 20 | 20 | 20 | 20 | 22 |
| `/work/meeting-organizer` | 16 | 16 | 16 | 17 | 18 | 20 | 20 |
| `/work/restaurant-menu` | 18 | 18 | 18 | 18 | 18 | 20 | 21 |
| `/work/auto-detailer` | 16 | 16 | 16 | 17 | 18 | 20 | 20 |
| `/process` | 12 | 12 | 12 | 12 | 12 | 16 | 16 |
| `/contact` | 11 | 11 | 11 | 11 | 11 | 15 | 15 |
| `/privacy` | 12 | 12 | 12 | 12 | 12 | 16 | 16 |

73 distinct signatures across 2,707 instances. Every failure is a **height**
failure except the theme toggle (M-09), which fails on both axes.

---

## 4. Named surfaces — raw numbers at every viewport

Reported whether or not a check failed, because the fix prompt needs the values to
move from.

### 4.1 `closing-cta`

Section inner: `div.mx-auto.max-w-[760px]`, `padding: 64px 32px 48px` — **identical
at all seven viewports**. Button `padding: 18px 32px`, `font-size: 16px`,
**137.1 × 61.6px at all seven** (the one documented size exception, unchanged).
Secondary concierge link **235.2 × 21.7px, 1 line, all seven**.

| Viewport | Headline rect | H lines | Subhead rect | S lines | Trust rect | T lines | Stripe |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `narrow` 360 | 296.0 × 67.2 | 2 (`Let's talk about` / `your business.`) | 296.0 × 81.6 | 3 | 296.0 × 85.1 | **3** | 360 × 6 |
| `se` 375 | 311.0 × 67.2 | 2 (`…your` / `business.`) | 311.0 × 81.6 | 3 | 311.0 × 85.1 | **3** | 375 × 6 |
| `standard` 390 | 326.0 × 67.2 | 2 | 326.0 × 81.6 | 3 | 326.0 × 85.1 | **3** | 390 × 6 |
| `large-phone` 414 | 350.0 × 67.2 | 2 | 350.0 × 54.4 | 2 | 350.0 × 85.1 | **3** | 414 × 6 |
| `bp-below` 767 | 696.0 × 36.2 | 1 | 541.0 × 54.4 | 2 | 696.0 × 21.7 | 1 | 767 × 6 |
| `bp-at` 768 | 696.0 × 36.3 | 1 | 541.0 × 54.4 | 2 | 696.0 × 21.7 | 1 | 768 × 6 |
| `landscape` 844 | 696.0 × 39.9 | 1 | 541.0 × 54.4 | 2 | 696.0 × 21.7 | 1 | 844 × 6 |

Trust row is `flex-wrap: wrap`, `gap: 10px` row / `22px` column, three `<span>`s
separated by two 3px `aria-hidden` dots. Where it wraps to three lines the breaks
fall after each fact, so each dot terminates a line rather than separating two
visible items.

### 4.2 `footer-dark`

Constant at every viewport: container `padding-top: 40px`; masthead
`gap: 48px`, `justify-content: space-between`, `align-items: flex-start`,
`flex-wrap: wrap`; social icons **44 × 44px each**, 4 of them, row **188 × 44px**,
`align-items: center`; divider `border-top: 1px rgb(42,42,44)` with
`margin-top: 32px` / `padding-top: 40px`; bottom bar `margin-top: 56px`,
`padding: 24px 0`, height **71.4px**.

| Viewport | Masthead wrapped | tagline→social | social→divider | Social row left | Nav columns rendered | Column widths |
| --- | --- | --- | --- | --- | --- | --- |
| `narrow` 360 | **yes** | **48.0** | 32.0 | 24.0 (= lockup) | **1** | 312.0 |
| `se` 375 | **yes** | **48.0** | 32.0 | 24.0 | **1** | 327.0 |
| `standard` 390 | **yes** | **48.0** | 32.0 | 24.0 | **1** | 342.0 |
| `large-phone` 414 | **yes** | **48.0** | 32.0 | 24.0 | **1** | 366.0 |
| `bp-below` 767 | no | −60.3 (side by side) | 48.3 | 565.0 | **1** | 719.0 |
| `bp-at` 768 | no | −60.3 | 48.3 | 558.0 | **3** | **265.2 / 265.2 / 125.5** |
| `landscape` 844 | no | −60.3 | 48.3 | 634.0 | **3** | **303.2 / 303.2 / 125.5** |

`grid-template-columns` at 768 and 844 computes to
`48.2969px ×8, 13.375px ×4` and `57.7969px ×8, 13.375px ×4` respectively — eight
explicit tracks plus four implicit ones. At ≤767 it is a single track; the
`grid-column: 1 / -1 !important` reset in `globals.css` applies there.

### 4.3 `/contact` form

Constant at every viewport: page container `padding: 96px <side> 128px`; card
`padding: 40px`; field group `gap: 24px`; label→control gap **10.0px**; every
control **44.0px tall**; `Continue` **118.8 × 53.2px**.

| Viewport | Container side pad | Card width | Header width | Title rect / lines | Counter rect / lines | Title→counter gap |
| --- | --- | --- | --- | --- | --- | --- |
| `narrow` 360 | 24 | 312.0 | 230.0 | 169.1 × 52.8 / **2** | 44.9 × 44.8 / **2** | 16.0 |
| `se` 375 | 24 | 327.0 | 245.0 | 180.9 × 52.8 / **2** | 48.1 × 44.8 / **2** | 16.0 |
| `standard` 390 | 24 | 342.0 | 260.0 | 192.8 × 52.8 / **2** | 51.2 × 44.8 / **2** | 16.0 |
| `large-phone` 414 | 24 | 366.0 | 284.0 | 193.0 × 26.4 / 1 | 51.3 × 22.4 / 1 | 39.7 |
| `bp-below` 767 | 24 | 719.0 | 637.0 | 193.0 × 26.4 / 1 | 51.3 × 22.4 / 1 | 392.7 |
| `bp-at` 768 | 32 | **230.0** | 148.0 | 104.3 × 52.8 / **2** | 27.7 × 67.2 / **3** | 16.0 |
| `landscape` 844 | 32 | 249.0 | 167.0 | 119.3 × 52.8 / **2** | 31.7 × 44.8 / **2** | 16.0 |

Step 1 fields measured (`Area of Interest` select, `Name`, `Email`). Step 2 was not
driven — see §8.

### 4.4 Concierge launcher (FAB)

**234.0 × 50.0px, `padding: 16px 24px`, `font-size: 14.5px`, `border-radius: 8px`,
`position: fixed`, `right: 24px`, `bottom: 24px`, `z-index: 80`, `gap: 10px` —
byte-identical at 360, 375, 390, 414, 767, 768, 844 and 1440.**

Measured distance to the viewport's right edge: **24.0px**; to its bottom edge:
**24.0px**, at every viewport. **No `env(safe-area-inset-*)` appears in any CSS
declaration matching this element** — the check enumerated every matching author
rule for `inset`, `top`/`right`/`bottom`/`left`, `padding*` and `margin*` and
returned zero declarations containing `env(`.

The launcher is absent above `window.innerHeight × 0.85` by design; it was scrolled
into existence before every measurement. It was reachable on **all 18 routes** at
every viewport.

### 4.5 Concierge panel, opened

**Height resolves from no height declaration at all.** Tracing every author rule
that matches `div[role="dialog"]` for `height` / `max-height` / `min-height`
returns **none**; the only size declarations that match are
`.w-\[380px\] { width: 380px }` and
`.max-w-\[calc\(100vw-48px\)\] { max-width: calc(-48px + 100vw) }`. The rendered
485px is content height, floored and capped by the message list
(`.min-h-\[300px\] { min-height: 300px }`, `.max-h-\[420px\] { max-height: 420px }`).
**No `vh` and no `dvh` anywhere in the panel's height chain.**

| Viewport | Panel rect | top | bottom | List rect | Input rect | → panel bottom | → viewport bottom |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `narrow` 360×800 | 312 × 485 | 291.0 | 776.0 | 310 × 300 | 198.2 × 44 | 17.0 | 41.0 |
| `se` 375×667 | 327 × 485 | 158.0 | 643.0 | 325 × 300 | 213.2 × 44 | 17.0 | 41.0 |
| `standard` 390×844 | 342 × 485 | 335.0 | 820.0 | 340 × 300 | 228.2 × 44 | 17.0 | 41.0 |
| `large-phone` 414×896 | 366 × 485 | 387.0 | 872.0 | 364 × 300 | 252.2 × 44 | 17.0 | 41.0 |
| `bp-below` 767×1024 | 380 × 485 | 515.0 | 1000.0 | 378 × 300 | 266.2 × 44 | 17.0 | 41.0 |
| `bp-at` 768×1024 | 380 × 485 | 515.0 | 1000.0 | 378 × 300 | 266.2 × 44 | 17.0 | 41.0 |
| **`landscape` 844×390** | 380 × 485 | **−119.0** | 366.0 | 378 × 300 | 266.2 × 44 | 17.0 | 41.0 |
| `desktop-1440` | 380 × 485 | 391.0 | 876.0 | 378 × 300 | 266.2 × 44 | 17.0 | 41.0 |

Constant at every viewport: `position: fixed`, `z-index: 80`, `overflow: hidden`,
`bottom: 24px`, `right: 24px`. Message list `scrollHeight === clientHeight === 300`
(nothing to scroll in the opener state). Close affordance is the character `✕`,
`aria-label="Close"`, **32 × 32px**.

- **The page behind the panel scrolls while it is open.** Scripted `scrollBy(0, 300)`
  moved `window.scrollY` by exactly **300.0px** at every viewport;
  `document.body` computed `overflow: visible`. Consistent with the component's
  stated "persistent launcher, never a modal" contract.
- **The launcher is not visible while the panel is open** at any viewport
  (`fabStillVisible: false`), so there is no z-order relationship between them to
  report — `AnimatePresence` swaps one for the other.
- `100dvh` and `100vh` probe to the **same value** at every viewport in headless
  Chromium (800/800, 667/667, 844/844, 896/896, 1024/1024, 390/390, 900/900). See §8.

### 4.6 Concierge disclaimer

String, verbatim:

> This is a starting sketch, not a quote — pricing always comes from a real conversation.

**2 rendered lines at every viewport, including desktop.** `font-size: 12px`,
`line-height: 18px`, rect height **36.0px** throughout.

| Viewport | Rect | Container width |
| --- | --- | --- |
| `narrow` 360 | 278.0 × 36.0 | 310.0 |
| `se` 375 | 293.0 × 36.0 | 325.0 |
| `standard` 390 | 308.0 × 36.0 | 340.0 |
| `large-phone` 414 | 332.0 × 36.0 | 364.0 |
| `bp-below` / `bp-at` / `landscape` / `desktop` | 346.0 × 36.0 | 378.0 |

Replacement copy has **278–346px of width and 36px of height** to fit in before the
footer block grows.

### 4.7 Nav header

**Header height is 76.0px at every viewport including 1440.** The signature stripe's
top edge sits at **76.0px** — flush, gap **0.0px**. The `<header>`'s own
`border-bottom` computes to **`0px`** at every viewport, in both themes: the
Prompt 4 `currentColor` fix holds and nothing has regressed it.

| Viewport | Container side pad | Lockup | Theme toggle | Hamburger | `Let's Talk` in header | Desktop links visible | Σ item widths / viewport |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `narrow` 360 | 24 | 120.9 × 30.4 | 38 × 38 | 44 × 44 | **no** | 0 | **202.9 / 360** |
| `se` 375 | 24 | 120.9 × 30.4 | 38 × 38 | 44 × 44 | no | 0 | 202.9 / 375 |
| `standard` 390 | 24 | 120.9 × 30.4 | 38 × 38 | 44 × 44 | no | 0 | 202.9 / 390 |
| `large-phone` 414 | 24 | 120.9 × 30.4 | 38 × 38 | 44 × 44 | no | 0 | 202.9 / 414 |
| `bp-below` 767 | 24 | 120.9 × 30.4 | 38 × 38 | 44 × 44 | no | 0 | 202.9 / 767 |
| `bp-at` 768 | 32 | 120.9 × 30.4 | 38 × 38 | — | **yes** | 4 | 273.1 / 768 |
| `landscape` 844 | 32 | 120.9 × 30.4 | 38 × 38 | — | yes | 4 | 273.1 / 844 |
| `desktop-1440` | 32 | 120.9 × 30.4 | 38 × 38 | — | yes | 4 | 273.1 / 1440 |

**The `md` boundary behaves exactly as DESIGN.md §8 describes.** At 767 the header is
the hamburger drawer with zero desktop links; at 768 the horizontal nav and the CTA
appear and the hamburger is gone. Container side padding steps 24 → 32 at the same
boundary.

#### `Let's Talk`, every instance, every viewport

**This measurement agrees with Prompt 6 and there is no disagreement to report.**

| Instance | Where it renders | Rect | Padding | Font size |
| --- | --- | --- | --- | --- |
| Nav CTA | `bp-at`, `landscape`, desktop only — **never in the collapsed header below 768** | 114.2 × 51.2 | **14px 24px** | **14.5px** |
| Drawer CTA | `narrow`, `se`, `standard`, `large-phone`, `bp-below` — inside the open drawer | 312 / 327 / 342 / 366 / 719 × **52.0** | **15px 24px** | **14.5px** |
| `closing-cta` | every viewport | 137.1 × 61.6 | **18px 32px** | **16px** |

The nav CTA is the standard `button-primary` at 14/24px and 14.5px, matching Prompt
6's measurement exactly. The `button-primary--large` exception remains confined to
`closing-cta`. **The header's 76px height is therefore not attributable to the
button size** — at every viewport where the CTA renders, it is 51.2px tall inside a
76px bar, and at every viewport where it does not render the bar is still 76px.
This audit does not propose what the height *is* attributable to.

---

## 5. Animation inventory

Two contexts per route. Motion-on numbers come from
`reducedMotion: 'no-preference'`, verified live by
`matchMedia('(prefers-reduced-motion: reduce)').matches === false` inside that
context while the machine's own preference stayed on.

### 5.1 What animates, motion on

Walked at `standard` 390×844 and `bp-at` 768×1024, scrolling in 0.45 × viewport-height
steps and sampling `document.getAnimations()` plus computed `opacity` / `translate` /
`transform` at each step.

| Element | Property | Duration | Easing | Trigger | Kind |
| --- | --- | --- | --- | --- | --- |
| `.reveal` rows (`solution-row`, `case-study-row`, `project-card`, testimonial, `/process` steps, `/contact` blocks) | `opacity` **and** `translate` | **500ms** (376ms observed mid-flight on an already-started element) | `cubic-bezier(0.16, 1, 0.3, 1)` | scroll reveal (IntersectionObserver, once) | `CSSTransition` |
| `.tg-seq` (hero load sequence, `closing-cta` echo) | `opacity` + `transform: translateY(32px → 0)` | **500ms** | `cubic-bezier(0.16, 1, 0.3, 1)` | load sequence / in-view echo | `Animation` (Motion/WAAPI) |
| Nav fill layer `div.absolute.inset-0.-z-10` | `background-color`, `border-bottom-color`, `backdrop-filter` | **240ms** | `ease` | scroll past 24px | `CSSTransition` |
| `.status-dot-live` | `tg-pulse` | **1600ms**, infinite | `linear` | always | `CSSAnimation` |
| Concierge launcher | `opacity 0→1`, `y 8→0` | **240ms** | `cubic-bezier(0.16, 1, 0.3, 1)` | scroll past 0.85 × viewport height | `Animation` (Motion/WAAPI) |
| `/process` progress fill | `height` (percentage) | **120ms** | `linear` | scroll position | inline transition |

The reveal's rise is confirmed on the **`translate`** property, not `transform`
(measured mid-flight: `translate: 0px 5.74622px` while `transform` stayed at its
hover value) — the Prompt 4 rule is intact in the shipped CSS.

### 5.2 `.reveal` hooks — server-rendered vs actually fired

Server-rendered count read straight off the wire (`fetch` + class-attribute match);
fired count read after a full scroll walk with motion on.

| Route | Server-rendered | Fired | Left armed | Left invisible |
| --- | --- | --- | --- | --- |
| `/` | 11 | **11** | 0 | 0 |
| `/work` | 8 | **8** | 0 | 0 |
| `/work/ai-voice-receptionist` | 5 | **5** | 0 | 0 |
| `/work/team-performance` | 3 | **3** | 0 | 0 |
| `/solutions` | 4 | **4** | 0 | 0 |
| `/solutions/ai-voice-agents` | 1 | **1** | 0 | 0 |
| `/process` | 4 | **4** | 0 | 0 |
| `/contact` | 2 | **2** | 0 | 0 |

Server-rendered hooks on the routes not walked, for completeness:
`/solutions/smart-operations` 2 · `/solutions/business-systems` 2 ·
`/solutions/custom-web-apps` 3 · `/work/field-photo-reports` 5 ·
`/work/bundle-builder` 5 · `/work/ai-audio-file-insights` 5 ·
`/work/meeting-organizer` 3 · `/work/restaurant-menu` 3 · `/work/auto-detailer` 3 ·
`/privacy` **0**.

**Nothing is ever left hidden.** `anyLeftInvisible` is an empty array on every
walked route in both motion states.

### 5.3 The two items PROGRESS.md listed as unconfirmed — both resolved

Measured at **1280×900** with `reducedMotion: 'no-preference'`.

**The `/process` progress fill advances with scroll. Confirmed.** The rail is
`.tg-pin hidden lg:block`, so it renders at no viewport in the mobile matrix; this
had to be measured above 1024px, and was.

| `scrollY` | Fill inline height | Fill rendered |
| --- | --- | --- |
| 0 | `0%` | 0.0px |
| 360 | `25%` | 75.0px |
| 720 | `53%` | 159.0px |
| 1080 | `81%` | 243.0px |
| 1440 | `100%` | 300.0px |
| 1800 / 1938 (max) | `100%` | 300.0px |

`position: sticky`, `display: block`, `transition: height 120ms linear`.

**The rail's active-step highlight advances with it.** The rail prints all four
labels at once and marks the active one by weight and colour rather than by
swapping text, so it was read off computed style:

| `scrollY` | Highlighted label (`rgb(17,17,17)`, weight 600) | The other three |
| --- | --- | --- |
| 0 | `01 Discovery` | `rgb(106,113,126)`, weight 400 |
| 360 | `01 Discovery` | muted |
| 720 | `03 Build` | muted |
| 1080 | `04 Launch & Support` | muted |

Exactly one label is ink-weighted at every sample. This confirms the highlight moves
monotonically with scroll; it does **not** independently re-verify that the
highlighted step is the step under the reference line — see §8.

**The `closing-cta` echo fires. Confirmed.** Four `.tg-seq` items, all at
`opacity: 0` and `translateY(32px)` before the trigger, staggering in after it:

| t (ms) | Animations running | Item opacities | Item 1 transform |
| --- | --- | --- | --- |
| 0 | 28 | 0, 0, 0, 0 | `translateY(32px)` |
| 280 | 20 | 0, 0, 0, 0 | `translateY(32px)` |
| 350 | 18 | **0.511**, 0, 0, 0 | `translateY(15.07px)` |
| 420 | 15 | 0.850, **0.535**, **0.185**, 0 | `translateY(4.71px)` |
| 560 | 10 | 0.984, 0.945, 0.902, **0.462** | `translateY(0.49px)` |
| 770 | 7 | 1.000, 1.000, 0.998, 0.977 | `none` |

Headline → subhead → trust → CTA, fully resolved by ~770ms.

### 5.4 Accessibility floor, `reducedMotion: 'reduce'`, at mobile widths

Walked at `standard` 390×844 and `bp-at` 768×1024. Results identical at both.

| Check | Result |
| --- | --- |
| Nothing left at `opacity: 0` | ✅ `elementsLeftInvisible: []` on all 8 routes, both viewports |
| `.tg-pin` computes to `position: static` | ✅ `static` on `/process` |
| Status dot static | ✅ `animation-name: none`, `opacity: 0.85` |
| `.reveal` hooks present but inert | ✅ counts match server-rendered; none armed |
| `getAnimations()` empty | ❌ **not empty** — see M-19 |

`getAnimations()` under `reduce` returns **1 running `Animation` on 7 of 8 routes**
(the concierge launcher) and **8 on `/`** (the hero `.tg-seq` items).

The `.tg-seq` ones have no visible effect: `globals.css` pins them with
`opacity: 1 !important; transform: none !important`, and `elementsLeftInvisible` is
empty on every route.

The launcher carries no such pin, so it was sampled directly — computed style read
8× at 60ms intervals on all 8 routes at both viewports:

```
opacity: 1, transform: none   ×8 samples ×8 routes ×2 viewports
fabMovedUnderReduce: false     16 of 16 runs
```

**Caveat, stated because it changes what this proves.** Those samples were taken at
the end of the scroll walk, by which point a 240ms entrance would long since have
finished — so this shows the launcher is *at rest* under `reduce`, not that the
entrance never played. The animation objects `getAnimations()` reports may equally
be finished-but-retained. **This audit did not reach a verdict on whether the
launcher's 240ms entrance is suppressed under `reduce`**, and M-19 is filed as
`polish` on that basis rather than as a confirmed accessibility gap. What *is*
confirmed is that every other item in the floor holds, and that nothing on any
route is left hidden or moving at rest.

---

## 6. Production parity

`https://tekguyz.com` against `http://localhost:3210`, both at `narrow` 360×800 and
`standard` 390×844, same descriptors, same `reducedMotion: 'reduce'`.

| Measurement | local @360 | prod @360 | local @390 | prod @390 |
| --- | --- | --- | --- | --- |
| Header height | 76.0 | **76.0** | 76.0 | **76.0** |
| Nav CTA in collapsed header | absent (0×0) | **absent (0×0)** | absent | **absent** |
| Nav CTA padding / font | 14px 24px / 14.5px | **identical** | identical | **identical** |
| `closing-cta` button | 137.1 × 61.6, 18px 32px, 16px | **identical** | identical | **identical** |
| Launcher rect | 234 × 50 @ (102, 726) | **identical** | 234 × 50 @ (132, 770) | **identical** |
| Launcher padding / font | 16px 24px / 14.5px | **identical** | identical | **identical** |
| `scrollWidth` − `clientWidth` | 0 | **0** | 0 | **0** |
| `<title>` | `TEKGUYZ \| Smart Operations & AI Systems` | **identical** | identical | **identical** |
| `h1` | `We build tech that actually works for your business.` | **identical** | identical | **identical** |

**No divergence on any measured value.** The only difference is the stylesheet path
— local serves `/_next/static/chunks/2jhuu8e85udez.css`, production serves
`/_next/static/immutable/chunks/1nsnopzbdaany.css` (a Vercel build of the same
source). Every number in this report can be read as applying to what visitors get.

Worth flagging, though out of this audit's scope to act on: CLAUDE.md's opening
line still describes the rebuild as "deployed as a Vercel preview, **not yet pointed
at the live domain**". These measurements say `tekguyz.com` is serving this build.

---

## 7. Hypotheses (unverified)

**None of this is a finding.** Each is a guess formed while measuring, with what
would confirm or kill it. Seven of twenty-two items in the last three fix passes
were misdiagnosed in their brief; these are written down here specifically so the
fix prompt inherits them as questions, not as facts.

**H-1 — would explain M-01, M-02, M-18, and possibly M-16's `bp-at`/`landscape` rows.**
`.tg-grid` is `repeat(12, 1fr)` by default and `repeat(8, 1fr)` inside
`@media (max-width: 1023px)`, but the `grid-column: 1 / -1 !important` reset that
normalises children exists only inside `@media (max-width: 767px)`. Children still
carry inline 12-column placements (`1 / 8`, `9 / 13`, `1 / 5`, `5 / 9`) in the
768–1023 band. The computed `grid-template-columns` at 768 — **8 explicit tracks at
48.2969px plus 4 implicit tracks at 13.375px** — is consistent with placements
reaching past line 9 on an 8-track grid and creating implicit tracks.
**Confirm or kill:** set every `.tg-grid` child to `grid-column: 1 / -1` inside
`@media (max-width: 1023px)` and re-measure `/solutions` h1 width at 768. If it goes
from 144.0px to roughly the container width, H-1 holds. If it does not, H-1 is wrong
and the narrow columns come from somewhere else.

**H-2 — would explain the *severity* of M-01 but not its existence.**
`--text-hero` is `clamp(2.5rem, 6vw, 4.5rem)`, which is viewport-driven, while the
column it renders into is grid-driven. At 768 that resolves to exactly the measured
46.08px (6vw of 768) inside a 144px box. Even with H-1 fixed, a viewport-sized clamp
and a grid-sized column are independent quantities.
**Confirm or kill:** after fixing H-1, re-measure line counts at 768. If headings
still exceed two lines, the clamp is a second, separate contributor.

**H-3 — would explain M-17.** The 5px on `/work` at 844×390 appears with no element
rect crossing the edge, which points at something contributing to `scrollWidth`
without a normal border box — a `100vw`-derived value, a `calc()` bleed, a
transform, or an `overflow` container. `/work` is the only route it appears on and
`landscape` is the only viewport.
**Confirm or kill:** bisect by setting `overflow-x: hidden` on candidate ancestors
one at a time at 844×390 and watching `documentElement.scrollWidth` drop from 849
to 844; or diff `/work`'s section list against `/solutions`, which is clean at the
same viewport.

**H-4 — would explain M-19, and is the one hypothesis this pass partly tested.**
The reduced-motion block in `globals.css` pins `.tg-seq` with
`opacity: 1 !important; transform: none !important` precisely because Motion writes
inline styles that a plain rule cannot beat. The concierge launcher is animated by
the same library but is not `.tg-seq` and has no equivalent pin, and
`animation-duration: 0.001ms !important` does not reach a WAAPI animation.
**Tested, inconclusive:** the launcher's computed `opacity`/`transform` are constant
(`1` / `none`) across 8 samples on 8 routes at 2 viewports — but those samples land
after a 240ms entrance would have finished, so they cannot distinguish "suppressed"
from "already over". **Confirm or kill:** sample the launcher from the instant it
enters the DOM (a `MutationObserver` arming a `requestAnimationFrame` loop) rather
than after the scroll walk. Constant through that window kills H-4; any change
confirms it.

**H-5 — would explain M-06 and M-15 together.** The launcher's width is content-driven
(`Ask about your project` + an 18px mark at `padding: 16px 24px`, `font-size: 14.5px`)
with no responsive variant anywhere in its class list, which is consistent with one
declaration serving every viewport. If that is right, M-15's overlaps are a
consequence of M-06's width rather than an independent positioning problem.
**Confirm or kill:** reduce the launcher's rendered width at ≤414 by any means and
re-run the sweep. If the 174 route/element overlap pairs drop proportionally, they
were one problem.

**H-6 — would explain M-03.** The panel's height comes from content
(`min-height: 300px` on the message list plus a 56px header and a footer block) with
no `vh`, `dvh`, or `max-height` on the panel itself, and it is anchored
`bottom: 24px`. A content height that exceeds the viewport must therefore grow
upward past the top edge; 485 + 24 = 509 against a 390px viewport is 119px, which is
exactly the measured overshoot.
**Confirm or kill:** the arithmetic already matches to the pixel. What would kill it
is finding a height declaration the cascade trace missed — re-run
`declarations(panel, ['height','max-height','min-height'])` after any change.

---

## 8. What was not measured, and why

- **Colour and contrast.** Out of scope by instruction. DESIGN.md §1 carries a
  completed measured audit with locked values, and reopening it needs token-pair
  contrast maths across both themes. No colour was sampled for a verdict anywhere
  in this pass.
- **Desktop layout above 1024px**, except the 1440×900 launcher/nav/panel
  comparisons §4.4/§4.5/§4.7 explicitly call for, and the 1280×900 `/process` and
  `closing-cta` runs in §5.3 — which had to be there, because `.tg-pin` is
  `hidden lg:block` and does not render at any mobile width.
- **Real `dvh` behaviour.** `100dvh` and `100vh` probe identical at every viewport
  here because headless Chromium has no collapsing URL bar. On a real phone they
  differ, and any conclusion about `dvh` from this file would be unsound. It happens
  not to matter for M-03 — the panel's height chain contains neither unit — but the
  limitation stands for anything else.
- **`/contact` step 2.** Reaching it needs valid step-1 input and a real state
  transition; only step 1's fields were measured. The `01 / 02` counter and the step
  header were measured in their step-1 state, which is what M-02/M-07 report.
- **The concierge thinking stripe (`.shimmer-seg`).** It only exists in the DOM while
  a request is in flight, which means a live Gemini call and a hit against the
  Upstash limiter. Not exercised. PROGRESS.md records the user confirming the
  shimmer on a Pixel 9A on 2026-08-07; that remains the only evidence.
- **Whether the `/process` rail's highlight agrees with the content.** The fill's
  advance and the highlight's advance are both confirmed above, and exactly one
  label is ink-weighted at every sample. What was **not** re-measured is whether the
  highlighted step is the step actually under the rail's 45%-of-viewport reference
  line — the probe written for it selected the wrong elements and returned empty at
  every offset. Prompt 5 measured that agreement at eight scroll offsets after
  rewriting the formula; nothing here contradicts it, and nothing here re-proves it.
- **Whether the launcher's entrance is suppressed under `reduce`** — see M-19 and
  H-4. Measured at rest only.
- **Real touch input.** `hasTouch: true` and `isMobile: true` were set on every
  context, so hit-testing and `hover` media queries behave as on a phone, but the
  measurements are geometric. No gesture, pinch-zoom, or on-screen-keyboard state
  was exercised — an open keyboard shrinking the viewport under the concierge panel
  is specifically untested.
- **Lighthouse, bundle size, Core Web Vitals.** Out of scope by instruction.

---

## 9. Re-running this

```bash
node --experimental-strip-types scripts/audit-mobile.ts all
```

Phases run individually as `sweep`, `surfaces`, `motion`, `prod`, `shots`. Output
lands in `.audit/` (gitignored — the repo is public and no binary belongs in it).
Kill the port first and let the harness's own stylesheet guard confirm 200 before
trusting anything it prints:

```bash
(Get-NetTCPConnection -LocalPort 3210 -State Listen).OwningProcess | % { taskkill /PID $_ /T /F }
```

---

## 10. Device pass — 2026-08-09 (Pixel 9A)

**These are not harness output.** The D- series is a set of **unmeasured device
observations** made by a person holding a phone. Nothing here has a rect, a
viewport matrix, or a re-runnable probe behind it, and **none of them carries a
cause** — symptom and location only. That is deliberate: 7 of 22 items across
earlier passes inherited a wrong cause from a brief that asserted one, so a D-
item is not to be diagnosed from this file. Whoever fixes one measures it first.

This pass is also what reopened **M-07** and **M-08** at sub-767 — see the banner.

| ID | Observation |
| --- | --- |
| **D-01** | Concierge launcher renders above the open mobile nav drawer. |
| **D-02** | Concierge launcher covers FAQ body text on `/contact` when an accordion item is expanded. Static overlap at rest after a user action — a different class from the transient scroll overlaps already recorded. |
| **D-03** | After contact form submit, focus lands on the first FAQ accordion trigger; the success message is off-screen above and is never seen. |
| **D-04** | Concierge panel reads small at portrait phone heights and on desktop. Design decision, not a defect. |
| **D-05** | A concierge response longer than the message list leaves the user scrolled to the list's end; reading the response requires scrolling up. |
| **D-06** | Home hero renders a second status-line instance in the text column beneath the CTA row, in addition to the one attached to the media. |
| **D-07** | Home hero media's right-edge bleed crops through card content at viewports above 1440. |
| **D-08** | Home hero poster is illegible at 360px, where the media stacks full-width. |
| **D-09** | The proof line ("Eight live builds. Open any of them right now.") is specified in CANONICAL.md §98 as content and has no entry in DESIGN.md. No typographic or spacing treatment exists for it. |
| **D-10** | Nav "Let's Talk" renders larger than DESIGN.md:172's standard button-primary and is setting the header's height. |
| **D-11** | LiveFrame's surrounding container — surface fill, padding, radius, and whether the status block sits inside or beneath the frame — is unspecified in DESIGN.md:186. |
| **D-12** | closing-cta is built exactly to DESIGN.md:176 and reads flat. Every element is centered with identical gaps and there is no hierarchy anchor. Approximately 200px of dead vertical space sits above it (preceding section's 128px bottom padding + the CTA's own 64px top). A spec revision, not a defect. |
