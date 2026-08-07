# TEKGUYZ Website Rebuild — CANONICAL BRIEF

**Status: current. Supersedes and replaces all five earlier files.** Delete these — they contain stale or withdrawn decisions:
- ~~tekguyz-design-system-v1.3.md~~ (superseded; content folded in below)
- ~~tekguyz-media-asset-manifest.md~~ (obsolete — assets are done)
- ~~tekguyz-claude-design-brief.md~~ (rewritten against the revised architecture)
- ~~tekguyz-site-architecture-ux-flow.md~~ (proposed four `/solutions/[slug]` pages — **withdrawn**)
- ~~tekguyz-rebuild-master-plan.md~~ (proposed live-iframe embed as the v1 signature — **deferred**, see §3)

Only two more documents will exist after this one: **Copy Deck v2** (all new page copy) and **Design System v2.0** (the visual contract Claude Code reads). Nothing else.

Source of truth hierarchy: **Brand Playbook v2 > this brief > Design System v2.0 > Copy Deck v2.** If any two disagree, the higher one wins and the lower one gets fixed.

---

## 1. Current state — what's already resolved

| Item | Status |
| --- | --- |
| Icon direction | **Resolved.** `icon-master.svg` — Connected Nodes: four accent circles (top blue, right violet, bottom amber, left teal) joined by hairline connectors, no container. Diamond arrangement, floating. |
| Brand asset set | **Done**, generated from the two masters. |
| Case-study imagery | **Done**, with one open item. `field-ops-thumb.webp` recaptured. `sarah-poster.webp` recaptured as the real AI Voice Receptionist dashboard (transcript, CRM sync, follow-up email) — replacing an earlier version that showed a sandboxed phone-call simulator, which was never the actual product. |
| Hero media | **Resolved — static image, video deferred.** New `sarah-poster.webp` captured at 1600×900 (16:9) showing the real dashboard: customer profile, live conversation feed, and confirmation email. Launching with the static image; the looped `.mp4` is a later enhancement, not a launch blocker. (The old `sarah-demo.mp4` still shows the retired phone-call simulator — do not ship it as-is; recapture when the video version happens.) Hero uses its own 16:9 ratio, distinct from the 16:10 used in compact card contexts — see DESIGN.md `LiveFrame`. |
| Lead capture | **Built and live in this repo.** `app/actions/contact.ts` — Zod validation (including format checks on the optional `phone` and `website`), honeypot named `hp_confirm`, min-fill-time, parallel Resend notification + submitter confirmation + CRM dispatch via `Promise.allSettled`. Exercised end to end against real credentials. |
| AI concierge | **Built and live in this repo.** `app/api/concierge/route.ts` — tool-calling lead capture through the same shared action, session cap, shared durable rate limit, Gemini 3.6 Flash behind `lib/concierge/llm.ts`. |
| Core SEO | **Live.** Canonicals, robots.ts, sitemap.ts, ProfessionalService JSON-LD, dynamic OG route, full favicon/manifest set. |

**One open production issue:** `lockup-master.svg` uses a `<text>` element for the wordmark, so it renders incorrectly wherever Geist isn't installed. Convert to outlined paths for the true master.

---

## 2. The governing decision

Two instructions were in tension: *keep the current visual direction, elevated* and *it must not look like my current website*. Resolution:

**Keep the brand contract. Rebuild the expression.**

Stays (real equity, also live in GBP, social, and the CRM product): the four accents and their locked mapping to Solution lines; ink-on-white with no accent ever filling a button; Geist as the single typeface (Inter dropped in DESIGN.md §2 — the two were redundant); the Connected Nodes mark; every anti-template rule from Design System v1.2 — none relaxed.

Changes, and this is why it won't look like today's site:

- **Type scale.** The current hero is 46px on desktop — that's a section header. Moving to fluid `clamp()` topping near 96px, tracking −0.04em, body steady at ~17px. A 5–6× hero-to-body ratio reads as confident; 2.7× reads as cautious. Single highest-impact change on the list.
- **Section architecture** — homepage resequenced (§4).
- **Depth** — eight real detail pages where today there are zero.
- **Motion** — from scattered fade-ins to one choreographed system (§6).
- **The proof mechanic** — from a decorative badge to a measured one (§3).

---

## 3. Signature: verified live status

Every agency site has a "LIVE" badge that is a graphic asserting a fact. Yours measures it.

**Mechanic.** A server component issues a HEAD request per demo URL on an hourly `revalidate`, rendering the actual result: `Live · verified 14 minutes ago`. Down or slow renders honestly as `Temporarily unreachable` with the link still available.

