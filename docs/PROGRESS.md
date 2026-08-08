# TEKGUYZ Website — Progress & Known Gaps

*Becomes `/docs/PROGRESS.md`. Updated at the end of each build session, not read in full at the start of a small one — see CLAUDE.md's scoped-reading rule. This is where "what's already done" lives, so a new session (or a `/clear`) doesn't have to re-derive it from chat memory.*

---

## Phase status

Mapped to the TEKGUYZ Engineering workspace's Phase 1/2/3 framework:

- **Phase 1 (Discovery) & Phase 2 (Blueprint):** complete. `CANONICAL.md` is the PRD and technical roadmap — unusually thorough, which is why Phase 3 looks different from the framework's default.
- **Phase 3 (Prompt execution):** in progress.

**Why this isn't a 6–12 prompt pack:** the default range assumes a Phase-2 blueprint that leaves real gaps for each prompt to resolve. This one doesn't — five documents (CANONICAL, DESIGN, COPY, SEO, PLAYBOOK) resolved hundreds of decisions before any prompt ran. That let the master prompt absorb work (Gemini swap, rate limiter, full SEO, confirmation email) that would normally be separate steps. Realistic remaining count: **3–4 follow-ups**, not the full range — the framework adapting to unusually complete blueprinting, not a deviation from it.

## Prompt history

| # | Prompt | Status | Notes |
| --- | --- | --- | --- |
| 1 | Master build prompt | **Complete** (2026-08-05) | Full site built from an empty repo. All 18 routes, every component in DESIGN.md §4, `content/work.ts` + `content/solutions.ts` + `config/solutions.ts`, contact action (honeypot renamed, phone/website added, confirmation email), concierge ported to Gemini 3.6 Flash, shared durable rate limiter, full SEO + JSON-LD + per-route OG images, generated favicon set, dark mode. `bun run build` clean, 18/18 routes prerendered. |
| 2 | Design-export audit + live integration verification | **Complete** (2026-08-06) | Full route-by-route rebuild against the approved `TEKGUYZ Site.dc.html` / `TEKGUYZ Components.dc.html` export, which is now the visual ground truth. Every integration exercised for real against live credentials. Playwright added as the screenshot/verification driver. |
| 3 | Three scoped fixes: optional-field validation, concierge tone, scroll reveals | **Complete** (2026-08-06) | `lib/validation.ts` shared by client and server schemas; concierge system prompt rewritten to drop the template labels and raw paths; reveals reinstated on IntersectionObserver, visible-by-default. |
| 4 | Fix pass 1 of 3 — shared components: LiveFrame asset wiring, nav/stripe collision, `/contact` landing position, motion audit, contact-form field contamination | **Complete** (2026-08-07) | Four of five were misdiagnosed in the brief and turned out to be different bugs than described — see the section below for each actual cause. Item 1 needed no code fix (the "placeholder" is the asset file); it gained a `prebuild` wiring guard and a flagged naming decision. Motion had three separate causes, one of them the machine's own reduced-motion setting. |
| 5 | Fix pass 2 of 3 — project detail-page layout, `/process` pin, duplicate CTA, single root elements, lint, reveal coverage, Sarah filename | **Complete** (2026-08-07), pending commit approval | Six of eight as briefed. The `/process` pin was **already built**, not missing — but its progress readout ran a step and a half ahead of the content, and its reduced-motion degradation depended on Tailwind's utility sort order. Lint had no config file at all. See the section below. |
| 6 | Fix pass 3 of 3 — nav CTA size, home Process teaser, `/contact` trust dots, `flourish-mark` doc, validation tests, phone typing cap, `aria-describedby`, dark favicon, success copy | **Complete** (2026-08-07), pending commit approval | Eight of nine were real. **Item 1 was not**: the nav CTA already rendered at the standard size — measured 14/24px, 14.5px — so nothing was changed. Item 6's stated fix ("cap at 15 characters") would have reproduced the very bug it was written to avoid; implemented as a 15-**digit** cap instead. Item 5's "25 unit cases pass" claim had no test file behind it at all. See the section below. |

## Prompt 6 — nine scoped fixes

*2026-08-07. Awaiting approval to commit at time of writing.*

### The two places the brief and the repo disagreed

**Item 1 — the nav CTA was already correct.** The brief states `Let's Talk` in the
nav renders at `button-primary--large` (18×32px, ~16px text). It does not, and
nothing was changed. `components/nav.tsx:119` passes `size="nav"`, and
`components/button.tsx` maps that to `px-6 py-[14px]` at the base `text-[14.5px]`
— the standard size DESIGN.md §4 specifies. Measured live at 1280×900 via
`getComputedStyle`, all three `Let's Talk` instances on Home:

| Instance | Padding | Font size | Variant |
| --- | --- | --- | --- |
| Nav | 14px / 24px | 14.5px | standard `button-primary` ✓ |
| Closing CTA | 18px / 32px | 16px | `button-primary--large` — the one documented exception ✓ |

No CSS overrides either: `app/globals.css` carries no `button` rule, only the
`--tg-cta-*` colour tokens. The size exception is correctly confined to one place.

**Item 6 — a 15-*character* cap would have broken exactly what the brief was
protecting.** The brief is right that a hard 10-digit cap breaks international
support, and right that the validated range is 7–15 digits. But "capping entry at
15 characters" is the same mistake one breakpoint over: `+44 20 7123 4567` is a
valid 13-digit UK number and **16 characters**, so a `maxLength={15}` would cut it
mid-entry. `capPhoneDigits` in `lib/validation.ts` counts **digits** and leaves
formatting (`+`, spaces, parens, dots, dashes) unlimited — which is precisely what
`isPlausiblePhone` already measures, so the guard and the schema cannot disagree.
Verified with real typed input: 23 characters typed into the field truncate to 15
digits, and `+44 20 7123 4567` survives intact and validates.

### The other seven

- **Home Process teaser restored** (`app/page.tsx`) between Testimonial and the
  closing CTA, per CANONICAL §4 item 7. Copy is COPY.md's "Process teaser" block
  verbatim; the four condensed lines are the `teaser` field `content/process.ts`
  has carried since the master build *for exactly this section* — it was authored
  and then never rendered. No numerals: DESIGN.md §4 scopes `numeral-device` to
  `/process`. Not `tg-grid` — a 12-column `span 3` goes ragged at the 8-column
  tablet breakpoint; plain responsive columns give 4 / 2 / 1 with no overflow at
  375px. Verified in both themes (`#111` → `#F5F5F5`, borders `#E5E7EB` → `#2A2A2C`).
- **`/contact` trust-line dots removed** (`app/contact/page.tsx`). They used three
  of the four wayfinding accents as decorative bullets; those accents mean
  *solution line* everywhere else. Now identical to `closing-cta`'s treatment of
  the same three facts: one muted flex-wrap row, 3px `muted-soft` mid-dots,
  no colour. Measured: `rgb(106,113,126)` text, two `rgb(156,163,175)` 3px dots,
  zero accent backgrounds left in that column beyond the `flourish-mark` itself.
