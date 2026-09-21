# Disclosure

A row that opens to reveal an answer, with a `+` that rotates into a `×`.

**Static rendition.** The shipped component is the FAQ accordion on the conversion route; the preview's toggle is a checkbox standing in for its state.

## When to use

For questions whose answers most visitors do not need. Never to hide something the page's own claim depends on.

## Anatomy

`radius-card`, 1px `tg-border`, trigger padded to clear `tap-floor`. Question in `body-lead`, answer in `sm` / `tg-secondary`. The indicator is a `+` built from two 2px bars; the vertical bar rotates 45° on open.

The box animates by `grid-template-rows: 0fr → 1fr` over `dur-state`. The content inside rises 4px and fades in over the same duration — that 4px is the whole move; any more and the answer reads as a separate animation rather than as the box's contents settling.

## Rules

- **The closed state flips `visibility`, and that is an accessibility guarantee, not a flourish.** A `0fr` box with `overflow: hidden` is still in the accessibility tree and still tab-reachable: without the flip a screen reader reads every answer on the page while every row looks shut. Visible instantly on open, hidden on a `dur-state` delay on close.
- **The reduced-motion block must zero `transition-delay` too.** The usual reset only zeroes duration, so without it a reduced-motion visitor watches a painted answer sit in a zero-height box for 320ms.
- **The indicator rotates; it is never a swapped character.** Swapping `+` for `−` is a text change, and there is nothing to animate.
- The answer panel keeps a stable id whether open or closed — `aria-controls` must not point at an id that only exists while open, which is exactly the state a screen reader meets on page load.
- **Never hide the thing a floating element is covering.** If the launcher overlaps an open answer, the launcher moves.

## What the consumer provides

The question, the answer, and the open state.
