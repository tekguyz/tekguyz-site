# TEKGUYZ Design System v2.6

*Supersedes v2.5.*

**Governed by:** `docs/CANONICAL.md` · **Copy:** `docs/COPY.md`

## How to read a value in this document

This document has been wrong in public more than once — §4 claimed the nav
border faded over 200ms when no surface ever implemented that, §4 called
`flourish-mark` home-only while it rendered on every route, and three "open
blockers" quoted from it in August 2026 turned out to be already built. The
cause is structural: it was written as one voice, so a measured fact and an
untested aspiration looked identical on the page.

**From v2.6, every value carries its provenance, and a value that cannot be
given one gets deleted — because a number nobody can source is a number nobody
checked.** Three kinds, and they are not interchangeable:

| Marker | Means | If it disagrees with the code |
| --- | --- | --- |
| **[measured]** | Read out of the code, with the file it came from and the date. | **The document is wrong.** Re-measure and fix the document. |
| **[decided]** | A choice, with a date and a reason, usually naming what was rejected. Cannot be derived from code. | **The code is wrong.** This is the half worth keeping. |
| **[export]** | The approved Claude Design export's value, not yet built. | Neither is wrong yet. It is a target, and it says so. |

### The values moved out. This file is the reasons.

**Every token now lives in [`TOKENS.md`](TOKENS.md), where it is enforced** —
`bun run check:design` runs on every `prebuild` and fails the build when that
file and `app/globals.css` disagree, naming the token and both values. **38
tokens are under test** — measured 2026-08-12 by running it; this line said 40
— covering colour, type, radius, container, motion and density.

That split is the actual fix for what went wrong here. This document was 89KB
doing two jobs at once, and a reader could not tell a measured fact from an
untested aspiration, so the measured half rotted. Now:

| You want | Go to |
| --- | --- |
| A **value** — "what is `--dur-base`?" | `TOKENS.md`. It is checked, so quote it freely. |
| A **reason** — "why no overshoot?" | Here. |
| A **mechanism** — "why is `LiveFrame`'s padding 0?" | Here. Prose, uncheckable, still authoritative. |

**Do not copy a token value back into this file.** One source per number is the
entire point; a second copy is a second thing to drift.

### Conversion status, honestly

| Section | State |
| --- | --- |
| All token values | Moved to `TOKENS.md`, **enforced** |
| §6 motion, §8.0 density | Rewritten with provenance |
| §4 components, §5 status-line, §7 dark mode, §9 do/don't | **Converted 2026-08-12.** Every claim measured; 14 were wrong and are named at the point they were wrong. |
| §0–§3 mandate, icons, colour, type, layout | **Not converted.** Still the old single voice; treat with suspicion. §1's ratios are real (v2.3 audit) but not machine-checked. |

**Prose is not checkable by the guard and never will be** — "the status block
sits beneath the frame" has no token to compare against. That is why the marker
exists: it records who checked, against what, and when.

**A date on `[decided]` that reads `v2.2`–`v2.5` is a changelog version, not a
calendar date.** Those decisions predate this convention and their real dates
are not recoverable from the repo. The version is the most specific honest
provenance available; do not upgrade one to a date by guessing.

## Changelog (v2.5 → v2.6)

- **§6 Motion rewritten as a three-layer system.** The site shipped with an
  *entrance* layer and a thin *hover* layer and **no state layer at all** —
  nothing animated when something on the page changed. That absence, not the
  count of motion ideas, is what made it read like a document.
- **`.tg-rule` — one state primitive, drawn from the nav's own indicator.**
  Generalised rather than invented; the nav's active-page bar already did it
  and was the only thing that did.
- **§8 gains a density scale.** Mobile was desktop values with one `sm:` step,
  chosen per component. Two tokens now carry it, and the exemplar
  (`testimonial.tsx`) is rebuilt against them.
- **The provenance convention above.**

## Changelog (v2.4 → v2.5)

Three elements that shipped as generic defaults, because this document never
specified them. None of them was a build error — each was built correctly
against guidance that did not exist. **They are one pass**, because fixing a
specification gap piecemeal produces three unrelated treatments.

- **The proof line gets an entry at all** (D-09). CANONICAL §98 fixed its content and its "no card" treatment and stopped there, so it shipped as one 28px line whose *actionable half* was muted grey with no rest-state underline. New entry in §4.
- **`LiveFrame`'s container is specified** (D-11). The old entry defined the two ratios and `object-fit` and said nothing about fill, padding, radius, or where the status block sits — so the compact contexts inherited a generic card. The hero's panel was specified; the compact contexts' plate was not. New sub-entry under `LiveFrame` in §4.
- **The alternating case-study rows stop alternating their DOM order** (§3, §8). Reported after the pass above: below 768px the home band and `/work` put two posters back to back, because a one-column grid has nothing left but source order. The alternation moves entirely onto `grid-column` with both halves pinned to `grid-row: 1`. Found alongside it: `gap-y-12` on those rows **had never applied** — `.tg-grid`'s unlayered `gap: 24px` beat it — so the stacked split gap is now a real 48px via `.tg-split`.
- **`closing-cta` gets an internal rhythm, and the ~200px of dead space above it is fixed at the collision** (D-12). The band matched its old entry element for element and read flat: near-linear 24/32/36 gaps, so nothing grouped and nothing anchored. Revised entry in §4, plus a new rule in §3 for the section boundary above it.

## Changelog (v2.3 → v2.4)

- **Closing CTA's real problem identified**: not spacing, which was already correct — the button was underpowered relative to the headline above it. Given its own documented size exception, plus a small secondary text link to the AI concierge as a lower-commitment path.
- **Hero gets its own frame ratio, 16:9**, separate from the 16:10 used everywhere else — resolves the crop-vs-gap tension that comes from forcing a 16:9-native screen capture into a 16:10 container.
- **AI concierge's "thinking" state upgraded** from a plain muted dot to a shimmering version of the signature stripe — the one functional, restrained use of the brand's four-color system in motion, and the only place it appears.

## Changelog (v2.2 → v2.3)

- **Hero type scale confirmed at 72px**, not 76px — measured against the real headline by the contrast/layout pass, hitting exactly 3 lines with the CTA row inside the first viewport.
- **Full color audit results applied and locked.** Every color/contrast claim is now backed by a measured, verified ratio: `muted` darkened to #6A717E, `muted-soft` retired as a text color, `--muted-dark` (#747C8B) added to close the dark-mode gap, and dark-specific text variants locked for blue (#5380E4) and violet (#8377E2) — amber and teal already passed as their plain accent value. One documented exception: the home ink band's violet tag keeps a literal hex rather than the token, since the token would resolve to the wrong (light-mode) value there.
- **The `-text` variant rule broadened** — it was scoped too narrowly to "tinted backgrounds" and missed the Solutions page's colored eyebrows, which were failing in three of four accent colors.

## Changelog (v2.1 → v2.2)

- **Icon policy reversed, with a real rule in its place.** The original "no icons anywhere" instruction was too literal a reading of "no emojis/icons for their own sake." Icons are fine where they do real work: the footer's social row and the theme toggle now use icons. `solution-row` stays icon-free — that was never the part anyone objected to.
- **Hero type scale recalibrated.** The old `--text-hero` max (104px) was set without checking it against the actual headline copy's length, so it wrapped to 6 lines and pushed the CTAs off-screen. Fixed against the real copy, not an arbitrary ceiling.
- **`closing-cta` corrected a second time** — the first fix matched it to standard section scale, which was itself the wrong target; it needed to be *more compact* than a standard section, not equal to one. The proof line is also removed — it duplicated the homepage's proof strip and read as filler.
- **`footer-dark` masthead tightened again** — 64/48 wasn't enough.
- **`build-narrative` scope corrected** — it was only specified for standalone detail pages, but `/work` index shows the same full-length case-study-row content and had the identical empty-space problem. Now applies everywhere the full-length case-study content appears.
- **`LiveFrame` given real guidance on hero vs. card assets** — the hero and the compact card contexts don't have to share one identical crop; a dense dashboard screenshot that reads fine in a small card can be too busy blown up large in a hero.
- **Concierge launcher must use the real `icon-master.svg`** — it had drifted into a generic 2×2 dot grid instead of the actual Connected Nodes mark.

---

## 0. The mandate: this must not look like the current tekguyz.com

The current site is a *correct* implementation of the brand tokens and still reads as competent-generic. The tokens aren't the problem — the expression is. This section is the contract that prevents a redraw.

**Five structural departures. All five are mandatory. If the finished build doesn't visibly differ on every one of these, it has failed.**

| # | Current site | v2.2 requirement |
| --- | --- | --- |
| 1 | Hero headline 46px | **Hero headline dramatically larger** — see §2 for the corrected scale. Body stays ~17px. |
| 2 | All-white page, dark footer only | **A full-bleed ink section mid-page.** Featured Work sits on `#111111`, edge to edge. The page reads white → ink → white → ink footer. Completely different scroll rhythm. |
| 3 | Four identical solution cards in a row | **Four full-width rows**, hairline-separated, each with a large display-size title. The identical-card-grid is a named anti-pattern; stop using it. |
| 4 | Symmetric centered container | **Asymmetric 12-column grid.** Hero text spans cols 1–6; media spans 7–12 and **bleeds past the right viewport edge.** Nothing is centered except the closing CTA. |
| 5 | Decorative "LIVE" badge | **Measured status line** with a real timestamp in tabular numerals. See §5. |

**Also forbidden, explicitly:** do not consult, fetch, or imitate the current tekguyz.com layout. It's the thing being replaced.

**Guard against the AI-design defaults too** — the three clusters generated design falls into are (a) cream background + high-contrast serif + terracotta accent, (b) near-black + one acid-green accent, (c) broadsheet hairline grid with zero border-radius. This system is none of them, and the fix for #3 above is *not* to swing into (c): keep the radius scale, keep surface fills. Editorial, not newspaper.

---

## Icon policy

Icons are allowed where they do real, recognizable work — not banned outright, and not scattered decoratively either. Concretely:

- **Yes:** the footer's social row (LinkedIn, Instagram, Facebook, GitHub — recognizable marks, icon-only, no label needed), the nav's theme toggle (sun/moon or equivalent — a near-universal, well-understood control).
- **Execution matters more than the yes/no.** Any icon used must match the site's own line weight — thin, consistent stroke, single color (`muted` default, `ink`/`text-primary-dark` on hover), never each platform's brand color, never a mismatched icon set where one glyph looks heavier or rounder than the rest. Source from one consistent icon set and restyle stroke-width to match; don't mix sets.
- **Still no:** icons on `solution-row` (the accent dot is the icon there — that rule wasn't the problem and doesn't change), and no decorative icons added just to fill visual space. Every icon on the site should be answering "what is this control" — not standing in for a word that would've worked fine on its own.

---

## 1. Colors — corrected against a real measured audit

| Token | Value | Use |
| --- | --- | --- |
| `ink` | #111111 | Primary CTAs, headlines, primary text, **the full-bleed band** |
| `canvas` | #FFFFFF | Page floor, light mode default |
| `surface-card` | #F5F5F5 | Cards, fills |
| `hairline` | #E5E7EB | 1px borders, light |
| `muted` | **#6A717E** *(locked, was #6B7280)* | Secondary text, eyebrows, captions, form labels — everywhere `muted-soft` used to be. 4.91:1 on canvas, 4.50:1 on `surface-card` — the minimum step that clears both; one step lighter fails `surface-card`. |
| ~~`muted-soft`~~ | #9CA3AF | **Retired as a text color, locked.** All 88 uses across both files moved to `muted`. Still valid for non-text use only: dots and the concierge's thinking indicator. |
| `muted-dark` | **#747C8B** *(locked, new)* | Dark-mode secondary text — closes the gap where dark mode had no dedicated secondary color at all. 4.53:1 on `#101010`. Replaces every hardcoded `#6B7280` in dark contexts, including the footer's three column headings and both bottom-bar lines. |
| `bg-dark` | #101010 | Dark-mode page bg + permanent footer |
| `text-primary-dark` | #F5F5F5 | Dark-mode text |
| `border-dark` | #2A2A2C | Dark hairlines |

**Wayfinding accents** — dots, tags, badges, and pull-quote borders only. **Never a button fill. Never a 5th color.**

| Token | Value | Solution line | `-text`, light mode | `-text-dark`, dark mode |
| --- | --- | --- | --- | --- |
| `accent-blue` | #3B6FE0 | Smart Operations | #1E3F94 (9.57 on white) | **#5380E4** *(locked, new)* — 5.05 on `#101010`, 4.55/4.51 against the accent's own 12% tint over `#101010`/`#111111` |
| `accent-violet` | #7C6FE0 | AI Voice Agents | #4433A8 (9.19 on white) | **#8377E2** *(locked, new)* — 5.17 on `#101010`, 4.58/4.54 against tint |
| `accent-amber` | #F2A93C | Business Systems | #8A5A0A (5.92 on white) | Plain accent, no separate variant — 7.81/7.72 against tint, passes clean |
| `accent-teal` | #2FA679 | Custom Web Apps | #1D6B4D (6.44 on white) | Plain accent, no separate variant — 5.37/5.32 against tint, passes clean |

**One documented exception, intentional, don't "fix" it:** the home ink band's violet tag uses the literal `#8377E2` value directly rather than resolving through the theme-aware token. The ink band is visually dark regardless of the site's light/dark toggle, so if it read the token normally it would flip to the *light-mode* violet `-text` value (#4433A8, tuned for white backgrounds) whenever the site itself is in light mode — wrong for a tag that always sits on a dark fill. This single literal-value exception is also what resolved the earlier `/work` index inconsistency (`#4B3FAF` vs `#4433A8`): all tag colors are now theme-aware tokens rather than page-by-page hardcoded hex, so that class of drift can't recur.

Mapping lives in `config/solutions.ts` — never hardcoded per component (the ink-band violet above is the one deliberate, documented exception). Dots use full accent in both themes and never theme-swap; structural strokes do. This includes the footer's Solutions list dots.

**The `-text` variant rule is broader than originally scoped**: it applies anywhere an accent color is rendered as text at small/bold sizes against *any* light background — not only literal tinted badges. The Solutions page's colored eyebrows were missed by the narrower original wording and are now fixed with the same values above: blue 9.57, violet 9.19, amber 5.92, teal 6.44 — all measured on white.

