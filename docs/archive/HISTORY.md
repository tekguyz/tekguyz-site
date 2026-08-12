# TEKGUYZ Website — Build History (ARCHIVE)

> **ARCHIVE. Do not read current state from this file.** It was `docs/PROGRESS.md`
> until 2026-08-12, when it was split: open items moved to **`docs/STATUS.md`**,
> which is now the only live status document. What remains here is the record of
> how each decision was reached — incidents, mechanisms, and the reasoning behind
> the hard rules in CLAUDE.md. That part is still valuable and is why the file is
> kept.
>
> **It contains claims that are false.** The blocker table and the Known Gaps
> table asserted state instead of measuring it, and on 2026-08-12 three of those
> assertions were measured and found already resolved — the testimonial (shipped
> in `components/testimonial.tsx` since the master build), GBP Services (live for
> months), and the footer location drift (fixed in `COPY.md:69`). All three had
> been repeated back to the user as current blockers. The same file was wrong
> twice about the mobile queue and once about the Vercel topology.
>
> **Read this file for *why*. Read `docs/STATUS.md` for *what*.**

---

## Phase status

Mapped to the TEKGUYZ Engineering workspace's Phase 1/2/3 framework:

- **Phase 1 (Discovery) & Phase 2 (Blueprint):** complete. `CANONICAL.md` is the PRD and technical roadmap — unusually thorough, which is why Phase 3 looks different from the framework's default.
- **Phase 3 (Prompt execution):** **the six build prompts finished 2026-08-07** — the master build, the design-export audit, and four fix passes (3, 4, 5, 6), the last three of which were the planned three-prompt fix pack. That is what those six reached; **it is not the same as "nothing left to fix"**, and this line said so for several prompts while the lines below it said the opposite. Prompt 7's audit opened a code queue that did not exist on 2026-08-07, and prompts 8–15 have been working it. Current state is the rest of this list plus Known Gaps — **not** "everything remaining is content or operations".
- **Prompt 7 (2026-08-08) was an audit, not a build step, and changed no code.** It found **19 measured mobile findings, 3 of them blocking**, which means there is now a code task queued that did not exist on 2026-08-07 — a fix prompt written from `docs/MOBILE-AUDIT.md`. "Code complete" above describes the state the six build prompts reached; it is no longer the same as "nothing left to fix".
- **Prompt 8 (2026-08-08) shipped fix batch A** — the 768–1023px band. H-1 was confirmed by diagnostic first, then the diagnostic reverted and DESIGN.md §8's 8-column layout implemented. Of the 19 findings, **7 are now resolved** (M-01, M-02, M-17, M-18, and the band rows of M-04, M-07, M-08). The remaining batches — tap targets, the concierge, and the sub-767 rows — are still queued.
- **Prompt 10 (2026-08-09) shipped the concierge fix** — M-03, M-06, M-14, M-15, M-19. **No `blocking` finding remains open.** 12 of 19 findings are now resolved. One pass is left: tap targets and the sub-767 wrap rows (M-05's sub-767 rows, M-09 – M-13, M-04's sub-767 row).
- **Prompt 11 (2026-08-09) shipped the tap-target and sub-767 pass** — M-04's and M-05's sub-767 rows, M-09 – M-13. It claimed **all 19 mobile findings resolved** and the queue closed; **that claim was false and is corrected in Known Gaps (2026-08-10)** — the real split is **16 resolved · 1 partial (M-16) · 2 open (M-07, M-08 at sub-767)**. What the pass itself did is accurate as described: tier failures **2,739 → 0** with **0 overlapping hit areas** and **no painted box resized**. `docs/MOBILE-AUDIT.md`'s banner carries the per-finding after-numbers.
- **Prompt 12 (2026-08-10) fixed the React #418 hydration mismatch in `StatusLine`** — the one non-mobile defect Prompt 7 surfaced and quarantined. Server renders an absolute `at HH:MM UTC` stamp, the client swaps to the relative string post-hydration. **No known console error remains on any route.**
- **Prompt 13 (2026-08-10) closed the mobile queue and six D- items** — M-07 and M-08 at sub-767 (the last two open findings), plus D-01, D-02, D-03, D-05, D-06, D-10. The audit split is now **18 resolved · 1 partial (M-16, still partial)**. D-10 turned out to be a `tailwind-merge` bug affecting **every button on the site**, not a nav-only sizing error — see the section below.

- **Prompt 14 (2026-08-10) closed the three specification gaps** — D-09, D-11, D-12, each written into DESIGN.md (now v2.5) before it was implemented. The D- register is **9 shipped · 3 deferred**; the three left are D-04 (specified, not yet built) and D-07/D-08, which need new captures rather than code.
- **Prompt 15 (2026-08-11) reworked contact-action dispatch** — not a Known-Gaps item, a contract change: the CRM upserts by email and takes 2–5s, both confirmed against source and the live DB. The action now returns in **246–683ms measured** (was 3–4s) via `after()`, records every post-response failure to a log marker plus Upstash, and stops the CRM+notification write path from accepting page boilerplate as a lead's name or message. See the section below.

**What actually blocks launch** (none of it a code task):

| Blocker | Owner |
| --- | --- |
| **Privacy policy** — concierge data flow, CRM forwarding, phone field all undisclosed | Legal review. Flagged twice; this is the last content blocker |
| **Compact-context image recapture** — all 8 posters are off 16:10, one is a simulator crop (PLAYBOOK §12 violation) | User, in flight. Drop-in, no code change; re-run `bun run check:media` |
| ~~**Domain cutover** — still a Vercel preview~~ **Measured 2026-08-08: `https://tekguyz.com` is serving this build.** Production parity spot-check at 360×800 and 390×844 — header height, nav CTA, `closing-cta` button, concierge launcher rect, `scrollWidth`/`clientWidth`, `<title>` and `h1` — **every measured value identical to local**; the only difference is the chunk hash (`/_next/static/immutable/chunks/1nsnopzbdaany.css` vs local `/_next/static/chunks/2jhuu8e85udez.css`), i.e. a Vercel build of the same source. CRM CORS is still hard-locked to `https://tekguyz.com` | **Cutover confirmed done, and the topology behind it corrected 2026-08-09 against the Vercel API** — one project (`tekguyz-site`) holding both `tekguyz.com` and `www.tekguyz.com`; `tekguyz-website` does not exist; **every push to `master` deploys to production.** See the Deploy section below for how that error propagated. Still flag before changing the domain or the CORS origin; it fails closed and silent |
| GBP Services section | Not a website task; highest-leverage open SEO item |

**Why this wasn't a 6–12 prompt pack:** the default range assumes a Phase-2 blueprint that leaves real gaps for each prompt to resolve. This one didn't — five documents (CANONICAL, DESIGN, COPY, SEO, PLAYBOOK) resolved hundreds of decisions before any prompt ran, which let the master prompt absorb work (Gemini swap, rate limiter, full SEO, confirmation email) that would normally be separate steps. Six build/fix prompts against a predicted 4–5, plus Prompt 7, which is an audit and changed no code. The overshoot was the fix passes, and the recurring cause is worth naming: **four of five items in Prompt 4, two of eight in Prompt 5, and one of nine in Prompt 6 were misdiagnosed in their brief** — the symptom was real, the stated cause wasn't. Budget for diagnosis, not just repair. **Prompt 7 was structured specifically to stop feeding that loop**: it measures and reports symptoms, and quarantines every cause it might have guessed at into a labelled hypotheses section.

## Prompt history

| # | Prompt | Status | Notes |
| --- | --- | --- | --- |
| 1 | Master build prompt | **Complete** (2026-08-05) | Full site built from an empty repo. All 18 routes, every component in DESIGN.md §4, `content/work.ts` + `content/solutions.ts` + `config/solutions.ts`, contact action (honeypot renamed, phone/website added, confirmation email), concierge ported to Gemini 3.6 Flash, shared durable rate limiter, full SEO + JSON-LD + per-route OG images, generated favicon set, dark mode. `bun run build` clean, 18/18 routes prerendered. |
| 2 | Design-export audit + live integration verification | **Complete** (2026-08-06) | Full route-by-route rebuild against the approved `TEKGUYZ Site.dc.html` / `TEKGUYZ Components.dc.html` export, which is now the visual ground truth. Every integration exercised for real against live credentials. Playwright added as the screenshot/verification driver. |
| 3 | Three scoped fixes: optional-field validation, concierge tone, scroll reveals | **Shipped** (2026-08-06) — `f9ba587` | `lib/validation.ts` shared by client and server schemas; concierge system prompt rewritten to drop the template labels and raw paths; reveals reinstated on IntersectionObserver, visible-by-default. |
| 4 | Fix pass 1 of 3 — shared components: LiveFrame asset wiring, nav/stripe collision, `/contact` landing position, motion audit, contact-form field contamination | **Shipped** (2026-08-07) — `6345f21` | Four of five were misdiagnosed in the brief and turned out to be different bugs than described — see the section below for each actual cause. Item 1 needed no code fix (the "placeholder" is the asset file); it gained a `prebuild` wiring guard and a flagged naming decision. Motion had three separate causes, one of them the machine's own reduced-motion setting. |
| 5 | Fix pass 2 of 3 — project detail-page layout, `/process` pin, duplicate CTA, single root elements, lint, reveal coverage, Sarah filename | **Shipped** (2026-08-07) — `513329e` | Six of eight as briefed. The `/process` pin was **already built**, not missing — but its progress readout ran a step and a half ahead of the content, and its reduced-motion degradation depended on Tailwind's utility sort order. Lint had no config file at all. See the section below. |
| 6 | Fix pass 3 of 3 — nav CTA size, home Process teaser, `/contact` trust dots, `flourish-mark` doc, validation tests, phone typing cap, `aria-describedby`, dark favicon, success copy | **Shipped** (2026-08-07) — `8a17326`, plus `2713070` for the CLAUDE.md compression | Eight of nine were real. **Item 1 was not**: the nav CTA already rendered at the standard size — measured 14/24px, 14.5px — so nothing was changed. Item 6's stated fix ("cap at 15 characters") would have reproduced the very bug it was written to avoid; implemented as a 15-**digit** cap instead. Item 5's "25 unit cases pass" claim had no test file behind it at all. See the section below. |
| 7 | Mobile & motion audit — **measure only, no fixes** | **Complete** (2026-08-08) | **Zero code changed.** Deliverables are `docs/MOBILE-AUDIT.md` and the re-runnable harness `scripts/audit-mobile.ts`. 18 routes × 7 mobile viewports light + 2 dark = **162 rows, 0 errors**. **19 findings: 3 blocking, 14 defect, 2 polish.** The pass reports causes nowhere — every inference is quarantined in a `Hypotheses (unverified)` section, deliberately, because 7 of 22 items across passes 4–6 inherited a wrong cause from their brief. First pass able to measure the motion-enabled path locally (Playwright context override). See the section below. |
| 8 | Fix batch A — the 768–1023px layout band | **Shipped** (2026-08-08) — `681808e` | **H-1 confirmed by diagnostic before anything shipped**, then the diagnostic reverted and the layout DESIGN.md §8 actually specifies implemented instead. `.tg-grid` children carried 12-column placements into an 8-track grid, manufacturing 4 implicit tracks. Grid at 768 is now **8 explicit tracks, 0 implicit**. M-01 resolved on all 11 routes, M-02, M-18 and M-17 resolved, M-04's and M-07/M-08's band rows resolved. See the section below. |
| 9 | **No such prompt shipped** — re-scoping only, no commit of its own | **No code, no commit** (2026-08-09) | Recorded so the gap in this table is not read as a lost session. **Measured 2026-08-11: there is no commit between Prompt 8's `681808e` / `c5fbddc` and Prompt 10's `9a58fc1`.** Its one surviving artifact is the rewrite of the mobile Known Gap row that **retired the batch letters** — the remaining passes are named by subsystem instead, because two incompatible letterings existed for the same work and made a prompt title ambiguous about which subsystem it edited. Even that text landed inside Prompt 10's commit rather than one of its own, which is why nothing here carries a hash. Referenced in the Prompt 8 documentation table below. |
| 10 | Concierge fix — M-03 (blocking), M-06, M-14, M-15, M-19 + the CLAUDE.md copy-gap rule | **Shipped** (2026-08-09) — `9a58fc1` | The last `blocking` finding closed. Panel bound to `calc(100dvh - 48px)` with a `(max-height: 560px)` full-screen sheet; the launcher **yields** to the two `data-primary-cta` elements rather than shrinking; close control 44×44 by padding, glyph unchanged; safe-area insets added additively; dialog keyboard/focus baseline established. **H-4 confirmed, not killed** — the launcher's Motion entrance ran unsuppressed under `reduce`, and was removed rather than pinned. See the section below. |
| 11 | Tap targets & sub-767 wrap rows — M-04, M-05, M-09 – M-13 + front matter | **Shipped** (2026-08-09) — `9ecdebc` / `b450840` / `3507f2b` | DESIGN.md §8's two-tier floor implemented as **two shared `::before` overlay utilities** (`.tap-44`, `.tap-24`) rather than 73 call-site patches, because the 2,707 instances were a handful of shared components rendered many times. **`::before`, not `::after`** — `[data-navlink]::after` is the active-page indicator, and the nav links need both. M-10 forced the one real arithmetic decision: 44px targets in a 12px column gap **overlap by 9.6px**, so the footer gap went to 22px. The `.tg-seq` half of M-19 was re-tested with the armed sampler rather than inherited — **the pin holds, no `translate` pin needed**. New audit phase `taps` hit-tests targets, which is the only way to see a pseudo-element expansion. See the section below. |
| 12 | `StatusLine` hydration fix — React #418 | **Shipped** (2026-08-10) — `fbb37a6` | The one finding Prompt 7 surfaced and quarantined, now closed. Server and first client render emit a fixed `at HH:MM UTC` stamp; the relative string is taken only post-hydration, so the swap is an update rather than a mismatch. No `suppressHydrationWarning`, no empty first paint. `useSyncExternalStore` rather than `useState` + `useEffect` — the latter is a lint **error** here (`react-hooks/set-state-in-effect`). One file, no call site changed. See the section below. |
| 13 | Mobile close-out — M-07, M-08 (sub-767) + D-01, D-02, D-03, D-05, D-06, D-10 | **Shipped** (2026-08-10) | The mobile queue closed: **M-07 and M-08 are resolved at every viewport**, and six of the twelve device observations with them. Two of the seven items were not what the brief said they were. **D-10's cause is `cn()`, not padding** — tailwind-merge drops `leading-none` when a later `text-*` class appears, so every button on the site rendered a 1.6 line box; the nav CTA's padding was already the standard 14×24. And **M-07/M-08 never failed at 844×390**, which the brief listed as a failing row: measured 1 line before the change and 1 after. See the section below. |
| 14 | The three specification gaps — D-09 (proof line), D-11 (`LiveFrame` container), D-12 (`closing-cta`) | **Shipped** (2026-08-10) | Spec first, then code, for each of the three; DESIGN.md goes v2.4 → v2.5. None was a bug — each was built correctly against guidance that did not exist. The proof line's actionable half was `muted` **and** `link-underline` draws nothing at rest, so it had no affordance at all; `LiveFrame`'s padding is now stated as permanently 0, because `aspect-ratio` governs the outer box and any padding silently breaks the locked ratio it is there to enforce; and **`closing-cta`'s 200px of dead space was a boundary collision, not internal spacing** — fixed in one `:has(+ .tg-closing)` declaration, 202px → 114px, with the internal rhythm re-cut to 24 · 48 · 24 · 16. The `taps` audit script could not run (Playwright browser launch fails on this machine); its probe was replicated in-pane instead. **Also fixed in the same pass, reported by the user mid-session:** the alternating case-study rows put two posters back to back below 768px, because the alternation was carried by DOM order and a one-column grid has nothing else left — moved onto `grid-column` with a `grid-row: 1` pin. And their `gap-y-12` had never applied. See the section below. |
| 15 | Contact action: `after()` dispatch, honeypot/CRM observability, boilerplate-copy and name-shape guards | **Shipped** (2026-08-11) | Not a bug fix — the CRM contract itself changed underneath the action: it upserts **by email**, and it takes 2–5s because it awaits its own Gemini spam-shield and Resend calls. The action returned in a measured 3–4s warm before, all of it spent waiting on dependencies this side can't speed up, and it failed the visitor whenever only the *notification* email errored, which under upsert-by-email meant a retry destroyed the visitor's own already-captured enquiry rather than duplicating it. Now returns as soon as validation and the rate limit pass — **246–683ms measured, warm and cold, against the real CRM and Resend** — and does the CRM write plus both emails in `after()`, each failure recorded to a greppable log marker and a 90-day Upstash record so a lead is never delivered nowhere. Two real leads had also been arriving with page boilerplate as their content (a placeholder textarea string, a 160-char scraped block as a name) and tripping the CRM's own spam shield; `lib/validation.ts` now strips known UI copy from `message` and rejects it outright from `name`. See the section below. |

## Prompt 15 — the contact action stopped waiting on its own dependencies

*2026-08-11. Changed: `app/actions/contact.ts`, `app/api/concierge/route.ts`,
`lib/validation.ts` (+46 → 73 test cases in `lib/validation.test.ts`), new
`lib/lead-archive.ts`. `docs/CANONICAL.md` §"Carrying forward the existing
code" gained the CRM's upsert/latency contract and this change's summary.*

**Not a bug fix — the CRM's own contract had never been written down**, and
once it was (verified against source and the live DB, not re-derived), three
things this action was doing turned out to be actively harmful rather than
merely slow:

1. **It awaited the CRM write and both emails before returning.** Measured
   7.36s against production before this change; the endpoint itself takes
   2–5s because it awaits its own Gemini spam-shield call and its own Resend
   send before responding, which nothing on the site side can shorten.
2. **It failed the *visitor* whenever only the internal notification email
   errored** — even after the CRM write had already succeeded. Harmless on
   its own, except the CRM **upserts by email**: a visitor told to retry
   after a false failure doesn't create a duplicate, they overwrite their
   own already-captured lead with a second, usually shorter attempt. The
   error-handling was quietly destroying the exact data it was reporting a
   problem with.
3. **The CRM enforces no shape on `client_name` and the site sent whatever a
   filler put in `message`.** Two real submissions arrived with the
   `/contact` hero subhead as their message and 160 characters of scraped
   page prose as their name — which the CRM's spam shield, correctly, read
   as bot-like, misflagging genuine enquiries in the process.

**The fix.** `sendContactEmail` now validates and rate-limits, then returns
immediately; the CRM write and both Resend sends happen in `after()` from
`next/server`, so nothing downstream of the response can change what the
visitor is told. Measured on the same machine, same real backend, matched
cold/warm pairs before and after: **4129ms → 683ms cold, 3017ms → 246ms
warm.** The CRM write fires exactly once and is never retried — per the
upsert contract, a retry from stale data risks overwriting a row a later
submission already corrected.

