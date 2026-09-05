---
name: handoff
description: Audit docs/STATUS.md, CLAUDE.md and docs/TOKENS.md against the real repo state and against each other, repair whichever is stale, then print a paste-ready handoff block for the user's Claude.ai planning Project. Use when the user asks for a handoff, a status sync, "where are we", or says they are about to plan/spec/write a prompt in Claude.ai.
---

# Handoff to the Claude.ai planning Project

The user runs a **separate Claude.ai Project** for planning, specs, PRDs and
prompt-writing (its own Discovery / Blueprint / Prompt-pack gates — unrelated to
the Build Phases in `docs/STATUS.md`). That Project cannot see this repo. It
knows only what the user pastes into it, and it attaches its standing knowledge
**from this tree**.

**Three files are standing knowledge there, changed 2026-09-01 from seven:**

| What it holds | Lives in |
| --- | --- |
| The rules that govern new code, and the incident behind each one | `CLAUDE.md` |
| What is open, what shipped, what was decided and must not reopen | `docs/STATUS.md` |
| Every enforced token value — colour, type, radius, motion, density | `docs/TOKENS.md` |

The other four — `CANONICAL.md`, `DESIGN.md`, `COPY.md`, `PLAYBOOK.md` — are
attached **by the single chat that needs them**, never as standing knowledge.
The old set of seven totalled 392 KB, about 98,000 tokens paid on every
conversation in that Project. **The attach-list is a budget, not an inventory.**

**`docs/archive/*` is never attached.** It is the record of how we got here and
contains claims that are now false, by design.

Two jobs, in this order. **Never skip job 1.** A handoff generated from a stale
doc looks exactly as authoritative as an accurate one, and the planning Project
has no way to tell the difference.

---

## Job 1 — audit and repair

**Measure, never infer.** Treat a claim in this repo's docs exactly as you would
treat a claim in chat: something to verify, not something to cite.

### Check 1 — the mechanical guards, every run, no exceptions

```
bun run check:claude
bun run check:design
bun run check:media
```

- **`check:claude`** measures the countable claims in `CLAUDE.md` only — the
  test count, both token counts, `.vercelignore`'s contents, the honeypot field
  name, every `bun run <script>` that file names, and every repo path it names
  in backticks. **7 claim groups.** A pattern that stops matching is reported as
  a **failure**, not skipped, because a check that silently passes when its
  target gets reworded is the exact failure this repo keeps re-learning. If it
  reports a **dead check**, re-point the regex in `scripts/check-claude-md.ts`
  or delete it — do not leave it dangling.
- **`check:design`** asserts every token `docs/TOKENS.md` prints in a fenced
  block against `app/globals.css`. It prints its own count; read that, never a
  number from a doc.
- **`check:media`** reports poster ratios. Off-ratio warns rather than fails, so
  a green exit code is not a pass — read the lines.

**Fix only what a script names.** Most of `CLAUDE.md` and much of `STATUS.md` is
*decisions* — rules, bans, and the incident behind each one. Those are not stale
for being old. **Correct the figure, keep the reason.**

### Check 2 — what shipped that the docs do not mention

`git log --oneline -15`, and `git log origin/master --oneline -5`. For every
commit since STATUS.md's `## Measured <date>` heading, confirm something covers
it. Read the commit bodies — this repo writes real ones.

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

### Check 4 — uncommitted and unpushed work

`git status --short` and `git status -sb`. Work in the tree is **not** shipped —
say "uncommitted in the working tree" explicitly, never fold it into "shipped".
A commit that is not on `origin/master` has not deployed. **Push means
production here.** Pushed is still not proof the build went green: use the
`vercel` CLI — `vercel ls`, `vercel inspect <url>`, `vercel logs <url>` — and
report what it says. The Vercel MCP plugin was removed on 2026-08-28; do not
suggest re-installing it. **Never cite a doc for hosting or deployment state.**

### Check 5 — the gates, if the handoff will call anything done

```
bun run build
bun run test
bun run lint
```

A doc saying something is complete is not evidence. Run them and quote the real
output. Skip this only when the handoff makes no completeness claim at all.

### Check 6 — scope fence

If the session touched anything outside what was asked, say so loudly — that is
scope creep, not progress. Name the reserved systems any new brief will trip
over first: the four wayfinding accents, the enforced token set, the `.tg-rule`
state primitive, the banned-motion list, the signed CRM contract, and the
`hp_confirm` honeypot.

---

Then repair whichever doc is stale, in that doc's own format.

**If a doc changed, commit it — that file alone, nothing else in the tree**,
even if other work is in progress, and never two audited docs in one commit, so
each stays separately reviewable. The message names the measurement, e.g.
`"STATUS.md: check:media 7 off-ratio -> 4, measured"`. Rationale: STATUS.md's own
rule is that a decision only exists once it is in `docs/STATUS.md` or committed
code — an audit that ends with an uncommitted repair leaves the printed block
below citing a doc state that is not actually in the repo. **This is a
doc-audit commit, not a push.** The push gate in `CLAUDE.md` is untouched.

If everything was already accurate, say so plainly and change nothing.

---

## Job 2 — print the handoff block

Output it as a fenced markdown block the user can copy whole. **Print it in the
response; do not write it to a file** — it is a message, not an artifact, and a
file would go stale the moment it is written.

Keep it under roughly 500 words. The planning Project has the three docs
attached; do not re-derive them here.

```markdown
## TEKGUYZ site — handoff <YYYY-MM-DD>

**Live:** <what tekguyz.com is serving — commit sha + one line, from `vercel ls`>
**Repo:** <clean / N uncommitted files> · <in sync with origin / N unpushed>
**Gates:** <build / test / lint — real result, or "not run this session">
**Docs changed this audit:** <file · file, or "none — every claim measured accurate">

### Shipped since last handoff
- <one line per batch, with the measured figure that matters>

### This session
- <3-6 bullets: what was asked, what was decided, what was rejected and why>

### Open now
- <genuinely open, from STATUS.md's Open tables — measured only>
- <every check-1 finding, if any, and how it was resolved. Omit if all clean.>

### Needs the user, not more code
- <visual sign-off, a copy decision, a real device, a recapture>

### Reserved — do not brief around these blind
- <the four wayfinding accents · the enforced token set · `.tg-rule` as the one
  state primitive · the banned-motion list · the signed CRM contract · the
  `hp_confirm` honeypot>

### Attach to this Project
CLAUDE.md · docs/STATUS.md · docs/TOKENS.md
(CANONICAL / DESIGN / COPY / PLAYBOOK per chat, never standing. archive/ never.)
```

Rules for the block:

- **Every claim measured.** If a figure was not verified this session, verify it
  now or leave it out. Never carry a number forward from memory.
- **Rejections are load-bearing.** The planning Project writes the next brief.
  Telling it what was considered and rejected is what stops it re-proposing
  that, and it is the highest-value part of the block.
- **No hedging, no filler.** "Wave 3 shipped" or "Wave 3 is uncommitted" — never
  "Wave 3 is essentially complete".
- **Never claim the attachments are stale on the strength of the block
  existing.** This bullet used to read "a handoff block means the attachments
  are stale ... end the response by telling the user to re-upload the three,"
  and it fired unconditionally -- including on an audit that measured everything
  accurate and changed nothing. An always-on warning is an ignored warning. The
  `Docs changed this audit:` line above is the fact; name only the files it
  names, and say plainly that the rest are current.
