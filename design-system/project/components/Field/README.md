A labelled input, select or textarea.

## What the consumer provides

`label`, `as` (`input`, `select`, `textarea`), `type`, `options` for a select, and optionally `hint`, `error`, `optional`.

## Rules

- The label is an `eyebrow`. The control is 44px tall, `radius-input`, a 1px hairline, and 16px text so iOS does not zoom.
- **An error is a 6px `tg-error` dot beside a sentence in `tg-fg`.** `tg-error` on white is 3.76:1, so it is never used as text.
- Focus keeps the global 2px `tg-fg` ring. The site's own form relies on a border-colour change alone, about 1.5:1; this system does not copy that.
