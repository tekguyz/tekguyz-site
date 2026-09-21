# ProjectCard

The compact tier of the work index: tag, title, one description, status line, and a text CTA.

**Static rendition.** The shipped component is one `<a>` wrapping the whole card.

## When to use

For a build on the index that gets a short entry. The deeper tier is a full-width case-study row; the size and weight gap between the two is deliberate signal about the depth of the build.

## Anatomy

`tg-surface` fill, 1px `tg-border`, `radius-card`, padding `pad-card`.

Tag (`card` variant) → title in `title` → summary in `sm`, `tg-secondary` → `StatusLine` → the text CTA.

## Rules

- **No image, ever.** The weight gap from the case-study row is the signal, and an image erases it. A project's own detail page does carry the screenshot; this tier does not.
- **Hover lifts 3px and darkens the hairline to `tg-border-strong`.** Position, never shadow.
- **The whole card is one link, so the "Read the full story →" affordance is a span, not a nested anchor.** An anchor inside an anchor splits one card into two tab stops. Its underline is driven by the card's own hover and focus.
- **One action per card.** Not a second "open the live demo" link — the demo is one click further in, on the detail page, which carries the frame, the status line and the demo link together.
- Text wrapping is `pretty` on the title and the summary.

## What the consumer provides

The entry (tag, headline, summary, destination), the live-check result, and its index in the grid for the 80ms reveal stagger.
