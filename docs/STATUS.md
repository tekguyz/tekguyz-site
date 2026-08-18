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

Last updated: 2026-08-13 (Build Phase 1 shipped; Build Phase 2 partly shipped —
D-04 geometry, the concierge panel's presence motion, and two device-reported
fixes; **Build Phase 3 shipped** — the privacy rewrite, the FAQ rewrite, and all
8 detail narratives, measured in `content/work.ts` on 2026-08-13. A production
outage on 2026-08-12, caused by the Phase 2 work and self-resolved, is recorded
below — read it before the next push to `master`. **Homepage flow Waves 1, 2 and
3 all shipped 2026-08-13** — the plan in `docs/plans/2026-08-13-homepage-flow.md`
is complete; see the three sections below. **Build Phase 5 was rescoped
2026-08-13 by measurement** — its line counts were stale and its "split the big
files" premise did not survive the component audit; two dedup items shipped, and
two token/sharing decisions are waiting on the user. See the audit section.
**The dark-context token audit shipped 2026-08-13, commit `2881076`**, and **the
outcome block was extracted 2026-08-13, commit `09c1339`** — and **the eyebrow
treatment, the last of the audit's three blocked items, shipped 2026-08-13 as
`.tg-eyebrow`, commit `a24b01e`. All three are now resolved into code.** A
five-item close-out pass the same day also cleared the `phaseTaps` panel blind
spot, the last lint warning, and the `site.gbp` drift, and established that
`lib/overlap-verdict.ts` was never orphaned — see the "Open — code" table.
~~`master` is **6 commits ahead of `origin/master`, unpushed**~~ — **corrected
2026-08-14: it was 7, and then 9.** The line above was written into the commit
that made it 7, so it was stale the instant it was authored — the same
self-referential trap the two preceding STATUS.md commits were fixing. Measured
2026-08-14 via `git status -sb`: `origin/master` at `432523b`, and
`list_deployments` confirms `432523b` is the READY production deployment, so
**everything after it had not deployed.** All of it was pushed on 2026-08-14 —
see the homepage-fold section below for the push and its confirmation.)

**Last updated 2026-08-14** (homepage fold rebuilt, then the Phase 5 dedup pass —
see both sections below. The `Last updated` paragraph above it is 2026-08-13's
and is left standing as the record of that day.)

**Push state, measured 2026-08-14 after the Phase 5 push:** `git rev-list
--left-right --count origin/master...master` returns `0 0`, `origin/master` at
`a60392e`. That push carried **2** commits — `c967583` (the `--tg-muted-dark`
lightening) had been committed and left unpushed, so the "Resolved 2026-08-14"
line in the homepage-fold section below was true of the repo but **not of
production** until now.

**Attach these to the Claude.ai project** — seven files, this is the current set:
`CLAUDE.md` · `docs/STATUS.md` · `docs/CANONICAL.md` · `docs/DESIGN.md` ·
**`docs/TOKENS.md` (new)** · `docs/COPY.md` · `docs/PLAYBOOK.md`.
(`docs/SEO.md` only if the conversation is about JSON-LD; `docs/archive/*`
never — it is the record of how we got here and contains claims that are now
false.)

**Changed 2026-08-12: `CLAUDE.md`, `STATUS.md`, `DESIGN.md`, `COPY.md`
(privacy + FAQ rewritten), `SEO.md`, and `TOKENS.md` is new.** Replace the old
copies rather than adding — they will contradict.

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
| **3** | Copy: privacy policy, 8 detail narratives, FAQ review | **Shipped 2026-08-13** — privacy rewrite, FAQ rewrite, and all 8 detail narratives, see Build Phase 3 below |
| **4** | Recaptured images land + verify (absorbs D-07, D-08) | Blocked on capture |
| **5** | Refactor — **rescoped 2026-08-13 by measurement**, see the audit section below. Not "split the big files": `concierge.tsx` **709**, `contact-form.tsx` **428**, `actions/contact.ts` **393** (the old 526/440/423 were stale and no longer measurable). Two of the audit's dedup items are **shipped**; the rest is repetition and coupling, not size | Last — two items shipped 2026-08-13 |

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
| **Recapture the 16:9 hero, `sarah-poster.webp`** | **New 2026-08-13, and it supersedes the "leave it" below.** Two defects found in the existing capture while reworking the hero, neither fixable in code. (1) The **phone mockup is cut mid-sentence at y=0 of the source itself** — "…your device immediately? Anything else I can assist with?" — so it can never be shown whole at any width. (2) The bottom-right panel carries a visible **"Demo Mode" badge**, a direct PLAYBOOK §12 violation on the most prominent image on the site. The 2026-08-13 mobile crop excludes the badge; **desktop still shows it.** Wanted: 1600×900+ native 16:9, phone mockup entirely inside frame, no demo/simulator affordance anywhere in shot |
| **Recapture 8 posters at 16:10** | 2026-08-13. 1920×1200 preferred, never upscale, WebP q82, same filenames in `public/media/`. ~~`sarah-poster.webp` is the 16:9 hero — leave it.~~ **Superseded by the row above — it needs recapturing too, for reasons this line was written before anyone had looked at it closely.** Then `bun run check:media`. Current, all wrong: `field-ops-thumb` 769×754 · `sarah-thumb` 1080×1059 · `shopify-configurator` 1080×1140 · `crunch-wrap-dashboard` 1080×1038 · `advantage-teams-thumb`, `meeting-organizer-thumb`, `dragonfly-nica-thumb`, `executive-detailer-thumb` all 600×450 |
| **Set `CRM_SIGNING_SECRET` in Vercel — production lead capture is broken until you do** | **New 2026-08-18, blocking.** The CRM's triage endpoint now rejects unsigned POSTs with a 401. Two env vars have to change together in the Vercel project settings: `CRM_TRIAGE_ENDPOINT` becomes the org-id URL (`…/api/v1/triage/<organization_id>`), and `CRM_SIGNING_SECRET` is the new signing key. Both are on the CRM's Settings → Organization panel, as "Endpoint URL" and "Signing secret". Until both are set, every submission returns a `[LEAD-DELIVERY-FAILURE] stage=crm` marker and archives to Upstash rather than reaching the CRM — recoverable, but silent to the visitor, who is still told the form succeeded. Verified working end to end against a local CRM; only the production env vars are outstanding |
| **Privacy policy — legal review** | Rewritten and shipped 2026-08-12 from measured data flows; **not yet legally reviewed**, and the page has never claimed otherwise. Specific open question for the reviewer: no cookie-consent or state-specific (CCPA etc.) language was added, per the user's call — confirm that's right for the actual traffic and customer base |

