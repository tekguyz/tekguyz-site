# StateRule

The state primitive: a 2px hairline that draws from the left. Every state change on the site uses this one gesture.

**Static rendition.** The shipped version is a single CSS class plus a `::after` pseudo-element.

## When to use

Whenever something needs to say "you are here", "you are hovering this", or "you are this far through". One gesture the visitor learns once is the entire argument — **do not add a second state mechanism.**

## The three positions

| State | Scale | Colour |
| --- | --- | --- |
| rest | 0 (or a partial rest value) | — |
| hover / focus-visible / drawn | 1 | `tg-border-strong` |
| persistent, "you are here" | 1 | `tg-fg` |

The bar can be drawn **partway**, which is what makes a progress rail and a nav indicator the same object rather than two mechanisms. The contact form's step rail runs 0.5 → 1.

A `tg-rule-top` variant draws the bar along the element's top edge instead, for steps that carry their hairline above the content.

## Rules

- **The persistent weight wins on specificity, never on source order.** A wayfinding or accessibility-bearing declaration must never rest on a source-order win — move either rule and it breaks silently.
- **It is `::after`, and there is no third option.** The tap-target expansion owns `::before`, and nav links carry both.
- **The scale is a custom property set on the element, not the pseudo**, so it inherits — which means an inline value beats every selector without `!important`. That is why a partial *rest* state is a class and an inline value is reserved for a rail that never hovers.
- A text CTA under an already-actionable element may use the growing underline instead. But a link that is the only actionable element on its band gets a partial rest rule, because the underline draws nothing at rest.

## What the consumer provides

The element, and its state — the drawn flag, the "you are here" flag, or an inline scale for a progress readout.
