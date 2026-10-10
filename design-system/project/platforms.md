# Take it anywhere

This system is plain files, so it works wherever you can paste a colour or load a stylesheet. Pick the row for where you are working.

| Where | What to take | How |
| --- | --- | --- |
| A web page or app with React | `tokens.css`, `components/bundle.css`, `components/bundle.js` | Load them in that order after React 18. `window.TEKGUYZ` holds every component. |
| A web page with no framework | The CSS block below | Paste it, then follow the class names in each component's README. |
| Tailwind v4 | The `@theme` block below | Paste it under `@import 'tailwindcss'`. |
| Slides, docs, design tools | The palette and the font | Use the hex values in the table below and install Geist from `fonts/`. |
| Email | The palette and a system font | Geist will not load in most inboxes. Use `Geist, Arial, Helvetica, sans-serif`. |
| An AI image or video tool | The brief at the end | Paste it as the brand sheet. |
| Claude or another agent | `README.md`, then `tokens.json` | Read the README first. Take values from `tokens.json`. Never type a hex from memory. |

## The palette, for any tool

| Role | Light | Dark |
| --- | --- | --- |
| Page `tg-bg` | `#FFFFFF` | `#101010` |
| Text `tg-fg` | `#111111` | `#F5F5F5` |
| Card `tg-surface` | `#F5F5F5` | `#1A1A1C` |
| Hairline `tg-border` | `#E5E7EB` | `#2A2A2C` |
| Supporting text `tg-secondary` | `#6A717E` | `#7B8291` |
| Button fill `tg-cta-bg` | `#111111` | `#F5F5F5` |
| Button label `tg-cta-fg` | `#FFFFFF` | `#101010` |

Accents, the same in both themes: blue `#3B6FE0`, violet `#7C6FE0`, amber `#F2A93C`, teal `#2FA679`. As small text on a light ground use `#1E3F94`, `#4433A8`, `#8A5A0A`, `#1D6B4D`. Font: Geist, with Geist Mono only for a live status line.

## Plain CSS

```css
:root {
  --tg-bg: #ffffff; --tg-fg: #111111; --tg-surface: #f5f5f5;
  --tg-border: #e5e7eb; --tg-border-strong: #d1d5db; --tg-secondary: #6a717e;
  --tg-cta-bg: #111111; --tg-cta-fg: #ffffff; --tg-cta-hover: #242424;
  --tg-accent-blue: #3b6fe0; --tg-accent-violet: #7c6fe0; --tg-accent-amber: #f2a93c; --tg-accent-teal: #2fa679;
  --tg-accent-blue-on-bg: #1e3f94; --tg-accent-violet-on-bg: #4433a8; --tg-accent-amber-on-bg: #8a5a0a; --tg-accent-teal-on-bg: #1d6b4d;
  --tg-success: #10b981; --tg-error: #ef4444;
  --radius-input: 4px; --radius-tag: 6px; --radius-button: 8px; --radius-card: 12px; --radius-container: 16px;
  --dur-instant: 90ms; --dur-fast: 120ms; --dur-base: 240ms; --dur-state: 320ms; --dur-entrance: 500ms;
  --ease-entrance: cubic-bezier(0.16, 1, 0.3, 1); --ease-hover: cubic-bezier(0.4, 0, 0.2, 1); --ease-state: cubic-bezier(0.2, 0.6, 0.2, 1);
}
:root[data-theme="dark"], .dark {
  --tg-bg: #101010; --tg-fg: #f5f5f5; --tg-surface: #1a1a1c;
  --tg-border: #2a2a2c; --tg-border-strong: #3a3a3e; --tg-secondary: #7b8291;
  --tg-cta-bg: #f5f5f5; --tg-cta-fg: #101010; --tg-cta-hover: #e2e2e2;
  --tg-accent-blue-on-bg: #5380e4; --tg-accent-violet-on-bg: #8377e2; --tg-accent-amber-on-bg: #f2a93c; --tg-accent-teal-on-bg: #2fa679;
}
body { background: var(--tg-bg); color: var(--tg-fg); font: 17px/1.6 Geist, ui-sans-serif, system-ui, sans-serif; }
:focus-visible { outline: 2px solid var(--tg-fg); outline-offset: 3px; }
```