## Open — code

| Item | Phase |
| --- | --- |
| **DESIGN.md §0–§3 still read in the old single voice** — the mandate, icon policy, colour, type and layout. §4, §5, §7 and §9 were converted 2026-08-12; §2.1, §3.1, §6 and §8.0 were already converted and enforced. §1's colours carry real measured ratios from the v2.3 audit but are not machine-checked — the palette is in `:root` and could join the guard | 1 |
| Density scale adopted by `testimonial.tsx` only — but see the note below on what the density problem actually turned out to be | 1 |
| **Concierge UX/UI — D-04 geometry and panel presence motion are shipped (below); the rest of the redo is not scoped.** What remains under this heading is a design question nobody has asked yet, not a known defect list. `concierge.tsx` structure is Phase 5, separately | 2 |
| ~~**`phaseTaps` never opens the concierge panel**~~ **Closed 2026-08-13, commit `ac54202`.** Panel-open pass added per viewport/theme combo: it clicks the real launcher (`concierge.tsx` untouched) and `window.__tapScope` restricts `TAP_PROBE` to the dialog's subtree. The launcher exemption was **widened, not duplicated** — `isOverlay` exempts a thief inside the scoped overlay stealing from a target outside it; overlay-to-overlay theft stays a defect. Two guards against a silent clean zero: a pass that cannot open the panel reports `ran: false` with a reason, and one that probed nothing is flagged `vacuous`. Measured on all 9 combos: `probed=30`, `tierFail=0`, `overlaps=0`, none vacuous — **the chips now hit-test as passing, so the 2026-08-12 fix is covered rather than assumed**. One new bucket, `radiusClipped`, added because the pass's first finding was a false positive — see the row below | — |
| **`radiusClipped`: the concierge close button loses its four corners to its own `border-radius`.** 44×44, `border-radius: 6px`, no `tap-44` declaration — so its tier box equals its painted box, and `TAP_PROBE`'s corner points (1px inside each edge) sit 7.07px from a 6px arc's centre, outside the shape. `elementFromPoint` honours that, so all four corners return the parent. **Not a tap failure** — ~1% of corner area, not a target a finger can miss — which is why it is classified rather than counted as `tierFail`. Recorded because it is the one thing the new pass found. Fixing it would mean declaring `tap-44` on the button, which is a `concierge.tsx` change and was deliberately out of scope for the harness commit | any |
| 4 project thumbs are 600×450 (4:3) rendered at 16:10; `cover` drops ~17% | 4 |
| **D-07 hero media bleeds through card content above 1440px.** Untouched — the desktop panel and its 10vw bleed were not changed on 2026-08-13 and were re-measured unchanged (32px padding, 136px past a 1440px viewport) | 4 |
| **D-08 hero poster illegible — resolved below 1024px only, still open at desktop-narrow.** 2026-08-13 shipped `heroPosterMobile`: a 1038×584 crop of the same real capture, art-directed in via `<picture>`, legible at ~330px (DESIGN.md §4.9). **The full four-panel capture is still what desktop renders**, so any width that shows it small is unimproved. Closing this fully is still the recapture | 4 |
| ~~`contact-form.tsx` — `react-hooks/incompatible-library` on RHF `watch()`~~ **Closed 2026-08-13, commit `6a6ee41`.** Now `useWatch`. Un-skipping the React Compiler for the file **surfaced two errors the bailout had been masking**, both pre-existing and both fixed in the same commit: `useRef(Date.now())` (`react-hooks/purity` — the argument is evaluated every render) is now a lazy `useState` initializer, which also resolved `handleSubmit(onSubmit)` reading a ref during render (`react-hooks/refs`), since `onSubmit` closed over it. **Lint is now 0 errors / 0 warnings.** Step reconciliation untouched; verified in-browser that `?interest=` still presets, step 2 renders with every field empty (no contamination), and the placeholder still tracks the interest | — |
| ~~`lib/overlap-verdict.ts` + its tests are orphaned~~ **This row was wrong — measured 2026-08-13, files kept.** `scripts/probe-control.ts:18` imports `verdictFor` and calls it at `:90`; it is the D-02 positive control and its stated purpose is to run the real rule rather than a local reimplementation, so deleting the module would break it. What *was* wrong is a comment in `audit-mobile.ts` claiming `phaseClasses` "runs the shared verdict rule" — it never imported it, it emits `Sample`-shaped rows for the rule to consume. Comment corrected, commit `fde3441` | — |
| ~~`site.gbp` is a `share.google` shortlink while `COPY.md` records `maps?cid=…`~~ **Closed 2026-08-13, commit `480bc78`.** Not a coin-flip: COPY.md §2 of "WRITING GAPS STILL OPEN" recorded the `cid` URL as resolved, verified 2026-08-10, **by decision** — the code had drifted from a recorded decision, and COPY.md is the authority for this link. The `cid` is Google's stable place identifier and auditable on sight; a `share.google` link is an external redirector whose target can change or be revoked with no change to this repo. Re-verified 200 on 2026-08-13. One consumer: `components/testimonial.tsx:95` | — |

## CRM webhook signing — shipped 2026-08-18

The CRM stopped accepting its webhook secret as a URL path segment. It was being
written into every request log on every call, unavoidably. The endpoint is now
`POST /api/v1/triage/<organization_id>` and authenticates on an
`X-TekGuyz-Signature` header: hex HMAC-SHA256 of the raw request body, keyed by
the secret. The secret never travels. The org id in the URL grants nothing on
its own — an unsigned request for a real org gets the same opaque 401 as one for
an org that does not exist.

