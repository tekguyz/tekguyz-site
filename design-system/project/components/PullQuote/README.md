# PullQuote

A stated outcome set large, with a 2px accent border on its left edge.

**Static rendition.** The shipped component reads its accent from the solution mapping.

## When to use

To state what a build achieved, in the project's own accent. It is the only place an accent touches anything larger than a dot or a tag.

## Anatomy

Weight 600, `-0.03em` tracking, `max-width: 22ch`, left padding `space-6`, left border 2px in the plain accent.

Two sizes: `display` on canvas contexts (the work index, detail pages), and a tighter `band` size — `clamp(1.75rem, 3.4vw, 2.75rem)` at line height 1.08 — for the home ink band, where the quote sits in a narrower column.

## Rules

- **No quotation marks.** The copy is a stated outcome, not dialogue. The testimonial is the opposite case: someone else's words, so that one does carry real quotation marks.
- The border uses the plain accent, not the `-on-bg` text variant — it is a rule, not text.
- The text itself is `tg-fg`. The accent never colours the words.
- `text-wrap: pretty`, and the 22ch measure is the reason it reads as a quote rather than a paragraph.

## What the consumer provides

The line, and the solution key that picks the accent.
