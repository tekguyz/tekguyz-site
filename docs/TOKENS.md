# TEKGUYZ Token Reference

**This file is enforced.** `bun run check:design` runs on every `prebuild` and asserts that every `--token: value;` printed below matches `app/globals.css`. A mismatch **fails the build** and names the token and both values.

**Read this file for a value. Read the Seam source for a reason.** Since 2026-11-12 the look is "Seam", from `tekguyz-one/brand/design/` (`DESIGN.md` and `tokens.css`), put on this site by `docs/superpowers/specs/2026-11-12-seam-reskin.md`. `docs/DESIGN.md` §1 (colour), §2 (type), §3 (shape) and §7 (dark mode) are replaced by Seam; its other sections still hold the reasons for mechanisms.

| Question | File |
| --- | --- |
| "What is `--dur-base`?" | Here. It is checked, so you can quote it. |
| "Why two grounds and no toggle?" | `tekguyz-one/brand/design/DESIGN.md`, "The idea". |
| "What is the card radius?" | Here: 0. |
| "Why is `.tg-collapse` built that way?" | `docs/DESIGN.md` §6. Prose, not checkable, still authoritative. |

**Authority is unchanged: CANONICAL > DESIGN > COPY > SEO.** This file is not a new authority. Where it and a doc disagree about a *number*, this one is right by construction, because the build would not have passed otherwise.

**To add a token to the guard:** put it in a fenced ` ```css ` block under a heading, then add that heading to `TOKEN_SECTIONS` in `scripts/check-design.ts`. Two lines.

---

## Colour

Two grounds, four lamps, no other hues. **There is no theme switch.** Every page uses both grounds, joined by a straight horizontal seam. `.on-ink` and `.on-paper` in `globals.css` are the only scope roots; each sets the semantic `--tg-*` values (`fg`, `secondary`, `mute`, `border`, `border-strong`, `cta-*`) for its ground, so components never branch on where they sit.

```css
--ink: #0b0b0c;
--paper: #ffffff;
--on-ink: #ffffff;
--on-ink-soft: #b4b8c0;
--on-ink-mute: #8a8f98;
--line-on-ink: #2a2a2d;
--on-paper: #0b0b0c;
--on-paper-soft: #43474f;
--on-paper-mute: #5c616b;
--line-on-paper: #d9dadf;
--lamp-blue: #5b8dff;
--lamp-violet: #9b8cff;
--lamp-amber: #ffb938;
--lamp-teal: #35c48d;
```

Contrast, from the Seam table: `on-ink-soft` 9.3:1 on ink · `on-paper-soft` 9.2:1 on paper · `on-ink-mute` 6.0:1 on ink and `on-paper-mute` 6.2:1 on paper, small labels only. Ink text on each lamp: blue 6.3 · violet 7.1 · amber 11.5 · teal 8.8.

**Lamp rules.** A lamp is a field, a dot, the footer stripe, or the highlight on the one thing that matters in a fragment. Text on a lamp is always ink. **A lamp is never text on paper** (it fails). A primary button is the opposite ground, never a lamp. Lamp-to-Solution is fixed in `config/solutions.ts`: blue Smart Operations · violet AI Voice Agents · amber Business Systems · teal Custom Web Apps.

`--tg-success`, `--tg-warning` and `--tg-error` are functional states (the live check, form errors), not brand hues, and are not printed here.

---

## Type

```css
--text-hero: clamp(2.75rem, 7vw, 5.5rem);
--text-display: clamp(2.25rem, 4.6vw, 3.75rem);
--text-subhead: clamp(1.75rem, 3vw, 2.5rem);
--text-title: clamp(1.375rem, 2vw, 1.75rem);
--text-body: 1.125rem;
--text-sm: 1rem;
--text-caption: 0.8125rem;
```

Three faces, each with a job, self-hosted through `next/font` in `app/layout.tsx`:

- **Archivo** (variable width), the lettering face. `h1`, `h2`, `h3` are uppercase, weight 800, width 75% (the `.lettering` class narrows to 68% for hero size), line-height 0.92–0.95. Tracking never below -0.04em.
- **Atkinson Hyperlegible Next**, body and buttons. 18px base, 1.55 line-height, sentence case.
- **Red Hat Mono**, data only: times, status, "sample data". Nothing else.

Rendered: hero 44→88px · display 36→60px · subhead 28→40px · title 22→28px · body 18px · small 16px · caption 13px. Max display size on the web is 96px. Hierarchy comes from weight and size; there are no uppercase eyebrow kickers (`.tg-eyebrow` is now a small bold label in the body face).

---

## Radius, container, spacing

```css
--radius: 0;
--radius-pill: 999px;
--radius-card: 0;
--radius-button: 0;
--container-max: 1280px;
--container-pad: 32px;
--s-1: 4px;
--s-2: 8px;
--s-3: 12px;
--s-4: 16px;
--s-5: 24px;
--s-6: 32px;
--s-7: 48px;
--s-8: 72px;
--s-9: 112px;
```

**Square corners.** Only status pills and dots are round (`rounded-full`). Depth comes from the ink/paper seam and 2px borders (`.tg-frame`), never from shadows: there are no shadows on this site. `--container-pad` drops to 24px below 768px.

---

## Motion

```css
--dur-instant: 90ms;
--dur-fast: 120ms;
--dur-base: 240ms;
--dur-state: 320ms;
--dur-entrance: 700ms;
--lamp-stagger: 60ms;
--ease-entrance: cubic-bezier(0.16, 1, 0.3, 1);
--ease-state: cubic-bezier(0.2, 0.6, 0.2, 1);
--ease-hover: cubic-bezier(0.4, 0, 0.2, 1);
```

**One moment per page.** On Home the four lamp fields rise in on load, `--lamp-stagger` apart, over `--dur-entrance`, and lift 8px on hover. Nothing else moves on its own: no scroll reveals, no view-transition morph, no status pulse. The rest is feedback on an action (press, hover, open, the concierge's thinking stripe). `prefers-reduced-motion` turns all of it off. No easing overshoots.

---

## Density

Mobile-first: the bare `:root` **is** the ≤767px value.

```css
--pad-container: 24px; /* 24 → 32 → 64px */
--pad-card: 24px; /* 24 → 24 → 32px */
--gap-group: 28px; /* 28 → 40 → 56px */
```

The declared value is the ≤767px one; the comment gives all three across ≤767 / 768 / 1024. **All three are checked**, in three separate blocks of `globals.css`.

**Section rhythm is deliberately not a token**: call sites carry it as `py-20 md:py-28` and similar. The `.tg-section` class (112px, 72px under 768px) is used only by `app/error.tsx` and `app/not-found.tsx`.

---

## Colour format

Hex throughout, no OKLCH. Converting is still an open option for wide-gamut lamps on P3 screens; it needs a side-by-side on a real screen first.
