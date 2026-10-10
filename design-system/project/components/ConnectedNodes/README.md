The TEKGUYZ mark: four accent circles joined by hairline connectors, with no container.

## What the consumer provides

`size` in px (default 26) and `stroke`, the connector colour. Nothing else. The geometry is fixed: `0 0 64 64`, circles r=8, connectors 3px, top blue, right violet, bottom amber, left teal.

## Rules

- **The circles never change colour and never theme-swap.** Only the connectors are context-dependent: `tg-border-strong` on the page, `tg-border` inside `.footer-dark`, `currentColor` at 40% on an ink fill, `#4B5563` on the `#101010` favicon plate.
- **Never redraw it.** If you need a file, use the masters under `assets/Logos`. Those use the master geometry (r=7, 2px connectors), which is a slightly lighter drawing of the same mark. This component is the UI drawing.
- No outline, no container, no shadow, no tint. Minimum size 16px.
