# TEKGUYZ Copy Deck v2

*All site copy + per-route SEO metadata. Written against Brand Playbook v2 voice: expert, direct, jargon-free, results-oriented, approachable — an engineer talking to a business owner, not a marketer talking to a lead. Honors the playbook's length-parity rule: within any set of four (Solutions, Case Studies, Projects), descriptions are matched in length so no entry reads as a visual outlier.*

**Governed by:** TEKGUYZ-REBUILD-CANONICAL.md. **Supersedes:** site-copy-deck.md (v1, currently live).

> **Accuracy note — read before publishing.** Every Challenge/Approach/Outcome below is written from what's documented in the Brand Playbook and the live site. Outcomes are kept qualitative because that's what the source material supports. **No metrics, percentages, timelines, or client names have been invented.** Where a page would benefit from a real number, it's marked `[NEEDS REAL DATA]` — fill it or cut the line. Do not let anything downstream invent a statistic.

---

## Casing — Title Case for buttons, sentence case for conversation

*Documented 2026-08-09 (Prompt 11). **This records what already ships; it changes
no string.** It exists so a later consistency pass does not "normalise" the
launcher to Title Case and quietly flatten the distinction.*

**Title Case — navigational and committing CTAs.** The user is about to go
somewhere or hand something over: `Let's Talk`, `See Our Work`, `Continue`,
`Send Inquiry`, `Back`. These read as buttons because they are buttons.

**Sentence case — conversational and inline affordances.** The user is about to
read, look, or ask, in place: `Read the full story →`,
`Talk about automating this →`, `Or ask our AI what we'd build for you`, and
**the concierge launcher (`Ask about your project`) explicitly**. The launcher is
the case that looks like an inconsistency and is not: it opens a conversation
*in place* rather than committing to a navigation, and it sits beside Title Case
buttons on purpose — the casing is the signal that it costs less.

