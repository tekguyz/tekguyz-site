# TEKGUYZ Site — STATUS

**This is the only live status document.** If you want to know what is open, read
this file and nothing else. `docs/archive/HISTORY.md` is the record of how we got
here; it is not a to-do list and it contains claims that are now false.

*Rule that produced this file: **a status line must be measurable, or it does not
go here.** On 2026-08-12 three "open blockers" were measured and found already
done — the testimonial (shipped in `components/testimonial.tsx` since the master
build), GBP Services (live in the user's GBP for months), and the footer location
drift (fixed in `COPY.md:69`). All three had been quoted back to the user as
current state. Assert nothing here you have not just measured.*

Last updated: 2026-08-12 (Build Phase 1 shipped).

**Attach these to the Claude.ai project** — seven files, this is the current set:
`CLAUDE.md` · `docs/STATUS.md` · `docs/CANONICAL.md` · `docs/DESIGN.md` ·
**`docs/TOKENS.md` (new)** · `docs/COPY.md` · `docs/PLAYBOOK.md`.
(`docs/SEO.md` only if the conversation is about JSON-LD; `docs/archive/*`
never — it is the record of how we got here and contains claims that are now
false.)

**Changed 2026-08-12: `CLAUDE.md`, `STATUS.md`, `DESIGN.md`, and `TOKENS.md` is
new.** Replace the old copies rather than adding — they will contradict.

---

## The plan

*Called **Build Phase** to disambiguate from the separate Claude.ai project's
Workflow Gates (Discovery / Blueprint / Prompt-pack) — different tool,
different numbering. A Build Phase is execution; a Workflow Gate produces the
words-shaped direction a Build Phase might start from. Aesthetic decisions
(this list's Phase 1, Phase 2) skip the Discovery gate entirely — it's
text-only and can't render an option to react to, which is the whole reason
`frontend-design` exists. Words-shaped work (Phase 3) is a legitimate fit for
Claude.ai first.*

| Build Phase | What | State |
| --- | --- | --- |
| **0** | Truth-up: archive dead docs, close decided items, wire tests, CLAUDE.md skill table | **Shipped 2026-08-12**, `1b9cec8` |
| **1** | **Design + motion system.** `brainstorming` → `frontend-design` → rewrite DESIGN.md → build | **Partly shipped 2026-08-12** — see below |
| **2** | Concierge UX/UI redo (absorbs D-04) | After 1 |
| **3** | Copy: privacy policy, 8 detail narratives, FAQ review | After 1 |
| **4** | Recaptured images land + verify (absorbs D-07, D-08) | Blocked on capture |
| **5** | Refactor: `concierge.tsx` 526 lines, `contact-form.tsx` 440, `actions/contact.ts` 423 | Last |

**Phase 1 is the real work.** DESIGN.md was assembled ad-hoc, the Claude Design
export was never fully implemented, and `frontend-design` has never been invoked
on this project. The site has exactly **one motion idea** — fade in + rise 8px —
applied everywhere (`motion` is imported in 2 files; everything else is CSS).

---

## Open — needs the user

| Item | Note |
| --- | --- |
| **Recapture 8 posters at 16:10** | 2026-08-13. 1920×1200 preferred, never upscale, WebP q82, same filenames in `public/media/`. `sarah-poster.webp` is the 16:9 hero — leave it. Then `bun run check:media`. Current, all wrong: `field-ops-thumb` 769×754 · `sarah-thumb` 1080×1059 · `shopify-configurator` 1080×1140 · `crunch-wrap-dashboard` 1080×1038 · `advantage-teams-thumb`, `meeting-organizer-thumb`, `dragonfly-nica-thumb`, `executive-detailer-thumb` all 600×450 |
| **Privacy policy — legal review** | Draft written in Phase 3 from measured data flows; review is the user's step, not a blocker on the draft |

## Open — code

| Item | Phase |
| --- | --- |
| **DESIGN.md §4 components, §5 status-line, §7 dark mode, §9 do/don't still read in the old single voice**, where a measured fact and an untested aspiration look identical on the page. §2.1, §3.1, §6 and §8.0 are converted and enforced. §1's colours carry real measured ratios from the v2.3 audit but are not machine-checked yet — the palette is in `:root` and could join the guard. **§4 alone is 60+ claims across 15 components**, each needing measurement before it can be marked, which is why this is its own piece of work | 1 |
| Density scale adopted by `testimonial.tsx` only — but see the note below on what the density problem actually turned out to be | 1 |
| Concierge UX/UI, incl. D-04 panel geometry (specified in DESIGN.md, never built) | 2 |
| Privacy page rewrite — current text omits the CRM forward, the Gemini concierge, the 90-day Upstash lead archive, and the phone field | 3 |
| 8 detail narratives → `content/work.ts`, render at `/work/[slug]` | 3 |
| FAQ review — `content/faq.ts`, 6 items, feeds the `FAQPage` JSON-LD from the same strings | 3 |
| 4 project thumbs are 600×450 (4:3) rendered at 16:10; `cover` drops ~17% | 4 |
| D-07 hero media bleeds through card content above 1440px · D-08 hero poster illegible at 360px | 4 |
| `contact-form.tsx:114` — `react-hooks/incompatible-library` on RHF `watch()`, the **only** lint warning in the repo. Mechanical fix is `useWatch`, but this is the file whose step reconciliation caused the field-contamination bug; wants its own verification pass | 5 |
| `lib/overlap-verdict.ts` + its 8 tests are now orphaned — the launcher-overlap item they were extracted for was closed by decision. Working and passing, so not deleted in a doc pass | 5 |
| `site.gbp` is a `share.google` shortlink; `COPY.md` records the resolved URL as `maps?cid=…`. Harmless drift, pick one | any |

## Build Phase 1 — shipped 2026-08-12

*All figures here were measured on the date, not estimated. Where an earlier
figure in this file was an estimate, the real number is given next to it.*

**Motion — the missing layer was *state*, not variety.** The site had an
entrance layer and a thin hover layer and nothing that animated when something
on the page *changed*: the FAQ toggled `hidden` and swapped the character `+`
for `−`, form steps swapped silently, the theme toggle was instant. (Press was
already correct — `active:scale-[0.98]` in `button.tsx` — an earlier claim that
it was missing was wrong.)

- **One primitive, `.tg-rule`** — a 2px hairline drawn from the left, widened
  out of the nav's own active-page indicator rather than invented. Now on nav
  links, `solution-row`, `faq-accordion` rows, and the contact form's step rail.
- **Accordion** animates: `.tg-collapse` 0fr→1fr with a `visibility` flip that
  keeps collapsed answers out of the accessibility tree, and `.tg-mark`, two
  bars rotating, replacing the character swap.
- **Contact form** — the step header's existing hairline *is* the progress rail,
  0.5 → 1 via `--tg-rule-scale`. Nothing touches the step branches' `key`s.
- **Theme toggle** — the SVG holding both glyphs rotates 90°.
- **Tokens** — 5 durations, 3 easings. **No easing on this site overshoots**;
  that was chosen against a spring, built side by side, and rejected because an
  overshoot reads as *performed* on a site whose every other signal says
  *measured*.

**Density — the exemplar was the small half of the problem.**

| | Before | After |
| --- | --- | --- |
| `testimonial.tsx` at 360px | **798.7px** (this file said "~500px" — the estimate was 60% low) | **561px** |
| Section rhythm at 360px | 128px, every section, every route | 80px |
| `/contact` top/bottom at 360px | 96px / 128px | 64px / 80px |

**§3 has specified "128px desktop, 80px mobile" since v2.2 and the mobile half
was never built.** All 14 call sites shipped the desktop value at every width;
home spent ~416px of a 360px viewport on padding the document already said
should not be there. Fixed mobile-first at the call sites (`py-20 md:py-32`),
not behind a token — see DESIGN.md §8.0 for the three reasons. The
`closing-cta` boundary invariant was **re-measured, not assumed**: 40px at
360px, 64px at 1440px, unchanged.

**Tooling — two things that were silently broken.**

- **`scripts/audit-mobile.ts` has never run in this repo under Bun.**
  `playwright-core` + Bun on Windows fails on both transports. Measured
  2026-08-12: the browser binary is fine, CDP over TCP is fine, disabling the
  sandbox changes nothing, and the identical script under Node works first try.
  The script's own header said "NOT under Bun" and there was no `package.json`
  entry, so the wrong invocation was the easy one. **Now `bun run audit:mobile`,
  which shells to Node.**
- **`bun run check:design` is new and gates `prebuild`.** 24 tokens across
  §2.1, §3.1, §6.1 and §8.0 are asserted against `app/globals.css`; a mismatch
  fails the build and names the token and both values. Verified by injecting
  drift into four different tokens and confirming each was caught.

**Verification state.** `bun run build` passes · 90 tests pass · lint clean
except the one known `contact-form.tsx` warning · **`audit:mobile taps` clean
site-wide: `tierFail=0 overlaps=0` on every route, every breakpoint, both
themes** · no console errors · both themes measured.

**Not proved, and the user's to check:** whether the motion *feels* right. This
machine matches `prefers-reduced-motion: reduce`, so only wiring was verified —
computed styles, pseudo-elements, transforms, both themes. The accordion's open
state resolves to a real 140.8px grid row and the step rail to `matrix(0.5,…)`,
but nothing here saw an animation run.

**Observed, pre-existing, not a regression:** `/work` reports `multiline=2` at
narrow widths — two case-study titles (`h3 > a.tap-44`) wrap to two lines.
`tierFail` and `overlaps` are both 0, so no tap actually fails.

## Open — post-launch, deliberately

Hero video loop (needs a new recording) · live iframe embeds (needs `frame-ancestors`
CSP per demo app) · Cal.com (deferred until real inbound is measured) · Terms of
Service (no checkout or accounts to need one) · `/privacy` ships zero scroll
reveals (arguably correct) · `lockup-master.svg` wordmark is still a `<text>`
element (matters only if the SVG goes to an external vendor).

---

## Decided 2026-08-12 — do not reopen

- **Transient launcher overlap of a secondary link is NOT a defect.** The 44
  pairs above 25% coverage are closed, unfixed, by decision. Primary-CTA
  overlaps remain 0 and that is the criterion that stands. This consumed six
  commits; it is over.
- **The concierge disclaimer is deleted**, not replaced. `A starting sketch, not
  a quote.` is gone from the panel, and the bordered footer strip now unmounts
  entirely at cap-reached rather than shipping an empty 33px rule.
- **Modals/sheets are accepted.** The concierge sheet is `aria-modal` with a
  focus trap below `(max-height: 560px)`, and the nav drawer exists. CLAUDE.md's
  "no modals or popups anywhere" described an intent the code never matched.
- **GBP Services is not an open item** and never was a website task.
- **The testimonial is on the site** — home and `/work/[slug]`.
- **Footer location is "South Florida"** everywhere, in code and in COPY.md.
- **`bun run test` now gates the build** via `prebuild` (73 cases, ~0.7s).

## Known and accepted about this environment

- Windows animations are off (`MinAnimate = 0`), so `prefers-reduced-motion:
  reduce` matches machine-wide. **Do not emulate around it and do not change
  it.** Verify motion wiring by computed style and class count, say which half
  was proved, and leave the visual check to the user.
- Screenshots fail while the Browser pane is hidden; every text-based measurement
  still works.
- A stale dev server can hold a port and serve a previous build. Kill by port and
  confirm the referenced stylesheet returns 200 before trusting a measurement.
