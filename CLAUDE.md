# TEKGUYZ Website — Project Instructions

## What this is

The tekguyz.com rebuild — **live. `https://tekguyz.com` serves this build.**
TEKGUYZ is a small, technical team that builds custom software systems, AI
assistants, and automated workflows for operational businesses.

**Work lands through a pull request, as in every other repo** — the global
rules' *Landing the work* section applies here unchanged. Branch, push the
branch, open a PR against `master`, wait for CI. A branch push builds a Vercel
**preview deployment** of the same project; `tekguyz.com` is untouched.

**Merging into `master` is the production deploy.** Every merge or push to
`master` auto-deploys `tekguyz.com`. The user approves each merge in chat;
once they have, merge with `gh pr merge <N> --merge --delete-branch`. Never push
straight to `master` unless the user asks for exactly that.

**After any push, confirm it** — `git log origin/master`, or the Vercel
connector's `list_deployments`. A denied push is not a push that didn't happen.
Measure it; never infer it from the command's output.

**Hosting topology is external state that drifts without touching the repo, so
re-measure it and never cite a doc for it.**

Branch commands, preview behaviour, the CORS myth, the Vercel connector and the
visual-verification rules: `docs/agents/verification.md`.

Stack: Next.js 16 App Router · TypeScript · Tailwind v4 (CSS-first `@theme`) ·
Bun · Motion · React Hook Form + Zod · Resend · Gemini 3.6 Flash · Upstash ·
Vercel.
Package manager is **Bun**. `bun install` / `bun add`. Keep `bun.lock`
committed. Never npm or pnpm.

## Which skill, when

Skills do not load themselves. Invoke the one that matches **before** starting,
and say which one you're using.

| Situation | Skill |
| --- | --- |
| Deciding how something **looks or feels** — layout, motion, type, density, a component's treatment | `impeccable` |
| **Inventing** behavior that isn't already specified in `docs/DESIGN.md` | `superpowers:brainstorming` **first**, then build it |
| A bug, a test failure, anything behaving unexpectedly | `superpowers:systematic-debugging` |
| Before a push, or after a batch of edits | `/code-review` |
| Implementing a decision that is already written down | none — just build it |
| **Critiquing or polishing UI that already exists** — hierarchy, spacing, alignment, contrast, motion, empty and error states | `impeccable` — `/impeccable critique <file>` before finalizing, `/impeccable polish` after |
| Reviewing React/Next performance, or Web Interface Guidelines compliance | `vercel-react-best-practices` · `web-design-guidelines` |

**The user is not a designer and cannot brief you in design vocabulary. Do not
ask them to.** Bring options they can react to.

**`impeccable` costs 165 KB to boot here** — invoke it for real UI work, never
to answer a question. **Never let it write a `PRODUCT.md` or a root
`DESIGN.md` here.** Reasons: `docs/agents/working-with-this-repo.md`.

## Reading the docs — don't read them all

**Default: read nothing from `docs/` and start work.** The rules below plus the
code are enough for most tasks.

| Need | Read |
| --- | --- |
| **What is open right now** | `docs/STATUS.md` — short, and the only live status |
| An architecture or CRM-contract decision | `docs/CANONICAL.md` (highest authority) |
| **An exact token value** — a colour, a duration, an easing, a radius, the type scale, the density scale | **`docs/TOKENS.md`. Small, read it whole, and quote it freely — 40 tokens are asserted against `app/globals.css` on every `prebuild`, so it cannot be silently wrong.** |
| **Why** a value is what it is, or a component's mechanism | `docs/DESIGN.md` §-by-§, not whole |
| Page copy, or a route's title/description | `docs/COPY.md` — the relevant page only |
| JSON-LD for a route | `docs/SEO.md` (small, fine to read whole) |
| Writing new brand-voice copy | `docs/PLAYBOOK.md` |
| **Why a rule below exists** — incidents and mechanisms | `docs/archive/HISTORY.md`, the section for that rule only |
| Skills, and why the docs are split | `docs/agents/working-with-this-repo.md` |
| Pushing, production checks, visual verification | `docs/agents/verification.md` |

