# SolutionTag

A bordered accent pill that names which solution line a thing belongs to — the site's primary wayfinding device.

**Static rendition.** The shipped component reads its accent from one mapping file; nothing hardcodes an accent per component or per page.

## When to use

On a card, a row or a detail-page meta rail, to say which of the four lines a build belongs to. Never as decoration, and never to mean anything other than the line.

## Anatomy

- Border 1px in the accent at the `tag-border` alpha
- Background the accent at the `tag-fill` alpha
- Radius `radius-tag`
- Padding 5px 10px (`default`) or 4px 9px (`card`)
- Label in `eyebrow`: 12px, weight 700, `0.1em` tracking, uppercase

The `card` variant is tighter and runs its fill at 0.14 so the pill still reads against `tg-surface` rather than the page canvas.

## Rules

- **The label colour is the accent's `-on-bg` token, never the plain accent.** That is what keeps amber legible — 5.92:1 instead of 2.00:1 on white.
- **On a surface that is dark in both themes**, pass the fixed dark text value instead, because a theme-aware token resolves to the light value whenever the site itself is in light mode.
- **Four lines, four accents, no fifth.** Blue is Smart Operations, violet is AI Voice Agents, amber is Business Systems, teal is Custom Web Apps.
- The companion `AccentDot` is a filled circle in the plain accent at `radius: full`. Dots never theme-swap.

## What the consumer provides

The solution key and the label text. The accent, the alphas and the type are all fixed by the system.
