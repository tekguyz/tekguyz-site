# TEKGUYZ Site — Known Gaps

Replaces `docs/STATUS.md`, retired 2026-10-01 (#5). It is a register of open
and deliberately deferred work, not an instruction set. Permanent rules live in
`CLAUDE.md`. The dated narrative of how we got here lives in
`docs/archive/HISTORY.md`, under "Moved out of docs/STATUS.md on 2026-10-01".

## How to maintain this file

**A line here must be measurable, or it does not go here.** On 2026-08-12 three
"open blockers" were measured and found already done, and had been quoted back
to the user as current state. Assert nothing you have not just measured.

- Anything intentionally deferred gets a bullet: a limitation, a missing
  check, or work scoped out on purpose, so a later session never assumes it is
  done.
- An open item is ⬜, one or two sentences, with a date. An item with no date is
  stale; re-measure it before you rely on it.
- When an item is fully resolved, move its line to `docs/archive/HISTORY.md` in
  the same session, under a dated heading. Do not leave it here struck through.
- A ✅ beside a ⬜ means partly resolved with real open scope. The ✅ half is
  context for why the ⬜ half is scoped as it is.
- Corrections belong in git history, not in the prose of this file.
- An item that was **rejected outright** is not deferred work. It goes under
  "Permanently rejected" below, which overrides any older history that reads as
  open.

## Open items

### Images and the home hero

- ⬜ **Home hero poster, `sarah-poster.webp` (#20).** Owner-owned and in
  progress. **Do not raise it again as a question.** Two defects, neither fixable
  in code: the phone mockup is cut mid-sentence at the top of the source file,
  and the bottom-right panel carries a visible "Demo Mode" badge, a PLAYBOOK §12
  violation. Wanted: native 16:9 at 1600×900 or larger, phone mockup entirely
  inside the frame, no demo or simulator label anywhere. The size is already met
  (measured 2026-08-28). D-07 (hero media bleeding above 1440px) does not
  reproduce; what is real above 1440px is the 1600px source ceiling. D-08 (hero
  poster illegible) is resolved below 1024px by `heroPosterMobile` and still open
  at desktop-narrow. Both close on this recapture.
- ⬜ **The voice poster shows the client's name.** Every new capture of the voice
  demo shows "Real Stone & Granite", and the voice page keeps the client
  unnamed, so `sarah-thumb.webp` is still the old file (the CRM-sync panel, with
  a tool name "StoneApp" in its text). The owner decides: retake with the name
  hidden, or allow the name the way the Field Photo Reports poster allows the
  logo. Measured 2026-10-01.
- ⬜ **The Field Photo Reports poster shows the client's logo and "StoneApp".**
  Left as captured, as the file it replaced did. 2026-10-01.
- ⬜ **`meetup-thumb.webp` shows meetups dated Oct 1 to 4**, so it reads stale
  within days. The capture set's map and meetup pictures are phone-shaped and
  would crop to a fragment in a 16:10 slot. Fix: seed the demo with relative
  dates, then retake. 2026-10-01.
- ⬜ **Capture-set files not used yet:** the videos (WebM and MP4, with posters),
  the phone pictures and the extra desktop pictures. They wait on the home hero
  (#20) and the gallery (#11). Only files the site uses are in the repo; the
  source folder is outside git. 2026-10-01.
- ⬜ **The CRM poster is demo data.** `tekguyz-crm.webp` is the real product's
  Reports view, but the figures are seeded demo data, not a client result. It
  satisfies PLAYBOOK §12 and licenses **no number** in copy. The 2026-10-01
  capture (`reports-desktop-light`) is the same kind of picture. 2026-09-07.

### Links and copy

- ⬜ **`/privacy` was reviewed by its owner, not by a lawyer.** Closed 2026-08-29
  as a self-review against the CCPA thresholds. Re-open if that matters.

### Docs and design

- ⬜ **DESIGN.md §0, §2 and §3 still read in the old single voice** (the
  mandate, icon policy, type and layout). §4, §5, §7 and §9 were converted. The
  colour tokens are machine-checked by `check:design`; what is open here is
  prose voice, nothing numeric. The contrast ratios in §1 are still not checked:
  a hex value cannot drift, a claim about its ratio can. 2026-08-29.
- ⬜ **Concierge UX/UI redo, beyond what shipped.** D-04 geometry, panel
  presence motion, the reply-length and routing prompt, and the header role
  avatar are done. The rest is a design question nobody has asked yet, not a
  defect list. `concierge.tsx` structure is the refactor below. 2026-08-29.
- ⬜ **Refactor (Build Phase 5).** Not "split the big files". Re-measured
  2026-09-04: `components/concierge/concierge.tsx` 787 lines,
  `components/contact-form.tsx` 516, `app/actions/contact.ts` 463. What is left
  is repetition and coupling, not size. Last in the queue.
- ⬜ **One rule is waiting for the owner's call.** *"Build the current unit in
  isolation. When a feature's design depends on a second consumer that does not
  exist yet, build the current consumer as its own unit first."* It sits in
  `docs/_archive/claude-ai-projects/project-instructions-site.md` in the
  tekguyz-one repo. It is not in `CLAUDE.md` because this repo never carried it.
  2026-09-21.

### Deferred on purpose (post-launch)

Hero video loop (needs a new recording) · live iframe embeds (needs
`frame-ancestors` CSP per demo app) · Cal.com (until real inbound is measured) ·
Terms of Service (no checkout or accounts to need one) · `/privacy` ships zero
scroll reveals (arguably correct) · `lockup-master.svg` wordmark is still a
`<text>` element (matters only if the SVG goes to an external vendor).

## Permanently rejected — never re-list

Decided 2026-08-12 unless dated otherwise. The one-line rules are in
`CLAUDE.md`; the full reasoning is here.

- **Transient launcher overlap of a secondary link is not a defect.** The 44
  pairs above 25% coverage are closed, unfixed, by decision. Primary-CTA overlaps
  stay at 0, and that is the criterion that stands. This consumed six commits.
- **The concierge disclaimer is deleted**, not replaced. "A starting sketch, not
  a quote." is gone from the panel, and the bordered footer strip unmounts
  entirely at cap-reached rather than shipping an empty 33px rule.
- **Modals and sheets are accepted.** The concierge sheet is `aria-modal` with a
  focus trap below `(max-height: 560px)`, and the nav drawer exists. An older
  "no modals or popups anywhere" described an intent the code never matched.
- **The density GAP half is closed as rejected.** `--gap-group`'s 56px ≥1024
  step was measured against both remaining candidates and makes each worse:
  `case-study-row`'s text column is already 205px taller than its media column
  at 1024px, its worst width, and 56px takes that to 237px; `project-card` grows
  19% at 1440px for no content gained. Both files' gaps stay hand-picked, outside
  the token system. The 18/14 vs 24/24 disagreement between them is deliberate:
  two card tiers at different weights. **`footer-dark.tsx` and
  `faq-accordion.tsx` are permanently out of density scope.** Their spacing is
  44px tap-target arithmetic, not density, and reopening it would put the tap
  policy at risk to buy nothing (DESIGN.md §8.0). **Requeue only on a new
  measurement. Name what changed. Re-deriving these numbers is not new
  information.** The padding half shipped: `--pad-card` is used by
  `project-card.tsx`, `fold-board.tsx` and `contact-form.tsx`, and
  `--pad-container` keeps its one consumer, `testimonial.tsx`.
- **GBP Services is not a website task** and never was.
- **Seeding the GBP Q&A is not possible** (rejected 2026-08-22). Google shut the
  API on 2025-11-03. See PLAYBOOK §14 item 4.