Authority: **CANONICAL > DESIGN > COPY > SEO.** The higher wins and the lower
gets fixed — never silently pick one. `TOKENS.md` is DESIGN.md's measured half,
not a new authority; **never copy a token value back into DESIGN.md.** Visual
ground truth is the approved Claude Design export — where it and DESIGN.md
disagree the export wins, except for decisions made after it, which CANONICAL
governs.

**A doc is not a measurement.** Before telling the user the state of anything,
check the code, the repo, or the API — not a doc, and not this file.

## Where the bulk rules now live

Moved 2026-09-21 (Job 4). Each `.claude/rules/` file loads only when a file
matching its `paths:` is read, so it costs nothing until it matters. **None is
optional when you are in that part of the tree.**

- `.claude/rules/cascade.md` — cascade & reconciliation; the mechanism *is* the rule
- `.claude/rules/components.md` — accents, marks, `LiveFrame`, banned motion, content model
- `.claude/rules/lead-capture.md` — honeypot, validation, CRM signing, focus
- `.claude/rules/tooling.md` — build guards, lint, `audit-mobile`, `.vercelignore`

## Hard rules

These stay here because a path-scoped file does not load when they matter.
Each of these cost a real bug to learn. The incident that produced one is in
`docs/archive/HISTORY.md` — go read it there before deciding a rule doesn't
apply to your case.

- **Never invent metrics, statistics, timelines, client names, or prices.** Copy is final. `[NEEDS REAL DATA]` markers are never filled and never rendered.
- **A copy gap gets flagged, never invented — but the user has since said: write the copy.** Draft it from `docs/PLAYBOOK.md`'s brand voice and **tell them what you added**. Reserve `[NEEDS COPY: <slot>]` for a slot you cannot fill without inventing a fact. Never ships as final.
- **Candidates are transcribed, never regenerated**, and collision-checked against `docs/COPY.md`.
- **A partially resolved finding is never summarised as resolved.** Every summary carries the qualifier, or the finding splits into two IDs.
- **Secrets from env vars only, never inlined, never logged. Never construct a client with a secret at module scope** — `new Resend(undefined)` throws and broke the build. Build must pass with zero secrets present.
- **The honeypot is `hp_confirm`, never `website`**, and never `.max(0)`.
- **One shared lead-capture action (`app/actions/contact.ts`)**, used by both the form and the concierge with a different `source`. Never a second implementation.
- **Never add `physical_address` or the `social_*` fields to the contact form.**
- **The concierge never states or estimates a price**, never commits to a timeline, and never prints a raw route path or internal label as visible text.
- **Every CRM triage POST is signed, and the payload is serialized exactly once.** Never inline the `JSON.stringify` back into the `fetch` call — it 401s 100% of the time.
- **No accent ever fills a button** — primary CTAs are always ink. No 5th accent. Mapping lives only in `config/solutions.ts`.
- **Banned motion:** parallax, gradient blobs, spinning shapes, marquees, particles, glassmorphism, cursor-followers, magnetic buttons, skeleton shimmer, smooth-scroll libraries. It rejects one aesthetic, not motion itself — **adding motion outside that list is wanted, not risky.**
- **`scripts/audit-mobile.ts` does not run under Bun, ever.** Use `bun run audit:mobile <phase>`.

Mechanism, incident and full text for every rule above: the matching
`.claude/rules/` file.

## Definition of done

Acceptance criteria — not a checklist to narrate:

- `bun run build` passes with zero type errors, and passes with **no secrets in the environment**.
- Every touched route renders in light and dark mode. Dark mode has real bright elements — the primary button inverts to `#F5F5F5`/`#101010`.
- Keyboard reaches every interactive element with a visible focus ring.
- `prefers-reduced-motion` leaves no entrance, pulse, pin, or shimmer running, and hides nothing.
- No hydration warnings.
- Report what you did **not** finish. Never describe unfinished work as complete.

## Working notes
- A decision only exists once it’s in `docs/STATUS.md` or committed code. Chat is one `/clear` from gone.
- Never assume a prior instruction landed — check `git status`, `git diff`, or read the file.
- When an attached file path points into another project, that file is the scope. Don't go exploring the surrounding repo.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Agent skills

### Issue tracker

New work goes to GitHub Issues (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root, created lazily as terms/decisions resolve. See `docs/agents/domain.md`.