The test when adding a string: does clicking it commit the user to something
(a route, a submission)? Title Case. Does it start or continue a conversation
they can abandon in one click? Sentence case.

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
First paint (server HTML, before the page hydrates): `Live · checked at {HH:MM} UTC`. The stamp swaps to `{n} minutes ago` once the page loads. Both are real; the clock time is deliberate, because a relative stamp differs between prerender and hydration (#418). Measured on https://tekguyz.com 2026-10-01.
Compact variant (homepage build cards): `Live · {n} minutes ago` and `Unreachable`. No word "checked", and no stamp on the unreachable state.
Link label: **Open it in a new tab**
Tooltip / helper: none. The line "We check every demo hourly" was removed 2026-10-01; the check runs every 5 minutes, and the status line is the proof.

## Footer

**Solutions** — Smart Operations / AI Voice Agents / Business Systems / Custom Web Apps
**Work** — Field Photo Reports / AI Meeting Notes / Lead & Pipeline CRM / Private Meetup App *(added 2026-10-01; each links to its `/work/<slug>` page, in this order)*
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

HEADLINE (four lines, one phrase each): Missed calls. / Messy paperwork. / Too many tools. / We fix it.
SUBHEAD: Tell us which one costs you the most. We reply within one business day.
CTA PRIMARY: Let's Talk → /contact
CTA SECONDARY: See Our Work → /work

*(Changed 2026-10-06, #40. The founder picked this headline from three options. The old headline, "We build the systems your business runs on.", described TEKGUYZ and not the owner's problem; the playbook marks it the old message. The buttons swapped because the site's one job is that an owner makes contact. "We reply within one business day" is the promise already on `/contact`.)*
MEDIA: `field-reports-hero.webp` (1040×585, 16:9) with a phone capture and a 4.5 s loop over it. Live-status chip attached, for Field Photo Reports. Changed 2026-10-02 (#20); see CANONICAL §1. The old `sarah-demo.mp4` showed the withdrawn phone simulator and was deleted 2026-08-28.

## The fold — build board caption

**[changed 2026-08-29]** The elevated three-fact proof strip is deleted. Its
"Eight live builds" claim is not written anywhere any more — the board below the
hero *is* the live builds, one per solution line, with a measured status on
each, and `See all six builds` is the link directly beneath them. *(2026-09-29,
#13 pass 2: four cards again — Private Meetup App holds the teal slot.)* The other two facts are now one muted
caption line beside that link, in the site's standard trust-fact pattern (one
`--text-sm` secondary row, 3px `muted-soft` mid-dots, stacked below 766px).

LINK: See all six builds — the label is derived from `work.length` in `components/fold-board.tsx`, never typed → /work
FACT: A verified Google review. **Read it on Google →** (`site.gbp`)
FACT: South Florida, remote nationwide (`site.locationLong`, read from
`lib/site.ts` — never retyped here)

The strip's two support sentences are RETIRED, not relocated: *"Real, running
apps you can open and use yourself"* and *"Remote and cloud-based, wherever your
team sits"* have no home in a one-line caption.

> **Superseded, kept for the record.** The v2.4 one-line proof band read
> *"Eight live builds. Open any of them right now."* It was replaced by the
> proof strip on 2026-08-14 and the strip was cut on 2026-08-29.

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

*(Field Photo Reports, then AI Meeting Notes. **Changed 2026-09-04** — these are the first two of `caseStudies` in array order, which is what /work shows one click later; the pair had been left untouched when the lineup was rewritten, so the two pages disagreed about which builds lead. It also removes a third appearance of AI Voice Receptionist on this one page — it is already the hero poster and the violet fold card. Full set on /work.)*

## Testimonial

EYEBROW: WHAT CLIENTS SAY

> TEKGUYZ integrated our 3CX phones with Twilio and Zoho CRM to fully automate our text surveys and protect our customer experience. They also built a custom internal tool that tracks our team's offline project work perfectly without micro-management. Exceptional execution.

ATTRIBUTION: **Joe M.** · Verified Google review
LINK: Read it on Google → `https://www.google.com/maps?cid=13204262572880001655`
CONTEXT LINE: This is the work he's describing → /work/team-performance

*(**Attribution link resolved 2026-08-10.** Verified that day as resolving to the
TEKGUYZ profile. **Google offers no durable per-review permalink** — there is no
URL that opens this specific review and keeps working — so the profile URL is the
**stable substitute**, chosen deliberately rather than as a placeholder. Do not
re-open this as a gap looking for a per-review link; there isn't one.
**Solution line for the testimonial is Business Systems.**)*

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

RELATED WORK: AI Meeting Notes & Transcription
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

RELATED WORK: AI Voice Receptionist & Call Booking
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

RELATED WORK: Field Photo Reports & Quality Tracking, Lead & Pipeline CRM, Team Performance & Automated Customer Feedback
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

RELATED WORK: Private Meetup App *(added 2026-09-29, #13 pass 2. Bundle Builder was removed 2026-09-28.)*
CTA: Describe what you need built → /contact?interest=custom-web-apps

METADATA — TITLE: `TEKGUYZ | Custom Web Apps — Ordering, Booking, and Dashboards`
DESCRIPTION: `Ordering systems, headless e-commerce, scheduling portals, and client dashboards — custom web apps built around the workflow you describe.`

---

# WORK INDEX `/work`

EYEBROW: OUR WORK
HEADLINE: Everything here is running right now.
DESCRIPTION: Not screenshots of things that used to work. Six live builds — click into any one and open it yourself.

**The count word is DERIVED, never typed** — `app/work/page.tsx` builds it from
`work.length`, so this line is a transcript of what renders, not a value to
edit. It read "Eight" here and in the code until 2026-09-04, four days after the
lineup became six. *[corrected 2026-09-07 — the code was already right; this
document was the stale half.]*

**Case Studies** *(5, full-width)* — the deep-dive builds.
**Projects** *(1, compact grid)* — lighter builds, same standard.

*(2026-09-28, #13: Bundle Builder removed — the store behind it was cancelled.
2026-09-29, pass 2: Private Meetup App added as the fifth case study.)*

## Metadata

TITLE: `TEKGUYZ | Our Work — Live, Working Software`
DESCRIPTION: `Every project here is real, running software you can open and try yourself — not a screenshot. Case studies and builds across AI, automation, and web apps.`

---

# CASE STUDY DETAIL PAGES

*Shared structure: solution tag · headline · Challenge / Approach / Outcome · pull quote · LiveFrame + status · "How it's built" (plain language) · prev/next.*

---

## `/work/field-photo-reports` — Field Photo Reports & Quality Tracking

*Rewritten 2026-09-28 (#13) for the new build at `realstone-field-ops.vercel.app`. The v1 copy (admin/installer switcher, `rs-field-ops.netlify.app`) described a build that no longer runs; it is in git history. Terms follow the app's own landing page: Visit, Report, Issue, Live photo, Office staff, Installer. The client stays unnamed here, as on the voice receptionist page; since 2026-10-05 the link is `field-photo-reports.vercel.app`, a demo that plays the made-up Seagrape Stone Co., so the poster shows no client logo (tekguyz/tekguyz-one#22). "3 to 5 days" is the shop's documented starting point, not a result. No result is stated as measured, because none is.*

TAG: Business Systems
HEADLINE: One Report from the job site, with the proof printed on every photo.

**THE CHALLENGE**
A stone fabrication shop sent its installers out with paper. Photos went through one app, messages to the office through another, and the owners got an email somewhere else. The office pieced the job together afterward, and sales often waited 3 to 5 days before they could bill for work that was already done.

**THE APPROACH**
We built one place for the whole Visit. At the end of a job, the Installer sends one Report from their phone: photos, a note, any Issues, and a sign-off from whoever is on site. The crews are Spanish-first and often work with dirty hands, so every screen reads in English or Spanish and the key actions fit without long scrolling. In the office, each Report arrives live, with nothing to refresh.

**THE OUTCOME**
Marking a Report Reviewed is the signal to bill: the Salesperson knows the job is done and proven, without waiting on paper from the field. The photos, the note, the Issues and the sign-off stay together on one record instead of across paper, two apps and an email.

**PULL QUOTE**
Every Live photo carries its own proof: job, time, place and Installer, printed into the picture.

**TRY IT**
Pick a side on the landing page: As Office staff, or As an Installer. Either button opens your own workspace with sample Visits — no sign-up, and it is deleted after 7 days. Try both to see each end of the job.

**HOW IT'S BUILT**
A phone-first Installer app and a dense desktop Office view on one live database. Every photo carries its time, place and source, and says so honestly when it has none. English and Spanish throughout, light and dark mode, installable to the home screen, and built to sit beside the shop's existing business system rather than replace it.

METADATA — TITLE: `TEKGUYZ | Field Photo Reports & Quality Tracking`
DESCRIPTION: `Installers send one Report with stamped photos from the job site, and the office sees it live. Try it yourself as Office staff or as an Installer.`

---

## `/work/ai-meeting-notes` — AI Meeting Notes & Transcription

*Added 2026-09-04. Supersedes `/work/ai-audio-file-insights` — the same product one full rewrite later. The old route and its copy were removed. Since 2026-09-28 (#13) the old route, and `/work/meeting-organizer`, redirect here with a 308.*

TAG: Smart Operations
HEADLINE: Get the notes, the takeaways, and the action items without sending a bot to the call.

**THE CHALLENGE**
Meeting notes either don't get written or don't get read. The tools that promise to fix it send a bot to sit in the call — which is awkward in front of a client, blocked outright by plenty of IT policies, and still leaves you with a wall of transcript nobody goes back to.

**THE APPROACH**
We built a notepad that records the call straight from the browser, so nothing joins the meeting and nobody has to be invited. It transcribes with the speakers separated, then writes the summary, the takeaways, and the action items — and every line it writes carries a link back to the exact moment in the transcript that supports it.

**THE OUTCOME**
A written record of the meeting exists whether or not anyone took notes, and every claim in it can be checked against what was actually said instead of taken on trust.

**PULL QUOTE**
No bot joins the call — and every takeaway links back to the second of the transcript it came from.

**TRY IT**
Press Try the demo on its landing page. One click opens the sample notes — no email, no password. Follow any takeaway back to the line it came from, or ask the notes a question.

**HOW IT'S BUILT**
In-browser system and microphone capture, batch transcription with speaker separation, and a second pass that turns the transcript into a summary, takeaways, and traceable action items. Reading lenses change how the same recording is analyzed without re-recording it.

METADATA — TITLE: `TEKGUYZ | AI Meeting Notes & Transcription`
DESCRIPTION: `An AI meeting notepad that records without sending a bot to the call, then writes summaries, takeaways, and action items you can trace back to the transcript.`

---

## `/work/tekguyz-crm` — Lead & Pipeline CRM

*Added 2026-09-04. **The product's public name is not "TEKGUYZ CRM" on this site** — the repo is named that, the page is not, because a client reading it should see a system they could have rather than an internal tool of ours. The slug keeps the repo name for wiring.*

TAG: Business Systems
HEADLINE: Track every lead from first enquiry to closed deal, in one pipeline.

**THE CHALLENGE**
Enquiries arrive in an inbox, a phone log, and a form notification, while the businesses you went out and found sit in a spreadsheet nobody opens twice. The follow-up lives in somebody's head, nothing tells you which leads have gone quiet, and nothing records what the pipeline was actually worth once the dust settled.

**THE APPROACH**
We built the CRM we run TEKGUYZ on, and work reaches it from both directions. Inbound, the contact form on this site posts straight in over a signed webhook, so an enquiry becomes a tracked lead with nobody re-typing anything. Outbound, we research local businesses worth a call and import them into the CRM as a file, so the ones we went out and found sit in the same pipeline as the enquiries.

*(Rewritten 2026-09-30. Outbound leads arrive as a researched file that is imported into the CRM by hand. **Never write "automatic" here, and never name the research tool** — the site names no tools or apps. The poster is the Reports view, which counts prospects; check it still matches these words before changing either.)*

**THE OUTCOME**
Everything worth chasing lives in one pipeline instead of an inbox and a spreadsheet. A lead cannot quietly go cold without showing it, and closed work carries a recorded outcome and revenue figure rather than an inference from an archived row.

**PULL QUOTE**
The contact form on this page posts into it. This is the system we run our own business on.

**TRY IT**
One click opens your own workspace with sample data — no signup, no password, no email. Add and change things as well as browse: the day's agenda, the pipeline board, a lead's full timeline, the revenue report. Email, import and invites are switched off in the demo.

*(Rewritten 2026-10-02, replacing the read-only promise. Since 2026-10-01 each visitor gets their own workspace and can write in it (tekguyz-crm#29); the read-only demo role is gone. Email, import and invites are off, so never invite a visitor to try them. Link is the bare origin `https://tekguyz-crm.vercel.app/`, the CRM's landing page. Its "Try the demo" button is the only thing that signs a visitor in. `/demo` only redirects there.)*

**HOW IT'S BUILT**
Multi-tenant Postgres with row-level security, signed webhook lead capture, a lead-import path for researched lead lists, role-checked writes, AI spam triage and voice-memo transcription, and a weekly revenue report that emails itself. Each demo visitor gets a private workspace of sample data, so the tour cannot reach anything real.

> **Screenshot caveat, do not lose this.** `public/media/tekguyz-crm.webp` is the real product's real Today view, but the workspace shown is **Demo Workspace** and every figure on it — each lead's dollar value, the overdue counts — is **seeded verification data, not a client result.** No copy on this page may quote, echo, or round any of those numbers. If the page ever needs a figure, it does not get one.

METADATA — TITLE: `TEKGUYZ | Lead & Pipeline CRM`
DESCRIPTION: `A multi-tenant CRM fed by website enquiries and by researched lead lists, that flags follow-ups before they go cold and records what the pipeline was actually worth.`

---

## `/work/ai-voice-receptionist` — AI Voice Receptionist & Call Booking

*Moved to fourth 2026-09-09. It sat second here while `content/work.ts` has had it
fourth, so this deck and the live `/work` page disagreed about the running order.
**The array is the source of truth** — verified against `content/work.ts` and
against the rendered page at `tekguyz.com/work` on the same day. No copy on this
page changed; only its position in this file.*

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

## `/work/private-meetup-app` — Private Meetup App

*Written 2026-09-29 (#13 pass 2) from the app's own PRODUCT.md and CONTEXT.md. The app's brand name never appears in copy, name, alt or metadata; it is only in the url, and `content/work.test.ts` enforces that. It launches small and private, so no member count and no result is stated. The site says "meetup", not the app's own word "sesh". The poster is the app's `showcase/sesh-desktop-light.png`, taken in the demo: every person and meetup in it is invented.*

TAG: Custom Web Apps
HEADLINE: Small private meetups, where a person checks every card and the address stays hidden until the host says yes.

**THE CHALLENGE**
Florida law lets medical cannabis patients consume at a private home. A meetup there only works if everyone in the room is a verified patient, 21 or older. An ordinary event app cannot promise that: it checks nobody's card, and anyone who finds the page can find the house.

**THE APPROACH**
We built a members-only app around the gate. Every new member takes a live photo of their card, then of their face with a random challenge, and a person reviews each one by eye. AI reads the card and lists concerns, but it never decides. Hosts approve every guest by hand. Until they do, the map shows only a circle about half a mile across. The app never handles a sale of any kind.

**THE OUTCOME**
Every member at a meetup was checked by a person, and nobody outside the guest list knows where it is. Card and face photos are deleted when the reviewer decides, within 7 days at most, and the app forgets the address a week after the meetup.

**PULL QUOTE**
Hide by default, reveal by approval: nobody sees who or where until a person has said yes.

**TRY IT**
Press Try the demo on its landing page. One click opens your own visitor account among sample members and meetups — no card, no sign-up, and it is deleted after 7 days. Browse the list and the map, open a meetup, and see what stays hidden until a host says yes.

**HOW IT'S BUILT**
A phone-first web app that installs to the home screen, on one database where every row is locked to who may see it. Verification is a one-step-per-screen camera flow with no gallery upload. Notifications name no member and no meetup, and the app stores no data on the phone. The demo runs in a sealed copy that can never reach a real member. Light and dark mode throughout.

METADATA — TITLE: `TEKGUYZ | Private Meetup App`
DESCRIPTION: `A members-only meetup app for verified Florida medical cannabis patients. A person checks every card, the host approves every guest, and the address stays hidden until they do.`

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

BOOKING LINE (added 2026-10-03, #33; **drafted, not transcribed** — written from PLAYBOOK §4 and the trust line, sentence case because it starts something the visitor can abandon): Prefer to skip the form? **Book a free first conversation** → `site.bookingUrl` (Cal.com, new tab). Sits directly under the form card (the first placement, between the intro and the trust lines, read as an orphan on the owner's test). One text link, never a button.

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
LAUNCHER (below 768px): Ask us
SPEAKER LABEL (above every reply, the opener included): TEKGUYZ
OPENER: Tell me what's slowing your business down and I'll tell you what we'd build for it. I can also pass your details straight to the team.
INPUT PLACEHOLDER: Describe what you're dealing with…
DISCLAIMER: *(none — deleted 2026-08-12)*

*(**The mobile launcher string was drafted 2026-08-13, not transcribed** — it is
new copy written from `PLAYBOOK.md` §4, chosen by the user from three options.
Sentence case follows the rule above: the launcher opens a conversation in place
rather than committing to a navigation. It exists because the one desktop size
shipped to every width made the launcher **57% of a 412px screen**, measured on a
Pixel 9A, sitting on the Process teaser's body copy. Length IS the width budget
here — "What should we build?" reads better and measures 157px against the
current label's 158px, so it fixes nothing. **Rejected: "Ask a builder"**, which
lands the direct-to-builder pillar and is false — a Gemini concierge answers, as
the privacy copy states.)*

*(**The slot is closed, not empty.** The disclaimer was removed from the panel on
the user's instruction on 2026-08-12 and is not to be re-added or re-drafted.
It takes **no `[NEEDS COPY]` marker** — the marker is for a slot with no shipped
string that still needs one, and this slot no longer exists. Its footer strip
unmounts with it at cap-reached rather than shipping an empty rule.
**The concierge's no-price rule is unaffected** — it is enforced in
`lib/concierge/system-prompt.ts`, never by this line, which was never what held
it. Two earlier strings lived here: `This is a starting sketch, not a quote —
pricing always comes from a real conversation.` (86 chars, wrapped to 2 lines at
every viewport including 1440), replaced 2026-08-11 by `A starting sketch, not a
quote.` (31 chars, one line at 360px), removed entirely 2026-08-12.)*
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

**How much does a project cost?**
It depends on what you're building, and we won't pretend otherwise. Every project starts with a free conversation, you get a flat quote once we understand the scope, and nothing begins until you've seen that number and agreed to it. No retainers you didn't ask for.

**How long does a project take?**
Also scope-dependent — but you'll have a real timeline before any building starts, laid out in the Blueprint step. If something changes mid-build, you hear it from us when it happens, not at the end.

**Do you work with businesses outside South Florida?**
Yes. We're based in South Florida and deliver remotely nationwide. Most of our work happens over video calls and shared systems, regardless of where you're located.

**Can you work with the systems we already have?**
Usually, yes — that's most of what we do. Integrating with tools you already pay for is almost always cheaper and less disruptive than replacing them. If something genuinely needs replacing, we'll tell you why.

**What happens after launch?**
We make sure everything works the way it's supposed to, and we stay available when questions come up. We don't hand over a login and disappear.

**Are the demos on this site real?**
Every one. They're live applications, not screenshots. Open any of them and use it yourself.

---

# CONFIRMATION EMAIL — BUILT AND SHIPPING

*Sent to the person who submitted, from both the contact form and the concierge. Implemented in `app/actions/contact.ts` — the notification and the confirmation are two Resend sends, kicked off together and settled together, and the subject line below is the one in the code.*

**[corrected 2026-09-07] This heading read "(new — currently missing entirely)" and the note below it said the submitter hears nothing until a human replies. Both were false** — measured in `app/actions/contact.ts`, which sends `We got your message — TEKGUYZ` to the submitter. The stale wording survived because nothing in the build reads this file.

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

*Rewritten 2026-08-12 (Build Phase 3), replacing the text that was live through July. Update the LAST UPDATED date if anything changes. **Still needs real legal review before being treated as final** — that has not changed.*

EYEBROW: LEGAL
HEADLINE: Privacy Policy
LAST UPDATED: August 12, 2026

TEKGUYZ ("we," "us") respects your privacy. This page explains what information we collect through this website, why, and how you can reach us about it.

**Information We Collect** — If you use our contact form or talk with our AI concierge, we collect the name, email address, phone number (optional), company (optional), area of interest, estimated budget (optional), and project details you provide. We use this only to respond to your inquiry — we don't sell it, rent it, or share it with third parties for marketing purposes.

**The AI Concierge** — If you use the chat assistant on this site, your conversation is sent to Google's Gemini AI to generate a response. Anything you share there — including contact details — may be captured as an inquiry the same way a contact form submission would be.

**Our CRM** — Inquiries submitted through the contact form or the concierge are forwarded to TEKGUYZ's own customer relationship system, not only to an inbox, so our team can track and respond to them properly.

**Website Analytics & Performance Monitoring** — This site uses Vercel Web Analytics and Vercel Speed Insights to understand aggregate traffic and page performance. Neither uses cookies or collects personal identifiers — visitors are identified only by a temporary hash that's automatically discarded within 24 hours. We cannot use this data to identify you individually.

**Third-Party Services** — We use Resend to deliver contact form and concierge submissions to our inbox, Google (Gemini) to power the AI concierge, and Vercel to host this site and run the anonymized analytics and performance monitoring described above. None of these services receive more information than described here.

**Data Retention** — We keep contact and concierge inquiries only as long as needed to respond to you and for reasonable business record-keeping afterward. If our system briefly fails to deliver your inquiry internally, a secure backup copy is kept for up to 90 days so nothing gets lost, then it's automatically deleted.

**Your Rights** — You can ask us to tell you what information we have about you, or to delete it, at any time — email hello@tekguyz.com.

**Changes to This Policy** — We may update this policy from time to time. The date at the top reflects the most recent revision.

**Contact** — Questions about this policy: hello@tekguyz.com

METADATA — TITLE: `TEKGUYZ | Privacy Policy`
DESCRIPTION: `What information TEKGUYZ collects through this website, why, and how to reach us about it.`

> **What changed vs. the previously-live version** (all three gaps this section used to flag as open are now closed):
> 1. **Phone number** added to "Information We Collect".
> 2. **The AI Concierge** — new section, Gemini disclosure.
> 3. **Our CRM** — new section, forwarding disclosure.
> 4. **Website Analytics** renamed **Website Analytics & Performance Monitoring**, now covering Speed Insights, which was live in `app/layout.tsx` and undisclosed.
> 5. **Third-Party Services** now lists Google/Gemini.
> 6. **Data Retention** states the 90-day backup path explicitly. That sentence describes `lib/lead-archive.ts` — written only when internal delivery fails, `TTL_SECONDS` = 90 days. Change either and this sentence stops being true.
> 7. **Children's Privacy** removed, per the user's instruction.
>
> **Open for the legal reviewer:** no cookie-consent or state-specific (CCPA etc.) language was added — out of scope per the user's call. Confirm that's right for the actual traffic and customer base.

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

1. ~~`[NEEDS REAL DATA]` on the Field Photo Reports outcome~~ **Closed 2026-08-13.** Resolved 2026-08-10 as "the marker stays" — no real number exists, so it is never filled and never rendered — and the scheduled reword (drop the "seeing" repetition, add a faster-billing outcome) **has now been written**, in `docs/COPY.md` and `content/work.ts` in the same commit. The marker is retired because the sentence stands on a qualitative outcome; **still no invented figure**. See the section itself.
2. ~~GBP review permalink for the testimonial attribution link~~ **Resolved 2026-08-10.** `https://www.google.com/maps?cid=13204262572880001655`, verified that day. Google offers no durable per-review permalink; the profile URL is the stable substitute, by decision.
2b. ~~**The concierge footer disclaimer is now an open slot** (2026-08-10)~~ **Closed 2026-08-12: the disclaimer is deleted, not replaced.** Removed from the panel on the user's instruction. The slot no longer exists and is not to be re-drafted. See the Concierge microcopy section.
3. ~~Confirm the Field Photo Reports switcher and the Bundle Builder test card~~ **Closed 2026-09-28 (#13).** The switcher is gone with the v1 build, and Bundle Builder is removed. The new Try it lines were checked against each app's live landing page that day.
