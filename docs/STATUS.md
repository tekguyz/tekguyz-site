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

Last updated: 2026-08-12.

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
| **1** | **Design + motion system.** `brainstorming` → `frontend-design` → rewrite DESIGN.md → build | Next |
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
| Design + motion system; DESIGN.md rewritten | 1 |
| **Mobile density is desktop values with one `sm:` step.** Exemplar: `testimonial.tsx` occupies ~500px at 360px wide — `py-14` both sides, 72px glyph, `mt-14`, and a `flex-wrap gap-8` attribution row that breaks to 4 stacked lines | 1 |
| Concierge UX/UI, incl. D-04 panel geometry (specified in DESIGN.md, never built) | 2 |
| Privacy page rewrite — current text omits the CRM forward, the Gemini concierge, the 90-day Upstash lead archive, and the phone field | 3 |
| 8 detail narratives → `content/work.ts`, render at `/work/[slug]` | 3 |
| FAQ review — `content/faq.ts`, 6 items, feeds the `FAQPage` JSON-LD from the same strings | 3 |
| 4 project thumbs are 600×450 (4:3) rendered at 16:10; `cover` drops ~17% | 4 |
| D-07 hero media bleeds through card content above 1440px · D-08 hero poster illegible at 360px | 4 |
| `contact-form.tsx:114` — `react-hooks/incompatible-library` on RHF `watch()`, the **only** lint warning in the repo. Mechanical fix is `useWatch`, but this is the file whose step reconciliation caused the field-contamination bug; wants its own verification pass | 5 |
| `lib/overlap-verdict.ts` + its 8 tests are now orphaned — the launcher-overlap item they were extracted for was closed by decision. Working and passing, so not deleted in a doc pass | 5 |
| `site.gbp` is a `share.google` shortlink; `COPY.md` records the resolved URL as `maps?cid=…`. Harmless drift, pick one | any |

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
