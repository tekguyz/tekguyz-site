# TEKGUYZ Website — Project Instructions

## What this is
The tekguyz.com rebuild — **live. `https://tekguyz.com` serves this build.** TEKGUYZ is a small, technical team that builds custom software systems, AI assistants, and automated workflows for operational businesses.

**Push means push to `master`, and a push to `master` IS a production deploy to `tekguyz.com`** — one Vercel project, `tekguyz-site`, holds both the apex and `www`. There is **no preview project** between the repo and live traffic. The user issues both the commit and the push instruction; you do not decide to push, and you do not substitute a branch for a push that was asked for.

Branch and PR only when asked:

```
git checkout -b <type>/<slug>   # fix/ feat/ docs/
git push -u origin <branch>     # Vercel builds a PREVIEW; tekguyz.com untouched
gh pr create --fill             # gh 2.96, authenticated as tekguyz
```

**After any push, confirm it** — `git log origin/master`, or the Vercel connector's `list_deployments`. **A denied push is not a push that didn't happen:** on 2026-08-10 one reached production while the session was still describing it as pending. Measure it, never infer it from the command's output.

Two things about previews, neither a bug: **CRM CORS is locked to `https://tekguyz.com`**, so lead capture fails closed on every preview URL by design, and Vercel SSO gates `*.vercel.app` links.

**Hosting topology is external state that drifts without touching the repo, so re-measure it and never cite a doc for it.** It was wrong in two docs for four prompts and got quoted back to the user as a safety claim.

Stack: Next.js 16 App Router · TypeScript · Tailwind v4 (CSS-first `@theme`) · Bun · Motion · React Hook Form + Zod · Resend · Gemini 3.6 Flash · Upstash · Vercel.
Package manager is **Bun**. `bun install` / `bun add`. Keep `bun.lock` committed. Never npm or pnpm.

## Which skill, when

Skills do not load themselves. Invoke the one that matches **before** starting, and say which one you're using.

| Situation | Skill |
| --- | --- |
| Deciding how something **looks or feels** — layout, motion, type, density, a component's treatment | `frontend-design` |
| **Inventing** behavior that isn't already specified in `docs/DESIGN.md` | `superpowers:brainstorming` **first**, then `frontend-design` |
| A bug, a test failure, anything behaving unexpectedly | `superpowers:systematic-debugging` |
| Before a push, or after a batch of edits | `/code-review` |
| Implementing a decision that is already written down | none — just build it |

**The user is not a designer and cannot brief you in design vocabulary. Do not ask them to.** Bring options they can react to; that is what `brainstorming` and `frontend-design` are for. Asking the user to describe what they want in jargon they don't have is how this project ended up with one motion idea and a spec nobody designed.

**Two tools, two vocabularies.** The user also runs a separate Claude.ai Project for early-stage conversations, with its own Workflow Gates — Discovery / Blueprint / Prompt-pack. That is unrelated to the Build Phases in `docs/STATUS.md`; if a prompt arrives referencing a "blueprint" or a decision "from Discovery," it's the output of that other tool — treat it as a direction already decided, not an instruction to re-run brainstorming here. The reverse also holds: an aesthetic decision belongs here, not there — Claude.ai's Discovery gate is text-only and can't render an option to react to, which is the entire reason `frontend-design` exists.

## Reading the docs — don't read them all

**Default: read nothing from `docs/` and start work.** The rules below plus the code are enough for most tasks.

| Need | Read |
| --- | --- |
| **What is open right now** | `docs/STATUS.md` — short, and the only live status |
| An architecture or CRM-contract decision | `docs/CANONICAL.md` (highest authority) |
| An exact visual value | `docs/DESIGN.md` §-by-§, not whole |
| Page copy, or a route's title/description | `docs/COPY.md` — the relevant page only |
| JSON-LD for a route | `docs/SEO.md` (small, fine to read whole) |
| Writing new brand-voice copy | `docs/PLAYBOOK.md` |
| **Why a rule below exists** — incidents and mechanisms | `docs/archive/HISTORY.md`, the section for that rule only |