**Status-line dots** (`success` #10B981 at 2.48:1, and the retired `muted-soft` used only for the unreachable dot at 2.54:1) measure below the 3:1 non-text threshold as standalone color — **decided, not left open: accepted as-is.** Both always appear paired with a text label ("Live," "Temporarily unreachable") that carries the same information independently, so a viewer who can't distinguish the dot's color still gets the status from the word next to it. Not revisiting this.

**Confirmed passing, no action needed:** `status-line` text in both themes, the ink band's `#F5F5F5`/`#9CA3AF` pairing, `button-primary` in both themes.

Semantic: `success` #10B981 · `warning` #F59E0B · `error` #EF4444.

---

## 2. Typography — the biggest single change, recalibrated

**Geist** for everything — display (600–700) and body/UI (400–600). Wordmark is Geist 800, fixed brand treatment.

**Single-family, deliberately.** Earlier versions paired Geist with Inter, but both are neo-grotesque sans faces built for screen UI — near-identical in use case, so the pairing cost two font loads and delivered almost no visible contrast. Hierarchy here comes from weight and a 4× size jump (72px/700 hero against 17px/400 body), which is more than enough. One family is also faster and more consistent with a system whose entire thesis is restraint.

**Explicitly rejected: adding a display serif** (Playfair Display or similar). It reads fashion/editorial/luxury, which fights "Confidently Engineered," and high-contrast serif is one of the three aesthetic clusters AI-generated design reliably falls into — it would make the site look more templated, not less.

**Self-host via `next/font`.** Note this does *not* fix `lockup-master.svg`'s `<text>` element for standalone use: when an SVG is inlined in JSX the page's CSS applies and Geist renders correctly, but when the same file is used as a favicon, inside an OG image, or handed to a print vendor, no external CSS loads and the text falls back to something arbitrary. Outline the paths on the master asset regardless of self-hosting.

**Second face, added deliberately: Geist Mono, narrow functional use only.** Unlike the Geist/Inter pairing this replaces, Mono is a genuine register shift — not two similar grotesque sans faces. It's also Vercel's own engineering-tool typeface, which fits TEKGUYZ's positioning directly: real tooling, not a marketing font. Used in exactly three places, `--text-sm`, `tabular-nums` where relevant:
- `status-line` timestamps ("checked 14 minutes ago")
- `numeral-device` on Process steps (01–04)
- Solution/case-study tag labels, if a more technical treatment is wanted there — optional, confirm before applying

**Never** in body copy, never in a headline, never as a body-text substitute anywhere. It's a functional accent typeface, the same restraint logic as the four accent colors — earns its place by doing a specific job, not by being sprinkled in for texture.

**The type scale lives in [`TOKENS.md`](TOKENS.md#type), where it is enforced.**
Do not copy the values here — one source per number is the whole point of the
split.

**Why 72px, exactly:** the first correction (76px) was still one step off — it wraps to 4 lines, not 3, in the unchanged 596px hero text column. 72px is the measured value that actually hits 3 lines with the CTA row inside the first viewport, confirmed against the real headline, not estimated. **The rule that governs is the constraint, not this pixel value**: this headline must wrap to no more than 3 lines on desktop, and the primary CTA row must always be visible without scrolling. If the headline copy changes length in the future, re-measure against that rule — don't assume 72px still holds.

| Role | Size | Weight | Leading | Tracking |
| --- | --- | --- | --- | --- |
| Hero h1 | `--text-hero` | 700 Geist | 0.95 | −0.045em |
| Section head | `--text-display` | 700 Geist | 1.05 | −0.03em |
| Solution row title | `--text-display` | 600 Geist | 1.1 | −0.025em |
| Card / detail title | `--text-title` | 600 Geist | 1.2 | −0.02em |
| Body | `--text-body` | 400 Geist | 1.6 | 0 |
| Small / meta | `--text-sm` | 400 Geist | 1.55 | 0 |
| Eyebrow | `--text-caption` | 700 Geist | 1.4 | 0.1em, uppercase |
| Button | 14.5px | 600 Geist | 1.0 | 0 |

Hierarchy comes from weight and size, never from switching families. All numerals in status lines, timestamps, and any figures use `font-variant-numeric: tabular-nums`.

---

## 3. Layout — asymmetric grid

- Base unit 4px. Scale: 4·8·12·16·24·32·48·64·96·128.
- **12-column grid**, 24px gutters, container 1280px max with 32px outer padding (24px mobile).
- **Section rhythm:** 128px vertical padding desktop, 80px mobile. Consistent, generous — this carries the "premium" feel more than any decoration. **Sub-elements within a section (nav, footer masthead, `closing-cta`) use their own, smaller values — see their component entries. Don't let 128px leak into places it was never meant for; this has already happened twice.**

**Asymmetry rules (this is what breaks the template look).** These spans are the
**12-column** case, i.e. ≥1024px. Every one of them has an 8-column equivalent for
the 768–1023px band, tabulated in **§8** — read both before placing anything, because
a 12-column span left to run on an 8-track grid silently creates implicit tracks
rather than erroring:
- Hero: text cols 1–6, media cols 7–12 **bleeding past the right viewport edge** (media container extends beyond the 1280px cap). Column spans are unchanged by the v2.2 type-scale fix — see §2 for why the fix was in font-size, not column width.
- Solution rows: accent dot + title cols 1–5, hook + arrow cols 7–12. The gap at col 6 is intentional.
- Featured Work rows alternate: text 1–5 / media 7–12, then media 1–6 / text 8–12. Not mirrored — offset. **The alternation is `grid-column` only. DOM order is reading order — text, then media — on every row, and both halves are pinned to `grid-row: 1`.** The pin is not decoration: with sparse auto-flow, an item whose column-start sits *behind* the placement cursor is pushed to the next row, so the odd row's left-hand media would drop below its text if the DOM stayed in reading order without it. That is why these two components alternated their source order for months, and **that alternation is what put two posters back to back below 768px** — one column, so source order is all that survives of the layout: the row ended on its image and the next opened with the following one. On `/work` it was worse than cosmetic, because the media column carries the status line and "How it's built": the odd rows opened with a screenshot and a build note for a project the visitor had not been introduced to yet. Pin the row, place the columns, leave the DOM alone.
- Detail pages, and `/work` index case-study rows: content cols 1–8, sticky meta rail cols 10–12. The media column (image, status-line, caption, `build-narrative`) should read as intentionally composed against the text column, not trail off into empty space — see `build-narrative` in §4.
- **Only the closing CTA band is centered.** Everything else is left-anchored.

**Radius, container and spacing values live in
[`TOKENS.md`](TOKENS.md#radius-container-spacing), where they are enforced.**

**Elevation: flat. [decided, standing]** Hairlines only, no shadows anywhere.
Hover lift comes from position, not shadow.

**The boundary above `closing-cta` — one gap, counted once.** Every route ends the
same way: a section closing at full 128px bottom rhythm, then the signature
stripe, then `closing-cta`'s own top padding. That is two complete gaps stacked
across a 6px rule, and it measured **202px** from the last piece of content to
the closing headline on `/` (and more on `/solutions`, `/process` and the detail
pages, where the preceding block has its own trailing padding on top of that).

128px exists to separate **two content sections**. What follows here is not a
content section — it is a full-bleed coloured rule, and a rule is already a
boundary. So a section that closes *into* the closing stripe sheds half its
bottom rhythm: **64px desktop, 40px below 768px.** With `closing-cta`'s own
40/32px top padding that puts the last content 110px (desktop) / 78px (mobile)
from the closing headline — roughly one rhythm unit **in total**, which is what
the rhythm was always asking for.

**This is fixed at the collision, not at the global value.** `--` the 128px
section rhythm is untouched, and so is every page's markup: the rule is
`:where(section, div):has(+ .tg-closing)` in `globals.css`, one declaration,
matching only the element that immediately precedes the closing band. Verified
before it was written that **all seven routes carrying `closing-cta` end that
element at exactly 128px**, so the rule only ever *reduces* — it can never add
padding to a neighbour that had none. It sits unlayered in `globals.css`, so it
beats Tailwind's `pb-32` from `@layer utilities` by layer rather than by source
order; see §8's note on why a source-order win is not something to rest on.
Re-measure `padding-bottom` on that element if a route's ending block ever
changes shape.

**Signature stripe:** four-segment accent bar, exactly three per page — top of hero, above closing CTA, bottom of footer. Nowhere else. Identical treatment every time it appears: full-bleed edge-to-edge, 6px height, four equal-width segments.

---

## 4. Components

*Converted to the provenance convention 2026-08-12. Every value below was read
out of the file named beside it on that date. Fourteen claims did not survive
contact with the code; each is called out where it stood rather than quietly
corrected, because a silent reconciliation is how this document earned its
reputation in the first place.*

**Values are not repeated here when `TOKENS.md` already carries them** — a
radius, a duration, a colour or a type step is named, not printed.

### 4.1 Buttons

**[measured 2026-08-12 `components/button.tsx`]** There are **four** sizes, not
one, and they are not interchangeable:

| Size | Padding | Used by |
| --- | --- | --- |
| `nav` | 14 × 24px | the only button size in the nav bar |
| `default` | 15 × 24px | hero primary, sticky-rail CTA, cap-reached handoff |
| `form` | 15 × 28px | Continue / Send Inquiry inside the form card |
| `large` | 18 × 32px, 16px text | `closing-cta` only |

> **This document was wrong.** Its `button-primary` entry printed "14×24px
> padding" as *the* button geometry. That is the nav size. Quoting it as the
> site's button size is how `default`, `form` and `large` become invisible to
> anyone reading the doc instead of the file.

**[measured 2026-08-12 `button.tsx`, `app/globals.css:47`]** Primary is
`--tg-cta-bg` / `--tg-cta-fg` / `--tg-cta-hover`, which invert wholesale by
theme — ink on white in light, `#F5F5F5` on `#101010` in dark. Secondary is
transparent with a 1px hairline and ink text.

**[decided v2.2, standing] No accent ever fills a button.** The four accents
mean *solution line*; a filled button would assign one arbitrarily.

**[decided v2.2]** Secondary is 14 × 24 against primary's 15 × 24 so a primary
and a secondary side by side in the hero end up the same painted height — the
primary's extra 1px per side pays for the border the secondary carries.

**[decided 2026-08-12, D-10] The line height rides ON the font-size utility
(`text-[14.5px]/[1]`), never on a separate `leading-none`.** `cn()` is
tailwind-merge and Tailwind's `text-*` utilities set line-height too, so a later
font-size class is treated as conflicting and the earlier `leading-*` is dropped
before it reaches the DOM. That shipped a 23.2px line box on a 14.5px button —
8.7px taller than the export, on every button on the site.

### 4.2 `nav`

**[measured 2026-08-12 `components/nav.tsx`, `globals.css:58–93`]** Sticky,
76px tall. At scroll 0 the fill layer is fully transparent and the border is
transparent. Past 24px of scroll `data-scrolled='true'` switches
`--tg-nav-bg` to **82% opacity**, `--tg-nav-blur` to **14px**, and the border to
opaque hairline.

> **This document was wrong, twice on the same line.** It said 80% opacity and
> `backdrop-blur(12px)`. Neither number is in the stylesheet. This is the third
> time this entry has printed a value no surface implemented — the first was the
> 200ms border fade, corrected in v2.5.

**[measured 2026-08-12 `nav.tsx:104`]** The scrolled state transitions over
240ms. **The value is hardcoded in an inline style, not `var(--dur-base)`** —
it currently agrees with the token by coincidence, not by reference, and
`check:design` cannot see it. Logged in `STATUS.md`.

**[decided 2026-08-12] The `<header>` carries no border of its own.** In
Tailwind v4 preflight an unqualified `border-b` resolves to `currentColor` — a
permanent ink/white line painted onto the signature stripe at every scroll
position. The one specified hairline lives on the absolutely-positioned fill
layer so it can fade in with the scrolled state.

**[measured 2026-08-12 `nav.tsx:139`]** Links are **14.5px, weight 500**.

> **This document was wrong.** It said `--text-sm`, which is 14px. The nav does
> not use the type scale here; the export's value is 14.5px and that is what
> ships.

**[measured 2026-08-12 `nav.tsx:139`, `globals.css:671–705`]** The active-page
indicator is `.tg-rule` — 2px, ink, drawn from the left, never an accent — with
`[data-navlink]::after { bottom: -10px }` hanging it below the link box. It is no
longer a private nav rule; see §6.2 for why the nav consumes the site primitive
instead of owning a second copy.

**[measured 2026-08-12 `nav.tsx:200–209`]** Mobile is a hamburger and a
full-screen drawer; Solutions expands inline to the four accent-dot entries,
which are **four routes** (`/solutions/[slug]`).

> **This document was wrong.** It called them "the four accent-dot anchors."
> CANONICAL reversed the single anchored page to an index-plus-detail structure;
> this line was left behind.

**[measured 2026-08-12 `nav.tsx:145`, `theme-toggle.tsx`]** The theme toggle is
an icon (38 × 38, sun/moon), not a text label.

### 4.3 `page-hero`

**[measured 2026-08-12 `components/page-hero.tsx`]** Every inner route: signature
stripe, then a section with `flourish-mark` → eyebrow (`--text-caption`, 0.1em,
uppercase) → headline, on cols 1–8, with the one-line description bottom-aligned
on cols 9–12. Padding is **96px top / 104px bottom**, its own value.

**[measured 2026-08-12 `page-hero.tsx:40`] The headline is `--text-hero`, not
`--text-display`.**

> **This document was wrong.** It said "`--text-display` (not hero scale)", with
> the parenthetical making it look deliberate. The export puts the inner-route
> headline at hero scale and that is what ships. The component's own header
> comment has flagged the disagreement for as long as the file has existed.

> **This document was wrong.** It also said "top padding matches standard
> section rhythm." Section rhythm is 128/80; this is 96/104. Deleted rather than
> corrected into a rule, because 96/104 is the export's composition value and
> nothing derives from it.

**Deleted, unsourceable:** "description … capped around 60ch." There is no
`max-width` or `ch` cap on the description in `page-hero.tsx`; its measure comes
from the 4-track grid placement. A cap nobody can find in the code is a value
nobody checked.

**[measured 2026-08-12 `page-hero.tsx:35`]** It carries `flourish-mark`, above
the eyebrow, on every inner route. See §4.11.

**[measured 2026-08-12 `page-hero.tsx:66–103`]** `SectionHead` is a second
export in the same file and a different component: eyebrow + `--text-display`
headline on cols 1–6, description bottom-aligned on 7–12, with an `onInk`
variant. It is the in-page section head, not a page hero.

### 4.4 `proof-line`

**[decided v2.5, D-09]** CANONICAL §98 fixes the content and says "one sentence,
no card" and stops there. This is the treatment it never gave.

**[measured 2026-08-12 `app/page.tsx:62–79`]** Full-bleed band, hairline top and
bottom, no fill, no radius, no inset — that is what "no card" means in positive
terms. **36px vertical padding** (`py-9`), its own value: the band is a
rule-to-rule beat between two sections, not a section, and 128px must not leak
into it. Left-anchored in `tg-container`.

**[measured 2026-08-12]** Two clauses, baseline-aligned on one row, **20px
apart** (`gap-x-5`), wrapping to a stack:

- *Eight live builds.* — `--text-title`, weight 600, −0.02em, **ink**.
- *Open any of them right now.* — `--text-body`, weight 600, **ink**,
  `link-underline`, `tap-44`, → `/work`.

> **This document was wrong.** It specified `tap-24` on the link. The code uses
> `tap-44`, deliberately and with the reason recorded at the call site: the 24px
> tier is for links inline in running prose, and this one is its own element on
> its own baseline that stacks onto its own line below 768px. The code is right
> and this line has been corrected to match it.

**[decided v2.5] Both halves are ink; the size step carries the hierarchy.** It
shipped as one 28px line with the link half in `muted`. **`link-underline` draws
nothing at rest** — it grows from 0% on hover and focus — so the only actionable
element on the site's proof band had no rest-state affordance *and* was the
lighter half of its own sentence. Muting the invitation inverts the hierarchy:
the claim is what you read, the invitation is what you click.

**[decided v2.5] Rejected: promoting the whole line to `--text-display`.** It
would put three display-scale elements inside one scroll — the hero `h1` above
and the "What We Do" head below — and the proof line is a supporting fact, not a
third headline. **Rejected with it: an accent dot before the sentence.** The four
accents mean *solution line*; this sentence is about all eight builds across all
four, so no accent is correct and one would have to be picked arbitrarily.

### 4.5 `closing-cta`

**[decided v2.2, re-decided v2.4, re-confirmed 2026-08-13] Centered — the one
section permitted to be**, and deliberately more compact than a standard section
rather than equal to one.

> **[decided 2026-08-13] Rejected: un-centering it to match the hero.** It is
> the strongest bookend rhyme available and it was still wrong twice over. It
> makes the two ends structurally *identical* rather than rhyming, which is the
> opposite of the brief; and it spends the site's one documented centering
> exception to buy that. §3's "only the closing CTA band is centered" is
> unchanged. The bookends rhyme through the `--tg-surface` ground and a shared
> spacing grammar instead — see the ground entry below and `home-hero.tsx`.

**[decided 2026-08-13] The band has a ground: `--tg-surface`, full-bleed.** One
declaration, `.tg-closing` in `globals.css`. This is the answer to "correctly
built and visually inert": every gap inside the band had already been measured
and argued (the rhythm table below) and it still read flat, because **the
flatness was never in the elements or in their spacing — the block had no
edges.** With a ground, the signature stripe above stops being a divider between
two sections and becomes the band's lid, and the permanently-dark footer below
becomes its floor; the band is bracketed on both sides without adding a single
element.

`--tg-surface` specifically, because it is the token the **hero's** media panel
already uses. That is the bookend rhyme, deliberately spent as one token rather
than a new treatment: the page opens on a surface panel and closes on a surface
ground. It also needs no dark-mode branch — the token is `#1A1A1C`, a real step
off both the `#101010` page and the `#101010` footer, so the band separates in
both themes with no hairline. **[measured 2026-08-13]** light `#F5F5F5`, dark
`#1A1A1C`.

> **A band, not a box — and that is the whole reason this is permitted.** v2.5
> rejected adding "fill, border, card or divider" to this component. What it
> rejected was *boxing the stack*: a bounded object floating on the page, which
> would fight the centering and shrink the band. This is full-bleed, no radius,
> no border. The v2.5 rejection stands as written; it does not cover a ground.

**[measured 2026-08-13 `components/closing-cta.tsx`]** `pt-12 pb-16 md:pt-16
md:pb-20` — **48px top / 64px bottom below 768px, 64px top / 80px bottom at and
above it.** Max-width 760px. See §3 for the section boundary *above* it, which is
where the ~200px of dead space actually lived.

**[decided 2026-08-13] The top padding moved 40 → 64 (32 → 48 mobile), and that
is not a third instance of the spacing leak.** The ground changed what the
number measures. It is no longer a gap between two invisible blocks; it is the
interior of a visible one. The gap a visitor actually reads is canvas + stripe,
above the band's edge, and that **went down** — measured 2026-08-13 on `/`:
**68px desktop** from the last content to the band edge, against 110px of
undifferentiated canvas before. Total last-content-to-headline is 138px desktop
/ 94px mobile, still about one rhythm unit. The invariant in §3 is untouched and
was re-measured: the preceding section still sheds to 64px desktop / 40px mobile.

**[measured 2026-08-12 `closing-cta.tsx`] Internal rhythm — 24 · 48 · 24 · 16.**
Verified as `mt-6` / `mt-12` / `mt-6` / `gap-4`.

| From → to | Gap | Why **[decided v2.5, D-12]** |
| --- | --- | --- |
| headline → subhead | 24px | One step. One statement; the subhead completes the headline. |
| subhead → trust line | 48px | Two steps — the only break inside the band, and the register change from *statement* to *what you get*. |
| trust line → button | 24px | One step. The trust facts belong to the ask they precede. |
| button → concierge link | 16px | Half a step. The link is subordinate, and the gap says so without shrinking or greying anything. |

The band previously ran 24 / 32 / 36: a near-linear ramp in which every gap reads
the same, so nothing groups and a centered stack with nothing grouping it reads
flat. **The elements were all correct; the fix is entirely in the gaps.**

**[measured 2026-08-12 `closing-cta.tsx:84–90`]** The trust facts are `--text-sm`
in `secondary`, separated by 3px `muted-soft` dots — **and below 766px the row
becomes a deliberate stack with the dots not rendered at all.**

> **This document was wrong.** It said "one single line separated by mid-dots"
> with no qualifier. Below the wrap point the line breaks *after* each fact, so
> every dot terminated a line instead of separating two visible items — a
> separator with nothing after it reads as a typo. The 766px query is the
> measured threshold, not a breakpoint guess: the row is one line at 767 and
> wrapped at every viewport below it. The dots are `aria-hidden`, so dropping
> them costs nothing semantically.

**[decided v2.4, re-justified 2026-08-13] `button-primary--large` is the site's
one documented size exception**: 18 × 32px, ~16px text. Earned deliberately —
this is the page's single most important remaining ask, and the standard size was
reading as underweighted against the headline stacked above it. That, not the
padding, was the cause of the "still doesn't work" complaint.

**It stays `large`, and the hero deliberately did NOT follow it up to match.**
Re-examined 2026-08-13 against the four-size scale in §4.1. This ask is *alone*,
*terminal*, and arrives after the visitor has read the page, so nothing on
screen competes with it. The hero's is a **pair** — and §4.1's 14 × 24 secondary
exists precisely to paint the same height as a 15 × 24 primary, so there is no
`large` secondary to pair with and bumping one half breaks that compensation.
Bumping both bookends to `large` "for weight" would also have put *browse* at the
same volume as *talk to us*, inverting the narrative this band exists to finish.
**The hero was underweighted in its spacing, not in its button** — see §4.16.

**[measured 2026-08-12 `closing-cta.tsx:101–107`]** Beneath the button, one
`--text-sm` `secondary` text link opening the concierge — no button styling.
**[decided v2.4]** A lower-commitment alternate path, not a competing CTA. It is
the concierge's only second entry point beyond its persistent launcher, and it
stays quiet so it does not dilute the primary ask.

> **[decided 2026-08-13] Rejected: promoting that link to ink** under the
> `proof-line` precedent — a `link-underline` grows from 0% and so draws nothing
> at rest, which means a *muted* one has no rest-state affordance at all. Real
> defect, and the precedent does not transfer. The proof line's invitation was
> **the only actionable element on its band**; this link sits 16px beneath a
> 137 × 52 ink-filled button that supplies the band's affordance in full.
> Promoting it moves it toward co-equal, which is the one thing this path is
> specified not to be. Worth revisiting only if the concierge is ever measured
> as an under-served path.

**[measured 2026-08-12 `closing-cta.tsx:46`, `load-sequence.tsx`]** On scroll
into view the band replays the hero's load-sequence **timing** once
(`trigger="inView"`), with **no second set of flourish dots** — the once-per-page
rule wins over the echo.

**[decided v2.5] Rejected: moving the trust line below the button.** A real
improvement in the abstract — the ask arrives 68px sooner and the microcopy
supports the button it sits under — and rejected anyway. It reorders content
already specified as "beneath the subhead", which is a content decision wearing a
spacing costume; it separates the concierge link from the button it is an
alternative to; and the load sequence's `trust` beat would have had to be
re-timed past `cta` to stop the block animating out of visual order.

**[decided v2.5] Rejected: dropping the trust line to `--text-caption`.** It
would work, and it would also mean changing `/contact`'s trust facts to match —
those three facts render identically in both places by rule.

### 4.6 `solution-row`

**[measured 2026-08-12 `components/solution-row.tsx`]** Full-width row, hairline
top border, **48px vertical padding** (`py-12`). 10px accent dot + `--text-display`
title on cols 1–5 with a 22px gap; hook (capped 46ch) + arrow on cols 7–12,
space-between. Hover darkens the hairline to `border-strong` and shifts title and
arrow 4px right; the row also draws `.tg-rule` (§6.2).

**[decided v2.2] No icons — the dot is the icon. No card fill, no box.** The
four-identical-cards grid is the named anti-pattern this replaces.

### 4.7 `case-study-row` and `build-narrative`

**[measured 2026-08-12 `components/case-study-row.tsx`]** The `/work` index row
carries: solution tag → title (`--text-title`) → **one paragraph, `entry.approach`**
→ pull-quote → "Read the full story" link, against a media column of `Frame` →
`FrameMeta` → the "Try it" note → `BuildNarrative`. 80px vertical padding,
hairline between rows.

> **This document was wrong, and it is the largest error found in this pass.**
> The entry claimed "Challenge/Approach/Outcome as three labeled beats" for this
> component. **Those three beats exist only on `/work/[slug]`**
> (`app/work/[slug]/page.tsx:172–192`, `180px 1fr` label-and-body rows separated
> by hairlines). The index row renders the `approach` field alone and has never
> rendered the other two. Anyone placing content by this entry would have
> written a `challenge` and an `outcome` that the index silently drops.

**[decided v2.5] The alternation is `grid-column` only, both halves pinned to
`grid-row: 1`; DOM order is reading order — text, then media — on every row.**
Below 768px the grid is one column and source order is the entire layout, so
alternating the DOM put two posters back to back, and on `/work` it opened odd
rows with a poster, a status line and "How it's built" for a project the visitor
had not been introduced to yet. The pin is what makes the column-only alternation
possible: with sparse auto-flow, an item whose column-start sits behind the
placement cursor drops to the next row.

**[measured 2026-08-12 `case-study-row.tsx:121`]** The row also carries
`.tg-stack-md`, which stacks it to one full-width column in the 768–1023 band —
the 8-track split starved both halves at once. The `max-lg:` placements beneath
it are inert at every current width and **kept deliberately** as safe
degradation; a fallback that is currently inert is not the same as a value that
never applied.

**`build-narrative`** — **[measured 2026-08-12 `live-frame.tsx:125–155`]** the
"How it's built" block: hairline top border, uppercase caption label,
`--text-sm` in `secondary`, capped at 60ch (62ch on the detail pages, passed in).
It sits directly beneath the frame's status line and caption.

**[decided v2.2]** It exists to balance the two-column layout — the media column
should read as intentionally composed, not trail off into empty space beside a
taller text column. If it is still visibly shorter with this included, the text
column needs tightening, not the media column padding.

**[measured 2026-08-12]** It renders on both `/work/[slug]` and the `/work`
index. **Note the qualifier the old entry did not carry:** the index is *not* the
"full-length" version — it is missing Challenge and Outcome, per the correction
above.

### 4.8 `project-card`

**[measured 2026-08-12 `components/project-card.tsx`]** Compact: `--tg-surface`
fill, 1px hairline, 12px radius, 24px padding. Tag (tight variant) → title
(`--text-title`) → one `--text-sm` description → status line → a non-interactive
"Read the full story →" affordance.

The affordance is `aria-hidden` and **not** a `<Link>`: the whole card is already
one, and nesting an anchor inside an anchor is invalid HTML that browsers recover
from by un-nesting, splitting one card into two tab stops. **[decided]**
Deliberately not a second "open the live demo" link — the demo is one click
further in, and two competing actions on a compact card is the exact ambiguity
this tier avoids.

**[decided v2.1, standing] No image, ever.** The size and weight gap from
`case-study-row` is intentional signal about the depth of the build. **This
governs the card only** — a project's own detail page does carry its frame.

### 4.9 `LiveFrame`

**[measured 2026-08-12 `components/live-frame.tsx`] There is no `LiveFrame`
component and no `embeddable` prop.** The file exports three: `Frame` (poster,
alt, ratio, priority, onInk, viewTransitionName, className), `FrameMeta`
(status, url, onInk) and `BuildNarrative`.

> **This document was wrong.** It printed an API — "Props: `poster`, `url`,
> `embeddable: boolean`, `alt`" — that has never existed in this shape. The
> deferred-embed behaviour the `embeddable` flag was to carry is real but
> unbuilt; it survives as prose in the file header and as the entry below,
> marked as a target rather than a prop.

**[decided v2.4] Two locked ratios, context-dependent.** Compact contexts
(`case-study-row`, detail pages) stay **16:10**, no exceptions. **The hero uses
16:9**, its own ratio — it matches standard screen-capture dimensions and
eliminates the crop-vs-letterbox tension of forcing a 16:9-native capture into a
16:10 container. **[measured 2026-08-12]** `Frame` defaults to `16/10`;
`home-hero.tsx:92` passes `ratio="16/9"`.

**[measured 2026-08-12 `live-frame.tsx:73`]** `object-fit: cover` with
`object-position: top` — a dashboard screenshot cropped from the bottom keeps its
header and primary content.

**[decided v2.2, PLAYBOOK §12] Every poster is a real screenshot of the actual
production application** — never a sandboxed emulator, simulator, or "demo mode"
illustration. `bun run check:media` guards this on `prebuild`.

**The container — plate, not panel. [decided v2.5, D-11]** The ratios and
`object-fit` were specified and the box around them was not, so the compact
contexts inherited a generic card and read as one. Four values, and the reasoning
matters more than any of them:

- **Padding: 0. The media meets the border, always. [measured 2026-08-12
  `live-frame.tsx:59` — `p-0`]** This is the load-bearing one. `aspect-ratio`
  governs the *outer* box, so any padding is subtracted from the media: the frame
  keeps its 16:10 and the screenshot inside it silently stops being 16:10.
  Padding also produces exactly the mat of dead space that made the frame read as
  chrome around an asset instead of the asset. There is no value of this other
  than zero. **If a frame looks like it has space around its media, that space is
  the container's** — `cover` crops and can never letterbox.
- **Fill: `--tg-surface`, theme-aware, never a literal `#FFFFFF`. [measured
  2026-08-12 `live-frame.tsx:62`]** Under `cover` the fill is never visible once
  the poster paints — it is a loading and failure state, not a design surface,
  and its only job is to not punch a white rectangle into a dark page for the
  frames it takes to decode. Inside `.ink-band` the same token already resolves
  to `#1A1A1C`, so one declaration is correct in both places without a branch.
- **Radius 12px, 1px hairline. [measured 2026-08-12 `live-frame.tsx:59,63`]**
  12px is §3's card/media radius and the export's value. **[decided v2.5]
  Rejected: dropping to 4px or 0** so the frame reads as a plate rather than a
  card. The card read came from the mat, not the corner, so it would have fixed
  nothing and broken the export for no gain.
- **The status block sits BENEATH the frame, never inside it. [decided v2.5]**
  Inside means an overlay on the screenshot, and every poster is a real
  production UI whose own header lives at the top of the crop; covering it with
  our chrome is the same lie as drawing fake browser chrome around it.

**[measured 2026-08-12 `live-frame.tsx:108`]** `FrameMeta` is **12px below the
frame** (`mt-3`), left-anchored, status and demo link on one wrapping row **20px
apart** (`gap-x-5`). 12px reads as *belonging to* the frame above; 18px reads as
the next block starting.

**[decided v2.5]** That row was `justify-between`, which on an 803px detail-page
frame threw "Live · checked 4 minutes ago" and "Open it in a new tab" to opposite
corners — two labels in two places rather than one caption saying *this is
running, go look*. **No mid-dot separator either**: `status-line` already owns a
`·` internally, and a second separator on the same line puts two dot devices at
two weights inside one caption.

**The hero is not this. [measured 2026-08-12 `home-hero.tsx:90`,
`globals.css` `.tg-hero-frame`]** `tg-hero-frame` is a surface-filled panel with
32px padding that bleeds off the right viewport edge — specified, deliberate, and
the reason the compact contexts' gap went unnoticed for so long. **Do not port
the panel down to card scale.** At 373px tall a 32px mat is most of what you see,
and the panel's whole argument is the bleed, which no compact context has.

**[shipped 2026-08-13] The hero was doing it to itself below 1024px, and no
longer does.** The rule directly above was written about compact contexts and
was being broken by the hero's own mobile branch: that branch kept the surface,
the border and the 16px radius and merely shrank the padding to 24px — a panel
at card scale, in the one place the bleed cannot exist. **Measured at 375px
before the change: panel 327 × 346 wrapping a 278 × 156 poster, 33.2% of the
panel box empty `--tg-surface`, the poster only 45% of the panel's height.**
(30.0% at 430px — the defect does not wash out at larger phones.)

**The panel is now desktop-only.** Below 1024px `.tg-hero-frame` drops its
background, border, radius and padding entirely, and the media is just the
media — `Frame` already carries the plate treatment specified above, so removing
the wrapper leaves a correct component rather than a bare image. **[measured
2026-08-13]** the poster goes 278 → 327px wide at 375px, **+38% area, purely
from deleting the mat**. The internal `gap` drops 24 → 12px to match `FrameMeta`'s
beat: inside the desktop panel 24px is right because the panel's own padding
supplies the containment; with no panel, 24px orphans the status line. Desktop is
untouched and was re-measured — 32px padding, 136px of bleed past a 1440px
viewport, poster 819 × 461.

**[shipped 2026-08-13] Art direction below 1024px — `posterMobile`.** The hero
capture is a four-panel dashboard, and at a ~330px column every panel is an
illegible smear (this is D-08). `object-position` cannot help: source and frame
are both 16:9, so there is no overflow to shift, and `cover` only crops the axis
that overflows. So the hero passes a second file — **not a second capture**, a
tighter crop of the same real screenshot (`sarah-poster-mobile.webp`, 1038 × 584,
taken at (12, 316) of `sarah-poster.webp`), showing the Live Conversation Feed
panel whole: `CALL ACTIVE`, the AI booking an appointment, the customer replying.
PLAYBOOK §12 is satisfied by construction, and it is 33KB against the source's
117KB, so mobile also pays less. Guarded at 16:9 by `check:media` alongside the
other two — a `<picture>` `media` miss is invisible at desktop and breaks only
the phone.

`Frame`'s `posterMobile` prop is **optional and off for every compact context**,
which renders exactly the `<Image>` it always did. Where it is set, `Frame`
switches to `getImageProps` feeding a `<picture>` — Next's documented art-
direction pattern, and the reason it is not two `<Image>`s toggled with `hidden`
is that the browser evaluates `media` and fetches **one** variant where the
toggle would download both on the LCP path.

> **Still open, and it needs a recapture — not code.** The phone mockup in the
> top-right of `sarah-poster.webp` is **cut mid-sentence at y=0 of the source
> itself**, so "fully visible" is unreachable at any width, desktop included.
> Separately, the capture carries a visible **"Demo Mode" badge** in its
> bottom-right panel — a direct PLAYBOOK §12 violation on the most prominent
> image on the site. The mobile crop excludes the badge; **desktop still shows
> it.** STATUS.md's recapture queue currently reads "`sarah-poster.webp` is the
> 16:9 hero — leave it", which is why neither has been caught.

**[export] Deferred embed, unbuilt.** `embeddable: true` renders a
click-to-activate iframe in the same frame at the same dimensions, so there is
zero layout change; mobile stays poster + link regardless. It requires
`frame-ancestors https://tekguyz.com` on each demo app first. Every entry is
effectively `false` today.

**[decided v2.1, standing] No fake browser chrome** drawn around it — the real
product's own UI is what makes it credible.

**[decided v2.2] Hero and compact card are distinct contexts.** The same
screenshot does not have to be the same crop, or the same file, in both. A dense
multi-panel dashboard can read fine at card size and feel cluttered blown up
large. Don't force one asset to serve both jobs if it is not reading well in one.

**Deleted, unsourceable:** "2x source assets." Nothing in `public/media/` or
`live-frame.tsx` carries a 2x variant; `next/image` generates the srcset from a
single source. **Deleted, redundant:** "Keyboard-operable." The frame has one
interactive element, an `<a>`; the site-wide keyboard requirement lives in
CLAUDE.md's definition of done and does not need a per-component restatement.

### 4.10 `pull-quote`

**[measured 2026-08-12 `components/pull-quote.tsx`]** Geist 600, −0.03em, 2px
left border in that build's accent, 24px left padding, max-width 22ch, no
quotation marks. **Two sizes**: `display` (`--text-display`) on canvas contexts,
and a tighter `band` size — `clamp(1.75rem, 3.4vw, 2.75rem)` — for the home ink
band, where the quote sits in a narrower column.

> **This document was incomplete.** It described one size. The `band` variant has
> shipped for as long as the ink band has.

**[decided v2.1]** No quotation marks because the copy is a stated outcome, not
dialogue. The testimonial is the opposite case — someone else's words — and does
carry them.

**[decided v2.1, standing]** The only place accent touches anything larger than a
dot or a tag.

### 4.11 `numeral-device` and `flourish-mark`

**`numeral-device` — [measured 2026-08-12 `components/process-steps.tsx:140`]**
`--text-hero`, the step's accent at **8% opacity**, absolutely positioned behind
the step title, `pointer-events-none`, `select-none`, tabular numerals.
**[decided v2.1, standing]** `/process` only. Nothing else on the site gets
numbers.

**`flourish-mark` — [measured 2026-08-12 `components/flourish-mark.tsx`,
`page-hero.tsx:35`, `home-hero.tsx:50`, `app/work/[slug]/page.tsx:156`]** Four
9px dots, 9px apart, order blue → violet → amber → teal. **Once per page, on
every route** — near the hero headline on Home, inside `page-hero` above the
eyebrow on every inner route.

> **This document was wrong and has been corrected once already** (v2.5). The
> "home only" claim survives in **§9's Do list**, which is corrected in this same
> pass. If you find a third copy, the rendering is not what is wrong.

**[decided, absolute]** The *once per page* half stands: the closing-CTA echo
replays the load-sequence timing and gets no second set of dots.

### 4.12 `logo-lockup`

**[measured 2026-08-12 `components/logo-lockup.tsx`]** The file exports one
thing, `ConnectedNodes`: an SVG at `viewBox 0 0 64 64`, four `r=8` circles (top
blue, right violet, bottom amber, left teal) joined by `stroke-width: 3`
connectors. The connector colour is a **prop**, defaulting to
`var(--tg-border-strong)` — the theme hairline in the nav, a fixed `#2A2A2C` in
the always-dark footer, `currentColor` at 40% inside the concierge launcher.

> **This document was wrong, twice.** It said the connectors "theme-swap via
> `var(--color-border)`" — the default is `--tg-border-strong`, and it is
> overridden at two of the three call sites. It also said "Wordmark uses
> `text-primary` so it resolves in both themes with no JS": **there is no
> `text-primary` class anywhere in the repo.** The nav wordmark inherits colour;
> the footer wordmark hardcodes `#F5F5F5`. The stated outcome is right and the
> stated mechanism is fiction.

**[measured 2026-08-12]** There is no composed lockup component. The header
(`nav.tsx:114`) and footer (`footer-dark.tsx:80`) each assemble mark + wordmark
themselves — header without a tagline, footer with one.

**[decided, standing] The mark never wraps itself in a `<Link>`.** Call sites do
the linking; `ConnectedNodes` stays a pure mark, which is what lets the footer
use it inside a non-link masthead.

### 4.13 AI concierge

**[measured 2026-08-12 `components/concierge/concierge.tsx:335,358`]** The
launcher and panel header render `ConnectedNodes` — the same JSX mark used
everywhere else, at 18px.

> **This document was wrong about the mechanism, right about the intent.** It
> required "the actual `icon-master.svg` asset." Nothing on the site reads that
> file at runtime — it is the `prebuild` favicon source only. The requirement
> that matters is that this is the *same geometry*, never an invented simplified
> icon, and the shared component is a stronger guarantee of that than a shared
> file path would be.

**[decided v2.1] Launcher visibility is locked, not optional**: it must never sit
over the hero, where it competes with the hero's own CTAs and reads as a bug. The
mechanism is §6/§8's yield rule, not a scroll threshold.

**Presence — how the panel arrives and leaves (Build Phase 2)**

**[decided 2026-08-12, from three built options]** §6.1 named this panel a
*presence* surface and deferred it. This is the decision that closes that defer.

> **This document implied the panel had no motion. It had the wrong motion.**
> Phase 1 shipped `opacity: 0 → 1` plus a 12px rise on hardcoded `0.24` /
> `[0.16, 1, 0.3, 1]` — the **entrance** layer's recipe, the one for an element
> scrolling into view for the first time, applied to a surface that is summoned
> and dismissed. Phase 2 replaced it; it did not fit motion to a bare panel.

**[measured 2026-08-12 `components/concierge/panel-motion.ts`, `concierge.tsx`]**
Each mode moves from where that surface actually comes from:

| Mode | Geometry | In | Out |
| --- | --- | --- | --- |
| Desktop | `scale` 0.96 → 1 + opacity, origin `100% 100%` | `--dur-base` · `--ease-entrance` | `--dur-fast` · `--ease-hover` |
| Sheet | `translate` `100%` → 0, **no fade** | `--dur-state` · `--ease-entrance` | `--dur-base` · `--ease-hover` |

**The desktop origin is the argument, not a detail.** The panel and the launcher
are both anchored right/bottom 24px, so `100% 100%` is *the launcher's own
corner* — the panel unfolds out of the control that was pressed. No translate
with it: a corner-anchored scale already says "from here," and a slide would be
a second statement about one origin. **[measured]** `transform-origin` reads
`420px 640px` on the shipped panel, which is that corner exactly.

**The sheet does not fade, and that is deliberate.** An opaque full-screen
surface that fades shows the page through itself mid-flight, which reads as
unfinished rather than as arriving. It translates and stays opaque.

**[decided] Asymmetric: out is one duration step shorter than in, on
`--ease-hover` rather than `--ease-entrance`.** Arriving is the considered
moment; leaving is not. Once the visitor has hit close the decision is already
made, and replaying the arrival backwards makes them wait for it. Settling into
place, versus getting out of the way.

**[decided] No overshoot**, per the standing v2.2 rule in §6.1. Not reopened for
this panel — "presence may carry more weight" is exactly the argument that would
reach for a spring here, so `panel-motion.test.ts` asserts both easings hold
their control points within [0,1] and fails the build if one is swapped for a
curve that can exceed 1.

**[measured 2026-08-12, user, Pixel 9A] The motion is confirmed good on a real
device.** Local verification could only ever prove wiring — this machine matches
`reduce` machine-wide, so nothing here saw the scale or the slide run. The
motion-enabled check was the user's and it passed.

**[measured] Under `reduce`, the geometry *and* the duration both go to zero** —
the panel appears and disappears. Not a fast version of the transition: none of
it, the same floor §6.7 holds every other entrance to. Zero duration also lets
`AnimatePresence` unmount immediately instead of holding an invisible panel for
the length of an exit.

**Why the numbers live in a `.ts` file and not here.** Motion's JS API cannot
read a CSS custom property, so `panel-motion.ts` mirrors `--dur-*` / `--ease-*`
as literals. That is the exact trap `nav.tsx:104` is on the STATUS board for — a
value agreeing with its token by coincidence rather than by reference. So it is
pinned: `panel-motion.test.ts` parses `app/globals.css` and fails `prebuild` on
drift. **Do not print those values in this document** — the token names above
are the reference, per the one-source-per-number split.

**Conversation UI:**

- **[decided v2.2] No avatars, either side.** **[measured 2026-08-12
  `concierge.tsx:414`]** Visitor messages get a `--tg-surface` fill at 12px
  radius, `max-w-[85%]`, self-end; assistant replies are plain text on the panel
  background, so the exchange reads as a document rather than a chat-bubble
  stack. Avatars would fight that and add a second visual voice.
- **[measured 2026-08-12 `concierge.tsx:88–92,314`] Three suggestion chips on the
  empty state**, drawn from the real solution lines. `showChips` is
  `messages.length === 0 && !busy`, so they disappear on the first message and do
  not return. **[decided v2.2]** They remove the blank-input problem; they are an
  opener, not a persistent menu.
- **[measured 2026-08-12 `concierge.tsx:100,127,292`] Route-aware opener.** The
  panel reads `usePathname()` and looks up the entry when the path starts with
  `/work/`; the pathname also goes to the API with every turn.
- **[decided v2.1] Lead capture stays conversational, never a form.** The
  `capture_lead` tool collects name, email, project type and a summary, asked one
  at a time as the conversation warrants. If a visitor volunteers everything in
  one message, capture it in one step and don't re-ask.
- **[measured 2026-08-12 `concierge.tsx:428–434,504,510`] Captured state**: the
  stripe resolves to a single `--tg-success` dot with the confirmation copy, and
  **the input stays enabled** (only `busy` and an empty field disable it) — a
  captured lead may still have questions, and disabling input at the moment
  someone converts is exactly the wrong signal. Cap-reached is the one exception:
  there the handoff *is* the action, so the input goes away.
  **[decided 2026-08-12, user] The panel now closes itself ~4s after a capture,
  in both modes** — reversing the "stays open" half of the paragraph above,
  after the user used it on a Pixel 9A where the sheet is full-screen and
  finishing the conversation left a panel to dismiss by hand.

  **The old argument was not discarded, it was moved into a guard.** "A captured
  lead may still have questions" is now enforced by cancellation rather than by
  staying open forever: **typing after a capture cancels the dwell permanently**
  (`stayOpen`), and an in-flight reply (`busy`) suspends it. Both were measured
  — a follow-up typed 1s after capture left the panel open past 7s.

  **The cancel is keyed to typing, never to focus.** Above the sheet threshold
  focus lands in the input the moment the panel opens, so a focus-keyed cancel
  would disarm the dwell on every desktop capture and it would never fire.

  **The dwell is not a motion token and is not in `globals.css`.** Every
  `--dur-*` is a transition length (longest 500ms); this is a *reading* time.
  Tying one to the other would move a human's reading budget whenever an easing
  was retuned. It lives in `concierge.tsx` as `CAPTURE_CLOSE_DWELL`.

  **Closing routes through the normal `open` path**, so the exit animation,
  the focus return to the launcher and the scroll-lock cleanup are the same
  behaviour as the ✕ and Escape — not a second one. **[measured]** Sheet mode
  closed at ~4.0s with `body` `overflow` back to `visible` and focus on the
  launcher.

  **Nothing is lost by closing, and that is what makes it safe.** `messages` and
  `captured` are untouched, so reopening shows the same thread with "Details
  received" still in it and the placeholder still reading "Keep going if you'd
  like…". **[decided] No "welcome back" state was built**, and that was
  considered: the thread lives in React state with no `localStorage` or
  `sessionStorage`, so it survives a panel reopen and client-side navigation but
  not a reload — a returning-visitor greeting would fire for someone reopening
  by accident 5 seconds later and *not* for someone genuinely returning the next
  day. Inconsistent is worse than absent, and prompting the person who just
  converted for more work is the wrong moment for this brand.

**"Thinking" indicator — [measured 2026-08-12
`components/concierge/thinking-stripe.tsx`]** A **72 × 3px four-column grid,
inline beside the word "Thinking" with a 10px gap**. Segments hold at low opacity
and flash, staggered **120ms** apart on a **1200ms** loop — the stagger is what
reads as a sweep with no gradient involved. `prefers-reduced-motion` falls back
to a static four-segment bar (`globals.css:1010`), never a spinner.

> **This document was imprecise in a way that would mislead a rebuild.** It
> described "a thin (3px) bar … opacity sweeping left to right," which reads as
> a full-width progress bar. It is a small typographic device beside a word, and
> it is 72px wide.

**[decided v2.4, standing] This is the one functional, moving use of the site's
four-colour system, and it stays that way.** It is earned here because the AI is
genuinely doing work in that moment — the signal means something. **Do not extend
it anywhere else**: not around a button, not as a page-load flourish, not as
ambient decoration. A four-colour moment in more than one place stops being a
signature and becomes wallpaper. Still four discrete segments, never a blended
gradient.

### 4.14 `footer-dark`

**[measured 2026-08-12 `components/footer-dark.tsx`, `globals.css:115`]** Always
dark regardless of the toggle (`.footer-dark` sets its own `--tg-bg`, `--tg-fg`,
`--tg-border`, `--tg-secondary`), separated by a persistent 1px `#2A2A2C` top
border. Structure: masthead → hairline divider → 3-column nav on the 12-col grid
(1–4 / 5–8 / 9–12) → bottom bar → signature stripe.

**[measured 2026-08-12 `footer-dark.tsx:66,127`]** Masthead padding is **40px
top**, and the divider that closes it is 32px below the masthead content — the
"roughly 40/32" target of the v2.2 entry, reached. The 64/48 attempt before it
was not enough. **[decided v2.2]** This row must not inherit section-level
spacing.

**[measured 2026-08-12 `footer-dark.tsx:93–121`]** Social row: LinkedIn /
Instagram / Facebook / GitHub, icon-only, 44 × 44 hit boxes, 20px glyphs, one
stroke set at 1.75 — monochrome, never brand-coloured.

**[measured 2026-08-12 `footer-dark.tsx:165`]** Solutions column dots are 6px and
read the real accent from `config/solutions.ts`.

**[measured 2026-08-12 `footer-dark.tsx:153,177,199`] Link column gap is 22px**,
and that is a layout decision, not styling: the links are 22.4px tall, so a 44px
`tap-44` target needs 10.8px above and below, and at the previous 12px gap two
vertically adjacent targets overlapped by 9.6px — resolved by source order, so a
tap on `Process` could land on `Work`. 21.6 against 22.0 leaves 0.4px of
clearance. See §8.

> **This document was wrong, and stale in a way that hid a live defect.** It said
> the copyright bar and column headings "currently hardcode `#6B7280`" and should
> reference `muted-dark` "once it is set." `#6B7280` is gone from the repo
> entirely — but the replacement is the literal `#747C8B`, still a bare hex, and
> `.footer-dark` already defines `--tg-secondary` as exactly that value. The
> colour is now correct and the mechanism the entry asked for was never
> delivered. Logged in `STATUS.md`; not fixed here.

### 4.15 Components with no entry in this section

**[measured 2026-08-12]** Stated so nobody reads §4's silence as a prohibition.
These ship and are specified nowhere here: `testimonial.tsx`, `faq-accordion.tsx`
(§6.3 covers its motion only), `contact-form.tsx` (§6.3, same), `solution-tag.tsx`,
and `MetaRail` in `app/work/[slug]/page.tsx`. `signature-stripe.tsx` is specified
in §3; `reveal.tsx` and `load-sequence.tsx` in §6.

Writing an entry for any of them is real design work — see CLAUDE.md's skill
table — not a documentation pass.

### 4.16 `home-hero` — internal rhythm

Column spans are §3's; the media panel and its `<1024px` behaviour are §4.9.
This entry is only the vertical rhythm inside the text column, which had never
been specified anywhere.

**[shipped 2026-08-13] It ran 36 / 32 / 40 — the identical defect v2.5 found and
fixed in `closing-cta`, in the section nobody went back to.** A near-linear ramp
in which every gap reads the same, so nothing groups and the block reads flat.
The elements were all correct. **[measured 2026-08-13]** the largest gap was
40px against a smallest of 32px; four elements, evenly spaced, no hierarchy.

Now **24 · 32 · 48/64 · 80**, step = 32:

| From → to | Gap | Why |
| --- | --- | --- |
| flourish dots → headline | 24px | Under a step. The dots are the headline's marker, not a peer. |
| headline → subhead | 32px | One step. They are one statement. |
| subhead → CTA row | 48px / **64px** ≥768 | The break — statement → ask. |
| CTA row → media | 80px | The largest break: text block → proof. |

Three groups, not four evenly-spaced elements. **`closing-cta`'s step is 24
where this one is 32 — the bookends share the grammar and differ in amplitude,
which is what makes them rhyme rather than match.** The pairing is deliberate:
these two are the page's first impression and its final ask, and they were
designed in one pass so that a visitor meets the same spacing logic at both ends.

> **The break is not a clean 2× at both widths, and the reason is budget, not
> geometry.** 48px is what mobile can pay while keeping the CTA row above the
> fold. What has to hold everywhere is only that the break is decisively the
> largest gap inside the text block — 48 against 32 achieves that; the old 40
> against 32 did not. **[measured 2026-08-13]** the CTA row clears the fold by
> **18px at 1280 × 720**, the tightest realistic laptop, which is thin: TOKENS.md's
> standing hero constraint (headline ≤3 lines with the CTA row in the first
> viewport) is the thing to re-measure if this copy ever changes. `items-center`
> means the taller media panel drives the row height, so a 24px change in the
> text column moved the row only 6px.

**[shipped 2026-08-13] The 80px is 24 + 56, and the grid carries no `gap-y-*`.**
It used to declare `gap-y-14` (56px) and **that class never once applied** —
`.tg-grid`'s `gap` is unlayered, so it beats a `row-gap` from `@layer utilities`
regardless of source order. Same silent drop as the case-study rows' `gap-y-12`
in §8, invisible to the linter and to anyone reading the JSX. The real 56px was
always `.tg-hero-frame`'s own `margin-top`; the dead class is removed and the
value left in one place.

---

## 5. `status-line` — the signature component

*Converted 2026-08-12.*

**[decided v2.1, standing]** Replaces the decorative "LIVE" badge everywhere.

**[measured 2026-08-12 `components/status-line.tsx`]** Two states, structured
differently on purpose:

| State | Renders |
| --- | --- |
| **Verified** | 6px `--tg-success` dot, pulsing · `Live` in `fg` at weight 600 · `· checked <stamp>` in `secondary` |
| **Unreachable** | 6px `--tg-muted-soft` dot, no pulse · one single `secondary` string: `Temporarily unreachable · checked <stamp>` |

**[decided v2.1]** An unreachable demo loses the ink weight entirely. A HEAD
request timing out is not a failure state for the visitor, so it gets no emphasis
and no error colour.

**[measured 2026-08-12 `status-line.tsx:62`] The line is Geist Mono**, 0.875rem,
line-height 1.55, 0.04em tracking, tabular numerals, 8px gap.

> **This document was wrong.** It said "Small caps." There is no
> `font-variant: small-caps` anywhere in the repo. The uppercase-ish read it was
> describing comes from the mono face and the 0.04em tracking.

> **`TOKENS.md`'s type note is also wrong here, and it is not in this pass's
> scope to fix.** It says Geist Mono appears in three places — "status-line
> timestamps, Process numerals, tag labels." Measured: mono ships in exactly two,
> `status-line` (the **whole line**, not just the timestamp) and the concierge's
> inline code span. Process numerals and tag labels carry no mono class. Logged
> in `STATUS.md`.

**[measured 2026-08-12 `globals.css:563–575,997`]** The dot pulses only in the
verified state: opacity 1 → 0.4 → 1 over 1600ms, infinite.
`prefers-reduced-motion` kills the animation and holds it at 0.85.

**[measured 2026-08-12 `lib/status.ts:22–48`]** Data is a server-side `HEAD`
request per demo URL: `next: { revalidate: 3600 }`, `AbortSignal.timeout(3000)`,
`Promise.allSettled`. **[decided v2.1]** Never a client-side fetch to eight
origins, and never `Promise.all` — one hang must not block the page.

**[measured 2026-08-12 `status-line.tsx:16–54`] The stamp is absolute on the
server and relative only after hydration.** `absoluteTime` builds `at HH:MM UTC`
from `getUTC*` — never `Intl` or `toLocale*`, which is the same mismatch one
layer down — and `useSyncExternalStore` with constant snapshots swaps in
`relativeTime` after mount. **[decided]** Both easy fixes are wrong: deferring to
an effect flashes the signature component empty, and `suppressHydrationWarning`
hides the message while leaving two trees in place.

**[measured 2026-08-12]** It appears on `project-card`, both `/work` tiers, the
detail pages, and the hero — via `FrameMeta` in every framed context, and
directly in `home-hero.tsx:95` and `project-card.tsx:51`.

**[decided v2.1] Why this is the signature:** every competitor's LIVE badge is a
graphic asserting a fact. This one measures it. "Proof Over Claims" as a
component.

---

## 6. Motion

*Rewritten 2026-08-12 (Build Phase 1). Provenance markers per the note at the
top of this document.*

### 6.0 What was actually wrong

**[measured 2026-08-12]** Before this rewrite the site's entire motion surface
was: `.reveal` (fade + 16px rise), `.hover-card` (−3px lift), `.hover-row` (4px
shift + border darken), `.link-underline` (background-size draw),
`.status-dot-live` (pulse), `.shimmer-seg` (concierge), and the View Transition
group rules. `motion` was imported in 2 files.

The useful way to read that list is not "one idea repeated." It is that two of
the three layers below existed and **the middle one did not exist at all**:

| Layer | What it covers | State before this rewrite |
| --- | --- | --- |
| **Entrance** | An element arrives on screen for the first time. | Present, one recipe, applied everywhere. |
| **State** | Something already on screen **changes**. | **Absent.** The FAQ toggled `hidden` and swapped the character `+` for `−`. Form steps swapped with no transition. The theme toggle was instant. |
| **Feedback** | The visitor points at, presses, or focuses something. | Thin — three rules. Press did ship (`active:scale-[0.98]`, `button.tsx`); focus did not. |

A site with entrances and no state changes is a document that fades in. That is
the whole of the complaint, and it is why the fix is not "more animation."

### 6.1 Why the motion tokens are what they are

**The values live in [`TOKENS.md`](TOKENS.md#motion), where they are enforced.**
This section is the reasoning, which is not checkable and is the reason this
document still exists.

**[decided 2026-08-12] No easing on this site overshoots.** `--ease-state` was
chosen against a spring with a 1.32 overshoot, built and compared side by side.
The spring reads as *performed*; every other signal on this site — the measured
status line, the real timestamps, the HEAD checks — says *reported*. An
overshoot is a small lie about physics on a site whose argument is that it does
not exaggerate. **Rejected with it:** applying a longer, heavier motion register
site-wide. It is the framework default dressed as a choice.

**[decided 2026-08-12]** The two surfaces that genuinely *arrive and leave* —
the concierge panel and the nav drawer — are the documented exception and may
carry more weight than a row toggle. Presence is a different problem from state.

**[decided 2026-08-12] The concierge panel's presence recipe is now specified in
§4.13 and shipped** (Build Phase 2). "May carry more weight" cashed out as a
mode-specific origin — a corner scale on desktop, an edge translate in sheet —
not as a longer or heavier curve. Both still use `--ease-entrance` in, and both
leave *faster* than they arrive.

**The nav drawer is still deferred, and this sentence is the whole of its
spec.** It was deliberately left out of Phase 2 rather than absorbed into it:
the drawer is a different surface with a different origin and its own focus
contract, and the concierge's recipe is not portable to it by inspection. **Do
not copy §4.13's table onto the drawer** — that is the shortcut this note exists
to prevent.

### 6.2 `.tg-rule` — the state primitive

**[decided 2026-08-12]** Every state change on this site uses **one gesture: a
2px hairline that draws from the left.** The visitor learns it once and then
reads it everywhere — the nav's current page, a solution row under the pointer,
an open FAQ answer.

**This is a generalisation, not an invention, and that is the argument for it.**
The nav's active-page indicator already drew exactly this bar — 2px, ink,
`scaleX(0)` from `left center` — and it was the only thing on the site that did.
`.tg-rule` is that rule with the selector widened; the nav now consumes it
instead of owning a private copy, because two implementations of one idea drift.

Two weights, and the split is what keeps it legible:

| Hook | Colour | Meaning |
| --- | --- | --- |
| `:hover` / `:focus-visible` | `border-strong` | Transient. "This is a thing." |
| `data-drawn="true"` | `border-strong` | Held by component state — an open accordion row. |
| `data-on="true"` | `fg` | Persistent. "You are here." Nav only. |

**[measured]** The persistent weight is written `.tg-rule[data-on='true']::after`
at (0,3,0) so it beats the transient `.tg-rule:hover::after` at (0,2,0) **on
specificity, never on source order** — §8's rule about not resting a
wayfinding-bearing declaration on a utility sort applies to hand-written CSS too.

**[measured]** It is `::after`, and there is no third option: `.tap-44` /
`.tap-24` own `::before` site-wide and the nav links carry both.

**Currently applied to** `nav.tsx` links, `solution-row.tsx`,
`faq-accordion.tsx` rows. **[decided]** Not applied to `project-card` (it lifts;
two signals for one hover is noise), the footer link columns (a drawn bar on 14
links is wallpaper), or `case-study-row` (not an interactive row).

### 6.3 State — what each interaction does

**[measured 2026-08-12]**

- **Accordion** — `.tg-collapse`, `grid-template-rows: 0fr → 1fr` over
  `--dur-state`. The `+`/`−` character swap is gone: `.tg-mark` is two 1.5px
  bars, one rotating 90° → 0°, inheriting `currentColor` so it rides the
  trigger's muted → ink shift. The row draws its `.tg-rule`.
  **The `visibility` flip inside `.tg-collapse` is not decoration** — a clipped
  0fr box is still in the accessibility tree, so without it a screen reader
  reads all six answers on the conversion route while every row looks shut. It
  flips to `visible` instantly on open and to `hidden` on a `--dur-state` delay
  on close.
- **Contact form, step rail** — the step header already ended in a hairline, so
  the progress indicator **is** that hairline, drawn to 50% and then 100%.
  `.tg-rule` takes a partial value through `--tg-rule-scale`, which is what
  makes this the same object as the nav indicator rather than a second progress
  mechanism. **[measured]** The variable is set on the element (so it inherits
  to the pseudo) and inline, so it beats `.tg-rule:hover` without `!important`
  — pointing at the header cannot make the rail claim a step the visitor has
  not reached. **[decided]** It goes on the header, never on the step branches:
  the distinct `key`s on those branches are what stop step 1's inputs becoming
  step 2's, and nothing here touches them.
- **Theme toggle** — the SVG holding both glyphs rotates 90°, and the
  `display`-driven glyph swap happens inside the turn. `display` is discrete
  and cannot be animated; the container can. **[decided] Rejected: transitioning
  page colours on theme change** — it requires a transition on `:root` covering
  background and colour, which then applies to every descendant inheriting them
  and competes with every element that has its own colour transition. A
  site-wide cost for a moment most visitors see once.
- **Hover, rows** — border darkens (unchanged) **and** `.tg-rule` draws. The
  4px title/arrow shift is unchanged.
- **Hover, cards** — unchanged, −3px.
- **Press** — `active:scale-[0.98]`, `--dur-instant`. Already shipped.
- **Focus** — **[decided]** deliberately *not* transitioned. The only way to add
  it site-wide is a `transition` shorthand on a low-specificity group selector,
  and a shorthand resets every transition property, so every element carrying
  `.link-underline` / `.hover-card` / `.reveal` / `.tg-yield` would either lose
  its own transition or silently drop the new one depending on which rule won.
  An instant focus ring is also correct on its own terms.

### 6.4 Entrance — unchanged, and why

**[measured]** Scroll reveals trigger at 15% into viewport,
`translate: 0 16px → none` + opacity, `--dur-entrance`, `--ease-entrance`, once.
Stagger 80ms. The rise uses `translate`, never `transform`.

**[measured]** `.reveal` alone does nothing; the hidden state lives on
`.reveal-armed`, added only by `components/reveal.tsx` from an effect. Content
is visible by default. `animation-timeline: view()` is wrong here — it scrubs
with scroll and cannot express "once."

**Hero load sequence [export]:** flourish dots stagger 60ms → headline fades up
(32px→0) at +180ms → subhead +80ms → CTA row +80ms → hero media scales 0.97→1
concurrently with the CTA row. Resolves under ~900ms. Closing-CTA echo replays
the same timing minus the dots, `once: true`, on scroll-into-view.

**Shared element [export]:** build card poster + title carry a
`view-transition-name` matching the detail page hero.

### 6.5 Scroll and the pin

**[measured]** Native scrolling. No Lenis, no smooth-scroll library.
`scroll-behavior: smooth` for anchor jumps only. One pinned moment, `/process`
only — `.tg-pin`, a real rule inside `@media (min-width: 1024px)`, overridden by
`position: static !important` in the reduced-motion block below it. The progress
rail reads the step elements' own positions, never a fraction of the section's
scrollable range.

### 6.6 Banned — and what this list is actually rejecting

**[decided, standing]** Parallax · gradient blobs · spinning shapes · marquees ·
particles · glassmorphism · cursor-followers · magnetic buttons · skeleton
shimmer · smooth-scroll libraries · scroll-jacking beyond the single pinned
section.

**This list rejects one aesthetic: the cyberpunk / hacker-terminal / dev-portfolio
look. It is not a cap on motion, and it was read as one for the life of the
project** — which is how the site ended up with a single entrance recipe and no
state layer. Motion outside this list is wanted. The three-layer system above is
the guidance that was missing when this bullet was the only thing here.

### 6.7 `prefers-reduced-motion`

**[measured]** Kills every entrance, the status pulse, the closing-CTA echo, the
pin, and the concierge shimmer. **Hides nothing.** The universal reset zeroes
`animation-duration` and `transition-duration` but **not `transition-delay`** —
so `.tg-collapse`'s delayed `visibility` close is zeroed explicitly, or a
reduced-motion visitor watches a painted answer sit in a zero-height box for
320ms. Under reduce the accordion still opens; it snaps.

**Development note:** this machine runs with Windows animations off
(`MinAnimate = 0`), so `reduce` matches machine-wide. Verify wiring by computed
style and class count, say which half was proved, and leave the motion-enabled
check to the user.

---

## 7. Dark mode

*Converted 2026-08-12. Four claims, all four measured, none wrong — this is the
one section of the four that survived intact.*

**[measured 2026-08-12 `components/theme-provider.tsx`] Manual toggle only** —
`next-themes` with `attribute="class"`, `defaultTheme="light"`,
`enableSystem={false}`. It also passes `disableTransitionOnChange`, which the old
entry did not mention; §6.3 has the reasoning for why theme change is not
transitioned.

**[decided v2.1] Light is what every new visitor sees.** The site never
auto-switches off the OS preference.

**[measured 2026-08-12 `app/page.tsx:97`, `globals.css:98–113`] The full-bleed
Featured Work band stays ink in both themes.** `.ink-band` sets its own
`--tg-bg`, `--tg-fg`, `--tg-surface`, `--tg-border`, `--tg-secondary` and the CTA
triple to fixed literals, so nothing inside it theme-swaps. **[decided v2.3]** In
dark mode it is distinguished from the page by a hairline, not a fill change: the
page background is already near-black, so fill contrast is not available and the
hairline is the only signal left.

**[measured 2026-08-12 `globals.css:71–73`] Every primary button actually
inverts.** `--tg-cta-bg` → `--tg-text-primary-dark`, `--tg-cta-fg` →
`--tg-bg-dark`. **[decided v2.3]** Dark mode must have real bright elements — the
primary CTA is the single brightest thing on a dark page, not a darker shade of
the background it sits on.

**[decided v2.3, standing] Never gate colour logic on `useTheme()` or mount state
when a CSS `dark:` variant or `currentColor` solves it.** **[measured 2026-08-12
`components/theme-toggle.tsx`]** The toggle holds to this precisely: both glyphs
are always in the DOM and the `dark:` variant hides one; the accessible name is
two `sr-only` spans with the inactive one at `display: none`; `resolvedTheme` is
read **only inside the click handler**, where it runs long after mount and cannot
desynchronise the markup. The earlier `mounted`-flag version fired a second
render on every mount for a value CSS already knew — next-themes puts `.dark` on
`<html>` before paint — and tripped `react-hooks/set-state-in-effect`.

**[measured 2026-08-12 `globals.css:104`] One open discrepancy, contrast-safe.**
`.ink-band` sets `--tg-secondary: #9ca3af`, which is `muted-soft` — a value
`TOKENS.md` retires as a text colour and permits only for dots and the concierge
indicator. On `#111111` it computes to **7.43:1**, so this is a rule being broken
silently rather than an accessibility failure. Logged in `STATUS.md`;
resolving it is a §1 decision, not a §7 one.

---

## 8. Responsive

### 8.0 The density scale

*Added 2026-08-12 (Build Phase 1).*

**[measured 2026-08-12]** The problem was never a component. It was that **every
component picked its own mobile values by hand, with one `sm:` step**, so there
was no such thing as "the mobile value" for anything. `testimonial.tsx` was the
named exemplar: `px-8 py-14` / 72px glyph / `mt-14` / `pt-8` / a
`flex-wrap gap-8` attribution row carrying four items, which at 360px broke to
four stacked lines with 32px between each — roughly 200px of a ~500px component
spent on attribution.

**[decided 2026-08-12]** Two tokens — `--pad-container` (inside a card or panel)
and `--gap-group` (between grouped elements within one component). **The values
live in [`TOKENS.md`](TOKENS.md#density), where all three breakpoint values of
each are enforced.** Components declare *intent*; the value resolves per width.
Mobile-first, so a component that declares nothing gets the dense value rather
than the loose one.

### Section rhythm — the spec existed and was never built

**[measured 2026-08-12] §3 has said "128px desktop, 80px mobile" since v2.2. The
mobile half did not exist.** All 14 section-rhythm call sites across every route
shipped the desktop value at every width — `/contact` ran `pt-24 pb-32` (96px /
128px) at 360px, and the home page spent ~416px of a 360px-wide viewport on
padding that the document already said should not be there. This was not a
component problem, which is why the earlier read of "mobile density" as a
`testimonial.tsx` problem understated it by an order of magnitude.

**[decided] Implemented at the call sites, mobile-first, NOT behind a token.**
`py-20 md:py-32`, `pt-16 md:pt-24`, `pb-16 md:pb-24`, `mt-16 md:mt-24`. Three
reasons it is not a `--rhythm-section` token:

1. `pt-24` (96px) is a page-top value, not the section rhythm, and one token
   cannot be both.
2. Mobile-first means the bare utility is the ≤767px value and `md:` raises it —
   so the responsive intent is legible in the JSX, where the person changing it
   is looking.
3. **A token would have had to beat `.tg-grid`'s unlayered rules and the
   `:has(+ .tg-closing)` rule by cascade.** Written this way it does not compete
   with them at all.

**[measured] The `closing-cta` invariant survives, and was re-measured rather
than assumed.** `:where(section, div):has(+ .tg-closing)` is unlayered at 40px
base / 64px ≥768px, so it still beats the utility and still only ever *reduces*:
the section before the closing band measures **40px at 360px and 64px at
1440px**, unchanged by this work. The earlier decision to defer section rhythm
"because the 128px invariant would break" was over-cautious — the invariant is
about the rule being able to reduce, and a smaller starting value cannot
threaten that.

**[decided] Two rules that generalise beyond the exemplar:**

1. **Display-scale ornaments clamp *with* the type scale, not against it.** A
   72px quote glyph beside a 24px quote is a desktop ratio shipped to a phone.
   The glyph now shares the hero clamp (`clamp(2.5rem, 6vw, 4.5rem)`), so its
   desktop ceiling is unchanged and only the floor moves.
2. **A row that `flex-wrap`s is not a mobile layout — it is a desktop layout
   coming apart.** Any row carrying more than two items becomes an *explicit*
   stack below the container break, so its gaps are chosen rather than inherited
   from whatever the wrap happened to do. **[measured]** The chosen gap is
   constrained by `tap-44`, not by taste: two 44px hit overlays on ~21px painted
   links need ≥44px centre-to-centre, so the stack gap is 24px. This is the same
   arithmetic that set the footer's 22px column gap. Re-check any change with
   `bun run scripts/audit-mobile.ts taps`, which hit-tests rather than measuring
   rects.

**[measured 2026-08-12] Result on the exemplar, at 360px: 798.7px → 561px, a
30% reduction.** The pre-existing estimate in `STATUS.md` was "~500px"; the real
figure was 799. Estimates of this were low by 60%, which is the argument for
measuring every one of the remaining conversions rather than pattern-matching
them.

**[decided] A `ch` measure cap is NOT a desktop artefact — this was tried and
reverted.** Releasing `max-w-[34ch]` on the quote below 768px looked like the
same class of fix as the glyph and is not: at 360px the card's content box is
264px, so the cap is not binding and removing it changes nothing, and the width
where it *would* bind is ~700px, where releasing it hands the quote a 650px
measure. Measure caps stay at every width.

**Converted so far:** `testimonial.tsx`. Everything else still hand-picks, and
each conversion is a real measurement rather than a find-and-replace.

### 8.1 Breakpoints

| Breakpoint | Changes |
| --- | --- |
| < 768px | Hamburger drawer; hero at its clamp floor (40px); media stacks below text, no bleed; solution rows stack (dot+title, then hook); case studies stack; `LiveFrame` = poster + link always; **two rows stack deliberately at `≤ 766px` — see below** |
| 768–1024px | Nav horizontal; asymmetric grid collapses to 8 columns — **spans below**; media bleed reduced |
| 1024–1440px | Full asymmetric grid, all bleeds active |
| > 1440px | Container caps at 1280px; the right-edge hero bleed extends further |

### The 8-column spans, 768–1023px

"Collapses to 8 columns" was the whole spec here until 2026-08-08, and that was not
enough to build from: every `.tg-grid` child kept its 12-column placement while the
grid narrowed to 8 tracks, so placements reaching past line 9 manufactured **four
implicit tracks** and squeezed headlines into ~144px. Measured, fixed and recorded
in docs/archive/HISTORY.md's Prompt 8 section. These are the shipped spans — grid **line**
numbers, matching the code.

Derivation rule, for anything added later: **scale the 12-track span by 8/12 and
keep the gap track** §3 calls deliberate. Do not convert an asymmetric row to
halves — the asymmetry is the point, and a mirrored 4/4 is the template look §0
exists to avoid.

| Row | 12-track (§3) | 8-track (768–1023) |
| --- | --- | --- |
| `page-hero` headline / description | `1/8` + `9/13` | both **`1/-1`** |
| `SectionHead` headline / description | `1/7` + `8/13` | both **`1/-1`** |
| `solution-row` title / hook | `1/6` + `7/13` | **`1/4`** + **`5/9`** |
| Case-study row, even — text / media | `1/6` + `7/13` | both **`1/-1`** (revised 2026-08-11) |
| Case-study row, odd — media / text | `1/7` + `8/13` | both **`1/-1`** (revised 2026-08-11) |
| `/work/[slug]` content / meta rail | `1/9` or `1/8` + `10/13` | **`1/7`** + **`7/9`** |
| `/process` steps | `4/13` | **`1/-1`** |
| `/contact` trust column / form card | `1/6` + `7/13` | both **`1/-1`** |
| `/solutions/[slug]` title / body | `1/6` + `7/13` | both **`1/-1`** |
| Footer nav — Solutions / Company / Get In Touch | `1/5` + `5/9` + `9/13` | **`1/4`** + **`4/6`** + **`6/9`** |

**Why some rows go full-width instead of splitting.** A hero- or display-scale
heading has no second column to sit beside — `--text-hero` resolves to 46.08px at
768, and a narrow column at that size is the artifact, not a layout. So `page-hero`,
`SectionHead`, `/solutions/[slug]`'s header and `/contact` take all 8 tracks. Rows
that carry two *genuine* columns — content against meta rail — keep both.

**Case-study rows joined them 2026-08-11, and the reason generalises the rule
above.** The stated principle was about a *heading* too large for its column. The
same artifact appears when the column is too narrow for **body prose**, and at 768
both halves of a case-study row were starved at once: the text column measured
**249px**, which at `--text-body` is roughly **31 characters per line** against the
45–75 the measure exists to hold. The alternatives were tried on paper and
rejected. A mirrored **4/4** is the template look §0 exists to avoid, and 336px is
still only ~39 characters. Giving text **5** tracks and media **3** reaches a
comfortable ~55 characters but drops the poster to 249px wide — 156px tall at
16:10 — and the poster is the proof the `/work` index exists to show, so that
trade buys the measure by spending the argument. **768 does not have the width for
two genuine columns here, so it gets one.** Stacked, the text runs the full 672px
and the poster does too.

**This is `/work` only.** The home Featured Work band is its own row component
(`app/page.tsx`), not `components/case-study-row.tsx`, and was **not** changed —
it carries a different copy length and its own band treatment. If it is ever
revised, it is revised on its own measurement, not by inheriting this one.

**The mechanism, which is not optional here.** Both halves pin to `grid-row: 1` on
the multi-column bands so the alternation can ride on `grid-column` while the DOM
stays in reading order. **A pin surviving into a one-column band puts both halves
in the same cell**, so the 768–1023 stack has to release `grid-row` and
`grid-column` **together, in one block** — exactly as the ≤767 reset does. It ships
as a real rule in `globals.css` (`.tg-stack-md`), unlayered and `!important`,
because the placements it overrides are Tailwind arbitrary properties of the same
(0,1,0) specificity: two same-property utilities have no winner, only a source
order, and §8's `motion-reduce:lg:static` note is why no layout floor may rest on
one.

**Its query is `max-width: 1023px` with no lower bound**, which looks like it
restates the ≤767 reset and does so on purpose. A `min-width: 768px` arm is the
*complementary* query to that reset, and a viewport can land on a fractional width
where both are false (measured: `innerWidth` 767 with `max-width:767px` and
`min-width:768px` both false) — in that hairline the row would fall back to the
8-track split. Overlapping instead of abutting, with identical values in the
overlap, means the two can never disagree at any width. Below 768 the visible
result is unchanged either way.

**Measured after the change** — at 768: 8 explicit tracks and 0 implicit; both
halves `1 / -1` with `grid-row: auto`; text column **249px → 688.8px**; body prose
**30.2 → 68 characters per line**, inside the 45–75 band. Headlines: at 249px two
of the four wrapped to a two-word last line (`Quality Tracking`, `Live Demo`);
at 688.8px **all four set on one line**, so there is no wrap left to orphan. Same
result at **844**, the other width M-16 was filed against — stacked, 764.8px,
four of four on one line, no horizontal scroll at either.

*Counting lines here needs the character-rect method, not `Range.getClientRects()`
on the element: the headline wraps a `<Link>`, so the range returns a rect per
element boundary and reports two "lines" for a single visual one. The first pass
at this measurement made exactly that error.*

**Two rows that look alike and are not.** `/process`'s progress rail is
`hidden lg:block`, so the band has no second column and the steps take `1/-1`.
`/work/[slug]`'s meta rail is **not** hidden — only its pinning is `lg:`-gated — so
the band really does render two columns and both get placed. Check which case a new
row is before placing a column that isn't there.

**Footer 4/4/4 becomes 3/2/3, not 3/3/2.** Company takes the narrow track because
its longest item is `Process` at 51px; Solutions (136px) and the email address
(126px) both need a wide one. Ordering it the obvious way puts the email in a 121px
column and wraps it.

### The single-column band, ≤ 767px — and the two things that must be released together

The `.tg-grid` reset here forces `grid-column: 1 / -1 !important` on every child.
It must also force **`grid-row: auto !important`**, and the two belong in the same
declaration block for a reason that is not stylistic: the alternating case-study
rows pin both halves to `grid-row: 1` (see §3), and a pin that survived into a
one-column band would stack both halves into the same cell. **Released together,
they can never disagree** — including at the fractional viewport widths where
`max-width: 767px` and `min-width: 768px` are *both* false, measured on this
machine at `innerWidth` 767. A row release written as its own complementary query
would have had exactly that hairline band to get wrong.

**The split gap is `.tg-split` in `globals.css`, not a `gap-y-*` utility.**
`.tg-grid` sets the shorthand `gap: 24px` **unlayered**, so it beats any layered
`row-gap` from `@layer utilities` no matter where the class appears. Both
components declared `gap-y-12` and **it had never once applied** — the stacked
halves shipped at 24px for the entire life of the site. Same class of failure as
`cn()` dropping `leading-none`, one layer up: a declared value that never reached
the DOM, invisible to the linter and to anyone reading the JSX. The shipped value
is now the intended **48px**, which only ever renders in this band; above 767 each
row is a single grid row and `row-gap` is inert.

The resulting mobile rhythm for a case-study row is **48px inside the pair,
160px (`/work`) or 192px (home) between rows** — the split is one idea, the gap
between rows is a section boundary, and a 1:3.3 ratio is what says so.

### The two deliberate stacks at ≤ 766px

*Added 2026-08-09. Both were `flex-wrap: wrap` rows whose wrapped state was an
artifact rather than a layout, and both are now explicit.*

**The trust row — `closing-cta` and `/contact` alike.** Three facts separated by
two 3px `muted-soft` dots. **At ≥ 767 it is one 21.7px line with both dots. At
≤ 766 it is a `flex-direction: column` stack with a 10px row gap and the dots not
rendered at all.** The invariant: **a separator must never be the last thing on a
line.** Wrapped, the breaks fall after each fact, so every dot terminated a line
instead of separating two visible items — which reads as a typo, not a rule.

The threshold is **766px and it is a media query, not a sibling selector**. CSS
selectors see DOM order, and the defect is about the *rendered* break: the last
dot in the DOM is not the dot that dangles. 766 is where the row measurably stops
fitting on one line, so the switch happens exactly at the wrap and the row never
renders in the broken in-between state. The dots are `aria-hidden`, so removing
them costs nothing semantically. **Do not restore the dots at a width where the
row still wraps** — that is the original defect, re-shipped.

`/contact`'s copy of the row also re-asserts `align-items: flex-start` in the
column direction, because `items-center` is cross-axis and would centre the
stack, against §9's left-anchor rule.

**The footer masthead.** Lockup + tagline on the left, 44×44 social row on the
right, `gap: 48px`. Below the wrap point the social row drops under the tagline,
where **48px was a gap sized for a horizontal arrangement** and read as an empty
band. **Row gap is 24px at ≤ 766**; column gap is untouched, so the un-wrapped
arrangement above 767 is byte-identical. 24 is deliberately tighter than the
32px that follows down to the divider — that is what groups the social row with
the lockup rather than with the nav below it.

**The wrapped social row is left-aligned at the lockup's `left: 24px`, and that
is correct** (§9 left-anchors everything but the closing CTA). It is not a
centring bug; do not "fix" it.

### The `/contact` form card at ≤ 639px

*Added 2026-08-10. The step header's counter and title each wrapped to two lines
at 360, 375 and 390 (M-07 / M-08).*

The card's **40px padding drops to 24px below `sm` (640px)**, and the step
header's gap goes 16 → 12px. This is arithmetic, not taste: the header row is
title + counter + gap and needs **193 + 16 + 51.3 = 260.3px**, against a content
box of **230.4px at 360**. The same sum is **0.3px short at 390** and clears from
414 up, which is exactly where the reported symptom stopped. 40px of padding is
22% of a 360px viewport.

The counter also carries `white-space: nowrap`, because `01 / 02` is one atom.
**That is the guarantee, not the fix** — on its own it just moves the whole
deficit onto the title.

**Both values are scoped `max-sm`, so 767, 768 and 844 are not inside the query.**
Those rows were fixed by Prompt 8 and re-measured byte-identical after this
change: card 719 / 704 / 780 at 40px padding, counter 51.3 × 22.4, one line.

### Button line height — one class, never two

*Added 2026-08-10, and it is a `cn()` fact rather than a visual one (D-10).*

`button.tsx` writes its line height **on** the font-size utility —
`text-[14.5px]/[1]`, `text-[16px]/[1]` — and must keep doing so. A separate
`leading-none` does not survive: `cn()` is tailwind-merge, Tailwind's `text-*`
utilities set line-height as well as size, so a later font-size class is treated
as conflicting and the `leading-*` is dropped before it ever reaches the DOM.
That is what shipped, silently, on **every button on the site**: a 14.5px button
rendered a **23.2px** line box (the inherited 1.6 body value), 8.7px taller than
the export, which made the nav CTA read as `button-primary--large` while its
padding was already the standard 14×24.

Shipped heights, all of them padding + a 1.0 line box: **nav 42.5 · default and
form 44.5 · large 52**. The nav CTA is the one primary that lands under the 44px
tap floor and carries a `.tap-44` overlay for it — **it is not padded back up**,
because that would erase the size gap `button-primary--large` exists to create.

### Touch targets — a two-tier policy, not a flat floor

A single `≥ 44×44px` floor was the whole spec here until 2026-08-09, and it was
contradicted by shipped code on **73 distinct signatures across 2,707 instances**
(M-09 – M-13) — every one a height failure except the 38×38 theme toggle. A floor
that nothing meets is not enforced anywhere; it is ignored everywhere. The policy
is therefore two-tier:

- **44 × 44px minimum for standalone controls** — buttons, links rendered as
  buttons, icon controls, form controls, nav items, the theme toggle, the
  concierge launcher and its close control.
- **24 × 24px minimum for links inline in running prose**, which is WCAG 2.2 AA's
  Target Size (Minimum) floor. A 44px box around a mid-sentence link either
  overlaps its neighbours or forces a line-height that breaks §2's type scale, so
  the AA floor is the deliberate ceiling of ambition there, not an oversight.
- **Targets are expanded by padding or a pseudo-element, never by resizing the
  painted box.** The visual weight of a 14.5px text link is a design decision from
  the approved export; growing the box to 44px changes the composition. A pseudo
  overlay or asymmetric padding grows the hit area and leaves the render
  identical.

**Shipped 2026-08-09. This section is now a description, not a target.** The
mechanism is two utilities in `globals.css` — `.tap-44` and `.tap-24` — not 73
call-site patches, because the 2,707 instances were a handful of shared
components rendered many times. Add one of those two classes to a new control;
do not invent a third expansion.

**The overlay is `::before`.** `[data-navlink]::after` is the active-page
indicator bar and the nav links need both, so the two jobs get one pseudo each.
An `::after` overlay — which an earlier draft of this section named — silently
destroys the indicator on exactly the elements M-13 was about. The overlay is
centred with `min-width`/`min-height` at the tier, so a target already wider than
the tier keeps its full width and grows only on the short axis, and it uses
`translate` rather than `transform` for the same reason `.reveal` does.

**Expansion has a spacing consequence, and it is a layout decision.** Two 44px
targets stacked closer than 44px apart *overlap*, and the winner is source
order — invisible in the JSX, and strictly worse than the small target it
replaced, because a user tapping `Process` reaches `Work`. The footer link
columns are the case that forced it: 22.4px links at `gap: 12px` would have
overlapped by 9.6px, so **the footer link column gap is 22px** and that value is
spec, not styling. Check every adjacency an expansion creates.

**These are verified by hit-testing, never by rects.** `getBoundingClientRect`
cannot see a pseudo overlay, so a rect-based check reports every correctly-fixed
target as still failing. `scripts/audit-mobile.ts taps` probes the tier box with
`elementFromPoint`; it is the only measurement this policy can be checked
against, and it is also what makes "no two hit areas overlap" a number.

Inputs 44px tall. Visible keyboard focus rings throughout. Skip-to-content link.

### Concierge geometry

`position: fixed`, outside the grid, so none of this is reachable from a layout
fix — and all of it is bounded by the **viewport**, never by content or by width.

**Panel size (revised 2026-08-10, D-04).** Desktop panel **420 × 640**, message
list floor **`flex: 1 1 440px`**. `max-height: calc(100dvh - 48px)` **still
governs** — **640 is a preference, not a floor; the viewport bound still wins.**
The revision came from a device read: the panel read small at portrait phone
heights and on desktop. It changes the preferred size and nothing about the
bound. The paragraphs below describe the mechanism, and the 380×485 / 300px
figures they cite are the *pre-revision* state kept because the argument is
about the mechanism, not the numbers.

**Panel height.** `max-height: calc(100dvh - 48px)`, with the message list's
floor yielding rather than forcing overflow. Why: the panel used to be
**380 × 485px with no `height`, `max-height`, `vh` or `dvh` anywhere in its
chain**, anchored `bottom: 24px`. 485 + 24 = 509 against a 390px-tall viewport,
so it grew upward and overshot the top edge by exactly **119px** (M-03,
`blocking`), taking its only close control off-screen. A content-driven height on
a bottom-anchored fixed element is the defect; a viewport bound is the fix.
**`dvh` vs `svh` vs `vh` cannot be distinguished in the audit harness** —
headless Chromium has no collapsing URL bar, and all three probe identical — so
this choice is confirmed on a real device or not at all.
**[measured 2026-08-12, user, Pixel 9A] Confirmed on device, portrait and
landscape.** `dvh` is correct and this line is no longer an open question.

**The list floor is a flex basis + `min-height: 0`, never a `min-height`** — now
`flex: 1 1 440px`, previously `flex: 1 1 300px`; the rule is the property, not
the number. A hard `min-height` cannot yield: the list would hold its floor and the
panel would clip it against its own `overflow: hidden`, which is the same defect
one layer down. As a flex basis the floor is a preference — the list keeps it
when there is room, compresses and scrolls inside itself when the viewport bound
bites, and grows to fill in sheet mode. **If a future message list grows past
its floor the fix is scrolling inside the list. The panel never grows past the
bound.**

**Sheet threshold: `(max-height: 560px)` OR `(max-width: 767px)`.**
**The height condition is the load-bearing one and is not up for revision.** The
blocking case is **844×390** — a phone held sideways — which is *wider* than
768px. A threshold keyed to **width alone misses it entirely**, the same trap the
768–1023 band above was built out of, and worth naming twice. 560 is derived:
485px of panel content + the 24px bottom offset + a 24px top gap = 533, rounded
up.

**The width condition added 2026-08-10 (D-04) is ADDITIVE, not a reversal.** It
is an `or`, and it exists because a **tall portrait phone** clears 560px of
height and still wants a sheet — a case the height condition legitimately does
not cover. **Removing the height condition and keeping the width one reopens
M-03, the one `blocking` finding this section was written to close.** Stated
explicitly so the next reader does not "fix" it back to width-only. Below either
threshold the panel takes a full-screen sheet treatment with body scroll lock,
`aria-modal="true"`, and Escape-to-close.

**The non-modal contract holds above that threshold.** The launcher is persistent
and the page scrolls behind an open panel at normal viewport heights; the sheet is
the bounded exception for short viewports only. Above the threshold there is **no
focus trap, no scroll lock, and no `aria-modal`** — trapping focus there would
break a deliberate site-wide decision (no modals anywhere), not fix an oversight.

**Dialog keyboard and focus baseline, both modes.** Escape closes the panel.
Focus moves into the panel on open and returns to the launcher on close. Sheet
mode additionally traps Tab for as long as it is open.

**[decided 2026-08-12, user] WHAT receives that focus is mode-dependent, and it
is a soft-keyboard fix.** Sheet mode focuses the **panel itself**
(`tabIndex={-1}`); above the threshold the **input** keeps it. Reported on a
Pixel 9A: opening the concierge raised the keyboard immediately, which on a
full-screen sheet eats a panel already bounded by the viewport. Focusing a text
input is what raises the keyboard — so the fix is not "stop moving focus," which
this baseline requires and `aria-modal` depends on. A container focus satisfies
the baseline *and* is what makes a screen reader announce the dialog.
**[measured]** Sheet: `document.activeElement` is the `role="dialog"` element,
which is excluded from `FOCUSABLE` by its `-1` and so is never one of its own
tab stops; all five controls remain reachable. Desktop: `#concierge-input`.

**The mode flag is read through a ref in that effect, deliberately.** Making
`sheet` a dependency is a live bug, not a lint nicety: on Android the soft
keyboard can shrink the layout viewport past `(max-height: 560px)`, flipping
`sheet` — and an effect re-running there would re-focus the panel, dismiss the
keyboard, restore the height, and start again. The one documented
exception to "returns to the launcher": if the launcher is yielded because the
panel was opened from the `closing-cta` text link — which is on screen and
therefore hiding it — focus returns to that link instead. Returning focus to an
`aria-hidden` control is worse than not returning it.

**Close control: 44 × 44px, grown by padding around the glyph.** The `✕` stays at
its exported 16px; the box grows outward around it, with a −6px right margin so
the painted glyph sits where the export puts it. It was 32 × 32 (M-14). Same
tier-1 floor as the launcher, per the two-tier policy above — and the same
"expand, never resize" rule.

**Safe-area insets are additive.** `calc(24px + env(safe-area-inset-bottom, 0px))`
and the equivalent for `right`; the sheet takes all four sides. Always the
two-argument form, so a browser without `env()` resolves to the existing 24px
rather than 0.

**Launcher.** Measured: **234.0 × 50.0px, byte-identical at all eight audited
viewports** — 65.0% of a 360px viewport, 16.3% of 1440 (M-06). Mid-scroll it
covered **174 distinct route/element pairs**, 65 of them ≥50% covered, including
each page's own `Let's Talk` at up to **81.1%** — and **zero persisted at maximum
scroll**, so the occlusion was entirely transient (M-15).

**The launcher yields; it does not shrink.** Its width and label are unchanged at
every viewport. An `IntersectionObserver` watches the page's hero CTA and the
`closing-cta` button — those two elements only, tagged `data-primary-cta`, which
is the one place CTA detection lives. While either is in the viewport the
launcher goes to `opacity: 0`, `pointer-events: none`, `aria-hidden="true"`, and
out of the tab order; otherwise `opacity: 1`. It is never hidden-but-focusable.

Why yielding rather than a narrow variant: shrinking below 414px addresses M-06's
width and does nothing for M-15, where **109 of the 174 pairs occur above 414px**.
Yielding fixes both with one mechanism, and extends the rule that already existed
(never visible over the hero) instead of inventing a second one. Why the target
set is exactly two elements: M-15 measured against each page's own primary
conversion element, not every CTA-shaped control. `/work`'s per-project "Try it"
links and the case-study CTAs are not in it — an observer keyed to every
CTA-styled element would flicker the launcher on any scroll-heavy route.

**Opacity only — no transform, no translate, no scale.** A second motion pattern
here is as unwelcome as extending the four-colour shimmer. The transition is
`.tg-yield` in `globals.css`, a real rule rather than a Tailwind pair because its
two properties need two durations (240ms opacity, 120ms the button's own hover)
and a `transition` shorthand resets every transition property. Under
`prefers-reduced-motion: reduce` the change is instant.

**Acceptance criterion (M-15): 0 primary-CTA pairs above 25% coverage at any
sampled scroll step.** Measured after: **0 of 0** — no overlap anywhere in the
162-row sweep involves `Let's Talk` or `See Our Work`, against 174 pairs and an
81.1% worst case before.

**The criterion is scoped to primary CTAs, and the scope is doing work.** Across
*every* interactive element the sweep still finds **143 pairs, 44 of them above
25%, worst 99.6%** — five element classes the yield rule deliberately does not
cover: `/work/[slug]` meta-rail links (12), inline `link-underline` text links
(11), prev/next case-study nav links (9), footer links (6), `/contact` FAQ
accordion triggers (6). Widening `data-primary-cta` to reach them is the wrong
fix: it would flicker the launcher on every scroll-heavy route, which is worse
than a transient overlap on a secondary link. **All 143 remain transient — 0 at
maximum scroll**, unchanged from before.

> **Erratum (2026-08-11) — the paragraph above is not edited; its reasoning is.**
> *"0 at maximum scroll"* was read as evidence of transience on the strength of
> an argument that `closing-cta` yields the launcher at the bottom of the page.
> **That argument is false and is withdrawn.** `footer-dark` measures **956px**
> against mobile viewports of 667–896, so it pushes `closing-cta` off-screen
> before the bottom is reached: measured 2026-08-11 across 56 route × viewport
> rows, `closing-cta` intersects the viewport at maximum scroll on **0 / 56**
> and the launcher is fully presented (`pointer-events: auto`, no
> `aria-hidden`) on **56 / 56**.
>
> The reading survives, on better grounds than it had: a probe across all 8
> routes finds **0 overlap pairs at maximum scroll** with the launcher live on
> every row. So the bottom of the page is clean by measurement, not by a
> terminal yield that does not exist.
>
> **The frozen figures — 143 / 44 / 99.6%, and Prompt 11's re-read of
> 140 / 45 / 100.0% — stand and are not rebaselined.** The 2026-08-11
> production-build re-run of the same phase reads **135 pairs / 31 above 25% /
> worst 0.996**, published as a separate baseline, not as a correction. The two
> are different builds at different times and are not comparable.
>
> **The per-class partition this erratum was written to carry is INCOMPLETE.**
> **0 of 4 classes are resolved.** `audit-mobile.ts classes` fails its own
> cross-phase guard against `sweep` on all four, so no transient/static verdict
> is reportable — including the footer, which an earlier version of this
> erratum recorded as transient. What stands is only the bottom-of-page
> measurement above. See `docs/archive/HISTORY.md`.

**The launcher carries no entrance animation.** Its Motion entrance
(`opacity 0→1` + `y 8→0`, 240ms) ran **unsuppressed under `reduce`** — H-4
confirmed by sampling from the instant of DOM insertion (M-19). Its replacement
is the yield transition above, which is opacity-only and instant under `reduce`,
so `getAnimations()` is empty on the launcher at rest.

Why they were needed: the launcher and panel anchored a bare `bottom: 24px` with
**no `env(safe-area-inset-*)` in any matching declaration**. On a device with a
gesture bar that is 24px from the display edge, not from above the bar.
Fixed-position elements take `env()` insets; nothing else does.

---

## 9. Do / Don't

*Converted 2026-08-12. **This list is `[decided, standing]` in its entirety** —
it is a summary of rules argued for elsewhere in this document, so each line
points at the section that carries its reason rather than restating it. One
entry was factually wrong and is corrected below.*

**A line here is never the authority.** If a Do/Don't disagrees with the section
it points at, the section wins and this list gets fixed — which is exactly what
happened to the `flourish-mark` entry.

**Do**

- Ink for every primary CTA — §4.1
- Accent mapping in `config/solutions.ts` only — §1
- Real production UI in every frame — §4.9
- **One `flourish-mark` per page, on every route** — §4.11

  > **This list was wrong.** It read "one `flourish-mark` per page, **home
  > only**." §4 corrected the same error in v2.5 and this copy was missed, which
  > is how a corrected claim survives: it lives in two places and only one gets
  > fixed. Measured 2026-08-12 — the dots render on Home, every `page-hero`
  > route, and `/work/[slug]`. The *once per page* half is the part that is
  > absolute.

- Left-anchor everything but the closing CTA — §3
- Keep case-study and project components visibly different in weight — §4.7, §4.8
- Light as default — §7
- Show a current-page indicator in the nav — §4.2, §6.2
- Give dark mode real bright elements, not a uniformly dark page — §7
- Use icons for the footer social row and the theme toggle, styled to the site's
  own line weight — Icon policy, §4.14
- Verify text-on-tint contrast across every badge / status / success / error
  surface, in both themes, before shipping — §1
- Let `closing-cta`'s button be the one documented size exception — §4.5

**Don't**

- Tint a button with an accent, or add a 5th accent — §1, §4.1
- Add icons to solution rows — §4.6
- Use cyberpunk / terminal aesthetics, or monospace body type — §0, §6.6

  *Not a ban on monospace itself: `status-line` is Geist Mono by design (§5), as
  is the concierge's inline code span. The rule is about body copy.*

- Auto-switch dark mode — §7
- Use any banned motion effect — §6.6, and read what that list is actually
  rejecting before treating it as a cap on motion
- Center-align section content outside `closing-cta` — §3
- Interleave case studies and projects on `/work` — §4.7, §4.8
- Put an image on `project-card` — §4.8. **The card only**; a project's own
  detail page does carry its frame.
- Pad the inside of a frame, or overlay its status block on the poster — §4.9
- Mute the actionable half of the proof line — §4.4
- Use a sandbox / emulator / demo-mode illustration where a real screenshot
  exists — §4.9, PLAYBOOK §12
- Use a generic imported social-icon or theme-toggle icon set without restyling
  it — Icon policy
- Let the closing CTA or the footer masthead inherit full section-level spacing —
  §4.5, §4.14
- Use a blended gradient anywhere, including the concierge's thinking indicator —
  §4.13
- Extend the four-colour moving treatment beyond the concierge's thinking state —
  §4.13
- Reproduce the current site's layout — §0