**One file changed in the app: `app/actions/contact.ts`.** `sendToCrm` now reads
`CRM_SIGNING_SECRET` (at call time, never at module scope — same rule as the
Resend client, so a build still passes with no secrets), serializes the payload
**once** into `body`, signs that exact string, and sends the same string. The
`JSON.stringify` deliberately does not live inline in the `fetch` call any more:
signing one serialization and sending another is the standard failure here and
it 401s every request, not some of them.

**A wrong comment was the reason this looked impossible from this side.** The
code carried "Content-Type only. The CRM's CORS allows no other header, and a
custom one fails preflight," and `CLAUDE.md`, `README.md`, `.env.example` and
`CANONICAL.md` all repeated the CORS claim as a hard rule. It was wrong: CORS and
preflight are browser mechanisms, and `sendToCrm` is a server-side fetch from a
Server Action — no origin, no preflight, no CORS involvement, ever. All five
places are corrected. A domain or hosting change does not break this call.

**Verified end to end through the real form**, not a hand-built POST: the site
running locally against the CRM running locally, submitted through `/contact` in
a browser with real field values. The CRM returned `200` and a `leadId`, the
`[contact] CRM accepted leadId=…` line appeared in the site's log, and the lead
appeared in the CRM. Negative case proven the same way — with a deliberately
wrong `CRM_SIGNING_SECRET`, the identical submission produced a `401` and a
`[LEAD-DELIVERY-FAILURE] stage=crm` marker, and no lead was created. `RESEND_API_KEY`
was left unset for both runs so no real email went out; the CRM write and the
email sends are independent and each records its own failure, so that isolates
cleanly. The test lead was deleted from the CRM afterwards.

`bun run build`, `bun run lint` and `bun run test` all pass.

**Outstanding: the two Vercel env vars.** See "Open — needs the user". Nothing
in production changes until those are set, and the CRM's old URL is already dead.

## Component audit — 2026-08-13, and what it did to Phase 5

*Full report: `docs/audits/2026-08-13-component-audit.md`. All 30 files in
`components/` read in full, plus `app/actions/contact.ts` and the relevant parts
of `lib/`. Every figure below was measured on the date.*

**Phase 5's old line counts were stale and its framing was wrong.** The row read
`concierge.tsx` 526 / `contact-form.tsx` 440 / `actions/contact.ts` 423; measured
2026-08-13 they are **709 / 428 / 393**. More importantly the premise — big files
need splitting — did not survive measurement:

- **Only two files in `components/` exceed 300 lines**, and they are the two
  already scoped. There is no third oversized file.
- **`concierge.tsx` is not a split candidate on size.** Its 11 effects are
  mutually coupled by design — `sheetRef` exists specifically to keep sheet mode
  out of the focus effect's dependencies, guarding a documented Android
  soft-keyboard loop. At ~51 bytes/line it is roughly double the repo average
  because it carries its incident history inline.
- **`contact-form.tsx` is repetition, not size** — eight hand-wired label /
  control / error triples. Its Zod schema only *looks* duplicated against
  `actions/contact.ts`; the asymmetry is deliberate and documented on both sides.
- **`actions/contact.ts` is already decomposed correctly.** No action.

**Shipped 2026-08-13:**

| What | Commit |
| --- | --- |
| **One shared `prefers-reduced-motion` hook.** `load-sequence.tsx` named it `useReducedAfterMount`; `process-steps.tsx` carried a character-identical re-inlined copy. Moved verbatim to `hooks/use-prefers-reduced-motion.ts` — same query, same `change` subscription, same mount-gated initial `false`. Establishes `hooks/`, which did not exist. **`reveal.tsx` deliberately not folded in**: its read is a one-shot `.matches` with no listener. Verified with reduce matching — home 12 `.tg-seq` nodes at opacity 1 / transform none, `/process` 4 rail labels at weight 400 with the readout pinned at Step 01 of 04 | `1b30f0a` |
| **One concierge failure message.** `route.ts`'s `ERROR_REPLY` and `concierge.tsx`'s own literal were two different sentences for one failure — the client's stopped at the email address, the route's went on to "and we'll pick it up from there" — and neither file referenced the other. Both now import `CONCIERGE_ERROR_REPLY` from `lib/concierge/errors.ts`. **The route's wording survives unedited**, being a strict superset; no new copy was written | `f5160c8` |
| **One outcome block.** The contact form's success state and the concierge's captured and error states now render `components/outcome-block.tsx` (`tone` + `label` + `message`). **The audit's "byte-identical" claim did not survive measurement** — the labels differ at all three sites, and the contact form's body runs at `--text-body` (1.0625rem) against the concierge's 0.875rem, so an optional `bodyClassName` carries that one real difference rather than silently unifying it. The component returns **contents only, not a wrapper**: the contact form's wrapper is the `ref`/`role`/`aria-live`/`tabIndex` focus target that announces the success, the concierge's is the `border-t` rule off the message list — folding those in would trade one duplication for a vaguer surface. No copy changed; `concierge.tsx`'s 11 effects untouched | `09c1339` |
| **Dark-context token audit — blocked item 1 resolved.** `footer-dark.tsx`, `live-frame.tsx`, `page-hero.tsx`, `pull-quote.tsx`, `status-line.tsx`, `app/page.tsx` no longer re-derive `--tg-fg`/`--tg-secondary`/`--tg-border` via `onInk` ternaries — the `.ink-band`/`.footer-dark` scope roots are read directly, and every `onInk` prop that existed only to drive that ternary is gone from six components and five call sites. `testimonial.tsx` had no scope root at all (a dark card on a light-mode page) — it now carries `.ink-band` itself rather than hardcoding the same four values. `.ink-band`'s `--tg-secondary` moved off `#9ca3af` (`muted-soft`, retired as a text colour) to `muted-dark`, matching `.footer-dark` and closing the second undocumented exception; contrast on `#111111` goes 7.5:1 → 4.53:1, still AA but the margin is thin — **worth the user's eyes if the band ever darkens further.** `nav.tsx:104` reads `var(--dur-base)` instead of a `240ms` literal that agreed with the token by coincidence. `TOKENS.md`'s mono-usage sentence corrected to the measured two places. New `scripts/check-hex.ts`, wired into `prebuild`, bans the five retired hex values from any `.tsx` outside `globals.css` — exempts comments and Next metadata routes (`opengraph-image`, `manifest`, etc.) that render outside the CSS cascade. Verified by injecting a hex into `pull-quote.tsx` and confirming the guard caught it, then reverting | `2881076` |

