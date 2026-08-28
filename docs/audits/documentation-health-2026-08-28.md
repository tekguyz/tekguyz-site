# Documentation Health Audit — 2026-08-28

Findings only. Nothing was fixed, edited, merged, or committed.

**Scope audited:** `CLAUDE.md`, `docs/CANONICAL.md`, `docs/DESIGN.md`, `docs/COPY.md`,
`docs/SEO.md`, `docs/PLAYBOOK.md`, `docs/STATUS.md`, `docs/TOKENS.md`.
Read as evidence but not audited as targets: `docs/archive/HISTORY.md`,
`docs/archive/MOBILE-AUDIT.md`, `docs/audits/2026-08-13-component-audit.md`,
`docs/plans/2026-08-13-homepage-flow.md`, `docs/archive/superpowers/*`.

**Method.** Two passes, split by method, neither verifying the other. One pass did
mechanical repo-reality checking (does the referenced file / route / component /
class / script / token / count exist as stated). One pass did doc-vs-doc reading
(duplication, contradiction, staleness, redundancy). Both were read-only. Findings
were merged, de-duplicated, and the highest-impact claims re-measured directly
before being written here.

**Reporting rule followed throughout:** symptom and observable location only. No
root cause, no prescribed fix. Where a claim was measured against the repo it is
marked `[measured]` with the command or file that produced the number.

`docs/PLAYBOOK.md` has one uncommitted edit (`git status` → ` M`); the working-tree
version was audited.

---

## Summary

### Totals by category

| Category | Count |
| --- | --- |
| **(b) Contradiction** | 46 |
| **(d) Dead reference** | 8 |
| **(c) Stale** | 36 |
| **(e) Obsolete** | 12 |
| **(a) Duplication** | 26 |
| **(f) Doc-level redundancy** | 12 |
| **Total** | **140** |

Two findings are filed under two categories because both readings are true of them:
**C-17 / B-42** (confirmation email) and **C-19** (dead root-layout description, which
is also one arm of **A-12**). The total counts rows, not unique issues.

### Highest priority — contradictions and dead references

These are the ones most likely to actively mislead, because nothing about them
looks wrong at a glance.

1. **B-01 — GBP Services is "still pending" and "Resolved" in the same file.**
   `docs/CANONICAL.md:258` vs `docs/CANONICAL.md:297`. The 2026-08-14 sweep
   (`b909f9f`) closed this in `SEO.md`, `PLAYBOOK.md` and CANONICAL §9, and missed
   CANONICAL §8. `docs/STATUS.md:720` says it "is not an open item and never was."
2. **D-02 — `LiveFrame` does not exist as an identifier.** Named 21 times across 7
   in-scope docs and treated as a component contract. `components/live-frame.tsx`
   exports `Frame`, `FrameMeta`, `BuildNarrative`. `[measured]`
3. **D-01 — the stated "visual ground truth" is not in the repo.**
   `TEKGUYZ Site.dc.html` / `TEKGUYZ Components.dc.html`, cited by `CLAUDE.md:62`,
   `docs/CANONICAL.md:287`, `docs/DESIGN.md:224`. `find . -name "*.dc.html"` → 0. `[measured]`
4. **B-02 / B-03 — the token guard is described three ways.** `CLAUDE.md:49` says 38
   tokens, `CLAUDE.md:125` says 24 *in the same file*, `docs/STATUS.md:398` says 39
   and `:558` says 38. `CLAUDE.md:125` also names DESIGN.md as the guard's source
   file while `CLAUDE.md:126` names TOKENS.md. Measured: **39 tokens, read from
   `docs/TOKENS.md`** (`scripts/check-design.ts:31`). `[measured]`
5. **B-05 — the CRM CORS rule is withdrawn in one half of CLAUDE.md and asserted in
   the other.** `CLAUDE.md:18` states it as a hard constraint; `CLAUDE.md:88`
   states it never applied. `docs/STATUS.md:142` claims all five places were corrected.
6. **D-03 — `sarah-demo.mp4` is described as present in four docs.** Deleted from the
   working tree (uncommitted `D` in `git status`). `[measured]`
7. **B-42 — the confirmation email is "currently missing entirely."**
   `docs/COPY.md:604`. It ships at `app/actions/contact.ts:414-455`. `[measured]`
8. **B-19 — the home hero headline in COPY.md is not the headline that renders.**
   `docs/COPY.md:83` vs `components/home-hero.tsx:127`. COPY.md is the named
   authority for page copy. `[measured]`
9. **B-11 — two different GBP URLs inside PLAYBOOK.md.** `:142` carries the
   `share.google` shortlink that `docs/STATUS.md:117` records as drift closed in
   `480bc78`; `:162` carries the `maps?cid=` form the code uses. `[measured]`
10. **B-34 / B-35 / B-41 — STATUS.md contradicts itself on phase state, token count
    and lint state.** It is the designated live anchor.

### Unverifiable

