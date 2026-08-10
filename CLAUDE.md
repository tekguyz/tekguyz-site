# TEKGUYZ Website — Project Instructions

## What this is
The tekguyz.com rebuild — **live. `https://tekguyz.com` serves this build**, confirmed by measurement (Prompt 7 audit §6: every measured value identical to local, only the chunk hash differs). **So the CRM CORS lock is active against the real production origin, and a domain or hosting change now fails closed on live traffic, not on a preview.** TEKGUYZ is a small, technical team that builds custom software systems, AI assistants, and automated workflows for operational businesses.

Stack: Next.js 16 App Router · TypeScript · Tailwind v4 (CSS-first `@theme`) · Bun · Motion · React Hook Form + Zod · Resend · Gemini 3.6 Flash · Upstash · Vercel.
Package manager is **Bun**. `bun install` / `bun add`. Keep `bun.lock` committed. Never npm or pnpm.

## Reading the docs — don't read them all

`docs/` is ~47K tokens. Reading it wholesale was right once, for the master build prompt. It is wrong now and expensive.

**Default: read nothing from `docs/` and start work.** The rules below plus the code are enough for most tasks.

Pull a doc in only when the task actually needs it:

| Need | Read |
| --- | --- |
| What's already built, what's deferred, **why a rule below exists** | `docs/PROGRESS.md` — **start here when in doubt** |
| An architecture or CRM-contract decision | `docs/CANONICAL.md` (highest authority) |
| An exact visual value | `docs/DESIGN.md` §-by-§, not whole |
| Page copy, or a route's title/description | `docs/COPY.md` — the relevant page only |
| JSON-LD for a route | `docs/SEO.md` (small, fine to read whole) |
| Writing new brand-voice copy | `docs/PLAYBOOK.md` |

Authority: **CANONICAL > DESIGN > COPY > SEO.** If two conflict, the higher wins and the lower gets fixed — don't silently pick one.

**Visual ground truth is the approved Claude Design export** (`TEKGUYZ Site.dc.html`, `TEKGUYZ Components.dc.html`). DESIGN.md is a translation of it. Where they disagree the export wins — except for decisions made deliberately after it (Geist-only type, `/solutions/[slug]` routing), which CANONICAL governs.

## Hard rules

Each of these cost a real bug to learn. The incident that produced one is in `docs/PROGRESS.md` — go read it there before deciding a rule doesn't apply to your case.

### Content & brand
- **Never invent metrics, statistics, timelines, client names, or prices.** Copy is final. `[NEEDS REAL DATA]` markers are never filled and never rendered.
- **A copy or UX-decision gap gets flagged, never invented.** Missing copy renders a build-visible `[NEEDS COPY: <slot>]` marker — same convention as `[NEEDS REAL DATA]`, never ships as final — and the end-of-task report proposes 2–4 candidates for a human to pick. The marker is only for slots with **no shipped string at all**; informally-sourced copy that is present stays live and gets the candidates, not the marker. Why: the generic `Message sent.` shipped because nothing forced the gap to surface, and "good enough to compile" quietly became permanent.
- **Candidates are transcribed, never regenerated — and collision-checked against `docs/COPY.md` before they are offered.** When a candidate list moves from a report into `docs/PROGRESS.md`, it is copied verbatim from the report that proposed it. Writing the list a second time from the same brief produces a *different* list that looks equally plausible, and the human then picks from options nobody actually reasoned about. It happened: the launcher-label candidates were regenerated between Prompt 10's report and PROGRESS.md, and one of the new entries duplicated the concierge's own input placeholder. The rule existed to make a gap visible; regenerating the candidates re-opened the same hole one level up.
- **The four wayfinding accents mean *solution line*.** Mapping lives only in `config/solutions.ts` (the home ink band is the one documented exception, via `.ink-band`). No accent ever fills a button — primary CTAs are always ink. No 5th accent. Never decorative bullets: `/contact`'s trust facts and `closing-cta` render the same three facts the same way — one muted line, 3px `muted-soft` mid-dots, no colour.
- **`flourish-mark`: every route, once per page.** Not home-only. The closing-CTA echo replays the load-sequence timing and gets no second set of dots — the *once per page* half is absolute.
- **The favicon set is dark** (`#101010` plate, `#4B5563` connectors), generated on `prebuild` from `icon-master.svg` — which is itself **unchanged**, and nothing else reads it (nav lockup and footer render the mark as JSX, OG images build their own). `app/icon.svg` carries the plate too, or the tab icon differs by browser.
- The four-color moving treatment appears in exactly one place: the concierge's thinking state.
- **`LiveFrame` posters: 16:10 in every compact context, 16:9 for the hero, real production UI only** — never a simulator, emulator, or demo-mode capture (PLAYBOOK §12). `bun run check:media` guards this on `prebuild`: missing fails, off-ratio warns. Off-ratio isn't cosmetic — `cover` crops it to a fragment that reads as invented content.

