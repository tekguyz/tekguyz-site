# TEKGUYZ Copy Deck v2

*All site copy + per-route SEO metadata. Written against Brand Playbook v2 voice: expert, direct, jargon-free, results-oriented, approachable — an engineer talking to a business owner, not a marketer talking to a lead. Honors the playbook's length-parity rule: within any set of four (Solutions, Case Studies, Projects), descriptions are matched in length so no entry reads as a visual outlier.*

**Governed by:** TEKGUYZ-REBUILD-CANONICAL.md. **Supersedes:** site-copy-deck.md (v1, currently live).

> **Accuracy note — read before publishing.** Every Challenge/Approach/Outcome below is written from what's documented in the Brand Playbook and the live site. Outcomes are kept qualitative because that's what the source material supports. **No metrics, percentages, timelines, or client names have been invented.** Where a page would benefit from a real number, it's marked `[NEEDS REAL DATA]` — fill it or cut the line. Do not let anything downstream invent a statistic.

---

# GLOBAL

## Navigation

Solutions · Work · Process · Contact
Primary CTA, right-aligned: **Let's Talk**

Mobile: same order, full-screen drawer. Solutions expands to the four `/solutions/[slug]` routes.

## Section eyebrows

WHAT WE DO · OUR WORK · HOW WE WORK · WHAT CLIENTS SAY · COMMON QUESTIONS · GET IN TOUCH

## Solution tags

SMART OPERATIONS · AI VOICE AGENTS · BUSINESS SYSTEMS · CUSTOM WEB APPS

## Live status component

Verified state: `Live · checked {n} minutes ago`
Unreachable state: `Temporarily unreachable · checked {n} minutes ago`
Link label: **Open it in a new tab**
Tooltip / helper: *We check every demo hourly. This is the real status, not a badge.*

## Footer

**Solutions** — Smart Operations / AI Voice Agents / Business Systems / Custom Web Apps
**Company** — Work / Process / Contact / Privacy
**Get In Touch** — hello@tekguyz.com / South Florida / Mon–Fri, 9am–5pm

Tagline under lockup: *We build tech that actually works.*
Social row: LinkedIn / Instagram / Facebook / GitHub — icons only.
Copyright: © [Year] TEKGUYZ. Built by TEKGUYZ.

