# TEKGUYZ Token Reference

**This file is enforced.** `bun run check:design` runs on every `prebuild` and
asserts that every `--token: value;` printed below matches `app/globals.css`. A
mismatch **fails the build** and names the token and both values.

That is the entire point of splitting this out of `DESIGN.md`. That document was
89KB doing two jobs — a description of what the code does, and a record of what
was decided and why — and the two were indistinguishable on the page, so its
descriptive half drifted and got quoted back as fact three separate times.

**Read this file for a value. Read `DESIGN.md` for a reason.**

| Question | File |
| --- | --- |
| "What is `--dur-base`?" | Here. It is checked, so you can quote it. |
| "Why is there no overshoot?" | `DESIGN.md` §6.1. |
| "What is the card radius?" | Here. |
| "Why is `LiveFrame`'s padding 0?" | `DESIGN.md` §4. Prose, not checkable, still authoritative. |

**Authority is unchanged: CANONICAL > DESIGN > COPY > SEO.** This file is not a
new authority — it is `DESIGN.md`'s measured half, extracted so a machine can
hold it to account. Where this file and `DESIGN.md` disagree about a *number*,
this one is right by construction, because the build would not have passed
otherwise.

**To add a token to the guard:** put it in a fenced ` ```css ` block under a
heading, then add that heading to `TOKEN_SECTIONS` in
`scripts/check-design.ts`. Two lines.

---

## Colour

Measured in the v2.3 contrast audit; every ratio below is real, not estimated.
See `DESIGN.md` §1 for what each one is *for* and for the accent rules
(wayfinding only, never a button fill, never a 5th colour).

```css
--tg-ink: #111111;
--tg-canvas: #ffffff;
--tg-surface-card: #f5f5f5;
--tg-hairline: #e5e7eb;
--tg-muted: #6a717e;
--tg-muted-soft: #9ca3af;
--tg-muted-dark: #7b8291;
--tg-bg-dark: #101010;
--tg-text-primary-dark: #f5f5f5;
--tg-border-dark: #2a2a2c;
--tg-accent-blue: #3b6fe0;
--tg-accent-violet: #7c6fe0;
--tg-accent-amber: #f2a93c;
--tg-accent-teal: #2fa679;
```

Contrast, measured: `muted` 4.91:1 on canvas and 4.50:1 on `surface-card` — the
minimum step clearing both. `muted-dark` clears AA on all three dark
backgrounds it is composited on: 4.93:1 on `#101010` (page floor, footer),
4.90:1 on `#111111` (ink band), 4.51:1 on `#1a1a1c` (card fill) — the card
fill is the binding constraint and the margin there is thin, so re-measure
before darkening any dark surface.
**`muted-soft` is retired as a text colour** and is valid only for dots and the
concierge thinking indicator.

Accent `-text` variants (an accent rendered as small/bold text on any light
background): blue `#1e3f94` 9.57 · violet `#4433a8` 9.19 · amber `#8a5a0a` 5.92
· teal `#1d6b4d` 6.44, all on white. Dark-mode variants: blue `#5380e4` 5.05 ·
violet `#8377e2` 5.17 on `#101010`; amber and teal pass as their plain accent.

---

## Type

```css
--text-hero: clamp(2.5rem, 6vw, 4.5rem);
--text-display: clamp(2rem, 4.5vw, 3.5rem);
--text-subhead: clamp(1.5rem, 3vw, 2.25rem);
--text-title: clamp(1.375rem, 2vw, 1.75rem);
--text-body: 1.0625rem;
--text-sm: 0.875rem;
--text-caption: 0.75rem;
```

Rendered: hero 40→72px · display 32→56px · **subhead 24→36px** · title 22→28px ·
body 17px · small 14px · caption 12px. Geist throughout; Geist Mono in two
places only (`status-line`, which sets it on the whole line, and the concierge's
inline code span). Process numerals and tag labels are Geist Sans — the doc
claimed mono for both until it was measured on 2026-08-13.

**`--text-subhead` is the item-level heading step, added 2026-08-13.** Section
heads own `display`; the things listed under one own `subhead`. It exists because
`SectionHead`'s `h2` and `solution-row`'s title were both `--text-display` and
differed by weight alone (700 vs 600) — a distinction that is legible in this
table and not on the page. Its only consumer today is `solution-row`. Reason in
`DESIGN.md` §2 and §4.6.