Authority: **CANONICAL > DESIGN > COPY > SEO.** If two conflict, the higher wins and the lower gets fixed — don't silently pick one.

**A doc is not a measurement.** On 2026-08-12 three "open blockers" quoted to the user from `CANONICAL.md` §5 were measured and found already built — the testimonial, the FAQ, and the footer location. Two docs were wrong about the Vercel topology for four prompts, and the mobile queue was summarised as closed twice while it wasn't. **Before telling the user what the state of something is, check the code, the repo, or the API — not a doc, and not this file.**

**Visual ground truth is the approved Claude Design export** (`TEKGUYZ Site.dc.html`, `TEKGUYZ Components.dc.html`). DESIGN.md is a translation of it. Where they disagree the export wins — except for decisions made deliberately after it (Geist-only type, `/solutions/[slug]` routing), which CANONICAL governs.

## Hard rules

Each of these cost a real bug to learn. The incident that produced one is in `docs/archive/HISTORY.md` — go read it there before deciding a rule doesn't apply to your case.

### Content & brand
- **Never invent metrics, statistics, timelines, client names, or prices.** Copy is final. `[NEEDS REAL DATA]` markers are never filled and never rendered.
- **A copy gap gets flagged, never invented — but the user has since said: write the copy.** Draft it from `docs/PLAYBOOK.md`'s brand voice and **tell them what you added**. Reserve the build-visible `[NEEDS COPY: <slot>]` marker for a slot you genuinely cannot fill without a fact you'd have to invent. Never ships as final.
- **Candidates are transcribed, never regenerated, and collision-checked against `docs/COPY.md`.** Re-writing a candidate list from the same brief produces a different, equally plausible list, and the human then picks from options nobody reasoned about. One regenerated entry once duplicated the concierge's own input placeholder.
- **A partially resolved finding is never summarised as resolved.** Every summary carries the qualifier, or the finding splits into two IDs. A row reading "Resolved" with the exception buried in the same cell is how a partial close silently becomes a full one.
- **The four wayfinding accents mean *solution line*.** Mapping lives only in `config/solutions.ts` (the home ink band is the one documented exception, via `.ink-band`). No accent ever fills a button — primary CTAs are always ink. No 5th accent. Never decorative bullets: `/contact`'s trust facts and `closing-cta` render the same three facts the same way — one muted line, 3px `muted-soft` mid-dots, no colour.
- **`flourish-mark`: every route, once per page.** Not home-only. The closing-CTA echo replays the load-sequence timing and gets no second set of dots — the *once per page* half is absolute.
- **The favicon set is dark** (`#101010` plate, `#4B5563` connectors), generated on `prebuild` from `icon-master.svg` — which is itself **unchanged**, and nothing else reads it (nav lockup and footer render the mark as JSX, OG images build their own). `app/icon.svg` carries the plate too, or the tab icon differs by browser.
- The four-color moving treatment appears in exactly one place: the concierge's thinking state.
- **`LiveFrame`'s padding is 0 and stays 0**, its fill is `--tg-surface` (never a literal white), and its status block sits **beneath** the frame, never inside it. `aspect-ratio` governs the *outer* box, so padding is subtracted from the media: the frame keeps its 16:10 while the screenshot inside it silently stops being 16:10. The fill is a loading state, not a design surface — invisible once the poster paints under `cover` — so it must be a token that resolves in dark mode and inside `.ink-band`. Status *inside* means overlaying the real product's own header, the same lie as fake browser chrome. **If a frame looks like it has space around its media, that space is the container's** — `cover` crops and can never letterbox. The hero's `tg-hero-frame` panel is a different, deliberate thing; don't port it to card scale.
- **The proof line's two halves are both ink.** It shipped with the invitation in `muted`, and **`link-underline` draws nothing at rest** — it grows from 0% on hover and focus — so the only actionable element on the site's proof band had no rest-state affordance *and* was the lighter half of its own sentence. Hierarchy comes from the size step (`--text-title` claim, `--text-body` link), never from de-emphasising the thing you want clicked.
- **`LiveFrame` posters: 16:10 in every compact context, 16:9 for the hero, real production UI only** — never a simulator, emulator, or demo-mode capture (PLAYBOOK §12). `bun run check:media` guards this on `prebuild`: missing fails, off-ratio warns. Off-ratio isn't cosmetic — `cover` crops it to a fragment that reads as invented content.

