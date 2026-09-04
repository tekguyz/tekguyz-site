# TEKGUYZ Site — STATUS

**This is the only live status document.** If you want to know what is open, read
this file and nothing else. `docs/archive/HISTORY.md` is the record of how we got
here; it is not a to-do list and it contains claims that are now false.

*Rule that produced this file: **a status line must be measurable, or it does not
go here.** On 2026-08-12 three "open blockers" were measured and found already
done. All three had been quoted back to the user as current state. Assert nothing
here you have not just measured.*

**Restructured 2026-09-01.** This file was 971 lines and roughly 70% shipped
history, including a 59-line header that was a running strikethrough log of its
own corrections. Every shipped-batch section and the 2026-08-12 incident moved
verbatim to `docs/archive/HISTORY.md` under the heading *"Moved out of
docs/STATUS.md on 2026-09-01"*. Nothing was deleted and nothing was reworded.
What remains is live state only. **Corrections belong in git history, not in the
prose of a status file** — a struck-through sentence is still a sentence a
planning tool has to read.

---

## Measured 2026-09-04 — the work lineup changed from 8 builds to 6

Every row run this session, and **re-run at the end of it** — the first version of
this table was written four commits before the session ended and its push row was
already false on arrival. The previous session's "Measured 2026-09-01" block moved
verbatim to `docs/archive/HISTORY.md` on 2026-09-04; it was never carried forward.

| | Measured 2026-09-04 | Command |
| --- | --- | --- |
| HEAD | `9a85f9d` | `git rev-parse --short HEAD` |
| Working tree | **clean** | `git status --short` |
| Tests | **101 pass, 4 files, 1.16s** | `bun run test` |
| Lint | **clean — no output, zero findings** | `bun run lint` |
| `check:design` | **40 tokens** match `docs/TOKENS.md` | `bun run check:design` |
| `check:media` | **6 entries, all posters present, ZERO off-ratio** (was 4 of 8 off) | `bun run check:media` |
| `check:claude` | **OK — 7 claim groups match** | `bun run check:claude` |
| `bun run build` | **passes.** 6 `/work/[slug]` pages + 6 OG images generated | `bun run build` |
| Typecheck | **clean, exit 0** | `bunx tsc --noEmit` |
| Push state | **PUSHED and LIVE, through `9a85f9d`.** `origin/master` == HEAD, 0 ahead. The newest Ready Production deployment is aliased to `tekguyz.com`, `www`, and `git-master`; **the live HTML serves `tekguyz-crm.vercel.app/demo`**, which only `9a85f9d`'s parent introduced, so the alias is confirmed by content and not by timestamp. Live codes: `/` 200, `/work` 200, `/work/tekguyz-crm` 200, `/work/ai-meeting-notes` 200, `/work/auto-detailer` **404** | `git status -sb` · `vercel ls` · `vercel inspect` · `curl` |

### The lineup change

**Six of the eight `/work` entries moved.** Decided by the owner this session;
the reasoning for each is recorded in `content/work.ts` beside the change.

| Slug | What happened |
| --- | --- |
| `field-photo-reports` | unchanged, case study |
| `ai-voice-receptionist` | unchanged, case study — **now 4th in the array**, behind the two new entries, per the owner's stated order |
| `ai-audio-file-insights` | **→ `ai-meeting-notes`.** Same product, one full rewrite later. New copy, new poster (`squid-ink.webp`), new slug. The old route is **removed, not redirected** |
| `tekguyz-crm` | **NEW case study**, "Lead & Pipeline CRM" |
| `bundle-builder` | **case study → project.** Its Challenge/Approach/Outcome copy was cut; `builtFor` / `summary` / `whatMadeItInteresting` are new writing |
| `meeting-organizer` | **RETIRED.** It was `crispy-bacon.netlify.app` — the predecessor of `ai-meeting-notes`, so the site was showing one product twice with the worse version as separate work |
| `restaurant-menu` | **RETIRED** at the owner's direction |
| `auto-detailer` | **RETIRED** at the owner's direction |

Result: **4 case studies + 2 projects = 6.**

### Two counts were typed into copy and both became false at once

`/work`'s page hero said "Eight live builds" and the home fold's link said "See
all eight builds". **Nothing in the build could see either go wrong** — not
`tsc`, not the linter, not `check:media`. Both now read
`buildCountWord` / `buildCountWordCapitalized`, exported from `content/work.ts`
and derived from `work.length`. **The only way to make them wrong now is to make
the array wrong.**

