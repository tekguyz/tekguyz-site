A measured, timestamped "Live" for a running build. The signature component.

## What the consumer provides

`state` (`live` or `unreachable`), `stamp` (the age of the last real check, such as "4 minutes ago"), and `variant="compact"` where the line has under 273px.

## Rules

- **It prints only a real result.** The site checks each build hourly. Never show Live for something that was not checked, and never invent a stamp.
- Geist Mono, tabular numerals so the stamp does not jitter. This is one of the only two places Geist Mono appears.
- Live splits into an ink-weight "Live" and a muted stamp. Unreachable is one muted string with no emphasis and no error colour: a timed-out check is not a failure for the visitor.
- The 6px dot pulses only while live, and stops under reduced motion. Colours are read from the scope, so it needs no on-ink variant.