### Lead capture
- **The honeypot is `hp_confirm`, never `website`** (a real CRM column — the collision silently dropped leads), and never `.max(0)` (that makes the silent-accept path unreachable and tells bots they were caught).
- **Optional fields are not unvalidated.** Blank is fine; a filled value is checked. Rules live in `lib/validation.ts`, shared by the client and server schemas so they cannot drift. **Test-covered** — `lib/validation.test.ts`, `bun run test` (90 cases across 2 files, ~1.6s), and **wired into `prebuild` on 2026-08-12, so a broken rule fails the build.**
- **The phone typing cap counts digits, never characters.** `capPhoneDigits` caps at 15 **digits** because that is what `isPlausiblePhone` measures; formatting is unlimited. `maxLength={15}` is the same bug as a 10-digit cap — `+44 20 7123 4567` is a valid 13-digit number and 16 characters.
- One shared lead-capture action (`app/actions/contact.ts`), called by both the form and the concierge with a different `source`. Never a second implementation.
- **Submitting the form moves focus to the success element, and that is the announcement mechanism.** A submit unmounts the form, so the focused button goes with it and focus falls to `<body>` — from which the next stop is the first FAQ trigger, far below a message the visitor never sees. `role="status"` is not enough on its own: the region and its content mount in the same commit, and a live region announces *changes* to a region that already existed. So the success block is `tabIndex={-1}` and gets `.focus()`; the scroll into view is a side effect, not the fix.
- **CRM CORS is hard-locked to exactly `https://tekguyz.com`** — no `www`, no subdomain, no preview URL. A domain or hosting change fails closed and silent; flag it before changing either.
- Never add `physical_address` or the `social_*` fields to the contact form — those serve outbound prospecting, not inbound intake.
- The concierge never states or estimates a price, never commits to a timeline, and never prints a raw route path or internal label as visible text.
- Secrets from env vars only, never inlined, never logged. **Never construct a client with a secret at module scope** — `new Resend(undefined)` throws on construction and broke the build. Build must pass with zero secrets present.

### Cascade & reconciliation — the mechanism *is* the rule here
These are invisible to any linter. Nothing below is safe to shorten into a preference.

