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
| **`GEMINI_API_KEY` not set** | `.env.local` carries `CRM_TRIAGE_ENDPOINT` and `RESEND_API_KEY` but no Gemini key; a leftover `ANTHROPIC_API_KEY` is now dead code after the provider swap | Before the concierge can answer anything in production. Add the key, drop the Anthropic one |
| **No KV/Upstash credentials** | `lib/rate-limit.ts` falls back to a per-instance in-memory bucket and logs a warning; that resets on cold start and is not real protection | Before production traffic. Set `KV_REST_API_URL` / `KV_REST_API_TOKEN` |
| Contact + concierge never exercised end to end | No CRM/Resend/Gemini calls were made during the build — nothing was sent to a real inbox or endpoint | First manual test after keys are set. Expect the CRM's AI Spam Shield to skip the notification email for obviously synthetic test submissions — that's correct behaviour, not a bug |
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
