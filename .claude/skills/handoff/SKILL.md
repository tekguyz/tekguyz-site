---
name: handoff
description: Audit docs/STATUS.md against the real repo state, update it if stale, then print a paste-ready handoff block for the user's Claude.ai planning Project. Use when the user asks for a handoff, a status sync, "where are we", or says they are about to plan/spec/write a prompt in Claude.ai.
---

# Handoff to the Claude.ai planning Project

The user runs a **separate Claude.ai Project** for planning, specs, PRDs and
prompt-writing (its own Discovery / Blueprint / Prompt-pack gates — unrelated to
the Build Phases in `docs/STATUS.md`). That Project cannot see this repo. It
knows only what the user pastes into it.

`docs/STATUS.md` is the bridge. When it is stale, the planning tool writes the
next brief against state that already shipped — which has happened, and is what
this skill exists to prevent.

Two jobs, in this order. **Never skip job 1.** A handoff generated from a stale
STATUS.md is worse than no handoff, because it looks authoritative.

---

## Job 1 — audit and repair `docs/STATUS.md`

**Measure, never infer.** The rule at the top of STATUS.md is absolute: *a status
line must be measurable, or it does not go here.* Three "open blockers" were once
quoted to the user from a doc and found already built.

Check, in this order:

1. **What shipped that STATUS.md does not mention.**
   `git log --oneline -15` and `git log origin/master --oneline -5`. For every
   commit since STATUS.md's "Last updated" line, confirm there is a section
   describing it. Read the commit bodies — this repo writes real ones.

2. **What STATUS.md claims that is no longer true.** Grep its "Open" tables for
   anything asserting a file, component or token state, and verify each against
   the code. Anything you cannot verify in one read gets its claim softened, not
   deleted.

3. **Uncommitted work.** `git status --short` and `git diff --stat`. Work sitting
   in the tree is not shipped and must not be described as shipped — say
   "uncommitted in the working tree" explicitly.

4. **Unpushed commits.** `git status -sb`. A commit that is not on
   `origin/master` has not deployed. Push means production here.

5. **Production reality, if the answer depends on it.** The Vercel connector's
   `list_deployments` gives what each push actually did. Do not cite a doc for
   hosting or deployment state.

Then update STATUS.md: refresh the "Last updated" paragraph, add a section per
shipped batch in the existing table format (`| Shipped | Detail |`), and move
anything now closed out of the Open tables. Keep every figure measured and dated.

If STATUS.md was already accurate, say so plainly and change nothing.

---

## Job 2 — print the handoff block

Output it as a fenced markdown block the user can copy whole. **Print it in the
response; do not write it to a file** — it is a message, not an artifact, and a
file would go stale the moment it is written.

Keep it under roughly 500 words. The planning Project has limited context and
this is not the place to re-derive the docs it already has attached.

Structure:

```markdown
## TEKGUYZ site — handoff <YYYY-MM-DD>

**Live:** <what tekguyz.com is currently serving — commit sha + one line>
**Repo:** <clean / N uncommitted files> · <in sync with origin / N unpushed>

### Shipped since last handoff
- <one line per batch, with the measured figure that matters>

### This session
- <3-6 bullets: what was asked, what was decided, what was rejected and why>

### Open now
- <what is genuinely open, from STATUS.md's Open tables — measured only>

### Needs the user, not more code
- <anything awaiting visual sign-off, a copy decision, or a real device>

### Attach to this Project
CLAUDE.md · docs/STATUS.md · docs/CANONICAL.md · docs/DESIGN.md ·
docs/TOKENS.md · docs/COPY.md · docs/PLAYBOOK.md
```

Rules for the block:

- **Every claim measured.** If a figure is not verified this session, either
  verify it now or leave it out.
- **Rejections are load-bearing.** The planning Project writes the next brief;
  telling it what was considered and rejected stops it re-proposing that.
  This is the single highest-value part of the block.
- **Name the reserved systems** any new work must not touch, if the session
  touched anything near them.
- **No hedging and no filler.** "Wave 3 shipped" or "Wave 3 is uncommitted" —
  never "Wave 3 is essentially complete".
- Update the attach-list from STATUS.md's own list rather than the template
  above, in case it has changed.
