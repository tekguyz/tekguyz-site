# TEKGUYZ Website — Project Instructions

## What this is
The tekguyz.com rebuild. TEKGUYZ is a small, technical team that builds custom software systems, AI assistants, and automated workflows to solve real operational problems for businesses.

## Read before doing anything
- `docs/CANONICAL.md` — architecture, routes, tech, sequence. Highest authority.
- `docs/DESIGN.md` — visual and motion contract. Follow exactly.
- `docs/COPY.md` — all site copy, plus every route's title and description. Use verbatim; do not rewrite.
- `docs/SEO.md` — JSON-LD structured data per route. Titles/descriptions are in COPY.md, NOT here — never duplicate them across both files.
- `docs/PLAYBOOK.md` — brand strategy and voice reference.
- `docs/PROGRESS.md` — phase status, prompt history, Known Gaps. Update at the END of a session, not read in full at the start of a small one.

Authority order: CANONICAL > DESIGN > COPY > SEO. If two conflict, the higher wins and the lower gets fixed — don't silently pick one.

**Read scope depends on the prompt size — do not read all five every time:**
- **Master/full-build prompt:** read all five in full. This is the only case that needs it.
- **A follow-up touching one area** (e.g. "fix the rate limiter," "add the confirmation email"): read CANONICAL.md in full (it's short enough to always read), plus only the specific section of DESIGN/COPY/SEO that's actually relevant to the task. Skip PLAYBOOK.md unless the task involves writing new copy — it's brand strategy, not needed for narrow technical work.
- **When in doubt, read PROGRESS.md's latest entries first** — it'll say what's already built and what a given follow-up actually needs touched.

## Hard rules
- **Never invent metrics, statistics, timelines, client names, or prices.** Copy is final. `[NEEDS REAL DATA]` markers get left alone or removed — never filled.
- **Never reproduce the current tekguyz.com layout.** It's being replaced. Do not fetch or imitate it.
- Accent-to-solution mapping lives only in `config/solutions.ts`. Never hardcode an accent per component.
- No accent color ever fills a button. Primary CTAs are always ink.
- No 5th accent color.
- One shared lead-capture action (`app/actions/contact.ts`), called by both the contact form and the concierge with a different `source`. Never a second implementation.
- **The honeypot field must NOT be named `website`.** The real CRM schema has a legitimate `website` column (the lead's own business site). Naming the honeypot the same thing causes real leads to be silently dropped as suspected bots. Use `hp_confirm` or similar — never a real CRM field name.
- **CORS on the CRM triage endpoint is hard-locked to exactly `https://tekguyz.com`.** No `www.`, no subdomain, no preview-deploy URL will work. If hosting or the domain changes at any point, this fails closed and silent — flag it before changing either.
- Do not add `physical_address`, `social_google_business`, `social_facebook`, or `social_instagram` to the contact form — those CRM fields exist for a different (outbound prospecting) workflow, not this inbound form.
- The AI concierge must never state or estimate a price or commit to a timeline. It routes to a conversation.
- Secrets come from env vars only. Never inline a key, never log one.
- Banned motion: parallax, gradient blobs, spinning shapes, marquees, particles, glassmorphism, cursor-followers, magnetic buttons, skeleton shimmer, smooth-scroll libraries.

## Stack
Next.js 16 App Router · TypeScript · Tailwind v4 (CSS-first @theme) · shadcn/ui (minimal, restyled) · Bun · Motion · React Hook Form + Zod · Resend · Gemini 3.6 Flash · Vercel.

Package manager is **Bun**. Use `bun install` / `bun add`. Keep `bun.lock` committed. Never mix in npm or pnpm.

## Content model
`content/work.ts` is a typed array driving the /work index, all 8 detail pages, `generateStaticParams`, JSON-LD, OG images, and live status checks. Adding an entry must produce a page with no template work.

## Verification before claiming done
- `bun run build` passes with zero type errors.
- Every route renders in light AND dark mode.
- Keyboard-only navigation reaches every interactive element with visible focus.
- `prefers-reduced-motion` disables all entrances, the status pulse, and the pin.
- No hydration warnings in console.
- Report what you did NOT finish. Do not describe unfinished work as complete.