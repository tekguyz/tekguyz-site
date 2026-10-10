# Motion

The interface should feel measured. Everything moves for one reason, once, and settles. Nothing overshoots, because an overshoot says *performed*.

## Durations: each has exactly one job

| Token | Value | Job |
| --- | --- | --- |
| `dur-instant` | 90ms | Press and focus feedback |
| `dur-fast` | 120ms | Colour and opacity only |
| `dur-base` | 240ms | A state drawing or shifting: the rule bar, a hover lift, a 4px arrow shift, a rotating plus |
| `dur-state` | 320ms | A box changing size: an accordion, a step |
| `dur-entrance` | 500ms | Scroll reveal, once per element |
| `dur-page` | 320ms | A view transition between routes |

A value that cannot be given a job does not belong in this list.

## Easings

| Token | Value | Use |
| --- | --- | --- |
| `ease-entrance` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveals and route transitions |
| `ease-hover` | `cubic-bezier(0.4, 0, 0.2, 1)` | Hover and colour |
| `ease-state` | `cubic-bezier(0.2, 0.6, 0.2, 1)` | Rule draws, collapses, rotations |

## The one state gesture: `tg-rule`

A 2px hairline that draws from the left, from `scaleX(0)` to `scaleX(1)` over `dur-base` on `ease-state`. It is the nav's current page, a row under the pointer, an open FAQ answer and a step reached in a form. Learn it once, read it everywhere.

- **Hover or focus:** `tg-border-strong`. Transient: *this is a thing*.
- **Current or open:** `tg-fg`. Persistent: *you are here*.
- It can be drawn partway, which is how a progress rail is the same object. Do not add a second state mechanism.

```css
.tg-rule { position: relative; }
.tg-rule::after {
  content: ''; position: absolute; inset: auto 0 -1px 0; height: 2px; background: var(--tg-border-strong);
  transform: scaleX(var(--tg-rule-scale, 0)); transform-origin: left center;
  transition: transform var(--dur-base) var(--ease-state);
}
.tg-rule:hover, .tg-rule:focus-visible { --tg-rule-scale: 1; }
.tg-rule[data-on="true"] { --tg-rule-scale: 1; }
.tg-rule[data-on="true"]::after { background: var(--tg-fg); }
```

## Other moves

- **Hover lift:** a card rises 3px with `transform`, over `dur-base` on `ease-hover`, and its hairline darkens. A row shifts 4px right instead.
- **Scroll reveal:** rises 16px and fades in with `translate`, never `transform`, because hover lift owns `transform`. **Content is visible by default.** The hidden state is added from a script, so a failed script leaves a readable page.
- **Collapse:** `grid-template-rows` from `0fr` to `1fr`. The inner box flips `visibility` on a delay when it closes so the text stays painted while shrinking, and hides from screen readers when shut.
- **The status pulse:** opacity 1 to 0.4 over 1600ms, only while a check says live.
- **The thinking indicator:** four discrete segments in the accent order flash in turn. Never a blended gradient. It is the only moving use of the four colours.
- **Theme toggle:** the glyph turns 90 degrees. The page colours do not transition.

## Banned

Parallax, gradient blobs, spinning shapes, marquees, particles, glassmorphism, cursor followers, magnetic buttons, skeleton shimmer, smooth-scroll libraries. This rejects one aesthetic, the hacker-terminal dev-portfolio look. It does not say motion is suspect: motion outside this list is wanted.

## Reduced motion

`prefers-reduced-motion: reduce` leaves no entrance, pulse, pin or shimmer running, and **hides nothing**. A collapse zeroes its transition delay too, or a reduced-motion visitor watches a painted answer sit in a zero-height box. Check motion by computed style, because some systems report reduce by default.
