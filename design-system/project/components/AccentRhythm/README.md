# AccentRhythm

The two places the four accents appear together, as pure rhythm rather than wayfinding: the signature stripe and the flourish mark.

**Static rendition.** Two small shipped components, shown side by side because their rules are the same rules.

## SignatureStripe

A full-bleed four-segment bar, 6px tall, a 4-column grid, in the fixed blue → violet → amber → teal order.

**Exactly three per page, and nowhere else:** the top of the hero, above the closing CTA, and the bottom of the footer.

The nav header carries **no border of its own** — an unqualified bottom border resolves to `currentColor` and paints a permanent ink or white line onto the stripe. The one specified hairline lives on the nav's own fill layer so it can fade in with the scrolled state.

## FlourishMark

Four dots, 9px each with a 9px gap, in the same fixed order.

**Every route, once per page.** Not home only. The closing-CTA echo replays the load-sequence timing and gets no second set of dots — the *once per page* half is absolute.

## Rules

- **Fixed order, always: blue, violet, amber, teal.** Both of these are rhythm, not wayfinding, so neither takes a solution key.
- **Plain accents, never the `-on-bg` text variants.** These are fills, not text, and they never theme-swap.
- Both are decorative and hidden from assistive technology.
- Never use either as a decorative bullet. `/contact`'s trust facts and the closing CTA render their three facts as one muted line with 3px `tg-muted-soft` mid-dots, and no colour.

## What the consumer provides

Nothing. Both are fixed.