`tokens.css` is the generated, complete version of this block, with every token and `@font-face` for the files in `fonts/`. Prefer it where you can load a file. The generated file switches theme on `data-theme="dark"`; the live site uses a `dark` class on `html`. Either works with the block above.

## Tailwind v4

```css
@import 'tailwindcss';
@custom-variant dark (&:where(.dark, .dark *));
@theme inline {
  --color-bg: var(--tg-bg); --color-fg: var(--tg-fg); --color-surface: var(--tg-surface);
  --color-border: var(--tg-border); --color-border-strong: var(--tg-border-strong); --color-secondary: var(--tg-secondary);
  --color-cta-bg: var(--tg-cta-bg); --color-cta-fg: var(--tg-cta-fg); --color-cta-hover: var(--tg-cta-hover);
  --color-accent-blue: var(--tg-accent-blue); --color-accent-violet: var(--tg-accent-violet);
  --color-accent-amber: var(--tg-accent-amber); --color-accent-teal: var(--tg-accent-teal);
  --radius-input: 4px; --radius-tag: 6px; --radius-button: 8px; --radius-card: 12px; --radius-container: 16px;
  --text-hero: clamp(2.5rem, 6vw, 4.5rem); --text-display: clamp(2rem, 4.5vw, 3.5rem);
  --text-subhead: clamp(1.5rem, 3vw, 2.25rem); --text-title: clamp(1.375rem, 2vw, 1.75rem);
  --font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-mono: 'Geist Mono', ui-monospace, monospace;
}
```

Write a button's size and line height as one class, `text-[14.5px]/[1]`. The merge traps are in the Build traps section (`cascade.md`).

## React, from the bundle

```html
<link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="components/bundle.css">
<script src="https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
<script src="components/bundle.js"></script>
<script>
  const { Button, SolutionTag } = window.TEKGUYZ;
  ReactDOM.createRoot(root).render(React.createElement(Button, { size: 'large' }, 'Start a conversation'));
</script>
```

Every component prop is typed in `components/index.d.ts`. Read a component's README before using it.

## Slides, documents and design tools

- Page `#FFFFFF`, text `#111111`, cards `#F5F5F5`, rules `#E5E7EB`. Dark slides: `#101010`, text `#F5F5F5`.
- Use the accents as dots, tags and one line of colour. Never as a fill behind text or a button.
- One headline per slide, left-aligned, in Geist 700 with tight tracking. One signature stripe, at the very top or bottom, if at all.
- Put the lockup on the cover and the end. Use `lockup-universal-ink.svg` on light and `lockup-universal-white.svg` on dark.
- Do not put a rating, a price, a phone number or a made-up figure on a slide. Use `[NEEDS COPY: ...]` until the real one exists.

## An AI picture or video tool

Paste this as the brand sheet. It is the same brief the founder uses for Gemini and Flow.

```
TEKGUYZ is a small tech company in South Florida. It builds AI assistants, voice agents, business
systems and web apps for small and medium businesses. Write the name in capitals: TEKGUYZ.
Look: flat, minimal, high contrast, a lot of empty space, precise shapes.
Colours: ink #111111, dark ground #101010, white #FFFFFF, light gray panel #F5F5F5, line #E5E7EB or #2A2A2C.
Four small accents, one at a time, as a dot or a tag, never a big fill, never on a button:
blue #3B6FE0, violet #7C6FE0, amber #F2A93C, teal #2FA679. Font: Geist.
Never draw the TEKGUYZ logo. Never put words, letters or numbers inside the picture. Never show a face, a
client name, a price, a phone number or a made-up number. No gradients, glow, drop shadows, 3D, neon,
cyberpunk or terminal looks. No stock-photo look. No fifth accent colour.
Leave the top 20 percent and the bottom 20 percent of every frame empty. Words and the logo are added later.
```

Sizes the tools can make: images 16:9, 4:3, 1:1, 3:4, 9:16; video 16:9 and 9:16 only. A feed post is 4:5 (1080 x 1350): make 3:4 and crop.

## Keeping it current

- **The site's stylesheet is the source of truth for every number.** This system is a copy of it. When a token changes on the site, change `tokens.json` in the same commit.
- **The media build tool is the source of truth for every logo and picture file.** Never edit a PNG or an SVG by hand.
- The look is "Monochrome & Ink", the look the site ships today. When the site's look changes, update `tokens.json` first, then `components/bundle.css`, then the cover and the README, in that order.