- **Scroll reveals never ship `opacity:0` in static CSS.** Content is visible by default; `.reveal` alone does nothing, and only `components/reveal.tsx` adds the hidden state, from an effect. `animation-timeline: view()` is wrong — it scrubs with scroll and cannot express "once".
- **The reveal's rise is `translate`, never `transform`.** `.hover-card` owns `transform` for its hover lift; sharing one property means two durations fighting over one value. And a `transition` **shorthand resets every transition property** — `.hover-row`/`.hover-card` sit later in `globals.css` than `.reveal`, so anything carrying both classes needs its transitions declared together in one rule (`.reveal.hover-card`). This silently cancelled entrances while the classes looked correctly wired.
- **Two same-property Tailwind utilities have no winner — only a source order.** `motion-reduce:lg:static` does not beat `lg:sticky`: same property, same (0,1,0) specificity. **No accessibility floor may rest on that.** The `/process` pin is `.tg-pin` in `globals.css` — a real rule in `@media (min-width: 1024px)`, overridden by `position: static !important` below it. To force such a declaration back on and *measure* it, the inline style needs `!important` too, or you measure the unchanged element.
- **A grid placement never ships as an inline `style`.** `.tg-grid` is 12 tracks, 8 below 1024px, 1 below 768px, so every placement needs a per-band value and an inline `style` can only be beaten by `!important`. Both values go on the element as Tailwind arbitrary properties (`[grid-column:1/8] max-lg:[grid-column:1/-1]`). **A 12-column span left to run on the 8-track grid does not error — it creates implicit tracks** and collapses the explicit ones (headlines to 144px). The 8-column spans are tabulated in DESIGN.md §8; derive a new one by scaling 8/12 and keeping §3's gap track. **Measure `grid-template-columns` at 768 and confirm 8 explicit / 0 implicit** rather than trusting the sort. One inline placement survives, `home-hero.tsx` (`1 / 7`), only because it still fits inside 8 tracks; anything ending past line 9 must be converted.
- **An alternating row alternates by `grid-column`, never by DOM order — and the halves are pinned to `grid-row: 1`.** The pin is what makes it possible: with sparse auto-flow the placement cursor never moves backwards, so an item whose column-start sits behind it drops to the next row. Below 768px the grid is one column and **source order is the entire layout**, so alternating by DOM order ships two posters back to back. DOM order is reading order *and* tab order at every width — which is why the fix is never an `order` utility. The ≤767 reset releases `grid-row: auto !important` **in the same block** as `grid-column: 1 / -1 !important`, so the two can never disagree at the fractional widths where `max-width:767px` and `min-width:768px` are both false.
- **`.tg-grid`'s `gap` is unlayered, so no `gap-y-*` utility can ever change it.** The shorthand `gap: 24px` beats a layered `row-gap` from `@layer utilities` regardless of source order — both case-study rows declared `gap-y-12` and it never once applied, invisible to the linter and to anyone reading the JSX. The split gap is `.tg-split` in `globals.css`, unlayered, 48px. **Any value that has to beat an unlayered rule goes in `globals.css` too.**
- **The gap above `closing-cta` is counted once.** A block closing at 128px rhythm, then the 6px stripe, then the CTA's own top padding is two complete gaps stacked across a rule (202px measured). A full-bleed coloured rule is already a boundary. One unlayered declaration, `:where(section, div):has(+ .tg-closing)`, sheds half the rhythm. **All seven routes carrying `closing-cta` end that element at exactly 128px** — the only reason a blanket `padding-bottom` is safe, since it can only reduce. Re-measure if a route's closing block changes shape. Its query is `min-width: 768px`, matching the CTA's Tailwind `md:` — **two declarations that have to agree get the same query, never the complementary one.**
- **The nav `<header>` carries no border of its own.** In Tailwind v4 preflight an unqualified `border-b` resolves to `currentColor` — a permanent ink/white line painted onto the signature stripe. The one specified hairline lives on the absolutely-positioned fill layer so it can fade in with the scrolled state.
- **Every page component returns a single root element, never a bare fragment.** Next scrolls the new segment into view on each client-side transition; a multi-child fragment routes that through `FragmentInstance.scrollIntoView()`, which calls it on *every* top-level child, so the page lands wherever the surviving call left it. Keep the JSON-LD `<script>` inside the wrapper — a zero-box element can't be scrolled to, which is what broke the intended fallback.
- **Branches of a multi-step form need distinct `key`s.** Without them React reconciles the two steps in place and reuses the same uncontrolled `<input>` nodes — step 1's name and email become step 2's phone and website, values included. It looks exactly like browser autofill and isn't.
- **A button's line height rides ON its font-size utility (`text-[14.5px]/[1]`), never on a separate `leading-none`.** `cn()` is tailwind-merge; Tailwind's `text-*` utilities set line-height too, so a *later* font-size class is treated as conflicting and the earlier `leading-*` is **dropped before it reaches the DOM**. `button.tsx` declared `leading-none` for months and shipped a 23.2px line box on a 14.5px button — 8.7px taller than the export, on **every button on the site**, which is what made the nav CTA read as `button-primary--large` while its padding was already the standard 14×24. The same trap fires for any pair of same-group utilities passed through `cn()` from two different strings.
- **The concierge message list anchors the newest message's top, never the bottom of the list.** `scrollHeight` puts the *end* of a long reply on screen and its first line above the fold. Anchoring the top is self-clamping, so short exchanges are unaffected — and it is not `:last-of-type`, which matches per element name while the two message roles render as different elements. This is a scroll fix, never a sizing one: the panel does not grow.
- **The concierge panel is bounded by the viewport, never by content.** `max-height: calc(100dvh - 48px)`, and the message list's 300px floor is `flex: 1 1 300px` + `min-height: 0`, **not** `min-height: 300px` — a hard min-height moves the overflow one layer down, where the list refuses to compress and the panel clips it against its own `overflow: hidden`. If the list outgrows 300px it scrolls; the panel does not grow. Sheet threshold is `(max-height: 560px)` — **the height arm is mandatory and load-bearing; a width arm may be ADDED but never SUBSTITUTED**, because the failing case is a phone held sideways, which is *wider* than 768px. DESIGN.md's `(max-height: 560px)` **OR** `(max-width: 767px)` is the intended form; code still ships the height arm alone (D-04, Phase 2).
- **The launcher yields by opacity and leaves the tab order with it.** `opacity: 0` alone is a hidden-but-focusable control — it also needs `pointer-events: none`, `aria-hidden="true"` and `tabIndex={-1}`, together. Opacity only, no transform: its Motion entrance animated `y` and **ran unsuppressed under `reduce`** (measured, H-4). The transition lives in `.tg-yield` in `globals.css` rather than inline, so the reduced-motion block can beat it.
- **Two yield inputs, and a new one goes on the second channel, never into the first.** The observer's targets are the two `data-primary-cta` elements only — widening that set makes the launcher flicker on any scroll-heavy route. Anything the launcher must also get out of the way of arrives as **app state**: `useSuppressLauncher(active)` in `concierge/concierge-bus.ts`, a counted `Set` behind `useSyncExternalStore`, ANDed with the observer. The drawer and the FAQ accordion feed it. Counted, not boolean — two suppressors overlap, and the last one out is what releases. The split is not stylistic: the flicker risk is *scroll-driven*, and a discrete boolean set by a tap carries none of it. **Never hide the thing the launcher is covering** — the FAQ is `FAQPage` JSON-LD on the conversion route; the floating element is what moves.
- **Tap targets grow by `::before`, never `::after`, and never by resizing.** `.tap-44` / `.tap-24` in `globals.css` are the only two expansions — DESIGN.md §8 is now a description of what ships, not a target. `::after` is taken: `[data-navlink]::after` is the active-page indicator, on exactly the elements the tap policy has to reach. **The expansion has a spacing consequence that is a layout decision, not styling:** two 44px targets stacked less than 44px apart overlap, and the winner is source order, so a tap on `Process` lands on `Work`. That is why the footer link column gap is 22px — 22.4px links at the old 12px gap would have overlapped by 9.6px. Check every adjacency you create.
- **A tap target is verified by hit-testing, never by a rect.** `getBoundingClientRect` cannot see a pseudo overlay, so a rect-based check calls every correctly-fixed target a failure. `scripts/audit-mobile.ts taps` probes with `elementFromPoint`. Two ways that probe falsely reads as a *pass*, both of which happened: it only hit-tests the visible viewport, so elements must be scrolled in first; and an **ancestor** owning the probe point is the tap falling through to the container — counting that as a pass reported 0 failures site-wide.
- **A time-dependent string is rendered absolute on the server and relative only after hydration.** `StatusLine` emits a fixed `at HH:MM UTC` stamp — built from `getUTC*`, never `Intl`/`toLocale*`, since a locale- or timezone-dependent format is the same mismatch one layer down — and takes `relativeTime` on the post-hydration render. Both easy fixes are wrong: deferring to an effect flashes the signature component empty, and `suppressHydrationWarning` hides the message while leaving two trees in place. The hook is `useSyncExternalStore` with constant snapshots — `useState` + `useEffect` is a lint **error** here (`react-hooks/set-state-in-effect`).
- **`RevealController` stays keyed on `usePathname()`.** It mounts once in the root layout, which does not remount on client-side navigation — with `[]` deps, every route reached by clicking a link gets no observer at all.