Every dependency failure inside `after()` is recorded twice, because the
visitor is already gone by the time it happens: a greppable
`[LEAD-DELIVERY-FAILURE]` marker (email + ISO timestamp) and the full CRM
payload persisted to Upstash via the new `lib/lead-archive.ts`
(`tg:lead:fail:<ISO>:<6 random chars>`, 90-day TTL, newest-first index at
`tg:lead:fail:index`). No queue, no job runner — `after()` plus one Upstash
write is the whole mechanism. The honeypot's silent-accept branch got the
same treatment (`[LEAD-HONEYPOT]`, field lengths and fill time only, never
the honeypot's own attacker-controlled value), because it used to be
genuinely invisible — a real catch and a mis-filled accessibility tool
produced identical nothing.

**The boilerplate guard, added to `lib/validation.ts` as the two narrow
exceptions the brief allowed.** `isUiCopy` / `stripUiCopy` import the actual
placeholder strings from `content/solutions.ts` rather than transcribing
them, normalise curly quotes and dashes (the page renders `&rsquo;`, so a
scraped value is never byte-identical to source), and only treat a string as
copy on exact match — containment only applies past a 40-character floor, so
short entries like "Select one" don't false-positive inside a real sentence.
`message` runs through `stripUiCopy` **before** validation, so a message that
was only scraped prose reduces to blank and is accepted and omitted, not
rejected — the CRM has no message requirement, and failing a visitor over a
field they never filled would be worse than the original bug. `personName`
adds a shape check with no script, capitalisation, or word-count assumption
(TEKGUYZ takes international enquiries): 2–80 characters, one line, no `@`
or URL, no mid-value sentence punctuation, and not UI copy itself. One
consequence worth flagging explicitly: the **server** now accepts a blank
`message` while the **client** still requires 10 characters — deliberate,
because the server also serves the concierge, which bypasses the form
entirely.

**Verified, not asserted:** built with `.env.local` moved aside (secrets-free
build passes), 73/73 Vitest cases including the two real submitted strings
that exposed the original bug, and four live local runs against the real
CRM/Resend/Upstash — normal success, CRM-down, Resend-down (missing key,
thrown at construction), and the honeypot — each read back from server logs
and, for the failure cases, from Upstash directly. Five submissions from one
test address in the real CRM returned the same `leadId` five times, which is
the upsert contract confirmed live rather than quoted. The concierge's
shared call path was hit directly (`POST /api/concierge`) and produced its
own CRM row with `source="AI Concierge"`, confirming `after()` fires
correctly from a route handler too, not just a server action.

**Not done in this pass:** a production measurement against `tekguyz.com`
itself — the local numbers above are same-machine, same-backend matched
pairs, not a substitute for the real thing once this is live. Two synthetic
CRM rows from testing are left for a human to delete
(`contact-action-check-2026-08-11@tekguyz.com`,
`dana@whitfieldplumbing-test.example`).

## Prompt 14 — the three specification gaps: proof line, `LiveFrame` container, `closing-cta`

*2026-08-10. Changed: `docs/DESIGN.md` (v2.4 → v2.5), `app/page.tsx`,
`components/live-frame.tsx`, `components/closing-cta.tsx`, `app/globals.css`.*

**D-09, D-11 and D-12 are shipped.** Prompt 13 deferred all three with the same
instruction — *a design pass writes the spec before anything implements it* —
and that is what this was: **the DESIGN.md entry first, then the code**, for
each of the three. None of them was a bug. Each was built correctly against
guidance that did not exist, which is why they were one pass and not three: a
piecemeal fix would have produced three unrelated treatments.

**D-09 — the proof line.** CANONICAL §98 fixed the content and said "no card",
and DESIGN.md had no entry at all. The band now says what "no card" *is* in
positive terms (hairline top and bottom, no fill, no radius, 36px of its own
padding — a rule-to-rule beat, not a section), and the sentence became **two
clauses at two scales on one baseline row**: the claim at `--text-title`/600, the
invitation at `--text-body`/600, 20px apart, stacking below 768.

The defect it replaces is the one worth remembering. The whole line rendered at
28px with the link half in `muted` — and **`link-underline` draws nothing at
rest**, it grows from 0% on hover and focus. So the only actionable element on
the site's proof band had no rest-state affordance *and* was the lighter of the
two halves: the hierarchy was inverted. Both halves are ink now; the size step
carries it, which is what §2 says for everything else. The link also moved
`tap-24` → `tap-44` — it is no longer inline in a `<p>`, so the prose tier no
longer applies to it.

**D-11 — the `LiveFrame` container.** The old entry specified the two ratios and
`object-fit` and stopped, so the compact contexts inherited a generic card. Four
values now, and one of them is load-bearing: **padding is 0 and stays 0.**
`aspect-ratio` governs the *outer* box, so any padding is subtracted from the
media — the frame keeps its 16:10 while the screenshot inside it quietly stops
being 16:10. The fill moved from a literal `#FFFFFF` to `--tg-surface`, which
resolves correctly in dark mode and inside `.ink-band` without a branch, and
which is only ever a loading state: under `cover` it is never visible once the
poster paints. The status block stays **beneath** the frame — inside means an
overlay on the real product's own header, the same lie as fake browser chrome —
and became a caption *attached* to it: 12px below instead of 18px, left-anchored,
20px between status and link instead of `justify-between`, which on an 803px
detail-page frame had thrown the two halves of one idea to opposite corners.

**D-12 — `closing-cta`, and where the 200px actually lived.** Two separate
things, and only one of them was inside the component.

The **internal rhythm** ran 24 / 32 / 36 — a near-linear ramp, so every gap read
the same, nothing grouped, and a centered stack with nothing grouping it reads
flat. It is now **24 · 48 · 24 · 16**: one step for a pair, two for the single
register break (statement → ask), half for the subordinate concierge link. No
card, border, fill or divider was added — the flatness was never in the
elements, so the fix could only be in the gaps.

The **dead space was a boundary collision, and it is fixed at the boundary.**
Measured 202px from the last content to the closing headline on `/`: a block
closing at full 128px bottom rhythm, then the 6px stripe, then the CTA's own
64px top — two complete gaps stacked across a rule. 128px separates two *content*
sections, and what follows here is a coloured rule, which is already a boundary.
So the CTA's own top padding went to 40/32px and the block that closes into the
stripe sheds half its rhythm, in **one declaration** in `globals.css`:
`:where(section, div):has(+ .tg-closing)`. **Verified before writing it that all
seven routes carrying `closing-cta` end that element at exactly 128px**, so the
rule only ever reduces and can never add padding to a neighbour that had none.
Measured after: **202px → 114px desktop, 82px mobile.**

Two mechanics inside that one rule are worth keeping:

- It is **unlayered**, so it beats Tailwind's `pb-32` (in `@layer utilities`) by
  layer. Both are (0,1,0), so a layered rule would have left this resting on
  source order — the exact trap §8 records for `motion-reduce:lg:static`.
- Its query is `min-width: 768px`, **not** the `max-width: 767px` used elsewhere
  in the file, because the CTA's own top padding is Tailwind's `md:`. Measured
  during this pass: a viewport reporting `innerWidth` 767 matched **neither**
  `max-width: 767px` nor `min-width: 768px` — the real CSS width was fractional.
  A complementary query would have left a hairline band where one half of the
  pair switched and the other did not. **Two declarations that have to agree get
  the same query.**

**Rejected, and recorded in DESIGN.md so the next pass doesn't re-open them:**
promoting the proof line to `--text-display` (three display-scale elements in one
scroll); an accent dot before it (accents mean *solution line*, and this sentence
spans all four); dropping the frame radius below 12px (the card read came from the
mat, not the corner); moving `closing-cta`'s trust line below the button (a
content reorder wearing a spacing costume, and it separates the concierge link
from the button it is an alternative to); and dropping the trust line to
`--text-caption` (it would have split `/contact`'s identical three facts from
these).

### Reported during the same session: back-to-back posters below 768px

Not one of the three, and not a spec gap — a real layout defect, found by the user
on a phone and fixed in the same pass.

**The symptom:** on the home Featured Work band the second case study led with its
image, so scrolling gave two posters in a row with nothing but whitespace between
them. `/work` had it on rows 1 and 3 of 4, and worse there — that component's media
column also carries the status line, the "Try it" note and "How it's built", so the
odd rows **opened with a screenshot and a build note for a project the visitor had
not been introduced to yet.**

**The cause:** the alternation was carried by **DOM order**. Both components
rendered `{media}{text}` on odd rows and `{text}{media}` on even ones. Below 768px
`.tg-grid` collapses to one column and forces `grid-column: 1 / -1 !important` on
every child — at which point source order is the entire layout, and the alternation
that reads as deliberate offset on desktop reads as two images stuck together.

**Why it was built that way, which is the part worth keeping:** explicit
`grid-column` alone does not survive **sparse auto-flow**. The placement cursor
never moves backwards, so an item whose column-start sits behind it is pushed to the
next row — emit text at `8/13` and then media at `1/7` and the media lands on row 2.
Swapping the DOM was the cheapest way to keep the cursor ascending. The fix is to
remove the constraint instead: **both halves are pinned to `grid-row: 1`**, so the
columns alone decide the visual order and the DOM can stay in reading order at every
width. The `≤767` reset releases the pin (`grid-row: auto !important`) in the **same
block** that releases `grid-column`, so the two can never disagree — including at
the fractional widths where `max-width: 767px` and `min-width: 768px` are both
false, which this session measured directly.

**Found while fixing it, and separately real:** both components declared
`gap-y-12` on the row and **it had never applied on any viewport**. `.tg-grid` sets
the shorthand `gap: 24px` **unlayered**, which beats a layered `row-gap` from
`@layer utilities` regardless of source order — the same shape as the `cn()`
dropping `leading-none` bug from Prompt 13, one layer up, and equally invisible to
the linter and to anyone reading the JSX. The stacked halves have shipped at 24px
for the life of the site. Now `.tg-split` in `globals.css`, unlayered, at the
intended 48px. Mobile rhythm is now 48px inside the pair against 160px (`/work`) /
192px (home) between rows.

**Measured after, both components:** at 390 and 360, **0 back-to-back images**, all
rows text→48px→media, and tab order matches visual order with **0 inversions** — the
reason the fix is a DOM reorder and not an `order` utility, which would have left
focus order pointing at the old sequence. At 1440: 12 explicit column tracks, **1
row track, 0 implicit**, alternation byte-identical to before (odd rows still media
104–700 / text 828–1320). At 800 and at the fractional 767: **8 explicit tracks, 1
row track, 0 implicit**, offset alternation intact. Tap probe on `/work` at 390 and
360: 0 tier failures, 0 overlaps.

**Scope check:** `grid-column` appears on five other components
(`/work/[slug]`, `footer-dark`, `solution-row`). All place in **ascending** column
order, so none of them needed the pin and none was touched.

**Verification.** `bun run build`, `bun run lint` (0 errors) and `bun run test`
(46/46) pass. Values confirmed in the live DOM, both themes, at 1440 / 844×390 /
767 / 390 / 360. Under `reduce`, all four `.tg-seq` items measure opacity 1,
`transform: none`, 0 running animations, and nothing is hidden. **The `taps`
audit could not be run: Playwright's bundled `chrome-headless-shell` launches and
then never connects on this machine (180s timeout, twice, sandbox on and off) —
an environment failure, not a code one.** Its `TAP_PROBE` was replicated verbatim
in the browser pane instead and run on `/`, `/work` and `/work/ai-voice-receptionist`
at 360×800, 390×844, 767×1024 and 844×390: **0 tier failures and 0 overlapping
hit areas** at every combination, with one pre-existing exclusion — the
`sr-only` skip link in `app/layout.tsx:49`, which is clipped rather than
zero-sized and so passes the shared `visible()` filter. It is untouched by this
pass and unrelated to it. **Re-run the real script before trusting these numbers
as the site-wide figure.**

## Prompt 13 — the mobile close-out, and a button bug hiding behind a design complaint

*2026-08-10, one commit. Changed: `components/button.tsx`, `components/nav.tsx`,
`components/faq-accordion.tsx`, `components/contact-form.tsx`,
`components/home-hero.tsx`, `components/concierge/concierge.tsx`,
`components/concierge/concierge-bus.ts`. No CSS, no doc-only items.*

**M-07 + M-08 are one defect with one arithmetic behind it.** The `/contact`
step header is title + counter + a 16px gap inside the card's content box. The
row needs `193 + 16 + 51.3 = 260.3px`; the box is **230.4px at 360**, so flexbox
shrinks both children and both wrap. The same sum is **0.3px short at 390** and
clears from 414 up — which is exactly where the reported symptom stops, and is
the check that the arithmetic is the cause rather than a coincidence. Fixed by
dropping the card's padding from 40px to 24px below `sm` (40px is 22% of a 360px
viewport) plus a 12px gap and `whitespace-nowrap` on the counter. **Both changes
are scoped `max-sm`, so 767 / 768 / 844 are not in the query and measured
byte-identical after.** Counter **44.8px tall / 2 lines → 22.4 / 1**; title
**52.8 / 2 → 26.4 / 1**, at 360, 375 and 390.

**`whitespace-nowrap` alone would not have fixed it** — it makes `01 / 02` one
atom, which without the extra room just pushes the whole deficit onto the title.
It is the guarantee, not the fix.

**D-10 was a real symptom with a wrong cause, and the cause is `cn()`.** The nav
CTA's padding was *already* the standard 14×24 — Prompt 6 measured that and
correctly changed nothing. What no one measured was the **line box**: `base` in
`button.tsx` declared `leading-none`, and it never reached the DOM. `cn()` is
tailwind-merge; Tailwind's `text-*` utilities set line-height as well as size, so
a later font-size class is treated as conflicting with an earlier `leading-*` and
**drops it**. Every button on the site inherited the 1.6 body line-height:
`14.5px × 1.6 = 23.2px` instead of 14.5px, **8.7px taller than the export**, which
is what made the nav CTA read as `button-primary--large`. The line height now
rides *on* the font-size utility (`text-[14.5px]/[1]`) so there is nothing left
to resolve. Nav CTA **51.2 → 42.5px**; `closing-cta`'s large button **60.6 → 52px**,
restoring the weight gap the one-off size exception exists to create.

**The header height does not follow, and should not.** It is `h-[76px]`, a fixed
value matching DESIGN's nav spec — measured 76 before and after. The CTA was
never setting it; it was the tallest thing inside it, which is what that reads
like on a phone.

**Correcting the button dropped the nav CTA under the tap floor** (42.5 < 44), so
it takes the same `.tap-44` `::before` overlay every other under-44 control in the
bar carries. Hit-tested, not rect-measured: all five probes on the 44×44 tier box
own to the CTA itself, and the corridor to the theme toggle 34px away is clear.
No painted box was resized back up.

**D-01 + D-02 are one channel.** `useSuppressLauncher` / `useLauncherSuppressed`
in `concierge-bus.ts` — a counted `Set` behind `useSyncExternalStore`, fed by the
drawer's `open` and the accordion's `open !== null`, and **ANDed with** the
existing `[data-primary-cta]` observer. Counted rather than boolean because two
suppressors can overlap and the last one out must be the one that releases.
This is the channel the 2026-08-10 decision specified; it is deliberately **not**
a widened observer, because the flicker risk that keeps `data-primary-cta` narrow
is scroll-driven and a discrete boolean carries none of it. Measured in both
states: `opacity 0` · `pointer-events: none` · `aria-hidden="true"` ·
`tabIndex -1`, and the launcher's own centre point hit-tests to the element
*behind* it. Restores on close, and the no-state-active behaviour is unchanged.

**D-03 — the success message was already in a live region, and that was not
enough.** `role="status"` carries an implicit `aria-live="polite"`, but the
region and its content mount in the same commit, and a live region announces
*changes* to a region that was already there. Submitting also unmounts the form,
so the focused Send button goes with it and focus falls to `<body>` — from which
the next stop is the first FAQ trigger, far below the message. Focus now moves to
the success element (`tabIndex={-1}`), which fixes both halves at once: it is what
a screen reader reads, and the scroll is a side effect of it. Measured after a
submit driven through the honeypot's silent-accept path: `document.activeElement`
**is** the status element, fully in viewport.

**D-05 — anchor the top of the newest message, not the bottom of the list.** The
list scrolled to `scrollHeight`, which puts the *end* of a long reply on screen.
It now scrolls to the newest `[data-msg]`'s own top, which is **self-clamping** —
a message shorter than the list cannot scroll past the maximum, so short
exchanges behave exactly as before. Not `:last-of-type`: that matches per element
name, and the two roles render as different elements. Verified with the list
constrained to 90px and a 120.5px reply: newest top **0.3px** below the list top,
`scrollTop` 809.6 against a maximum of 860 — it deliberately did not go to the
end. The panel was not resized; its viewport bound and the `flex: 1 1 300px`
floor are untouched.

**D-06 — one line removed.** The text-column `StatusLine` under the hero CTA row
was the unspecified one: COPY.md attaches the hero's status line to the media and
DESIGN.md §5 lists it once. Hero instances **2 → 1**, in the media, at all seven
viewports and at 1440.

**What this pass did not do**, all of it deliberately out of scope: D-04 panel
geometry, D-07/D-08 hero assets, D-09/D-11/D-12 spec gaps, the 768/844 rows of
M-07/M-08 (left byte-identical on purpose), and the 143 non-CTA overlap pairs.
No copy slot was missing, so no `[NEEDS COPY]` marker was emitted.

## Prompt 12 — the `StatusLine` hydration mismatch

*2026-08-10, one commit — `fbb37a6`. Changed: `components/status-line.tsx`, and
nothing else. All six call sites (`components/home-hero.tsx` ×2,
`components/live-frame.tsx`, `components/project-card.tsx`, `app/page.tsx`,
`app/work/[slug]/page.tsx`, `app/solutions/[slug]/page.tsx`) pass only
serializable props, so the new client boundary needed no changes to any of them.*

Prompt 7 surfaced React #418 on `/` and quarantined it. This closes it.

**The two obvious fixes are both wrong, and it's worth saying why.** Deferring
the whole line to an effect flashes an empty signature component — the one that
carries the "we measure it rather than assert it" claim, on the home hero.
`suppressHydrationWarning` silences the console while leaving two genuinely
different trees in place, which is the symptom hidden, not the bug fixed.

**What ships: the server renders an absolute stamp, the client swaps to the
relative one after hydration.** An absolute timestamp is never *wrong*, only
less friendly, so first paint is complete and correct on its own and the swap is
a real update rather than a correction of a mismatch.

**The absolute format is `at HH:MM UTC`, built from `getUTCHours` /
`getUTCMinutes` with manual zero-padding — deliberately not `Intl` or
`toLocaleTimeString`.** A locale- or timezone-dependent format is the same
hydration mismatch one layer down: the server is UTC and the visitor is not.
Zero-padded also means the existing `tabular-nums` still has something to align,
which is the whole point of keeping it on a component whose text swaps.

**The hook is `useSyncExternalStore`, and that is a lint consequence, not a
preference.** The natural shape — `useState(absolute)` plus a `useEffect` that
sets the relative string — is rejected by this repo's config
(`react-hooks/set-state-in-effect`, an error, not a warning). `useSyncExternalStore`
with a no-op `subscribe`, a constant `() => true` client snapshot and a constant
`() => false` server snapshot expresses "server value, then client value" as the
one thing React actually supports for this, with no cascading render.

**Verified in a production build, not only in dev** — the distinction matters
here because dev and prod handle mismatches differently. Server HTML on `/work`
contains `checked <!-- -->at 03:37 UTC`; the same node after hydration reads
`Live · checked just now`. Console on `/` and `/work/[slug]` in both `bun run
start` and `bun run dev`: no #418, no hydration diff, only the pre-existing
`/_vercel/insights` 404s that local has always had. Lint 0 errors (the
`contact-form.tsx` React Compiler warning remains, as expected), 46/46 validation
tests pass, `bun run build` clean.

