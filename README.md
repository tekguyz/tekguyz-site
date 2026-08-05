# TEKGUYZ

The tekguyz.com site. Next.js 16 (App Router) · TypeScript · Tailwind v4 · Bun.

**Read `CLAUDE.md` first.** The authority order for every decision is
`docs/CANONICAL.md` > `docs/DESIGN.md` > `docs/COPY.md` > `docs/SEO.md`, and
`docs/PROGRESS.md` records what's already built and what's deliberately deferred.

## Getting started

```bash
bun install
cp .env.example .env.local   # then fill it in
bun run dev
```

| Script | What it does |
| --- | --- |
| `bun run dev` | Dev server on :3000 |
| `bun run build` | Production build — must pass with zero type errors |
| `bun run start` | Serve the production build |
| `bun run icons` | Regenerate the favicon/manifest set from `public/brand/icon-master.svg` |

Package manager is **Bun**. Keep `bun.lock` committed; never mix in npm or pnpm.

## Layout

```
app/          routes, the shared lead action, the concierge API route
components/   every component in DESIGN.md §4
config/       solutions.ts — THE accent-to-solution mapping, imported everywhere
content/      work.ts (8 builds), solutions.ts (4 lines), faq.ts, process.ts
lib/          seo, status checks, rate limiting, the concierge LLM seam
scripts/      generate-icons.ts
```

## Things that will bite you

- **The honeypot is `hp_confirm`, never `website`.** `website` is a real CRM
  column; naming the honeypot the same thing silently drops legitimate leads as
  suspected bots, with nothing shown to them and nothing logged.
- **CORS on the CRM triage endpoint is hard-locked to exactly `https://tekguyz.com`.**
  No `www`, no subdomain, no preview-deploy URL. A domain or hosting change
  fails closed and silent, and has to be coordinated with the CRM side first.
- **Accent colors come from `config/solutions.ts` only.** The single documented
  exception is the home ink band, which sets literal values via `.ink-band` in
  `globals.css` because it is dark in both themes.
- **Scroll reveals sit inside `@supports (animation-timeline: view())`.** The
  resting state is `opacity: 0`; without that guard, a browser lacking
  scroll-driven animation renders those sections permanently invisible.
- **Without KV/Upstash credentials the rate limiter is in-memory**, which resets
  on cold start and is not real protection. It warns once when that happens.
- **The concierge must never state a price or commit to a timeline.** That's a
  hard constraint in the system prompt, not a style preference.
- **The four-color moving treatment appears in exactly one place** — the
  concierge's thinking state. Don't extend it.

## Environment

See `.env.example`. Every variable is server-only; none may be prefixed
`NEXT_PUBLIC_`, and `GEMINI_API_KEY` especially would let anyone spend the quota.