### Lead capture
- **The honeypot is `hp_confirm`, never `website`** (a real CRM column — the collision silently dropped leads), and never `.max(0)` (that makes the silent-accept path unreachable and tells bots they were caught).
- **Optional fields are not unvalidated.** Blank is fine; a filled value is checked. Rules live in `lib/validation.ts`, shared by the client and server schemas so they cannot drift. **Test-covered** — `lib/validation.test.ts`, 46 Vitest cases, `bun run test`. Change a rule, run the suite. (Deliberately *not* wired into `prebuild`.)
- **The phone typing cap counts digits, never characters.** `capPhoneDigits` caps at 15 **digits** because that is what `isPlausiblePhone` measures; formatting is unlimited. `maxLength={15}` is the same bug as a 10-digit cap — `+44 20 7123 4567` is a valid 13-digit number and 16 characters.
- One shared lead-capture action (`app/actions/contact.ts`), called by both the form and the concierge with a different `source`. Never a second implementation.
- **CRM CORS is hard-locked to exactly `https://tekguyz.com`** — no `www`, no subdomain, no preview URL. A domain or hosting change fails closed and silent; flag it before changing either.
- Never add `physical_address` or the `social_*` fields to the contact form — those serve outbound prospecting, not inbound intake.
- The concierge never states or estimates a price, never commits to a timeline, and never prints a raw route path or internal label as visible text.
- Secrets from env vars only, never inlined, never logged. **Never construct a client with a secret at module scope** — `new Resend(undefined)` throws on construction and broke the build. Build must pass with zero secrets present.

### Cascade & reconciliation — the mechanism *is* the rule here
These are invisible to any linter. Nothing below is safe to shorten into a preference.

