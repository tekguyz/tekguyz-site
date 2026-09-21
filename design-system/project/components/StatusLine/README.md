# StatusLine

The signature component: a live-check readout that replaces a decorative "LIVE" badge everywhere.

**Static rendition.** The shipped component runs a real reachability check and re-renders once after hydration.

## When to use

Anywhere the site claims a build is live. It is the claim and the evidence in one line, which is the point — a badge asserts, this reports.

## Anatomy

Dot + text, gap `space-2`, style `status` (Geist Mono, 14px / 1.55, `0.04em` tracking, tabular numerals), dot 6px.

**The two states are structured differently on purpose:**

- **Verified** splits into an ink-weighted "Live" plus a muted timestamp.
- **Unreachable** is a single muted string with no emphasis and no error colour. A `HEAD` request timing out is not a failure state for the visitor.

`compact` steps the size down to `caption` and drops the word "checked", for cards that give the line under 220px. Its unreachable string drops the timestamp entirely — the age of a failed check is not information a scanning visitor can use.

## Rules

- **The timestamp renders absolute on the server and relative only after hydration.** The server stamp is built from UTC parts — never a locale or timezone formatter, which is the same mismatch one layer down.
- **Colours are read from the scope, never re-derived.** A surface that stays dark in both themes redeclares `tg-fg` and `tg-secondary` at its own root, so this component needs no dark branch and must never name a hex.
- The live dot pulses at `1600ms`, and that pulse stops under `prefers-reduced-motion`.
- Numerals are tabular so the figure does not jitter as it updates.

## What the consumer provides

The check result — reachable or not, and when it was last checked — plus the variant.
