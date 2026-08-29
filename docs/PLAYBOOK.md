# TEKGUYZ — Brand Playbook

> **Updated during the 2026 website rebuild.** Sections 11, 12, 13 and the Internal Notes carry real changes — testimonial attribution, the media inventory (new ratios, capture method, the no-simulator rule), the resolved icon direction, and the resolved footer-location drift.
>
> **Scope of this document:** brand strategy, voice, business facts, and positioning. It is the highest authority on *what TEKGUYZ is and how it sounds*. For the website rebuild specifically, three documents sit below it and are more specific: `CANONICAL.md` (architecture and decisions), `DESIGN.md` (visual and motion spec), `COPY.md` (exact site copy). Where this playbook describes the visual system in general terms and DESIGN.md gives an exact value, DESIGN.md wins.

*v2 — updated July 20, 2026. Supersedes the prior version. Copy this wholesale into the Google Doc to replace it.*

**Related files:** TEKGUYZ-Business-DNA.md (Pomelli-ready fields, derived from this doc), TEKGUYZ-Site-Copy-Deck.md (actual live website copy — the ground truth for anything nav/page/component-level), TEKGUYZ-Section13-Asset-Generation-Brief.md (social/GBP asset prompts, in progress).

## 1. What TEKGUYZ Is

TEKGUYZ is a small, technical team that builds custom software systems, AI assistants, and automated workflows to solve real operational problems for businesses.

**Tagline:** "We engineer the business systems, automated workflows, and custom software that serious operational businesses run on."

**One-liner:** We build tech that actually works.

**Core belief:** Most businesses don't need more software. They need the right system, built correctly, by people who understand how they actually work.

## 2. Brand Differentiator: Live, Working Proof

Most software portfolios show screenshots of things that may or may not still work. TEKGUYZ's don't — every featured project is a real, running application a prospect can open and use themselves, right now, in demo mode, often with specific instructions for how to interact with it (a test card number, a demo login, a role-switcher). This is the single hardest thing for a competitor to fake, and it should be said plainly wherever the opportunity comes up — in sales conversations, on LinkedIn, on Google Business Profile, on the site itself.

**How to talk about it:** plainly, never as jargon. "Try it yourself" beats "live demo environment." "This is the actual product" beats "production-parity staging instance."

## 3. Visual Identity — "Monochrome & Ink"

> **For the website, `DESIGN.md` (v2.6) is the operative spec** — exact hex values (several corrected by a measured WCAG contrast audit), the full type scale, component definitions, and the motion contract. This section remains the plain-language description of the direction; DESIGN.md is the implementation authority.

A near-monochrome system — white canvas, black ink — built to feel confidently engineered rather than decorated. Color is reserved for wayfinding: one accent per Solution line, used on tags, dots, and badges, never on a button.

| **Token** | **Value** | **Use** |
| --- | --- | --- |
| Ink | #111111 | Primary CTAs, headlines, primary text (light mode) |
| Canvas | #FFFFFF | Page background (light mode) |
| Surface Card | #F5F5F5 | Feature and project cards |
| Hairline | #E5E7EB | 1px borders |

**Wayfinding accents** (tags, dots, and badges only — one per Solution line):

| Color | Value | Line |
| --- | --- | --- |
| Blue | #3B6FE0 | Smart Operations |
| Violet | #7C6FE0 | AI Voice Agents |
| Amber | #F2A93C | Business Systems |
| Teal | #2FA679 | Custom Web Apps |

**Typography:** Geist for display headlines, Inter for body and UI text.

**Dark mode:** the site supports a manual light/dark toggle (light is the default for every new visitor). Buttons and the primary CTA band invert between modes.

**Signature stripe:** a thin four-segment bar, one stripe per accent color, appears in exactly three places on every page — top of hero, above the closing CTA band, bottom of footer. Never anywhere else.

**Live-demo signature:** ~~a pulsing "LIVE — TRY IT YOURSELF" badge~~ **— replaced, and the replacement is the whole idea.** A measured status line: the server issues a real HEAD request per demo on an hourly revalidate and renders what actually came back — `Live · checked at 14:20 UTC`, or `Temporarily unreachable` with the link still available. Plus a real preview of the actual product on every case study. **Confirmed 2026-08-28: the badge string appears nowhere in the repo**, and `components/status-line.tsx` describes itself as replacing it. See CANONICAL §3 for the argument and DESIGN.md §5 for the treatment.

**Explicitly avoided:** cyberpunk or terminal aesthetics, a fifth accent color, any accent color on a button, engineering jargon in visible copy, generic template patterns.

## 4. Voice & Tone

Expert, direct, jargon-free, results-oriented, approachable. Write like an engineer talking to a business owner, not a marketer talking to a lead. Concrete over abstract.