- **Scroll reveals never ship `opacity:0` in static CSS.** Content is visible by default; `.reveal` alone does nothing, and only `components/reveal.tsx` adds the hidden state, from an effect. `animation-timeline: view()` is wrong — it scrubs with scroll and cannot express "once".
- **The reveal's rise is `translate`, never `transform`.** `.hover-card` owns `transform` for its hover lift; sharing one property means two durations fighting over one value. And a `transition` **shorthand resets every transition property** — `.hover-row`/`.hover-card` sit later in `globals.css` than `.reveal`, so anything carrying both classes needs its transitions declared together in one rule (`.reveal.hover-card`). This silently cancelled entrances while the classes looked correctly wired.
- **Two same-property Tailwind utilities have no winner — only a source order.** `motion-reduce:lg:static` does not beat `lg:sticky`: same property, same (0,1,0) specificity. **No accessibility floor may rest on that.** The `/process` pin is `.tg-pin` in `globals.css` — a real rule in `@media (min-width: 1024px)`, overridden by `position: static !important` below it. To force such a declaration back on and *measure* it, the inline style needs `!important` too, or you measure the unchanged element.
- **A grid placement never ships as an inline `style`.** `.tg-grid` is 12 tracks, 8 below 1024px, 1 below 768px — so every placement needs a per-band value, and an inline `style` can only be overridden by `!important`. That is why the ≤767 reset carries one, and why a second one in the adjacent query is not the answer. Both values go on the element as Tailwind arbitrary properties (`[grid-column:1/8] max-lg:[grid-column:1/-1]`). **A 12-column span left to run on the 8-track grid does not error — it creates implicit tracks** and collapses the explicit ones (headlines to 144px, the `/contact` card to 230px). The 8-column spans are tabulated in DESIGN.md §8; derive a new one by scaling 8/12 and keeping §3's gap track. This is a source order, so **measure `grid-template-columns` at 768 and confirm 8 explicit tracks and 0 implicit** rather than trusting the sort. One inline placement survives, in `home-hero.tsx` (`1 / 7`), and only because it ends at line 7 and so still fits inside 8 tracks — it is the exception that shows what the rule is about, not a counter-example. Anything ending past line 9 must be converted.
- **The nav `<header>` carries no border of its own.** In Tailwind v4 preflight an unqualified `border-b` resolves to `currentColor` — a permanent ink/white line painted onto the signature stripe. The one specified hairline lives on the absolutely-positioned fill layer so it can fade in with the scrolled state.
- **Every page component returns a single root element, never a bare fragment.** Next scrolls the new segment into view on each client-side transition; a multi-child fragment routes that through `FragmentInstance.scrollIntoView()`, which calls it on *every* top-level child, so the page lands wherever the surviving call left it. Keep the JSON-LD `<script>` inside the wrapper — a zero-box element can't be scrolled to, which is what broke the intended fallback.
- **Branches of a multi-step form need distinct `key`s.** Without them React reconciles the two steps in place and reuses the same uncontrolled `<input>` nodes — step 1's name and email become step 2's phone and website, values included. It looks exactly like browser autofill and isn't.
- **The concierge panel is bounded by the viewport, never by content.** `max-height: calc(100dvh - 48px)`, and the message list's 300px floor is `flex: 1 1 300px` + `min-height: 0`, **not** `min-height: 300px` — a hard min-height doesn't fix the overflow, it moves it one layer down, where the list refuses to compress and the panel clips it against its own `overflow: hidden`. A content-sized panel anchored `bottom: 24px` put its only close control 119px above the top edge at 844×390. If the list outgrows 300px, it scrolls; the panel does not grow. Sheet threshold is `(max-height: 560px)` — **height, never width**: the failing case is a phone held sideways, which is *wider* than 768px.
- **The launcher yields by opacity and leaves the tab order with it.** `opacity: 0` alone is a hidden-but-focusable control — it also needs `pointer-events: none`, `aria-hidden="true"` and `tabIndex={-1}`, together. Opacity only, no transform: its Motion entrance animated `y` and **ran unsuppressed under `reduce`** (measured, H-4). The transition lives in `.tg-yield` in `globals.css` rather than inline, so the reduced-motion block can beat it. Yield targets are the two `data-primary-cta` elements only — widening that set makes the launcher flicker on any scroll-heavy route.
- **Tap targets grow by `::before`, never `::after`, and never by resizing.** `.tap-44` / `.tap-24` in `globals.css` are the only two expansions — DESIGN.md §8 is now a description of what ships, not a target. `::after` is taken: `[data-navlink]::after` is the active-page indicator, on exactly the elements the tap policy has to reach. **The expansion has a spacing consequence that is a layout decision, not styling:** two 44px targets stacked less than 44px apart overlap, and the winner is source order, so a tap on `Process` lands on `Work`. That is why the footer link column gap is 22px — 22.4px links at the old 12px gap would have overlapped by 9.6px. Check every adjacency you create.
- **A tap target is verified by hit-testing, never by a rect.** `getBoundingClientRect` cannot see a pseudo overlay, so a rect-based check calls every correctly-fixed target a failure — the measurement and the fix are looking at different things. `scripts/audit-mobile.ts taps` probes with `elementFromPoint`. Two ways that probe reads as a *pass* when it is wrong, both of which happened: `elementFromPoint` only hit-tests the visible viewport, so elements must be scrolled in first; and an **ancestor** owning the probe point is the tap falling through to the container — counting it as a pass reported 0 failures site-wide.
- **`RevealController` stays keyed on `usePathname()`.** It mounts once in the root layout, which does not remount on client-side navigation — with `[]` deps, every route reached by clicking a link gets no observer at all.

