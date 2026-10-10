Hairline question rows that open one at a time.

## What the consumer provides

`items`: `{question, answer}` pairs, and optionally `defaultOpen`.

## Rules

- One row open at a time. Arrow keys, Home and End move between rows; Tab still moves in and out of the group.
- The `+` is two bars, one rotating: never a character swap. An open row draws the `tg-rule` bar.
- Collapsed answers stay mounted and hidden from the accessibility tree, so `aria-controls` always points at a real id.
- The answer is body copy capped at 62ch.