**Still open from the audit, ranked (full reasoning in the report):**

| Item | Note |
| --- | --- |
| **Concierge transport inline in the view** | `concierge.tsx:401-436` holds the endpoint literal, request shape, three response-field assumptions and the fallback copy. The copy half is now fixed; the transport is not. Deliberately left — real seam, but no second consumer yet, so extracting it now would be speculative |
| ~~**`contact-form.tsx`: 8 hand-wired field triples**~~ | **Shipped 2026-08-14 (`a60392e`)** — see the Phase 5 dedup section below |
| ~~**Body scroll lock, two incompatible restores**~~ | **Shipped 2026-08-14 (`a60392e`)** — see below. The reachability question is answered there: the lock is reachable, the clobber is not |
| ~~Scroll-position flag ×2~~ | **Shipped 2026-08-14 (`a60392e`)**, alongside the scroll lock as planned |
| `mailto:` fallback ×5 | Three treatments across `nav`, `footer-dark`, `contact-form`, `concierge`, `app/error.tsx`. Probably leave — the `tap-44`/`tap-24` variance is legitimate, tier depends on neighbour spacing |
| `process-steps.tsx:51-79` scroll measurement in the view | Genuine coupling, but extraction needs the four step refs passed in, which preserves most of it. Leave |

**The audit's last blocked item is now released and shipped:**

1. ~~**The eyebrow treatment at 24 sites**~~ **Shipped 2026-08-13 as
   `.tg-eyebrow`, commit `a24b01e`** — the user released it with the approach
   named: a layered utility, colour routed through the existing accent
   resolution. It is the **one layered block in `globals.css`**, in
   `@layer components`, and the layer is the mechanism: Tailwind's import
   declares `theme, base, components, utilities`, so the rule loses to every
   call-site utility. That is the required direction — call sites still set
   colour (`text-secondary`) and margin (`mb-6`, `mb-10`) as utilities, and
   unlayered it would have beaten `text-secondary` and repainted two thirds of
   the site's eyebrows. Colour is deliberately **not** in the class; the
   accent-coloured eyebrows already resolve `a.text` from `config/solutions.ts`,
   the same `-text` resolution that drives dots and tags, and that path was not
   touched. Measured after: all 25 elements compute
   12px / 16.8px / 700 / 1.2px / uppercase with colours unchanged.

*The outcome block was the second blocked item — "should these two surfaces be
shared at all, given they may want to diverge." The user released it on
2026-08-13 on the grounds that the question is about future divergence, not
present duplication. Shipped above; the two places the surfaces already differ
are carried as props, so diverging further stays cheap.*

**The dark-context token item is now shipped, 2026-08-13** — see the dark-context
token audit section below. It surfaced two things the write-up above didn't
anticipate: `testimonial.tsx` had no scope root to read from at all (a dark
card with no `.ink-band`/`.footer-dark` ancestor), and `footer-dark.tsx`'s own
literals disagreed with its own scope's `--tg-secondary` — the file carried
`#9CA3AF` while `.footer-dark` said `#747C8B`, so two different secondary
greys shipped from one file.

*One correction the audit owes itself: it argued `concierge.tsx` should not be
split, but conflated "these 11 effects must stay together" with "they must stay
in this file." Those are different claims. A split that moves the coupled unit
whole — effects, `sheetRef` and their comments into one hook, render pieces into
their own files — does not reopen the bug the coupling protects. That is a live
option for Phase 5, not something the audit ruled out; it was simply out of scope
on 2026-08-13.*

## Homepage flow, Wave 1 — shipped 2026-08-13

*Not a Build Phase. This is Wave 1 of the homepage-narrative blueprint from the
Claude.ai project, recorded verbatim in `docs/plans/2026-08-13-homepage-flow.md`.
**Waves 2 and 3 have since shipped too — their sections follow this one.** Every
figure below was measured on the date.*

**The two bookends — hero and `closing-cta` — reworked in one pass so they
rhyme.** Both were correctly built against DESIGN.md and underweighted for the
moments they are. The rhyme is deliberately cheap: one shared token
(`--tg-surface`) and one shared spacing grammar at two amplitudes. No new
tokens, no new motion, no new library, no accent reused.

| Shipped | Detail |
| --- | --- |
| **Hero panel is desktop-only** | Below 1024px `.tg-hero-frame` dropped its background, border, radius and padding. It had been keeping all four and only shrinking the padding to 24px — a panel at card scale, the exact thing DESIGN.md §4.9 forbids, in the one place the bleed cannot exist. Measured at 375px before: **33.2% of the panel box was empty `--tg-surface`** (30.0% at 430px). Poster went 278 → 327px wide, **+38% area**. Desktop re-measured unchanged |
| **Hero art direction** | `heroPosterMobile` → `sarah-poster-mobile.webp`, 1038×584, a crop of the same real capture at (12, 316). Legible at ~330px; 33KB against the source's 117KB. `Frame` gained an optional `posterMobile` prop using `getImageProps` + `<picture>`, so exactly one variant is fetched. **Off for every compact context**, which renders the identical `<Image>` as before |
| **Hero rhythm** | 36 / 32 / 40 → **24 · 32 · 48/64 · 80**. The near-linear ramp v2.5 fixed in `closing-cta` and never applied here. DESIGN.md §4.16, new |
| **`gap-y-14` deleted from the hero grid** | It had **never applied** — `.tg-grid`'s `gap` is unlayered and beats a layered `row-gap`. Same silent drop as the case-study `gap-y-12`. The 56px was always `.tg-hero-frame`'s `margin-top` |
| **`closing-cta` has a ground** | `--tg-surface`, full-bleed, one declaration. The stripe above becomes its lid, the dark footer its floor. Not a card — v2.5 rejected *boxing the stack*, which this is not. Applies to all seven routes carrying the component |
| **`closing-cta` padding** | 40/32/48 → **64/48 top, 80/64 bottom**. Safe because the ground changed what the number measures: the canvas gap a visitor actually reads **went down**, 110 → 68px desktop. §3's shed-rhythm invariant re-measured intact (64/40) |
| **Neither button size changed** | Re-justified rather than bumped. `closing-cta` keeps `large` (alone, terminal). The hero keeps `default` — its ask is a *pair*, and §4.1's 14×24 secondary exists to paint the same height as a 15×24 primary, so there is no `large` secondary to pair with. DESIGN.md §4.1 / §4.5 |

