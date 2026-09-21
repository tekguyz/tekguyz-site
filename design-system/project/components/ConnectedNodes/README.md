# ConnectedNodes

The brand mark: four accent circles joined by hairline connectors, no container.

**Static rendition.** The shipped component is the same SVG geometry as an inline React element; the master file is `assets/Logos/tekguyz-icon.svg`.

## When to use

The nav lockup, the footer, the concierge launcher, and the favicon set. Nothing else needs a mark.

## Geometry

ViewBox `0 0 64 64`. Circles at 12/32, 32/12, 52/32, 32/52, radius 8 in the component and 7 in the master file. Connectors are straight lines at stroke-width 3 (2 in the master file).

**Colour order is fixed: top blue, right violet, bottom amber, left teal.** Every instance is this same geometry — never a redrawn approximation.

## Rules

- **The circles never change colour, in any theme or on any surface.**
- **The connector stroke is context-dependent and is passed in**: the theme hairline in the nav, the dark scope's own border in the footer, `currentColor` at 40% on an ink fill where there is no hairline token to read.
- **The favicon set is dark** — a `#101010` plate with `#4B5563` connectors — because a mark with light hairlines disappears against a dark browser tab. The root icon carries the plate too, or the tab icon differs by browser.
- The wordmark lockup sets `TEKGUYZ` in Geist at weight 800, `-0.8` tracking, in `tg-ink`. Outline the type before using the master lockup as a production file — it currently depends on Geist being installed where it renders.

## What the consumer provides

The rendered size, and the connector stroke for the surface it sits on.
