---
name: handoff
description: Run the repo's mechanical guards and git state, then print a paste-ready handoff block for the user's Claude.ai planning Project. Reads script output, never whole documents. Use when the user asks for a handoff, a status sync, "where are we", or says they are about to plan/spec/write a prompt in Claude.ai.
---

# Handoff to the Claude.ai planning Project

The user runs a **separate Claude.ai Project** for planning, specs, PRDs and
prompt-writing (its own Discovery / Blueprint / Prompt-pack gates — unrelated to
the Build Phases in `docs/STATUS.md`). That Project reads this repo's files
through the **GitHub connector**, so it already has `CLAUDE.md`,
`docs/STATUS.md` and `docs/TOKENS.md` as they are on the branch.

**What sync cannot give it:** commit history, what production is actually
serving, what happened this session, what was decided, what was rejected, and
what needs a human. That is what this block carries, and it is all it carries.

## The reading budget — this is the point of the skill

Split from `doc-audit` on 2026-09-08. The doc-reading and repair work moved
there.

**Hard rules. Do not reason past these.**

- **Never open `docs/DESIGN.md`.** It is about **39,700 tokens** — more than
  every other part of this run combined. Check 3b in `doc-audit` follows its
  citations; this skill does not.
- **Never open `docs/COPY.md` (~10,900), `docs/CANONICAL.md` (~9,000) or
  `docs/archive/*`.**
- **`CLAUDE.md` is already in context** — it loads every session. Read from what
  you already have. Do not re-read the file.
- **Read guard output, never the docs the guards check.** `check:claude` and
  `check:design` already name the exact wrong figure. That naming is the
  finding.
- **`docs/STATUS.md` may be read** — it is ~6,000 tokens and it is the live
  status. Prefer grepping its Open tables to reading it whole.
- **Never repair a doc here.** If a guard reports drift, name it in the block
  and tell the user to run `doc-audit`. Repair is that skill's job.

A guard that reports a **dead check** is a failure, not a skip. Say so.
`check:media` warns rather than fails, so **a green exit code is not a pass** —
read its lines.

## What to gather

1. The mechanical guards, every run, no exceptions:

   ```
   bun run check:claude
   bun run check:design
   bun run check:media
   ```

2. **`git fetch origin` FIRST, before any other git command.** Then
   `git log --oneline -15` and `git log origin/master --oneline -5`.

   The fetch is not optional. `origin/master` is a **cached local ref**:
   without a fetch it holds whatever the last fetch on THIS machine saw. The
   user works from two laptops against one repo, so on the laptop that did not
   do the work `git status -sb` reports "in sync with origin/master" while the
   remote is many commits ahead — a confident, wrong, measured-looking claim,
   which is the worst kind a handoff block can carry.
3. `git status --short` and `git status -sb`, **after the fetch**. Report three
   states separately and never merge them: **uncommitted in the working tree**
   (not shipped), **ahead of origin** (committed here, not pushed), and
   **behind origin** — say "behind origin/master by N commits — run `git pull`
   before working here", and do not describe the tree as current.
4. **What production is serving.** Use the Vercel connector — `list_projects`,
   `list_deployments` — or the `vercel` CLI. **Never cite a doc for hosting or
   deployment state.** The Vercel MCP plugin was removed on 2026-08-28; do not
   suggest re-installing it.
5. `docs/STATUS.md` Open tables, by grep where possible.

Gates (`bun run build`, `bun run test`, `bun run lint`) only if the block will
call something done. Otherwise report them as not run.

Work in the tree is **not** shipped — say "uncommitted in the working tree"
explicitly. A commit not on `origin/master` has not deployed. **Push means
production here.**

## Print the block

Output it as a fenced markdown block the user can copy whole. **Print it in the
response; do not write it to a file** — it is a message, not an artifact.

Keep it under roughly 400 words. The planning Project already has the synced
docs; do not re-derive them.

```markdown
## TEKGUYZ site — handoff <YYYY-MM-DD>

**Live:** <what tekguyz.com is serving — commit sha + one line, measured from Vercel>
**Repo:** <clean / N uncommitted files> · <in sync with origin / N unpushed>
**Gates:** <build / test / lint — real result, or "not run this session">
**Guards:** <check:claude, check:design, check:media — clean, or N findings, or "dead check in X">

### Shipped since last handoff
- <one line per batch, with the measured figure that matters>

### This session
- <3-6 bullets: what was asked, what was decided, what was rejected and why>

### Open now
- <genuinely open, from STATUS.md's Open tables — measured only>
- <every guard finding, one line each: which figure, which doc. Omit if all clean.>

### Needs the user, not more code
- <visual sign-off, a copy decision, a real device, a recapture>
- <"Run `doc-audit`" if any guard reported drift this run>

### Reserved — do not brief around these blind
- <the four wayfinding accents · the enforced token set · `.tg-rule` as the one
  state primitive · the banned-motion list · the signed CRM contract · the
  `hp_confirm` honeypot>
```

## Rules for the block

- **Every claim measured.** If a figure was not verified this run, verify it now
  or leave it out. Never carry a number forward from memory.
- **Rejections are load-bearing.** The planning Project writes the next brief.
  Telling it what was considered and rejected is what stops it re-proposing
  that, and it is the highest-value part of the block.
- **Scope creep is reported loudly.** If the session touched anything outside
  what was asked, say so — that is not progress.
- **No hedging, no filler.** "Wave 3 shipped" or "Wave 3 is uncommitted" — never
  "Wave 3 is essentially complete".
- **No attach-list.** The planning Project reads this repo through the GitHub
  connector. If a doc changed, the user clicks "Sync now" — do not print a file
  list, and never tell the user to re-upload anything. The old bullet here fired
  an always-on staleness warning, including on audits that changed nothing. An
  always-on warning is an ignored warning.
