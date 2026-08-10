# TEKGUYZ Design System v2.4

*Becomes `/docs/DESIGN.md` in the repo. Supersedes v2.3.*

**Governed by:** TEKGUYZ-REBUILD-CANONICAL.md · **Copy:** TEKGUYZ-COPY-DECK-V2.md

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

```css
--text-hero:    clamp(2.5rem, 6vw, 4.5rem);    /* 40 -> 72px, measured against the real headline */
--text-display: clamp(2rem, 4.5vw, 3.5rem);    /* 32 -> 56px  */
--text-title:   clamp(1.375rem, 2vw, 1.75rem); /* 22 -> 28px  */
--text-body:    1.0625rem;                     /* 17px       */
--text-sm:      0.875rem;                      /* 14px       */
--text-caption: 0.75rem;                       /* 12px       */
```

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
- Featured Work rows alternate: text 1–5 / media 7–12, then media 1–6 / text 8–12. Not mirrored — offset.
- Detail pages, and `/work` index case-study rows: content cols 1–8, sticky meta rail cols 10–12. The media column (image, status-line, caption, `build-narrative`) should read as intentionally composed against the text column, not trail off into empty space — see `build-narrative` in §4.
- **Only the closing CTA band is centered.** Everything else is left-anchored.

**Radius:** 4px inputs · 6px tags/pills · 8px buttons · 12px cards · 16px large containers · full for dots/badges.
**Elevation:** flat. Hairlines only, no shadows anywhere. Hover lift comes from position, not shadow.

**Signature stripe:** four-segment accent bar, exactly three per page — top of hero, above closing CTA, bottom of footer. Nowhere else. Identical treatment every time it appears: full-bleed edge-to-edge, 6px height, four equal-width segments.

---

## 4. Components

**`button-primary`** — ink bg, white text, radius 8px, 14×24px padding. Hover #242424. Press adds `scale(0.98)`. Dark mode inversion, explicit values: `text-primary-dark` (#F5F5F5) fill, `bg-dark` (#101010) text — it should be the brightest element on a dark page, not a darker shade of the background it sits on. No accent ever fills a button.

**`button-secondary`** — transparent, ink text, 1px hairline border, radius 8px.

**`nav`** — sticky. Transparent, no fill, no border at scroll position 0. Past 24px scroll: canvas (or `bg-dark`) at 80% opacity, `backdrop-blur(12px)`, hairline border-bottom fading in over **240ms** (`--dur-base`; measured in the shipped stylesheet — this doc previously said 200ms, which no surface ever implemented). `logo-lockup` left (icon + wordmark, no tagline). Links center-right — Solutions / Work / Process / Contact, `--text-sm`, weight 500. Active-page indicator: 2px ink underline beneath the current page's link, width matching the link, no accent color. **Theme toggle is now an icon** (sun/moon or equivalent single glyph that swaps on click) — styled per the Icon Policy above, not a text label anymore. Primary CTA "Let's Talk" right-aligned, standard `button-primary` — must not wrap at any supported width. Mobile: hamburger, full-screen drawer, Solutions expands inline to the four accent-dot anchors.