**Not done, named as such:** the relative string is computed once at mount and
never ticks, so a page left open keeps saying "just now". That matches the
previous behaviour exactly — the old value was also frozen at render — so it is
not a regression, but "3 minutes ago" advancing while the page sits open would
be a separate interval and was left out of scope.

## Prompt 11 — tap targets and the sub-767 wrap rows

*2026-08-09, three commits — `9ecdebc` (front matter), `b450840` (Track A),
`3507f2b` (Track B). Changed: `app/globals.css` (two new utilities, no
grid rules touched), `components/theme-toggle.tsx`, `components/nav.tsx`,
`components/footer-dark.tsx`, `components/closing-cta.tsx`,
`components/live-frame.tsx`, `components/home-hero.tsx`,
`components/case-study-row.tsx`, `components/testimonial.tsx`,
`components/contact-form.tsx`, `components/concierge/markdown.tsx`,
`app/page.tsx`, `app/contact/page.tsx`, `app/work/[slug]/page.tsx`,
`app/solutions/[slug]/page.tsx`, `app/not-found.tsx`, `app/error.tsx`, plus
`scripts/audit-mobile.ts` and `scripts/audit-concierge.ts` (measurement only).*

**The finding count was the misleading part.** 73 signatures across 2,707
instances reads like 73 bugs. It is a handful of shared components rendered many
times, and every one but the theme toggle failed on height alone — because the
type scale gives a 14.5px link a ~22px line box and nothing had ever added
vertical hit area. The fix is therefore **two CSS utilities and ~20 class
additions**, not 2,707 patches.

**`.tap-44` / `.tap-24` use `::before`, and that is load-bearing.**
`[data-navlink]::after` is the active-page indicator bar, and the nav links are
exactly the elements that need both a hit-area overlay and an indicator. One
pseudo per job. The overlay is centred on the element with `min-width` /
`min-height` at the tier, so a target already wider than 44px keeps its full
width and grows only on the short axis. It uses `translate`, not `transform`,
for the same reason `.reveal` does.

**M-09 — the toggle paints, so it was not resized.** The first question §8's
"never resize the painted box" rule raises is whether there *is* a painted box.
There is: a 1px hairline at rest, darkening to `border-strong` on hover. So the
38×38 render is unchanged and only the hit area is 44×44. Had it painted
nothing, growing it directly would have been correct and simpler — that branch
was checked, not assumed.

**M-10 is the case where the arithmetic decides the fix.** Footer links are
22.4px tall in a 12px column gap. Reaching 44px needs 10.8px above *and* below,
so two vertically adjacent links would each expand into the same 12px gap and
**overlap by 9.6px** — two invisible targets whose winner is source order, so a
tap on `Process` could land on `Work`. That is strictly worse than a 22px target
you can at least aim at. Resolution (a) shipped: the column gap goes to **22px**
and the targets tile with 0.4px of clearance. Resolution (b) — real padding on
each link — would have cost 74px of footer height per column against 30px, and
DESIGN.md §4 says this row must not inherit section-level spacing.

**M-11's substance is the classification, not the CSS.** 20 call sites, **17
standalone (44) and 3 prose (24)**. `Open it in a new tab` was the close call
because it renders two ways — as a blockified flex item in `LiveFrame` (137.1 ×
23.2) and as a bare inline `<a>` in `/work/[slug]`'s meta rail (137.1 × 19.0).
**Both got 44**: the inline one is inline because it is an `<a>` alone in a
block, not because it sits in a sentence — it is the sole affordance under a
"Live demo" label, which is a standalone control. The three prose-tier links are
the ones genuinely mid-sentence: `/`'s "Open any of them right now.", the
contact form's error-state mailto, and the concierge's markdown links. There,
24×24 is the deliberate ceiling — a 44px box around a mid-sentence link either
overlaps its neighbours or forces a line-height that breaks §2's type scale.

**M-04's mechanism: a media query at 766px, not a sibling selector.** The defect
is that a separator ends a line, and CSS selectors see DOM order while the
defect is about the *rendered* break — the last dot in the DOM is not the dot
that dangles. 766 is the measured threshold (one line at 767 and above, wrapped
at every viewport below), so the row switches to a deliberate stack with the
dots not rendered at exactly the width where it would otherwise wrap. The dots
are `aria-hidden`, so hiding them costs nothing semantically. Both the
`closing-cta` row and `/contact`'s own trust column take the same treatment;
`/contact` additionally re-asserts `items-start`, because `items-center` is
cross-axis and would centre the stack against §9.

**M-05: the alignment was never the defect.** The audit describes the wrapped
social row sitting at the lockup's `left: 24px` alongside the symptom, and §9
left-anchors everything but the closing CTA — so left is correct and stayed. The
48px `gap` inherited from the side-by-side arrangement was the defect; below 766
the row gap is **24px**, tighter than the 32px that follows down to the divider,
which groups the social row with the lockup rather than with the nav.

**Verification needed a new harness phase, and that is the reusable lesson.**
The existing sweep measures `getBoundingClientRect`. §8 expands targets by a
pseudo-element *specifically so the box does not change*, so a rect-based re-run
reports every fixed target as still failing — the measurement and the fix are
looking at different things. `scripts/audit-mobile.ts taps` hit-tests instead:
it probes the tier box's corners with `elementFromPoint` and asks who owns each
point. That also turns "no two hit areas overlap" from an argument into a
number, since a probe that lands on a *different* interactive element is exactly
the overlap defect. Two things it had to get right, both of which read as
passes when wrong: `elementFromPoint` only hit-tests the visible viewport, so
every element must be scrolled in first; and an **ancestor** owning the probe
point is a failure, not a pass — treating it as a pass reported 0 failures
site-wide.

**Results.** Tier failures **2,739 → 0**, overlaps **0**, across 18 routes × 7
viewports (× light/dark at two of them). The undersized-*painted*-box inventory
is unchanged at **2,729**, byte-identical in width and height on all 162
combos — which is the proof that nothing was resized. Full per-finding
after-numbers are in `docs/MOBILE-AUDIT.md`'s banner.

**Front matter.** Open decision 5 (the launcher label) is **closed** — human
confirmed `Ask about your project`, unchanged; the candidate-list drift that
produced it is recorded there and the rule against regenerating candidates is
now in `CLAUDE.md`. `docs/COPY.md` gained the Title-Case / sentence-case
convention, documenting what already ships so the launcher is not later
"normalised" to Title Case. `/contact`'s submit button now carries
`data-primary-cta` on both steps — the branches are exclusive, so exactly one is
ever in the DOM.

**`.tg-seq` under `reduce`: re-tested, pin holds, nothing changed.** Prompt 10
skipped this on the grounds that `globals.css` pins it, and the doubt was
specific — the pin is `transform: none !important`, which does not beat a
`translate`, and "the earlier reading stands" is the exact assumption M-19
disproved for the launcher. Measured with the same MutationObserver-armed rAF
sampler: all 12 `.tg-seq` elements on `/` constant at `opacity: 1` /
`transform: none` / `translate: none` over 69–90 frames at two viewports, while
the same sampler under `no-preference` reads full opacity and `matrix()` ramps
on the same elements. Motion writes `transform` here, not `translate`. **No
`translate: none` pin was added, because none was needed.**

## Prompt 10 — the concierge fix

*2026-08-09, `9a58fc1`. Changed: `components/concierge/concierge.tsx`, `app/globals.css`
(`.tg-yield` + its reduced-motion pin — no grid rules touched),
`components/closing-cta.tsx`, `components/home-hero.tsx` (one `data-primary-cta`
attribute each), `scripts/audit-concierge.ts` (new, measures only), plus
`CLAUDE.md`, `docs/DESIGN.md` §8, `docs/MOBILE-AUDIT.md`'s status banner and §7
H-4/H-5, and this file.*

**What was measured, and with what.** `scripts/audit-concierge.ts` — same protocol
as `audit-mobile.ts` (kill the port, `bun run build`, `bunx next start -p 3210`,
run under **node, not Bun**, stylesheet-200 guard first). Phase `m19` is the H-4
sampler; phase `geometry` walks all 8 viewports opening the panel and exercising
Escape, Tab and focus return. M-15 was re-measured by re-running
`audit-mobile.ts sweep` whole — 162 rows, same harness that produced the 174.

**M-19 / H-4 — confirmed, and the confirmation changed the fix.** The
MutationObserver-armed rAF sampler in `scripts/audit-concierge.ts` (phase `m19`)
caught what the post-hoc sample could not: under `reducedMotion: 'reduce'`, on
all 6 route/viewport combinations, the launcher animated **`opacity` 0 → 1
through 15–17 distinct intermediate values and `transform`
`matrix(1,0,0,1,0,8)` → `none` through 16**, over a ~240ms window from DOM
insertion. The `reduce` and `no-preference` traces are indistinguishable — the
reduced-motion block reached it not at all, exactly as H-4 predicted. Prompt 7's
`opacity: 1, transform: none, 16 of 16 runs` was true and measured nothing: every
sample landed after the entrance had finished.

The fix is **removal, not a pin**. The launcher's entrance was a Motion
`AnimatePresence` mount animating `y`, and the yield rule this pass introduces is
opacity-only by specification — so the entrance had to go regardless, and pinning
it with `opacity: 1 !important; transform: none !important` the way `.tg-seq` is
pinned would have preserved a WAAPI animation the site no longer needs. The
launcher now renders unconditionally and transitions `opacity` through
`.tg-yield`, a plain CSS rule. `getAnimations()` is empty on it at rest; every
post-fix sample reads `transform: none` and `translate: none`.

**Why the launcher stays mounted.** It used to unmount whenever it wasn't wanted
(`pastHero && !open`). Focus return on close needs it to still be there, and an
element removed from the DOM cannot transition. It is now always rendered and
made inert — `opacity: 0`, `pointer-events: none`, `aria-hidden="true"`,
`tabIndex={-1}` — which is also the only way the yield rule can avoid leaving a
hidden-but-focusable control in the tab order.

**The 300px message-list floor is a flex basis, not a `min-height`.** This is the
part that is easy to get wrong twice: giving the panel a `max-height` while the
list keeps `min-height: 300px` does not fix M-03, it relocates it — the list
refuses to compress and the panel clips it against its own `overflow: hidden`.
`flex: 1 1 300px` with `min-height: 0` makes 300px a preference that yields under
the viewport bound and grows in sheet mode.

**One inline style is unavoidable here, and it is safe.** The `env(safe-area-inset-*)`
insets and the yield opacity are inline `style`, not Tailwind utilities — `env()`
in an arbitrary value is fragile and the opacity is per-render state. Neither is
a grid placement and neither is overridden by anything, so the rule that bans
inline placements does not reach them. What *is* class-based, deliberately: the
yield transition, so the reduced-motion block can beat it. An inline `transition`
would have been unbeatable by any stylesheet rule.

**M-15: the criterion was met and the number underneath it was not, and both are
true.** Primary-CTA overlaps went **174 → 0**. Across every interactive element
the sweep still returns **143 pairs, 44 above 25%, worst 99.6%**. The pass was
instructed to name a third element class rather than silently widen the observer,
and there were four: meta-rail links, inline `link-underline` text links,
prev/next case-study nav links, footer links, plus `/contact`'s FAQ triggers.
They are tracked as their own Known Gap. **Do not close that gap by adding
`data-primary-cta` to them** — the launcher would flicker on every scroll-heavy
route, which is the failure mode the narrow scope was chosen to avoid.

**`/contact` carries no `data-primary-cta` at all**, so the launcher never yields
there. That is correct — the page has no hero CTA and no `closing-cta`; its
conversion element is the form itself. It is also why 6 of the 44 remaining
overlaps are its FAQ accordion triggers.

**The scroll-lock probe was wrong before it was right, and the wrong version is
the tempting one.** `overflow: hidden` stops *user* scrolling and never stops a
scripted `window.scrollBy`, so a programmatic probe reports every working scroll
lock as broken. The check has to be a real wheel event
(`page.mouse.wheel`), aimed somewhere that is not the panel's own scrollable
message list — the sheet's 56px header works, the viewport centre does not.