*(Location now reads "South Florida" — resolves the Pompano Beach drift flagged in the playbook's internal notes.)*

## Error states

**404** — HEADLINE: This page doesn't exist. BODY: The link might be old, or it might be a typo. Head back to the homepage, or see our work. CTA: Back to Home

**Error boundary** — HEADLINE: Something broke on our end. BODY: Not yours — ours. Refresh, and if it keeps happening, tell us at hello@tekguyz.com. CTA: Refresh Page

---

# HOME `/`

## Hero

HEADLINE: We build tech that actually works for your business.
SUBHEAD: Most businesses don't need more software. They need the right system, built correctly, by people who actually understand how they work. That's what we do.
CTA PRIMARY: See Our Work → /work
CTA SECONDARY: Let's Talk → /contact
MEDIA: static `sarah-poster.webp` (1600×900, 16:9). Live-status chip attached. The `sarah-demo.mp4` loop is retired for launch — it still shows the withdrawn phone simulator (CANONICAL §1).

## Proof line

Eight live builds. Open any of them right now.

## Solutions

EYEBROW: WHAT WE DO
HEADLINE: What We Do
DESCRIPTION: Four ways we help operational businesses run smarter.

- **Smart Operations** (blue) — Your business makes data and tasks every hour. We build systems that handle them automatically. → /solutions/smart-operations
- **AI Voice Agents** (violet) — Your phones don't stop ringing because your doors are closed. We answer them. → /solutions/ai-voice-agents
- **Business Systems** (amber) — Everything your clients and team need, in one private place instead of five. → /solutions/business-systems
- **Custom Web Apps** (teal) — If you can describe the workflow, we can build the tool that runs it. → /solutions/custom-web-apps

## Featured Work

EYEBROW: OUR WORK
HEADLINE: Two we're proud of.
DESCRIPTION: Both are running right now. Open either one and use it yourself.

*(Field Photo Reports, then AI Voice Receptionist. Full set on /work.)*

## Testimonial

EYEBROW: WHAT CLIENTS SAY

> TEKGUYZ integrated our 3CX phones with Twilio and Zoho CRM to fully automate our text surveys and protect our customer experience. They also built a custom internal tool that tracks our team's offline project work perfectly without micro-management. Exceptional execution.

ATTRIBUTION: **Joe M.** · Verified Google review
LINK: Read it on Google → *(GBP listing)*
CONTEXT LINE: This is the work he's describing → /work/team-performance

## Process teaser

EYEBROW: HOW WE WORK
HEADLINE: How We Work
DESCRIPTION: Four steps. No surprises. No disappearing acts.
Discovery — Learn your business first. · Blueprint — Map it out before we build. · Build — Regular check-ins, not silence. · Launch & Support — We don't disappear after go-live.
CTA: See our full process → /process

## Closing CTA

HEADLINE: Let's talk about your business.
SUBHEAD: Tell us what you're working with and what you're trying to fix. We'll take it from there.
TRUST LINE: Free first conversation · A flat quote before anything starts · We reply within one business day
CTA: Let's Talk → /contact
SECONDARY LINK (small, beneath the button, opens the concierge — not a second button): Or ask our AI what we'd build for you

*(No proof line here — it duplicated the homepage proof strip and was cut in DESIGN.md v2.4.)*

## Metadata

TITLE: `TEKGUYZ | Smart Operations & AI Systems`
DESCRIPTION: `We build tech that actually works for your business. Smart operations, AI voice agents, and custom web apps designed for measurable impact.`
OG: same title/description, `og:type=website`

---

# SOLUTIONS INDEX `/solutions`

*Reversed from an anchor-linked single page — see CANONICAL.md. Same index-plus-detail pattern as `/work`: this page is the light overview, each solution below is its own route with its own metadata.*

EYEBROW: WHAT WE DO
HEADLINE: Four ways we help.
DESCRIPTION: Most businesses come to us with a bottleneck, not a spec. These are the four shapes that bottleneck usually takes.

Four rows: dot, title, one-line hook, arrow → `/solutions/[slug]`. Feature bullets live only on the detail pages now, not here.

- **Smart Operations** (blue) — Your business makes data and tasks every hour. We build systems that handle them automatically.
- **AI Voice Agents** (violet) — Your phones don't stop ringing because your doors are closed. We answer them.
- **Business Systems** (amber) — Everything your clients and team need, in one private place instead of five.
- **Custom Web Apps** (teal) — If you can describe the workflow, we can build the tool that runs it.

## Metadata

TITLE: `TEKGUYZ | Solutions — Smart Ops, Voice AI, Systems, Web Apps`
DESCRIPTION: `Custom AI assistants, voice agents, business systems, and web apps — four ways TEKGUYZ helps operational businesses run smarter. See live builds for each.`

---

# SOLUTION DETAIL PAGES `/solutions/[slug]` ×4

*Shared structure: solution tag · headline · full description · feature bullets · related work with pull-quote · CTA.*

## `/solutions/smart-operations` — Smart Operations — Blue

HEADLINE: Your business generates new data and tasks every hour.

Files that need sorting, questions that need answering, information that needs to move from one place to another. Most of it gets done by a person doing it manually, one at a time, because that's how it's always been done.

We build systems that handle the heavy lifting automatically — so the work still gets done, just without someone doing it by hand.

- Custom AI assistants trained on your business
- Automated data sorting and file organization
- Task and workflow automation across your tools
- Real-time operational alerts when something needs you

RELATED WORK: AI Audio & File Insights, Automated Meeting & Research Organizer
CTA: Talk about automating this → /contact?interest=smart-operations

METADATA — TITLE: `TEKGUYZ | Smart Operations — Custom AI Assistants & Automation`
DESCRIPTION: `Custom AI assistants, automated data sorting, and workflow automation that handle the repetitive work your business generates every hour.`

## `/solutions/ai-voice-agents` — AI Voice Agents — Violet

HEADLINE: Your phones don't stop ringing just because your doors are closed.

Every call that goes to voicemail after hours is a lead deciding whether to wait for you or call the next name on the list. Most of them don't wait.

We build AI voice agents that answer every call like your best employee would — capturing job details, scheduling consultations, and syncing everything to your systems in real time, day or night.

- Real-time conversational voice AI
- Automatic lead capture and qualification
- Live appointment scheduling
- Instant CRM and follow-up sync

RELATED WORK: AI Voice Receptionist & Live Demo
CTA: Hear one in action → /work/ai-voice-receptionist

METADATA — TITLE: `TEKGUYZ | AI Voice Agents — Answer Every Call, Day or Night`
DESCRIPTION: `Real-time AI voice agents that capture leads, book consultations, and sync your CRM automatically — after hours or during. See a live one in action.`

## `/solutions/business-systems` — Business Systems — Amber

HEADLINE: Spreadsheets, email threads, and five different tools for one job.

It works until it doesn't — usually the moment someone needs to find something and nobody's sure which version is current.

We move you into one organized, private system where your clients and team log in, share documents, track projects, and see exactly where things stand. Invoicing included. Nothing scattered.

- Secure client and team logins
- Private document portals
- Automated invoicing
- Integrations across the tools you already use

RELATED WORK: Field Photo Reports & Quality Tracking, Team Performance & Automated Customer Feedback
CTA: Talk about consolidating this → /contact?interest=business-systems

METADATA — TITLE: `TEKGUYZ | Business Systems — One Private System, Not Five Tools`
DESCRIPTION: `Client and team logins, document portals, and automated invoicing in one organized system — replacing the spreadsheets and email threads.`

## `/solutions/custom-web-apps` — Custom Web Apps — Teal

HEADLINE: Sometimes a website isn't enough — you need something that does something.

A tool your team opens every morning, or one your customers use to order, book, or track.

We build those. Ordering systems, headless e-commerce, scheduling portals, client dashboards. If you can describe the workflow out loud, we can build the thing that runs it.

- Online ordering and cart systems
- Headless e-commerce integrations
- Appointment and scheduling portals
- Client-facing dashboards

RELATED WORK: Bundle Builder, Bilingual Restaurant Menu, Auto Detailer Booking
CTA: Describe what you need built → /contact?interest=custom-web-apps

METADATA — TITLE: `TEKGUYZ | Custom Web Apps — Ordering, Booking, and Dashboards`
DESCRIPTION: `Ordering systems, headless e-commerce, scheduling portals, and client dashboards — custom web apps built around the workflow you describe.`

---

# WORK INDEX `/work`

EYEBROW: OUR WORK
HEADLINE: Everything here is running right now.
DESCRIPTION: Not screenshots of things that used to work. Eight live builds — click into any one and open it yourself.

**Case Studies** *(4, full-width)* — the deep-dive builds.
**Projects** *(4, compact grid)* — lighter builds, same standard.

## Metadata

TITLE: `TEKGUYZ | Our Work — Live, Working Software`
DESCRIPTION: `Every project here is real, running software you can open and try yourself — not a screenshot. Case studies and builds across AI, automation, and web apps.`

---

# CASE STUDY DETAIL PAGES

*Shared structure: solution tag · headline · Challenge / Approach / Outcome · pull quote · LiveFrame + status · "How it's built" (plain language) · prev/next.*

---

## `/work/field-photo-reports` — Field Photo Reports & Quality Tracking

TAG: Business Systems
HEADLINE: Capture instant photo proof from the field to guarantee job quality.

**THE CHALLENGE**
Project managers couldn't verify field work without driving to the site. Crew notes came back too messy to share with a client, so any dispute about what was actually done turned into someone's word against someone else's — and usually a return trip to find out.

**THE APPROACH**
We built a photo-capture system that installers use on their phones in the field. Photos feed straight into structured digital reports, tied to the job and timestamped, so the record exists before anyone leaves the site. Admins see everything from the office in real time.

**THE OUTCOME**
Fewer return trips, faster dispute resolution, and clients who trust what they're seeing because they can see it. `[NEEDS REAL DATA — add one concrete number here if you have it]`

**PULL QUOTE**
Fewer return trips, faster dispute resolution, and clients who trust what they're seeing.

**TRY IT**
The demo has a switcher at the top — toggle between the Admin view and two different Installer accounts to see both sides of the same job.

**HOW IT'S BUILT**
Mobile-first capture with a desktop admin view, structured job records, and role-based access so installers see their work and admins see all of it.

METADATA — TITLE: `TEKGUYZ | Field Photo Reports & Quality Tracking`
DESCRIPTION: `A live field-photo capture system that replaces site visits with instant, shareable reports. Try the real Admin and Installer views yourself.`

---

## `/work/ai-voice-receptionist` — AI Voice Receptionist & Live Demo

TAG: AI Voice Agents
HEADLINE: Answer every after-hours call like your best employee would, live, in real time.

**THE CHALLENGE**
A stone fabrication shop was losing leads to after-hours calls. The voicemail box was a dead end — callers with a real project either waited until morning or called someone else, and there was no way to know how many did which.

**THE APPROACH**
We built a real-time AI voice agent that answers, holds an actual conversation, captures the project details, and books the consultation on the spot. Alongside it, a live dashboard shows the call transcript, the CRM sync, and the follow-up email firing as it happens.

**THE OUTCOME**
Calls that used to end in voicemail now end in a booked consultation and a record in the CRM — with nothing left for anyone to type up in the morning.

**PULL QUOTE**
Watch the call, the CRM sync, and the follow-up email happen in real time — not after the fact.

**TRY IT**
Start a call in the demo and watch the dashboard on the same screen. Everything you see happening is happening.

**HOW IT'S BUILT**
Real-time conversational voice AI with live transcription, structured lead extraction, calendar booking, and CRM write-through — all in one pass, no post-processing.

METADATA — TITLE: `TEKGUYZ | AI Voice Receptionist — Live Demo`
DESCRIPTION: `A real-time AI voice agent that answers calls, books consultations, and syncs your CRM automatically. Watch it happen live, or call it yourself.`

---

## `/work/bundle-builder` — Bundle Builder

TAG: Custom Web Apps
HEADLINE: A custom storefront built directly on Shopify's API for bundled products.

**THE CHALLENGE**
The retailer's existing theme couldn't handle configurable, bundled products. Customers assembling a workstation from hardware, software, and accessories had no clean way to see the total update as they chose options — so they guessed, or they left.

**THE APPROACH**
We built a custom storefront directly on Shopify's API rather than fighting the theme. Options update the running total instantly, and checkout hands off to Shopify's own secure flow — so nothing about payments or order management had to be rebuilt or re-secured.

**THE OUTCOME**
Customers can see exactly what they're building and what it costs while they build it, and the merchant keeps every piece of Shopify's existing order infrastructure.

**PULL QUOTE**
Watch the total update instantly as the order comes together — then check out for real, risk-free.

**TRY IT**
The demo is fully sandboxed. Check out for real using `1` as the card number and any other test details.

**HOW IT'S BUILT**
Headless storefront on Shopify's API with live price computation, handing off to Shopify Checkout for payment and fulfillment.

METADATA — TITLE: `TEKGUYZ | Bundle Builder — Custom Shopify Storefront`
DESCRIPTION: `A configurable product storefront built directly on Shopify's API. Build a bundle, watch the total update instantly, then check out for real in the live demo.`

---

## `/work/ai-audio-file-insights` — AI Audio & File Insights

TAG: Smart Operations
HEADLINE: Turn your files and recordings into automatic summaries and a searchable archive.

**THE CHALLENGE**
Consultants and ops teams were losing details buried in audio recordings and documents. The information existed — it just wasn't findable, so the same questions got re-asked and the same recordings got re-listened to.

**THE APPROACH**
We built a workspace that listens to your files, pulls out what matters, and organizes it automatically into summaries, action trackers, and an archive you can actually search.

**THE OUTCOME**
Details that used to be effectively lost the moment a recording ended are now findable in seconds by anyone on the team.

**PULL QUOTE**
Never lose track of a small but important detail buried in a long recording, ever again.

**TRY IT**
There's a demo button at the bottom of the sign-in page — no account needed.

**HOW IT'S BUILT**
Audio and document ingestion, automatic transcription and extraction, structured summaries and action items, full-text search across everything.

METADATA — TITLE: `TEKGUYZ | AI Audio & File Insights`
DESCRIPTION: `A digital workspace that turns recordings and documents into automatic summaries and a searchable archive. Try it — no account required.`

---

# PROJECT DETAIL PAGES

*Lighter structure by design: tag · headline · Built For · what it does · what made it interesting · LiveFrame + status.*

## `/work/team-performance` — Team Performance & Automated Customer Feedback

TAG: Business Systems
BUILT FOR: Service businesses with phone-based teams and customer follow-up surveys
HEADLINE: Phone logs that credit the right person, and surveys that know when to stop.

Connects desk-phone logs directly to the CRM so team members get automatic credit for the jobs they actually handled — no manual entry, no micro-management. Paired with a smart-limit SMS feedback loop that only surveys a customer when it's genuinely useful, instead of every single time.

**WHAT MADE IT INTERESTING:** the survey limiter. Most feedback tools send on every trigger, which trains customers to ignore them. Capping it protects the response rate and the customer relationship at the same time.

**CLIENT REVIEW:** *(the verified Google review — this is the build Joe M. is describing)*

METADATA — TITLE: `TEKGUYZ | Team Performance & Automated Feedback`
DESCRIPTION: `Desk-phone logs connected straight to the CRM, plus a smart-limit SMS feedback loop that only surveys customers when it actually matters.`

---

## `/work/meeting-organizer` — Automated Meeting & Research Organizer

TAG: Smart Operations
BUILT FOR: Professionals and teams who record meetings and need organized follow-up
HEADLINE: Record the meeting, get the follow-up automatically.

A secure recording tool that pulls out takeaways and action items on its own, then files everything into a clean, searchable archive — so the notes exist whether or not anyone remembered to take them.

**WHAT MADE IT INTERESTING:** the archive matters more than the transcript. Anyone can transcribe a meeting; the value is being able to find the one thing that was said three weeks ago.

**TRY IT:** Sign up with your email to use it.

METADATA — TITLE: `TEKGUYZ | Automated Meeting & Research Organizer`
DESCRIPTION: `A secure recording tool that extracts takeaways and action items automatically, filed into a searchable archive you'll actually use later.`

---

## `/work/restaurant-menu` — Bilingual Restaurant Menu & WhatsApp Ordering

TAG: Custom Web Apps
BUILT FOR: Local restaurants, food vendors, bilingual markets
HEADLINE: A photo menu customers order from directly in WhatsApp.

A bilingual ordering platform where customers browse a photo-rich menu and send their order straight through WhatsApp — no app to download, no account to make. Cart management, order notes, and instant confirmation keep it simple on both sides of the counter.

**WHAT MADE IT INTERESTING:** meeting customers where they already are. For a bilingual market, WhatsApp isn't a workaround — it's the primary channel, and building for it removed every step between hungry and ordered.

METADATA — TITLE: `TEKGUYZ | Bilingual Restaurant Menu & WhatsApp Ordering`
DESCRIPTION: `A photo-rich, bilingual ordering platform that takes real orders over WhatsApp — no app, no download, no account needed.`

---

## `/work/auto-detailer` — Auto Detailer Booking & Lead Tracker

TAG: Custom Web Apps
BUILT FOR: Premium vehicle detailing shops, mobile auto services
HEADLINE: Booking, lead tracking, and the gallery that closes the sale.

A booking platform for premium detailing with responsive request forms and built-in lead tracking, so an inquiry doesn't die in an inbox. Automated scheduling, a custom gallery, and review tools built to earn the second appointment, not just the first.

**WHAT MADE IT INTERESTING:** for premium detailing, the gallery *is* the pitch. Treating it as a first-class part of the booking flow rather than a separate page changed what the site was for.

METADATA — TITLE: `TEKGUYZ | Auto Detailer Booking & Lead Tracker`
DESCRIPTION: `A booking platform for premium vehicle detailing with automated scheduling, lead tracking, and review tools built to earn repeat business.`

---

# PROCESS `/process`

EYEBROW: HOW WE WORK
HEADLINE: How We Work
DESCRIPTION: Four steps. No surprises. No disappearing acts.

**01 — Discovery.** We start by learning your business: your workflow, your pain points, and what success actually looks like for you. No templates. No assumptions. Most of this step is us asking questions and listening.

**02 — Blueprint.** Before any building starts, we map out exactly what we're creating and why. You'll know what you're getting, what it costs, and how long it takes — in plain language, not a spec document you need someone to translate.

**03 — Build.** You get regular check-ins throughout the build, not radio silence. We work fast, but we don't cut corners. You'll see it working before it's done.

**04 — Launch & Support.** We don't disappear after go-live. We make sure everything works the way it's supposed to, and we're here when questions come up — because they will.

CTA: Ready to start? → /contact

METADATA — TITLE: `TEKGUYZ | How We Work`
DESCRIPTION: `Four steps, no surprises: Discovery, Blueprint, Build, and Launch & Support. See exactly how a TEKGUYZ project actually runs.`

---

# CONTACT `/contact`

EYEBROW: GET IN TOUCH
HEADLINE: Let's talk about your business.
DESCRIPTION: Tell us what you're working with and what you're trying to fix. We'll take it from there.

TRUST LINES: Free first conversation · A flat quote before anything starts · We reply within one business day

DIRECT: hello@tekguyz.com · Mon–Fri, 9:00 AM–5:00 PM · South Florida, remote nationwide

## Form — two steps

**Step 1 — What do you need?**
- Area of Interest (required) — Smart Operations / AI Voice Agents / Business Systems / Custom Web Apps / Something else / Not sure yet
  *(pre-selected when arriving from a solution CTA, shown selected, not hidden)*
- Name (required) — placeholder: Your name
- Email (required) — placeholder: you@company.com
- Button: **Continue**

**Step 2 — Tell us more.**
- Company (optional) — placeholder: Company name
- Phone (optional) — placeholder: (xxx) xxx-xxxx — a second way to reach you, in case email's slow on your end
- Website (optional) — placeholder: yoursite.com
- Project details (required) — conditional placeholder by interest:
  - Smart Operations: *What's getting done by hand right now that shouldn't be?*
  - AI Voice Agents: *Roughly how many calls are you missing after hours?*
  - Business Systems: *What are you using instead right now — spreadsheets, email, something else?*
  - Custom Web Apps: *Describe the workflow you want a tool for.*
  - Default: *Tell us what you're trying to fix or build.*
- Estimated budget (optional) — Under $5k / $5k–$15k / $15k–$50k / $50k+ / Not sure yet
- Button: **Send Inquiry** · Back link: **Back**
- Reassurance under button: We reply within one business day.

SUCCESS: Message sent — thank you for taking the time to walk us through this. A real person reads every submission; expect a reply within one business day.

*(Rendered as the existing two-part success state: "Message sent" as the bolded status line beside the success dot, the remainder as the body paragraph beneath it. The em dash is that split.)*
ERROR: Something didn't go through. Try again, or email us directly at hello@tekguyz.com.

*(Honeypot + minimum-fill-time retained, both invisible. Delivers to contact@tekguyz.com and the CRM triage endpoint via the shared action.)*

## Concierge microcopy

LAUNCHER: Ask about your project
OPENER: Tell me what's slowing your business down and I'll tell you what we'd build for it. I can also pass your details straight to the team.
INPUT PLACEHOLDER: Describe what you're dealing with…
DISCLAIMER: This is a starting sketch, not a quote — pricing always comes from a real conversation.
SUGGESTION CHIPS (empty state, three, disappear after first message):
  · We're missing after-hours calls
  · Everything lives in spreadsheets
  · I'm not sure what I need
CAPTURED: Done — your details are in. Expect a reply within one business day.
CAP REACHED: We've covered a lot — the fastest next step is the contact form, or email hello@tekguyz.com. Either way you'll hear back within one business day.
RATE LIMITED (429, existed in code, was never in this deck): Too many messages at once — give it a minute, or email hello@tekguyz.com.
ERROR: Something broke on our end — not yours. Try again in a moment, or email hello@tekguyz.com.

METADATA — TITLE: `TEKGUYZ | Let's Talk About Your Business`
DESCRIPTION: `Tell us what you're working with and what you're trying to fix. Free conversation, flat quote, no surprises — we reply within one business day.`

---

# FAQ

*Placement: bottom of /contact. Emits FAQPage schema.*

EYEBROW: COMMON QUESTIONS

**What does a project cost?**
It depends on what you need, and we won't pretend otherwise. What we will do is tell you before you commit to anything: every project starts with a free conversation, you get a flat quote once we both understand the scope, and nothing begins until you've seen that number and agreed to it. No retainers you didn't ask for.

**How long does a project take?**
Also scope-dependent — but you'll have a real timeline in the Blueprint step, before any building starts. If something changes mid-build, you hear it from us when it happens, not at the end.

**Do you work with businesses outside South Florida?**
Yes. We're based in South Florida and deliver remotely nationwide. Most of our work happens over video calls and shared systems regardless of where the client is.

**Can you work with the systems we already have?**
Usually, yes — that's most of what we do. Integrating with the tools you already pay for is almost always cheaper and less disruptive than replacing them. If something genuinely needs replacing, we'll tell you why.

**What happens after launch?**
We make sure everything works the way it's supposed to and stay available when questions come up. We don't hand over a login and disappear.

**Are the demos on this site real?**
Every one. They're live applications, not screenshots — we check their status hourly and show you the result. Open any of them and use it yourself.

---

# CONFIRMATION EMAIL (new — currently missing entirely)

*Sent to the person who submitted, from both the contact form and the concierge. Today only the internal inbox gets notified and the submitter hears nothing until a human replies — a gap worth closing on a site whose Process page promises "no disappearing acts."*

FROM: TEKGUYZ <hello@tekguyz.com>
SUBJECT: We got your message — TEKGUYZ

BODY:
Thanks for reaching out. Your message is in, and you'll hear back from us within one business day.

Here's what you sent us:
[Area of interest] · [their message, quoted back]

If you need to add anything, just reply to this email — it comes straight to us.

— TEKGUYZ
hello@tekguyz.com · Mon–Fri, 9am–5pm · South Florida

*(Plain text or minimal HTML. No marketing footer, no unsubscribe block — this is a transactional reply to a message they just sent, not a newsletter.)*

---

# PAGE: Privacy `/privacy`

*Ships as currently live at tekguyz.com/privacy — reproduced here so the rebuild has a source and doesn't invent one. Update the LAST UPDATED date if anything changes. Still needs real legal review before being treated as final.*

EYEBROW: LEGAL
HEADLINE: Privacy Policy
LAST UPDATED: July 13, 2026

TEKGUYZ ("we," "us") respects your privacy. This page explains what information we collect through this website, why, and how you can reach us about it.

**Information We Collect** — If you use our contact form, we collect the name, email address, company (optional), area of interest, estimated budget (optional), and project details you provide. We use this only to respond to your inquiry — we don't sell it, rent it, or share it with third parties for marketing purposes.

**Website Analytics** — This site uses Vercel Web Analytics to understand aggregate traffic patterns. It does not use cookies and does not collect personal identifiers — visitors are identified only by a temporary hash that Vercel automatically discards within 24 hours. We cannot use this data to identify you individually.

**Third-Party Services** — We use Resend to deliver contact form submissions to our inbox, and Vercel to host this site and run the anonymized analytics described above. Neither service receives more information than described here.

**Data Retention** — We keep contact form submissions only as long as needed to respond to your inquiry and for reasonable business record-keeping afterward.

**Your Rights** — You can ask us to tell you what information we have about you, or to delete it, at any time — email hello@tekguyz.com.

**Children's Privacy** — This site is not directed at children under 13, and we do not knowingly collect information from them.

**Changes to This Policy** — We may update this policy from time to time. The date at the top reflects the most recent revision.

**Contact** — Questions about this policy: hello@tekguyz.com

METADATA — TITLE: `TEKGUYZ | Privacy Policy`
DESCRIPTION: `What information TEKGUYZ collects through this website, why, and how to reach us about it.`

> **Three additions this policy does NOT yet cover and must, before launch** — the rebuild introduces data flows the current text predates:
> 1. **The AI concierge.** Conversations are sent to Google (Gemini 3.6 Flash) for processing, and details shared there may be captured as a lead exactly like a form submission. Both facts need stating.
> 2. **The CRM.** Submissions are forwarded to TEKGUYZ's own CRM system, not only to an inbox.
> 3. **Phone number**, now an optional form field, isn't in the "Information We Collect" list.

---

# METADATA RULES (apply to every route)

> **Full per-route JSON-LD schemas — `Review`, `Service`, `SoftwareApplication`, `FAQPage`, `ItemList`, `BreadcrumbList` — live in `docs/SEO.md`.** Titles and descriptions are here; structured data is there. Both ship. Title pattern is `TEKGUYZ | [Page]` everywhere, matching Home's live pattern — never the reverse.

- Every route exports full `openGraph` and `twitter` objects, mirroring Home's live pattern: `og:title`, `og:description`, `og:url`, `og:site_name="TEKGUYZ"`, `og:locale="en_US"`, `og:type="website"`, `og:image` via the dynamic OG route, `twitter:card="summary_large_image"`. **No route ships title/description only.**
- `metadataBase` set once in root layout as `new URL('https://tekguyz.com')`. Pages never resolve image URLs independently.
- Titles under 60 characters, descriptions under 155.
- Every non-home route emits `BreadcrumbList` JSON-LD (Home → [Page], or Home → Work → [Build]) through one shared helper — never hand-repeated.
- `/work/[slug]` generates its own OG image with the build name, solution line, and that line's accent color.
- Additional JSON-LD: `Service` per solution line, `Review` for the testimonial, `FAQPage` for the FAQ, `SoftwareApplication` per build.

---

# WRITING GAPS STILL OPEN

1. `[NEEDS REAL DATA]` on the Field Photo Reports outcome — one concrete number would strengthen the strongest case study on the site.
2. GBP review permalink for the testimonial attribution link.
3. Confirm the Field Photo Reports demo still exposes the admin/installer switcher as described, and that the Bundle Builder sandbox still accepts `1` as the test card — both are stated as fact in copy and would be embarrassing if stale.
