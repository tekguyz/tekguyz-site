# Logos

Two master files, both copied verbatim from the site repository. There is no other mark.

## tekguyz-icon.svg

Connected Nodes on its own, `0 0 64 64`, no container. Circles r=7 in fixed order — top blue `#3B6FE0`, right violet `#7C6FE0`, bottom amber `#F2A93C`, left teal `#2FA679`. Connectors are 2px strokes at the light hairline `#E5E7EB`.

**The connector stroke is baked into this file at the light-theme value.** On a dark surface, re-stroke it at `#2A2A2C`; on an ink fill with no hairline token, use `currentColor` at 40%. The circles never change.

The favicon set is generated from this file onto a `#101010` plate with `#4B5563` connectors, because light hairlines vanish against a dark browser tab.

## tekguyz-lockup.svg

Icon plus wordmark on a light surface, `0 0 400 120`. The wordmark is `TEKGUYZ` in Geist at weight 800, size 40, tracking `-0.8`, in `#111111`.

**The wordmark is live `<text>`, not outlined paths** — it renders correctly only where Geist is installed. Outline it before treating this as a production master.

## Rules

- Both files use fixed hex, not `currentColor`, so an `<img>` cannot re-tint them. Pick the file that matches the surface, or render the mark inline where you need a theme-aware stroke.
- Never redraw or approximate the geometry. Clear space around the lockup is one node diameter on every side.