- **`flourish-mark` doc corrected** (DESIGN.md §4). Was "once per page, home
  only"; the dots ship on every route's first section, matching the export.
  Rendering untouched — the doc was the stale half. The `page-hero` entry carried
  the same stale claim ("no `flourish-mark` — that stays home-only") and was
  corrected with it. The *once per page* half stands and is unchanged.
- **`aria-describedby` no longer dangles** (`components/contact-form.tsx`). The
  hint is *replaced* by the error, not stacked, so the reference pointed at a
  removed node at the exact moment it mattered. Now `errors.phone ? undefined :
  'phone-hint'`. Measured through a real invalid-then-valid cycle: attribute goes
  `"phone-hint"` → `null` → `"phone-hint"`, tracking the element's presence.
- **Favicon set is now dark** (`scripts/generate-icons.ts`). Plate is
  `--tg-bg-dark` `#101010`, connectors lifted to `#4B5563` so they stay a
  hairline rather than glowing off the plate. `icon-master.svg` is **unchanged**
  and nothing else reads it — the nav lockup and footer render the mark as JSX
  (`components/logo-lockup.tsx`) and the OG images build their own, so no other
  surface moved. `app/icon.svg` took the plate too: it previously shipped
  transparent "so it adapts", which meant a tab could show a dark `.ico` in one
  browser and a bare mark in another.
- **Success copy replaced** in `components/contact-form.tsx` and `docs/COPY.md`.
  The em dash is the existing two-part split: "Message sent" stays the bolded
  status line beside the success dot, the remainder is the body paragraph.
- **Real test suite added** — see the Prompt 3 correction above.

### Also found, and fixed

**PLAYBOOK §13 says favicons are "generated from `icon-master.svg` at build
time". They were not.** `bun run icons` was manual and its outputs committed, so
the doc described an intent the pipeline never had — and a master edit could
silently ship stale icons. `prebuild` now runs `generate-icons.ts` ahead of
`check-media.ts`, which makes §13 true. Outputs stay committed and deterministic.

## Prompt 5 — project detail pages, the /process pin, and repo hygiene (eight items)

*2026-08-07. Awaiting approval to commit at time of writing.*

### What the brief got right, and the two places it didn't

Six of eight items were as described. Two were not:

**The `/process` pinned moment was not "never built."** `components/process-steps.tsx`
has existed since the master build, wired into `/process`, with the sticky rail,
the progress fill, the `Step 0N of 04` readout and the `numeral-device` at 8%
opacity behind each title. What it had instead was **a progress indicator that
disagreed with the page.** It derived the active step from a fraction of the
section's *scrollable range* rather than from where the steps actually are:

```
p = -sectionRect.top / (sectionHeight - innerHeight)
active = floor(p * 3.999)
```

Measured at 1280×720: the scrollable range is 714px, the four steps span 1434px.
So the rail read **"Step 04 of 04" at 536px into the section, where step 04 does
not begin until 993px** — running a step and a half ahead of the content the
whole way down. The two measurements only coincide if the section happens to be
exactly twice the viewport height. Rewritten to read the step elements' own
positions against a reference line at 45% of the viewport; the readout and the
fill now agree with the content at every scroll position, measured.

**The pin's reduced-motion degradation rested on a coin flip.** It was
`lg:sticky lg:top-[140px] motion-reduce:lg:static`. Both utilities set
`position`, both have specificity (0,1,0), and nothing about the `motion-reduce:`
variant makes it beat `lg:` — which of them won was decided purely by their order
in the generated stylesheet. CANONICAL §6's accessibility floor cannot rest on a
utility sort order, so the pin is now `.tg-pin` in `globals.css`: a real rule
inside `@media (min-width: 1024px)`, overridden by `position: static !important`
inside the existing reduced-motion block, which is later in the file. Verified in
the built stylesheet by byte offset — sticky rule at 29519, static override at
30035.

### The eight items

