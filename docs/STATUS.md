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

Last updated: 2026-08-12 (Build Phase 1 shipped; Build Phase 2 partly shipped —
D-04 geometry and the concierge panel's presence motion).

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
| **2** | Concierge UX/UI redo (absorbs D-04) | **Partly shipped 2026-08-12** — D-04 + panel presence motion done; see below |
| **3** | Copy: privacy policy, 8 detail narratives, FAQ review | After 1 |
| **4** | Recaptured images land + verify (absorbs D-07, D-08) | Blocked on capture |
| **5** | Refactor: `concierge.tsx` 526 lines, `contact-form.tsx` 440, `actions/contact.ts` 423 | Last |

**Phase 1 was the real work.** DESIGN.md was assembled ad-hoc, the Claude Design
export was never fully implemented, and `frontend-design` had never been invoked
on this project. The site had exactly **one motion idea** — fade in + rise 8px —
applied everywhere. *Past tense as of 2026-08-12:* Phase 1 added the state layer
(`.tg-rule`, `.tg-collapse`, `.tg-mark`) and Phase 2 added the presence layer
(DESIGN.md §4.13). The three layers §6 names — entrance, state, feedback — plus
presence now all exist.

---

## Open — needs the user

| Item | Note |
| --- | --- |
| **Recapture 8 posters at 16:10** | 2026-08-13. 1920×1200 preferred, never upscale, WebP q82, same filenames in `public/media/`. `sarah-poster.webp` is the 16:9 hero — leave it. Then `bun run check:media`. Current, all wrong: `field-ops-thumb` 769×754 · `sarah-thumb` 1080×1059 · `shopify-configurator` 1080×1140 · `crunch-wrap-dashboard` 1080×1038 · `advantage-teams-thumb`, `meeting-organizer-thumb`, `dragonfly-nica-thumb`, `executive-detailer-thumb` all 600×450 |
| **Privacy policy — legal review** | Draft written in Phase 3 from measured data flows; review is the user's step, not a blocker on the draft |

## Open — code

| Item | Phase |
| --- | --- |
| **DESIGN.md §0–§3 still read in the old single voice** — the mandate, icon policy, colour, type and layout. §4, §5, §7 and §9 were converted 2026-08-12; §2.1, §3.1, §6 and §8.0 were already converted and enforced. §1's colours carry real measured ratios from the v2.3 audit but are not machine-checked — the palette is in `:root` and could join the guard | 1 |
| **`footer-dark.tsx` hardcodes `#747C8B` / `#9CA3AF` / `#F5F5F5` as bare hex** at 9 call sites, while `.footer-dark` in `globals.css:115` already defines `--tg-secondary` as exactly `#747C8B` and the scope sets `--tg-fg`. The file's own header comment says "never a bare hex." The old DESIGN.md §4 entry recorded this as `#6B7280` and asked for `muted-dark` "once it is set" — the colour was fixed, the mechanism never was. Measured 2026-08-12; `#6B7280` no longer appears anywhere in the repo | any |
| **`nav.tsx:104` hardcodes `240ms` in an inline `transition` string** rather than `var(--dur-base)`. It agrees with the token today by coincidence, not by reference, and `check:design` cannot see an inline style — so the token could move and the nav would silently keep the old value. Measured 2026-08-12 | any |
| **`.ink-band` sets `--tg-secondary: #9ca3af`** (`globals.css:104`), which is `muted-soft` — retired as a text colour by `TOKENS.md`, valid only for dots and the concierge indicator. Not an accessibility failure: it computes to 7.43:1 on `#111111`. It is the rule being broken silently, which is the part worth deciding rather than leaving. Measured 2026-08-12 | any |
| **`TOKENS.md`'s type section claims Geist Mono ships in three places** — "status-line timestamps, Process numerals, tag labels." Measured 2026-08-12: mono appears in exactly two, `status-line.tsx:62` (the whole line, not just the timestamp) and `concierge/markdown.tsx:73`. Process numerals and tag labels carry no mono class. Prose, so `check:design` does not catch it | any |
| Density scale adopted by `testimonial.tsx` only — but see the note below on what the density problem actually turned out to be | 1 |
| **Concierge UX/UI — D-04 geometry and panel presence motion are shipped (below); the rest of the redo is not scoped.** What remains under this heading is a design question nobody has asked yet, not a known defect list. `concierge.tsx` structure is Phase 5, separately | 2 |
| **The soft keyboard opens the moment the concierge is opened on a phone.** Reported by the user on a Pixel 9A, 2026-08-12; called "very annoying." Cause is measured, not guessed: on open, focus moves to `#concierge-input` (verified — `document.activeElement` is `concierge-input` at every viewport), and focusing a text input is what raises the keyboard. In sheet mode the keyboard then eats a large share of a panel that is already viewport-bound. **The fix is not "stop moving focus"** — DESIGN.md §8's dialog baseline requires focus to enter the panel on open, and sheet mode is `aria-modal`. It is *what* receives focus: the panel container (`tabIndex={-1}`) or the close control satisfies the baseline without putting a caret in a text field. Needs deciding, then one small change | 2 |
| **The concierge should close itself once it has captured the lead.** Reported by the user, same device pass. **This reverses a written decision and must not be implemented as a bug fix.** DESIGN.md §4.13 records, `[measured 2026-08-12 concierge.tsx:428–434,504,510]`, that at captured state "the input **stays enabled** — a captured lead may still have questions, and disabling input at the moment someone converts is exactly the wrong signal." Auto-closing is the stronger form of the same move. The user has now used it on a real phone, which is evidence the old reasoning did not have; the open questions are whether it closes on a delay or immediately, whether the conversation survives a reopen, and whether cap-reached (where the handoff *is* the action) behaves differently. Wants `brainstorming` before code | 2 |
| **`phaseTaps` in `scripts/audit-mobile.ts` never opens the concierge panel**, so the panel's own controls have never been in the site-wide `tierFail=0` number. Found 2026-08-12 by probing by hand: the three suggestion chips were 40px against a 44px tier — real, pre-existing, and invisible to the sweep. Chips fixed; **the harness blind spot is not**. A panel-open pass belongs in `phaseTaps`, probing the panel's own controls only (an open overlay legitimately covers page content, so a naive sweep with it open would report that as `overlaps`, the same false-positive the launcher already needed an exemption for) | any |
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

## Build Phase 2 — partly shipped 2026-08-12

*D-04 geometry and the panel's presence motion. The wider "concierge UX/UI redo"
is **not** closed by this — see the Open — code row.*

**D-04 geometry, built as specified and measured on the shipped build** (desktop
1440×900):

| | Spec | Measured |
| --- | --- | --- |
| Desktop panel | 420 × 640 | `420px` × `640px` |
| Viewport bound | `calc(100dvh - 48px)` | `852px` at 900 tall — and it **wins**: the list compresses 440 → 417.6 rather than the panel growing |
| Message-list floor | `flex: 1 1 440px` + `min-height: 0` | `1 1 440px`, `min-height: 0px` — not a hard min-height |

**Sheet threshold is now `(max-height: 560px)` OR `(max-width: 767px)`, and both
arms were measured separately** — the point of the pair is that neither alone is
enough:

| Case | Height arm | Width arm | Result |
| --- | --- | --- | --- |
| **844 × 390** — phone held sideways (M-03) | **true** | false | Sheet. A width-only threshold misses this entirely; this is why the height arm does not come out |
| **390 × 844** — tall portrait phone | false | **true** | Sheet. The case the height arm legitimately cannot cover |

Both engaged `aria-modal="true"`, body `overflow: hidden`, and focus inside the
panel. At 1440×900 the non-modal contract holds: **no `aria-modal`, no scroll
lock**, focus still moved to the input, Escape still closed, and focus returned
to the launcher.

**Presence motion — specified in DESIGN.md §4.13, recipe in
`components/concierge/panel-motion.ts`.** Chosen from three built options; the
desktop panel scales from `100% 100%`, which is the launcher's own corner
(`transform-origin` measured at `420px 640px`). Out is one duration step shorter
than in, on `--ease-hover`. **Phase 1 did not leave this panel motionless** — it
left it on the *entrance* recipe (`opacity` + 12px rise, hardcoded `0.24` /
`[0.16, 1, 0.3, 1]`), which is the wrong layer for a summoned surface. Phase 2
replaced it.

**`panel-motion.test.ts` is the guard that makes the mirror safe.** Motion's JS
API cannot read a CSS custom property, so the durations and easings are
literals — the exact `nav.tsx:104` trap. The test parses `app/globals.css`,
asserts every `--dur-*` / `--ease-*` it mirrors (including that `--ease-entrance`
agrees across **both** its declarations), and asserts neither easing can
overshoot. 90 → **97 tests**, and `prebuild` runs them.

**One real defect found and fixed, and it was not in the new work.** The three
suggestion chips were **40px tall against a 44px tier** — pre-existing, and
invisible to `phaseTaps`, which never opens the panel. Fixed with `tap-44`
(pseudo expansion): painted box still 40px, hit box 44px, `tierMiss` empty on
all three. The 8px `gap-2` survives it with **4px of clearance**, so it creates
none of the source-order adjacency overlaps the footer column hit at 12px.

**Verification state.** `bun run build` passes · **97 tests** · `check:design`
38 tokens · lint clean but for the known `contact-form.tsx` warning ·
`audit:mobile taps` **`tierFail=0 overlaps=0` across all 79 route × viewport ×
theme combinations** (`/work` still reports `multiline` at phone widths — the
pre-existing wrapped case-study titles, counted separately and not a tap
failure) · dark mode measured on the panel (`#101010` fill, `#2A2A2C`
border, `#F5F5F5` input text, **zero** literal-white elements) · no console
errors.

**Both device checks came back clean — confirmed by the user, Pixel 9A,
2026-08-12.** Neither was provable on this machine, and both are now closed:

1. **The motion feels right.** This machine matches `prefers-reduced-motion:
   reduce`, so only wiring was verified here (`transform: none`, duration ~0 —
   correct, and also why nothing local ever saw the scale or slide run). The
   motion-enabled path is the user's, and it passed.
2. **The sheet is correct on a real phone, portrait *and* landscape.** This is
   the `dvh` / `svh` / `vh` question that headless Chromium cannot answer — no
   collapsing URL bar, all three probe identical. **`dvh` is confirmed on
   device**; the 844×390 harness result only ever proved the threshold fired.

**Two findings came out of that same device pass, both real, neither a
regression from this work.** They are in Open — code and are *not* claimed as
fixed here.

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