### Layout & tooling
- **The detail-page meta rail carries Solution line / Status / Live demo, and no button.** `MetaRail` in `app/work/[slug]/page.tsx` is the one implementation, for both tiers. A second ask directly above the `closing-cta` band undercuts it — that band is the documented size exception *because* it's the page's single strongest ask. Separately: `project-card` never carries an image, but a project's own **detail page** does. The rule protects the weight gap between the two card treatments on the index, not a ban on ever showing the screenshot.
- **The `/process` progress rail reads the step elements' own positions**, never a fraction of the section's scrollable range — the two are unrelated, and the readout hit "Step 04 of 04" 457px early. A progress indicator that disagrees with the page is worse than none.
- **Banned motion — and read what this list is actually rejecting.** Parallax, gradient blobs, spinning shapes, marquees, particles, glassmorphism, cursor-followers, magnetic buttons, skeleton shimmer, smooth-scroll libraries. **It rejects one aesthetic: the cyberpunk / hacker-terminal / "dev portfolio" look.** It is *not* a statement that motion is suspect, and it has been misread that way for the life of the project — the site shipped with exactly **one** motion idea (fade in + rise 8px) applied everywhere, `motion` imported in 2 files, and no transitions on hover states, the accordion, the form steps or the status line. The user's words: *"not far away from looking like a regular text file with hyperlinks with 4 colors."* **Adding motion outside this banned list is wanted, not risky.** A real motion system is Phase 1 (`docs/STATUS.md`) — until it lands, this bullet is the only guidance there is, so read it as permission with a boundary rather than a prohibition.
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