| # | Item | Outcome |
| --- | --- | --- |
| 1 | Project detail pages: meta rail + `LiveFrame` | Shipped. Rail extracted to one `MetaRail` used by both tiers. |
| 2 | `Read the full story →` on `project-card` | Shipped. |
| 3 | Remove the rail's duplicate `Let's Talk` | Shipped, all 8 pages. |
| 4 | `/process` pinned moment | Already built; two real defects found and fixed (above). |
| 5 | Single root element on every route | Shipped, 7 routes. Measured: 1 `scrollIntoView` call per route across all 18. |
| 6 | `bun run lint` | Fixed. Runs, 0 errors, 1 reported warning. |
| 7 | Reveal coverage on `/process` and `/contact` | Shipped. `/process` 0 → 4, `/contact` 0 → 2. |
| 8 | `sarah-thumb.webp` rewire + documentation | Shipped. Build now fails at `check:media` until the file lands — expected. |

### Item 1 — the layout gap, and what the "weight distinction" actually protects

Project pages reused the case-study grid with a fraction of the content and no
rail at all: a narrow left column against a large empty right side, with the
Solution line, live status and demo link appearing nowhere on the page. The four
project thumbs in `content/work.ts` were rendered nowhere in the codebase.

Both tiers now carry the rail on cols 10–12. Content stays left-anchored — case
studies on 1–9, projects on 1–8, so thin copy is not stretched to fill. Measured
on `/work/restaurant-menu`: content right edge 722px, rail left edge 951px, the
col-9 gap intact; frame ratio exactly 1.600.

`project-card` still has no image, and that rule is unchanged — the weight
distinction it protects is between the two *card* treatments on the index and in
the amount of narrative content, not a rule that a project may never show its own
screenshot on its own page.

The project branch's standalone status-line-plus-demo-link row was removed:
`FrameMeta` beneath the new frame carries exactly that pair, and the rail carries
it again, so keeping it would have made three copies on one page.

### Item 6 — lint was not misconfigured, it was absent

There was no `eslint.config.*` and no `.eslintrc.*` of any kind. ESLint 9
defaults to flat config, found nothing, and exited before linting a file —
`eslint-config-next` had been installed the whole time and had never run once.

`eslint-config-next@16` ships a **native flat config** as its default export. It
is not loadable through `FlatCompat`; that path throws `Converting circular
structure to JSON` inside the eslintrc validator. Import it directly. No new
dependency was added.

Four problems found, three fixed:

- **`components/nav.tsx`** — `setState` in an effect to close the mobile drawer
  on route change. Moved to the adjust-state-during-render pattern, which React
  discards before paint instead of committing a render with the drawer still
  open over the new page.
- **`components/theme-toggle.tsx`** — the `mounted` flag set from an effect,
  purely to pick a glyph. Replaced with CSS: both glyphs ship, a `dark:` variant
  hides one, and the accessible name is two `sr-only` spans with the inactive one
  at `display:none`. This is what DESIGN.md §7 already required ("never gate on
  `useTheme()` or mount state when a CSS `dark:` variant solves it"). Verified in
  both themes: light shows the moon and announces "Switch to dark mode", dark
  shows the sun and announces "Switch to light mode", exactly one label exposed.
- **`eslint.config.mjs`** — anonymous default export. Named.

**Left as a warning, deliberately** — `components/contact-form.tsx:92`,
`react-hooks/incompatible-library` on React Hook Form's `watch()`. The React
Compiler skips memoizing the component rather than risking stale UI. The
mechanical fix is RHF's `useWatch`, but this is the file whose step-branch
reconciliation bug caused the field-contamination defect in Prompt 4, and
swapping its subscription API is a behavioural change, not a lint fix. Flagged
rather than done. Warnings do not fail `bun run lint`.

**What lint does not buy us, stated plainly:** of the three defect classes that
motivated turning it on, it catches one. Missing React `key`s: caught. A
`transition` shorthand resetting a longhand, and an unqualified Tailwind
`border-b` resolving to `currentColor`: **not caught, and not catchable by any
ESLint rule** — both are CSS cascade semantics and invisible to a JS/JSX linter.
CLAUDE.md's standing rules remain the only mechanism that applies to those.

### Verification — which half was actually proved

Per CLAUDE.md, this machine has OS-level reduced motion on and the Browser pane
runs hidden. Both held. What that permitted and what it didn't:

**Measured, not eyeballed:**
- `scrollIntoView` fires exactly **1** time per route, target a `DIV`, across all
  18 routes — instrumented `Element.prototype.scrollIntoView` and walked the site
  by clicking real in-page anchors. Client-side navigation works fine in a hidden
  pane; only compositing doesn't. (A synthesized `<a>` triggers a full page load
  and throws the instrumentation away — use existing anchors.)
- Reduced-motion path on `/process`: `.tg-pin` computes to `position: static` at
  1280px, all four steps at `opacity: 1` / `translate: none`, numeral at 0.08.
  The pin correctly degrades to a stacked list.
- Pin geometry under motion: forced the sticky declaration back on **with
  `!important`** and sampled `getBoundingClientRect()` across scroll positions —
  holds at `top: 140px` through the section and releases at its end. A plain
  inline style is not enough here and silently measures a still-static element,
  because the reduced-motion override is `!important`.
- The corrected rail math, replayed against the live DOM at eight scroll offsets:
  readout and fill agree with the step under the reference line at every one.
- Both themes on a project detail page by computed style: page `#101010`, text
  `#F5F5F5`, primary CTA inverting to a `#F5F5F5` fill with `#101010` text.
- All 4 project cards: no nested anchor, no extra focusable child, still one tab
  stop each.