**`page-hero`** — top-of-page treatment for every inner route, including both `/solutions` (the index) and `/solutions/[slug]` (each detail page, headline drawn from that solution's own copy, not the generic page-hero pattern used elsewhere) — see COPY.md and CANONICAL.md for the index-plus-detail reversal. Also `/work`, `/process`, `/contact`. Eyebrow (`--text-caption`) above a headline at `--text-display` (not hero scale) above a one-line description at `--text-body`, `muted`, capped around 60ch. No media. **Does carry the `flourish-mark`**, above the eyebrow — the same stale "home-only" claim corrected in the `flourish-mark` entry below; the export shows the dots on every route's first section and that is what ships. Top padding matches standard section rhythm.

**`closing-cta`** — centered, the one section permitted to be. Deliberately more compact than a standard section, not equal to one: padding roughly 64px / 48px mobile. Headline at `--text-display`. Trust lines beneath the subhead in `--text-sm`, `muted`, one single line separated by mid-dots. No proof line. **`button-primary--large`, a documented one-off size exception**: 18×32px padding, ~16px text — the only button on the site that deviates from the standard size. Earned deliberately: this is the page's single most important remaining ask, and the standard button size was reading as underweighted against the headline stacked above it, which was the actual cause of the "still doesn't work" complaint — not the padding, which was already correct. **Beneath the button, one small secondary link**: "Or ask our AI what we'd build for you" — `--text-sm`, `muted`, no button styling, opens the concierge panel. A lower-commitment alternate path, not a competing CTA — this is the only place the concierge gets a second entry point beyond its own persistent launcher, and it stays deliberately quiet so it doesn't dilute the primary ask. On scroll into view, replays the hero's load sequence **timing** (headline → subhead → trust lines → button, see §6) once — **no second set of flourish dots**; the one-per-page rule is absolute and wins over the echo. The signature stripe directly above it uses the same full-bleed treatment as every other instance.

**`solution-row`** *(replaces `solution-card`)* — full-width row, hairline top border, 48px vertical padding. Accent dot (10px) + display-size title on the left, one-line hook + arrow on the right. Hover: title shifts 4px right, arrow shifts 4px right, hairline darkens to `border-strong`. No icons — the dot is the icon. No card fill, no box.

**`case-study-row`** — full-width alternating row on the ink band (home) or standard background (`/work` index). Solution tag, title, Challenge/Approach/Outcome as three labeled beats, pull-quote, `LiveFrame`, status line. Substantial by design — and see `build-narrative` below, since this component's media column needs it wherever the full-length version appears.

**`build-narrative`** — the "How it's built" block from COPY.md. **Applies everywhere the full-length `case-study-row` appears — both the standalone `/work/[slug]` detail pages and the `/work` index itself.** (The index was missed in the previous pass; it shows the identical full-length content and had the identical empty-space problem.) Sits directly beneath the `LiveFrame`'s status-line and caption in the media column. `--text-sm`, `muted`, capped around 60ch. Exists specifically to balance the two-column layout — the media column should read as intentionally composed, not trail off into empty space beside a taller text column. If it's still visibly shorter with this included, the text column needs tightening, not the media column padded to match.

**`project-card`** — compact, `surface-card` fill, radius 12px, 24px padding. Tag, title, one description, status line. No image, ever — deliberately removed, don't reintroduce. The size gap from case studies is intentional signal.

**`LiveFrame`** — the deferred-embed container. Props: `poster`, `url`, `embeddable: boolean`, `alt`. **Two locked ratios, context-dependent**: compact contexts (case-study-row, project-card, detail pages) stay **16:10**, no exceptions. **Hero uses 16:9**, its own separate ratio — matches standard screen-capture dimensions (1600×900) and eliminates the crop-vs-letterbox tension that comes from forcing a 16:9-native capture into a 16:10 container. `object-fit: cover` in both cases; with the hero's ratio now matching its actual source captures, cover and contain produce the same result, which is the point. Every poster is a real screenshot of the actual production application — never a sandboxed device emulator, simulator, or "demo mode" illustration standing in for the real UI.

**Hero is a distinct context from the compact card contexts** — the same underlying screenshot doesn't have to be the same crop, or even the same file, in both places. A dense multi-panel dashboard can read fine at card size and feel cluttered blown up large in the hero. It's legitimate for a case study to have: a tighter, simpler hero crop (or, if available, a short looped video with a matching static poster for `prefers-reduced-motion` and slow connections — the previous build had exactly this for the AI Voice Receptionist hero: a video loop plus a same-dimension fallback poster, separate from the still used in the compact card contexts) and a separate, more detail-dense still for the compact `case-study-row`/detail-page contexts. Don't force one asset to serve both jobs if it isn't reading well in one of them.

- `embeddable: false` (all entries at launch): renders poster at its context's locked ratio, 1px hairline border, radius 12px, white bg, plus "Open it in a new tab."
- `embeddable: true` (later): renders click-to-activate iframe in the same frame, same dimensions, zero layout change.
- No fake browser chrome drawn around it — the real product's own UI is what makes it credible.
- Mobile: poster + link regardless of flag.
- Keyboard-operable. 2x source assets.

**`status-line`** — see §5.

**`pull-quote`** — `--text-display` in Geist 600, max-width 22ch, no quotation marks (the copy is a stated outcome, not dialogue), 2px left border in that build's accent, 24px left padding. The only place accent touches anything larger than a dot or tag.

**`numeral-device`** — Process steps only. `--text-hero` size, accent at 8% opacity, positioned *behind* the step title. Nothing else on the site gets numbers.

**`flourish-mark`** — four dots, order blue→violet→amber→teal, **once per page, on every route** — near the hero headline on Home, and inside `page-hero` (above the eyebrow) on every inner route. This line previously read "Home only"; that was the stale half. The Pass 2 audit found the dots rendering on every route's first section, which matches the approved Claude Design export, and the export is ground truth (CANONICAL's authority order). The rendering was correct and is unchanged — **this doc was wrong.** What is absolute is the *once per page* half: the closing-CTA echo replays the hero's load-sequence timing and deliberately gets no second set of dots.