### Layout & tooling
- **The detail-page meta rail carries Solution line / Status / Live demo, and no button.** `MetaRail` in `app/work/[slug]/page.tsx` is the one implementation, for both tiers. A second ask directly above the `closing-cta` band undercuts it — that band is the documented size exception *because* it's the page's single strongest ask. Separately: `project-card` never carries an image, but a project's own **detail page** does. The rule protects the weight gap between the two card treatments on the index, not a ban on ever showing the screenshot.
- **The `/process` progress rail reads the step elements' own positions**, never a fraction of the section's scrollable range — the two are unrelated, and the readout hit "Step 04 of 04" 457px early. A progress indicator that disagrees with the page is worse than none.
- **Banned motion:** parallax, gradient blobs, spinning shapes, marquees, particles, glassmorphism, cursor-followers, magnetic buttons, skeleton shimmer, smooth-scroll libraries.
- **`bun run lint` works — keep it working.** `eslint.config.mjs` imports `eslint-config-next`'s **native flat config** directly; it is not FlatCompat-loadable. Note what it cannot buy you: everything in the cascade section above is invisible to a JS/JSX linter. Those rules remain the only thing catching it.

## Content model
`content/work.ts` drives the `/work` index, all 8 detail pages, `generateStaticParams`, JSON-LD, OG images, and live status checks. `content/solutions.ts` does the same for `/solutions`. Adding an entry must produce a page with no template work.

## Definition of done
Acceptance criteria — not a checklist to narrate:

- `bun run build` passes with zero type errors, and passes with **no secrets in the environment**.
- Every touched route renders in light and dark mode. Dark mode has real bright elements — the primary button inverts to `#F5F5F5`/`#101010`.
- Keyboard reaches every interactive element with a visible focus ring.
- `prefers-reduced-motion` leaves no entrance, pulse, pin, or shimmer running, and hides nothing.
- No hydration warnings.
- Report what you did **not** finish. Never describe unfinished work as complete.

## Verifying visually — read this before claiming you did

- **Windows animations are off** on this machine (`MinAnimate = 0`), so `prefers-reduced-motion: reduce` matches machine-wide. A deliberate standing preference, not a misconfiguration — **don't change it, and don't burn turns emulating around it.** An inert entrance, a static concierge stripe, an IntersectionObserver that never fires: all expected here. **The motion layer is confirmed working** (user, Pixel 9A, 2026-08-07). Verify wiring by computed style and class count, **say which half you proved**, and leave the motion-enabled check to the user.
- **Set the viewport explicitly** — `resize_window` with width/height. The `desktop` preset resets to the pane's own size, which may be under the 1024px `lg` breakpoint and will silently show you the stacked mobile layout.
- **Screenshots fail when the Browser pane is hidden** (`document.hidden === true` → no compositing → 5s timeout). Only pictures fail; computed styles, geometry, class mechanics, `fetch`, console and network reads all keep working. When the pane is displayed they work normally.
- **A stale server can hold a port and serve a previous build** — HTML referencing chunk filenames that no longer exist, returning 500, which mimics catastrophic breakage (no CSS, no hydration, static pin, no reveals). Kill by port, not by process name, and confirm the referenced stylesheet returns 200 before trusting any measurement. Recipe in `docs/PROGRESS.md`.

## Working notes
- A decision only exists once it's in `docs/PROGRESS.md` or committed code. Chat is one `/clear` from gone.
- Never assume a prior instruction landed — check `git status`, `git diff`, or read the file.
- When an attached file path points into another project, that file is the scope. Don't go exploring the surrounding repo.