**Confirmed by eye, at 1440×900**, once the Browser pane was displayed: all four
project detail pages (rail populated, real `LiveFrame` rendering actual product
UI, `Live · checked just now` + demo link beneath it, no `Let's Talk` in any
rail, no testimonial on the three that shouldn't have one), and
`/work/field-photo-reports` as a case-study spot-check — frame, meta row, Try it,
How it's built, prev/next all intact, rail sticky at `top: 116px` with zero
buttons. Screenshots time out whenever the pane is hidden; nothing else does.

**Confirmed by the user on a motion-enabled device (Pixel 9A, 2026-08-07) — the
motion layer works.** Two independent confirmations, which together close the
question that had been open since Prompt 4:

- **The concierge's four-segment thinking stripe shimmers.** It had rendered
  static on the dev machine, which looked like a defect and is not one: DESIGN.md
  §4 specifies a static four-segment bar as the `prefers-reduced-motion`
  fallback, and `globals.css` implements exactly that
  (`.shimmer-seg { animation: none !important }`). The static bar was the spec
  working, not the animation failing.
- **The hero's entrance sequence (flourish dots → headline → subhead → CTA) is
  visible**, so the load-sequence and reveal layers both run correctly on a real
  device.

This is the first direct evidence that the entrance system runs end to end. Every
prior pass could only verify its wiring.

**Still not verified on this machine, and deliberately not attempted:** anything
requiring motion. Windows animations are disabled here as a standing preference,
so `prefers-reduced-motion: reduce` matches everywhere. The *wiring* is verified
by server-rendered class counts, computed styles, and the corrected rail formula
replayed against live DOM geometry — **the motion-enabled path is the user's to
verify, and emulating around it here is not worth the time it costs.**

### A trap that cost real time this session — read before verifying anything

**A stale `next start` can hold port 3210 and serve a previous build.** Several
servers were started across the session; `pkill`/`Stop-Process` did not clear
them all, and the survivor kept serving HTML referencing chunk filenames that no
longer existed on disk. Those chunks 404'd as **500s**, so a fresh browser got
the page with **zero CSS rules and no hydration** — which looks exactly like
catastrophic breakage: pin static, progress fill stuck at 0%, no reveals armed,
step padding 0. All of it was the stale server.

Kill by port, not by process name, and verify before trusting any result:

```
(Get-NetTCPConnection -LocalPort 3210 -State Listen).OwningProcess | % { taskkill /PID $_ /T /F }
```

Then confirm the stylesheet the served HTML references actually returns 200
before drawing a single conclusion from that page.

**Also, for anyone reaching for Playwright here:** it is a devDependency and it
works, but **only under `node --experimental-strip-types`, not under Bun** —
Bun's stdio handling breaks Playwright's `--remote-debugging-pipe` on Windows and
`launch()` times out after 180s with the browser process visibly spawned. The
script must live inside the project directory to resolve `playwright` at all.

## Prompt 4 — shared-component fix pass (five items)

### 1. The "invented placeholder content" is the asset file, not any code

**There is no coded fallback, and no placeholder branch anywhere.** `components/live-frame.tsx`
has exactly one render path — `<Image src={poster}>` — with no conditional, no
error state, and no styled stand-in markup. A repo-wide search for fabricated
strings (`SARAH`, `VOICE ASSISTANT`, `Audio Synthesis`, `placeholder`, `fallback`)
returns nothing in any rendering component. `content/work.ts` is wired correctly:
all 8 `poster` paths and the one `heroPoster` resolve to files that exist.

What renders is the `.webp` itself. Opened directly:

- `sarah-project-thumb.webp` (1080×1059) **is** the "SARAH (VOICE ASSISTANT)"
  quote card — a crop of the phone-call **simulator widget**, which is the exact
  asset PLAYBOOK §12 names as the hard-rule violation ("a widget *inside* the
  real product, not the product"). It is also **not listed in §12's inventory at
  all** — §12 documents `sarah-poster.webp` for the hero and nothing for the AI
  Voice Receptionist's compact context.
- `crunch-wrap-dashboard.webp` (1080×1038) is a genuine capture of the real
  crunch-wrap app, but zoomed into one detail view — header, "Audio Synthesis
  Report", a `Demo Mode` tag. It is documented in §12; it is just the wrong shot.

Measured ratios — **every compact asset is off the locked 16:10, only the hero
passes**:

| Asset | Size | Ratio |
| --- | --- | --- |
| `sarah-poster.webp` (hero, 16:9) | 1600×900 | **1.78 ✓** |
| `field-ops-thumb.webp` | 769×754 | 1.02 |
| `sarah-project-thumb.webp` | 1080×1059 | 1.02 |
| `shopify-configurator.webp` | 1080×1140 | 0.95 |
| `crunch-wrap-dashboard.webp` | 1080×1038 | 1.04 |
| `advantage-teams` / `meeting-organizer` / `dragonfly-nica` / `executive-detailer` | 600×450 | 1.33 |

`object-fit: cover` on a 1.02 source in a 1.60 frame discards ~36% from the
bottom, so what survives is the top strip of a zoomed-in sub-view — which is why
it reads as a fabricated card. This is Known Gap #3, now quantified.

**Added: `scripts/check-media.ts`, run automatically by `prebuild`.** A wrong or
missing filename now fails `bun run build` instead of silently shipping a blank
frame, and off-ratio assets warn with their measured numbers. This is what makes
"drop the recaptured `.webp` in under the documented name and it renders, no code
change" actually true rather than assumed. Run it alone with `bun run check:media`.

**No image was fabricated, sourced, or generated.** No neutral fallback was
built either — there is no code path to replace, and inventing one would add a
branch that never fires once the real files land. If a *missing* file should
degrade to a hairline empty frame rather than fail the build, say so and it's a
small change.

### 2. Nav hairline over the signature stripe — an uncolored Tailwind border

`components/nav.tsx:68` carried an unqualified `border-b` on the `<header>`. In
Tailwind v4's preflight, borders default to `0 solid` with **no color**, so
`border-b` resolved to `currentColor` — `rgb(17,17,17)` in light,
`rgb(245,245,245)` in dark. The header therefore painted an opaque 1px line at
**every** scroll position, including scroll 0 where DESIGN.md §4 says the nav has
no border at all.

Geometry: the nav is `sticky`, so it sits in flow — 76px content + that 1px =
77px, and `SignatureStripe` is the very next element, starting flush at 77. The
line landed directly on the stripe. Once scrolled it also doubled the *real*
hairline, which lives on the separate absolutely-positioned fill layer
(`nav.tsx:71`, colored by `--tg-nav-border`). Not a z-index, stacking, or
negative-margin problem — a second, uncolored border on the wrong element.

Fix: removed `border-b` (and the now-dead transition) from the `<header>` only.
The fill layer keeps the one specified hairline, so the scrolled state is
unchanged everywhere.

Measured, header `border-bottom`: light `1px rgb(17,17,17)` → `0px`; dark
`1px rgb(245,245,245)` → `0px`. Header bottom edge 76.8 → 76.0, stripe
`[76.0, 82.0]` flush beneath it. A full-DOM sweep for any painted horizontal
border ≥200px wide in the y 70–90 band returns `[]` in dark mode, and in light
mode only the fill layer's own border at `rgba(229,231,235,0)` — transparent, as
specified at scroll 0. The collision was global (the nav is global) and so is the
fix; verified on all 7 routes, 3 stripes each.

### 3. `/contact` landing position — a route-transition scroll, not an autofocus

**There is no `autoFocus` anywhere in the tree** — exhaustive grep across `app/`,
`components/`, `lib/`, `config/`, `content/`, and `document.querySelectorAll('[autofocus]')`
returning `[]` on the live page. Nothing in `faq-accordion.tsx` ran on mount
either: no effect, no `scrollIntoView`, `open` starting at `null`. On a hard load
an instrumented `scrollIntoView`/`focus` log was completely empty. It is a
**client-side route-transition defect only**, which is why it never reproduced on
a refresh.

`app/contact/page.tsx:30` returned a **multi-child fragment**. Next.js scrolls the
new segment into view on every transition; because the page was a fragment, React
handed Next a `FragmentInstance`, whose `scrollIntoView()` calls
`Element.scrollIntoView()` on *every* top-level child, relying on the last call to
win. Instrumented stack, captured on a real transition into `/contact`:

```
scrollIntoView  SECTION.pb-32                  <- the FAQ, y=1422
scrollIntoView  DIV.tg-container tg-grid…
scrollIntoView  DIV.grid h-[6px] grid-cols-4   <- the 6px stripe
scrollIntoView  SCRIPT                         <- zero box, no-op
  at FragmentInstance.scrollIntoView (react-dom)
  at disableSmoothScrollDuringRouteTransition (next/dist)
```

`main`'s children were `SCRIPT(0px) · stripe(6px) · grid · section.faq`, so the
**first** call scrolled to the FAQ and the call meant to undo it landed on the
JSON-LD `<script>` — and `scrollIntoView()` on a zero-box element does nothing
(measured: `script.scrollIntoView()` with `scrollY` at 1500 left it at 1500). The
resting position was decided by an accidental fallback rather than the top of the
page.

Fixed by giving the page a single root `<div>` (JSON-LD stays inside it): one
child, a real layout box, its top the top of the page. Measured **5
`scrollIntoView` calls → 1**, on the wrapper at y=76.

**Honest limit:** on this Chromium the resting `scrollY` was **0 both before and
after** — the stray FAQ scroll was real and measured, but the final landing
position only went wrong on the user's device. What is proven is that the FAQ is
no longer a scroll target at all. Independently re-verified after the fact: a real
client-side navigation from `/` scrolled to 900 into `/contact` at 375×812 settles
at `scrollY: 0` and holds it for 2s, `activeElement` `BODY`, no panel open.

`faq-accordion.tsx` also had genuinely broken a11y, now fixed: panels used to
unmount when closed, so **0 of 6** `aria-controls` resolved to an existing element
on page load — the exact state a screen reader meets. Panels now always render and
collapse with `hidden` (6 of 6 resolve), triggers carry `id`, panels carry
`role="region"` + `aria-labelledby`, and WAI-ARIA arrow-key roving was added
(Up/Down with wrap, Home/End) — the only `focus()` call in the file, reachable
only from a real `keydown`. Focus deliberately stays on the trigger when a row
opens.

### 4. Motion — three separate causes, only one of them a code bug in the audited list

The claim "almost none of this fires" is accurate. It has three independent
causes and they need separating, because two of them are not what they look like.

**(a) The machine has `prefers-reduced-motion: reduce`.** `HKCU\Control
Panel\Desktop\WindowMetrics\MinAnimate = 0` — Windows "Show animations" is off,
which Chrome maps straight to the reduce preference. `reveal.tsx` correctly bails
on it, and `globals.css` force-disables every transition. **This alone explains
the entire symptom, including the specific tell**: hover still "works" because a
hover *state change* still applies, just instantly — so entrances look dead while
hover looks alive. Verified in the running app: `matchMedia(...).matches === true`,
`armedCount: 0`, `document.getAnimations()` running: `[]`, nothing hidden, status
dot static at exactly 0.85. That is the spec's required behavior, not a defect.
**This setting was not changed — it is an accessibility preference and the user's
to set.**

**(b) A `transition` shorthand was cancelling the reveal — the real code bug.**
`.hover-row` and `.hover-card` (`globals.css:435`, `:448`) each declare a
`transition` **shorthand**, which resets every transition property, and they sit
*later* in the file than `.reveal` (`:367`). So on every element carrying both —
`solution-row` (`reveal hover-row`) and `project-card` (`reveal hover-card`), i.e.
exactly two of the three components Pass 3 reported as hooked up — the entrance
transition was wiped out entirely. Measured before: `transition-duration: 0.24s`,
`transition-property: border-color`. The classes were wired correctly; the CSS
silently cancelled them, which is why the hook-up looked done and looked dead.

Fixed by declaring the combined transitions once for `.reveal.hover-row` and
`.reveal.hover-card`, and by moving the 16px rise from `transform` to the
independent **`translate`** property so the entrance and the hover lift compose
instead of fighting over one value with two durations. Measured after —
`project-card`: `opacity, translate` @ `0.5s, 0.5s` + `transform, border-color` @
`0.24s, 0.24s`. State machine, transitions suppressed to read targets:
default `[1, none]` → armed `[0, 0px 16px]` → revealed `[1, none]`, on both a
plain `.reveal` and a `.reveal.hover-card`. The visible-by-default safety
property is intact.

**(c) The controller never re-ran on a client-side navigation.**
`RevealController` is mounted once in the root layout with `useEffect(..., [])`,
and the root layout does not remount when a `<Link>` navigates. So every route
reached by clicking — which is how a visitor actually moves through the site —
got no observer at all. Now keyed on `usePathname()`, with the arming pass
deferred one `requestAnimationFrame` so `<ViewTransition>` can't leave the new
DOM unqueryable.

**Coverage was also simply missing.** `.reveal` hooks per route, server-rendered,
before → after:

| Route | Before | After |
| --- | --- | --- |
| `/` | 4 (solution rows only) | **7** (+2 Featured Work rows, +testimonial) |
| `/work` | 8 | 8 |
| `/solutions` | 4 | 4 |
| `/work/[slug]` case study | **0** | **5** |
| `/work/[slug]` project | **0** | **2** |
| `/solutions/[slug]` | **0** | **1** |
| `/process`, `/contact` | 0 | 0 — see Known Gaps |

The home Featured Work rows were missed because `BandRow` in `app/page.tsx` is a
**separate local component** from `components/case-study-row.tsx`; Pass 3's
"hooks re-added to case-study-row" was true and still left the home band's most
prominent scroll content with nothing.

**Not broken, checked:** the hero load sequence (`SequenceRoot trigger="load"`)
and the closing-CTA echo (`whileInView`, `once: true`, `amount: 0.3`) are both
implemented per §6 and correctly pinned visible under reduced motion by `.tg-seq`.
They do not need `.reveal` and did not get it.

### 5. Contact form cross-field contamination was not autofill at all

`components/contact-form.tsx:153`, the `step === 1 ? … : …` ternary. Both steps
live in the same `<form>` and only one renders at a time, but React reconciled
the two branches **in place**: each renders a `<div>` at the same position, so the
child `<input>` elements were patched, not replaced. The name input literally
*became* the phone input and the email input *became* the website input. They are
uncontrolled (RHF `register` + ref), so React never rewrote `value` — the typed
text stayed in the node and RHF absorbed it back into form state.

Proved live with autofill never invoked: `phoneIsOldNameNode: true`,
`phone.value === "Dana Whitfield"`; `websiteIsOldEmailNode: true`,
`website.value === "dana.whitfield@northgatelogistics.com"`. It also explains why
**Company** was never contaminated and never in the bug report: step 1's first
child is a `<select>` against step 2's `<input>`, different element types, so
React did replace that one.

Fixed with `key="step-1"` / `key="step-2"` on the branch wrappers, forcing a real
unmount/mount. After: both fields `""`, old nodes gone from the document, Back
still restores step 1, and a Step 2 → Back → Continue round trip preserves values
with no cross-contamination.

`autoComplete` was genuinely missing on every input and is now set
(`name`, `email`, `organization`, `tel`, `url`, explicit `off` on both selects and
the textarea) — but it was secondary, not the cause. `hp_confirm` is untouched:
same name, still `autoComplete="off"` + `tabIndex={-1}`. **`website` keeps
`type="text"` with `inputMode="url"`**, deliberately: `lib/validation.ts` accepts a
bare `tekguyz.com`, which `type="url"` treats as malformed, and that would put a
stricter rule in the markup than the shared schema. No two inputs share an `id`.

---

## Prompt 3 — three scoped fixes

### 1. Optional fields were unvalidated

`phone` and `website` were `z.string().optional()`, which accepted anything once
filled — `aedD@DWDD@#33uyz.com` reached the CRM as a website and a 19-digit run
as a phone number. Optional means the field may be **blank**, not that a present
value goes unchecked.

Rules now live in `lib/validation.ts` and are imported by **both** the client
schema (`components/contact-form.tsx`) and the server schema
(`app/actions/contact.ts`), so the two cannot drift — if the client were looser
the server would reject a submission the visitor was told was fine.

- **Website:** accepts bare domains (`tekguyz.com`), `www.`, an explicit scheme,
  and any path/query/hash. Rejects credentials in the authority (which is what
  the garbage input actually was), non-http(s) schemes, whitespace, hyphen-edge
  labels, and single-character TLDs.
- **Phone:** plausibility, not format — a sane character set plus an E.164-shaped
  digit count of 7–15. Deliberately not a US pattern, since delivery is
  nationwide and enquiries are international.
- Errors render inline under the field via the existing `FieldError`, on blur and
  on submit, with `aria-invalid` set. The phone hint is swapped for the error
  rather than stacking beneath it.

~~25 unit cases pass, including both exact garbage inputs.~~ **Corrected
2026-08-07 (Prompt 3): that claim was unbacked.** No test file, script, or test
framework existed anywhere in the repo — the rules had only ever been exercised
by hand in the browser. A real suite now exists at **`lib/validation.test.ts`**
(Vitest, `bun run test`): **46 cases pass**, covering both documented garbage
inputs, the credentials-in-authority rejection, the 7- and 15-digit phone
boundaries with real international numbers, bare-domain / `www.` / explicit-scheme
website variants, the `capPhoneDigits` typing cap, and the blank-vs-filled
behaviour of both optional schemas. Vitest is the only dependency added.

Browser verification (unchanged, and re-confirmed this pass with real typed
input): errors appear on blur, submission is blocked with nothing dispatched, and
valid values (`tekguyz.com`, `(954) 555-0123`) clear the error and restore the hint.

**Known strictness, accepted:** `1 (954) 555-0123 ext 4` is rejected because of
the letters. Allowing them would also admit `555-CALL-NOW`. The field is
optional, so the cost is low — revisit if real leads hit it.

### 2. Concierge replies read as a filled-in template

Markdown rendering was already fixed; the *content* was the problem, and the
cause was the system prompt itself — it literally instructed a numbered
template ("**The line**", "**The components**", "**The closest existing
build** — … give its page path"). The model was doing exactly as told.

- The three things a good reply covers are now described as substance to get
  across "without ever announcing that it is doing so", not as labelled fields.
- Two hard rules added: never print a raw route path or slug as visible text
  (name the build instead, and use a markdown link when a link is warranted —
  `[Team Performance](/work/team-performance)`), and never surface internal
  structural labels.
- `lib/concierge/grounding.ts` relabelled its `Page:` fields to
  "Link target (use only inside a markdown link, never as visible text)", since
  labelling them `Page:` was itself an invitation to echo them.
- Lists remain allowed — the components genuinely are a list. The banned thing is
  visible field names, not list formatting.

The renderer already supports `[label](/path)` with sanitized hrefs and renders
internal links without `target="_blank"`, so instructing links was safe.

### 3. Scroll reveals restored, correctly

Reinstated with IntersectionObserver per DESIGN.md's correction, replacing the
`animation-timeline: view()` attempt that was removed outright.

- `components/reveal.tsx` adds `is-revealed` on first intersection and calls
  `unobserve` immediately — genuinely once, which a scrubbed timeline cannot
  express (it ran in reverse on scroll-up and content vanished again).
- Plain CSS transition on the class change. Threshold 0.15, 80ms stagger via
  `data-reveal-index`, capped at 4 steps.
- **Content is visible by default.** `.reveal` alone does nothing; the hidden
  state lives on `.reveal-armed`, which only the controller adds, from an
  effect. An element can therefore only be hidden once JS is running and an
  observer is already attached to un-hide it. No JS, no observer support, a
  hydration failure, print, or a non-scrolling crawler all render the page
  fully visible — the blank-homepage bug is structurally impossible now.
- Anything already on screen at mount is revealed without animating, so
  above-the-fold content doesn't fade in on first paint.
- `prefers-reduced-motion` bails before arming anything, with a `!important`
  backstop in CSS.
- Hooks re-added to `case-study-row` (on the row, never the halves — text and
  media enter as one unit), `project-card`, and `solution-row`.

---

## Prompt 2 — what changed, and why

**The design export is now ground truth.** DESIGN.md's prose is a translation of it; where they disagreed, the export won. The rebuild touched nearly every component.

### The eight confirmed items, all fixed and measured in the live DOM

| # | Item | Measured result |
| --- | --- | --- |
| 1 | Nav CTA | `padding: 14px 24px`, `border-radius: 8px`, 14.5px — the only button size in the nav |
| 2 | Closing CTA | Subhead and trust row are separate elements; trust row is `flex-wrap: wrap` with 3px dot separators; button measures `18px 32px` at 16px |
| 3 | Footer bottom bar | Copyright only — 0 links in the bar, exactly 1 Privacy link site-wide (Company column) |
| 4 | Concierge FAB | `padding: 16px 24px`, `border-radius: 8px`, fixed 24/24 — same radius as every other button, not a pill |
| 5 | Thinking indicator | 72px x 3px, 4-column grid, 4 segments, inline beside the word "Thinking" |
| 6 | Image frames | Native `aspect-ratio: 16 / 10`, `overflow: hidden`, `padding-top: 0px` (no padding hack), `object-fit: cover`, `object-position: 50% 0%` |
| 7 | "How it's built" | 4 instances on `/work`, 1 on each standalone detail page |
| 8 | Theme toggle | 38x38, 6px radius, 1px border, 18x18 SVG, `stroke-width: 1.75`, export's exact moon/sun paths |

### Found in the audit, beyond that list

- **Honeypot was broken.** `hp_confirm` was declared `z.string().max(0)`, so a filled honeypot failed schema parsing and returned "Invalid fields" — the silent-accept branch underneath was unreachable dead code, and a bot got a clear signal it had been caught. Fixed on both client and server; verified a filled honeypot now shows success while dispatching nothing.
- **Scroll reveals removed.** `animation-timeline: view()` is a *scrubbed* timeline, so scrolling back up ran it in reverse and content that had appeared vanished again — the specified `once` semantics are not expressible with it. With `opacity: 0` resting state it also rendered half the homepage blank in any non-scrolling context. The export carries no section reveals at all, only the closing-CTA echo (Motion, real `once`). That is what ships.
- Hero media is a **surface-filled panel** bleeding `calc(-1 * max(0px, (100vw - 1216px) / 2) - 10vw)` past the right edge with `border-radius: 16px 0 0 16px` — not a bare image.
- Solution tags are **bordered pills** (`1px rgba(accent,.35)` over `rgba(accent,.12)`), not bare tints.
- Nav is 76px with an animated `::after` underline (scaleX, 240ms); scrolled state is 82% opacity + 14px blur.
- Inner-page headlines are at **hero** scale, not display scale.
- Flourish dots appear on **every** route's first section, at 9px with a 9px gap.
- Testimonial rebuilt as an ink card with real quotation marks — deliberately not the pull-quote treatment.
- FAQ rebuilt as hairline rows with one-open-at-a-time, replacing `<details>`.
- Concierge replies now render **markdown** (bold, lists, links, inline code, rules). The live model reliably emits all of these and they were showing as raw syntax. Link hrefs are restricted to http(s)/mailto//.
- `/contact` correctly carries **2** signature stripes, not 3 — the export has no closing CTA there, since the page itself is the ask.

### Live integration verification (real credentials, real dispatches)

- **Contact form, real submission through the real UI**: CRM accepted `200`; Resend notification `id=a6753c52-0f29-4fb1-82ca-aa72f8fddcf1`; confirmation `id=38270e96-7bb4-4e60-895a-186ba9c150d3`.
- **Honeypot**: success state shown, zero dispatch log lines — nothing sent.
- **Concierge lead capture**: ran through the *same* shared action with `source="AI Concierge"` (CRM `200`, Resend `id=b6414b05-0ef1-45b6-a195-054acf3fd604`), confirming the single-implementation rule.
- **Gemini 3.6 Flash**: real blueprint-shaped replies, no price, no timeline.
- **Upstash limiter is genuinely in use** — no fallback warning, limit trips at exactly the 12th request, and Upstash holds the limiter's own keys (`tg:concierge:*`).

### Deploy

- Repo pushed to `https://github.com/tekguyz/tekguyz-site.git` (branch `master`). The repo is **public**; verified before pushing that `.env.local` is untracked and no secret-shaped strings exist anywhere in the tree.
- **Preview** deployed to a NEW Vercel project `tekguyz-site` — deliberately not `tekguyz-website`, which is the project actually serving tekguyz.com. The preview carries no domain alias, so it cannot affect the live site. Confirmed tekguyz.com still returns 200 afterwards.
- The preview has **no environment variables set**, so the contact form and concierge will fail at runtime there. Everything else renders. Add the env set to the `tekguyz-site` project before using the preview to test those paths.
- **Third bug, found only by deploying:** `new Resend(process.env.RESEND_API_KEY)` ran at module scope, and `new Resend(undefined)` throws on construction. Merely importing the action exploded during Next's page-data collection, so the Vercel build failed while passing locally purely because `.env.local` existed here. The client is now constructed lazily, and a full build with every secret removed is verified green (45/45 pages).

### Deliberate deviations from the export, for the record

1. **Typography.** The export loads Geist + Inter. CANONICAL §2 dropped Inter in favour of Geist-only plus Geist Mono, a decision made *after* the export, and Mono-on-tags was explicitly confirmed. Geist + Geist Mono ships. **Overrule this if the export's pairing is what you actually want.**
2. **`/solutions` routing.** The export renders one long page with four inline sections; CANONICAL §4 reversed that to an index plus four routes because a `#fragment` is not a separate URL to a search engine. Routing follows CANONICAL; the export's section treatment is applied to the four detail pages.
3. **Project detail pages keep an "Open it in a new tab" link.** The export shows only a status line there, but that would leave four of eight builds with no way to open the demo from their own page, against the entire brand thesis.
4. **Project card copy** uses COPY.md's `summary` verbatim; the export shows a shortened variant, and copy is authored in COPY.md.

*(Claude Code: append a row here each time a new prompt completes, with a one-line summary of what it covered.)*

## What the master build actually shipped

- **Routes (18):** `/`, `/solutions`, `/solutions/[slug]` ×4, `/work`, `/work/[slug]` ×8, `/process`, `/contact`, `/privacy`, plus `not-found`, `error`, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, and 15 `opengraph-image` routes.
- **Verified at build time:** hero headline measures 72px wrapping to exactly 3 lines with the CTA row in the first viewport; hero media 16:9 `cover` bleeding past the right viewport edge with no horizontal page scroll; compact `LiveFrame`s all 16:10; exactly 3 signature stripes on every one of the 18 routes; the four-colour moving treatment present in exactly one place (the concierge's thinking state); primary button inverts to `#F5F5F5`/`#101010` in dark mode; `muted` → `muted-dark` swaps `#6A717E` → `#747C8B`; OG eyebrows use the `-text` variants (amber measured at 5.92:1, not the plain accent's 2.00:1).
- **Reduced motion verified live** (the build machine has the preference set): every entrance inert, status dot static at 0.85 with `animation: none`, zero elements left hidden.
- **No hydration warnings** in a production build.

### Decisions taken during the build, for the record

1. **Doc conflicts resolved by authority order.** CANONICAL §4's ASCII IA block still describes the withdrawn single anchored `/solutions` page; the prose below it reverses that, and SEO.md agrees — built as index + 4 detail routes. COPY.md's home solution links still point at `/solutions#anchor` and its nav note still says "four anchor links"; both now resolve to `/solutions/[slug]`. COPY.md and CANONICAL §4 both still describe the hero as the `sarah-demo.mp4` loop; CANONICAL §1 explicitly resolves that to a static image, so the hero ships `sarah-poster.webp` and the mp4 is untouched. **These four should be corrected in the docs.**
2. **`flourish-mark` vs the closing-CTA echo.** DESIGN.md's `closing-cta` entry describes the echo as "flourish dots → headline → subhead → button", but the Do list says "one flourish-mark per page, home only". The absolute rule wins: the closing CTA replays the sequence's *timing* and does not render a second set of dots.
3. **`[NEEDS REAL DATA]`** on the Field Photo Reports outcome is never rendered. The sentence ships as COPY.md's own qualitative wording, extended with "with no site visit required to confirm any of it" — language taken verbatim from PLAYBOOK §6 for that build, not invented. **Worth a copy review.**
4. **Geist Mono confirmed for tag labels** (DESIGN.md §2's optional third use), alongside the two locked uses.
5. **`updatedAt` is assumed**, not sourced — all 8 entries set to `2026-08-05`, the date the narratives were authored into COPY.md. Static routes keep request-time `lastModified` as the documented lesser fallback.
6. **Testimonial "Read it on Google"** points at the GBP listing from PLAYBOOK §9, since the direct review permalink is still open.

## Known Gaps

*Deferred deliberately, not forgotten. Each needs a stated trigger for when it gets revisited.*

| Gap | Why deferred | Revisit when |
| --- | --- | --- |
| Hero video loop (`sarah-demo.mp4`) | Static image ships first; video is a post-launch enhancement | A new recording of the real dashboard exists |
| Live iframe embeds (`embeddable` flags) | Needs `frame-ancestors` CSP added per demo app first | Ready to do the CSP work — one prompt per app, then flip flags |
| Compact-context image ratios — **measured 2026-08-07: all 8 are off 16:10** (1.02–1.33 against a required 1.60); only the 16:9 hero passes. Two of them (`sarah-project-thumb`, `crunch-wrap-dashboard`) crop to a fragment that reads as invented content, and `sarah-project-thumb` is a **simulator crop**, the PLAYBOOK §12 hard-rule violation | User's own call — recapture in progress. Wiring is confirmed correct and guarded by `bun run check:media`, so a fresh file under the same name renders with no code change | On drop-in. Re-run `bun run check:media` to confirm |
| ~~**AI Voice Receptionist has no documented compact-context filename**~~ | **Resolved 2026-08-07.** Decided `sarah-thumb.webp` for the 16:10 compact contexts, `sarah-poster.webp` stays the 16:9 hero and future video poster. Both are now in PLAYBOOK §12 and `content/work.ts` is rewired. `bun run check:media` fails the build until the recaptured file lands — expected, not a regression | On drop-in |
| ~~`/process` and `/contact` ship zero scroll reveals~~ | **Resolved 2026-08-07.** `/process` 0 → 4 (one per step, no stagger index — the steps are a screen apart, so an index would only add dead time), `/contact` 0 → 2 (trust lines and the FAQ section). The form itself deliberately gets none: it is in the first viewport and a form fading in on first paint reads as a slow page | — |
| ~~**`bun run build` currently fails at `prebuild`**~~ | **Resolved 2026-08-07.** `sarah-thumb.webp` has landed in `public/media/`. Full `bun run build` now passes end to end, 45 routes prerendered, zero type errors. The file is still **off-ratio** (1080×1059, 1.02 against the required 1.60) — that is the row above, not this one | — |
| **The four project thumbs are now rendered at 16:10 and are 600×450 (4:3)** — `object-fit: cover` drops the bottom ~17% of each. Newly visible because project detail pages did not show an image before this pass | Same recapture already in flight; no code change needed when it lands | On drop-in, with the rest of the 1440×900 set |
| `components/contact-form.tsx:92` — `react-hooks/incompatible-library` warning on React Hook Form's `watch()`. The React Compiler skips memoizing the component rather than risk stale UI | The mechanical fix is RHF's `useWatch`, but this is the file whose step-branch reconciliation caused the Prompt 4 field-contamination bug. Swapping its subscription API is a behavioural change, not a lint fix, and wants its own verification pass | Anytime it is worth a focused change plus a re-test of both form steps |
| `bun.lock` lost a stale `vercel@^58.7.1` devDependency during this pass | Not intentional and not a removal: the committed lockfile listed it while `package.json` never has, so any `bun install` would have re-synced it the same way. Net dependency change from this pass is zero — `eslint-config-next` was already installed | Confirm the Vercel CLI is not expected as a local devDependency; if it is, add it to `package.json` properly |
| ~~Motion-enabled behavior is unverified~~ | **Partly resolved 2026-08-07**, by the user on a Pixel 9A: the concierge thinking-stripe shimmer runs, and the hero's entrance sequence is visible on load — so the reveal layer and the four-colour treatment both work. The static stripe seen on the dev machine was the spec'd reduced-motion fallback, not a defect | Still unconfirmed with motion on: the `/process` progress fill advancing with scroll, and the closing-CTA echo. Check those two next time a motion-enabled device is in front of the site |
| `/privacy` ships zero scroll reveals | Out of scope this pass and arguably correct — it is a legal text page, and entrance animation on policy copy is decoration | Only if wanted |
| Nav scrolled-state transition is **240ms** in code (`nav.tsx:77`) against DESIGN.md §4's stated **200ms** | Still open. Prompt 6 was the doc-correction pass but scoped its DESIGN.md edit to `flourish-mark` only, and this is a value judgement (which number is right), not a stale-claim fix | Someone decides whether 200 or 240 is correct, then the other one changes |
| `app/icon.svg` is no longer transparent | Deliberate, 2026-08-07 (Prompt 6). It took the same `#101010` plate as the rest of the set so the favicon reads identically across browsers. The trade is that it no longer adapts to a light tab strip — it is now a dark tile there rather than a bare mark | Only if the dark tile reads badly on a light-chrome browser in practice |
| Favicon generation now runs on `prebuild` | Not a gap, a note: PLAYBOOK §13 always claimed build-time generation and it was manual until now. `sharp` + `png-to-ico` are devDependencies, which Vercel installs for builds — if a future deploy ever runs with `NODE_ENV=production` install pruning, this step is what breaks first | A deploy fails at `prebuild` on a missing `sharp` |
| `bun run test` is not wired into CI or `prebuild` | The suite is pure-function and fast (~0.7s), but nothing yet forces it to run. Adding it to `prebuild` would couple the build to test state, which is a call worth making deliberately rather than in a fix pass | CI exists, or someone wants the build to gate on it |
| ~~**Every other route still returns a multi-child fragment**~~ | **Resolved 2026-08-07.** All 7 remaining page components wrapped in a single root element. Measured across all 18 routes with `Element.prototype.scrollIntoView` instrumented: exactly **1** call per route, target a `DIV` | — |
| Motion cannot be visually confirmed in this environment | Two independent blockers, neither of them the code: Windows animations are off (`MinAnimate=0`), so `prefers-reduced-motion: reduce` matches machine-wide; and the in-app Browser pane is hidden (`document.hidden === true`), so the page never composites — `requestAnimationFrame` and IntersectionObserver callbacks never fire and screenshots time out | To see the entrances: turn Windows animations on (Settings → Accessibility → Visual effects → Animation effects) and keep the Browser pane displayed. **Not changed here — it is an accessibility preference** |
| ~~`bun run lint` is broken~~ | **Resolved 2026-08-07.** There was no config file of any kind, so ESLint 9 exited before linting anything. `eslint.config.mjs` added, importing `eslint-config-next`'s native flat config directly (it is **not** FlatCompat-loadable). 0 errors. One warning left deliberately — see the Prompt 5 section | — |
| Cal.com scheduling | Current funnel problem is lead follow-up, not booking friction — adding a second conversion path before measuring the first risks splitting the data | A few weeks of real inbound data suggests booking friction is real |
| Privacy policy — concierge data flow, CRM forwarding, phone field not yet disclosed | Legal document, needs real review, not invented text | Legal review happens |
| Terms of Service | No checkout/account system to need one; the one place it'd matter (concierge liability) needs a lawyer's line, not mine | If launch reveals an actual need |
| GBP Services section | Not a website task | Anytime — highest-leverage open SEO item, do in parallel |
| ~~`GEMINI_API_KEY` not set~~ | **Resolved 2026-08-06.** Key present; real replies verified | — |
| ~~No KV/Upstash credentials~~ | **Resolved 2026-08-06.** `UPSTASH_REDIS_REST_URL` / `_TOKEN` present; limiter verified against real Upstash keys | — |
| ~~Contact + concierge never exercised end to end~~ | **Resolved 2026-08-06.** Real submissions landed in the CRM and Resend, with message IDs recorded above | — |
| Privacy policy — concierge data flow, CRM forwarding, phone field **still undisclosed** | Legal document, needs real review, not invented text. Flagged for a second time | Legal review. This is the last content blocker before launch |
| `[NEEDS REAL DATA]` — Field Photo Reports outcome | Never filled, per the hard rule | If a real, verifiable number exists |
| GBP review permalink | Still open; testimonial links to the GBP listing instead | When the direct review URL is available |
| `lockup-master.svg` wordmark still a `<text>` element | Pre-existing; the site renders the lockup as JSX so it's unaffected, but exported assets are | Before handing the SVG to any external vendor |

## Deliberate non-features

*So nobody "fixes" these later by accident — each was a considered decision, not an oversight.*

- No pricing page — every CTA routes to a conversation instead.
- No toast notification system — form and concierge already have dedicated inline success/error states; a toast layer would be a second, competing feedback mechanism.
- No modals or popups anywhere — the concierge is a persistent panel, not a takeover; no cookie banner (the site doesn't use cookies); no newsletter popup.
- `project-card` never gets an image — the size/weight gap from `case-study-row` is intentional signal.
- The four-color moving treatment appears in exactly one place: the concierge's thinking state.
