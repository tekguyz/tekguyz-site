# TEKGUYZ Website — Project Instructions

## What this is
The tekguyz.com rebuild — **built, deployed as a Vercel preview, not yet pointed at the live domain.** TEKGUYZ is a small, technical team that builds custom software systems, AI assistants, and automated workflows for operational businesses.

Stack: Next.js 16 App Router · TypeScript · Tailwind v4 (CSS-first `@theme`) · Bun · Motion · React Hook Form + Zod · Resend · Gemini 3.6 Flash · Upstash · Vercel.
Package manager is **Bun**. `bun install` / `bun add`. Keep `bun.lock` committed. Never npm or pnpm.

## Reading the docs — don't read them all

`docs/` is ~38K tokens. Reading it wholesale was right once, for the master build prompt. It is wrong now and expensive.

**Default: read nothing from `docs/` and start work.** The rules below plus the code are enough for most tasks.

Pull a doc in only when the task actually needs it:

| Need | Read |
| --- | --- |
| What's already built, what's deliberately deferred | `docs/PROGRESS.md` — **start here when in doubt** |
| An architecture or CRM-contract decision | `docs/CANONICAL.md` (highest authority) |
| An exact visual value | `docs/DESIGN.md` §-by-§, not whole |
| Page copy, or a route's title/description | `docs/COPY.md` — the relevant page only |
| JSON-LD for a route | `docs/SEO.md` (small, fine to read whole) |
| Writing new brand-voice copy | `docs/PLAYBOOK.md` |

Authority: **CANONICAL > DESIGN > COPY > SEO.** If two conflict, the higher wins and the lower gets fixed — don't silently pick one.

**Visual ground truth is the approved Claude Design export** (`TEKGUYZ Site.dc.html`, `TEKGUYZ Components.dc.html`). DESIGN.md is a translation of it. Where they disagree the export wins — except for decisions made deliberately after it (Geist-only type, `/solutions/[slug]` routing), which CANONICAL governs.

## Hard rules
- **Never invent metrics, statistics, timelines, client names, or prices.** Copy is final. `[NEEDS REAL DATA]` markers are never filled and never rendered.
- Accent-to-solution mapping lives only in `config/solutions.ts`. The one documented exception is the home ink band, which sets literals via `.ink-band` because it is dark in both themes.
- No accent color ever fills a button. Primary CTAs are always ink. No 5th accent.
- **The honeypot is `hp_confirm`, never `website`** — `website` is a real CRM column, and the collision silently dropped real leads. It is also not `.max(0)`: that made the silent-accept path unreachable and told bots they'd been caught.
- **Optional fields are not unvalidated.** Blank is fine; a filled value is checked. Rules live in `lib/validation.ts`, shared by the client and server schemas so they cannot drift.
- One shared lead-capture action (`app/actions/contact.ts`), called by both the form and the concierge with a different `source`. Never a second implementation.
- **CRM CORS is hard-locked to exactly `https://tekguyz.com`** — no `www`, no subdomain, no preview URL. A domain or hosting change fails closed and silent; flag it before changing either.
- Never add `physical_address` or the `social_*` fields to the contact form — those serve outbound prospecting, not inbound intake.
- The concierge never states or estimates a price, never commits to a timeline, and never prints a raw route path or internal label as visible text.
- Secrets from env vars only, never inlined, never logged. **Never construct a client with a secret at module scope** — `new Resend(undefined)` throws on construction and broke the build. Build must pass with zero secrets present.
- The four-color moving treatment appears in exactly one place: the concierge's thinking state.
- Banned motion: parallax, gradient blobs, spinning shapes, marquees, particles, glassmorphism, cursor-followers, magnetic buttons, skeleton shimmer, smooth-scroll libraries.
- **Scroll reveals never ship `opacity:0` in static CSS.** Content is visible by default; `.reveal` alone does nothing, and only `components/reveal.tsx` adds the hidden state, from an effect. `animation-timeline: view()` is wrong here — it scrubs with scroll and cannot express "once".

## Content model
`content/work.ts` drives the `/work` index, all 8 detail pages, `generateStaticParams`, JSON-LD, OG images, and live status checks. `content/solutions.ts` does the same for `/solutions`. Adding an entry must produce a page with no template work.

## Definition of done
Acceptance criteria for a change to be considered complete — not a checklist to narrate:

- `bun run build` passes with zero type errors, and passes with **no secrets in the environment**.
- Every touched route renders in light and dark mode. Dark mode has real bright elements — the primary button inverts to `#F5F5F5`/`#101010`.
- Keyboard reaches every interactive element with a visible focus ring.
- `prefers-reduced-motion` leaves no entrance, pulse, pin, or shimmer running, and hides nothing.
- No hydration warnings.
- Report what you did **not** finish. Never describe unfinished work as complete.

## Working notes
- A decision only exists once it's in `docs/PROGRESS.md` or committed code. Chat is one `/clear` from gone.
- Never assume a prior instruction landed — check `git status`, `git diff`, or read the file.
- When an attached file path points into another project, that file is the scope. Don't go exploring the surrounding repo.