**Needs the user's eyes, not more code:** full-motion behaviour (this machine
runs `MinAnimate = 0`, so `reduce` matches machine-wide — the reduced-motion half
is verified and the motion-enabled half is not), and the two recapture defects in
the row above. **Thin margin to watch:** the hero CTA row clears the fold by
**18px at 1280 × 720**, down from 24px.

## Homepage fold — rebuilt 2026-08-14 (`0b047d5`)

*Hero, proof strip, build board. Replaces the `proof-line` band Wave 2 tuned
(below). Every figure measured on the date. Full reasoning: DESIGN.md §4.18.*

| Shipped | Detail |
| --- | --- |
| **Proof strip replaces the proof line** | Three checkable facts — eight live builds · a verified Google review · `site.locationLong` — on an elevated, hairline-divided panel, icon inline with each claim. One sentence between two hairlines had been carrying the site's whole differentiator. `site.gbp` and `site.locationLong` are read from `lib/site.ts`, not retyped |
| **Build board — four builds, one per solution line** | In `STRIPE_ORDER`, so the fold is a **legend** for the wayfinding system the rest of the page uses. Selection is content: `foldSlugs` in `content/work.ts`. Each slot avoids a build shown elsewhere on the page; amber is `team-performance` because that is the build the Google review describes. The whole card opens the **live product** in a new tab — one action per card, resolving `project-card`'s ambiguity the other way because the fold's job is the opposite of `/work`'s |
| **Hero headline commits** | "We build the systems your business runs on," compressed from PLAYBOOK §1's tagline. Subhead stops after §1's core belief. **Local clamp 44→76px, not `--text-hero`** — the token still serves six routes via `page-hero`. Re-measured, not assumed: **3 lines exactly at 1280, and the CTA row clears a 1280×720 fold by 30px, against the 18px recorded 2026-08-13** |
| **Three scoped exceptions, none generalised** | `lucide-react` icons at `strokeWidth 1.5` to match the site's drawn hairlines · `.tg-elevate` / `.tg-lift` on **these two components only** · richer entrance motion reusing `hooks/use-prefers-reduced-motion.ts`. All three are dated decisions in DESIGN.md §4.18; TOKENS.md's "elevation is flat" now carries the exception by name |
| **The hover lift is `translate`, not `transform`** | Inverted from `.hover-card`, and load-bearing: Motion writes its `y` entrance as an **inline** `transform`, which beats any class — a `transform`-based lift would never have applied once the entrance settled. All three transitioned properties declared together, since a `transition` shorthand resets every one |
| **§4.4's affordance decision moved, not dropped** | The `tg-rule tg-rule-rest` link is now "See all eight builds" at the end of the board. §4.4 is marked **superseded as a component, retained as reasoning** |
| **Reduced motion verified by measurement** | 8 `.tg-seq` nodes in the new section, **0 opacity/transform violations, 0 hidden elements**, all transition durations collapsed to `1e-06s` |
| **Taps re-run after the restructure** | `tierFail=0 overlaps=0` on `/` across all 9 viewport/theme combos. `multiline=1` at narrow widths is the script's documented **pass** bucket, not a failure |
| **Contrast measured with the tag tint composited** | Card name 17.32 / 15.94 · tag text on tint 6.38 / 4.78 · strip claim and icons 17.32 / 15.94 (light / dark). Keyboard: real `Tab` gives `:focus-visible` + the 2px outline on all six new controls. Launcher yield intact — opacity 0, `pointer-events: none`, `aria-hidden`, `tabIndex -1` |

~~**New in Open — code, found by this pass and deliberately not fixed:**
`--tg-secondary` on `--tg-surface` in **dark mode measures 4.14:1**, under AA's
4.5 for 14px text. Confirmed **identical on untouched `project-card` at `/work`**,
so it is pre-existing and site-wide, not introduced here: the v2.3 dark audit
measured secondary against the page floor (`#101010`, 4.53) and never against the
card fill (`#1a1a1c`). Fixing it changes `--tg-secondary` in `.dark` and repaints
every card on the site, which is why this pass flagged it rather than taking it.~~

**Resolved 2026-08-14.** `--tg-muted-dark` lightened along its own hue and
saturation, `#747C8B` → `#7B8291`. Recomputed against every background it is
actually composited on, not just the page floor: **4.93:1** on `#101010` (page
floor and `.footer-dark`), **4.90:1** on `#111111` (`.ink-band`), **4.51:1** on
`#1a1a1c` (dark-mode card fill). All three clear AA.

The audit had **two** wrong numbers, not one. The ink band was also failing —
`#747C8B` measures **4.495:1** on `#111111`, and the 4.53 recorded for it was
the page-floor figure carried over. Card fill remains the binding constraint at
4.51:1, so re-measure this token before darkening any dark surface.

`.ink-band` reads `var(--tg-muted-dark)` rather than a literal, so it moved with
the token — the documented ink-band exception is the *violet tag*, which is
untouched. `scripts/check-hex.ts` now bans both hexes: `#7B8291` pointing at the
token, `#747C8B` as retired.

**Needs the user's eyes:** the strip's 70ms icon stagger and the cards' 80ms /
18px / 0.985-scale landing, under full motion. Only the reduced-motion half is
provable on this machine.

**Pushed 2026-08-14.** This push carried **9 commits**, not 2 — the 7 that had
been sitting unpushed since 2026-08-13 went out with it. See the corrected push
count in the header.

## Phase 5 dedup — shipped 2026-08-14 (`a60392e`)