Full list in the [Unverifiable](#unverifiable) section below. Summary: production
Vercel state (the `vercel` MCP server is unauthenticated in this session), CRM-side
behaviour, six externally-named `.md` files, the two Claude Design exports, all
rendered-visual claims, and roughly 2,000 lines of DESIGN.md mechanism prose that
has no token or selector to compare against.

### Files modified

**None.** The only file created is this report,
`docs/audits/documentation-health-2026-08-28.md`. No commits were made.

**Path note.** The brief specified `docs/audit/`. The repo already uses
`docs/audits/` (holding `2026-08-13-component-audit.md`), so this report was written
there rather than creating a second near-identical directory. Say the word if the
literal `docs/audit/` path is wanted instead.

---

## (b) Contradictions

Two docs, or two sections of one doc, disagree.

| ID | Location(s) | Observed |
| --- | --- | --- |
| **B-01** | `docs/CANONICAL.md:258` ⇄ `docs/CANONICAL.md:297` ⇄ `docs/SEO.md:127` ⇄ `docs/PLAYBOOK.md:214` ⇄ `docs/STATUS.md:720` | §8 says GBP Services is "still pending, still a real ranking signal"; §9 of the same file, SEO.md, PLAYBOOK.md and STATUS.md all mark it resolved. |
| **B-02** | `CLAUDE.md:125` ⇄ `CLAUDE.md:126` ⇄ `docs/TOKENS.md:3-5` ⇄ `docs/STATUS.md:682-684` | L125 says `check:design` reads tokens DESIGN.md prints; L126 and TOKENS.md say `prebuild` reads `docs/TOKENS.md`. `scripts/check-design.ts:31` is `const DESIGN = 'docs/TOKENS.md'`. `[measured]` |
| **B-03** | `CLAUDE.md:49` (38) ⇄ `CLAUDE.md:125` (24) ⇄ `docs/DESIGN.md:30` (38) ⇄ `docs/STATUS.md:398` (39) ⇄ `docs/STATUS.md:486` (24) ⇄ `docs/STATUS.md:558` (38) | Four different token counts across three docs; CLAUDE.md and STATUS.md each carry two of them. `bun run scripts/check-design.ts` prints **39**. `[measured]` |
| **B-04** | `CLAUDE.md:83` (90 / 2 files / 1.6s) ⇄ `docs/STATUS.md:373` (97 / 3) ⇄ `docs/STATUS.md:491` (90) ⇄ `docs/STATUS.md:723` (73 / 0.7s) | Four test counts. `bun run test` → **97 tests, 3 files, 0.84–2.9s**. STATUS.md:377-383 self-flags its L491 as a dated record; CLAUDE.md:83 carries no such note. `[measured]` |
| **B-05** | `CLAUDE.md:18` ⇄ `CLAUDE.md:88` ⇄ `docs/STATUS.md:137-143` ⇄ `docs/CANONICAL.md:206` | L18: "CRM CORS is locked to `https://tekguyz.com`, so lead capture fails closed on every preview URL by design." L88: "CORS never applied to the CRM call." STATUS.md:142 states all five places were corrected. |
| **B-06** | `CLAUDE.md:111` ⇄ `docs/DESIGN.md:2105,2126` ⇄ `docs/STATUS.md:518` | CLAUDE.md says the message-list floor is `flex: 1 1 300px`; DESIGN.md and STATUS.md say `440px`. `components/concierge/concierge.tsx:602` ships `[flex:1_1_440px]`. `[measured]` |
| **B-07** | `CLAUDE.md:111` ⇄ `docs/DESIGN.md:2136-2151` ⇄ `docs/STATUS.md:520-531` | CLAUDE.md says "code still ships the height arm alone (D-04, Phase 2)". `components/concierge/concierge.tsx:81` is `SHEET_QUERY = '(max-height: 560px), (max-width: 767px)'` — both arms. `[measured]` |
| **B-08** | `docs/DESIGN.md:2155-2157` ⇄ `docs/STATUS.md:717-719` | DESIGN.md reasons from "a deliberate site-wide decision (no modals anywhere)"; STATUS.md records "**Modals/sheets are accepted**… described an intent the code never matched." |
| **B-09** | `docs/PLAYBOOK.md:49` ⇄ `docs/CANONICAL.md:38` ⇄ `docs/DESIGN.md:185-187` ⇄ `docs/TOKENS.md:86` | PLAYBOOK specifies "Geist for display headlines, **Inter** for body and UI text"; the other three say Geist is the single typeface and Inter was dropped. |
| **B-10** | `docs/DESIGN.md:193-196` ⇄ `docs/TOKENS.md:86-88` ⇄ `docs/DESIGN.md:1457-1462` ⇄ `docs/STATUS.md:217` | DESIGN.md §2 says Geist Mono is used in exactly three places; TOKENS.md says two, corrected by measurement 2026-08-13. DESIGN.md §5 separately asserts TOKENS.md is the wrong one — TOKENS.md had already been corrected. |
| **B-11** | `docs/PLAYBOOK.md:142` ⇄ `docs/PLAYBOOK.md:162` ⇄ `docs/COPY.md:686` ⇄ `docs/STATUS.md:117` | PLAYBOOK §9 lists the GBP as `share.google/7N09GDWh3d0R1UhEY`; PLAYBOOK §11, COPY.md and STATUS.md all record `maps?cid=13204262572880001655` as the decided form. `lib/site.ts:42` uses the `cid` form. `[measured]` |
| **B-12** | `CLAUDE.md:122` ⇄ `docs/STATUS.md:87` ⇄ `docs/DESIGN.md:1499,1635` ⇄ `docs/CANONICAL.md:161` | CLAUDE.md and STATUS.md say the reveal is "fade in + rise 8px"; DESIGN.md and CANONICAL.md say 16px. `app/globals.css:670` is `translate: 0 16px`. `[measured]` |
| **B-13** | `docs/CANONICAL.md:42` ⇄ `docs/TOKENS.md:75,84` ⇄ `docs/DESIGN.md:204,208,187` ⇄ `docs/DESIGN.md:1387-1393` | CANONICAL says the hero clamp tops near 96px at −0.04em with a 5–6× hero-to-body ratio; TOKENS.md says 40→72px; DESIGN.md says 72px / −0.045em / 4×; the home hero is a local 44→76px clamp at −0.05em. |
| **B-14** | `docs/DESIGN.md:204` ⇄ `docs/DESIGN.md:1391` | "the unchanged **596px** hero text column" vs "wraps to exactly 3 lines in the **564px** text column." |
| **B-15** | `docs/STATUS.md:402` ⇄ `docs/DESIGN.md:939,943` ⇄ `docs/DESIGN.md:972-973` | Launcher mobile geometry given as `py-[12px]` / 106×44 in STATUS.md, `px-4 py-[13px]` / 107×44 in DESIGN.md §4.13, and `12+18+12+2 = 44` thirty lines later in the same DESIGN.md section. |
| **B-16** | `docs/DESIGN.md:2196-2202` ⇄ `docs/DESIGN.md:935-941` ⇄ `docs/STATUS.md:402` | §8 says the launcher is "234.0 × 50.0px, byte-identical at all eight audited viewports… unchanged at every viewport"; §4.13 says it is sized per breakpoint and is 107 × 44 below 768px. |
| **B-17** | `docs/DESIGN.md:248-249` ⇄ `docs/TOKENS.md:118-128` ⇄ `docs/DESIGN.md:1355-1362` ⇄ `docs/STATUS.md:308` | §3 states "Elevation: flat. **[decided, standing]** Hairlines only, no shadows anywhere"; TOKENS.md and DESIGN.md §4.18 carry a dated scoped `--tg-elevate` exception. |
| **B-18** | `docs/DESIGN.md:1748-1753,177` ⇄ `docs/STATUS.md:217,326-332` ⇄ `docs/TOKENS.md:57-63` | DESIGN.md §1/§7 reason from `.ink-band` setting `--tg-secondary: #9ca3af`; STATUS.md records it moved to `muted-dark` and then to `#7B8291`. |
| **B-19** | `docs/COPY.md:83` ⇄ `docs/DESIGN.md:1381-1385` ⇄ `docs/STATUS.md:307` | COPY.md's home headline is "We build tech that actually works for your business."; `components/home-hero.tsx:127` renders "We build the systems your business runs on." COPY.md is the named authority for page copy. `[measured]` |
| **B-20** | `docs/COPY.md:89-91` ⇄ `docs/CANONICAL.md:98` ⇄ `docs/DESIGN.md:2334,1585-1586` ⇄ `docs/DESIGN.md:418-424` ⇄ `docs/STATUS.md:305` | Proof line survives as a live copy slot, a live homepage-sequence item and two live DESIGN.md rules, while DESIGN.md §4.4 marks the component superseded. `app/page.tsx:76` renders `<ProofStrip />`; no `proof-line` component exists. `[measured]` |
| **B-21** | `docs/CANONICAL.md:22-23` ⇄ `docs/PLAYBOOK.md:174` ⇄ `docs/STATUS.md:99` ⇄ `docs/DESIGN.md:825-832` | CANONICAL and PLAYBOOK mark `sarah-poster.webp` Done/Resolved; STATUS.md lists it as an open recapture with a phone mockup cut at y=0 and a visible "Demo Mode" badge. |
| **B-22** | `docs/PLAYBOOK.md:175` ⇄ `docs/STATUS.md:100` | PLAYBOOK says `sarah-thumb.webp` "the file itself is pending the recapture" and that `check:media` "fails the build until the file lands"; the file exists at 1080×1059 and `check:media` exits 0 with a ratio warning. `[measured]` |
| **B-23** | `docs/PLAYBOOK.md:184,186` ⇄ `docs/STATUS.md:100` | Recapture targets given as 1440×900 / WebP ~q90 in PLAYBOOK and 1920×1200 / WebP q82 in STATUS.md. |
| **B-24** | `docs/PLAYBOOK.md:97` ⇄ `docs/COPY.md:293` ⇄ `docs/STATUS.md:650-659` | Field Photo Reports outcome copy differs; STATUS.md records the reword and why the PLAYBOOK wording was retired. |
| **B-25** | `docs/DESIGN.md:261-264` ⇄ `docs/DESIGN.md:533-544` ⇄ `docs/STATUS.md:289` | §3 reasons from `closing-cta`'s 40/32px top padding and a resulting 110px desktop gap; §4.5 gives 48/64 and 64/80 padding and a 68px desktop gap. |
| **B-26** | `docs/DESIGN.md:1239-1240` ⇄ `docs/DESIGN.md:1205-1212,1392` ⇄ `docs/STATUS.md:295-296,307` | Fold clearance at 1280×720 given as 18px in two places and 30px in two others. |
| **B-27** | `docs/DESIGN.md:1643-1649` ⇄ `docs/DESIGN.md:606-609` ⇄ `docs/CANONICAL.md:163` | §6.4 marks the hero load sequence and shared-element transition `[export]` (unbuilt); §4.5 carries a `[measured 2026-08-12 closing-cta.tsx:46, load-sequence.tsx]` claim that the band replays the load-sequence timing. |
| **B-28** | `docs/CANONICAL.md:169` ⇄ `docs/DESIGN.md:1662-1665` ⇄ `CLAUDE.md:122` | Three banned-motion lists with different trailing items: CANONICAL adds "uniform fade-everything-in", DESIGN adds "scroll-jacking beyond the single pinned section", CLAUDE.md has neither. |
| **B-29** | `CLAUDE.md:60` ⇄ `docs/CANONICAL.md:111-147` ⇄ `docs/STATUS.md:8-11` | CLAUDE.md and CANONICAL name the three measured-and-already-built blockers as testimonial / FAQ / footer location; STATUS.md names testimonial / **GBP Services** / footer location. |
| **B-30** | `docs/CANONICAL.md:12` ⇄ `docs/PLAYBOOK.md:5` ⇄ `CLAUDE.md:56` ⇄ `docs/TOKENS.md:21` | CANONICAL states the chain as "Brand Playbook v2 > this brief > Design System v2.0 > Copy Deck v2"; CLAUDE.md and TOKENS.md state "CANONICAL > DESIGN > COPY > SEO" with PLAYBOOK absent. |
| **B-31** | `docs/PLAYBOOK.md:29` (v2.4) ⇄ `docs/DESIGN.md:1` (v2.6) ⇄ `docs/CANONICAL.md:10,12` (v2.0) | Three DESIGN.md version numbers cited across three docs. |
| **B-32** | `docs/PLAYBOOK.md:53` + `docs/DESIGN.md:278` ⇄ `docs/DESIGN.md:378-379` | "Exactly three per page — top of hero, above closing CTA, bottom of footer" is stated twice, while §4.3 describes every inner route as opening with a `page-hero` signature stripe; no reconciliation appears in any doc. |
| **B-33** | `docs/PLAYBOOK.md:55` ⇄ `docs/DESIGN.md:127,1436` | PLAYBOOK still specifies "a pulsing 'LIVE — TRY IT YOURSELF' badge" as the live-demo signature; DESIGN.md records the measured status line replacing that badge everywhere. |
| **B-34** | `docs/STATUS.md:14` ⇄ `docs/STATUS.md:79` ⇄ `docs/STATUS.md:107-108` | The header says "Build Phase 1 shipped"; the plan table says "Partly shipped 2026-08-12"; two Phase 1 rows remain under "Open — code". |
| **B-35** | `docs/STATUS.md:83` ⇄ `docs/STATUS.md:347-355` ⇄ `docs/STATUS.md:224-226` | The plan table's Phase 5 row says "two items shipped 2026-08-13" with `contact-form.tsx` at 428 lines; the Phase 5 dedup section says shipped 2026-08-14 with the file at 428 → 481, and three further audit rows struck through as shipped 2026-08-14. |
| **B-36** | `CLAUDE.md:122` ⇄ `docs/STATUS.md:85-91` ⇄ `docs/DESIGN.md:1491-1671` | CLAUDE.md says "A real motion system is Phase 1 — **until it lands**, this bullet is the only guidance there is"; STATUS.md records the state and presence layers shipped and DESIGN.md §6 is rewritten as the three-layer system. |
| **B-37** | `docs/SEO.md:51,57` ⇄ `docs/PLAYBOOK.md:79` ⇄ `docs/COPY.md` | SEO.md requires the `Service` description be "drawn from that page's own COPY.md content"; the example string at `:51` is PLAYBOOK.md:79 verbatim and does not appear in COPY.md. |
| **B-38** | `docs/CANONICAL.md:190` ⇄ `docs/STATUS.md:611-614` ⇄ `docs/COPY.md:642,661` | CANONICAL says the privacy policy "already discloses" Speed Insights; STATUS.md records that Speed Insights was mounted and undisclosed. |
| **B-39** | `docs/PLAYBOOK.md:111` ⇄ `docs/COPY.md:445` | Bilingual Restaurant Menu "Built For" line differs by one word ("Local"). |
| **B-40** | `docs/STATUS.md:398` ⇄ `docs/STATUS.md:558` | "39 tokens now" and "38 tokens" in the same document. `[measured]` — 39 is correct. |
| **B-41** | `docs/STATUS.md:491,558,637` ⇄ `docs/STATUS.md:115,377-383` | Three verification blocks say "lint clean but for the known `contact-form.tsx` warning"; the Open-code table records that warning closed 2026-08-13 in `6a6ee41` and L377 says "there is no known lint warning in this repo". `bun run lint` produces no output. `[measured]` |
| **B-42** | `docs/COPY.md:604,606` ⇄ `docs/CANONICAL.md:24` | COPY.md heads the section "CONFIRMATION EMAIL (new — currently missing entirely)" and says "the submitter hears nothing until a human replies"; CANONICAL lists submitter confirmation as built and live, and it ships at `app/actions/contact.ts:414-455`. `[measured]` |
| **B-43** | `CLAUDE.md:96` ⇄ code | "`data-on` = persistent ink ('you are here', **nav only**)". `data-on="true"` also ships at `components/contact-form.tsx:262` and `components/process-teaser.tsx:64`. `[measured]` |
| **B-44** | `CLAUDE.md:102` ⇄ code | "One inline placement survives, `home-hero.tsx` (`1 / 7`)". Two exist — `components/home-hero.tsx:99` and `components/process-steps.tsx:82` (`gridColumn: '1 / 3'`). `[measured]` |
| **B-45** | `docs/TOKENS.md:172-173` ⇄ `app/globals.css:363-370` | TOKENS.md says section rhythm is "deliberately not a token — it lives at the call sites"; a `.tg-section` class exists (`padding-block: 128px`, 80px under `max-width: 767px`) and is consumed by `app/not-found.tsx:8` and `app/error.tsx:19`. `[measured]` |
| **B-46** | `CLAUDE.md:73` ⇄ code | "Mapping lives only in `config/solutions.ts` (the home ink band is the one documented exception)". `components/load-sequence.tsx:111-116` declares its own `DOTS` array of the four accent custom properties. `[measured]` |

---

## (d) Dead references

Points to a file, route, component, class, script, section heading, or doc that does
not exist, or was renamed or moved.

| ID | Location(s) | Observed |
| --- | --- | --- |
| **D-01** | `CLAUDE.md:62` · `docs/CANONICAL.md:287` · `docs/DESIGN.md:224` | `TEKGUYZ Site.dc.html` and `TEKGUYZ Components.dc.html` are named as the approved visual ground truth that overrides the docs. `find . -name "*.dc.html"` returns nothing. `[measured]` |
| **D-02** | `CLAUDE.md:77,79` · `docs/CANONICAL.md:66-69` · `docs/DESIGN.md` ×7 · `docs/COPY.md:277,406` · `docs/PLAYBOOK.md:168,184` · `docs/SEO.md` ×1 · `docs/TOKENS.md` ×2 | `LiveFrame` is named 21 times across 7 in-scope docs, including as a hard rule with a `padding`/fill/status-block contract. No identifier `LiveFrame` exists; `components/live-frame.tsx` exports `Frame`, `FrameMeta`, `BuildNarrative`. `docs/DESIGN.md:711-720` already measured this; the other six docs did not follow. `[measured]` |
| **D-03** | `docs/CANONICAL.md:23,97` · `docs/COPY.md:87` · `docs/PLAYBOOK.md:188` | All four describe `public/media/sarah-demo.mp4` as an existing file ("still shows the retired phone-call simulator — do not ship it as-is"). The file is deleted from the working tree (uncommitted `D`). Also referenced at `components/home-hero.tsx:70`. `[measured]` |
| **D-04** | `docs/PLAYBOOK.md:9` (×3) · `:205` · `:211` | `TEKGUYZ-Business-DNA.md`, `TEKGUYZ-Site-Copy-Deck.md`, `TEKGUYZ-Section13-Asset-Generation-Brief.md`, `TEKGUYZ-LinkedIn-GBP-Copy.md` — none resolve from this repo. `:9` also names `TEKGUYZ-Site-Copy-Deck.md` "the ground truth for anything nav/page/component-level," where `:5`, CLAUDE.md and CANONICAL name `docs/COPY.md`. `[measured]` — see Unverifiable, these may exist outside the repo. |
| **D-05** | `docs/COPY.md:5` | "**Governed by:** TEKGUYZ-REBUILD-CANONICAL.md. **Supersedes:** site-copy-deck.md." Neither resolves from this repo; the governing document is `docs/CANONICAL.md`. `[measured]` |
| **D-06** | `docs/CANONICAL.md:205` | `docs/WEBHOOK_INTEGRATION.md` — qualified in-line as living in the CRM repo, but written as a `docs/` path that does not resolve from here. `[measured]` |
| **D-07** | `CLAUDE.md:125` · `docs/STATUS.md:104` | Both cite `DESIGN.md §2.1` and `§3.1` as converted and enforced sections. `docs/DESIGN.md` has no `§2.1` or `§3.1` heading — its subheadings run `## 2.` → `## 3.` → `## 4.` → `### 4.1`. `[measured]` |
| **D-08** | `docs/CANONICAL.md:3-10` | An opening "**Delete these**" list of five filenames; none of the five is present in the repo. `[measured]` |

---

## (c) Stale

Doc describes a state that `STATUS.md` or the repo shows has since changed.

| ID | Location(s) | Observed |
| --- | --- | --- |
| **C-01** | `CLAUDE.md:49` | "38 tokens are asserted against `globals.css`." `bun run scripts/check-design.ts` prints `39 tokens match docs/TOKENS.md`. `[measured]` |
| **C-02** | `CLAUDE.md:54` · `docs/DESIGN.md:34` | "DESIGN.md was 89KB doing two jobs." `docs/DESIGN.md` is 149,568 bytes / 2,345 lines today. `[measured]` |
| **C-03** | `CLAUDE.md:83` | "`bun run test` (90 cases across 2 files, ~1.6s)". Actual: 97 tests across 3 files (`lib/validation.test.ts`, `lib/overlap-verdict.test.ts`, `components/concierge/panel-motion.test.ts`). `[measured]` |
| **C-04** | `CLAUDE.md:122` | "`motion` imported in 2 files, and no transitions on hover states, the accordion, the form steps or the status line." `motion` is imported in 4 files (`concierge.tsx`, `fold-board.tsx`, `load-sequence.tsx`, `proof-strip.tsx`); `.hover-row`/`.hover-card` (`globals.css:751-769`), `.tg-collapse` (`:963-991`) and `.tg-rule` (`:856`) all declare transitions. `[measured]` |
| **C-05** | `CLAUDE.md:124` | "a 1,900-line file" for `scripts/audit-mobile.ts` — it is 2,124 lines. Same line names `playwright-core`; the dependency and the import at `:40` are `playwright`. `[measured]` |
| **C-06** | `CLAUDE.md:145` | "are the 5 env vars set?" `.env.example` names 6 required keys plus one optional and two commented aliases. `[measured]` |
| **C-07** | `CLAUDE.md:120-128` | The tooling section documents `check:design` and `check:media` but never `check:hex` or `icons`, both of which run in `prebuild` (`package.json:6`). `[measured]` |
| **C-08** | `docs/DESIGN.md:30-31` | "**38 tokens are under test** — measured 2026-08-12 by running it; this line said 40." Running it now returns 39. `[measured]` |
| **C-09** | `docs/DESIGN.md:1866-1876` | The §8 8-column span table omits `fold-board` (`components/fold-board.tsx:96`, `[grid-column:span_3] max-lg:[grid-column:span_4]`, added 2026-08-14). Every other row matches the code. `[measured]` |
| **C-10** | `docs/DESIGN.md:342-345,1062-1066` | Both describe `nav.tsx:104`'s hardcoded duration as an open drift "logged in STATUS.md"; `docs/STATUS.md:217` records it now reading `var(--dur-base)`. |
| **C-11** | `docs/DESIGN.md:1180-1186` | Describes `footer-dark.tsx`'s literal `#747C8B` as "logged in STATUS.md; not fixed here"; `docs/STATUS.md:217` and `:336-337` record it fixed in `2881076` and now banned by `scripts/check-hex.ts`. |
| **C-12** | `docs/DESIGN.md:1751` · `docs/DESIGN.md:155` | Reasons from the pre-change ink-band contrast figure that `docs/STATUS.md:315-332` records as one of two superseded numbers. |
| **C-13** | `docs/DESIGN.md:426-446` | Prints measured layout values (36px padding, 20px gap, `tap-44`, column placement) for the `proof-line` component that `:418-424` declares no longer exists. |
| **C-14** | `docs/CANONICAL.md:264,281-282` | "Steps 1–6 are complete, and step 7's domain half is done" · "7. **Remaining before launch:** add the privacy disclosures… and recapture the compact-context images." The site is live (`CLAUDE.md:4`) and the privacy rewrite shipped 2026-08-13 (`docs/STATUS.md:605-624`). |
| **C-15** | `docs/CANONICAL.md:230` | "`RESEND_API_KEY=  # rotate the exposed one **before launch**`" — the site is live; no doc records whether the rotation happened. See Unverifiable. |
| **C-16** | `docs/CANONICAL.md:96-103` | The homepage sequence lists 8 items with "Proof line" at position 3 and no proof strip or build board; the fold was rebuilt 2026-08-14 as `proof-strip` + `fold-board` (`docs/STATUS.md:298-313`, `docs/DESIGN.md:1318-1337`). |
| **C-17** | `docs/COPY.md:604-606` | Section headed "CONFIRMATION EMAIL (new — currently missing entirely)". Shipped at `app/actions/contact.ts:414-455`. (Also filed as B-42.) `[measured]` |
| **C-18** | `docs/SEO.md:5` | "all 11 routes." The repo has 8 `page.tsx` route patterns; `app/sitemap.ts` emits 18 URLs (6 static + 4 solutions + 8 work). `[measured]` |
| **C-19** | `docs/SEO.md:126` · `docs/CANONICAL.md:253` · `docs/PLAYBOOK.md:219` | All three carry "delete the root layout's fallback description string — dead code" as an open item. `app/layout.tsx:21` documents that no fallback description is on the object. `[measured]` |
| **C-20** | `docs/CANONICAL.md:254` · `docs/PLAYBOOK.md:219` | Both carry "sitemap.ts stamps every route's lastModified with request-time `new Date()`" as open. `app/sitemap.ts:42` uses `entry.updatedAt` for the 8 work routes and `:28` hardcodes `/privacy`; only the 4 static + 4 solution routes still use request time. `[measured]` |
| **C-21** | `docs/PLAYBOOK.md:219` | "canonical URLs on all **5 pages**" against 8 route patterns / 18 sitemap URLs today. `[measured]` |
| **C-22** | `docs/PLAYBOOK.md:175` | "`sarah-thumb.webp` … the file itself is pending the recapture. `bun run check:media` fails the build until the file lands." The file exists (1080×1059); `check:media` exits 0 with a ratio warning. `[measured]` |
| **C-23** | `docs/PLAYBOOK.md:169-180` | "Current set, all `.webp`" lists 9 files; `public/media/` holds 10. `sarah-poster-mobile.webp` (1038×584, wired at `content/work.ts:136` as `heroPosterMobile`) is absent from the list. `[measured]` |
| **C-24** | `docs/PLAYBOOK.md:205` | "Still open: profile pictures and cover banners per platform" — no corresponding row in `docs/STATUS.md`'s "Open — needs the user" or "Open — post-launch". |
| **C-25** | `docs/STATUS.md:100` | "Current, all wrong: `field-ops-thumb` 769×754 …" under a row headed "Recapture 8 posters at 16:10". `public/media/field-ops-thumb.webp` is now 1440×900 (ratio 1.600, on-ratio), replaced 2026-08-17 in `baee083`; `check:media` flags 7 of 8. `[measured]` |
| **C-26** | `docs/STATUS.md:83,195` | Line counts: `concierge.tsx` 709, `contact-form.tsx` 428, `actions/contact.ts` 393. Actual: 755 / 516 / 463. `[measured]` |
| **C-27** | `docs/STATUS.md:354` | "File 428 → 481 lines" for `contact-form.tsx` (actual 516), and "`Field` is defined in the same file (`:441-492`)" — `function Field` is at `:471`, `FieldError` at `:510`. `[measured]` |
| **C-28** | `docs/STATUS.md:189` | "All 30 files in `components/` read in full." `components/` now holds 35 files. `[measured]` |
| **C-29** | `docs/STATUS.md:558` | "`check:design` 38 tokens · lint clean but for the known `contact-form.tsx` warning." Guard reports 39; `bun run lint` produces no output. `[measured]` |
| **C-30** | `docs/STATUS.md:723` | "`bun run test` now gates the build via `prebuild` (73 cases, ~0.7s)." Actual 97 tests. Line 547 in the same file already says "90 → 97 tests". `[measured]` |
| **C-31** | `docs/STATUS.md:13,40,45` | Header stamps read "Last updated: 2026-08-13", "Last updated 2026-08-14", and "Push state, measured 2026-08-14 … `origin/master` at `a60392e`". The newest work described in-file is 2026-08-18/19 (CRM signing, `:119`); `git log` HEAD is `cf979f1` (2026-08-19). Today is 2026-08-28. `[measured]` |
| **C-32** | `docs/STATUS.md:59-61` | "Changed 2026-08-12: `CLAUDE.md`, `STATUS.md`, `DESIGN.md`, `COPY.md`, `SEO.md`, and `TOKENS.md` is new" is presented as the current attachment delta; STATUS.md itself then records doc changes on 2026-08-13, 08-14 and 08-18. |
| **C-33** | `docs/STATUS.md:16,81` ⇄ `:101` ⇄ `docs/COPY.md:628` | Build Phase 3 is summarised as "Shipped 2026-08-13" while its privacy-policy legal review remains open in the same document and in COPY.md — the partial-close pattern `CLAUDE.md:72` names as forbidden. |
| **C-34** | `docs/TOKENS.md:179` | "The site is hex throughout — **50 values** in `globals.css`, zero OKLCH." `app/globals.css` contains 55 hex literal occurrences, 29 unique. Zero OKLCH is correct. `[measured]` |
| **C-35** | `CLAUDE.md:73` | "`/contact`'s trust facts and `closing-cta` render the same three facts the same way — one muted line, 3px `muted-soft` mid-dots." `docs/DESIGN.md:562-572,1978-1991` records that below 766px the row becomes a deliberate stack with the dots not rendered. |
| **C-36** | `docs/STATUS.md:30` | The 2026-08-13 close-out paragraph is the last narrative summary in the header; the select-dropdown dark-theme fix (`cf979f1`, 2026-08-19) appears nowhere in STATUS.md. `[measured]` |

---

## (e) Obsolete

Describes a decision, constraint, or feature that has been superseded and no longer
applies at all — not merely out of sync.

| ID | Location(s) | Observed |
| --- | --- | --- |
| **E-01** | `CLAUDE.md:126` | The whole `.vercelignore` rule is built on "`.vercelignore` excludes `docs/` from what a git-connected deploy uploads". `.vercelignore` contains only `scripts/verify.ts` and `scripts/audit.ts`; `docs/STATUS.md:695` records the `docs/` line removed in `8f7a413`. `[measured]` |
| **E-02** | `CLAUDE.md:18` | "CRM CORS is locked to `https://tekguyz.com`, so lead capture fails closed on every preview URL by design" — `app/actions/contact.ts:325-340` and `CLAUDE.md:88` both state CORS never applied to this server-side call. |
| **E-03** | `docs/CANONICAL.md:182` | Stack table row: "Components | shadcn/ui, minimal set, restyled to tokens." No `components/ui/` directory exists; `package.json` has no `@radix-ui/*`, no `class-variance-authority`, no shadcn dependency. `[measured]` |
| **E-04** | `docs/CANONICAL.md:3-10` | An opening "Delete these" list plus "**Only two more documents will exist after this one:** Copy Deck v2 and Design System v2.0. **Nothing else.**" `docs/` now holds 7 top-level docs. `[measured]` |
| **E-05** | `docs/CANONICAL.md:109-147` (§5 in full) | All four "content gaps" are struck through as false or resolved; the section's stated purpose at `:111-114` is now to preserve a documentation-failure record, not to list gaps. |
| **E-06** | `docs/DESIGN.md:416-493` (§4.4 as a component spec) | `:418-424` declares the component superseded 2026-08-14 and `:1405-1408` confirms "superseded as a component, retained as reasoning", while the section still reads as a live spec. |
| **E-07** | `docs/DESIGN.md:2196-2216` (§8 Launcher subsection) | Describes a single-size, never-shrinking launcher that §4.13 `:935-941` replaced with a per-breakpoint one. |
| **E-08** | `docs/CANONICAL.md:62-69` (§3 deferred embed) | Specifies "One `<LiveFrame>` component. Per-project `embeddable: boolean`"; `docs/DESIGN.md:716-720` records that this API "has never existed in this shape". (`embeddable: boolean` does exist on `content/work.ts:43`, `false` on all 8 — the component half is what does not.) `[measured]` |
| **E-09** | `docs/CANONICAL.md:196-203` (§7 carrying forward) | Written in the imperative future ("port as *the base structure*", "**Critical fix, not optional: rename the honeypot field**") for work `docs/CANONICAL.md:24` and `CLAUDE.md:82` both record as built and live. |
| **E-10** | `docs/CANONICAL.md:220` (§7 rate limiter) | "The in-memory token bucket is per-instance on Vercel… Generalize to `lib/rate-limit.ts`" — `:25` in the same file describes a "shared **durable** rate limit". |
| **E-11** | `docs/CANONICAL.md:212` | The superseded 2026-08-11 UPSERT-BY-EMAIL paragraph is retained inline beneath its own correction, with the withdrawn "silently destroyed" claim still readable as prose. |
| **E-12** | `docs/SEO.md:3` | "*Becomes `/docs/SEO.md` in the repo.*" It already is that file. |

---

## (a) Duplication

Verbatim or paraphrased, two docs (or two spots in one doc) saying the same thing.

| ID | Location(s) | Observed |
| --- | --- | --- |
| **A-01** | `docs/TOKENS.md:39-54` ⇄ `docs/DESIGN.md:147-167` ⇄ `docs/PLAYBOOK.md:33-47` | The full colour palette printed in three places, one of them enforced. `docs/DESIGN.md:44-45` states "Do not copy a token value back into this file"; §1 is marked "Not converted" at `:54`. |
| **A-02** | `docs/TOKENS.md:66-68` ⇄ `docs/DESIGN.md:164-167` ⇄ `docs/DESIGN.md:173` | Accent `-text` contrast ratios given in a TOKENS.md block, a DESIGN.md table, and again as DESIGN.md prose. |
| **A-03** | `docs/TOKENS.md:56-63` ⇄ `docs/DESIGN.md:153,155` ⇄ `docs/STATUS.md:323-332` | `muted` / `muted-dark` contrast figures in three docs. |
| **A-04** | `docs/TOKENS.md:105-116` ⇄ `docs/DESIGN.md:230-231,694,756,788,1849` | Radius / container / spacing values reprinted five times in DESIGN.md. |
| **A-05** | `docs/TOKENS.md:137-146` ⇄ `docs/DESIGN.md:343,1111,1680,2221,2269` | Motion durations restated as literals in DESIGN.md prose, against `docs/DESIGN.md:1067-1068`'s own instruction not to print them. |
| **A-06** | `docs/TOKENS.md:84` ⇄ `docs/DESIGN.md:220,1846,1879` | Type-scale rendered sizes reprinted in DESIGN.md. |
| **A-07** | `docs/TOKENS.md:144` ⇄ `docs/CANONICAL.md:161` ⇄ `docs/DESIGN.md:1015` | The `--ease-entrance` curve printed as a literal in three docs. |
| **A-08** | `docs/PLAYBOOK.md:156` ⇄ `docs/COPY.md:116` ⇄ `docs/SEO.md:29` | Testimonial body text, byte-identical in three docs. Attribution reasoning duplicated at `docs/PLAYBOOK.md:158` ⇄ `docs/CANONICAL.md:304` ⇄ `docs/COPY.md:122-127`. |
| **A-09** | `docs/PLAYBOOK.md:97-103,107-120` ⇄ `docs/COPY.md:281-468` | The same 8 builds' case-study and project descriptions, longer form in COPY.md. |
| **A-10** | `docs/PLAYBOOK.md:71-93` ⇄ `docs/COPY.md:99-102,165-168,181-255` ⇄ `docs/SEO.md:50-51` | Solution-line descriptions in three docs. |
| **A-11** | `docs/CANONICAL.md:28,295` ⇄ `docs/PLAYBOOK.md:199` ⇄ `docs/DESIGN.md:191` ⇄ `docs/STATUS.md:667` | The `lockup-master.svg` `<text>`-element issue stated in five places. |
| **A-12** | `docs/SEO.md:125-127` ⇄ `docs/CANONICAL.md:253-255,258` ⇄ `docs/PLAYBOOK.md:219` | The same "outstanding technical items" backlog in three docs — two of which now disagree about GBP (B-01). |
| **A-13** | `docs/SEO.md:11-14` ⇄ `docs/CANONICAL.md:250-252` ⇄ `docs/COPY.md:672-679` | `BreadcrumbList` / `metadataBase` / OG rules in three docs. |
| **A-14** | `CLAUDE.md:64-127` ⇄ `docs/DESIGN.md` §§3,4,6,8 | CLAUDE.md's Hard rules restate DESIGN.md near-verbatim across ~11 bullet pairs: `:77`⇄`DESIGN:742-764`, `:78`⇄`448-453`, `:96`⇄`1547-1583`, `:97`⇄`1599-1603,1676-1680`, `:98`⇄`1778-1799`, `:102-104`⇄`1903-1967`, `:105`⇄`251-276`, `:109`⇄`2029-2046`, `:111-113`⇄`2099-2223`, `:114-115`⇄`2048-2095`, `:116`⇄`1473-1479`. |
| **A-15** | `CLAUDE.md:149` ⇄ `docs/DESIGN.md:1682-1685` ⇄ `docs/STATUS.md:727-730` | The Windows-animations-off verification note in three places. |
| **A-16** | `CLAUDE.md:6,20` ⇄ `docs/CANONICAL.md:270-279` | The Vercel one-project topology paragraph in two places. |
| **A-17** | `CLAUDE.md:87-88` ⇄ `docs/CANONICAL.md:205-206,214` ⇄ `docs/STATUS.md:119-185` | The CRM signing protocol in three places. |
| **A-18** | `CLAUDE.md:82-84` ⇄ `docs/CANONICAL.md:203,208` | Honeypot naming and optional-field validation rules in two places. |
| **A-19** | `docs/COPY.md:141` ⇄ `docs/COPY.md:499` | Identical trust-line strings in the Home closing CTA and `/contact`. `CLAUDE.md:73` records this as intentional. |
| **A-20** | `docs/DESIGN.md:2136-2151` ⇄ `docs/DESIGN.md:1114-1119,2163-2183` | The sheet-threshold derivation stated twice in one doc. |
| **A-21** | `docs/DESIGN.md:241` ⇄ `:660-667` ⇄ `:1903-1912,1947-1957` | The alternating-row / `grid-row: 1` mechanism stated three times in one doc. |
| **A-22** | `docs/DESIGN.md:88` ⇄ `:1246-1252` ⇄ `:1959-1967` | The `gap-y-12`-never-applied incident stated three times in one doc. |
| **A-23** | `docs/DESIGN.md:1173-1178` ⇄ `:2083-2089` | The `tap-44` footer-gap arithmetic stated twice in one doc. |
| **A-24** | `docs/DESIGN.md:1009-1049` ⇄ `:1530-1538` | The concierge presence-motion rationale stated twice in one doc. |
| **A-25** | `docs/COPY.md:295-304` ⇄ `docs/COPY.md:685` | The Field Photo Reports `[NEEDS REAL DATA]` history recorded twice in one doc. |
| **A-26** | `docs/TOKENS.md:7-12` ⇄ `docs/DESIGN.md:26-45` ⇄ `CLAUDE.md:58` ⇄ `docs/STATUS.md:59-61` | The TOKENS/DESIGN split rationale, same in substance, in four places. |

---

## (f) Doc-level redundancy

A document or whole section whose purpose now substantially overlaps another.
**Flagged only — no recommendation to delete or merge.**

| ID | Location(s) | Observed |
| --- | --- | --- |
| **F-01** | `docs/CANONICAL.md:246-258` (§8 SEO) ⇄ `docs/SEO.md` in full | Both enumerate the JSON-LD types, the OG/`metadataBase` rule, favicon retention, the sitemap `lastModified` item and the GBP item. `docs/SEO.md:5` declares a division of labor against COPY.md but not against CANONICAL §8. |
| **F-02** | `docs/CANONICAL.md:16-28` (§1) and `:262-297` (§9) ⇄ `docs/STATUS.md` | Both are current-state ledgers. `docs/STATUS.md:3-5` asserts it is "the only live status document"; CANONICAL §1's status column and §9's "Remaining before launch" are a second one. |
| **F-03** | `docs/CANONICAL.md:109-147` (§5) | Every row closed; its remaining function is a documentation-failure record that `CLAUDE.md:60` and `docs/STATUS.md:7-12` also carry. |
| **F-04** | `docs/DESIGN.md:145-179` (§1) ⇄ `docs/TOKENS.md:33-68` | §1 is the values table TOKENS.md was extracted to own; DESIGN.md `:54` marks §1 "Not converted" and `:44` forbids copying values back. |
| **F-05** | `docs/DESIGN.md:230-231` (§3) ⇄ `docs/TOKENS.md:105-116` | §3 points at TOKENS.md two lines after printing the same radius/container/spacing values. |
| **F-06** | `docs/PLAYBOOK.md:27-57` (§3) ⇄ `docs/DESIGN.md` §§1-3 ⇄ `docs/TOKENS.md` | A third statement of the palette, accent mapping, stripe rule, dark-mode rule and "explicitly avoided" list. `docs/PLAYBOOK.md:5,29` both already defer to DESIGN.md for the visual system. |
| **F-07** | `docs/PLAYBOOK.md:95-120` (§§6-7) ⇄ `docs/COPY.md` build sections | The eight builds' pitch copy and links exist in both; `docs/COPY.md:3-5` declares itself the copy deck. |
| **F-08** | `docs/PLAYBOOK.md:164-190` (§12) ⇄ `docs/STATUS.md:99-100` | Both hold the media inventory, ratio rule, current-file state and recapture instruction — at different resolutions and quality targets (B-23). |
| **F-09** | `docs/PLAYBOOK.md:209-219` (§14) ⇄ `docs/CANONICAL.md` §8 ⇄ `docs/SEO.md` "Outstanding technical items" | Three overlapping SEO backlogs, with the GBP item resolved in two and pending in the third (B-01). |
| **F-10** | `docs/DESIGN.md:2099-2277` (§8 launcher + concierge geometry) ⇄ `docs/DESIGN.md:918-1150` (§4.13) | Both specify the same component's geometry, yield behaviour and sheet contract; §8 carries the pre-2026-08-13 figures (B-16). |
| **F-11** | `docs/DESIGN.md:2281-2345` (§9 Do / Don't) | Self-described at `:2283-2290` as "a summary of rules argued for elsewhere… never the authority" — a fifth restatement layer alongside CLAUDE.md's Hard rules; one entry (`:2334`) points at a superseded section. |
| **F-12** | `CLAUDE.md:64-127` (Hard rules) ⇄ `docs/DESIGN.md` §§3,4,6,8 and `docs/CANONICAL.md` §7 | See A-14. Roughly 30 of ~40 bullets restate a rule with a fuller home elsewhere; six of them have drifted from it (B-02, B-03, B-04, B-06, B-07, B-12). |

---

## Unverifiable

Could not be confirmed from this repo. Not guessed, not silently skipped.

**Needs external access**

1. **Production Vercel state** — the one-project/`tekguyz-site` topology (`docs/CANONICAL.md:270-279`, `CLAUDE.md:6,20`), preview SSO gating (`CLAUDE.md:18`), current deployment target, and whether the 6 env vars are set. The `vercel` MCP server is unauthenticated and this session is non-interactive, so `list_projects` / `get_project` / `list_deployments` / `get_runtime_errors` could not run. Authorize the connector via claude.ai connector settings, or `claude mcp` / `/mcp` in an interactive session.
2. **CRM-side behaviour** — the upsert-by-email contract, the 2026-08-17 first-known-value change, `lead_submissions` rows, the AI Spam Shield, the 30/min org rate limit, and the 401/400/429 response table (`docs/CANONICAL.md` §7 "Confirmed CRM contract"). Needs live calls to `CRM_TRIAGE_ENDPOINT` with a real secret. Not attempted.
3. **Whether `RESEND_API_KEY` was ever rotated** (`docs/CANONICAL.md:221-230`). No doc records an outcome; needs Vercel env-var state, which the connector deliberately cannot read.
4. **Supabase schema** — out of scope per the brief; nothing in these docs was checked against it.

**Named but not resolvable from this repo**

5. **`TEKGUYZ Site.dc.html` / `TEKGUYZ Components.dc.html`** (D-01) — reported dead *from this repo*. Whether they exist as Claude Design exports elsewhere is human knowledge.
6. **Six external `.md` files** — the four in `docs/PLAYBOOK.md:9,205,211` (D-04) and the two in `docs/COPY.md:5` (D-05). Same situation: unresolvable here, not proven nonexistent globally.
7. **`docs/WEBHOOK_INTEGRATION.md`** (D-06) — CANONICAL says it lives in the CRM repo, which is not attached.
8. **GBP profile itself** — whether the Services section is genuinely live, and whether the review permalink still resolves, cannot be checked from the repo. Only the docs' internal agreement was audited.
9. **`docs/COPY.md:687` item 3** — "Confirm the Field Photo Reports demo still exposes the admin/installer switcher… and that the Bundle Builder sandbox still accepts `1` as the test card." Both are external live products.

**Needs a browser or a build**

10. **All rendered-visual claims** — dark-mode appearance, focus-ring visibility, actual tap-target hit-testing, the `/process` pin, hydration warnings, and `audit:mobile` results. Out of scope per the brief's constraints. Note this machine matches `prefers-reduced-motion: reduce` machine-wide, so motion-enabled verification is structurally impossible here regardless.
11. **B-32 (signature stripe count)** — resolving "exactly three per page" against `page-hero`'s own stripe needs a DOM count, not a read.
12. **Whether `check:media`'s 7 ratio warnings are still wanted as warnings** — a decision, not a measurement.

**Needs human intent**

13. **B-30 (authority chain)** — CANONICAL puts PLAYBOOK at the top; CLAUDE.md and TOKENS.md omit it entirely. Which is intended is not readable from the text.
14. **`docs/PLAYBOOK.md` working-tree state** — audited as-is per instruction. The uncommitted edit is a one-line change at `:63` (removing "direct-to-builder" from the core-values list); no finding in this report traces to it, but the file was not diffed section-by-section against `HEAD`.

**Out of scope by the brief**

15. **`README.md`** — `docs/STATUS.md:139-143` names it as one of five places carrying the withdrawn CORS claim. It is outside the stated scope (`CLAUDE.md` + `docs/`) and was not audited.
16. **`docs/archive/HISTORY.md`, `docs/archive/MOBILE-AUDIT.md`, `docs/audits/*`, `docs/plans/*`, `docs/archive/superpowers/*`** — read as evidence, not audited as targets.

---

## Sweep results with no findings

Recorded so the negative space is visible.

- **Routes.** Every route referenced in any in-scope doc (`/`, `/work`, `/work/[slug]`, `/solutions`, `/solutions/[slug]`, `/process`, `/contact`, `/privacy`, 404) exists in `app/`.
- **CSS classes and custom properties.** All 27 doc-named classes and all 59 doc-named custom properties and data-attributes exist in `app/globals.css`. No dead selectors.
- **File paths.** Of every `app|components|lib|scripts|content|config|hooks|docs|public/…` path string across the 8 docs, exactly one does not resolve — `docs/WEBHOOK_INTEGRATION.md` (D-06).
- **Named identifiers.** `hp_confirm`, `capPhoneDigits`, `isPlausiblePhone`, `sendToCrm`, `X-TekGuyz-Signature`, `useSuppressLauncher`, `concierge-bus.ts`, `--tg-surface`, `--tg-rule-scale`, `data-primary-cta`, `data-navlink`, `data-drawn`, `stripUiCopy`, `LEAD_FAILURE_MARKER`, `LEAD_HONEYPOT_MARKER` — all present with the doc's spelling.
- **Script names.** Every command the docs tell you to run exists in `package.json`; `prebuild` matches the documented chain.
- **Env var names.** Every env key named in any doc appears in `.env.example` and matches a `process.env.X` read in code. No orphans in either direction. (Only the *count* claim is wrong — C-06.)
- **Token values.** All 39 values in TOKENS.md's five fenced blocks match `app/globals.css`, asserted by the guard on every run.
- **Content counts.** `content/work.ts` = 8 entries (4 case studies + 4 projects), `content/faq.ts` = 6 items, `content/solutions.ts` = 4 solutions — all matching the docs' stated counts.
- **DESIGN.md §8 span table.** All 10 rows match the code exactly; only the missing `fold-board` row is a finding (C-09).
- **Components.** Every component named in prose resolves where implied except `LiveFrame` (D-02): `MetaRail`, `StatusLine`, `RevealController`, `FoldBoard`, `SectionHead`, `PageHero`, `FlourishMark`, `SequenceDots` all check out.
- **Heading anchors.** All 38 `§0`–`§9` DESIGN.md anchors referenced anywhere in the docs resolve, except `§2.1` and `§3.1` (D-07).
- **Roughly 30 CLAUDE.md hard rules verified accurate** against code, including the honeypot contract, `capPhoneDigits`/`PHONE_MAX_DIGITS`, single-serialization `sendToCrm`, `StatusLine`'s `getUTC*`, `RevealController` on `usePathname()`, the step `key`s, `text-[14.5px]/[1]`, the nav header's absent border, `.tg-grid`'s unlayered gap, `:has(+ .tg-closing)`, `.tap-44`/`.tap-24` via `::before`, the 22px footer gap, `.tg-yield`, `.tg-collapse`'s reduced-motion `transition-delay`, and `.reveal` using `translate`.

---

*Report generated 2026-08-28. Read-only audit; no source file was modified.*
