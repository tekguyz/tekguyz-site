A compact build card: tag, headline, one description, status line, a link.

## What the consumer provides

`solution`, `tag`, `headline`, `summary`, `state` and `stamp`.

## Rules

- **No image, ever.** The weight gap between this and a case-study row is deliberate signal about the depth of the build.
- Surface fill, 1px hairline, `radius-card`, `pad-card` padding. Hover lifts 3px and darkens the hairline; it never gets a shadow.
- The whole card is the link, so "Read the full story →" is a span, never a nested anchor.
- Copy comes from the build's own page. Never rewrite it to fit the card.
