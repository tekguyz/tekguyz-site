# TEKGUYZ Website — Progress & Known Gaps

*Becomes `/docs/PROGRESS.md`. Updated at the end of each build session, not read in full at the start of a small one — see CLAUDE.md's scoped-reading rule. This is where "what's already done" lives, so a new session (or a `/clear`) doesn't have to re-derive it from chat memory.*

---

## Phase status

Mapped to the TEKGUYZ Engineering workspace's Phase 1/2/3 framework:

- **Phase 1 (Discovery) & Phase 2 (Blueprint):** complete. `CANONICAL.md` is the PRD and technical roadmap — unusually thorough, which is why Phase 3 looks different from the framework's default.
- **Phase 3 (Prompt execution):** in progress.

**Why this isn't a 6–12 prompt pack:** the default range assumes a Phase-2 blueprint that leaves real gaps for each prompt to resolve. This one doesn't — five documents (CANONICAL, DESIGN, COPY, SEO, PLAYBOOK) resolved hundreds of decisions before any prompt ran. That let the master prompt absorb work (Gemini swap, rate limiter, full SEO, confirmation email) that would normally be separate steps. Realistic remaining count: **3–4 follow-ups**, not the full range — the framework adapting to unusually complete blueprinting, not a deviation from it.

## Prompt history

| # | Prompt | Status | Notes |
| --- | --- | --- | --- |
| 1 | Master build prompt | **Complete** (2026-08-05) | Full site built from an empty repo. All 18 routes, every component in DESIGN.md §4, `content/work.ts` + `content/solutions.ts` + `config/solutions.ts`, contact action (honeypot renamed, phone/website added, confirmation email), concierge ported to Gemini 3.6 Flash, shared durable rate limiter, full SEO + JSON-LD + per-route OG images, generated favicon set, dark mode. `bun run build` clean, 18/18 routes prerendered. |
| 2 | Design-export audit + live integration verification | **Complete** (2026-08-06) | Full route-by-route rebuild against the approved `TEKGUYZ Site.dc.html` / `TEKGUYZ Components.dc.html` export, which is now the visual ground truth. Every integration exercised for real against live credentials. Playwright added as the screenshot/verification driver. |

## Prompt 2 — what changed, and why

**The design export is now ground truth.** DESIGN.md's prose is a translation of it; where they disagreed, the export won. The rebuild touched nearly every component.

### The eight confirmed items, all fixed and measured in the live DOM

| # | Item | Measured result |
| --- | --- | --- |
| 1 | Nav CTA | `padding: 14px 24px`, `border-radius: 8px`, 14.5px — the only button size in the nav |
| 2 | Closing CTA | Subhead and trust row are separate elements; trust row is `flex-wrap: wrap` with 3px dot separators; button measures `18px 32px` at 16px |
| 3 | Footer bottom bar | Copyright only — 0 links in the bar, exactly 1 Privacy link site-wide (Company column) |
| 4 | Concierge FAB | `padding: 16px 24px`, `border-radius: 8px`, fixed 24/24 — same radius as every other button, not a pill |
| 5 | Thinking indicator | 72px x 3px, 4-column grid, 4 segments, inline beside the word "Thinking" |
| 6 | Image frames | Native `aspect-ratio: 16 / 10`, `overflow: hidden`, `padding-top: 0px` (no padding hack), `object-fit: cover`, `object-position: 50% 0%` |
| 7 | "How it's built" | 4 instances on `/work`, 1 on each standalone detail page |
| 8 | Theme toggle | 38x38, 6px radius, 1px border, 18x18 SVG, `stroke-width: 1.75`, export's exact moon/sun paths |

### Found in the audit, beyond that list

