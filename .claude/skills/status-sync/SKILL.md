---
name: status-sync
description: Run the repo's mechanical guards, git state and live deployment state, then report where this repo actually stands. Reads script output, never whole documents. Use when the user asks for a status sync, "where are we", or is about to plan or write against this repo.
---

# Status sync for the TEKGUYZ site

This skill measures the repo's real state — guards, git, production — and
reports it. **That is the whole job.** It prints no paste block and produces no
message for another tool. Nothing is pasted into a Claude.ai Project any more —
see `C:\Projects\tekguyz-one\docs\adr\0001-retire-the-claude-ai-project-loop.md`.

What it carries is exactly what a synced file cannot: commit history, what
production is actually serving, what happened this session, what was decided,
what was rejected, and what needs a human.

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
- **Never repair a doc here.** If a guard reports drift, name it in the findings
  and tell the user to run `doc-audit`. Repair is that skill's job, and
  `doc-audit` commits the repaired doc alone.

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
   which is the worst kind this skill can carry.
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

Gates (`bun run build`, `bun run test:unit`, `bun run lint`) only if the findings
will call something done. Otherwise report them as not run.

Work in the tree is **not** shipped — say "uncommitted in the working tree"
explicitly. A commit not on `origin/master` has not deployed. **A merge or push
to `master` means production here.**

## The exclusion pass

`docs/STATUS.md` marks some rows owner-owned, parked, or closed to further
questions. **An item marked that way is struck from this audit's findings.** It
is not raised as open work and not routed back to the user, no matter which
check surfaced it. Surfacing is expected; reporting is the bug. Apply the filter
before you write the findings, not while writing them.

## Reporting back

A short answer in the response. No file, no fenced block, no template.

- Say what the run measured, and never more than that.
- **Every claim measured.** If a figure was not verified this run, verify it now
  or leave it out. Never carry a number forward from memory.
- **Rejections are load-bearing.** Saying what was considered and rejected is
  what stops it being re-proposed.
- **Scope creep is reported loudly.** If the session touched anything outside
  what was asked, say so — that is not progress.
- **No hedging, no filler.** "Wave 3 shipped" or "Wave 3 is uncommitted" — never
  "Wave 3 is essentially complete".
- Name anything that needs the user, not more code: visual sign-off, a copy
  decision, a real device, a recapture, or `doc-audit` if a guard reported
  drift.
- **Never brief around these blind:** the four wayfinding accents, the enforced
  token set, `.tg-rule` as the one state primitive, the banned-motion list, the
  signed CRM contract, the `hp_confirm` honeypot.
