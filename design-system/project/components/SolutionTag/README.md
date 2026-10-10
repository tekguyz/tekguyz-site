A bordered pill naming a Solution, in that Solution's accent.

## What the consumer provides

`solution` (`smart-operations`, `ai-voice-agents`, `business-systems`, `custom-web-apps`). The label defaults to the Solution's name. Use `variant="card"` on a `tg-surface` card: 4px 9px padding and a 14% fill so it still reads against the card.

## Rules

- 1px border at 35% accent, 12% accent fill, `radius-tag`, text in the accent's `-on-bg` token. Amber text is 5.92:1 on white where the plain accent is 2.00:1: never use the plain accent as text.
- Inside `.ink-band` or `.footer-dark` the tag themes itself. Do not pass a colour.
- A tag names a line of work. It never decorates, and there is no fifth.
