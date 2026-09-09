---
name: doc-audit
description: Audit docs/STATUS.md, CLAUDE.md and docs/TOKENS.md against the real repo state and against each other, follow every citation, then repair whichever doc is stale and commit it. Use when the user asks for a doc audit, says a doc looks wrong, or when the handoff skill reports a finding it could not resolve. This is the heavy pass — the handoff skill does not run it.
---

# Doc audit — measure the docs against each other, repair what drifted

Split out of `handoff` on 2026-09-08. The cheap half runs several times a day
and was paying for this half every time.

**Run this when a doc is actually suspect**, not on every handoff:

- a mechanical guard (`check:claude`, `check:design`, `check:media`) reported a
  finding the `handoff` skill could not resolve from script output alone
- a session shipped work that needs a STATUS.md row or an archive move
- the user asks for a doc audit, or says something in the docs looks wrong

**Measure, never infer.** Treat a claim in this repo's docs exactly as you would
treat a claim in chat: something to verify, not something to cite.

## The authority order

**CANONICAL > DESIGN > COPY > SEO**, with `TOKENS.md` as DESIGN's measured half.
If two disagree, the higher wins and the lower gets fixed — never silently pick
one.

## The reading budget, even here

`docs/DESIGN.md` is about 39,700 tokens and `docs/COPY.md` about 10,900. **Never
read either whole.** Follow a citation to its section and read that section.
Grep for a heading, then `sed -n` the range. A whole-file read of DESIGN.md
costs more than every other part of this audit combined.

**`docs/archive/*` is never read for current state.** It is the record of how we
got here and contains claims that are now false, by design.

---

### Check 3 — what STATUS.md claims that is no longer true

Grep its Open tables for anything asserting a file, component or token state and
verify each against the code. Anything you cannot verify in one read gets its
claim softened, not deleted.

**A closed row leaves the Open table.** Move it verbatim to
`docs/archive/HISTORY.md` under a dated heading. It does not get struck through
and left in place — a table called "Open" listing six closed items is how a
partial close silently becomes a full one, and it is what made this file 971
lines. Same for a shipped batch: it belongs in the archive, not in STATUS.md.

### Check 3b — contradictions between the docs, and every citation followed

The highest-yield check in this job, and the one no script can do.

Authority order is **CANONICAL > DESIGN > COPY > SEO**, with `TOKENS.md` as
DESIGN's measured half. If two disagree, the higher wins and the lower gets
fixed — never silently pick one.

**Follow every citation to the cited section.** `DESIGN.md` is dense with
`§4.1`-style cross-references, and `STATUS.md` and `CLAUDE.md` both cite it.
A citation that has never been opened is the same as no citation: in the sibling
repo a rule survived in two files and a code comment while the section it cited
said the opposite, purely because nobody could open it. Two shapes recur here:

- **The doc says open, the code says shipped.** Three "open blockers" quoted
  from `CANONICAL.md` §5 were measured and found already built.
- **The doc cites an authority that says the opposite.** `CLAUDE.md` claimed the
  concierge sheet threshold shipped one arm when both had shipped, and had been
  contradicted by `docs/STATUS.md` Build Phase 2 since the day it landed.

A contradiction in a **rule** is reported, never silently rewritten. A
contradiction in a **status** is repaired in place with a dated line naming what
closed it.

### Check 3c — the archive boundary held

`wc -l docs/STATUS.md`. It was restructured to ~180 lines on 2026-09-01, from
971. If it has grown past roughly 300, shipped history has crept back in; move
it out before printing a handoff. **A status file that is 70% history is a
status file nobody reads to the end of.**


---

Then repair whichever doc is stale, in that doc's own format.

**If a doc changed, commit it — that file alone, nothing else in the tree**,
even if other work is in progress, and never two audited docs in one commit, so
each stays separately reviewable. The message names the measurement, e.g.
`"STATUS.md: check:media 7 off-ratio -> 4, measured"`. Rationale: STATUS.md's own
rule is that a decision only exists once it is in `docs/STATUS.md` or committed
code — an audit that ends with an uncommitted repair leaves the handoff block
citing a doc state that is not actually in the repo. **This is a doc-audit
commit, not a push.** The push gate in `CLAUDE.md` is untouched.

If everything was already accurate, say so plainly and change nothing.

**Fix only what a script or a citation names.** Most of `CLAUDE.md` and much of
`STATUS.md` is *decisions* — rules, bans, and the incident behind each one.
Those are not stale for being old. **Correct the figure, keep the reason.**