- **Honeypot was broken.** `hp_confirm` was declared `z.string().max(0)`, so a filled honeypot failed schema parsing and returned "Invalid fields" — the silent-accept branch underneath was unreachable dead code, and a bot got a clear signal it had been caught. Fixed on both client and server; verified a filled honeypot now shows success while dispatching nothing.
- **Scroll reveals removed.** `animation-timeline: view()` is a *scrubbed* timeline, so scrolling back up ran it in reverse and content that had appeared vanished again — the specified `once` semantics are not expressible with it. With `opacity: 0` resting state it also rendered half the homepage blank in any non-scrolling context. The export carries no section reveals at all, only the closing-CTA echo (Motion, real `once`). That is what ships.
- Hero media is a **surface-filled panel** bleeding `calc(-1 * max(0px, (100vw - 1216px) / 2) - 10vw)` past the right edge with `border-radius: 16px 0 0 16px` — not a bare image.
- Solution tags are **bordered pills** (`1px rgba(accent,.35)` over `rgba(accent,.12)`), not bare tints.
- Nav is 76px with an animated `::after` underline (scaleX, 240ms); scrolled state is 82% opacity + 14px blur.
- Inner-page headlines are at **hero** scale, not display scale.
- Flourish dots appear on **every** route's first section, at 9px with a 9px gap.
- Testimonial rebuilt as an ink card with real quotation marks — deliberately not the pull-quote treatment.
- FAQ rebuilt as hairline rows with one-open-at-a-time, replacing `<details>`.
- Concierge replies now render **markdown** (bold, lists, links, inline code, rules). The live model reliably emits all of these and they were showing as raw syntax. Link hrefs are restricted to http(s)/mailto//.
- `/contact` correctly carries **2** signature stripes, not 3 — the export has no closing CTA there, since the page itself is the ask.

### Live integration verification (real credentials, real dispatches)

- **Contact form, real submission through the real UI**: CRM accepted `200`; Resend notification `id=a6753c52-0f29-4fb1-82ca-aa72f8fddcf1`; confirmation `id=38270e96-7bb4-4e60-895a-186ba9c150d3`.
- **Honeypot**: success state shown, zero dispatch log lines — nothing sent.
- **Concierge lead capture**: ran through the *same* shared action with `source="AI Concierge"` (CRM `200`, Resend `id=b6414b05-0ef1-45b6-a195-054acf3fd604`), confirming the single-implementation rule.
- **Gemini 3.6 Flash**: real blueprint-shaped replies, no price, no timeline.
- **Upstash limiter is genuinely in use** — no fallback warning, limit trips at exactly the 12th request, and Upstash holds the limiter's own keys (`tg:concierge:*`).

### Deliberate deviations from the export, for the record

1. **Typography.** The export loads Geist + Inter. CANONICAL §2 dropped Inter in favour of Geist-only plus Geist Mono, a decision made *after* the export, and Mono-on-tags was explicitly confirmed. Geist + Geist Mono ships. **Overrule this if the export's pairing is what you actually want.**
2. **`/solutions` routing.** The export renders one long page with four inline sections; CANONICAL §4 reversed that to an index plus four routes because a `#fragment` is not a separate URL to a search engine. Routing follows CANONICAL; the export's section treatment is applied to the four detail pages.
3. **Project detail pages keep an "Open it in a new tab" link.** The export shows only a status line there, but that would leave four of eight builds with no way to open the demo from their own page, against the entire brand thesis.
4. **Project card copy** uses COPY.md's `summary` verbatim; the export shows a shortened variant, and copy is authored in COPY.md.

*(Claude Code: append a row here each time a new prompt completes, with a one-line summary of what it covered.)*

## What the master build actually shipped

- **Routes (18):** `/`, `/solutions`, `/solutions/[slug]` ×4, `/work`, `/work/[slug]` ×8, `/process`, `/contact`, `/privacy`, plus `not-found`, `error`, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, and 15 `opengraph-image` routes.
- **Verified at build time:** hero headline measures 72px wrapping to exactly 3 lines with the CTA row in the first viewport; hero media 16:9 `cover` bleeding past the right viewport edge with no horizontal page scroll; compact `LiveFrame`s all 16:10; exactly 3 signature stripes on every one of the 18 routes; the four-colour moving treatment present in exactly one place (the concierge's thinking state); primary button inverts to `#F5F5F5`/`#101010` in dark mode; `muted` → `muted-dark` swaps `#6A717E` → `#747C8B`; OG eyebrows use the `-text` variants (amber measured at 5.92:1, not the plain accent's 2.00:1).
- **Reduced motion verified live** (the build machine has the preference set): every entrance inert, status dot static at 0.85 with `animation: none`, zero elements left hidden.
- **No hydration warnings** in a production build.

### Decisions taken during the build, for the record