**Why it fits:** "Proof Over Claims" is a stated brand value, and this is the only version of the live-demo badge on the internet that is literally true at render time rather than asserted at design time.

**Tradeoff, stated plainly:** if a demo breaks, your homepage says so. Argument for accepting it: you learn before a prospect does, and honest failure states are more credible than a badge that lies. This is a real decision, not a free win.

**Implementation:** server-side only (never client fetches to 8 origins), `next: { revalidate: 3600 }`, 3s timeout per check, `Promise.allSettled` so one hang can't block the page, cached result shared across all renders in the window.

### The deferred embed — architected for, not built

The eventual live-iframe embed (visitor opens the real app inline) remains the endgame. Build now so it costs nothing later:

- One `<LiveFrame>` component. Per-project `embeddable: boolean` in `content/work.ts`, all `false` at launch.
- `false` renders poster + "Open it in a new tab." `true` renders click-to-activate iframe.
- When the CSP work is done per app (`frame-ancestors https://tekguyz.com`), flip a flag. No redesign, no layout change.
- Mobile stays poster-plus-link regardless of flag.

---

## 4. Information architecture

```
/                    Home
/solutions           Index — light overview, four rows
/solutions/[slug]    4 detail pages, one per Solution line
/work                Index — 4 case studies + 4 projects
/work/[slug]         8 detail pages
/process             How We Work
/contact             Contact form + FAQ + concierge
/privacy             Existing
```

**Reversed: `/solutions/[slug]` × 4, plus a lightweight `/solutions` index.** Earlier reasoning ("one page, anchor-linked, thin content doesn't justify four pages") was wrong on the decisive technical point: a `#anchor` fragment is not a separate page to a search engine — `/solutions#ai-voice-agents` and `/solutions#business-systems` are the *same URL* to Google, so all four solution keywords compete for relevance on one page instead of each ranking independently. That's the exact mechanism that already justified `/work/[slug]`; there's no principled reason it shouldn't apply here too. Each solution page also isn't as thin as it looked in isolation, once its related case study and pull-quote sit alongside it — same index-plus-detail pattern as Work, same `content/solutions.ts` single-source-of-truth logic driving both the index and the four detail pages.

**`/work/[slug]` is where the investment goes.** Eight pages of genuinely distinct content: Challenge/Approach/Outcome, the LiveFrame, the pull quote, plain-language technical approach, prev/next. Simultaneously the best SEO asset (eight pages targeting distinct problem-language queries) and the best sales asset — one link per warm lead, which speaks directly to the follow-up gap the 90-day strategy identified.

**Content model:** one typed file, `content/work.ts`, drives the index, detail pages, `generateStaticParams`, JSON-LD, OG images, and status checks. Add an entry → get a page.

**Everything clickable resolves.** Solution card → `/solutions/[slug]`. Any build card → `/work/[slug]`. Nothing dead-ends into the contact form the way today's cards do.

### Homepage sequence

1. Signature stripe
2. **Hero** — headline at full scale, subhead, dual CTA, static `sarah-poster.webp` (16:9). The `sarah-demo.mp4` loop is retired for launch — see §1; it still shows the withdrawn phone simulator.
3. **Proof line** — one sentence, no card: *Eight live builds. Open any of them right now.*
4. **Solutions** — four cards, accent dot, one-line hook, → `/solutions/[slug]`
5. **Featured Work** — 2 case studies, alternating full-width rows, LiveFrame + pull-quote
6. **Testimonial** — see §5
7. **Process teaser** — 4 steps
8. Signature stripe → Closing CTA → dark footer

**Cut:** the Projects Teaser. Two case studies followed by three more projects is portfolio stacked on portfolio before the visitor reaches Process or the ask. `/work` holds the archive.

---

## 5. Content gaps