## Checking production — the Vercel connector is available, use it

**Hosting and runtime state are measurable, so measure them instead of citing a doc.** `list_projects` / `get_project` give the real project, domains and latest deployment target; `list_deployments` gives what each push actually did.

**Environment variables are deliberately unreadable, and that does not make them unverifiable.** The connector exposes no env-var tool by design — one that could read them is a hop from a key landing in a transcript. But a *missing* secret throws at runtime and **`get_runtime_errors` reads that**, which is how "are the 5 env vars set?" got answered in one read-only call after being written off as human-only work. `get_runtime_logs` with `group_by: statusCode` is the cheap health check. **Ask what observable a thing produces before declaring it unknowable.**

## Verifying visually — read this before claiming you did

- **Windows animations are off** on this machine (`MinAnimate = 0`), so `prefers-reduced-motion: reduce` matches machine-wide. A deliberate standing preference, not a misconfiguration — **don't change it, and don't burn turns emulating around it.** An inert entrance, a static concierge stripe, an IntersectionObserver that never fires: all expected here. **The motion layer is confirmed working** (user, Pixel 9A, 2026-08-07). Verify wiring by computed style and class count, **say which half you proved**, and leave the motion-enabled check to the user.
- **Set the viewport explicitly** — `resize_window` with width/height. The `desktop` preset resets to the pane's own size, which may be under the 1024px `lg` breakpoint and will silently show you the stacked mobile layout.
- **Screenshots fail when the Browser pane is hidden** (`document.hidden === true` → no compositing → 5s timeout). Only pictures fail; computed styles, geometry, class mechanics, `fetch`, console and network reads all keep working. When the pane is displayed they work normally.
- **A stale server can hold a port and serve a previous build** — HTML referencing chunk filenames that no longer exist, returning 500, which mimics catastrophic breakage (no CSS, no hydration, static pin, no reveals). Kill by port, not by process name, and confirm the referenced stylesheet returns 200 before trusting any measurement. Recipe in `docs/archive/HISTORY.md`.

## Working notes
- A decision only exists once it’s in `docs/STATUS.md` or committed code. Chat is one `/clear` from gone.
- Never assume a prior instruction landed — check `git status`, `git diff`, or read the file.
- When an attached file path points into another project, that file is the scope. Don't go exploring the surrounding repo.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