**Core values to write from:** operational efficiency, direct-to-builder transparency, practicality, reliable partnership, technological innovation, proof over claims.

**Avoid:** generic SaaS language, vague AI-hype phrasing, feature lists without a stated outcome, engineering-internals language in anything client-facing.

**Copy consistency rule:** within any set of parallel items (the 4 Solutions, the 4 Case Studies, the 4 Projects), keep description/headline lengths roughly matched to each other. An outlier that's dramatically shorter or longer than its siblings reads as a visual bug even when the copy itself is fine — check character counts, not just tone, when adding or editing an entry in a set of four.

## 5. Solutions

### Smart Operations

Custom AI assistants, automated data sorting, task and workflow automation, real-time operational alerts.

Pitch: your business generates data and tasks every hour — this handles the heavy lifting automatically.

### AI Voice Agents

Real-time conversational AI agents that answer calls, capture leads, and schedule work — around the clock, without a human on the line.

Pitch: your phones don't stop ringing just because your doors are closed.

### Business Systems

Secure client and team logins, private document portals, automated invoicing, integrations across existing tools.

Pitch: move off spreadsheets and email threads into one organized, private system.

### Custom Web Apps

Ordering and cart systems, headless e-commerce, scheduling and booking portals, client-facing dashboards.

Pitch: if you can describe the workflow, we can build it.

## 6. Case Studies (the deep-dive four)

**Field Photo Reports & Quality Tracking** (Business Systems) Project managers couldn't verify field work without driving to the site, and crew notes were too messy to share. We built a photo-capture system that feeds straight into digital reports — no site visit required. Result: fewer return trips, faster dispute resolution, and clients who trust what they're seeing. Link: rs-field-ops.netlify.app

**AI Voice Receptionist & Call Booking** (AI Voice Agents) A stone fabrication shop was losing leads to after-hours calls and a dead-end voicemail box. We built a real-time AI voice agent that captures project details and books consultations on the spot, while a live dashboard shows the call, the CRM sync, and the follow-up email happening as it happens. Result: watch the call, the CRM sync, and the follow-up email happen in real time — not after the fact. Link: tekguyz-sarah.vercel.app

**Shopify Bundle Builder & Storefront** (Custom Web Apps) A retailer's existing theme couldn't handle configurable, bundled products — customers building a workstation from hardware, software, and accessories had no clean way to watch the total update as they chose options. We built a custom storefront directly on Shopify's API that updates instantly and checks out through Shopify's own secure flow. Result: watch the total update instantly as the order comes together — then check out for real, risk-free (the demo is fully sandboxed). Link: reporter-resource-temp.vercel.app

**AI Audio & File Insights** (Smart Operations) Consultants and ops teams were losing track of small but important details buried in audio recordings and documents. We built a digital workspace that listens to your files, extracts what matters, and organizes it into automatic summaries, action trackers, and a searchable archive. Result: never lose track of a small but important detail buried in a long recording, ever again. Link: crunch-wrap.netlify.app

## 7. Projects (the lighter four)

| **Project** | **Solution Line** | **Built For** | **Link** |
| --- | --- | --- | --- |
| Team Performance & Automated Customer Feedback | Business Systems | Service businesses with phone-based teams and customer follow-up surveys | advantage-teams.vercel.app/dashboard |
| Automated Meeting & Research Organizer | Smart Operations | Professionals and teams who record meetings and need organized follow-up | crispy-bacon.netlify.app |
| Bilingual Restaurant Menu & WhatsApp Ordering | Custom Web Apps | Restaurants, food vendors, bilingual markets | dragonfly-nica.netlify.app |
| Auto Detailer Booking & Lead Tracker | Custom Web Apps | Premium vehicle detailing shops, mobile auto services | the-executivedetailer.vercel.app |

**Team Performance & Automated Customer Feedback** Connects desk-phone logs directly to the CRM for automatic job credit, plus a smart-limit SMS feedback loop that only surveys customers when it's actually useful.

**Automated Meeting & Research Organizer** A secure recording tool that extracts takeaways and action items automatically, filing everything into a clean, searchable archive you can actually find things in later.

**Bilingual Restaurant Menu & WhatsApp Ordering** A bilingual ordering platform that lets customers browse a photo-rich menu and order directly via WhatsApp — no app required.

**Auto Detailer Booking & Lead Tracker** A booking platform for premium vehicle detailing with responsive request forms, built-in lead tracking, automated scheduling, a custom gallery, and review tools.

## 8. Process (How We Work)

1. **Discovery** — learn the actual workflow and pain points. No templates, no assumptions.
2. **Blueprint** — map exactly what's being built, why, what it costs, and how long it takes, in plain language.
3. **Build** — regular check-ins throughout, not radio silence.
4. **Launch & Support** — we don't disappear after go-live.

