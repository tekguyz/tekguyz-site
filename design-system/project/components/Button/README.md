# Button

The site's only filled control, in two variants and four sizes that are not interchangeable.

**Static rendition.** The shipped component is a React pair — `Button` for actions, `ButtonLink` for navigation — in the site repository. This card carries its measured values and its rules.

## When to use

`primary` for the one thing you want done on the page. `secondary` for the alternative beside it. A page has one primary ask; a second one directly above the closing CTA band undercuts both.

## Sizes

Four paddings for four jobs, taken literally from the design export:

| Size | Padding | Where |
| --- | --- | --- |
| `nav` | 14px 24px | the only button size in the nav bar |
| `default` | 15px 24px | hero primary, sticky-rail CTA |
| `form` | 15px 28px | Continue / Send Inquiry inside the form card |
| `large` | 18px 32px | the closing CTA only, at `button-large` |

`secondary` is 14px 24px plus a 1px border, so a primary and a secondary side by side land on the same visual height — the primary's extra 1px per side pays for the border the secondary carries.

A fifth padding exists for the concierge launcher and is deliberately not a size you can pass: it is `15px 12px`, `23px 15px` from 768px, one pixel short on every side so the outer box lands on `tap-floor`.

## Rules

- **Label style is `button`, 14.5px on a line height of 1, as one declaration.** Split into a separate leading class and tailwind-merge drops it: every button renders a 23.2px line box on a 14.5px label, 8.7px too tall.
- **No accent ever fills a button.** `primary` is `tg-cta-bg` / `tg-cta-fg`, which inverts wholesale in dark mode.
- Hover: `primary` moves to `tg-cta-hover` over `120ms`; `secondary` moves its border to `tg-border-strong` over `240ms`.
- Press: `scale(0.98)`.
- Disabled: `opacity` token `disabled`, and `cursor: not-allowed`. Opacity only — never a grey fill.
- `whitespace-nowrap`. A button label that needs two lines is the wrong label.

## What the consumer provides

The label text, the variant, the size, and — for the link form — the destination. Everything else is fixed.