### One fold-board invariant bent, deliberately and namedly

`foldSlugs` is one build per solution line, and a 2026-08-29 decision made every
slot a case study. `bundle-builder` is the only build on the custom-web-apps
line and is now a project, so **the teal slot is a project card.** The
alternative was an empty teal slot, which destroys the four-accent legend the
board exists to be. Recorded at the constant in `content/work.ts`; if a second
custom-web-apps case study ever ships, that slot should take it.

### Two corrections after the lineup shipped, both from the owner

**1 · The home ink band still led with the old pair.** `featuredSlugs` was
`['field-photo-reports', 'ai-voice-receptionist']` and was never touched when
the lineup was rewritten, so the home page and `/work` disagreed about which
builds lead. It is now `['field-photo-reports', 'ai-meeting-notes']` — **the
first two of `caseStudies` in array order**, which is what a visitor sees one
click later. It also removes a third appearance of `ai-voice-receptionist` on
one page; that build is already the hero poster and the violet fold card.

**2 · The CRM copy described only half the system its own poster shows.** The
poster is the Reports view, which counts prospects that arrived through the
OUTBOUND half, and the copy named only the inbound contact form. `challenge`,
`approach`, `outcome`, `howItsBuilt` and the meta `description` now name both
directions. **The staging lane is stated rather than smoothed over:** a scraped
business is a `prospects` row and becomes a `leads` row only when a human
presses Promote after a real conversation. **"Leads flow in automatically" is
banned copy here** — it would describe something deliberately not built, and
`tekguyz-leadgen`'s own status file says nothing writes to the CRM until a
conversion signal exists. Today it is a CSV handoff a human runs.

**New: `docs/kb/leadgen.md`**, the sixth KB document. `tekguyz-leadgen` gets
**no `/work` entry, deliberately** — it is a local CLI with no UI and nothing a
visitor can open, and every `/work` entry is "open it and use it yourself". Its
unit economics are internal and unpublishable. Recorded in PLAYBOOK §7 so the
absence reads as a decision rather than an oversight.

### Open, from this change

| Item | Note |
| --- | --- |
| **The CRM poster shows seeded demo figures.** | `tekguyz-crm.webp` is the real product's real Reports view, but the tenant is `TEKGUYZ Demo` and its pipeline / revenue / win-rate numbers are **seeded verification data, not a client result.** It satisfies PLAYBOOK §12 (real production UI, not a simulator) and it licenses **no number** in copy. Recorded at the entry in `docs/COPY.md` and in `docs/kb/tekguyz-crm.md`. |
| **`docs/kb/` is new — 6 files**, measured 2026-09-04: five product documents plus `README.md`, the index. (This row said 5 while the prose above it called `leadgen.md` the sixth document; `ls docs/kb/` settles it.) | Product reference documents compiled from four other repositories, plus an index. **They are source material, not an authority** — the `CANONICAL > DESIGN > COPY > SEO` order is unchanged and this folder sits outside it. `docs/kb/field-ops.md` carries a blocking caveat: it may or may not describe the build `/work/field-photo-reports` actually links to. |
| **Retired routes have no redirects.** | `/work/ai-audio-file-insights`, `/work/meeting-organizer`, `/work/restaurant-menu`, `/work/auto-detailer` now 404. They were live on tekguyz.com. If any has inbound links worth keeping, that is a `next.config` redirect and it is not written. |

---


## Attach to the Claude.ai planning Project

**Three files, standing:** `CLAUDE.md` · `docs/STATUS.md` · `docs/TOKENS.md`.