Two of the three remaining audit rows, run as independent parallel tracks. Both
behavior-preserving; rendered output is unchanged in both.

| Shipped | Detail |
| --- | --- |
| **`contact-form.tsx`: 8 field triples → one local `Field`** | `Field` is defined in the same file (`:441-492`) — **not** a shared component, one consumer. It owns the wrapper `<div>`, the `<label>`, the `(optional)` marker, and the single slot holding **either** the error **or** the hint. The controls stay hand-written as `children`, because they are three different element types with per-field `className`/`inputMode`/`rows`/`autoComplete` — a prop-spreading helper would have deduped the small half and left the markup. **`Field` deliberately does not own `aria-invalid` or `aria-describedby`**; both stay inline at the call sites. Deriving them inside would apply `aria-invalid` uniformly to all eight, which is a behaviour change, and would bury the conditional whose whole point is that it vanishes when the element it points at is replaced. All four required behaviours verified against rendered DOM, not source: `aria-describedby` present→absent→present across the phone field's pristine/errored/recovered cycle and never empty-string; `aria-invalid` absent when pristine, exactly `"true"` when errored, never `"false"`; the wrapped phone `onChange` byte-identical and exercised (20 digits → 15 kept, `+44 20 7123 4567` survives whole at 16 chars / 12 digits); `key="step-1"`/`key="step-2"` still on the step `<div>`s and outside `Field`, verified by consequence — all five step-2 controls read `""` after `Continue`. File 428 → 481 lines; the JSX shrank ~66 lines and the doc comment recording *why* the aria stays at the call sites added 20 |
| **One scroll lock and one scroll-position flag** | New `lib/use-scroll.ts`: `useScrolledPast(threshold)` and `useBodyScrollLock(active)`. `nav.tsx` −15/+12, `concierge.tsx` −17/+21. The concierge's save-and-restore contract won, as planned; nav's `overflow = ''` unlock is gone. `useScrolledPast` takes a number **or a function** because the concierge's threshold is `innerHeight * 0.85` and must be read per event — both callers pass a module-level constant, so the listener is never rebuilt. **The `sheet` ref-read pattern was not touched, and the audit row's premise about it was wrong:** `sheetRef` is read by the **focus** effect (`:286-299`), never by the lock effect, which has always had `sheet` as a real dependency. That stays — a rotation into sheet mode with the panel already open must engage the lock. Re-verified in-browser: desktop 1280×800 focus lands on `#concierge-input`, no `aria-modal`, no lock; sheet 1280×500 gives `aria-modal="true"`, focus on the panel element, body `hidden`; Escape closes and returns focus to the launcher in both. Restore proven with a sentinel — body set to `overflow: scroll` before opening comes back as `scroll`, where `master` returned `''` |

**Was nav's lock reachable? The lock yes, the clobber no.** The hamburger is a
real control below 768px (measured at 375px: click opens `#mobile-drawer`, body
goes to `hidden`), so the lock runs. But the failure needs a *second* inline
`overflow` writer live at unlock time, and grep confirms exactly two site-wide.
They cannot both be engaged: below 768px the open sheet occludes the hamburger
(`elementFromPoint` over its rect returns the panel's close button, panel
`z-index: 80` vs header `60`); at ≥768px with height ≤560 the hamburger's
container computes `display: none`, verified at 1024×500. **So this was a latent
defect, not a live one** — worth fixing because the occlusion is a layout
coincidence, not a guarantee, but it is not a bug anyone hit.

**One thing did not survive identically, deliberately.** Nav's old effect wrote
`overflow = ''` on mount and on every close, including when nothing was locked.
The hook writes nothing when inactive. That is the fix, but it is an observable
difference; nothing on the site depended on the old behaviour.

**Verification state, measured 2026-08-14 on the combined tree:** `bun run build`
passes · **97 tests pass across 3 files** · `bun run lint` **clean, zero
findings** · no console errors, no hydration warnings.

**Two figures elsewhere in this file are stale — corrected here, left standing
there as dated records.** The Build Phase 1 section says "90 tests pass"; the
third test file (`lib/overlap-verdict.test.ts`) makes it 97. Build Phases 1, 2
and 3 all say "lint clean except the one known `contact-form.tsx` warning" —
that warning was closed on 2026-08-13 in `6a6ee41` (`watch()` → `useWatch`), as
the header's own close-out paragraph already records. **There is no known lint
warning in this repo.**

## Homepage flow, Wave 2 — shipped 2026-08-13 (`0663baa`)

> **[superseded in part, 2026-08-14]** The **proof-line** row below describes a
> band that **no longer exists** — see the homepage-fold section above. Its
> affordance decision (`tg-rule tg-rule-rest`) survives, on the new board's
> `/work` link. Every other row in this table still ships.

*Proof line + "What We Do" hierarchy. Every figure measured on the date.*

