# Logos

The marks and lockups for every ground. All are written by the media build tool and copied here whole. There is no other mark.

## Icon files

`icon-universal.svg`: Connected Nodes alone, `0 0 64 64`, transparent, no text. Circles r=7 in fixed order: top blue `#3B6FE0`, right violet `#7C6FE0`, bottom amber `#F2A93C`, left teal `#2FA679`. Connectors are 2px at `#7B8291`, chosen to read on light and on dark. This is the default.

`icon-mono-black.svg` and `icon-mono-white.svg`: one colour, for print and stamps.

`favicon.svg`: the browser-tab icon. Place it on a `#101010` plate, because light connectors disappear against a dark tab.

## Lockups

Icon plus the TEKGUYZ wordmark, as outlined paths (Geist 800, tracking -0.025em). No font is needed.

| File | Wordmark | Use |
| --- | --- | --- |
| `lockup-universal-ink.svg` | `#111111` | On light backgrounds |
| `lockup-universal-white.svg` | white | On dark backgrounds |
| `lockup-master.svg` | `#111111`, hairline connectors `#E5E7EB` | Light surface, the master |
| `lockup-mono-black.svg`, `lockup-mono-white.svg` | one colour | Print, stamps |

## Rules

- Every file uses fixed hex, not `currentColor`, so an `<img>` cannot re-tint it. Pick the file that matches the ground, or use the `Lockup` and `ConnectedNodes` components to get a theme-aware stroke.
- A single-ink file's ink is named in its filename.
- Never redraw or approximate the geometry. Clear space is one node diameter on every side.
- The component `ConnectedNodes` draws the UI version of the mark (r=8, 3px connectors). These files draw the master version (r=7, 2px). Do not mix the two in one layout.
