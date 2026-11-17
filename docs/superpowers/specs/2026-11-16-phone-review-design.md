# Phone review: smaller Home and /work (refs #80)

Founder's phone review, 2026-11-16. Home and /work were too big, too busy and broke on a phone. Issue #80 has the full list and the screenshots.

## Approaches

- **A. Short stack, then swipe row (picked by the founder, 2026-11-16).** The four lead builds stay stacked on /work as short cards: picture, Solution, a "Live" pill, the short name, the one-line headline, Open and Full story. The six more builds sit in a swipe row with dots on phones (grid from 640 px). About 46% shorter at 375 px.
- **B. Two swipe rows.** Both groups swipe. About 64% shorter, but three of the four lead builds hide behind a swipe. Not picked.

Founder feedback with the pick: too much copy everywhere, the project descriptions and the "Press Try the demo…" paragraph under the picture. So cards carry one line only.

## Decided

- Lineup: large = Voice, Quote to Paid, Win-Back, Cart Reminders. Small = Book Your Visit, No-Show Rescue, Missed Call Follow-Up, Field Reports, AI Meeting Notes, CRM. Home fold = the lead four in stripe order (blue Win-Back, violet Voice, amber Quote to Paid, teal Cart Reminders).
- No build twice on Home: the hero stays Missed Call Follow-Up, so "Two we're proud of" becomes Field Reports and AI Meeting Notes (the two case studies not in the fold; the CRM stays off Home). My call.
- Short names: `shortName` shows everywhere a name sits in a card, row or footer. Field Photo Reports' short name is "Field Reports".
- Cards show the build's `headline` as their one line. No new copy for cards. The summary, pull quote and Try it paragraph stay on the build's own page.
- Status: a new `pill` variant of `StatusLine`, "Live" with the green dot, never wraps. The check time is in its `title` and in screen-reader text.
- Home Solution blocks: one column on phones, title on one line, arrow beside it, hooks rewritten to 63 to 70 characters so all four run 2 lines. COPY.md updated.
- `/solutions/<slug>`: the builds use the same small card and swipe row; Examples become compact rows.
- `/solutions` is gone: 308 to `/#solutions` (the lamp fields carry `id="solutions"`). Back link, desktop nav, sitemap and breadcrumbs follow.
- Stripe: one per page, the top edge of the closing "Let's talk" block. The footer keeps it only on a page with no closing block (/contact), so every page still has exactly one.
- "Ask us" on phones: a 44 px square with the mark only; the words stay as its accessible name.
- /work hero: bottom padding 48 px on phones, and the first group head gets top room.

## Left to the builder

Exact paddings, measured at 375 px. Target: /work at 6,400 px or less.

## Follow-up (not this issue)

The build pages (`/work/<slug>`) are heavy on copy too. Trimming them is a copy rewrite across 10 pages and COPY.md, so it gets its own issue.