| Shipped | Detail |
| --- | --- |
| **Proof-line link has a rest state** | Dropped `link-underline` for `tg-rule tg-rule-rest` — the state primitive drawn to **0.34 at rest**, completing to 1 on hover/focus. v2.5 fixed this link's colour and left the affordance open: `link-underline` grows from 0%, so the only actionable element on the band drew nothing until you were already on it, and nothing at all on touch. A third position on one gesture, not a second mechanism. DESIGN.md §4.4 |
| **`.tg-rule-rest` is a class, never an inline value** | (0,1,0), so `.tg-rule:hover` at (0,2,0) still wins. Inline would inherit to the pseudo and pin the bar at 0.34 *through* hover — the same property the contact form's rail depends on, turned into a bug |
| **New `--text-subhead` token** | `clamp(1.5rem, 3vw, 2.25rem)`, 24→36px, under `check:design` (39 tokens now). The item-level heading step |
| **Section head vs. row title** | Both were `--text-display`, separated by weight alone (700 vs 600) — measured **49.5px/700 against 49.5px/600** at 1100px, with row titles wrapping to two lines and reading *heavier* than the head above them. Row title → `--text-subhead`. **Section level owns `display`; items under a section own `subhead`** |
| **Section lede vs. row hook** | Also identical — `--text-body`/secondary both, in the same column band. Lede → `--text-title`, hook → `--text-sm` (measure 46→52ch). Four levels, no two decided by weight |
| **`solution-row` is shared with `/solutions`** | Changed once, not forked. Verified that page still reads correctly — four rows at `display` under a `--text-hero` h1 had nothing between them; at `subhead` it reads head → list |
| **Concierge launcher sized per breakpoint** | Was one desktop size at every width: **234 × 50, 57% of a 412px screen**, landing on the Process teaser's copy. Now `LAUNCHER_PADDING` with the label **"Ask us"** below 768px — **106 × 44**, 26%. `py-[12px]` + the 18px mark + the hairline = exactly §8's 44px tap floor |
| **Launcher hairline** | `rgb(255 255 255 / 0.25)`. Border colour composites over the element's own background, so one declaration covers both: invisible against a light page, legible against `.ink-band`, where a fixed-position ink pill previously vanished completely. Dark mode resolves it to ~`#F7F7F7` — invisible, correctly |
| **Concierge replies are attributed** | Every reply, the opener included, opens with a `TEKGUYZ` eyebrow label carrying `ConnectedNodes`. A long reply had no fill, alignment or container and read as an unowned slab. The visitor's turn stays unlabelled — the filled right-aligned bubble already says "you" |
| **Browser chrome is themed** | `components/theme-color.tsx`, `#ffffff` / `#101010`. The two-tag `prefers-color-scheme` form is wrong here: `enableSystem={false}`, so it would track the OS and give an OS-dark visitor a black address bar over the light site |
| **`.gitattributes` added** | `* text=auto eol=lf`. `core.autocrlf=true` + no attributes file meant a fresh Windows clone gets CRLF `TOKENS.md`, and `check:design`'s fence regex requires `` ```css\n `` — all five token sections fail at once. Hit during this session from a single `git stash` / `pop`. Vercel was never affected (Linux checkout), which is what made it invisible |
| **`LAUNCHER_PADDING` exported from `button.tsx`** | The launcher's padding matched none of §4.1's four sizes and lived inline. Now beside them, one source per number. It takes the padding but **not** `base`: `.tg-yield`'s unlayered `transition` shorthand would silently drop everything `base` declares |

**Known, accepted:** a returning dark-mode visitor sees one frame of white browser
chrome before the effect corrects it — the server-rendered value is light because
light is what a first-time visitor gets. Closing it needs a second blocking
inline script beside next-themes' own.

## Homepage flow, Wave 3 — shipped 2026-08-13

*Process teaser. Closes the plan — all three waves are now done.*

| Shipped | Detail |
| --- | --- |
| **Extracted to `components/process-teaser.tsx`** | It had never been a component — four lines of inline JSX in `app/page.tsx`, which is why DESIGN.md §4 had nothing to describe |
| **Differentiated by a progress rail** | `.tg-rule` + `data-on="true"` + inline `--tg-rule-scale` of **0.25 / 0.5 / 0.75 / 1**, drawn along each step's top edge. Left to right on desktop, down the page on mobile: a staircase showing how far through the engagement that step ends. Measured at 1280px: 71 / 141 / 212 / 282px of a 282px cell |
| **Same object as the contact form's step rail** | No new vocabulary — it reuses the partial-draw channel that exists because the form needed to show a step reached. `data-on` weight, because the transient `border-strong` is one shade off the `border` hairline it is drawn over and would have been invisible |
| **`.tg-rule.tg-rule-top` at (0,2,0)** | Beats `.tg-rule::after`'s `bottom` on specificity. `[data-navlink]::after` does the same override on source order; that works and is the habit being retired |
| **`<ol>`, not four `<div>`s** | The rail says "sequence" visually; the list says it to a screen reader. Both now carry the same fact |
| **No hover state, decided** | These are not links. A hover response on a non-interactive element advertises an affordance that is not there. Never decided either way before, so this is a decision rather than a restoration |
| **The 80ms stagger was already there** | `reveal` + `data-reveal-index`, resolved as `Math.min(index, 3) * 80`. Neither missing nor added — recorded because it is invisible on this machine and is exactly the kind of thing a session re-ships by accident |

**Reserved systems untouched and re-confirmed:** no numerals (`/process` only),
no pin (CANONICAL §6, "Used once, which is what makes it register"), no reuse of
the four solution accents. DESIGN.md §4.17 is new and carries the reasoning.

**Needs the user's eyes:** the rail's entrance under full motion. The bar itself
is static, so the reduced-motion state is complete and verified.

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
`audit:mobile taps` **`tierFail=0 overlaps=0` across all 162 route × viewport ×
theme combinations** — 18 routes × 9 combos (7 viewports light, plus dark at
`narrow` and `standard`). *This figure read 79 when first committed in `73d95e3`:
the run was piped through `tail`, and the truncated log was counted instead of
the run. Corrected by re-running to a full log and counting that.* (`/work`
still reports `multiline` at phone widths — the pre-existing wrapped case-study
titles, counted separately and not a tap failure) · dark mode measured on the
panel (`#101010` fill, `#2A2A2C`
border, `#F5F5F5` input text, **zero** literal-white elements) · no console
errors.

**Two fixes came out of the user's Pixel 9A pass and are shipped** (both
measured on the built site, both modes):

- **The soft keyboard no longer opens with the panel.** Sheet mode focuses the
  dialog container (`tabIndex={-1}`) instead of the input; desktop still focuses
  the input. §8's focus baseline and `aria-modal` are unaffected — focus still
  enters the panel, it just doesn't land in a text field. The mode is read
  through a ref so the effect cannot re-run when an Android keyboard shrinks the
  viewport past `(max-height: 560px)` and flips `sheet` — that loop would
  re-focus, dismiss the keyboard, and repeat.
- **The panel closes itself ~4s after a capture, both modes.** Measured at
  ~4.0s in each, with the scroll lock released and focus back on the launcher.
  **Typing after a capture cancels it permanently** — a follow-up typed 1s after
  capture left the panel open past 7s — which is how §4.13's "a captured lead may
  still have questions" survives the reversal. Reopening shows the same thread,
  the confirmation, and the "Keep going if you'd like…" placeholder; **no
  "welcome back" state was built**, on purpose (DESIGN.md §4.13 has the reason —
  it would fire inconsistently, since the thread does not survive a reload).

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

