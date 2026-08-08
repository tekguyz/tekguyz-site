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
- **Optional fields are not unvalidated.** Blank is fine; a filled value is checked. Rules live in `lib/validation.ts`, shared by the client and server schemas so they cannot drift. **They are now test-covered** — `lib/validation.test.ts`, 46 Vitest cases, `bun run test`. Change a rule, run the suite. (It is deliberately *not* wired into `prebuild`.)
- **The phone typing cap counts digits, never characters.** `capPhoneDigits` caps at 15 **digits** because that is what `isPlausiblePhone` measures; formatting is unlimited. A plain `maxLength={15}` is the same bug as a 10-digit cap one breakpoint over — `+44 20 7123 4567` is a valid 13-digit number and 16 characters, and a character cap severs it mid-entry.
- **The `flourish-mark` ships on every route**, once per page, not home-only. DESIGN.md said "home only" until 2026-08-07 and the doc was the wrong half — the export shows it on every route's first section. The *once per page* rule is the absolute one: the closing-CTA echo replays the load-sequence timing and gets no second set of dots.
- **The four wayfinding accents are never decorative bullets.** They mean *solution line*. `/contact`'s trust facts carried three of them as leading dots and now match `closing-cta` exactly: one muted line, 3px `muted-soft` mid-dots, no colour. Both places render the same three facts and must keep rendering them the same way.
- **The favicon set is dark** (`#101010` plate, `#4B5563` connectors) and generated on `prebuild` from `icon-master.svg`, which is itself **unchanged** — nothing else reads that file, since the nav lockup and footer render the mark as JSX and OG images build their own. `app/icon.svg` carries the plate too; a transparent SVG next to a dark `.ico` meant the tab icon differed by browser.
- One shared lead-capture action (`app/actions/contact.ts`), called by both the form and the concierge with a different `source`. Never a second implementation.
- **CRM CORS is hard-locked to exactly `https://tekguyz.com`** — no `www`, no subdomain, no preview URL. A domain or hosting change fails closed and silent; flag it before changing either.
- Never add `physical_address` or the `social_*` fields to the contact form — those serve outbound prospecting, not inbound intake.
- The concierge never states or estimates a price, never commits to a timeline, and never prints a raw route path or internal label as visible text.
- Secrets from env vars only, never inlined, never logged. **Never construct a client with a secret at module scope** — `new Resend(undefined)` throws on construction and broke the build. Build must pass with zero secrets present.
- The four-color moving treatment appears in exactly one place: the concierge's thinking state.
- Banned motion: parallax, gradient blobs, spinning shapes, marquees, particles, glassmorphism, cursor-followers, magnetic buttons, skeleton shimmer, smooth-scroll libraries.
- **Scroll reveals never ship `opacity:0` in static CSS.** Content is visible by default; `.reveal` alone does nothing, and only `components/reveal.tsx` adds the hidden state, from an effect. `animation-timeline: view()` is wrong here — it scrubs with scroll and cannot express "once".
- **The reveal's rise is `translate`, never `transform`.** `.hover-card` owns `transform` for its hover lift; sharing one property meant two durations fighting over one value. Related and easy to miss: a `transition` **shorthand resets every transition property**, and `.hover-row`/`.hover-card` sit later in `globals.css` than `.reveal` — so anything carrying both classes needs its transitions declared together in one rule (`.reveal.hover-card`, etc.). This silently cancelled the entrance on `solution-row` and `project-card` while the classes looked correctly wired.
- **`RevealController` stays keyed on `usePathname()`.** It mounts once in the root layout, and the root layout does not remount on a client-side navigation — with `[]` deps it ran once per hard load and every route reached by clicking a link got no observer at all.
- **`bun run lint` works now — keep it working.** `eslint.config.mjs` imports `eslint-config-next`'s **native flat config** directly; it is not FlatCompat-loadable (that path throws `Converting circular structure to JSON`). Note what it cannot buy you: an unqualified `border-b` resolving to `currentColor` and a `transition` shorthand resetting a longhand are CSS cascade semantics, invisible to any JS/JSX linter. These rules remain the only thing catching those.
- **Every page component returns a single root element, never a bare fragment.** Next scrolls the new segment into view on each client-side transition; a multi-child fragment routes that through `FragmentInstance.scrollIntoView()`, which calls `scrollIntoView()` on *every* top-level child, so the page lands wherever the surviving call left it. `/contact` landed on its FAQ this way. Keep the JSON-LD `<script>` inside the wrapper — a zero-box element can't be scrolled to, which is what broke the intended fallback.
- **Branches of a multi-step form need distinct `key`s.** Without them React reconciles the two steps in place and the same uncontrolled `<input>` nodes are reused — step 1's name and email literally became step 2's phone and website, values included. It looks exactly like browser autofill and isn't.
- **The detail-page meta rail carries Solution line / Status / Live demo, and no button.** Both tiers get it — `MetaRail` in `app/work/[slug]/page.tsx` is the one implementation. It used to end with its own `Let's Talk`, which put a second ask directly above the `closing-cta` band; that band is the documented size exception *because* it's meant to be the page's single strongest ask. Related: `project-card` still never carries an image, but the project's own **detail page** does. The weight distinction that rule protects is between the two card treatments on the index, not a ban on a project ever showing its screenshot.
- **Two same-property Tailwind utilities don't have a winner — they have a source order.** `motion-reduce:lg:static` does not beat `lg:sticky`: both set `position`, both are specificity (0,1,0), and which one applied was decided by their order in the generated stylesheet. Nothing in an accessibility floor may rest on that. The `/process` pin is `.tg-pin` in `globals.css` — a real rule in `@media (min-width: 1024px)`, overridden by `position: static !important` in the reduced-motion block below it. When forcing such a declaration back on to *measure* it, the inline style needs `!important` too, or you measure the unchanged element.
- **The `/process` progress rail reads the step elements' own positions**, never a fraction of the section's scrollable range. Those two are unrelated — measured at 1280×720 the range was 714px while the steps spanned 1434px, so the readout hit "Step 04 of 04" 457px before step 04 began. A progress indicator that disagrees with the page is worse than none, and this one only exists because `/process` is a genuine sequence.
- **The nav `<header>` carries no border of its own** — the one specified hairline lives on the absolutely-positioned fill layer so it can fade in with the scrolled state. In Tailwind v4 preflight an unqualified `border-b` resolves to `currentColor`, which painted a permanent ink/white line straight onto the signature stripe.
- **`LiveFrame` posters: 16:10 in every compact context, 16:9 for the hero, real production UI only** — never a simulator, emulator, or demo-mode capture (PLAYBOOK §12's hard rule). `bun run check:media` guards the wiring and runs on `prebuild`; a missing file fails the build, an off-ratio one warns. An off-ratio source is not cosmetic: `cover` crops it to a fragment that reads as invented content.

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

## Verifying visually — read this before claiming you did
Two environmental facts on this machine, both confirmed, neither of them a bug in the site. Discovering them costs a lot of time; don't rediscover them.

- **Windows animations are off** (`HKCU\Control Panel\Desktop\WindowMetrics\MinAnimate = 0`), so `prefers-reduced-motion: reduce` matches machine-wide. This is a deliberate standing preference on an older machine, not a misconfiguration. Every entrance is correctly inert and hover looks fine because a state change still applies, just instantly. That combination *is* the signature of the preference being on — it is not evidence the motion code is broken. **Don't change this setting, and don't spend turns trying to emulate around it.** Verifying motion-enabled behavior is the user's job on a machine with animations on; verify the wiring by computed style and class count, say which half you proved, and move on. A concierge thinking-stripe that renders static, an entrance that doesn't animate, an IntersectionObserver that never fires — all expected here. **The motion layer is confirmed working** (user, Pixel 9A, 2026-08-07: the concierge shimmer runs and the hero's entrance sequence is visible on load), so treat a missing animation on this machine as the preference, never as a bug to chase.
- **The in-app Browser pane is often hidden** (`document.hidden === true`), and a hidden pane never composites, so **screenshots time out after 5s**. Everything else keeps working, including client-side route transitions — so measurement is unaffected and only pictures fail. When the pane *is* displayed, screenshots work normally; the user can also open a tab themselves, which `tabs_context` will list. Set the viewport explicitly (`resize_window` with width/height — the `desktop` preset resets to the pane's own size, which may be under the 1024px `lg` breakpoint and will show you the stacked mobile layout instead).
- **A stale `next start` can hold port 3210 and serve a previous build**, with HTML referencing chunk filenames that no longer exist on disk. Those return **500**, so the page loads with zero CSS rules and no hydration — which mimics catastrophic breakage exactly (static pin, 0% progress, no reveals, no padding). `pkill`/`Stop-Process` by name does not reliably clear them. Kill by port and confirm the referenced stylesheet returns 200 before trusting anything you measure:
  ```
  (Get-NetTCPConnection -LocalPort 3210 -State Listen).OwningProcess | % { taskkill /PID $_ /T /F }
  ```
- **Playwright works, but only under `node --experimental-strip-types`, never under Bun.** Bun's stdio handling breaks Playwright's `--remote-debugging-pipe` on Windows and `launch()` hangs for its full 180s timeout with the browser process visibly spawned. The script must sit inside the project directory to resolve `playwright`.

What still works without compositing: computed styles, class mechanics, geometry, `fetch` of server-rendered HTML, console and network reads. Measure with those and **say which half you proved** — the reduced-motion path is fully verifiable here, the motion-enabled path is not.

## Working notes
- A decision only exists once it's in `docs/PROGRESS.md` or committed code. Chat is one `/clear` from gone.
- Never assume a prior instruction landed — check `git status`, `git diff`, or read the file.
- When an attached file path points into another project, that file is the scope. Don't go exploring the surrounding repo.