1. **The verified testimonial isn't on the site.** Playbook §11 has a specific, credible testimonial naming 3CX, Twilio, and Zoho CRM. It appears nowhere in the copy deck. Real social proof sitting unused while the site relies entirely on self-description. Homepage, after Featured Work, marked up as `Review` schema. **Getting a name and company attached roughly doubles its weight** — an anonymous quote is worth far less.
2. **No FAQ.** Pre-qualifies leads, targets long-tail queries, earns `FAQPage` schema. Cover: how pricing works, typical timeline, whether you serve businesses outside South Florida (yes — nationwide remote, and that's stated nowhere obvious), what happens post-launch, whether you work on existing systems or only new builds.
3. **Eight detail narratives need writing.** Case studies have compressed Challenge/Approach/Outcome material; projects have one description line each.
4. **Footer location drift.** Copy deck says "Pompano Beach, FL"; everything else says "South Florida." Live site appears already corrected — confirm, then fix the deck so it stops seeding drift.

---

## 6. Motion and scroll

| Layer | Tool | Scope |
| --- | --- | --- |
| Scroll reveals | IntersectionObserver + a CSS class toggle | All entrances. **Corrected** — this originally specified native `animation-timeline: view()`, which is wrong: that API scrubs with scroll position, so it reverses on scroll-up and cannot express "once". It also required `opacity:0` in static CSS, which blanked sections wherever nothing scrolled. See DESIGN.md §6. Content defaults to visible; the reveal is progressive enhancement. |
| Route transitions | View Transitions API via React `<ViewTransition>` | Page changes + shared-element morphs. |
| Everything else | Motion (formerly Framer Motion) | Only presence, gesture, layout animation. |

Native CSS now covers the whole scroll-reveal category — the 30–50KB animation library that used to be mandatory is optional in 2026, and dropping it measurably improves LCP. View Transitions degrade to an instant cut in Firefox; acceptable, no JS fallback warranted.

**Reveal contract:** trigger at 15% into viewport (not 50% — at 50% fast scrollers watch content arrive late and it reads as lag). `translateY(16px)→0` + opacity, 500ms, `cubic-bezier(0.16, 1, 0.3, 1)`, once. Grids stagger 80ms, max 4 concurrent. Alternating Featured Work rows reveal text and frame **as one unit** — one idea, not two.

**Shared-element moment:** clicking a build card morphs its poster and title into the detail page hero via matching `view-transition-name`. The visitor watches what they clicked become the page. Second-best interaction on the site, nearly free.

**No Lenis, no smooth-scroll library.** Nearly every Awwwards site uses it and it's wrong here: inertia adds perceived latency, which is exactly the friction a visitor evaluating an *operational efficiency* firm shouldn't feel. Native scroll; `scroll-behavior: smooth` for anchor jumps only.

**One pinned moment, `/process` only** — steps pin while a progress indicator advances, because Process is a genuine sequence, so scroll progress encodes real information rather than decorating. Used once, which is what makes it register. Same logic for numerals: `/process` earns 01–04 because it's ordered. Nothing else on the site gets numbers.

**Still banned** (v1.2, unchanged): parallax, gradient blobs, spinning shapes, marquees, particles, glassmorphism, cursor-followers, magnetic buttons, skeleton shimmer, uniform fade-everything-in.

**Accessibility floor:** `prefers-reduced-motion` kills every entrance, the badge pulse, and the pin (Process becomes a stacked list). Visible focus rings, skip link, keyboard-operable LiveFrame.

---

## 7. Tech stack

| | Choice |
| --- | --- |
| Framework | Next.js 16, App Router, TypeScript, static-first |
| Package manager | **Bun** (carry forward; keep `bun.lock` committed) |
| Styling | Tailwind v4, CSS-first `@theme` |
| Components | shadcn/ui, minimal set, restyled to tokens — never at defaults |
| Content | Typed TS (`content/work.ts`, `content/solutions.ts`) — not MDX, not a CMS |
| Motion | §6 |
| Forms | React Hook Form + Zod + Server Actions |
| Email | Resend → `contact@tekguyz.com` |
| CRM | Existing triage webhook |
| AI | Gemini 3.6 Flash via the existing concierge abstraction |
| Fonts | `next/font`, self-hosted Geist only |
| Analytics | `@vercel/analytics` + `@vercel/speed-insights`, both mounted (privacy policy already discloses this — code must match) |

**Not adding:** Lenis, GSAP, a CMS, Three.js. **Not using 21st.dev** — it's a registry of community shadcn components, structurally a source of the exact generic patterns this design system names and bans. Fine later for CRM internals where distinctiveness doesn't matter; wrong here.

**Using the `frontend-design` skill** — Anthropic-authored, available in Claude Code, enforces a plan-and-critique pass before code and names the aesthetic defaults AI design falls into. Its own rule is that an explicit brief wins over its general guidance, so it reinforces these tokens rather than overriding them. Invoke explicitly in the master prompt.

### Carrying forward the existing code

- `app/actions/contact.ts` — port as *the base structure*, but the field set changes — see the confirmed CRM contract immediately below. One shared lead-capture action, called by both the form and the concierge with a different `source`. Never a second implementation.
- **Critical fix, not optional: rename the honeypot field.** The live code's Zod schema uses `website` as the honeypot key (`z.string().max(0).optional()`, must stay blank). The CRM's real, confirmed optional column is *also* called `website` — meaning a legitimate lead typing their actual business URL into a visible "Website" field would collide with the honeypot key and get **silently dropped as a suspected bot**, with no error shown to them or logged anywhere. Rename the honeypot key to something that isn't a real CRM field name (e.g. `hp_confirm` or `_gotcha`) before adding a real, visible Website input. This must happen in the same change — adding the field without the rename reintroduces the exact bug it was meant to fix.
- **Confirmed CRM contract (from the CRM team, load-bearing):**
  - Endpoint: `POST /api/v1/triage/[webhook_secret]` — unchanged, don't touch from the site side.
  - **CORS is hard-locked to exactly `https://tekguyz.com`** — no `www.` variant, no subdomain, checked exactly. If hosting, domain, or the serving subdomain changes at any point, this fails **closed and silent** — a browser-level CORS rejection with no server-side error visible to the visitor. Any domain/hosting change must be coordinated with the CRM side in lockstep, before launch, not discovered after.
  - Required fields: `client_name`, `email`. Everything else optional.
  - **Fields that make sense for this form** (Motion A inbound intake) and should be added: `phone` (optional — a second contact channel, directly useful given the known follow-up-gap problem, validated as a plausible phone number — reasonable digit count, not just any string), `website` (optional — the lead's own business site, once the honeypot collision above is fixed, validated as a well-formed URL via Zod). **Optional does not mean unvalidated** — a blank field should be accepted, a filled one should be checked. This was a real gap: the original field addition specified these as `z.string().optional()` with no format constraint, which is why nonsense input currently passes silently. `company` and `service_category` (fed by the existing Area of Interest select) are already covered by the current build. `lead_source` stays server-set (`"Website Contact Form"` vs `"AI Concierge"`, per the existing `source` parameter) — not a user-facing field.
  - **Fields that exist in the CRM schema but do NOT belong on this form**: `physical_address`, `social_google_business`, `social_facebook`, `social_instagram`. These serve the outbound Motion B prospecting workflow (profiling a cold-outreach target business), not an inbound visitor filling out a contact form. Asking a warm inbound lead for their Google Business Profile URL is friction with no payoff here — leave these off.
  - **AI Spam Shield** silently skips the notification email for obviously synthetic test submissions (bot-pattern names/emails). Not a bug — expect it during your own testing, don't debug a "missing email" that's actually the spam shield doing its job correctly.
  - Rate limit: 30/min per org, 429 + `Retry-After` past that. Not a real constraint for a contact form; only relevant if load-testing.
- **Grounding data, scoped deliberately** — not "everything on the site." The concierge's job is scoping + lead capture, not general customer service, so it's grounded in: all four Solutions (name, description, features), all 8 `/work` entries (name, solution line, one-line description, URL — not the full Challenge/Approach/Outcome narrative, that's too much per-request token cost for a job that doesn't need it), the FAQ (so its answers to "how much" and "do you serve outside Florida" match the site's own published answers instead of improvising something adjacent), and basic company facts (location, hours, the no-price-without-a-conversation rule). Process steps are optional context, not required. The testimonial and the full Playbook are not needed — voice comes from the system prompt's own instructions, not from injecting the brand doc wholesale.

`app/api/concierge/route.ts` — port, then **upgrade the system prompt** so responses take a blueprint shape (which solution line, what components, closest existing build) rather than open chat. Hard constraint, non-negotiable: never state or estimate a price, never commit to a timeline — route to a conversation instead. An AI improvising a number on your behalf is a real business risk.
- **Switching to Gemini touches only `lib/concierge/llm.ts`** — the route's tool round-trip shape is Anthropic Messages API, and that adapter is exactly the seam for swapping providers.
- **Fix the rate limiter.** The in-memory token bucket is per-instance on Vercel and resets on cold start — closer to decoration than protection. Generalize to `lib/rate-limit.ts` backed by Vercel KV or Upstash, used by both the concierge route and the contact action.
- **Rotate the Resend key** (exposed in plaintext) and put a shared-secret header on the CRM triage endpoint if it currently accepts unauthenticated POSTs.

---

## 7b. Environment variables

`.env.local` for development, and the same set in Vercel's project settings for production:

```
RESEND_API_KEY=            # rotate the exposed one before launch
CRM_TRIAGE_ENDPOINT=       # https://tekguyz-crm.vercel.app/api/v1/triage/[secret]
GEMINI_API_KEY=            # concierge, server-side only — never NEXT_PUBLIC_
KV_REST_API_URL=           # or UPSTASH_REDIS_REST_URL — shared rate limiter
KV_REST_API_TOKEN=         # or UPSTASH_REDIS_REST_TOKEN
```

**None of these are `NEXT_PUBLIC_`** — every one is server-only. If any ends up prefixed that way it's exposed in the browser bundle, which for `GEMINI_API_KEY` means anyone can spend your quota.

`metadataBase` uses the hardcoded production URL from the root layout, not an env var — one less thing to misconfigure per environment.

Add `.env.local` to `.gitignore` before the first commit.

---

## 8. SEO

Building on what's already live (canonicals, robots, sitemap, ProfessionalService JSON-LD, dynamic OG, favicon set):

- **Per-page OG images** via `next/og` `ImageResponse` — each `/work/[slug]` gets its own card with name, solution line, accent color. Eight distinct link previews instead of one generic image. High impact for outbound, which is your actual lead channel.
- **Every route exports full `openGraph` + `twitter` metadata**, mirroring Home's live pattern exactly. No route ships title/description only. `metadataBase` set once in root layout; pages never resolve image URLs independently.
- **Expand JSON-LD:** `Service` per Solution line (the existing `makesOffer` block is the skeleton), `Review` for the testimonial, `FAQPage`, `BreadcrumbList` on every non-home route via one shared helper — not hand-repeated per page, `SoftwareApplication` per build.
- **Real `lastModified` in sitemap.ts**, sourced from content files — currently request-time `new Date()`, valid but a weak freshness signal.
- **Delete the dead root-layout fallback description** (playbook §14 — never served, just noise).
- **Keep multi-resolution `favicon.ico`** in `app/` — currently indexed, don't regress.
- **Detail pages target problem-language queries** — "missing after hours calls contractor," "field photo verification software" — long-tail the homepage can't reach.
- **Core Web Vitals:** static generation throughout, `next/image` with explicit dimensions, self-hosted fonts with `display: swap`, no video autoload before poster paint. Target LCP under 1.5s.
- **GBP Services section** (playbook §14 item 2) — still pending, still a real ranking signal, maps 1:1 to the four Solution lines. Not a website task, but the highest-leverage open SEO item you have.

---

## 9. Build sequence

**Steps 1–6 are complete.** The site is built, audited against the approved
Claude Design export, verified against live integrations, committed, and
deployed as a Vercel preview. `docs/PROGRESS.md` is the running record of what
each prompt covered — read that, not this list, for current status.

7. **Remaining before launch:** point a domain at it, add the privacy
   disclosures (see Known Gaps), recapture the compact-context images.
8. **Later:** one CSP prompt per demo app (`frame-ancestors https://tekguyz.com`),
   then flip `embeddable` flags to `true` to activate live embeds.

**The approved Claude Design export is the visual ground truth.** `TEKGUYZ
Site.dc.html` and `TEKGUYZ Components.dc.html` carry the literal values; this
document and DESIGN.md are translations of it. Where a translation disagrees
with the export, the export wins and the doc gets fixed — except on decisions
made deliberately *after* the export (Geist-only typography, the
`/solutions/[slug]` routing reversal), which this document governs.

**Deferred, deliberately, not forgotten:**
- Hero video loop (static image ships first).
- `lockup-master.svg` wordmark → outlined paths.
- Cal.com scheduling embed (see §10).
- GBP Services section — not a website task, but the highest-leverage open SEO item.

---

## 10. Open decisions

- **Verified live status** — **resolved: yes**, accepting that a broken demo shows publicly. Honest failure states beat a badge that lies, and you find out before a prospect does.
- **Testimonial attribution** — **resolved.** "Joe M. · Verified Google review," with a link to the GBP listing. Third-party verifiability carries more weight than a full name would; also cross-linked from the Team Performance project page, since that's the build he's describing.
- **Embed scope when you get there** — 4 case studies only, not all 8. Preserves the case-study/project distinction the design system deliberately protects.
- **Cal.com scheduling** — open, deferred past launch on purpose. Reasoning: the current funnel problem is follow-up on warm leads, not booking friction, and the form already routes into the CRM where that follow-up happens. Adding a second, parallel conversion path before the first one is measured risks splitting the funnel and muddying which one actually works. Ship, watch real inbound for a few weeks, then decide — and if it goes in, the natural home is `/contact` as an alternative to the form ("prefer to just grab time?"), not a replacement for it, self-hosted or theme-overridden to match the token system rather than shipping Cal's default styling.