## Build Phase 3 — shipped 2026-08-13

**Privacy `/privacy` — rewritten, replacing the text live since July 13.** All
three gaps `COPY.md` had been flagging as "must, before launch" are closed: the
optional phone field is in the collection list, the AI concierge (Gemini) and
the CRM forward each have their own section, and Data Retention now states the
90-day backup path. A fourth, previously unflagged, was found by measurement
rather than by reading the doc: **Vercel Speed Insights has been mounted in
`app/layout.tsx:61` and was undisclosed** — the section is now *Website
Analytics & Performance Monitoring* and covers both. Children's Privacy removed
per the user's instruction.

The 90-day sentence is a description of `lib/lead-archive.ts` — a backup copy is
written **only when internal delivery fails**, `TTL_SECONDS = 60 * 60 * 24 * 90`
(`lib/lead-archive.ts:52`). Both facts were read before the sentence was
written. Change either and the policy becomes untrue.

**Still not legally reviewed**, and neither the page nor `COPY.md` says
otherwise. The one open question left for that reviewer is in Open — needs the
user: no cookie-consent or state-specific (CCPA etc.) language was added.

**FAQ — all 6 rewritten in `content/faq.ts` and `COPY.md` in the same turn**, so
the `FAQPage` JSON-LD stays the same strings rather than a paraphrased second
copy (`lib/seo.ts` reads `content/faq.ts` directly, as do
`components/faq-accordion.tsx` and `lib/concierge/grounding.ts`). Wording
tightened; **no facts changed**. Q1's *question* changed — "What does a project
cost?" → "How much does a project cost?" — which is why `docs/SEO.md:103`, which
prints that exact `name` in its `FAQPage` example, was updated too.

Verified on the built output, not the source: `.next/server/app/privacy.html`
carries the new date and all three new headings and no "Children"; the new Q1
string appears in `.next/server/app/contact.html`. `bun run build` passes, 97
tests pass, lint is unchanged at the one pre-existing `contact-form.tsx`
warning.

**The 8 detail narratives — done, and measured rather than recalled.**
`content/work.ts` was read entry by entry on 2026-08-13: all 8 carry full
narrative content and none is a stub. The 4 case studies
(`field-photo-reports`, `ai-voice-receptionist`, `bundle-builder`,
`ai-audio-file-insights`) each carry `challenge`, `approach`, `outcome`,
`pullQuote`, `tryIt`, `howItsBuilt`; the 4 projects (`team-performance`,
`meeting-organizer`, `restaurant-menu`, `auto-detailer`) each carry `builtFor`,
`summary`, `whatMadeItInteresting`. `docs/CANONICAL.md` §5 item 3 is closed with
the same measurement.

**One copy defect was found in that pass and fixed.** Field Photo Reports'
Outcome repeated "seeing / what they're seeing" and its faster-billing outcome
was still unwritten. Outcome now reads *"Fewer return trips, faster dispute
resolution, and invoices that go out the same day instead of waiting on
paperwork from the field."*; pull quote *"Fewer return trips, faster dispute
resolution, and invoices that don't wait on paperwork."* `content/work.ts` and
`docs/COPY.md` were changed in the same commit so the canonical copy source
cannot go stale against the code. **No figure was invented** — the retired
`[NEEDS REAL DATA]` marker's reasoning is preserved in `COPY.md`; the sentence
now stands on a qualitative outcome, which the hard rule permits.

## Open — post-launch, deliberately

Hero video loop (needs a new recording) · live iframe embeds (needs `frame-ancestors`
CSP per demo app) · Cal.com (deferred until real inbound is measured) · Terms of
Service (no checkout or accounts to need one) · `/privacy` ships zero scroll
reveals (arguably correct) · `lockup-master.svg` wordmark is still a `<text>`
element (matters only if the SVG goes to an external vendor).

---

## Incident 2026-08-12 — production build failed for ~4 minutes

**`master` broke in production the moment `docs/TOKENS.md` first shipped as a
build-time dependency, and nothing local could have caught it.**

Pushing the four Build Phase 1/2 commits (ending `b7c328c`) triggered a Vercel
deployment that failed `prebuild`: `ENOENT: no such file or directory, open
'docs/TOKENS.md'`. Measured via `get_deployment_build_logs`, not guessed.

**Cause:** `.vercelignore` has excluded `docs/` since 2026-08-06 (`833e7f5`),
correctly at the time — pure documentation, nothing read it at build time.
Build Phase 1 (`0cebef9`) added `check:design` as a `prebuild` gate that reads
`docs/TOKENS.md` by a plain relative path, and `0cebef9` had never actually
reached production before this session's push — so this exact combination had
never been exercised on Vercel. `bun run build` passed locally every time
because `.vercelignore` only governs what a git-connected Vercel deploy
uploads to the build container; a local build reads straight off disk and
never sees it. **Every green local build before now was real and gave no
signal of this** — it is structurally unable to.

**Fix (`8f7a413`):** removed the `docs/` line from `.vercelignore`. Reproduced
the exact failure locally first (hid `docs/`, ran `check-design.ts`, got the
identical `ENOENT`) before trusting the diagnosis. `scripts/verify.ts` and
`scripts/audit.ts` stay ignored — real dev-only tooling, nothing at build time
reads them.

**Confirmed resolved, not inferred:** `list_deployments` → `dpl_DttFF1cxmxGB…`
`READY`, aliased to both `tekguyz.com` and `www.tekguyz.com`
(`get_deployment`), and `curl -o /dev/null -w '%{http_code}' https://tekguyz.com`
→ `200`. Outage window: push-to-`READY`, under 4 minutes.

**The general lesson, not just this file:** `.vercelignore` (and anything else
that changes what reaches the build container) is a second surface a
build-time dependency can silently violate, and `bun run build` cannot see it.
Written into `CLAUDE.md`'s hard rules so a future `prebuild` addition checks
against it before shipping.

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