**`logo-lockup`** — Connected Nodes icon (four accent circles, top blue / right violet / bottom amber / left teal, joined by hairline connectors that theme-swap via `var(--color-border)`) + wordmark. Header: icon + wordmark. Footer: icon + wordmark + tagline, hairline divider. Wordmark uses `text-primary` so it resolves in both themes with no JS. Never wraps itself in a `<Link>`.

**AI concierge** — launcher and header must use the actual `icon-master.svg` asset (the diamond-arranged Connected Nodes mark), rendered exactly as it appears everywhere else on the site. Not an invented simplified icon (a plain 2×2 grid of colored dots has appeared in its place and is wrong) — there is one brand mark, and every instance of it is the same file, not a redrawn approximation.

**Launcher visibility, locked, not optional**: hidden on initial load, fades in only once the visitor scrolls past the hero section. Never visible overlapping the hero — it competes with the hero's own CTAs and reads as a bug, not a feature, when it does. This was previously only stated in conversation and never written down, which is exactly how it ended up shipping wrong in a reference render — it's a real requirement now, not a suggestion.

**Conversation UI:**
- **No avatars, either side.** Visitor messages get a `surface-card` fill; assistant replies are plain text on the panel background, so the exchange reads as a document rather than a chat-bubble stack. Avatars would fight that and add a second visual voice the site doesn't otherwise have.
- **Three suggestion chips on the empty state**, drawn from the real solution lines — e.g. "We're missing after-hours calls," "Everything lives in spreadsheets," "I'm not sure what I need." They remove the blank-input problem, which is the single biggest drop-off point in any chat UI. Chips disappear permanently after the first message; they're an opener, not a persistent menu.
- **Route-aware opener.** The panel receives the current pathname. On a `/work/[slug]` page it opens with a line referencing that build; elsewhere it uses the default opener from COPY.md. Cheap to implement, and it makes the assistant feel like part of the page instead of a widget bolted onto it.
- **Lead capture stays conversational, never a form.** The existing `capture_lead` tool collects name, email, project type, and a summary — the assistant asks for these one at a time as the conversation warrants, never as a wall of fields. If a visitor volunteers everything in one message, capture it in one step and don't re-ask.
- **Captured state**: the four-segment stripe resolves to a single `success` dot with the confirmation copy from COPY.md. The input stays enabled — a captured lead may still have questions, and disabling the input at the moment someone converts is exactly the wrong signal. (The cap-reached state is the one exception: there, the handoff *is* the action, so the input goes away.)


**"Thinking" indicator, revised**: not the plain muted dot described in earlier versions. Instead, a thin (3px) bar using the same four equal segments as the signature stripe — blue → violet → amber → teal, same fixed order — with a slow shimmer: opacity sweeping left to right across the four segments, 1200ms loop. Resolves to nothing (segments disappear) once the reply arrives. `prefers-reduced-motion` falls back to a static four-segment bar, no shimmer.

**This is the one functional, moving use of the site's four-color system, and it stays that way.** It's earned here specifically because the AI is genuinely doing work in that moment — the signal means something. **Do not extend this pattern anywhere else** — not around a button, not as a page-load flourish, not as ambient decoration. A four-color moment that shows up in more than one place stops being a signature and starts being wallpaper, which is exactly the failure mode the rest of this system has been built to avoid. Still four discrete segments, never a blended gradient — the system's no-gradients rule doesn't need an exception for this; the shimmer is motion on an existing component, not a new visual language.