**The 72px ceiling is governed by a constraint, not by the number**: the hero
headline must wrap to no more than 3 lines on desktop with the CTA row inside
the first viewport. If the copy changes length, re-measure against that rule.

---

## Radius, container, spacing

```css
--radius-input: 4px;
--radius-tag: 6px;
--radius-button: 8px;
--radius-card: 12px;
--radius-container: 16px;
--container-max: 1280px;
--container-pad: 32px;
```

Dots and badges are `full`, which is not a token. `--container-pad` drops to
24px below 768px. Base spacing unit 4px; scale 4·8·12·16·24·32·48·64·96·128.

**Elevation is flat, with one dated, scoped exception.** Hairlines only, no
shadows, hover lift from position — that still governs every surface on this site
**except the homepage fold's proof strip and its four build cards**, which carry
`--tg-elevate` / `--tg-elevate-hover` via `.tg-elevate` / `.tg-lift`
(`app/globals.css`, added 2026-08-14). Reason in `DESIGN.md` §4.18. The two
values are **not printed here on purpose** — a shadow is a four-part composite
whose light and dark forms differ structurally, `check:design` compares single
declarations, and the guard cannot be made to mean anything useful about it. It
is one class in one stylesheet with the rule written next to it. **Do not widen
it:** `LiveFrame`'s plate, `project-card`, and `case-study-row` stay flat, and
the weight gap between card tiers is the signal that protects.

---

## Motion

Five durations, each with exactly one job. A duration that cannot be given a job
does not get added.

```css
--dur-instant: 90ms;
--dur-fast: 120ms;
--dur-base: 240ms;
--dur-state: 320ms;
--dur-entrance: 500ms;
--dur-page: 320ms;
--ease-entrance: cubic-bezier(0.16, 1, 0.3, 1);
--ease-state: cubic-bezier(0.2, 0.6, 0.2, 1);
--ease-hover: cubic-bezier(0.4, 0, 0.2, 1);
```

`instant` press · `fast` colour and opacity only · `base` state (draw, rotate,
shift) · `state` a box changing size · `entrance` scroll reveal · `page` view
transition.

**No easing on this site overshoots.** See `DESIGN.md` §6.1 for why that was
chosen against a spring rather than inherited.

---

## Density

Mobile-first: the bare `:root` **is** the ≤767px value, so a component that
declares nothing gets the dense value rather than the loose one.

```css
--pad-container: 24px; /* 24 → 32 → 64px */
--gap-group: 28px; /* 28 → 40 → 56px */
```

The declared value is the ≤767px one; the comment gives all three across
≤767 / 768 / 1024. **All three are checked**, in three separate blocks of
`globals.css`, so a breakpoint that silently loses its override fails the build.

**Section rhythm is deliberately not a token** — it lives at the call sites as
`py-20 md:py-32` and `pt-16 md:pt-24`. `DESIGN.md` §8.0 has the three reasons.

---

## Colour format: hex today, OKLCH is a real open option

**The site is hex throughout — 50 values in `globals.css`, zero OKLCH.**

**Nothing was "overridden."** Tailwind v4's oklch palette is *its own* colours
(`--color-blue-500` and friends). This is a bespoke brand palette from the
Claude Design export; `#3b6fe0` is not a Tailwind colour, so there was never a
Tailwind oklch value for it to keep. Hex is simply the notation the export
handed over.

**What OKLCH would actually buy, stated accurately:**

- **Wide gamut — the real one.** OKLCH can express colours *outside* sRGB, so
  the four accents could be visibly more vivid on a P3 display (most modern
  phones and monitors). Hex cannot reach those colours at all.
- **Perceptually uniform derivation.** Lightening or darkening a colour behaves
  predictably. Only matters once tints are generated rather than hand-picked.
- **Not** "better-looking fixed colours." `#3b6fe0` and its OKLCH equivalent
  resolve to the identical sRGB pixel. For a fixed value there is no difference.

**[open, not decided] Converting is a contained task — 14 tokens.** An earlier
version of this entry claimed a hex → OKLCH round-trip would move the measured
contrast ratios; **that was wrong.** Converted with sufficient precision the
ratios are unchanged, because the browser resolves both to the same sRGB values.
The reason to schedule it deliberately is the wide-gamut step: going *beyond*
sRGB changes the accents on P3 displays, which is a visual decision needing a
side-by-side on a real screen, and it needs the ratios re-measured against the
fallback any sRGB display will still get.
