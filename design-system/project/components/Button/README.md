The site's only filled control, in two variants and four sizes that are not interchangeable.

## What the consumer provides

The label, `variant` (`primary` or `secondary`), `size` (`nav`, `default`, `form`, `large`), and `href` if it navigates. With `href` it renders a link, without it a `button`.

## Sizes

| Size | Padding | Where |
| --- | --- | --- |
| `nav` | 14px 24px | the nav bar, and a secondary beside a primary |
| `default` | 15px 24px | hero primary |
| `form` | 15px 28px | Continue and Send inside the form card |
| `large` | 18px 32px, 16px label | the closing call to action only |

## Rules

- **No accent ever fills a button.** Primary is `tg-cta-bg` on `tg-cta-fg` and inverts in dark mode, so it is the brightest thing on a dark page.
- A page has one primary ask. Secondary is the alternative beside it.
- Label is `button`, 14.5px on a line height of 1, in one declaration. In Tailwind, write it `text-[14.5px]/[1]` so a merge cannot drop the leading.
- Hover: primary moves to `tg-cta-hover` over `dur-fast`; secondary moves its border to `tg-border-strong` over `dur-base`. Press: `scale(0.98)`. Disabled: opacity token `disabled` and `cursor: not-allowed`, never a grey fill.
- Labels never wrap. A label that needs two lines is the wrong label.