**`footer-dark`** — always dark regardless of toggle, always `bg-dark`, separated by a persistent 1px `border-dark` top border. Structure: masthead (lockup + tagline left, social row right) → hairline divider → 3-column nav → bottom bar → signature stripe. **The copyright bar and column headings currently hardcode `#6B7280`** (the light-mode `muted` value) regardless of theme — that's the same failure flagged in §1. Once `muted-dark` is set, these reference it instead of a bare hex.
- **Masthead padding: tighten further than the previous 64/48 attempt** — that wasn't enough. Target roughly 40px top / 32px bottom, and treat this as a starting point to adjust visually once built, not a value to accept unquestioned if it still looks heavy next to the rest of the footer's density.
- **Social row: icons now** — LinkedIn / Instagram / Facebook / GitHub, icon-only, no text label, styled per the Icon Policy above (single consistent stroke weight, monochrome, not brand-colored).
- Solutions column dots use real accent colors from `config/solutions.ts`.

---

## 5. `status-line` — the signature component

Replaces the decorative "LIVE" badge everywhere.

**Verified:** 6px `success` dot · `Live` in ink 600 · `· checked 14 minutes ago` in `muted`, tabular numerals.
**Unreachable:** 6px `muted-soft` dot (no pulse) · `Temporarily unreachable` in `muted` · timestamp.

- Small caps, `--text-sm`, 0.04em tracking.
- Dot pulses only in the verified state: opacity 1→0.4→1, 1600ms. `prefers-reduced-motion` → static at 0.85, no animation.
- Appears on every build card, detail page, and the hero.
- Data from a server-side HEAD request per demo URL, `next: { revalidate: 3600 }`, 3s timeout, `Promise.allSettled`. Never a client-side fetch to eight origins.

**Why this is the signature:** every competitor's LIVE badge is a graphic asserting a fact. This one measures it. "Proof Over Claims" as a component.

---

## 6. Motion

| Layer | Tool |
| --- | --- |
| Scroll reveals | IntersectionObserver toggling a class, plain CSS transition |
| Route transitions + shared elements | View Transitions API (`<ViewTransition>`) |
| Presence, gesture, layout animation only | Motion |

```css
--ease-entrance: cubic-bezier(0.16, 1, 0.3, 1);
--ease-hover:    cubic-bezier(0.4, 0, 0.2, 1);
--dur-fast: 120ms;  --dur-base: 240ms;
--dur-entrance: 500ms;  --dur-page: 320ms;
```

**Hero load sequence** (initial load only, never re-triggers): flourish dots stagger 60ms apart → headline fades up (32px→0) at +180ms → subhead at +80ms → CTA row at +80ms → hero media scales 0.97→1 concurrently with the CTA row, not chained after. Resolves under ~900ms.

**Closing CTA echo:** the sequence above replays for the closing CTA **minus the flourish dots** (one-per-page rule wins) — same stagger timing on headline → subhead → trust lines → button, `once: true`, triggered on scroll-into-view instead of page load.

**Scroll reveals:** trigger at 15% into viewport. `translateY(16px)→0` + opacity, `--dur-entrance`, `--ease-entrance`, once. Stagger 80ms, max 4 concurrent. Featured Work rows reveal text + media as one unit. **Correction:** earlier versions specified `animation-timeline: view()` for this — technically wrong, since that API scrubs with scroll position (reverses on scroll-up) and can't express "once." Use IntersectionObserver adding a class on first intersection, removed observation after. Content must never render at `opacity:0` with no observer attached (a real bug this caused) — default to visible, reveal is progressive enhancement.

**Shared element:** build card poster + title carry a `view-transition-name` matching the detail page hero.

**Hover:** cards `translateY(-3px)` + hairline→`border-strong`, `--dur-base`. Solution rows shift title and arrow 4px right. Text CTAs draw an underline left-to-right via `background-size`, 180ms.

**Scroll behavior:** native. No Lenis, no smooth-scroll library. `scroll-behavior: smooth` for anchor jumps only.

**One pinned moment, `/process` only** — steps pin while a progress rail advances.

