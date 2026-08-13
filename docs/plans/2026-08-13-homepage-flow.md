# Homepage Flow — Wave Plan (2026-08-13)

> Recorded verbatim from the originating prompt. This is the reference for
> Waves 1–3 of the homepage narrative work. Do not edit the quoted blocks
> below to reflect what shipped — record outcomes in `docs/STATUS.md` and
> `docs/DESIGN.md` instead. The provenance of the blueprint is the separate
> Claude.ai planning Project (Discovery / Blueprint / Prompt-pack gates),
> not the Build Phases in `docs/STATUS.md`.

---

REFERENCE — commit this to docs/plans/2026-08-13-homepage-flow.md verbatim as
your first action, before any design work. If a different plans directory
convention already exists in this repo, use that path instead and note the
change in your report.

<blueprint source="Claude.ai planning conversation, 2026-08-13">
GOAL: The homepage reads as eight sections specified once, never asked to
work together. This makes Hero→Closing CTA function as one narrative:
promise → proof → what we do → work → trust → how we work → ask.

IN SCOPE ACROSS ALL WAVES:
1. Hero — all screen sizes
2. Proof line ("Eight live builds") — rest-state affordance gap
3. Solutions section head ("What We Do") — hierarchy collision with
   solution-row titles
4. Process teaser ("How We Work") — flat list, no differentiation
5. Closing CTA — correct structure, needs real creative weight

OUT OF SCOPE, ALL WAVES: Featured Work rows, Testimonial (mobile density
already tracked separately in STATUS.md as a Phase 1 item), /process,
/solutions, /work and their detail pages, anything needing the pending
image recaptures.

HARD CONSTRAINTS, ALL WAVES:
- No accent color ever fills a button.
- Banned motion list (DESIGN.md §6.6) still applies; no new library.
- Left-anchored-by-default site-wide — a centered section is a rule change,
  called out explicitly, never shipped quietly.
- numeral-device (01–04) and pinned scroll stay exclusive to /process.
- Every framed screenshot is real product UI, never an illustrated mockup.
- Any new spacing/size token goes into TOKENS.md, enforced by check:design.
- The four accent colors mean solution line specifically — do not reuse
  them to differentiate anything that isn't one of the four Solutions.

LOCKED DECISIONS:
- Closing CTA's primary conversion goal is contact-form submission.
  Concierge chat stays a secondary, quieter path — not a co-equal ask.
- Process teaser gets differentiated some way other than numerals, pin, or
  the four solution accents — left open for that wave.

ROADMAP:
Wave 1 (this prompt) — Hero (all screens) + Closing CTA.
Wave 2 — Proof line + What We Do hierarchy.
Wave 3 — Process teaser.
</blueprint>

ROLE & GOAL: Redesign the Hero (all screen sizes) and Closing CTA as the
homepage's two bookends — first impression and final ask. Both are
currently correctly implemented against DESIGN.md and still underweighted
for the moments they are.

CONTEXT AND WHY:
Hero — DESIGN.md:286-296 confirms the primary CTA uses button size `default`
(15×24px), while closing-cta alone gets `large` (18×32px) as "the site's one
documented size exception... the page's single most important remaining
ask." The hero arguably carries equal weight and never got that
consideration. Mobile-specific: the 32px `tg-hero-frame` mat reads as dead
gray space with no bleed to justify it (DESIGN.md §4.9), the secondary
device mockup crops mid-content instead of cleanly, and CTA row/spacing are
an unmodified copy of desktop.
Closing CTA — DESIGN.md:440-503 shows every spacing decision was measured
and reasoned through (v2.2-v2.5). It's correctly built and visually inert —
a centered text stack that doesn't read as the payoff of everything above
it. It has never been asked to be more than that.

SCOPE FENCE:
In scope — components/home-hero.tsx (all breakpoints) and
components/closing-cta.tsx. Frame/panel treatment, button sizing and
hierarchy, secondary device mockup, CTA row layout, hero spacing/rhythm at
every width; closing-cta's visual treatment, headline/subhead/trust-line/
button/concierge-link composition and hierarchy.
Out of scope — Proof line, What We Do, Process teaser (Waves 2/3, future
sessions). Frame/FrameMeta/BuildNarrative used in compact contexts elsewhere
(§4.9's "plate, not panel" spec there is correct and unrelated — there is no
separate LiveFrame component, those three are the actual exports). Footer,
nav, everything above/below these two sections.

CONSTRAINTS:
- Don't port the desktop hero panel down at card scale — DESIGN.md already
  warns against exactly this.
- No fake browser chrome; every poster stays a real screenshot.
- If brainstorming lands on a centered mobile hero or a non-default
  left-anchor anywhere, that's a rule change — call it out explicitly.
- Closing CTA: keep the single-ask hierarchy (button = the ask, concierge
  link = subordinate alternate). Don't turn it into two competing CTAs
  chasing the "make it convert" goal.
- Bookends should feel like a matched pair framing the page — design them in
  the same pass, not independently, so they visually rhyme (weight, accent
  use, spacing logic) without being identical.

DEFINITION OF DONE:
- No dead gray mat dominating the hero frame at any mobile width.
- Secondary device mockup fully visible or deliberately, cleanly cropped.
- Hero and closing-cta button sizing reflects their actual importance —
  re-justify each size against the button.tsx scale, don't just bump both
  to `large` by default.
- Closing CTA reads as a stronger, more deliberate close than the current
  centered stack — still pushes toward the contact form as the singular ask.
- bun run build, bun run check:design, bun run test all pass.
- Light and dark mode both correct. prefers-reduced-motion respected if any
  entrance motion is touched.
- DESIGN.md §4.5 and §4.9's hero-mat entry updated to record what actually
  shipped — right now §4.9 only states the unsolved problem.

SKILL: confirm the exact installed brainstorming skill/plugin name before
invoking it (STATUS.md refers to this step generically as "brainstorming").
Then frontend-design to execute both sections in one coherent pass. State
which skill you're using before you start.

BUDGET: effort high. No subagent — Hero and Closing CTA are designed
together on purpose so they rhyme; splitting them to parallel agents would
undo that.

REPORTING CONTRACT: what shipped in each of the two components, what was
considered and rejected and why, before/after at 375px/390px/430px/desktop
for both, confirmation nothing outside scope was touched, and flag anything
needing visual sign-off — the dev machine runs with Windows animations off
system-wide, so reduced-motion effectively matches machine-wide and full
motion can't be fully judged locally. Confirm docs/plans/2026-08-13-
homepage-flow.md was written before you close out.