**Per chat, pasted or attached only by the conversation that needs it:**
`docs/CANONICAL.md` (architecture or CRM-contract questions) ·
`docs/DESIGN.md` (a component's mechanism or the *why* behind a value) ·
`docs/COPY.md` (page copy — the relevant page only) ·
`docs/PLAYBOOK.md` (writing new brand-voice copy) ·
`docs/SEO.md` (JSON-LD).

The Claude.ai Project instructions themselves live at
`docs/CLAUDE-AI-PROJECT-INSTRUCTIONS.md` — the repo is the source, the Project
holds a copy. When that file changes, paste it over the Project Instructions field.

**Never attach `docs/archive/*`** — it is the record of how we got here and
contains claims that are now false, by design.

*Changed 2026-09-01, from seven standing files to three.* The seven totalled
**392 KB**, roughly 98,000 tokens, loaded into every conversation in that
Project. The three total **134 KB**. The cut is not about disk: standing
knowledge is paid for on every chat, so a file parked there must earn its place
in the *majority* of conversations. `TOKENS.md` earns it because it is small and
machine-enforced. `DESIGN.md` at 163 KB does not — it is 55% of the old bill and
is needed by a minority of briefs.


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
| **1** | **Design + motion system.** `brainstorming` → `frontend-design` → rewrite DESIGN.md → build | **Partly shipped 2026-08-12** — see `docs/archive/HISTORY.md` |
| **2** | Concierge UX/UI redo (absorbs D-04) | **Partly shipped 2026-08-12** — D-04 + panel presence motion done; see `docs/archive/HISTORY.md` |
| **3** | Copy: privacy policy, 8 detail narratives, FAQ review | ~~**Shipped 2026-08-13 except the legal review**~~ **Shipped. Closed 2026-08-29** — privacy rewrite, FAQ rewrite and all 8 detail narratives shipped 2026-08-13, and the last open item, `/privacy`'s review, was closed 2026-08-29 **as a self-review against the CCPA thresholds, not by a lawyer** — see the row in "Open — needs the user" for the assessment and its three reopen triggers. See Build Phase 3 below |
| **4** | Recaptured images land + verify (absorbs D-07, D-08) | Blocked on capture |
| **5** | Refactor — **rescoped 2026-08-13 by measurement**, see the component-audit section in `docs/archive/HISTORY.md`. Not "split the big files": re-measured 2026-09-04, `components/concierge/concierge.tsx` **787** (~~755 on 2026-08-28~~ — `3d170f7` added the role avatar and the reply-length work), `components/contact-form.tsx` **516**, `app/actions/contact.ts` **463** (~~709 / 428 / 393~~ — stale, and they never reconciled with `git show` for their own date either, which read 751/457/423). Two of the audit's dedup items shipped 2026-08-13 and **three more shipped 2026-08-14** in `a60392e`; the rest is repetition and coupling, not size | Last — five items shipped, across 2026-08-13 and 2026-08-14 |

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
| **Recapture the 16:9 hero, `sarah-poster.webp`** | **New 2026-08-13, and it supersedes the "leave it" below.** Two defects found in the existing capture while reworking the hero, neither fixable in code. (1) The **phone mockup is cut mid-sentence at y=0 of the source itself** — "…your device immediately? Anything else I can assist with?" — so it can never be shown whole at any width. (2) The bottom-right panel carries a visible **"Demo Mode" badge**, a direct PLAYBOOK §12 violation on the most prominent image on the site. The 2026-08-13 mobile crop excludes the badge; **desktop still shows it.** Wanted: 1600×900+ native 16:9, phone mockup entirely inside frame, no demo/simulator affordance anywhere in shot. **Measured 2026-08-28: the file already is 1600×900 (ratio 1.778) and `git log` shows it untouched since `c94695f` on 2026-08-13 — so the size half of "wanted" was already met when this row was written. What is open is only the two content defects.** |

## Open — code

| Item | Phase |
| --- | --- |
| **DESIGN.md §0, §2 and §3 still read in the old single voice** — the mandate, icon policy, type and layout. §4, §5, §7 and §9 were converted 2026-08-12; §2.1, §3.1, §6 and §8.0 were already converted and enforced. ~~§1's colours carry real measured ratios from the v2.3 audit but are not machine-checked — the palette is in `:root` and could join the guard~~ **The colour half CLOSED on 2026-08-28 and this row did not say so. Re-measured 2026-08-29: `## Colour` is a `TOKEN_SECTIONS` entry in `scripts/check-design.ts`, and all 14 colour tokens are asserted against `globals.css` on every `prebuild`. §1 is now enforced, so what is open here is prose voice in §0, §2 and §3 — nothing numeric.** The contrast RATIOS in §1 remain unchecked; a hex value cannot drift, a ratio claim about it can | 1 |
| **Concierge UX/UI — D-04 geometry, panel presence motion, the reply-length/routing prompt and the header role avatar are all shipped (see `docs/archive/HISTORY.md`); the rest of the redo is not scoped.** Updated 2026-08-29: `3d170f7` closed two named items off this heading. What remains is still a design question nobody has asked yet, not a known defect list. `concierge.tsx` structure is Phase 5, separately | 2 |
| **D-07 hero media bleeds through card content above 1440px — the SYMPTOM DOES NOT REPRODUCE. Re-measured 2026-08-28.** `.tg-hero-frame`'s box was intersected against every element outside the hero `<section>` at 1441 / 1600 / 1920 / 2560: **0 intersections at every width** (the one hit at 1600 is the fixed concierge launcher, which floats by design), **0 horizontal overflow**, and `object-fit: cover` crops **0.0-0.2%** because `sarah-poster.webp` is 1600x900 (1.7778) against a 1.7778 box. Containment is already there and always was: `overflow-x-clip` on the hero section since the initial commit, plus the grid row sizing to the panel. Confirmed on the **pre-2026-08-14 build** too (worktree at `a24b01e`, 1920x1080, 0 intersections), so it did not reproduce in the build the register described either. What IS real above ~1440 is what HISTORY.md:1917 already classified it as — an **asset ceiling, not code**: next/image serves the largest variant it has and that is capped by the 1600px source, so a wide or retina panel upscales. Same recapture as D-08. **No code change made: the bleed is a mandatory departure (DESIGN.md §0) and there was nothing else to fix** | 4 |
| **D-08 hero poster illegible — resolved below 1024px only, still open at desktop-narrow.** 2026-08-13 shipped `heroPosterMobile`: a 1038×584 crop of the same real capture, art-directed in via `<picture>`, legible at ~330px (DESIGN.md §4.9). **The full four-panel capture is still what desktop renders**, so any width that shows it small is unimproved. Closing this fully is still the recapture | 4 |

---

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
- **The density GAP half is CLOSED AS REJECTED, not open.** ~~It sat in "Open —
  code" until 2026-08-29 while its own text described it as measured and
  rejected — the row argued both sides in one cell, which is the exact defect
  the "partially resolved is never summarised as resolved" rule exists to
  prevent, running in reverse.~~ Moved here by the user, who pushed back on it
  being handed to the planning Project as work. **`--gap-group`'s 56px ≥1024
  step was measured against both remaining candidates and makes each worse:**
  `case-study-row`'s text column is already 205px taller than its media column
  at 1024px, its worst width, and 56px takes that to **237px**; `project-card`
  grows **19% at 1440px** for no content gained. Both files' gaps stay
  hand-picked, outside the token system. The `18/14` vs `24/24` disagreement
  between them is deliberate — two card tiers at different weights.
  **`footer-dark.tsx` and `faq-accordion.tsx` are permanently out of density
  scope**: their spacing is 44px tap-target arithmetic, not density, and
  reopening it would put the tap policy at risk to buy nothing. Reasons and the
  full measurement are in DESIGN.md §8.0, which already said in as many words
  that this "should not be recorded as an open density item."
  **Requeue only on a NEW measurement — name what changed. Re-deriving the
  numbers above is not new information.** The padding half genuinely shipped:
  `--pad-card` (24/24/32) is consumed by `project-card.tsx`, `fold-board.tsx`
  and `contact-form.tsx` (~~and `proof-strip.tsx`, deleted 2026-08-29~~), and
  `--pad-container` keeps its one consumer, `testimonial.tsx`.
- **GBP Services is not an open item** and never was a website task.
- **The testimonial is on the site** — home and `/work/[slug]`.
- **Footer location is "South Florida"** everywhere, in code and in COPY.md.
- **`bun run test` now gates the build** via `prebuild` (**101 cases across 4
  files, ~1.8s, re-measured 2026-09-01**).

## Known and accepted about this environment

- Windows animations are off (`MinAnimate = 0`), so `prefers-reduced-motion:
  reduce` matches machine-wide. **Do not emulate around it and do not change
  it.** Verify motion wiring by computed style and class count, say which half
  was proved, and leave the visual check to the user.
- Screenshots fail while the Browser pane is hidden; every text-based measurement
  still works.
- A stale dev server can hold a port and serve a previous build. Kill by port and
  confirm the referenced stylesheet returns 200 before trusting a measurement.