**Banned, no exceptions:** parallax, gradient blobs, spinning shapes, marquees, particles, glassmorphism, cursor-followers, magnetic buttons, skeleton shimmer, uniform fade-everything-in, scroll-jacking beyond the single pinned section.

**`prefers-reduced-motion`** kills every entrance, the status pulse, the closing-CTA echo, and the pin.

---

## 7. Dark mode

Manual toggle only — `next-themes`, `attribute="class"`, `defaultTheme="light"`, `enableSystem={false}`. Light is what every new visitor sees.

The full-bleed Featured Work band stays ink in both themes. In dark mode it's distinguished from the page by a hairline, not a fill change — the page background is already near-black, so a fill-color contrast isn't available; the hairline is the only signal left, and that's intentional.

Every primary button must actually invert — see §4. Dark mode should still have real bright elements: `text-primary-dark` for headlines and primary text, and the primary CTA as the single brightest thing on the page.

Never gate color logic on `useTheme()` or mount state when a CSS `dark:` variant or `currentColor` solves it.

---

## 8. Responsive

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
in PROGRESS.md's Prompt 8 section. These are the shipped spans — grid **line**
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
| Case-study row, even — text / media | `1/6` + `7/13` | **`1/4`** + **`5/9`** |
| Case-study row, odd — media / text | `1/7` + `8/13` | **`1/5`** + **`6/9`** |
| `/work/[slug]` content / meta rail | `1/9` or `1/8` + `10/13` | **`1/7`** + **`7/9`** |
| `/process` steps | `4/13` | **`1/-1`** |
| `/contact` trust column / form card | `1/6` + `7/13` | both **`1/-1`** |
| `/solutions/[slug]` title / body | `1/6` + `7/13` | both **`1/-1`** |
| Footer nav — Solutions / Company / Get In Touch | `1/5` + `5/9` + `9/13` | **`1/4`** + **`4/6`** + **`6/9`** |

**Why some rows go full-width instead of splitting.** A hero- or display-scale
heading has no second column to sit beside — `--text-hero` resolves to 46.08px at
768, and a narrow column at that size is the artifact, not a layout. So `page-hero`,
`SectionHead`, `/solutions/[slug]`'s header and `/contact` take all 8 tracks. Rows
that carry two *genuine* columns — text against media, content against meta rail —
keep both.

**Two rows that look alike and are not.** `/process`'s progress rail is
`hidden lg:block`, so the band has no second column and the steps take `1/-1`.
`/work/[slug]`'s meta rail is **not** hidden — only its pinning is `lg:`-gated — so
the band really does render two columns and both get placed. Check which case a new
row is before placing a column that isn't there.

**Footer 4/4/4 becomes 3/2/3, not 3/3/2.** Company takes the narrow track because
its longest item is `Process` at 51px; Solutions (136px) and the email address
(126px) both need a wide one. Ordering it the obvious way puts the email in a 121px
column and wraps it.

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
mode additionally traps Tab for as long as it is open. The one documented
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

**Do:** ink for every primary CTA · accent mapping in shared config only · real product in every `LiveFrame` · one `flourish-mark` per page, home only · left-anchor everything but the closing CTA · keep case-study and project components visibly different in weight · light as default · show a current-page indicator in nav · give dark mode real bright elements, not a uniformly dark page · use icons for the footer social row and theme toggle, styled to match the site's own line weight · verify text-on-tint contrast across every badge/status/success/error surface, in both themes, before shipping · let `closing-cta`'s button be the one documented size exception on the site.

**Don't:** tint a button with accent · add a 5th accent · add icons to solution rows · use cyberpunk/terminal aesthetics or monospace body type · auto-switch dark mode · use any banned motion effect · center-align section content outside `closing-cta` · interleave case studies and projects on `/work` · put an image on `project-card` · use a sandbox/emulator illustration in a `LiveFrame` where a real screenshot is available · use a generic imported social-icon or theme-toggle icon set without restyling it to match · let the closing CTA or footer masthead inherit full section-level spacing · use a blended gradient anywhere, including the concierge's thinking indicator · extend the four-color moving treatment beyond the concierge's thinking state · reproduce the current site's layout.