## 9. Business Facts

- **Location:** South Florida — exact address not published. GBP is configured as a Service Area Business: no storefront address shown, service area covers South Florida plus broader remote delivery nationwide.
- **Delivery model:** Remote and cloud-based — not a home-service or on-site business
- **Hours:** Monday–Friday, 9:00 AM–5:00 PM — confirmed live and consistent across GBP, LinkedIn, and Facebook as of July 2026.
- **Phone:** Not yet published. Add here once a business line is set up.
- **Public contact email:** [hello@tekguyz.com](mailto:hello@tekguyz.com) — shown to visitors, used in all outbound/public-facing material.
- **Form delivery address:** [contact@tekguyz.com](mailto:contact@tekguyz.com) — internal inbox the website contact form actually delivers to.
- **Website:** tekguyz.com
- **LinkedIn:** linkedin.com/company/tekguyz
- **Facebook:** facebook.com/profile.php?id=61590634780166
- **Instagram:** instagram.com/tekguyz
- **GitHub:** github.com/tekguyz
- **Google Business Profile:** share.google/7N09GDWh3d0R1UhEY
- **Call-to-Action Links (Pomelli Business DNA):**
  - Business Email → hello@tekguyz.com
  - Appointment URL / Order ahead URL / Reservation URL / Shop online URL → not applicable (that field set is built for restaurant/local-service businesses)
  - Custom URL → defaulting to https://tekguyz.com/ — replace with a specific contact/demo page if one exists

## 10. SEO / High-Intent Keywords

Workflow Automation, Custom AI Assistants, AI Voice Agents, Business Systems, Client Portals, Software Engineering, Operational Efficiency, Custom CRM, Process Automation, Secure Dashboards, Headless E-Commerce, Live Product Demos.

Currently entered in Pomelli's Business Details → Keywords field. Also the basis for the JSON-LD service list (Section 14, Priority 7).

## 11. Verified Testimonial

*"TEKGUYZ integrated our 3CX phones with Twilio and Zoho CRM to fully automate our text surveys and protect our customer experience. They also built a custom internal tool that tracks our team's offline project work perfectly without micro-management. Exceptional execution."*

**Attribution:** Joe M. · Verified Google review. No company name — he chose to stay anonymous on that. Attribute to the *source* ("Verified Google review," linked to the GBP listing) rather than leaning on the first name; third-party verifiability carries more weight than a partial name would.

**This is a review of a specific build.** The 3CX/Twilio/Zoho integration and the offline-work tracker he describes are the **Team Performance & Automated Customer Feedback** project. It therefore appears twice on the rebuilt site: on the homepage after Featured Work, and cross-linked from that project's own detail page. Marked up as `Review` schema (see docs/SEO.md) — no `reviewRating`, since no numeric score exists.

**Resolved 2026-08-10:** `https://www.google.com/maps?cid=13204262572880001655`. Google has no durable per-review permalink, so the profile URL is the stable substitute, by decision. See COPY.md.

## 12. Media Asset Inventory

Every case study and project has a real screenshot of the running production application — the Live, Working Proof pillar, fully realized. **Hard rule, learned the hard way during the rebuild: never a sandboxed device emulator, simulator, or "demo mode" illustration standing in for the real UI.** An early rebuild pass used a phone-call simulator screen for the AI Voice Receptionist; it was a widget *inside* the real product, not the product, and it quietly undercut the entire brand thesis until it was caught and replaced.

**Two ratios, by context** (see DESIGN.md `LiveFrame`):
- **Hero: 16:9** — matches standard screen-capture dimensions, so captures drop in with no crop and no gap.
- **Everything else (case-study rows, detail pages, project cards): 16:10.**

Current set, all `.webp`:

- `sarah-poster.webp` — AI Voice Receptionist, **hero (16:9) only.** Real desktop dashboard: customer profile, live conversation feed, confirmation email. 1600×900. Also the poster for the future video loop, which is why it keeps the `-poster` name rather than being folded into the `-thumb` convention.
- `sarah-thumb.webp` — AI Voice Receptionist, **compact 16:10 contexts** (case-study row, detail page). **Decided 2026-08-07 and wired; the file itself is pending the recapture.** It replaces `sarah-project-thumb.webp`, which was never documented here and was a crop of the retired phone-call simulator — a violation of this section's own hard rule, not merely a naming gap. `bun run check:media` fails the build until the file lands, which is the guard working as intended.
- `field-ops-thumb.webp` — Field Photo Reports. The one app with both an admin and installer/mobile view; the desktop admin view is the primary capture.
- `shopify-configurator.webp` — Bundle Builder
- `crunch-wrap-dashboard.webp` — AI Audio & File Insights
- `advantage-teams-thumb.webp` — Team Performance
- `meeting-organizer-thumb.webp` — Automated Meeting & Research Organizer
- `dragonfly-nica-thumb.webp` — Bilingual Restaurant Menu
- `executive-detailer-thumb.webp` — Auto Detailer

