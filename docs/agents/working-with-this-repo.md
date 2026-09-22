# Working with this repo — skills, docs and design vocabulary

Moved out of `CLAUDE.md` on 2026-09-21 (Job 4). Text is unchanged. Read it when
you are choosing a skill, or when you want to know why the doc split is what it
is. The skill table itself stays in `CLAUDE.md`.

## Which skill, when — the reasons behind the table

Skills do not load themselves. Invoke the one that matches **before** starting, and say which one you're using.
**`frontend-design` was uninstalled on 2026-09-05 and every row above that named it now names `impeccable` or nothing.** The two are both opinionated visual-direction skills, and two design vocabularies in one session cancel each other out; `impeccable` is the one that stays because it also ships a deterministic detector. Related, and the reason this table is now shorter than it looks: a *prompt* should not name a skill at all — the tekguyz-one repo carries the rule, as Prompt Anatomy item 7 of engineering/project-instructions-site.md (v3.1, 2026-09-15) and of its base, engineering/workspace-instructions.md — **written without backticks on purpose, because it is not a path in THIS repo and `bun run check:claude` correctly failed it as a missing file until 2026-09-07.** This table is the repo's own record of what a session here can reach for, which is a different thing from a planning prompt ordering one.

**`impeccable` costs 165 KB to boot here, and that is behaviour, not a bug.** Its `scripts/context.mjs` loader searches `docs/`, finds `docs/DESIGN.md`, and prints the whole file — roughly 42,000 tokens before it does any work. That is correct for a skill whose job is honouring an incumbent visual world, and this project has one. **So invoke it for real UI work, never to answer a question.**

Two things it did **not** do, and one it must never do. It did not write `docs/DESIGN.md` — that is v2.6 of this project's own system and predates the skill; impeccable only finds it. It does not need `PRODUCT.md`: its `init` flow wants to write one at the repo root, but `CANONICAL.md`, `COPY.md` and `PLAYBOOK.md` already hold product truth, and a fifth authority is exactly what the authority order exists to prevent. **Never let it write a `PRODUCT.md` or a root `DESIGN.md` here** — its DESIGN.md format carries token values in YAML frontmatter, which would put a second copy of every number outside `TOKENS.md` and outside the `check:design` guard. Its narrow commands (`critique`, `polish`, `audit`, `layout`, `typeset`, `colorize`) read the CSS and components directly and run without either file.

**The user is not a designer and cannot brief you in design vocabulary. Do not ask them to.** Bring options they can react to; that is what `brainstorming` and a rendered comparison are for. Asking the user to describe what they want in jargon they don't have is how this project ended up with one motion idea and a spec nobody designed.

**Two tools, two vocabularies.** The user also runs a separate Claude.ai Project for early-stage conversations, with its own Workflow Gates — Discovery / Blueprint / Prompt-pack. That is unrelated to the Build Phases in `docs/STATUS.md`; if a prompt arrives referencing a "blueprint" or a decision "from Discovery," it's the output of that other tool — treat it as a direction already decided, not an instruction to re-run brainstorming here. The reverse also holds: an aesthetic decision belongs here, not there — Claude.ai's Discovery gate is text-only and can't render an option to react to, which is the entire reason aesthetic work happens in Claude Code at all.

## Why the docs are split the way they are

**`TOKENS.md` is not a new authority — it is DESIGN.md's measured half, split out on 2026-08-12 so a machine could hold it to account.** DESIGN.md was 89KB doing two jobs, describing what the code does *and* recording what was decided, with no way to tell them apart on the page; the descriptive half drifted and got quoted back as fact three times. Values live in TOKENS.md and are enforced. Reasons and mechanisms stay in DESIGN.md and are not checkable. **Never copy a token value back into DESIGN.md** — one source per number, or the split buys nothing.
**Visual ground truth is the approved Claude Design export** (`TEKGUYZ Site.dc.html`, `TEKGUYZ Components.dc.html`). DESIGN.md is a translation of it. Where they disagree the export wins — except for decisions made deliberately after it (Geist-only type, `/solutions/[slug]` routing), which CANONICAL governs.

## Full text of two rules CLAUDE.md now states in short

**A doc is not a measurement.** On 2026-08-12 three "open blockers" quoted to the user from `CANONICAL.md` §5 were measured and found already built — the testimonial, the FAQ, and the footer location. Two docs were wrong about the Vercel topology for four prompts, and the mobile queue was summarised as closed twice while it wasn't. **Before telling the user what the state of something is, check the code, the repo, or the API — not a doc, and not this file.**

- **Candidates are transcribed, never regenerated, and collision-checked against `docs/COPY.md`.** Re-writing a candidate list from the same brief produces a different, equally plausible list, and the human then picks from options nobody reasoned about. One regenerated entry once duplicated the concierge's own input placeholder.