1. **Doc conflicts resolved by authority order.** CANONICAL §4's ASCII IA block still describes the withdrawn single anchored `/solutions` page; the prose below it reverses that, and SEO.md agrees — built as index + 4 detail routes. COPY.md's home solution links still point at `/solutions#anchor` and its nav note still says "four anchor links"; both now resolve to `/solutions/[slug]`. COPY.md and CANONICAL §4 both still describe the hero as the `sarah-demo.mp4` loop; CANONICAL §1 explicitly resolves that to a static image, so the hero ships `sarah-poster.webp` and the mp4 is untouched. **These four should be corrected in the docs.**
2. **`flourish-mark` vs the closing-CTA echo.** DESIGN.md's `closing-cta` entry describes the echo as "flourish dots → headline → subhead → button", but the Do list says "one flourish-mark per page, home only". The absolute rule wins: the closing CTA replays the sequence's *timing* and does not render a second set of dots.
3. **`[NEEDS REAL DATA]`** on the Field Photo Reports outcome is never rendered. The sentence ships as COPY.md's own qualitative wording, extended with "with no site visit required to confirm any of it" — language taken verbatim from PLAYBOOK §6 for that build, not invented. **Worth a copy review.**
4. **Geist Mono confirmed for tag labels** (DESIGN.md §2's optional third use), alongside the two locked uses.
5. **`updatedAt` is assumed**, not sourced — all 8 entries set to `2026-08-05`, the date the narratives were authored into COPY.md. Static routes keep request-time `lastModified` as the documented lesser fallback.
6. **Testimonial "Read it on Google"** points at the GBP listing from PLAYBOOK §9, since the direct review permalink is still open.

## Known Gaps

*Deferred deliberately, not forgotten. Each needs a stated trigger for when it gets revisited.*

| Gap | Why deferred | Revisit when |
| --- | --- | --- |
| Hero video loop (`sarah-demo.mp4`) | Static image ships first; video is a post-launch enhancement | A new recording of the real dashboard exists |
| Live iframe embeds (`embeddable` flags) | Needs `frame-ancestors` CSP added per demo app first | Ready to do the CSP work — one prompt per app, then flip flags |
| Compact-context image ratios (4:3/near-square, cropping hard in 16:10 frames) | User's own call — will recapture before deploy | Before deploy, not before this build |
| Cal.com scheduling | Current funnel problem is lead follow-up, not booking friction — adding a second conversion path before measuring the first risks splitting the data | A few weeks of real inbound data suggests booking friction is real |
| Privacy policy — concierge data flow, CRM forwarding, phone field not yet disclosed | Legal document, needs real review, not invented text | Legal review happens |
| Terms of Service | No checkout/account system to need one; the one place it'd matter (concierge liability) needs a lawyer's line, not mine | If launch reveals an actual need |
| GBP Services section | Not a website task | Anytime — highest-leverage open SEO item, do in parallel |
| ~~`GEMINI_API_KEY` not set~~ | **Resolved 2026-08-06.** Key present; real replies verified | — |
| ~~No KV/Upstash credentials~~ | **Resolved 2026-08-06.** `UPSTASH_REDIS_REST_URL` / `_TOKEN` present; limiter verified against real Upstash keys | — |
| ~~Contact + concierge never exercised end to end~~ | **Resolved 2026-08-06.** Real submissions landed in the CRM and Resend, with message IDs recorded above | — |
| Privacy policy — concierge data flow, CRM forwarding, phone field **still undisclosed** | Legal document, needs real review, not invented text. Flagged for a second time | Legal review. This is the last content blocker before launch |
| `[NEEDS REAL DATA]` — Field Photo Reports outcome | Never filled, per the hard rule | If a real, verifiable number exists |
| GBP review permalink | Still open; testimonial links to the GBP listing instead | When the direct review URL is available |
| `lockup-master.svg` wordmark still a `<text>` element | Pre-existing; the site renders the lockup as JSX so it's unaffected, but exported assets are | Before handing the SVG to any external vendor |

## Deliberate non-features

*So nobody "fixes" these later by accident — each was a considered decision, not an oversight.*

- No pricing page — every CTA routes to a conversation instead.
- No toast notification system — form and concierge already have dedicated inline success/error states; a toast layer would be a second, competing feedback mechanism.
- No modals or popups anywhere — the concierge is a persistent panel, not a takeover; no cookie banner (the site doesn't use cookies); no newsletter popup.
- `project-card` never gets an image — the size/weight gap from `case-study-row` is intentional signal.
- The four-color moving treatment appears in exactly one place: the concierge's thinking state.