**All four project thumbs are now rendered**, not just wired: `/work/[slug]` project pages carry a `LiveFrame` as of 2026-08-07. They were previously referenced in `content/work.ts` and displayed nowhere, since `project-card` has no image by design and the project detail page had none either. Measured at capture time they are 600×450 (4:3), so `object-fit: cover` currently drops the bottom ~17% of each — the recapture at 1440×900 resolves it with no code change.

**Capture method** (this took several failed attempts to get right — use it): OS screenshot tool, not DevTools. Mac `Cmd+Shift+4`, Windows `Win+Shift+S`. ShareX's "Fixed size region mode" with width/height set is ideal if you have it. Arrange multiple cards in the browser first (resize the window, use real browser zoom) so they sit together cleanly, *then* capture — you compose the shot visually rather than asking software to do it. Edit in PNG (lossless), convert to `.webp` at ~quality 90 as the final step only.

**Hero video:** none. `sarah-demo.mp4` showed the retired phone-call simulator and was **deleted 2026-08-28** rather than left on disk where it could be picked up by mistake. The site runs on the static hero image; a video loop (plus matching poster), if it ever happens, starts from a fresh capture.

The earlier cobalt-era asset set was never reconciled against Monochrome & Ink and isn't in use. Relevant only to social/GBP profile assets (Section 13).

## 13. Social & Profile Media

**Icon direction — RESOLVED.** Neither Bracket Mark nor Single-Stroke T Monogram. The canonical mark is **Connected Nodes**: four accent circles (top blue, right violet, bottom amber, left teal) in a diamond arrangement, joined by hairline connectors that theme-swap, no container. Masters exist and are authoritative:

- `icon-master.svg` — the mark alone
- `lockup-master.svg` — mark + wordmark

**One production issue on the lockup:** its wordmark is a live `<text>` element, so it renders wrong anywhere Geist isn't installed. Convert to outlined paths for the true master before using it in any exported asset.

**Every instance of the mark is that same file** — never a redrawn approximation. (A simplified 2×2 dot grid appeared in an AI concierge mockup during the rebuild; it was wrong and was corrected.)

Favicons and the manifest icon set are **generated from `icon-master.svg` at build time**, not sourced from an external favicon generator — that keeps them matching the current mark automatically.

Still open: profile pictures and cover banners per platform, generated against Connected Nodes. The asset generation brief (TEKGUYZ-Section13-Asset-Generation-Brief.md) still holds the platform dimensions and copy; its icon-direction section is now superseded by the above.

Site-wide, social links (LinkedIn, Instagram, Facebook, GitHub) appear in the footer on every page — **as icons**, single consistent stroke weight, monochrome, never brand-colored.

## 14. Google Business Profile — Optimization Priorities

Full ready-to-paste copy (Description, Services, Posts, Q&A) lives in TEKGUYZ-LinkedIn-GBP-Copy.md. Strategic priorities:

1. Fix NAP consistency — **Resolved.** Hours confirmed Mon–Fri 9AM–5PM and consistent across GBP, LinkedIn, and Facebook. Location standardized to "South Florida" everywhere (no exact address published). Service-area model confirmed intentional (see Internal Notes).
2. ~~**Complete the Services section** — still pending.~~ **Resolved** — live in GBP, confirmed by measurement 2026-08-12 (STATUS.md). Maps directly to the 4 Solutions. If Pomelli's Keywords field still shows empty, that's isolated to the Section 10 keyword-list entry now, not this item.
3. **Post weekly, minimum** — profiles that post consistently get pulled into Google's AI Overviews; ones that don't, don't. The 8 live demos are a built-in content calendar most competitors can't match.
4. **Seed the Q&A section** before random visitors answer it inaccurately.
5. **Enable GBP messaging** — response time is now a measured ranking factor.
6. **Photos** — refresh every 2–4 weeks once the current Monochrome & Ink asset set is ready (Section 13); not a one-time upload.
7. Technical SEO — **Resolved July 2026.** Title-duplication bug fixed and confirmed live (verified directly on tekguyz.com). robots.ts, sitemap.ts, canonical URLs on all 5 pages, and JSON-LD ProfessionalService schema all shipped as specified. Two minor, non-blocking items left on the table if ever worth a pass: the root layout's fallback description string is now dead code (every page defines its own, so it's never actually served) — harmless, just noise; and sitemap.ts stamps every route's lastModified with request-time new Date() rather than real content dates, which is valid but a weaker freshness signal to Google than it could be (the Privacy page already displays a real "Last Updated" date on-page that could be reused there).