**Surfaced but not fixed, and not this pass's:** `/` throws **React #418**, a
hydration text mismatch, from `relativeTime(result.checkedAt)` in
`components/status-line.tsx` — a relative timestamp baked at prerender and
recomputed on the client. **Pre-existing, not a regression**: the identical error
reproduces on `https://tekguyz.com`. It sits in a file this pass touched
(`home-hero.tsx`'s tree), which is the only reason it was found. **Fixed in
Prompt 12 (2026-08-10) — see the section below.**

**Not done, named as such:** safe-area insets are verified on the **fallback path
only** — a headless context has no insets, so all 8 viewports read `bottom: 24px`
and the additive path is untested. `dvh` vs `svh` vs `vh` remains
indistinguishable here. The `.tg-seq` half of M-19 was not re-tested. Motion-on
visual confirmation is the user's — this machine runs with animations off, so the
pass proved wiring (computed styles, class mechanics, sampled opacity/transform,
animation counts) and not the look.

## Prompt 8 — fix batch A: the 768–1023px layout band

*2026-08-08. Changed: `app/globals.css` (reverted to its pre-diagnostic state — no
net change), `components/page-hero.tsx`, `components/solution-row.tsx`,
`components/case-study-row.tsx`, `components/footer-dark.tsx`,
`components/process-steps.tsx`, `app/page.tsx`, `app/contact/page.tsx`,
`app/work/[slug]/page.tsx`, `app/solutions/[slug]/page.tsx`, plus the doc changes
listed at the end of this section.*

### H-1 was proved before anything was designed around it

The audit's kill test was applied, measured, and reverted. One thing the audit's
phrasing did not say and the test needs: **the diagnostic requires `!important`**.
The placements it is fighting are inline `style` attributes, which beat any
stylesheet rule; that is also why the `1 / -1` reset under 767 carries `!important`.
A diagnostic without it measures nothing and reads as "H-1 is wrong".

| Measurement @768 | Audit | Under diagnostic | Verdict |
| --- | --- | --- | --- |
| `/solutions` h1 | 144.0px, L4 | **704px, L1** | H-1 holds |
| `/work` h1 | 144.0px, L5 | **704px, L2** | H-1 holds |
| `/contact` form card | 230.0px | **704px** | H-1 holds |
| Footer nav columns | 265.2 / 265.2 / 125.5 | **704 / 704 / 704** (stacked) | H-1 holds |
| `grid-template-columns` | 8 explicit + **4 implicit** | 8 explicit, **0 implicit** | H-1 holds |

### Why the shipped fix is not the diagnostic

`1 / -1` across the whole band is a stack, and DESIGN.md §8 specifies an **8-column
grid** there. Shipping the diagnostic would have resolved every symptom while
contradicting the spec. So each child's 12-track span was re-derived onto 8 tracks,
scaling by 8/12 and **keeping the deliberate gap track** §3 names rather than
converting rows to halves:

| Row | 12-track | 8-track |
| --- | --- | --- |
| `page-hero` headline / description | `1/8` + `9/13` | both `1/-1` — hero-scale type has no second column to sit beside |
| `SectionHead` headline / description | `1/7` + `8/13` | both `1/-1`, same reason |
| `solution-row` title / hook | `1/6` + `7/13` | `1/4` + `5/9` — 5:6 becomes 3:4, gap track preserved |
| Case-study row, even | text `1/6` + media `7/13` | `1/4` + `5/9` |
| Case-study row, odd | media `1/7` + text `8/13` | `1/5` + `6/9` — the offset alternation survives, not flattened to mirrored halves |
| `/work/[slug]` content / `MetaRail` | `1/9` or `1/8` + `10/13` | `1/7` + `7/9` — the rail is **not** `hidden lg:block`, only its pinning is `lg:`-gated, so the band really does have two columns |
| `/process` steps | `4/13` | `1/-1` — the rail beside it **is** `hidden lg:block`, so there is no second column to place |
| `/contact` trust column / form card | `1/6` + `7/13` | both `1/-1` |
| `/solutions/[slug]` title / body | `1/6` + `7/13` | both `1/-1` |
| Footer nav ×3 | `1/5` + `5/9` + `9/13` | `1/4` + `4/6` + `6/9` — 4/4/4 becomes 3/2/3, and **Company** takes the narrow track because its longest item is `Process` at 51px, while Solutions (136px) and the email (126px) both need a wide one |

### The mechanism, and why it is not the sort-order trap

The inline `style={{ gridColumn }}` attributes were **removed**, not supplemented.
A band rule left in `globals.css` would have had to beat an inline style, i.e. a
second `!important` in a query adjacent to the existing one — exactly what
CLAUDE.md's cascade section forbids. Both placements are now Tailwind arbitrary
properties on the same element (`[grid-column:1/8] max-lg:[grid-column:1/-1]`), the
idiom `home-hero.tsx` already used. That is still a source order, so it was
**measured rather than assumed**, at every boundary:

| Viewport | Tracks | `/work` row children |
| --- | --- | --- |
| 1440 / 1280 | 12 | 699.3 / 389.3 — unchanged from before |
| 1024 | 12 | 550 / 304 |
| **1023** | **8** | 959 / 959 |
| **768** | **8** | 704 / 704 (detail page: 522 / 158) |
| 767 | 1 | 719 / 719 — unchanged |

### M-17 was a consequence, not a separate bug

`/work` at 844×390 scrolled 5px horizontally with zero elements crossing the edge.
It was re-checked after the grid fix **before** any bisect was started, per the
brief, and measures **0px**. The implicit tracks were contributing to
`scrollWidth` without producing a border box that crossed the edge — which is
exactly the shape H-3 described. No `overflow-x: hidden` was shipped anywhere.

### The nav 200ms / 240ms decision — Known Gap closed

Decided in favour of **240ms**: it matches `--dur-base` and it is what ships.
`docs/DESIGN.md` §4 was corrected; no code changed. This closes the open Known Gap
below rather than leaving it as a value judgement.

### Documentation changed, and why each one

Two of these were asked for; the rest are the gap the work exposed. **The 8-column
spans were shipped code with no entry in any authority doc** — a future session
reading §3's 12-track spans would have re-derived different numbers and reopened the
bug.

| File | Change |
| --- | --- |
| `docs/DESIGN.md` §8 | **New — the 8-column spans table**, all ten rows, plus the derivation rule (scale 8/12, keep §3's gap track), why some rows go `1/-1` instead of splitting, the `/process`-vs-`/work/[slug]` rail distinction, and why the footer is 3/2/3 rather than 3/3/2 |
| `docs/DESIGN.md` §3 | The asymmetry spans now say they are the **12-column case** and point at §8. They were previously readable as the only spans that exist |
| `docs/DESIGN.md` §4 | Nav scrolled-state transition **200ms → 240ms** |
| `CLAUDE.md` — What this is | Corrected: the site is **live**, and CRM CORS is therefore active against the real production origin |
| `CLAUDE.md` — cascade section | **New rule:** a grid placement never ships as an inline `style`. Mechanism, per the compression convention; the incident is this section |
| `docs/MOBILE-AUDIT.md` | **Status banner only — no finding row, number or hypothesis was edited.** That file is what the next fix pass measures against, so rewriting a row would destroy the before/after comparison. The banner carries the 7 resolved findings with their new numbers and the H-1/H-2/H-3 verdicts |
| `docs/PROGRESS.md` | This section, the Prompt 8 history row, the phase-status line, the Known Gap closure, and a new Known Gap tracking the remaining mobile work (that row was rewritten by Prompt 9, which retired the batch letters — the remaining passes are named by subsystem) |

**One inconsistency left standing, on purpose.** `components/home-hero.tsx` still
carries an inline `gridColumn: '1 / 7'` on its text column. It is **not** a bug —
`1 / 7` ends at line 7, so it fits inside 8 tracks and creates no implicit ones,
which is why `/` never appeared in M-01. But its media sibling is
`max-lg:[grid-column:1/-1]`, so in the band the text sits on 6 of 8 tracks above a
full-width media panel. Converting it is a no-op refactor; **giving it a band value
is a layout change to a route that measured clean**, and Prompt 8's scope fence was
"placements Phase 1 identified". Left alone rather than changed quietly. `/` h1
measures **522px L3 at 768**, unchanged by this pass. **This is an accepted
exception, not an open task** — it appears in no Known Gaps row on purpose.
Revisit trigger: only if `/` is restyled in the band, or if a placement on that
element is ever extended past line 9, at which point it stops fitting in 8 tracks
and becomes the rule's ordinary case.

**Not changed, deliberately:** `docs/CANONICAL.md` (no architecture or CRM-contract
decision moved), `docs/COPY.md` and `docs/SEO.md` (no string changed — M-16 is
**partial**, and its remaining orphans are a wrap consequence with copy out of scope),
`docs/PLAYBOOK.md`, and `scripts/audit-mobile.ts` (altering an existing check would
stop the before/after numbers comparing).

## Prompt 7 — mobile & motion audit (measure only)

*2026-08-08. **No code changed.** Committed: `docs/MOBILE-AUDIT.md`,
`scripts/audit-mobile.ts`, one `.gitignore` line for `.audit/`. Nothing under
`app/`, `components/`, `lib/`, `config/`, `content/`, `public/` was touched.*

**The report is the deliverable and it is the sole input to the fix prompt.** Do not
re-derive its numbers from this summary — read `docs/MOBILE-AUDIT.md`. What follows
is only what a future session needs to know *about* that file.

### The rule this pass was run under, and why it should survive

**The audit records symptom + where it is observable + the measured value, and
stops.** No finding row states a cause. Everything inferred lives in a clearly
separated `Hypotheses (unverified)` section (H-1 … H-6), each labelled with the
finding IDs it would explain and with what evidence would confirm or kill it.

That structure is a direct response to this file's own history: **7 of 22 items
across passes 4, 5 and 6 were misdiagnosed in their brief** — the symptom real, the
stated cause wrong, the prescribed fix aimed at a bug that did not exist. A cause
written into a brief gets inherited as fact. **If the fix prompt is written from
this audit, keep the hypotheses labelled as hypotheses.**

### Coverage

18 routes × 7 mobile viewports (360×800, 375×667, 390×844, 414×896, 767×1024,
768×1024, 844×390) in light, plus `narrow` and `standard` in dark — **162 rows, 0
errors**. Real mobile contexts throughout (`isMobile: true`, `hasTouch: true`, a
plausible `deviceScaleFactor`); **no Playwright `devices[...]` descriptor matched any
of the seven sizes exactly**, so all seven are constructed. A resized desktop context
was used nowhere — it leaves `isMobile`/`hasTouch` at desktop values, which changes
how `dvh` resolves and how tap targets hit-test.

**19 findings: 3 blocking, 14 defect, 2 polish.** The three widest:

- **M-01 (blocking)** — 11 of 18 routes at **768–1023px** render their `page-hero`
  `h1` into a **144–274px** column at 46–50px type, wrapping to **4–7 lines**.
  `Four ways we help.` stacks as four single-word lines; `/work/team-performance`
  runs to seven. The same `/work` headline is **719px wide at 767** — over two
  rendered lines, not one; the width is as measured, the line count in the original
  summary was wrong (erratum in MOBILE-AUDIT.md's banner, 2026-08-09).
  Confirmed by screenshot as well as by measurement.
- **M-15 / M-06 (defect, resolved 2026-08-09)** — the concierge launcher is **234 × 50px at every
  viewport from 360 to 1440** (65% of a 360px viewport, 16.3% of 1440), and
  mid-scroll it covers **174 distinct route/element pairs** across all 18 routes —
  65 of them ≥50% covered, including each page's own `Let's Talk` at up to **81.1%**.
  **Zero persist at maximum scroll**, so it is entirely a transient condition.
- **M-09/10/11/12 (defect)** — DESIGN.md §8's 44×44 floor fails on **162 of 162
  rows**: theme toggle 38×38, every footer link 22.4px tall, nav lockup 30.4px,
  in-content links 18–23.2px. 73 distinct signatures, 2,707 instances.

**Clean, and worth knowing before anyone "fixes" it:** horizontal overflow is 0 on
161 of 162 rows (the exception is `/work` at 844×390, +5px, with **no element rect
crossing the edge** — M-17); element-to-viewport-edge is clean on all 162;
every `/contact` control is exactly 44px tall; the hero's right-edge bleed is
correctly **off** below `md`; and **dark mode returns identical counts to light on
all 18 routes for every check** — no finding in the report is theme-dependent.

**Two prior measurements re-confirmed rather than contradicted.** The nav CTA is
14/24px at 14.5px wherever it renders, matching Prompt 6 exactly — and it does
**not** render in the collapsed header below 768 at all, only in the drawer. The
`<header>`'s own `border-bottom` computes to `0px` at every viewport in both themes,
so the Prompt 4 `currentColor` fix has not regressed.

### The motion half — which override produced it

**This is the first pass that measured the motion-enabled path locally**, and the
qualification matters more than the result. Playwright drives its own Chromium and
its context option `reducedMotion: 'no-preference'` overrides the OS preference for
the page under test. Verified to have taken:
`matchMedia('(prefers-reduced-motion: reduce)').matches === false` inside that
context. **The machine's own setting (`MinAnimate = 0`) was not changed and must not
be — it is a standing accessibility preference.**

So: **every motion-on number in the report came from a context override, not from a
motion-enabled device.** Both items this file had listed as unconfirmed are now
closed on that basis, and the Known Gap row records the same qualification.

Everything else — the whole layout sweep — was taken under `reducedMotion: 'reduce'`
deliberately: a rect sampled mid-transition is a snapshot of an animation, not a
layout measurement.

Inventory highlights (full table in the report §5.1): `.reveal` transitions
`opacity` **and `translate`** at 500ms `cubic-bezier(0.16, 1, 0.3, 1)` — the Prompt 4
`translate`-not-`transform` rule verified intact in the shipped CSS, measured
mid-flight at `translate: 0px 5.74622px`. `.reveal` hooks fire **11/11, 8/8, 5/5,
3/3, 4/4, 1/1, 4/4, 2/2** against their server-rendered counts, and
`anyLeftInvisible` is empty on every route in both motion states.

**The reduced-motion floor holds, with one measured deviation.** Nothing left at
`opacity: 0`, `.tg-pin` computes to `position: static`, status dot
`animation: none` at 0.85 — but `getAnimations()` is **not empty**: one retained
Motion `Animation` on the launcher on 7 of 8 routes, eight on `/`. The `.tg-seq` ones
are pinned by `!important` and provably do not move. The launcher is not pinned;
sampling it returned `opacity: 1, transform: none` on 16 of 16 runs, **but those
samples land after a 240ms entrance would have finished**, so this does not prove the
entrance is suppressed. Filed as M-19 `polish` on that basis, with the corrected
measurement written into H-4. **Do not upgrade it to a confirmed accessibility gap
without running that measurement.**

### Two harness traps, both already paid for

- **`el.matches(rule.selectorText)` finds nothing if you test `rule.cssRules` first.**
  In current Chromium a `CSSStyleRule` also exposes `.cssRules` (for CSS nesting), so
  a grouping-rule-first walk treats *every* style rule as a container and returns
  zero matches. Check `selectorText` first, then recurse. This is what makes
  "which declaration does the height resolve from" answerable at all — it is how the
  concierge panel was traced to **no height declaration whatsoever** (content-sized,
  no `vh`, no `dvh`).
- **Tailwind's `sr-only` plus a later `px-4 py-3` reports a real rect.** The skip link
  measured 32×24 at `left: -1` and flagged as an undersized, clipped tap target on all
  18 routes before the visibility check learned to exclude
  `clip: rect(0px, 0px, 0px, 0px)`. It was a harness false positive, not a defect, and
  the finding was withdrawn.

Both fixes are in `scripts/audit-mobile.ts`. Re-run it with
`node --experimental-strip-types scripts/audit-mobile.ts all` — **not under Bun**,
same constraint as Prompt 5 — and let its own stylesheet-200 guard pass before
trusting any number it prints.

## Prompt 6 — nine scoped fixes

*Shipped 2026-08-07 in `8a17326`. The CLAUDE.md compression below followed in `2713070`.*

### The two places the brief and the repo disagreed

**Item 1 — the nav CTA was already correct.** The brief states `Let's Talk` in the
nav renders at `button-primary--large` (18×32px, ~16px text). It does not, and
nothing was changed. `components/nav.tsx:119` passes `size="nav"`, and
`components/button.tsx` maps that to `px-6 py-[14px]` at the base `text-[14.5px]`
— the standard size DESIGN.md §4 specifies. Measured live at 1280×900 via
`getComputedStyle`, all three `Let's Talk` instances on Home:

| Instance | Padding | Font size | Variant |
| --- | --- | --- | --- |
| Nav | 14px / 24px | 14.5px | standard `button-primary` ✓ |
| Closing CTA | 18px / 32px | 16px | `button-primary--large` — the one documented exception ✓ |

No CSS overrides either: `app/globals.css` carries no `button` rule, only the
`--tg-cta-*` colour tokens. The size exception is correctly confined to one place.

**Item 6 — a 15-*character* cap would have broken exactly what the brief was
protecting.** The brief is right that a hard 10-digit cap breaks international
support, and right that the validated range is 7–15 digits. But "capping entry at
15 characters" is the same mistake one breakpoint over: `+44 20 7123 4567` is a
valid 13-digit UK number and **16 characters**, so a `maxLength={15}` would cut it
mid-entry. `capPhoneDigits` in `lib/validation.ts` counts **digits** and leaves
formatting (`+`, spaces, parens, dots, dashes) unlimited — which is precisely what
`isPlausiblePhone` already measures, so the guard and the schema cannot disagree.
Verified with real typed input: 23 characters typed into the field truncate to 15
digits, and `+44 20 7123 4567` survives intact and validates.

### The other seven

- **Home Process teaser restored** (`app/page.tsx`) between Testimonial and the
  closing CTA, per CANONICAL §4 item 7. Copy is COPY.md's "Process teaser" block
  verbatim; the four condensed lines are the `teaser` field `content/process.ts`
  has carried since the master build *for exactly this section* — it was authored
  and then never rendered. No numerals: DESIGN.md §4 scopes `numeral-device` to
  `/process`. Not `tg-grid` — a 12-column `span 3` goes ragged at the 8-column
  tablet breakpoint; plain responsive columns give 4 / 2 / 1 with no overflow at
  375px. Verified in both themes (`#111` → `#F5F5F5`, borders `#E5E7EB` → `#2A2A2C`).
- **`/contact` trust-line dots removed** (`app/contact/page.tsx`). They used three
  of the four wayfinding accents as decorative bullets; those accents mean
  *solution line* everywhere else. Now identical to `closing-cta`'s treatment of
  the same three facts: one muted flex-wrap row, 3px `muted-soft` mid-dots,
  no colour. Measured: `rgb(106,113,126)` text, two `rgb(156,163,175)` 3px dots,
  zero accent backgrounds left in that column beyond the `flourish-mark` itself.
- **`flourish-mark` doc corrected** (DESIGN.md §4). Was "once per page, home
  only"; the dots ship on every route's first section, matching the export.
  Rendering untouched — the doc was the stale half. The `page-hero` entry carried
  the same stale claim ("no `flourish-mark` — that stays home-only") and was
  corrected with it. The *once per page* half stands and is unchanged.
- **`aria-describedby` no longer dangles** (`components/contact-form.tsx`). The
  hint is *replaced* by the error, not stacked, so the reference pointed at a
  removed node at the exact moment it mattered. Now `errors.phone ? undefined :
  'phone-hint'`. Measured through a real invalid-then-valid cycle: attribute goes
  `"phone-hint"` → `null` → `"phone-hint"`, tracking the element's presence.
- **Favicon set is now dark** (`scripts/generate-icons.ts`). Plate is
  `--tg-bg-dark` `#101010`, connectors lifted to `#4B5563` so they stay a
  hairline rather than glowing off the plate. `icon-master.svg` is **unchanged**
  and nothing else reads it — the nav lockup and footer render the mark as JSX
  (`components/logo-lockup.tsx`) and the OG images build their own, so no other
  surface moved. `app/icon.svg` took the plate too: it previously shipped
  transparent "so it adapts", which meant a tab could show a dark `.ico` in one
  browser and a bare mark in another.
- **Success copy replaced** in `components/contact-form.tsx` and `docs/COPY.md`.
  The em dash is the existing two-part split: "Message sent" stays the bolded
  status line beside the success dot, the remainder is the body paragraph.
- **Real test suite added** — see the Prompt 3 correction above.

### Also found, and fixed

**PLAYBOOK §13 says favicons are "generated from `icon-master.svg` at build
time". They were not.** `bun run icons` was manual and its outputs committed, so
the doc described an intent the pipeline never had — and a master edit could
silently ship stale icons. `prebuild` now runs `generate-icons.ts` ahead of
`check-media.ts`, which makes §13 true. Outputs stay committed and deterministic.

### CLAUDE.md compression (`2713070`)

CLAUDE.md loads on every session. It was ~3,874 tokens, 57% of it Hard rules and
21% "Verifying visually". Most rules were written as *rule + full incident
post-mortem*, and the post-mortem is already here — checked before cutting, not
assumed: `hover-card` appears 4× in this file, `FragmentInstance` 2×,
`MinAnimate` 2×, `tg-pin` 2×. Net **~3,874 → ~3,192 (18%)**. All 26 rules
verified present afterwards by keyword sweep; only case history was removed.

**The cascade/reconciliation block was deliberately left uncompressed** — about
800 tokens of what remains. Those six rules (`translate` vs `transform`, Tailwind
source order, `FragmentInstance`, the `currentColor` border, `RevealController`
deps, form-step keys) are the ones where the mechanism *is* the rule: reduced to
a bare imperative, a later session reasons its way around them, and they are
precisely the class of defect no linter can catch. Paying that cost per session
beats re-losing them. **Don't "finish the job" on that block later** — the 18%
is the ceiling, not a partial result.

The remaining structural lever, considered and **rejected**: moving the cascade
block to its own doc read on demand would reach ~2,400 tokens. A rule that isn't
in context is a rule that gets violated, and these are the expensive ones.

Two debugging recipes moved out of CLAUDE.md and now live only here — the
stale-port kill command and the Playwright/Bun constraint, both in the Prompt 5
verification notes. They are things to look up when stuck, not standing rules.
**If this file is ever restructured, those two need to survive the move.**

## Prompt 5 — project detail pages, the /process pin, and repo hygiene (eight items)

*Shipped 2026-08-07 in `513329e`, with the `sarah-thumb.webp` rename following in `8b27975`.*

### What the brief got right, and the two places it didn't

Six of eight items were as described. Two were not:

**The `/process` pinned moment was not "never built."** `components/process-steps.tsx`
has existed since the master build, wired into `/process`, with the sticky rail,
the progress fill, the `Step 0N of 04` readout and the `numeral-device` at 8%
opacity behind each title. What it had instead was **a progress indicator that
disagreed with the page.** It derived the active step from a fraction of the
section's *scrollable range* rather than from where the steps actually are:

```
p = -sectionRect.top / (sectionHeight - innerHeight)
active = floor(p * 3.999)
```

Measured at 1280×720: the scrollable range is 714px, the four steps span 1434px.
So the rail read **"Step 04 of 04" at 536px into the section, where step 04 does
not begin until 993px** — running a step and a half ahead of the content the
whole way down. The two measurements only coincide if the section happens to be
exactly twice the viewport height. Rewritten to read the step elements' own
positions against a reference line at 45% of the viewport; the readout and the
fill now agree with the content at every scroll position, measured.

**The pin's reduced-motion degradation rested on a coin flip.** It was
`lg:sticky lg:top-[140px] motion-reduce:lg:static`. Both utilities set
`position`, both have specificity (0,1,0), and nothing about the `motion-reduce:`
variant makes it beat `lg:` — which of them won was decided purely by their order
in the generated stylesheet. CANONICAL §6's accessibility floor cannot rest on a
utility sort order, so the pin is now `.tg-pin` in `globals.css`: a real rule
inside `@media (min-width: 1024px)`, overridden by `position: static !important`
inside the existing reduced-motion block, which is later in the file. Verified in
the built stylesheet by byte offset — sticky rule at 29519, static override at
30035.

### The eight items

| # | Item | Outcome |
| --- | --- | --- |
| 1 | Project detail pages: meta rail + `LiveFrame` | Shipped. Rail extracted to one `MetaRail` used by both tiers. |
| 2 | `Read the full story →` on `project-card` | Shipped. |
| 3 | Remove the rail's duplicate `Let's Talk` | Shipped, all 8 pages. |
| 4 | `/process` pinned moment | Already built; two real defects found and fixed (above). |
| 5 | Single root element on every route | Shipped, 7 routes. Measured: 1 `scrollIntoView` call per route across all 18. |
| 6 | `bun run lint` | Fixed. Runs, 0 errors, 1 reported warning. |
| 7 | Reveal coverage on `/process` and `/contact` | Shipped. `/process` 0 → 4, `/contact` 0 → 2. |
| 8 | `sarah-thumb.webp` rewire + documentation | Shipped. Build now fails at `check:media` until the file lands — expected. |

### Item 1 — the layout gap, and what the "weight distinction" actually protects

Project pages reused the case-study grid with a fraction of the content and no
rail at all: a narrow left column against a large empty right side, with the
Solution line, live status and demo link appearing nowhere on the page. The four
project thumbs in `content/work.ts` were rendered nowhere in the codebase.

Both tiers now carry the rail on cols 10–12. Content stays left-anchored — case
studies on 1–9, projects on 1–8, so thin copy is not stretched to fill. Measured
on `/work/restaurant-menu`: content right edge 722px, rail left edge 951px, the
col-9 gap intact; frame ratio exactly 1.600.

`project-card` still has no image, and that rule is unchanged — the weight
distinction it protects is between the two *card* treatments on the index and in
the amount of narrative content, not a rule that a project may never show its own
screenshot on its own page.

The project branch's standalone status-line-plus-demo-link row was removed:
`FrameMeta` beneath the new frame carries exactly that pair, and the rail carries
it again, so keeping it would have made three copies on one page.

### Item 6 — lint was not misconfigured, it was absent

There was no `eslint.config.*` and no `.eslintrc.*` of any kind. ESLint 9
defaults to flat config, found nothing, and exited before linting a file —
`eslint-config-next` had been installed the whole time and had never run once.

`eslint-config-next@16` ships a **native flat config** as its default export. It
is not loadable through `FlatCompat`; that path throws `Converting circular
structure to JSON` inside the eslintrc validator. Import it directly. No new
dependency was added.

Four problems found, three fixed:

- **`components/nav.tsx`** — `setState` in an effect to close the mobile drawer
  on route change. Moved to the adjust-state-during-render pattern, which React
  discards before paint instead of committing a render with the drawer still
  open over the new page.
- **`components/theme-toggle.tsx`** — the `mounted` flag set from an effect,
  purely to pick a glyph. Replaced with CSS: both glyphs ship, a `dark:` variant
  hides one, and the accessible name is two `sr-only` spans with the inactive one
  at `display:none`. This is what DESIGN.md §7 already required ("never gate on
  `useTheme()` or mount state when a CSS `dark:` variant solves it"). Verified in
  both themes: light shows the moon and announces "Switch to dark mode", dark
  shows the sun and announces "Switch to light mode", exactly one label exposed.
- **`eslint.config.mjs`** — anonymous default export. Named.

**Left as a warning, deliberately** — `components/contact-form.tsx:92`,
`react-hooks/incompatible-library` on React Hook Form's `watch()`. The React
Compiler skips memoizing the component rather than risking stale UI. The
mechanical fix is RHF's `useWatch`, but this is the file whose step-branch
reconciliation bug caused the field-contamination defect in Prompt 4, and
swapping its subscription API is a behavioural change, not a lint fix. Flagged
rather than done. Warnings do not fail `bun run lint`.

**What lint does not buy us, stated plainly:** of the three defect classes that
motivated turning it on, it catches one. Missing React `key`s: caught. A
`transition` shorthand resetting a longhand, and an unqualified Tailwind
`border-b` resolving to `currentColor`: **not caught, and not catchable by any
ESLint rule** — both are CSS cascade semantics and invisible to a JS/JSX linter.
CLAUDE.md's standing rules remain the only mechanism that applies to those.

### Verification — which half was actually proved

Per CLAUDE.md, this machine has OS-level reduced motion on and the Browser pane
runs hidden. Both held. What that permitted and what it didn't:

**Measured, not eyeballed:**
- `scrollIntoView` fires exactly **1** time per route, target a `DIV`, across all
  18 routes — instrumented `Element.prototype.scrollIntoView` and walked the site
  by clicking real in-page anchors. Client-side navigation works fine in a hidden
  pane; only compositing doesn't. (A synthesized `<a>` triggers a full page load
  and throws the instrumentation away — use existing anchors.)
- Reduced-motion path on `/process`: `.tg-pin` computes to `position: static` at
  1280px, all four steps at `opacity: 1` / `translate: none`, numeral at 0.08.
  The pin correctly degrades to a stacked list.
- Pin geometry under motion: forced the sticky declaration back on **with
  `!important`** and sampled `getBoundingClientRect()` across scroll positions —
  holds at `top: 140px` through the section and releases at its end. A plain
  inline style is not enough here and silently measures a still-static element,
  because the reduced-motion override is `!important`.
- The corrected rail math, replayed against the live DOM at eight scroll offsets:
  readout and fill agree with the step under the reference line at every one.
- Both themes on a project detail page by computed style: page `#101010`, text
  `#F5F5F5`, primary CTA inverting to a `#F5F5F5` fill with `#101010` text.
- All 4 project cards: no nested anchor, no extra focusable child, still one tab
  stop each.

**Confirmed by eye, at 1440×900**, once the Browser pane was displayed: all four
project detail pages (rail populated, real `LiveFrame` rendering actual product
UI, `Live · checked just now` + demo link beneath it, no `Let's Talk` in any
rail, no testimonial on the three that shouldn't have one), and
`/work/field-photo-reports` as a case-study spot-check — frame, meta row, Try it,
How it's built, prev/next all intact, rail sticky at `top: 116px` with zero
buttons. Screenshots time out whenever the pane is hidden; nothing else does.

**Confirmed by the user on a motion-enabled device (Pixel 9A, 2026-08-07) — the
motion layer works.** Two independent confirmations, which together close the
question that had been open since Prompt 4:

- **The concierge's four-segment thinking stripe shimmers.** It had rendered
  static on the dev machine, which looked like a defect and is not one: DESIGN.md
  §4 specifies a static four-segment bar as the `prefers-reduced-motion`
  fallback, and `globals.css` implements exactly that
  (`.shimmer-seg { animation: none !important }`). The static bar was the spec
  working, not the animation failing.
- **The hero's entrance sequence (flourish dots → headline → subhead → CTA) is
  visible**, so the load-sequence and reveal layers both run correctly on a real
  device.

This is the first direct evidence that the entrance system runs end to end. Every
prior pass could only verify its wiring.

**Still not verified on this machine, and deliberately not attempted:** anything
requiring motion. Windows animations are disabled here as a standing preference,
so `prefers-reduced-motion: reduce` matches everywhere. The *wiring* is verified
by server-rendered class counts, computed styles, and the corrected rail formula
replayed against live DOM geometry — **the motion-enabled path is the user's to
verify, and emulating around it here is not worth the time it costs.**

### A trap that cost real time this session — read before verifying anything

**A stale `next start` can hold port 3210 and serve a previous build.** Several
servers were started across the session; `pkill`/`Stop-Process` did not clear
them all, and the survivor kept serving HTML referencing chunk filenames that no
longer existed on disk. Those chunks 404'd as **500s**, so a fresh browser got
the page with **zero CSS rules and no hydration** — which looks exactly like
catastrophic breakage: pin static, progress fill stuck at 0%, no reveals armed,
step padding 0. All of it was the stale server.

Kill by port, not by process name, and verify before trusting any result:

```
(Get-NetTCPConnection -LocalPort 3210 -State Listen).OwningProcess | % { taskkill /PID $_ /T /F }
```

Then confirm the stylesheet the served HTML references actually returns 200
before drawing a single conclusion from that page.

**Also, for anyone reaching for Playwright here:** it is a devDependency and it
works, but **only under `node --experimental-strip-types`, not under Bun** —
Bun's stdio handling breaks Playwright's `--remote-debugging-pipe` on Windows and
`launch()` times out after 180s with the browser process visibly spawned. The
script must live inside the project directory to resolve `playwright` at all.

## Prompt 4 — shared-component fix pass (five items)

### 1. The "invented placeholder content" is the asset file, not any code

**There is no coded fallback, and no placeholder branch anywhere.** `components/live-frame.tsx`
has exactly one render path — `<Image src={poster}>` — with no conditional, no
error state, and no styled stand-in markup. A repo-wide search for fabricated
strings (`SARAH`, `VOICE ASSISTANT`, `Audio Synthesis`, `placeholder`, `fallback`)
returns nothing in any rendering component. `content/work.ts` is wired correctly:
all 8 `poster` paths and the one `heroPoster` resolve to files that exist.

What renders is the `.webp` itself. Opened directly:

- `sarah-project-thumb.webp` (1080×1059) **is** the "SARAH (VOICE ASSISTANT)"
  quote card — a crop of the phone-call **simulator widget**, which is the exact
  asset PLAYBOOK §12 names as the hard-rule violation ("a widget *inside* the
  real product, not the product"). It is also **not listed in §12's inventory at
  all** — §12 documents `sarah-poster.webp` for the hero and nothing for the AI
  Voice Receptionist's compact context.
- `crunch-wrap-dashboard.webp` (1080×1038) is a genuine capture of the real
  crunch-wrap app, but zoomed into one detail view — header, "Audio Synthesis
  Report", a `Demo Mode` tag. It is documented in §12; it is just the wrong shot.

Measured ratios — **every compact asset is off the locked 16:10, only the hero
passes**:

| Asset | Size | Ratio |
| --- | --- | --- |
| `sarah-poster.webp` (hero, 16:9) | 1600×900 | **1.78 ✓** |
| `field-ops-thumb.webp` | 769×754 | 1.02 |
| `sarah-project-thumb.webp` | 1080×1059 | 1.02 |
| `shopify-configurator.webp` | 1080×1140 | 0.95 |
| `crunch-wrap-dashboard.webp` | 1080×1038 | 1.04 |
| `advantage-teams` / `meeting-organizer` / `dragonfly-nica` / `executive-detailer` | 600×450 | 1.33 |

`object-fit: cover` on a 1.02 source in a 1.60 frame discards ~36% from the
bottom, so what survives is the top strip of a zoomed-in sub-view — which is why
it reads as a fabricated card. This is Known Gap #3, now quantified.

**Added: `scripts/check-media.ts`, run automatically by `prebuild`.** A wrong or
missing filename now fails `bun run build` instead of silently shipping a blank
frame, and off-ratio assets warn with their measured numbers. This is what makes
"drop the recaptured `.webp` in under the documented name and it renders, no code
change" actually true rather than assumed. Run it alone with `bun run check:media`.

**No image was fabricated, sourced, or generated.** No neutral fallback was
built either — there is no code path to replace, and inventing one would add a
branch that never fires once the real files land. If a *missing* file should
degrade to a hairline empty frame rather than fail the build, say so and it's a
small change.

### 2. Nav hairline over the signature stripe — an uncolored Tailwind border

`components/nav.tsx:68` carried an unqualified `border-b` on the `<header>`. In
Tailwind v4's preflight, borders default to `0 solid` with **no color**, so
`border-b` resolved to `currentColor` — `rgb(17,17,17)` in light,
`rgb(245,245,245)` in dark. The header therefore painted an opaque 1px line at
**every** scroll position, including scroll 0 where DESIGN.md §4 says the nav has
no border at all.

Geometry: the nav is `sticky`, so it sits in flow — 76px content + that 1px =
77px, and `SignatureStripe` is the very next element, starting flush at 77. The
line landed directly on the stripe. Once scrolled it also doubled the *real*
hairline, which lives on the separate absolutely-positioned fill layer
(`nav.tsx:71`, colored by `--tg-nav-border`). Not a z-index, stacking, or
negative-margin problem — a second, uncolored border on the wrong element.

Fix: removed `border-b` (and the now-dead transition) from the `<header>` only.
The fill layer keeps the one specified hairline, so the scrolled state is
unchanged everywhere.

Measured, header `border-bottom`: light `1px rgb(17,17,17)` → `0px`; dark
`1px rgb(245,245,245)` → `0px`. Header bottom edge 76.8 → 76.0, stripe
`[76.0, 82.0]` flush beneath it. A full-DOM sweep for any painted horizontal
border ≥200px wide in the y 70–90 band returns `[]` in dark mode, and in light
mode only the fill layer's own border at `rgba(229,231,235,0)` — transparent, as
specified at scroll 0. The collision was global (the nav is global) and so is the
fix; verified on all 7 routes, 3 stripes each.

### 3. `/contact` landing position — a route-transition scroll, not an autofocus

**There is no `autoFocus` anywhere in the tree** — exhaustive grep across `app/`,
`components/`, `lib/`, `config/`, `content/`, and `document.querySelectorAll('[autofocus]')`
returning `[]` on the live page. Nothing in `faq-accordion.tsx` ran on mount
either: no effect, no `scrollIntoView`, `open` starting at `null`. On a hard load
an instrumented `scrollIntoView`/`focus` log was completely empty. It is a
**client-side route-transition defect only**, which is why it never reproduced on
a refresh.

`app/contact/page.tsx:30` returned a **multi-child fragment**. Next.js scrolls the
new segment into view on every transition; because the page was a fragment, React
handed Next a `FragmentInstance`, whose `scrollIntoView()` calls
`Element.scrollIntoView()` on *every* top-level child, relying on the last call to
win. Instrumented stack, captured on a real transition into `/contact`:

```
scrollIntoView  SECTION.pb-32                  <- the FAQ, y=1422
scrollIntoView  DIV.tg-container tg-grid…
scrollIntoView  DIV.grid h-[6px] grid-cols-4   <- the 6px stripe
scrollIntoView  SCRIPT                         <- zero box, no-op
  at FragmentInstance.scrollIntoView (react-dom)
  at disableSmoothScrollDuringRouteTransition (next/dist)
```

`main`'s children were `SCRIPT(0px) · stripe(6px) · grid · section.faq`, so the
**first** call scrolled to the FAQ and the call meant to undo it landed on the
JSON-LD `<script>` — and `scrollIntoView()` on a zero-box element does nothing
(measured: `script.scrollIntoView()` with `scrollY` at 1500 left it at 1500). The
resting position was decided by an accidental fallback rather than the top of the
page.

Fixed by giving the page a single root `<div>` (JSON-LD stays inside it): one
child, a real layout box, its top the top of the page. Measured **5
`scrollIntoView` calls → 1**, on the wrapper at y=76.

**Honest limit:** on this Chromium the resting `scrollY` was **0 both before and
after** — the stray FAQ scroll was real and measured, but the final landing
position only went wrong on the user's device. What is proven is that the FAQ is
no longer a scroll target at all. Independently re-verified after the fact: a real
client-side navigation from `/` scrolled to 900 into `/contact` at 375×812 settles
at `scrollY: 0` and holds it for 2s, `activeElement` `BODY`, no panel open.

`faq-accordion.tsx` also had genuinely broken a11y, now fixed: panels used to
unmount when closed, so **0 of 6** `aria-controls` resolved to an existing element
on page load — the exact state a screen reader meets. Panels now always render and
collapse with `hidden` (6 of 6 resolve), triggers carry `id`, panels carry
`role="region"` + `aria-labelledby`, and WAI-ARIA arrow-key roving was added
(Up/Down with wrap, Home/End) — the only `focus()` call in the file, reachable
only from a real `keydown`. Focus deliberately stays on the trigger when a row
opens.

### 4. Motion — three separate causes, only one of them a code bug in the audited list

The claim "almost none of this fires" is accurate. It has three independent
causes and they need separating, because two of them are not what they look like.

**(a) The machine has `prefers-reduced-motion: reduce`.** `HKCU\Control
Panel\Desktop\WindowMetrics\MinAnimate = 0` — Windows "Show animations" is off,
which Chrome maps straight to the reduce preference. `reveal.tsx` correctly bails
on it, and `globals.css` force-disables every transition. **This alone explains
the entire symptom, including the specific tell**: hover still "works" because a
hover *state change* still applies, just instantly — so entrances look dead while
hover looks alive. Verified in the running app: `matchMedia(...).matches === true`,
`armedCount: 0`, `document.getAnimations()` running: `[]`, nothing hidden, status
dot static at exactly 0.85. That is the spec's required behavior, not a defect.
**This setting was not changed — it is an accessibility preference and the user's
to set.**

**(b) A `transition` shorthand was cancelling the reveal — the real code bug.**
`.hover-row` and `.hover-card` (`globals.css:435`, `:448`) each declare a
`transition` **shorthand**, which resets every transition property, and they sit
*later* in the file than `.reveal` (`:367`). So on every element carrying both —
`solution-row` (`reveal hover-row`) and `project-card` (`reveal hover-card`), i.e.
exactly two of the three components Pass 3 reported as hooked up — the entrance
transition was wiped out entirely. Measured before: `transition-duration: 0.24s`,
`transition-property: border-color`. The classes were wired correctly; the CSS
silently cancelled them, which is why the hook-up looked done and looked dead.

Fixed by declaring the combined transitions once for `.reveal.hover-row` and
`.reveal.hover-card`, and by moving the 16px rise from `transform` to the
independent **`translate`** property so the entrance and the hover lift compose
instead of fighting over one value with two durations. Measured after —
`project-card`: `opacity, translate` @ `0.5s, 0.5s` + `transform, border-color` @
`0.24s, 0.24s`. State machine, transitions suppressed to read targets:
default `[1, none]` → armed `[0, 0px 16px]` → revealed `[1, none]`, on both a
plain `.reveal` and a `.reveal.hover-card`. The visible-by-default safety
property is intact.

**(c) The controller never re-ran on a client-side navigation.**
`RevealController` is mounted once in the root layout with `useEffect(..., [])`,
and the root layout does not remount when a `<Link>` navigates. So every route
reached by clicking — which is how a visitor actually moves through the site —
got no observer at all. Now keyed on `usePathname()`, with the arming pass
deferred one `requestAnimationFrame` so `<ViewTransition>` can't leave the new
DOM unqueryable.

**Coverage was also simply missing.** `.reveal` hooks per route, server-rendered,
before → after:

| Route | Before | After |
| --- | --- | --- |
| `/` | 4 (solution rows only) | **7** (+2 Featured Work rows, +testimonial) |
| `/work` | 8 | 8 |
| `/solutions` | 4 | 4 |
| `/work/[slug]` case study | **0** | **5** |
| `/work/[slug]` project | **0** | **2** |
| `/solutions/[slug]` | **0** | **1** |
| `/process`, `/contact` | 0 | 0 — see Known Gaps |

The home Featured Work rows were missed because `BandRow` in `app/page.tsx` is a
**separate local component** from `components/case-study-row.tsx`; Pass 3's
"hooks re-added to case-study-row" was true and still left the home band's most
prominent scroll content with nothing.

**Not broken, checked:** the hero load sequence (`SequenceRoot trigger="load"`)
and the closing-CTA echo (`whileInView`, `once: true`, `amount: 0.3`) are both
implemented per §6 and correctly pinned visible under reduced motion by `.tg-seq`.
They do not need `.reveal` and did not get it.

### 5. Contact form cross-field contamination was not autofill at all

`components/contact-form.tsx:153`, the `step === 1 ? … : …` ternary. Both steps
live in the same `<form>` and only one renders at a time, but React reconciled
the two branches **in place**: each renders a `<div>` at the same position, so the
child `<input>` elements were patched, not replaced. The name input literally
*became* the phone input and the email input *became* the website input. They are
uncontrolled (RHF `register` + ref), so React never rewrote `value` — the typed
text stayed in the node and RHF absorbed it back into form state.

Proved live with autofill never invoked: `phoneIsOldNameNode: true`,
`phone.value === "Dana Whitfield"`; `websiteIsOldEmailNode: true`,
`website.value === "dana.whitfield@northgatelogistics.com"`. It also explains why
**Company** was never contaminated and never in the bug report: step 1's first
child is a `<select>` against step 2's `<input>`, different element types, so
React did replace that one.

Fixed with `key="step-1"` / `key="step-2"` on the branch wrappers, forcing a real
unmount/mount. After: both fields `""`, old nodes gone from the document, Back
still restores step 1, and a Step 2 → Back → Continue round trip preserves values
with no cross-contamination.

`autoComplete` was genuinely missing on every input and is now set
(`name`, `email`, `organization`, `tel`, `url`, explicit `off` on both selects and
the textarea) — but it was secondary, not the cause. `hp_confirm` is untouched:
same name, still `autoComplete="off"` + `tabIndex={-1}`. **`website` keeps
`type="text"` with `inputMode="url"`**, deliberately: `lib/validation.ts` accepts a
bare `tekguyz.com`, which `type="url"` treats as malformed, and that would put a
stricter rule in the markup than the shared schema. No two inputs share an `id`.

---

## Prompt 3 — three scoped fixes

### 1. Optional fields were unvalidated

`phone` and `website` were `z.string().optional()`, which accepted anything once
filled — `aedD@DWDD@#33uyz.com` reached the CRM as a website and a 19-digit run
as a phone number. Optional means the field may be **blank**, not that a present
value goes unchecked.

Rules now live in `lib/validation.ts` and are imported by **both** the client
schema (`components/contact-form.tsx`) and the server schema
(`app/actions/contact.ts`), so the two cannot drift — if the client were looser
the server would reject a submission the visitor was told was fine.

- **Website:** accepts bare domains (`tekguyz.com`), `www.`, an explicit scheme,
  and any path/query/hash. Rejects credentials in the authority (which is what
  the garbage input actually was), non-http(s) schemes, whitespace, hyphen-edge
  labels, and single-character TLDs.
- **Phone:** plausibility, not format — a sane character set plus an E.164-shaped
  digit count of 7–15. Deliberately not a US pattern, since delivery is
  nationwide and enquiries are international.
- Errors render inline under the field via the existing `FieldError`, on blur and
  on submit, with `aria-invalid` set. The phone hint is swapped for the error
  rather than stacking beneath it.

~~25 unit cases pass, including both exact garbage inputs.~~ **Corrected
2026-08-07 (Prompt 3): that claim was unbacked.** No test file, script, or test
framework existed anywhere in the repo — the rules had only ever been exercised
by hand in the browser. A real suite now exists at **`lib/validation.test.ts`**
(Vitest, `bun run test`): **46 cases pass**, covering both documented garbage
inputs, the credentials-in-authority rejection, the 7- and 15-digit phone
boundaries with real international numbers, bare-domain / `www.` / explicit-scheme
website variants, the `capPhoneDigits` typing cap, and the blank-vs-filled
behaviour of both optional schemas. Vitest is the only dependency added.

Browser verification (unchanged, and re-confirmed this pass with real typed
input): errors appear on blur, submission is blocked with nothing dispatched, and
valid values (`tekguyz.com`, `(954) 555-0123`) clear the error and restore the hint.

**Known strictness, accepted:** `1 (954) 555-0123 ext 4` is rejected because of
the letters. Allowing them would also admit `555-CALL-NOW`. The field is
optional, so the cost is low — revisit if real leads hit it.

### 2. Concierge replies read as a filled-in template

Markdown rendering was already fixed; the *content* was the problem, and the
cause was the system prompt itself — it literally instructed a numbered
template ("**The line**", "**The components**", "**The closest existing
build** — … give its page path"). The model was doing exactly as told.

- The three things a good reply covers are now described as substance to get
  across "without ever announcing that it is doing so", not as labelled fields.
- Two hard rules added: never print a raw route path or slug as visible text
  (name the build instead, and use a markdown link when a link is warranted —
  `[Team Performance](/work/team-performance)`), and never surface internal
  structural labels.
- `lib/concierge/grounding.ts` relabelled its `Page:` fields to
  "Link target (use only inside a markdown link, never as visible text)", since
  labelling them `Page:` was itself an invitation to echo them.
- Lists remain allowed — the components genuinely are a list. The banned thing is
  visible field names, not list formatting.

The renderer already supports `[label](/path)` with sanitized hrefs and renders
internal links without `target="_blank"`, so instructing links was safe.

### 3. Scroll reveals restored, correctly

Reinstated with IntersectionObserver per DESIGN.md's correction, replacing the
`animation-timeline: view()` attempt that was removed outright.

- `components/reveal.tsx` adds `is-revealed` on first intersection and calls
  `unobserve` immediately — genuinely once, which a scrubbed timeline cannot
  express (it ran in reverse on scroll-up and content vanished again).
- Plain CSS transition on the class change. Threshold 0.15, 80ms stagger via
  `data-reveal-index`, capped at 4 steps.
- **Content is visible by default.** `.reveal` alone does nothing; the hidden
  state lives on `.reveal-armed`, which only the controller adds, from an
  effect. An element can therefore only be hidden once JS is running and an
  observer is already attached to un-hide it. No JS, no observer support, a
  hydration failure, print, or a non-scrolling crawler all render the page
  fully visible — the blank-homepage bug is structurally impossible now.
- Anything already on screen at mount is revealed without animating, so
  above-the-fold content doesn't fade in on first paint.
- `prefers-reduced-motion` bails before arming anything, with a `!important`
  backstop in CSS.
- Hooks re-added to `case-study-row` (on the row, never the halves — text and
  media enter as one unit), `project-card`, and `solution-row`.

---

## Prompt 2 — what changed, and why

**The design export is now ground truth.** DESIGN.md's prose is a translation of it; where they disagreed, the export won. The rebuild touched nearly every component.

### The eight confirmed items, all fixed and measured in the live DOM

| # | Item | Measured result |
| --- | --- | --- |
| 1 | Nav CTA | `padding: 14px 24px`, `border-radius: 8px`, 14.5px — the only button size in the nav |
| 2 | Closing CTA | Subhead and trust row are separate elements; trust row is `flex-wrap: wrap` with 3px dot separators; button measures `18px 32px` at 16px |
| 3 | Footer bottom bar | Copyright only — 0 links in the bar, exactly 1 Privacy link site-wide (Company column) |
| 4 | Concierge FAB | `padding: 16px 24px`, `border-radius: 8px`, fixed 24/24 — same radius as every other button, not a pill |
| 5 | Thinking indicator | 72px x 3px, 4-column grid, 4 segments, inline beside the word "Thinking" |
| 6 | Image frames | Native `aspect-ratio: 16 / 10`, `overflow: hidden`, `padding-top: 0px` (no padding hack), `object-fit: cover`, `object-position: 50% 0%` |
| 7 | "How it's built" | 4 instances on `/work`, 1 on each standalone detail page |
| 8 | Theme toggle | 38x38, 6px radius, 1px border, 18x18 SVG, `stroke-width: 1.75`, export's exact moon/sun paths |

### Found in the audit, beyond that list

- **Honeypot was broken.** `hp_confirm` was declared `z.string().max(0)`, so a filled honeypot failed schema parsing and returned "Invalid fields" — the silent-accept branch underneath was unreachable dead code, and a bot got a clear signal it had been caught. Fixed on both client and server; verified a filled honeypot now shows success while dispatching nothing.
- **Scroll reveals removed.** `animation-timeline: view()` is a *scrubbed* timeline, so scrolling back up ran it in reverse and content that had appeared vanished again — the specified `once` semantics are not expressible with it. With `opacity: 0` resting state it also rendered half the homepage blank in any non-scrolling context. The export carries no section reveals at all, only the closing-CTA echo (Motion, real `once`). That is what ships.
- Hero media is a **surface-filled panel** bleeding `calc(-1 * max(0px, (100vw - 1216px) / 2) - 10vw)` past the right edge with `border-radius: 16px 0 0 16px` — not a bare image.
- Solution tags are **bordered pills** (`1px rgba(accent,.35)` over `rgba(accent,.12)`), not bare tints.
- Nav is 76px with an animated `::after` underline (scaleX, 240ms); scrolled state is 82% opacity + 14px blur.
- Inner-page headlines are at **hero** scale, not display scale.
- Flourish dots appear on **every** route's first section, at 9px with a 9px gap.
- Testimonial rebuilt as an ink card with real quotation marks — deliberately not the pull-quote treatment.
- FAQ rebuilt as hairline rows with one-open-at-a-time, replacing `<details>`.
- Concierge replies now render **markdown** (bold, lists, links, inline code, rules). The live model reliably emits all of these and they were showing as raw syntax. Link hrefs are restricted to http(s)/mailto//.
- `/contact` correctly carries **2** signature stripes, not 3 — the export has no closing CTA there, since the page itself is the ask.

### Live integration verification (real credentials, real dispatches)

- **Contact form, real submission through the real UI**: CRM accepted `200`; Resend notification `id=a6753c52-0f29-4fb1-82ca-aa72f8fddcf1`; confirmation `id=38270e96-7bb4-4e60-895a-186ba9c150d3`.
- **Honeypot**: success state shown, zero dispatch log lines — nothing sent.
- **Concierge lead capture**: ran through the *same* shared action with `source="AI Concierge"` (CRM `200`, Resend `id=b6414b05-0ef1-45b6-a195-054acf3fd604`), confirming the single-implementation rule.
- **Gemini 3.6 Flash**: real blueprint-shaped replies, no price, no timeline.
- **Upstash limiter is genuinely in use** — no fallback warning, limit trips at exactly the 12th request, and Upstash holds the limiter's own keys (`tg:concierge:*`).

### Deploy

- Repo pushed to `https://github.com/tekguyz/tekguyz-site.git` (branch `master`). The repo is **public**; verified before pushing that `.env.local` is untracked and no secret-shaped strings exist anywhere in the tree.
- ~~**Preview** deployed to a NEW Vercel project `tekguyz-site` — deliberately not `tekguyz-website`, which is the project actually serving tekguyz.com. The preview carries no domain alias, so it cannot affect the live site.~~ **WRONG, and corrected 2026-08-09 (Prompt 11). Read the correction below before acting on anything in this section.**
- ~~The preview has **no environment variables set**, so the contact form and concierge will fail at runtime there.~~ **Unverified as of the correction — see below.**

**Hosting, as measured 2026-08-09 against the Vercel API.** There is exactly
**one** project: **`tekguyz-site`** (team `tekguyz`), and it carries **`tekguyz.com`,
`www.tekguyz.com`**, `tekguyz-site.vercel.app` and the branch alias.
**`tekguyz-website` does not exist** — it is not in the team's project list.
`.vercel/project.json` in this repo points at `tekguyz-site`.

**So every push to `master` deploys to production.** Confirmed from the
deployment list: every deployment since the one for Prompt 4's `651be7d`
(the commit whose own message claims it was a preview)
carries `target: "production"`. **Prompts 4, 5, 6, 8, 10 and 11 all shipped
straight to live traffic.** The "preview" framing was wrong from the moment it
was written, and because it lived here it was repeated as fact in
`docs/CANONICAL.md` §9 — the highest-authority doc — where it survived four
prompts.

**How it surfaced:** it was quoted back to the user as reassurance after a push
("this should deploy a preview and not touch live traffic"), and the user
corrected it. A hosting claim nobody re-measured became the basis of a safety
statement about a live site. **The lesson is the mechanism, not the fact:** the
deploy topology is external state, it drifts without touching the repo, and no
build or test catches it. Re-measure it against the Vercel API rather than
citing this file, and treat any push as production until that check says
otherwise.

**Production environment variables: SET, and confirmed 2026-08-09.** All five
are present — user-confirmed, and independently corroborated by the runtime
telemetry below. The "no environment variables set" claim above is dead; it
described the first hours of the project's life and was never re-checked.

**How it was corroborated, because the method is the reusable part.** This was
first written up as "unknown, owned by a human" on the reasoning that a build
proves nothing (`new Resend()` is lazily constructed precisely so a build passes
without secrets) and an HTTP probe would mean pushing a real lead through the
real CRM. **Both true, and both irrelevant — the question is answerable from
runtime telemetry, read-only, without touching a single byte of user data:**

- `get_runtime_errors` over 7 days returns **exactly one error group**:
  `Concierge route error: Error: GEMINI_API_KEY is not set`, **count 1**, at
  `2026-08-06T18:05:09Z`, on the *original* Prompt 4 deployment. **Nothing
  since.** That single error, and its silence
  afterwards, is the transition from unset to set, recorded in the logs.
- `get_runtime_logs`, production, 7 days, grouped by status code: **47 requests,
  all 200, zero non-200.** Low traffic, so treat the 200s as corroboration
  rather than proof on their own — the error table is the load-bearing evidence.

**The lesson, and it is not "check env vars".** A secret's *value* is
deliberately unreadable — the Vercel connector exposes no environment-variable
tool at all, and the nearest thing (`get_project_deployment_protection`) states
outright that password values are never returned. That is correct design; a
tool that could read them is one hop from a key landing in a transcript. But
**"I cannot read the value" is not "I cannot answer the question."** What a
missing secret *does* is throw at runtime, and runtime errors are readable. When
a check looks blocked, ask what observable the thing produces before declaring
it unknowable — declaring it unknowable was the actual error here, and it
would have handed a human a task that took one read-only API call.
- **Third bug, found only by deploying:** `new Resend(process.env.RESEND_API_KEY)` ran at module scope, and `new Resend(undefined)` throws on construction. Merely importing the action exploded during Next's page-data collection, so the Vercel build failed while passing locally purely because `.env.local` existed here. The client is now constructed lazily, and a full build with every secret removed is verified green (45/45 pages).

### Deliberate deviations from the export, for the record

1. **Typography.** The export loads Geist + Inter. CANONICAL §2 dropped Inter in favour of Geist-only plus Geist Mono, a decision made *after* the export, and Mono-on-tags was explicitly confirmed. Geist + Geist Mono ships. **Overrule this if the export's pairing is what you actually want.**
2. **`/solutions` routing.** The export renders one long page with four inline sections; CANONICAL §4 reversed that to an index plus four routes because a `#fragment` is not a separate URL to a search engine. Routing follows CANONICAL; the export's section treatment is applied to the four detail pages.
3. **Project detail pages keep an "Open it in a new tab" link.** The export shows only a status line there, but that would leave four of eight builds with no way to open the demo from their own page, against the entire brand thesis.
4. **Project card copy** uses COPY.md's `summary` verbatim; the export shows a shortened variant, and copy is authored in COPY.md.

*(Claude Code: append a row here each time a new prompt completes, with a one-line summary of what it covered.)*

## What the master build actually shipped

- **Routes (18):** `/`, `/solutions`, `/solutions/[slug]` ×4, `/work`, `/work/[slug]` ×8, `/process`, `/contact`, `/privacy`, plus `not-found`, `error`, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, and 15 `opengraph-image` routes.
- **Verified at build time:** hero headline measures 72px wrapping to exactly 3 lines with the CTA row in the first viewport; hero media 16:9 `cover` bleeding past the right viewport edge with no horizontal page scroll; compact `LiveFrame`s all 16:10; exactly 3 signature stripes on every one of the 18 routes; the four-colour moving treatment present in exactly one place (the concierge's thinking state); primary button inverts to `#F5F5F5`/`#101010` in dark mode; `muted` → `muted-dark` swaps `#6A717E` → `#747C8B`; OG eyebrows use the `-text` variants (amber measured at 5.92:1, not the plain accent's 2.00:1).
- **Reduced motion verified live** (the build machine has the preference set): every entrance inert, status dot static at 0.85 with `animation: none`, zero elements left hidden.
- **No hydration warnings** in a production build.

### Decisions taken during the build, for the record

1. **Doc conflicts resolved by authority order.** CANONICAL §4's ASCII IA block still describes the withdrawn single anchored `/solutions` page; the prose below it reverses that, and SEO.md agrees — built as index + 4 detail routes. COPY.md's home solution links still point at `/solutions#anchor` and its nav note still says "four anchor links"; both now resolve to `/solutions/[slug]`. COPY.md and CANONICAL §4 both still describe the hero as the `sarah-demo.mp4` loop; CANONICAL §1 explicitly resolves that to a static image, so the hero ships `sarah-poster.webp` and the mp4 is untouched. **These four should be corrected in the docs.**
2. **`flourish-mark` vs the closing-CTA echo.** DESIGN.md's `closing-cta` entry describes the echo as "flourish dots → headline → subhead → button", but the Do list says "one flourish-mark per page, home only". The absolute rule wins: the closing CTA replays the sequence's *timing* and does not render a second set of dots.
3. **`[NEEDS REAL DATA]`** on the Field Photo Reports outcome is never rendered. The sentence ships as COPY.md's own qualitative wording, extended with "with no site visit required to confirm any of it" — language taken verbatim from PLAYBOOK §6 for that build, not invented. **Worth a copy review.**
4. **Geist Mono confirmed for tag labels** (DESIGN.md §2's optional third use), alongside the two locked uses.
5. **`updatedAt` is assumed**, not sourced — all 8 entries set to `2026-08-05`, the date the narratives were authored into COPY.md. Static routes keep request-time `lastModified` as the documented lesser fallback.
6. **Testimonial "Read it on Google"** points at the GBP listing from PLAYBOOK §9, since the direct review permalink is still open.

## Decisions still open

*Distinct from Known Gaps: these are not deferred work, they are questions a human
has to own and has not yet. Each is listed with the finding it gates and what a
decision would have to specify. **None of these is resolved below** — if one reads
as obvious, it is still open.*

1. ~~**Launcher form factor below 414px**~~ — **decided and shipped 2026-08-09
   (Prompt 10): full size with a yield rule.** No width variant, no icon collapse,
   label unchanged. Rationale, now in DESIGN.md §8: shrinking below 414px answers
   M-06's width and does nothing for M-15, where 109 of the 174 pairs occur above
   414px. Yielding answers both with one mechanism and extends the existing
   never-over-the-hero rule rather than inventing a second one. The
   `Ask about your project` label survives — and item 5, which reopened it on
   copy-authorship grounds, is now **closed too**: the label is human-confirmed.
2. ~~**M-15's acceptance criterion**~~ — **decided and shipped 2026-08-09
   (Prompt 10): the hard number.** No route/element pair above **25% coverage at
   any sampled scroll step**. The transience argument was real but unverifiable by
   a fix pass; a number is. Recorded in DESIGN.md §8 and re-measured against the
   audit's own occlusion sweep.
5. ~~**The launcher's label**~~ — **confirmed by the human 2026-08-09 (Prompt 11).
   `Ask about your project` stays, as shipped, unchanged.** It was opened
   2026-08-09 by CLAUDE.md's copy-gap rule on the grounds that it is
   Claude-Design-generated rather than user-authored; it is now user-confirmed,
   which is the only thing that was missing. No code change — the label was live
   throughout and carried no `[NEEDS COPY]` marker, correctly, because the slot
   was never empty. **This item is closed. Do not reopen it as "unconfirmed".**

   **Candidate-list drift, recorded because the mechanism failed, not the
   outcome.** Prompt 10's report proposed `Ask about your project` /
   `Tell us what's slowing you down` / `See what we'd build for you` /
   `Ask what we'd build`. What was later written into this file was
   `Ask about your project` / `Tell us what you're dealing with` /
   `Ask what we'd build` / `Start a conversation` — **regenerated from scratch
   rather than transcribed**, and one of the new entries collided with the
   concierge's own input placeholder (`Describe what you're dealing with…`), so
   the list offered the human an option the product already says elsewhere. The
   copy-gap rule exists to make a gap *visible*; regenerating the candidates
   re-opened the same hole one level up, in the artifact meant to close it.
   `CLAUDE.md` now requires candidates to be transcribed from the report that
   proposed them and collision-checked against `docs/COPY.md`.
3. ~~**The concierge disclaimer**~~ — **decided and shipped 2026-08-11: `A
   starting sketch, not a quote.`** Picked by the human from four candidates
   transcribed into the question that offered them, collision-checked against
   `docs/COPY.md`'s concierge block first. **Measured: 31 characters, one line at
   360px**, the worst case — it was 86 characters and 2 lines at every viewport
   including 1440, which is why the slot existed.

   **The dropped clause was dropped on the human's instruction**, and the reason
   is recorded because it is not self-evident from the string: the old copy ended
   `— pricing always comes from a real conversation`, and the call was that the
   chat footer does not need to say where a real number comes from. **This does
   not weaken the no-price rule** — that rule lives in
   `lib/concierge/system-prompt.ts` and constrains what the model says; the footer
   line never enforced it and was never load-bearing for it.

   **The premise this item was written on was already false.** It read "copy is
   locked, so shortening it needs a `docs/COPY.md` amendment and sign-off" —
   but COPY.md **unlocked the disclaimer to an open slot on 2026-08-10** and said
   in as many words that whoever fills it proposes candidates rather than editing
   in place. The blocker named here had not existed for a day when this line was
   written. `docs/COPY.md` is now filled and re-locked.
4. ~~**The 249px case-study text column at 768**~~ — **decided and shipped
   2026-08-11: the case-study rows stack in the 768–1023 band.** Both halves take
   `1 / -1`, joining `page-hero`, `SectionHead`, `/contact` and
   `/solutions/[slug]`, which already take all 8 tracks there. DESIGN.md §8's
   table and its *why some rows go full-width* passage are amended; `.tg-stack-md`
   in `globals.css` is the implementation.

   **Decided on measurement rather than the real-device read this item was
   waiting for**, because the number settles it without one: 249px at
   `--text-body` measured **30.2 characters per line** against the 45–75 a measure
   exists to hold. **The alternatives were costed and rejected**: a mirrored 4/4
   is the template look §0 avoids and reaches only ~39 characters; 5/3 gives the
   prose a comfortable ~55 but cuts the poster to 249px wide — 156px tall at 16:10
   — and the poster is the proof the `/work` index exists to show. 768 has not got
   the width for two genuine columns here, so it gets one.

   **Measured after: 688.8px, 68 characters per line, 8 explicit tracks and 0
   implicit, both halves `grid-row: auto`, no horizontal scroll.** Verified
   unchanged at 1024 (12 tracks, alternation intact, both halves on row 1) and
   stacked as intended at 844 and 767.

   **Scope: `/work` only.** The home Featured Work band is a different component
   (`app/page.tsx`) and was deliberately not touched — it gets its own measurement
   if it ever gets a change.

## Known Gaps

*Deferred deliberately, not forgotten. Each needs a stated trigger for when it gets revisited.*

| Gap | Why deferred | Revisit when |
| --- | --- | --- |
| **The mobile fix pass is CLOSED on the M- series. Split: 18 resolved · 1 partial (M-16) · 0 open.** *Closed 2026-08-10 by Prompt 13, which fixed M-07 and M-08 at sub-767 — the last two open findings — and six of the twelve D- items with them (D-01, D-02, D-03, D-05, D-06, D-10). **"Closed" here means the M- series only.** **Three** D- items remain, none of them a measured finding: **D-04, D-07, D-08**, and **each is deferred for a stated reason in the register below, not forgotten.** *(This read "Six … D-04, D-07, D-08, D-09, D-11, D-12" until 2026-08-11: **D-09, D-11 and D-12 were shipped by Prompt 14 on 2026-08-10** — the design pass their deferral called for ran as one pass, DESIGN.md v2.4 → v2.5. Only the register-status section below had been updated.)* **M-16 is still partial** and is its own row. Read the two paragraphs after this one as the history that produced this row; they are why it is worded this defensively.* *This row previously read "CLOSED 2026-08-09 (Prompt 11). All 19 are resolved and no mobile fix pass remains." **It was wrong twice** — corrected 2026-08-10.* M-07 and M-08 were resolved at **768/844 only**; the exception sat in the same cell as the word "Resolved" in `docs/MOBILE-AUDIT.md`, and this row's summarisation dropped it. A **Pixel 9A device pass (2026-08-09)** confirmed both live at sub-767. M-16 was never more than **Partial**. **Scope of the reopened pass as it stood before Prompt 13 ran — not a current to-do list: M-07 + M-08 at sub-767, plus the D-01 – D-12 device register below.** History, unchanged: Prompt 8 closed M-01, M-02, M-17, M-18 plus the band rows of M-04, M-07, M-08; Prompt 10 closed M-03, M-06, M-14, M-15, M-19; **Prompt 11 closed M-09 – M-13 and the sub-767 rows of M-04 and M-05** — see its section above, not re-summarised here. The predicted shape held: 73 signatures across 2,707 instances were a handful of shared components rendered many times, and the fix is two CSS utilities plus ~20 class additions. The `data-primary-cta` attribute on `closing-cta.tsx` survived the trust-row rework, as required, and gained a counterpart on `/contact` | **The policy was decided before the pass ran, and that is why it shipped as implementation rather than investigation.** DESIGN.md §8's two-tier floor — 44×44 standalone, WCAG 2.2 AA's 24×24 for prose links, expanded by padding or pseudo-element and never by resizing — was written by Prompt 10 and implemented verbatim here. **The one thing §8 did not anticipate:** a rect-based sweep cannot verify a pseudo-element expansion, so the harness needed a hit-testing phase (`taps`) before the fix could be checked at all | **Closed for the M- series 2026-08-10 (Prompt 13).** What is still open under the mobile heading, none of it a finding: the **three** deferred D- items (**D-04** panel geometry — specified in DESIGN.md, not yet built; **D-07/D-08** hero assets, which need new captures rather than code and are blocked on the same recapture as the eight off-ratio posters). **D-09, D-11 and D-12 are no longer among them — Prompt 14 shipped all three on 2026-08-10**, spec first and then code, so the "needs a design pass before anything implements it" condition is met and spent. Also still open: M-16's remaining orphan lines (a copy question; **partial**, never resolved), and real-device confirmation of safe-area insets and the motion-enabled path |
| ~~**Safe-area insets — there are none.**~~ **Closed 2026-08-09 (Prompt 10).** The launcher and panel now carry `calc(24px + env(safe-area-inset-bottom, 0px))` and the `right` equivalent, additive to the existing 24px; the full-screen sheet takes all four sides. Always the two-argument `env()` form, so a browser without support resolves to 24px rather than 0 — confirmed by measurement, which reads `bottom: 24px` at all 8 viewports in a headless context with no insets | Not a grid problem and not reachable from one. Recorded in DESIGN.md §8's *Concierge geometry* alongside the values it applies to | **Real-device confirmation is still outstanding** — a headless context has no insets to add, so only the fallback path has been measured |
| ~~**Dialog keyboard and focus management is unmeasured, not known-broken.**~~ **Closed 2026-08-09 (Prompt 10).** Baseline established and measured at all 8 viewports (`scripts/audit-concierge.ts geometry`): Escape closes in every mode, focus moves into the panel on open and back to the launcher on close in every mode, and sheet mode additionally traps Tab, sets `aria-modal="true"` and locks body scroll. Non-modal mode does none of those three and the page still scrolls behind — verified with a real wheel event, because `overflow: hidden` never stops a scripted `window.scrollBy` and the programmatic probe reports every working lock as broken | Stating it as a defect would have been inventing a measurement. What it turned out to be: Escape already worked and focus-on-open already worked; **focus return on close did not exist at all** | Closed |
| ~~**H-4 (M-19)**~~ **CONFIRMED and closed 2026-08-09 (Prompt 10).** The MutationObserver-armed rAF sampler caught the launcher animating under `reduce` on 6 of 6 route/viewport combinations — `opacity` through 15–17 intermediate values, `transform` `matrix(1,0,0,1,0,8)` → `none` through 16, over ~240ms from DOM insertion. `reduce` and `no-preference` traces are indistinguishable. The entrance was **removed**, not pinned: the yield rule that replaces it is opacity-only and instant under `reduce` | Filed `polish` in Prompt 7 and deliberately not upgraded without the right measurement — which was the correct call, since the measurement inverted the reading | Closed. **The `.tg-seq` half was re-tested by Prompt 11 (2026-08-09) rather than left on the earlier reading — the pin holds.** All 12 `.tg-seq` elements on `/` are constant at `opacity: 1` / `transform: none` / `translate: none` over 69–90 armed frames at two viewports, while the same sampler under `no-preference` reads 28–32 opacity values and full `matrix()` ramps on the same elements. Motion writes `transform` here, so `transform: none !important` is sufficient and **no `translate` pin was added** |
| ~~**`/` throws a hydration mismatch (React #418)**~~ **Resolved 2026-08-10 (Prompt 12), `fbb37a6`** — server and first client render emit a fixed `at HH:MM UTC` stamp and the relative string is taken only post-hydration. **Re-confirmed 2026-08-10 (Prompt 13): a fresh load of `/` and `/contact` logs no hydration warning.** This row was left reading "Unassigned" for a prompt after the fix landed; the diagnosis below is kept because it is what the fix was measured against. *Diagnosed 2026-08-09 by Prompt 10, in passing.* `relativeTime(result.checkedAt)` in `components/status-line.tsx` renders a **relative** timestamp, baked into the prerendered HTML at build time and recomputed on the client, so the two texts diverge by however long the deploy has been live. **Pre-existing, not a Prompt 10 regression — the identical error reproduces on `https://tekguyz.com`** | It violates the Definition of Done's "no hydration warnings", which means that line has been passing on an unchecked assumption. Found only because `home-hero.tsx` was touched for the `data-primary-cta` tag | **Closed** (2026-08-10, `fbb37a6`; re-confirmed by Prompt 13). This cell read **"Unassigned"** for a prompt after the fix had already landed, describing the three-way choice — absolute timestamp, defer to an effect, or `suppressHydrationWarning` — as still open. **It was decided: the absolute server stamp.** The other two were rejected for stated reasons (an effect flashes the signature component empty; `suppressHydrationWarning` hides the message and leaves two trees in place), and both are now hard rules in CLAUDE.md. The diagnosis in the cells to the left is kept as what the fix was measured against |
| **44 launcher overlaps above 25% remain on non-CTA elements** — *opened 2026-08-09 by Prompt 10's own re-measurement.* The yield rule took primary-CTA overlaps from 174 to **0**, which is the acceptance criterion it was written against. Measured across *every* interactive element the sweep still finds **143 pairs, 44 above 25%, worst 99.6%**, in five classes: `/work/[slug]` meta-rail links (12), inline `link-underline` text links (11), prev/next case-study nav links (9), footer links (6), `/contact` FAQ accordion triggers (6) | **Not fixed by widening `data-primary-cta`, and Prompt 10 was instructed to name it rather than silently widen.** An observer keyed to every CTA-styled element flickers the launcher on any scroll-heavy route, which is worse than a transient overlap on a secondary link. **All 143 are transient — 0 at maximum scroll** | **Nobody, yet.** It needs a human decision on whether a transient overlap of a secondary link is a defect at all. If it is, the mechanism is a different one — an occlusion-aware offset, not more observer targets. **Re-measured after Prompt 11 as an observation only, with nothing changed: 143 → 140 pairs, 44 → 45 above 25%, worst 99.6% → 100.0%, primary-CTA overlaps still 0.** Effectively unmoved, which is expected — the tap-target fix grows hit areas by overlay and overlay area is not in the sweep's rects. **Decided 2026-08-10: not closed, and not reopened as a sweep.** The 44 pairs are to be **re-partitioned** into *transient-during-scroll* (accepted, documented) and *static-after-user-action* (fixed through the D-02 suppression channel). **D-02 proved the original partition was drawn wrong** — "all 143 are transient" did not survive contact with an expanded accordion. **The mechanism for the static half now exists** (Prompt 13, 2026-08-10): the shared suppression channel in `concierge-bus.ts`, which covers the **6 `/contact` FAQ accordion trigger pairs** — the one class that is static-after-user-action — and the nav drawer, which the sweep never counted because it only exists after a tap. **The other four classes are untouched and unre-measured by that pass**: meta-rail links (12), inline `link-underline` text links (11), prev/next case-study nav (9), footer links (6). Any of them that turns out to be static rather than transient feeds the same channel; none of them is widened into the observer **Re-partition attempted 2026-08-11 (Prompt 15). Result: 1 of 4 classes resolved, 3 unresolved — see the block below. Not closed.** |
| ~~**M-16 is PARTIAL, never resolved — its remaining orphan lines**~~ **Resolved 2026-08-11 — by item 4 of *Decisions still open* resolving against the column, which is one of the two exits this row named.** The remaining half was, in the audit's own words, "case-study headlines still orphan in a now-deliberate 249px column". **The column is gone**: case-study rows stack in the 768–1023 band, and the text half measures 688.8px at 768 and 764.8px at 844. **Measured at both widths M-16 was filed against — 4 of 4 headlines set on one line, so there is no wrap left to orphan**, and no copy changed. The earlier half (`Four ways we help.` L4-in-144px → L1 in 704px) was already resolved by Prompt 8. *Kept as the history: this row was **twice** summarised as more resolved than it was, which is why it was worded to refuse the word "resolved" until something measurable changed. Something measurable changed* | It belonged to no fix pass while the column was deliberate: there was no layout defect under it and the copy was locked. **What moved was the column, not the copy** — the 249px placement stopped being deliberate once it measured 30.2 characters per line | **Closed.** The copy review this row offered as its other exit is **not needed and was not done** — no headline was rewritten. Re-open only if a future `/work` headline wraps at 768; the check is the character-rect line count in DESIGN.md §8, not `Range.getClientRects()`, which reports a rect per element boundary and miscounts this headline because it wraps a `<Link>` |
| Hero video loop (`sarah-demo.mp4`) | Static image ships first; video is a post-launch enhancement | A new recording of the real dashboard exists |
| Live iframe embeds (`embeddable` flags) | Needs `frame-ancestors` CSP added per demo app first | Ready to do the CSP work — one prompt per app, then flip flags |
| Compact-context image ratios — **measured 2026-08-07: all 8 are off 16:10** (1.02–1.33 against a required 1.60); only the 16:9 hero passes. Two of them (`sarah-project-thumb`, `crunch-wrap-dashboard`) crop to a fragment that reads as invented content, and `sarah-project-thumb` is a **simulator crop**, the PLAYBOOK §12 hard-rule violation | User's own call — recapture in progress. Wiring is confirmed correct and guarded by `bun run check:media`, so a fresh file under the same name renders with no code change | On drop-in. Re-run `bun run check:media` to confirm |
| ~~**AI Voice Receptionist has no documented compact-context filename**~~ | **Resolved 2026-08-07.** Decided `sarah-thumb.webp` for the 16:10 compact contexts, `sarah-poster.webp` stays the 16:9 hero and future video poster. Both are now in PLAYBOOK §12 and `content/work.ts` is rewired. `bun run check:media` fails the build until the recaptured file lands — expected, not a regression | On drop-in |
| ~~`/process` and `/contact` ship zero scroll reveals~~ | **Resolved 2026-08-07.** `/process` 0 → 4 (one per step, no stagger index — the steps are a screen apart, so an index would only add dead time), `/contact` 0 → 2 (trust lines and the FAQ section). The form itself deliberately gets none: it is in the first viewport and a form fading in on first paint reads as a slow page | — |
| ~~**`bun run build` currently fails at `prebuild`**~~ | **Resolved 2026-08-07.** `sarah-thumb.webp` has landed in `public/media/`. Full `bun run build` now passes end to end, 45 routes prerendered, zero type errors. The file is still **off-ratio** (1080×1059, 1.02 against the required 1.60) — that is the row above, not this one | — |
| **The four project thumbs are now rendered at 16:10 and are 600×450 (4:3)** — `object-fit: cover` drops the bottom ~17% of each. Newly visible because project detail pages did not show an image before this pass | Same recapture already in flight; no code change needed when it lands | On drop-in, with the rest of the 1440×900 set |
| `components/contact-form.tsx:92` — `react-hooks/incompatible-library` warning on React Hook Form's `watch()`. The React Compiler skips memoizing the component rather than risk stale UI | The mechanical fix is RHF's `useWatch`, but this is the file whose step-branch reconciliation caused the Prompt 4 field-contamination bug. Swapping its subscription API is a behavioural change, not a lint fix, and wants its own verification pass | Anytime it is worth a focused change plus a re-test of both form steps |
| ~~`bun.lock` lost a stale `vercel@^58.7.1` devDependency during this pass~~ | **Closed 2026-08-11.** Not intentional and not a removal: the committed lockfile listed it while `package.json` never has, so any `bun install` would have re-synced it the same way. Net dependency change from that pass was zero — `eslint-config-next` was already installed. **The row's own trigger is now answered by measurement: `package.json` declares only `@vercel/analytics` and `@vercel/speed-insights`, no `vercel` entry, and the Vercel CLI is not installed on this machine.** Nothing expects it as a local devDependency, and the lockfile is correct as it stands. Production hosting is checked through the Vercel connector, which needs no local CLI | — **Closed.** Reopen only if someone deliberately adds the CLI, in which case it goes into `package.json` properly rather than back into the lockfile alone |
| ~~Motion-enabled behavior is unverified~~ | **Resolved 2026-08-08 (Prompt 7).** Partly resolved 2026-08-07 by the user on a Pixel 9A (thinking-stripe shimmer runs; hero entrance visible on load). The two remaining items are now measured — see the Prompt 7 section for the tables. **`/process` progress fill advances with scroll:** `0% → 25% → 53% → 81% → 100%` at `scrollY` 0/360/720/1080/1440, `transition: height 120ms linear`, and exactly one rail label is ink-weighted at every sample (Discovery → Build → Launch & Support). **`closing-cta` echo fires:** four `.tg-seq` items enter from `opacity: 0` / `translateY(32px)`, staggering headline → subhead → trust → CTA from ~350ms and fully resolved by **~770ms**. **How, and this qualifies the result:** both came from **Playwright's `reducedMotion: 'no-preference'` context override at 1280×900, not from a motion-enabled device** — verified to have taken by `matchMedia('(prefers-reduced-motion: reduce)').matches === false` inside that context. **The machine's OS preference (`MinAnimate = 0`) was not touched.** The rail is `hidden lg:block`, so it renders at no mobile viewport and had to be measured above 1024px | — for these two. A real motion-enabled device would still be the stronger evidence for anything new, but nothing is outstanding |
| `/privacy` ships zero scroll reveals | Out of scope this pass and arguably correct — it is a legal text page, and entrance animation on policy copy is decoration | Only if wanted |
| ~~Nav scrolled-state transition is **240ms** in code against DESIGN.md §4's stated **200ms**~~ | **Resolved 2026-08-08 (Prompt 8).** Decided in favour of **240ms** — it matches `--dur-base` and it is what ships; the measurement (three `CSSTransition`s on the nav fill layer, each `duration: 240ms`, `easing: ease`) was already done in Prompt 7. `docs/DESIGN.md` §4 now states 240ms. **No code changed** | — |
| `app/icon.svg` is no longer transparent | Deliberate, 2026-08-07 (Prompt 6). It took the same `#101010` plate as the rest of the set so the favicon reads identically across browsers. The trade is that it no longer adapts to a light tab strip — it is now a dark tile there rather than a bare mark | Only if the dark tile reads badly on a light-chrome browser in practice |
| Favicon generation now runs on `prebuild` | Not a gap, a note: PLAYBOOK §13 always claimed build-time generation and it was manual until now. `sharp` + `png-to-ico` are devDependencies, which Vercel installs for builds — if a future deploy ever runs with `NODE_ENV=production` install pruning, this step is what breaks first | A deploy fails at `prebuild` on a missing `sharp` |
| `bun run test` is not wired into CI or `prebuild` | The suite is pure-function and fast (~0.7s), but nothing yet forces it to run. Adding it to `prebuild` would couple the build to test state, which is a call worth making deliberately rather than in a fix pass | CI exists, or someone wants the build to gate on it |
| ~~**Every other route still returns a multi-child fragment**~~ | **Resolved 2026-08-07.** All 7 remaining page components wrapped in a single root element. Measured across all 18 routes with `Element.prototype.scrollIntoView` instrumented: exactly **1** call per route, target a `DIV` | — |
| **Four things Prompt 7's audit could not reach** (`docs/MOBILE-AUDIT.md` §8). **1. `/contact` step 2 is unmeasured** — reaching it needs valid step-1 input and a real state transition, so the `01 / 02` counter and step header were measured in their step-1 state only; findings M-02 and M-07 describe step 1. **2. The concierge thinking stripe (`.shimmer-seg`) was not exercised** — it only exists in the DOM while a request is in flight, which costs a live Gemini call and an Upstash limiter hit. The user's Pixel 9A confirmation (2026-08-07) remains the only evidence it shimmers. **3. Real `dvh` behaviour is unverifiable here** — headless Chromium has no collapsing URL bar, so `100dvh` and `100vh` probe **identical at all seven viewports**. It happens not to matter for the panel-overflow finding (M-03) because the panel's height chain contains neither unit, but no `dvh` conclusion may be drawn from that file. **4. The `/process` rail's agreement with its reference line was not re-proved** — the fill's advance and the highlight's advance are both confirmed, but the probe written to check *which* step sits under the 45%-of-viewport line selected the wrong elements and returned empty at every offset. **Prompt 5's measurement of that agreement at eight scroll offsets stands; Prompt 7 neither contradicts nor re-confirms it** | 1, 2 and 4 are harness work, each small and each listed with the exact fix in MOBILE-AUDIT.md §8 / H-4. 3 is not fixable in headless Chromium at all — it needs a real device | 1 and 4: whenever the harness is next opened, e.g. by the fix prompt re-running it to diff. 2: alongside any other work that already justifies a live concierge call. 3: only on a real phone |
| Motion cannot be visually confirmed in this environment | Two independent blockers, neither of them the code: Windows animations are off (`MinAnimate=0`), so `prefers-reduced-motion: reduce` matches machine-wide; and the in-app Browser pane is hidden (`document.hidden === true`), so the page never composites — `requestAnimationFrame` and IntersectionObserver callbacks never fire and screenshots time out | To see the entrances: turn Windows animations on (Settings → Accessibility → Visual effects → Animation effects) and keep the Browser pane displayed. **Not changed here — it is an accessibility preference** |
| ~~`bun run lint` is broken~~ | **Resolved 2026-08-07.** There was no config file of any kind, so ESLint 9 exited before linting anything. `eslint.config.mjs` added, importing `eslint-config-next`'s native flat config directly (it is **not** FlatCompat-loadable). 0 errors. One warning left deliberately — see the Prompt 5 section | — |
| Cal.com scheduling | Current funnel problem is lead follow-up, not booking friction — adding a second conversion path before measuring the first risks splitting the data | A few weeks of real inbound data suggests booking friction is real |
| Terms of Service | No checkout/account system to need one; the one place it'd matter (concierge liability) needs a lawyer's line, not mine | If launch reveals an actual need |
| GBP Services section | Not a website task | Anytime — highest-leverage open SEO item, do in parallel |
| ~~`GEMINI_API_KEY` not set~~ | **Resolved 2026-08-06.** Key present; real replies verified | — |
| ~~No KV/Upstash credentials~~ | **Resolved 2026-08-06.** `UPSTASH_REDIS_REST_URL` / `_TOKEN` present; limiter verified against real Upstash keys | — |
| ~~Contact + concierge never exercised end to end~~ | **Resolved 2026-08-06.** Real submissions landed in the CRM and Resend, with message IDs recorded above | — |
| Privacy policy — concierge data flow, CRM forwarding, phone field **still undisclosed** | Legal document, needs real review, not invented text. Flagged three times now, and it was listed twice in this table until 2026-08-07 | Legal review. **This is the last content blocker before launch** |
| `[NEEDS REAL DATA]` — Field Photo Reports outcome | Never filled, per the hard rule | If a real, verifiable number exists |
| GBP review permalink | Still open; testimonial links to the GBP listing instead | When the direct review URL is available |
| `lockup-master.svg` wordmark still a `<text>` element | Pre-existing; the site renders the lockup as JSX so it's unaffected, but exported assets are | Before handing the SVG to any external vendor |


### The 2026-08-11 re-partition attempt (Prompt 15) — 1 of 4 resolved

**Read this before trusting any transient/static claim about the four classes.**

**The premise the whole pass was built on was wrong, and measurement caught it.**
The pass opened by arguing that `overlapsAtMaxScroll` was a degenerate test:
every route ends in `closing-cta`, `closing-cta` carries `data-primary-cta`, so
at maximum scroll the launcher is already yielded and the probe intersects rects
against a launcher nobody can be obstructed by. That argument was written up,
reviewed twice, and corrected once (it is 7 routes, not 8 — `/contact` has no
closing CTA). **It is false.** `footer-dark` measures **956px** against mobile
viewports of 667–896 and pushes `closing-cta` off-screen before the bottom is
reached.

**P1, measured (`scripts/probe-p1.ts`, production build, 56 route × viewport
rows, light + dark):**

| Field | Result |
| --- | --- |
| `closing-cta` intersecting the viewport at maximum scroll | **0 / 56** |
| Launcher presented at maximum scroll (`opacity` > 0.5, `pointer-events: auto`) | **56 / 56** |
| `footer-dark` height > viewport height | **56 / 56** |

So `overlapsAtMaxScroll` was **never degenerate**, Prompt 10's empty reading was
a real measurement all along, and `/contact` is not uniquely non-degenerate —
all 8 routes are.

**The bottom of the page is clean, measured directly.**
`scripts/probe-bottom.ts` across all 8 routes × 5 viewports (light + dark at two
of them): **0 overlap pairs at maximum scroll, on 56 / 56 rows, with the
launcher presented on every one.** No static-at-rest case exists at the bottom,
so **no suppression feeder was needed and none was added.**
`data-primary-cta` was not widened and no observer target was added.

**Verdicts — and only one of them is reportable:**

| Class | Verdict |
| --- | --- |
| Footer links | **UNRESOLVED as a transient/static verdict.** The `classes` phase read it transient (48 admitted samples, all `/contact`, 6 viewports), but that phase now fails its own cross-phase guard, so its footer numbers are under the same cloud as the rest. |
| Meta-rail links | **UNRESOLVED.** |
| Prev/next nav | **UNRESOLVED.** |
| Inline `link-underline` | **UNRESOLVED.** |

**Corrected 2026-08-11, same day:** this table first read *"Footer: Transient"*
against three unresolved classes, i.e. 1 of 4 resolved. **That was wrong and is
withdrawn.** The guard described below fails on the footer class too. What
survives is narrower and is not a class verdict: **the bottom-of-page case is
clean on all 8 routes**, measured directly by `probe-bottom` — 0 overlap pairs
at maximum scroll with the launcher presented on 56/56 rows. That is a
measurement of one scroll position, not of the footer class across the scroll
range. **0 of 4 classes are resolved.**

**A code-level guard now enforces this, because doc discipline is one `/clear`
from gone.** `audit-mobile.ts classes` diffs its own per-class element counts
against the `sweep` phase's for the same class and **exits non-zero** when they
disagree, printing `DO NOT read verdicts from classes.json`. It also refuses to
pass vacuously if `sweep` has not been run. As of 2026-08-11 it **fails**:
`meta-rail` classes=0 / sweep=21, `prev-next` classes=0 / sweep=16,
`inline-link-underline` 7 / 16, `footer` 112 / 11.

**Caveat on the guard, stated so nobody trusts it further than it goes:** the
two phases count on different bases — `sweep` dedupes by selector per row and
keeps the max; `classes` counts distinct href+text per row and sums. The
magnitudes are therefore not normalised and the guard currently reduces to *any
disagreement fails*. That is correct today, since there is real disagreement,
and it fails **closed**. But it must be normalised before it can ever legitimately
pass, or it becomes an alarm people learn to ignore. A second, internal
cross-check (selector traversal vs `INTERACTIVE` traversal, same scroll
position) **passes** on 126/126 rows — so the two traversals agree with each
other while both miss what `sweep` finds, which points at the **scroll grid**,
not the traversal.

**The disagreement, stated rather than resolved.** The new `classes` phase in
`scripts/audit-mobile.ts` reports **0** rect intersections for meta-rail and
prev/next across 770 samples each. The `sweep` phase's occlusion probe, run at
the same time on the same build, reports **21** meta-rail and **14** prev/next
pairs with `launcherPresented: true`. A hand-written debug probe at 390×844 on
`/work/field-photo-reports` found a real rail overlap at `scrollY 1518` — with
the launcher **yielded**, so correctly inadmissible — but that overlap does not
appear in the `classes` output either, which means **the `classes` phase is
under-recording and its zeros are not evidence.**

**Most likely cause, not yet proven:** the coarse sampling grid
(`max(200, 0.6 x innerHeight)`, so 506px at 390x844) steps *over* the window in
which an element passes under the launcher, and the refinement pass only
triggers around positions that already produced an admitted overlap — so a peak
the coarse pass never detects can never be refined. The debug hit at
`scrollY 1518` sits exactly on a coarse boundary at that viewport. **The bug was
not fixed.**

**Nothing was closed on the strength of a number two probes disagree about.**
The three classes stay exactly as open as they were, and the cheap reading —
"three classes came back clean" — is the one this row exists to refuse.

**What is nonetheless established and does not depend on the disagreement:**
the bottom-of-page case is clean on all 8 routes (a direct measurement, not the
`classes` phase); the degeneracy thesis is dead; and the mechanism question is
moot for now, since there is no static case to feed a channel.

**Also settled by this pass:** the harness runs. `bun run build` passes and
`node --experimental-strip-types scripts/audit-mobile.ts <phase>` drives
Playwright end to end. **The fix was reinstalling the browsers**
(`playwright install chromium --with-deps`, `playwright install
chromium-headless-shell`) — Prompt 14's "browser launch fails on this machine"
was a missing/incomplete headless-shell install. **The Bun-stdio explanation at
`docs/PROGRESS.md:1182` remains UNVERIFIED:** post-reinstall, node works and Bun
still times out at 60s, which is consistent with it but does not establish it.

**Revisit when:** someone normalises the two phases onto one counting basis,
fixes the sampling grid (a peak-triggered refinement cannot find a peak the
coarse pass missed — the refinement needs to be unconditional, or the grid
fine enough not to need one), and gets `audit-mobile.ts classes` to exit 0. The verdict rule itself is tested
(`lib/overlap-verdict.test.ts`, 17 cases) and passed a positive control against
D-02's geometry, so the rule is not what is in doubt — the sampling is.

## Device pass — 2026-08-09 (Pixel 9A): the D- register

**These are not harness output.** The D- series is a set of **unmeasured device
observations** made by a person holding a phone. Nothing here has a rect, a
viewport matrix, or a re-runnable probe behind it, and **none of them carries a
cause** — symptom and location only. That is deliberate: 7 of 22 items across
earlier passes inherited a wrong cause from a brief that asserted one, so a D-
item is not to be diagnosed from this register. Whoever fixes one measures it
first. The same wording appears in `docs/MOBILE-AUDIT.md` §10.

This pass is also what reopened **M-07** and **M-08** at sub-767.

| ID | Observation |
| --- | --- |
| **D-01** | Concierge launcher renders above the open mobile nav drawer. |
| **D-02** | Concierge launcher covers FAQ body text on `/contact` when an accordion item is expanded. Static overlap at rest after a user action — a different class from the transient scroll overlaps already recorded. |
| **D-03** | After contact form submit, focus lands on the first FAQ accordion trigger; the success message is off-screen above and is never seen. |
| **D-04** | Concierge panel reads small at portrait phone heights and on desktop. Design decision, not a defect. |
| **D-05** | A concierge response longer than the message list leaves the user scrolled to the list's end; reading the response requires scrolling up. |
| **D-06** | Home hero renders a second status-line instance in the text column beneath the CTA row, in addition to the one attached to the media. |
| **D-07** | Home hero media's right-edge bleed crops through card content at viewports above 1440. |
| **D-08** | Home hero poster is illegible at 360px, where the media stacks full-width. |
| **D-09** | The proof line ("Eight live builds. Open any of them right now.") is specified in CANONICAL.md §98 as content and has no entry in DESIGN.md. No typographic or spacing treatment exists for it. |
| **D-10** | Nav "Let's Talk" renders larger than DESIGN.md:172's standard button-primary and is setting the header's height. |
| **D-11** | LiveFrame's surrounding container — surface fill, padding, radius, and whether the status block sits inside or beneath the frame — is unspecified in DESIGN.md:186. |
| **D-12** | closing-cta is built exactly to DESIGN.md:176 and reads flat. Every element is centered with identical gaps and there is no hierarchy anchor. Approximately 200px of dead vertical space sits above it (preceding section's 128px bottom padding + the CTA's own 64px top). A spec revision, not a defect. |

### Register status — 6 shipped, 6 deferred (2026-08-10, Prompt 13)

**The rows above are not edited.** They are the observation as made on the phone,
and they are what the fixes measure against; a status belongs here, not inside
them.

**Shipped:** D-01, D-02 (one shared suppression channel), D-03 (focus moves to
the success element), D-05 (anchor the newest message's top), D-06 (one hero
status line), D-10 (`cn()` was dropping `leading-none` from **every** button —
the nav CTA's padding was already correct). Per-item before/after numbers are in
`docs/MOBILE-AUDIT.md`'s banner and the Prompt 13 section above.

**Deferred, each for its own reason:** D-04 (specified in DESIGN.md, not yet
built), D-07 and D-08 (need new captures, not code), D-09, D-11 and D-12
(**specification gaps — a design pass writes the spec before anything implements
it.** Do not invent a treatment for the proof line, the `LiveFrame` container or
`closing-cta`).

### Register status update — 9 shipped, 3 deferred (2026-08-10, Prompt 14)

**D-09, D-11 and D-12 are shipped.** The design pass the deferral called for ran
as one pass: DESIGN.md v2.5 carries an entry for each — the proof line (new), the
`LiveFrame` container (new sub-entry), and `closing-cta`'s internal rhythm plus
the §3 rule for the boundary above it — and each entry states its values, its
reasoning, and the alternative it rejected. Full write-up in the Prompt 14
section above. **The three still deferred are D-04** (specified in DESIGN.md, not
yet built) **and D-07 / D-08**, which need new captures rather than code and
remain blocked on the same recapture as the eight off-ratio posters.

**One thing the D-11 wording got right and is worth keeping as a habit:** it
argued the dead space to a *cause* before assigning the item — `cover` crops and
can never letterbox, therefore the space is the container's, therefore this is a
spec gap and not the capture backlog. That is what kept D-11 from being folded
into D-07/D-08 and fixed with a photo.

**One correction the register earned.** D-10 named a cause — "renders larger than
DESIGN.md:172's standard button-primary", read as padding — and the padding was
already 14×24. The real cause was one layer down and site-wide. The register's own
preamble says a D- item carries no cause and is not to be diagnosed from this
file; **D-10 is the case that proves it**, and it very nearly shipped as a
nav-only patch that would have left every other button 8.7px tall.

### Decisions already taken (2026-08-10)

Recorded here so they stop living in chat. None of them is a diagnosis of the
observation it attaches to.

- **D-02 suppression.** The launcher hides on **drawer-open AND on
  accordion-expanded**, both driven by app state through **one shared
  suppression channel**. **Not via IntersectionObserver.** Rationale: the
  flicker risk that kept `data-primary-cta` narrow is a *scroll-driven*
  problem; these are discrete booleans and carry none of it. **The FAQ is never
  hidden** — it is `FAQPage` JSON-LD and conversion content on the conversion
  route. The floating element yields.
- **D-04 geometry.** Desktop panel **420 × 640**, message list floor
  `flex: 1 1 440px`, `max-height: calc(100dvh - 48px)` **still governing**,
  sheet threshold becomes `(max-height: 560px)` **or** `(max-width: 767px)`.
  **640 is a preference, not a floor; the viewport bound still wins.** Written
  into DESIGN.md's *Concierge geometry*.

  **Confirmed by the human 2026-08-11, and the apparent conflict with CLAUDE.md
  is resolved in favour of this spec.** The brief was "full-screen chat on
  mobile and smaller devices, slightly bigger on larger screens", which is what
  the two halves above already say. **The scope decision was *record only*: no
  component was edited in that turn** — this is the component that carried the
  one `blocking` finding, so the build gets its own pass and its own
  8-viewport verification.

  **Why it read as a contradiction, and why it is not one.** CLAUDE.md compresses
  the threshold to "`(max-height: 560px)` — **height, never width**", which reads
  as forbidding the `max-width: 767px` arm. What that rule actually protects is
  the **844×390 landscape phone**: a threshold keyed to width *alone* misses it
  entirely, because the failing viewport is **wider** than 768px. The rule
  forbids **substituting** width for height, not **adding** width to it. With
  the height arm present and load-bearing, adding the width arm strictly widens
  the sheet to portrait phones and can never un-catch the landscape case.
  DESIGN.md already states this correctly and at length — *"the height condition
  is the load-bearing one and is not up for revision"* — so **the spec is right
  and CLAUDE.md's one-line compression is what needed amending.** Amended
  2026-08-11 to say height is mandatory and width may only be added.

  **The live gap is code, not spec.** Shipped today: `SHEET_QUERY =
  '(max-height: 560px)'` and a `flex: 1 1 300px` list floor
  (`components/concierge/concierge.tsx`). Both are the pre-revision values. So a
  portrait phone still gets the bounded panel rather than the sheet — **which is
  exactly the "current mobile chat is very small" the device read reported.**
  Whoever builds it changes those two values and re-measures at all 8 viewports;
  the `max-height` bound and the `min-height: 0` on the list are not to be
  touched.
- **The 44 non-CTA overlap pairs above 25%** are **not closed and not reopened
  as a sweep** — see the Known Gaps row. They are to be re-partitioned into
  *transient-during-scroll* (accepted, documented) and *static-after-user-action*
  (fixed through the D-02 channel). **D-02 proved the original partition was
  drawn wrong.**

### Push policy (changed 2026-08-10)

**Commit means commit. Push means push to `master`. A push to `master` is a
production deploy to `tekguyz.com`.** The user issues both; the earlier
"never push to `master`, open a PR" standing rule is retired.

**The guardrail that produced the original rule survives, because that failure
was never about intent:** after any push, **confirm** with
`git log origin/master` or the Vercel connector's `list_deployments`. **A denied
push is not a push that did not happen** — the classifier denial that was
reported as a block on 2026-08-10 landed *after* git completed, and the session
went on describing a live production deploy as pending. **Measure it; never
infer it from the command's output.**

## Deliberate non-features

*So nobody "fixes" these later by accident — each was a considered decision, not an oversight.*

- No pricing page — every CTA routes to a conversation instead.
- No toast notification system — form and concierge already have dedicated inline success/error states; a toast layer would be a second, competing feedback mechanism.
- No modals or popups anywhere — the concierge is a persistent panel, not a takeover; no cookie banner (the site doesn't use cookies); no newsletter popup.
- `project-card` never gets an image — the size/weight gap from `case-study-row` is intentional signal.
- The four-color moving treatment appears in exactly one place: the concierge's thinking state.
