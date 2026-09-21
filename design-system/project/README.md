TEKGUYZ builds custom software systems, AI assistants and automated workflows for operational businesses. The interface says *measured*, not *performed*: hairlines instead of shadows, one motion gesture instead of five, four colours that mean something instead of decoration.

## Content fundamentals

Write in the second person, active voice, present tense. Say what a thing does before you say what it is called.

- **Never invent a metric, a statistic, a timeline, a client name or a price.** If a slot needs a fact you would have to make up, ship the visible marker `[NEEDS COPY: <slot>]` instead and say so.
- **No exclamation marks, no emoji, no hype adjectives.** "Live · checked 4 minutes ago" is the register. "Blazing fast" is not.
- **Sentence case everywhere except `eyebrow`**, which is uppercase with `0.1em` tracking and is the only uppercase on the site.
- **A partially finished thing is never described as finished.** Carry the qualifier in the same sentence, or split it into two statements.
- Numerals in a timestamp or a measurement use the `status` style, which is tabular, so the figure does not jitter as it updates.

## Colour

Four semantic pairs carry the whole interface: `tg-bg` / `tg-fg` for the page, `tg-surface` / `tg-fg` for cards, `tg-secondary` for supporting copy, `tg-border` for every edge. Set those four and a surface themes itself.

- **Body copy is `tg-fg`; supporting copy is `tg-secondary`.** `tg-muted-soft` is retired as a text colour — it is valid for mid-dot separators and the concierge thinking indicator, nothing else.
- **The four accents mean *solution line*, and nothing else.** Blue is Smart Operations, violet is AI Voice Agents, amber is Business Systems, teal is Custom Web Apps. There is no fifth accent, and an accent is never a decorative bullet.
- **No accent ever fills a button.** Primary CTAs are `tg-cta-bg` on `tg-cta-fg`, which inverts in dark mode so the primary button is the brightest element on a dark page.
- **An accent as text uses its `-on-bg` token, never the plain accent.** `tg-accent-amber` measures 2.00:1 on white; `tg-accent-amber-on-bg` measures 5.92:1. Dots and stripe segments use the plain accent and never theme-swap.
- **Status colour never carries meaning alone.** `tg-success` and `tg-error` appear as a 6px dot beside a word in `tg-fg`. Remove the colour and the sentence still reads.
- **Two surfaces stay dark in both themes** — the home ink band and the footer. They redeclare `tg-bg`, `tg-fg`, `tg-border` and `tg-secondary` at their own root, so a component inside them needs no `onInk` branch and must never name a hex.

## Type

Geist for everything. Geist Mono appears in exactly two places: the whole `StatusLine`, and the concierge's inline code span.

- **One `hero` per route, and it is the page's first headline.** Everything below a section head steps down: `display` for the section head, `subhead` for the items listed under it, `title` for a card or row.
- **Hierarchy comes from the size step, never from de-emphasising the thing you want clicked.** A claim in `title` over a link in `body` is correct; the same claim in `tg-fg` over a link in `tg-secondary` is not.
- **A button's line height must ride on its font-size declaration.** `button` is `14.5px/1` as one declaration. Split into a separate leading class, tailwind-merge drops it and every button on the site renders 8.7px too tall.
- Headings are weight 700 at `hero` and `display`, 600 at `subhead` and `title`. Tracking tightens as size grows: `-0.045em` at `hero` down to `-0.01em` at `body-lead`.

## Spacing and layout

Base unit 4px. The content grid is 12 tracks with a 24px gap, 8 tracks below 1024px, one track below 768px.

- **Section rhythm is mobile-first at the call site**: `py-20 md:py-32`, which resolves to `space-32` on desktop and `section-mobile` below 768px. There is no `--rhythm-section` custom property to look up.
- **Density is declared, not hand-picked.** Use `pad-container`, `pad-card` and `gap-group` and let them resolve per width, rather than writing a value per breakpoint.
- **A grid placement never ships as an inline style.** Give the element both a 12-track and an 8-track value, because a 12-column span left to run on the 8-track grid does not error — it creates implicit tracks and collapses the explicit ones.
- **An alternating row alternates by column, never by DOM order.** Below 768px the grid is one column, so source order *is* the layout, and it is reading order and tab order at every width.
- **The gap above a closing CTA is counted once.** A full-bleed coloured rule is already a boundary; the rhythm above it sheds half.

## Motion

One system, five durations, each with exactly one job: `90ms` press, `120ms` colour and opacity, `240ms` state, `320ms` a box changing size, `500ms` scroll reveal.

- **Nothing overshoots.** An overshoot says *performed*; every other signal here says *measured*.
- **State changes use one primitive: `tg-rule`, a 2px hairline drawn from the left.** Persistent ink means "you are here"; hover and focus draw it in `tg-border-strong`. It can be drawn partway, which is how a progress rail and a nav indicator are the same object. Do not add a second state mechanism.
- **Scroll reveals never ship `opacity: 0` in static CSS.** Content is visible by default and the hidden state is added from an effect, so a failed script leaves a readable page.
- **The reveal's rise uses `translate`, never `transform`** — hover lift owns `transform`, and sharing one property means two durations fighting over one value.
- **Banned:** parallax, gradient blobs, spinning shapes, marquees, particles, glassmorphism, cursor followers, magnetic buttons, skeleton shimmer, smooth-scroll libraries. This rejects one aesthetic — the hacker-terminal dev-portfolio look — and is not a statement that motion is suspect. Motion outside that list is wanted.
- **`prefers-reduced-motion: reduce` leaves no entrance, pulse, pin or shimmer running, and hides nothing.** A collapse must zero its `transition-delay` too, or a reduced-motion visitor watches a painted answer sit in a zero-height box.

## Borders, elevation and states

- **Elevation is flat.** Hairlines only, and hover lift comes from position. The single dated exception is the homepage fold's four build cards, which carry `tg-elevate` through `.tg-lift`. Do not widen it.
- **Hover on a row darkens the hairline to `tg-border-strong`.** Hover on a card does the same and lifts 3px.
- **A text CTA draws its underline left to right.** It draws nothing at rest, so it is only correct under something that already reads as actionable. A link that is the only actionable element on its band gets `tg-rule` at rest instead.
- **Focus is visible everywhere**: a 2px `tg-fg` outline at 3px offset. Keyboard must reach every interactive element.
- **Tap targets grow by a `::before` overlay, never by resizing the control.** The floor is `tap-floor`. Two such targets stacked closer than 44px overlap and the winner is source order, which is why the footer link gap is 22px.

## Iconography

There is one mark: **Connected Nodes** — four accent circles joined by hairline connectors, no container, on a `0 0 64 64` viewBox. Top is blue, right violet, bottom amber, left teal, always in that order. Every instance is this same geometry; never redraw an approximation.

The connector stroke is context-dependent and is passed in: the theme hairline in the nav, the dark scope's own border in the footer, `currentColor` at 40% on an ink fill. The circles never change colour.

The favicon set is dark — a `#101010` plate with `#4B5563` connectors — because a mark with light hairlines disappears on a dark browser tab.

There is no icon library. Arrows are the character `→`. The accordion indicator is a `+` rotated 45° into a `×`, never a swapped character.

## Assets

Logos live under `assets/Logos`. The lockup's wordmark is live `<text>` and depends on Geist being present where it renders — outline it before using the file as a production master.

## What this system does not carry

The site's React components are not bundled here. Each component card below is a **static rendition**: plain markup styled by this system's own tokens, faithful to the shipped values, but not the shipped component. Read the card for the rules and the measurements; read the repository for the implementation.
