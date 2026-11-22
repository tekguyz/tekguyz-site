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
**Work** — AI Voice Receptionist / Quote to Paid / Win-Back / Book Your Visit *(changed 2026-11-12: Book Your Visit replaced Field Photo Reports, refs tekguyz/tekguyz-one#152. Before that, 2026-11-11: the four builds that lead their Solution on /work. The CRM left because the footer shows on Home, and the meetup app left the site. Each links to its `/work/<slug>` page, in this order)*
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
CTA PRIMARY: Let’s Talk → /contact (shortened 2026-11-21 by the founder: the old "Start a Free Conversation" was too long for a button; matches the nav CTA)
CTA SECONDARY: See Our Work → /work
MEDIA: `missed-call-hero.webp` (1440×810, 16:9), the top of Missed Call Follow-Up's own showcase capture: the follow-up texts on a phone, the owner's alerts and the lead pipeline. Below 1024px, `missed-call-hero-mobile.webp` (960×540): the phone and the alerts only. No loop and no phone layer. Live-status chip attached, for Missed Call Follow-Up. **Changed 2026-11-11** (founder's pick of two). Before that: `field-reports-hero.webp` with a phone capture and a 4.5 s loop, from 2026-10-02 (#20); see CANONICAL §1. The old `sarah-demo.mp4` showed the withdrawn phone simulator and was deleted 2026-08-28.

## The fold — build board caption

**[changed 2026-08-29]** The elevated three-fact proof strip is deleted. Its
"Eight live builds" claim is not written anywhere any more — the board below the
hero *is* the live builds, one per solution line, with a measured status on
each, and `See all six builds` is the link directly beneath them. *(2026-09-29,
#13 pass 2: four cards again — Private Meetup App holds the teal slot. **Changed 2026-11-11:** Win-Back, No-Show Rescue, Quote to Paid, Field Photo Reports, one per line in stripe order. The CRM is off Home and the meetup app is off the site.)* The other two facts are now one muted
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
DESCRIPTION: Four kinds of problems we fix for small businesses. Find the one that sounds like yours. (changed 2026-10-11, #40; **drafted** from tekguyz-one `brand/playbook.md` v3 § 1–2)

*Hooks rewritten 2026-11-16 (#80, **drafted**): the founder's phone review asked for the four to run the same length, two lines each on a phone (63-70 characters).*

- **Smart Operations** (blue) — Data and tasks pile up every hour. We build systems that handle them. → /solutions/smart-operations
- **AI Voice Agents** (violet) — Your phones keep ringing after you close. We answer every call. → /solutions/ai-voice-agents
- **Business Systems** (amber) — Everything your clients and team need, in one private place, not five. → /solutions/business-systems
- **Custom Web Apps** (teal) — Describe the workflow out loud, and we build the tool that runs it. → /solutions/custom-web-apps

## Featured Work

EYEBROW: OUR WORK
HEADLINE: Two we're proud of.
DESCRIPTION: Both are running right now. Open either one and use it yourself.

*(AI Voice Receptionist, then Field Photo Reports. **Changed 2026-11-11** (founder): the Lead & Pipeline CRM never appears on Home, and the band never repeats the hero (Missed Call Follow-Up). Before that: AI Voice Receptionist, then Lead & Pipeline CRM. **Changed 2026-10-15**: the owner reordered the work list, and this band still shows its first two case studies. Field Photo Reports stays the hero. Earlier pair: Field Photo Reports, then AI Meeting Notes. **Changed 2026-09-04** — these are the first two of `caseStudies` in array order, which is what /work shows one click later; the pair had been left untouched when the lineup was rewritten, so the two pages disagreed about which builds lead. It also removes a third appearance of AI Voice Receptionist on this one page — it is already the hero poster and the violet fold card. Full set on /work.)*

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

TITLE: `TEKGUYZ | AI Help for South Florida Small Businesses` (changed 2026-10-11, #40; **drafted** from playbook v3 § 1; the OG card eyebrow reads `AI Help for Small Businesses`)
DESCRIPTION: `AI help for South Florida small businesses. We answer your phones, cut repeat work and put everything in one place. Free first conversation, flat quote.` (changed 2026-10-16, #40; **drafted** from playbook v3 and the contact menu; replaces the "measurable impact" line)
OG: same title/description, `og:type=website`

---

# SOLUTIONS INDEX `/solutions` — removed 2026-11-16

*Removed by the founder's phone review (#80): it repeated Home's four Solution blocks and added nothing. `/solutions` now sends a 308 to `/#solutions`, the blocks on Home, and the nav and each Solution page's back link point there. Its copy (headline "Four ways we help.", the rows, the metadata) is retired; git history has it.*

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

RELATED WORK: Win-Back, AI Meeting Notes & Transcription *(Win-Back added 2026-11-11)*
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

RELATED WORK: AI Voice Receptionist & Call Booking, Missed Call Follow-Up *(added 2026-11-10, #67)*, No-Show Rescue *(added 2026-11-11)*
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

RELATED WORK: Lead & Pipeline CRM, Quote to Paid, Team Performance *(Quote to Paid added 2026-11-10, #67. Field Photo Reports moved to Custom Web Apps 2026-11-11. Team Performance back with its rebuilt demo 2026-11-20, #91)*
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

RELATED WORK: Cart Reminders *(added 2026-11-13)*, Coffee Brand & Shop *(added 2026-11-20, #91)*, Book Your Visit *(added 2026-11-12)*, Field Photo Reports & Quality Tracking *(retagged here from Business Systems by the founder, 2026-11-11. The Private Meetup App, here from 2026-09-29, left the site the same day. Bundle Builder was removed 2026-09-28.)*
CTA: Describe what you need built → /contact?interest=custom-web-apps

METADATA — TITLE: `TEKGUYZ | Custom Web Apps — Ordering, Booking, and Dashboards`
DESCRIPTION: `Ordering systems, headless e-commerce, scheduling portals, and client dashboards — custom web apps built around the workflow you describe.`

---

# WORK INDEX `/work`

EYEBROW: OUR WORK
HEADLINE: Everything here is running right now.
DESCRIPTION: 13 live builds. Open any one yourself. (shortened 2026-11-16, #80; the number is derived from the lineup, never typed, and past nine it renders as digits)

**The count word is DERIVED, never typed** — `app/work/page.tsx` builds it from
`work.length`, so this line is a transcript of what renders, not a value to
edit. It read "Eight" here and in the code until 2026-09-04, four days after the
lineup became six. *[corrected 2026-09-07 — the code was already right; this
document was the stale half.]*

**Changed 2026-11-11 (founder):** four large cards, one per Solution, then every other build in small cards. Group heads (**drafted**):

**Changed 2026-11-16 (founder's phone review, #80):** Cart Reminders took the Custom Web Apps lead card from Book Your Visit, and every card got shorter: the short name, the build's headline as its one line, a "Live" pill and the links. The summary, pull quote and Try it live on the build's own page. Field Photo Reports' short name is "Field Reports".

**Changed 2026-11-20 (founder, #91):** 13 builds. A Solution filter on top (All, Smart Operations, AI Voice Agents, Business Systems, Custom Web Apps, each with its count; kept in the address as `?solution=`), then six featured cards two across with the picture beside the words, then the other seven small cards. A line under the filter says "N of 13 builds." while a filter is on.

**Featured** *(6, two across from 1024px)* — Open any one and use it yourself. In order: AI Voice Receptionist (AI Voice Agents), Quote to Paid (Business Systems), Win-Back (Smart Operations), Cart Reminders (Custom Web Apps), Coffee Brand & Shop, Field Reports. The first four lead their Solution (fold board, footer).
**More builds** *(7, a swipe row on phones, a grid from 640px)* — Same standard, every one live. In order: Book Your Visit, No-Show Rescue, Missed Call Follow-Up, Team Performance, AI Meeting Notes, Lead & Pipeline CRM, Everyday Helpers.

Before 2026-11-20: **One for each Solution** *(4, stacked)* and **More builds** *(6)*.

Before 2026-11-11: **Case Studies** *(full-width)* — the deep-dive builds; **Projects** *(compact grid)* — lighter builds, same standard.

*(2026-09-28, #13: Bundle Builder removed — the store behind it was cancelled.
2026-09-29, pass 2: Private Meetup App added as the fifth case study.
2026-11-10, #67: Missed Call Follow-Up and Quote to Paid added as projects, ahead of Team Performance.
2026-11-11: No-Show Rescue and Win-Back added as projects (refs tekguyz/tekguyz-one#148, #149). The Private Meetup App removed from the site; the portfolio keeps it, and `/work/private-meetup-app` redirects to `/work`.
2026-11-20, #91: Team Performance (rebuilt demo), Coffee Brand & Shop and Everyday Helpers added, 13 in all. The Private Meetup App stays off.)*

## Metadata

TITLE: `TEKGUYZ | Our Work — Live, Working Software`
DESCRIPTION: `Every project here is real, running software you can open and try yourself. Case studies and builds across AI, automation, and web apps.`

---

# EXAMPLES — `/examples` and `/examples/[slug]`

Added 2026-10-21 (owner: "I just need to showcase a little bit more what kind of
products I'll be offering"). An example is **not** a build: it plays a made-up
business on sample data, so it never appears in the /work lists. Each example
plays its own made-up business, never one used by another demo. The first four
are one per Solution.

**Index hero**
EYEBROW: `Examples`
HEADLINE: `A closer look at what we build.`
DESCRIPTION: `Short examples on made-up businesses, with sample data you can click through. For finished builds you can open and use, see Our Work.`
CARD FOOTER: `Example: <business>, <business line>.`
LINK: `See the finished builds in Our Work →`

**Each example page** — tag · headline · `Example: <business>, <business line>.` ·
The problem · What it does · try-it line · the screen · `Part of <Solution>` ·
`Your version is built around your business, your tools and your words.`
The per-example words (headline, problem, what it does, try-it line, title,
description) live in `content/examples.ts`, one entry each; that file is their
source.

**Full demo line** *(2026-11-10, #67)*, under the screen, only when a finished build of the same tool exists: `See the full build on a different made-up business: <name>, one-click demo` — links the build's landing page in a new tab, never the demo itself. Today only Quote & Invoice Follow-Up has one: Quote to Paid.

**On /work**, under Projects: `Want a quick look at more of what we build? See the examples →`
**On each /solutions page**, under the builds: eyebrow `Examples`, a card per example with `Example on a made-up business: <business>.`

## Metadata

TITLE: `TEKGUYZ | Examples — A Closer Look at What We Build`
DESCRIPTION: `Short examples of the tools we build for small businesses, each on a made-up business with sample data: quote follow-up, voicemail summaries, an inbox sorter and online booking.`

---

# CASE STUDY DETAIL PAGES

*Shared structure: solution tag · headline · Challenge / Approach / Outcome · pull quote · LiveFrame + status · "How it's built" (plain language) · prev/next.*

---

## `/work/field-photo-reports` — Field Photo Reports & Quality Tracking

*Rewritten 2026-09-28 (#13) for the new build at `realstone-field-ops.vercel.app`. The v1 copy (admin/installer switcher, `rs-field-ops.netlify.app`) described a build that no longer runs; it is in git history. Terms follow the app's own landing page: Visit, Report, Issue, Live photo, Office staff, Installer. The client stays unnamed here, as on the voice receptionist page; since 2026-10-05 the link is `field-photo-reports.vercel.app`, a demo that plays the made-up Seagrape Stone Co., so the poster shows no client logo (tekguyz/tekguyz-one#22). "3 to 5 days" is the shop's documented starting point, not a result. No result is stated as measured, because none is.*

TAG: Custom Web Apps *(retagged from Business Systems by the founder, 2026-11-11)*
HEADLINE: One Report from the job site, with the proof printed on every photo.

**THE CHALLENGE**
A stone shop’s installers worked on paper. Photos, messages and emails went three different ways, the office pieced each job together afterward, and billing often waited 3 to 5 days.

**THE APPROACH**
At the end of a job, the Installer sends one Report from their phone: photos, a note, any Issues and a sign-off. Every screen reads in English or Spanish and works with dirty hands. The office sees each Report arrive live.

**THE OUTCOME**
Marking a Report Reviewed is the signal to bill. The photos, note, Issues and sign-off stay on one record.

**PULL QUOTE**
Every Live photo carries its own proof: job, time, place and Installer, printed into the picture.

**TRY IT**
Pick a side: Office staff or Installer. Either opens your own workspace with sample Visits, no sign-up, deleted after 7 days.

**HOW IT'S BUILT**
A phone app for Installers and a desktop view for the office, on one live database. Every photo carries its time, place and source. English and Spanish, installable to the home screen, and built to sit beside the shop's existing system.

METADATA — TITLE: `TEKGUYZ | Field Photo Reports & Quality Tracking`
DESCRIPTION: `Installers send one Report with stamped photos from the job site, and the office sees it live. Try it yourself as Office staff or as an Installer.`

---

## `/work/ai-meeting-notes` — AI Meeting Notes & Transcription

*Added 2026-09-04. Supersedes `/work/ai-audio-file-insights` — the same product one full rewrite later. The old route and its copy were removed. Since 2026-09-28 (#13) the old route, and `/work/meeting-organizer`, redirect here with a 308.*

TAG: Smart Operations
HEADLINE: Get the notes, the takeaways, and the action items without sending a bot to the call.

**THE CHALLENGE**
Meeting notes don’t get written, or don’t get read. The tools that fix it send a bot into the call, which is awkward with clients and blocked by many IT policies.

**THE APPROACH**
A notepad that records the call from the browser, so nothing joins the meeting. It separates the speakers, then writes the summary, takeaways and action items. Every line links back to the moment in the transcript that supports it.

**THE OUTCOME**
There is a written record of every meeting, and every claim in it can be checked against what was said.

**PULL QUOTE**
No bot joins the call — and every takeaway links back to the second of the transcript it came from.

**TRY IT**
Open the demo. One click opens the sample notes, no sign-up. Follow any takeaway back to its line, or ask the notes a question.

**HOW IT'S BUILT**
Records system audio and the microphone in the browser, transcribes with the speakers separated, then a second pass writes the summary and traceable action items. Reading lenses change the analysis without re-recording.

METADATA — TITLE: `TEKGUYZ | AI Meeting Notes & Transcription`
DESCRIPTION: `An AI meeting notepad that records without sending a bot to the call, then writes summaries, takeaways, and action items you can trace back to the transcript.`

---

## `/work/tekguyz-crm` — Lead & Pipeline CRM

*Added 2026-09-04. **The product's public name is not "TEKGUYZ CRM" on this site** — the repo is named that, the page is not, because a client reading it should see a system they could have rather than an internal tool of ours. The slug keeps the repo name for wiring.*

TAG: Business Systems
HEADLINE: Track every lead from first enquiry to closed deal, in one pipeline.

**THE CHALLENGE**
Enquiries arrive by email, phone and form, and the businesses we found ourselves sit in a spreadsheet. The follow-up lives in someone's head, and nobody sees which leads went quiet.

**THE APPROACH**
We built the CRM we run TEKGUYZ on. The contact form on this site posts straight into it, so an enquiry becomes a lead with no re-typing. Businesses we research are imported as a file, into the same pipeline.

*(Rewritten 2026-09-30. Outbound leads arrive as a researched file that is imported into the CRM by hand. **Never write "automatic" here, and never name the research tool** — the site names no tools or apps. The poster is the Reports view, which counts prospects; check it still matches these words before changing either.)*

**THE OUTCOME**
Every lead worth chasing is in one pipeline. A lead cannot go cold without showing it, and closed work records what it was worth.

**PULL QUOTE**
The contact form on this page posts into it. This is the system we run our own business on.

**TRY IT**
Open the demo. One click opens your own workspace with sample data, no sign-up. Add and change things: the agenda, the pipeline, a lead's timeline, the revenue report. Email, import and invites are off.

*(Rewritten 2026-10-02, replacing the read-only promise. Since 2026-10-01 each visitor gets their own workspace and can write in it (tekguyz-crm#29); the read-only demo role is gone. Email, import and invites are off, so never invite a visitor to try them. Link is the bare origin `https://tekguyz-crm.vercel.app/`, the CRM's landing page. Its "Try the demo" button is the only thing that signs a visitor in. `/demo` only redirects there.)*

**HOW IT'S BUILT**
Multi-tenant Postgres with row-level security, signed lead capture, a lead-import path, AI spam triage, voice-memo transcription and a weekly revenue email. Each demo visitor gets a private sample workspace.

> **Screenshot caveat, do not lose this.** `public/media/tekguyz-crm.webp` is the real product's real Today view, but the workspace shown is **Demo Workspace** and every figure on it — each lead's dollar value, the overdue counts — is **seeded verification data, not a client result.** No copy on this page may quote, echo, or round any of those numbers. If the page ever needs a figure, it does not get one.

METADATA — TITLE: `TEKGUYZ | Lead & Pipeline CRM`
DESCRIPTION: `A multi-tenant CRM fed by website enquiries and by researched lead lists, that flags follow-ups before they go cold and records what the pipeline was actually worth.`

---

## `/work/ai-voice-receptionist` — AI Voice Receptionist & Call Booking

*Rewritten 2026-10-15 for the rebuilt demo at
`ai-voice-receptionist-tekguyz.vercel.app` (tekguyz/tekguyz-one#22,
tekguyz/ai-voice-receptionist#10). It plays the made-up Mangrove Air (AC repair,
South Florida); the Receptionist is Luna. The old "Sarah" demo and its stone-shop
copy are retired; they are in git history. Facts come from the app's README,
PRODUCT.md and CONTEXT.md. No result is stated, because none is measured.*

TAG: AI Voice Agents
HEADLINE: Answers the phone, writes down the job, and books the visit.

**THE CHALLENGE**
Calls come in while the crew is on a job or after closing. A caller with a broken AC does not wait. They call the next shop.

**THE APPROACH**
Luna answers for Mangrove Air, a made-up AC repair shop. She takes the name, the job, how urgent it is and the address, then books a time. The work order fills in as she talks. She speaks Spanish too.

**THE OUTCOME**
The owner gets Call Notes for every call: the caller, the job, the urgency and the booked time. It is a demo, so nothing is sent.

**PULL QUOTE**
You do not watch a video of an AI receptionist. You call one, in one press.

**TRY IT**
Open the demo, press Call now and talk to Luna in your browser. No sign-up. No microphone? Play the Sample Call.

**HOW IT'S BUILT**
The call runs in the browser. Each call gets a short-lived key, so the browser never holds the real one. Calls stop at 3 minutes. Only the words are kept, for 7 days, never the voice.

METADATA — TITLE: `TEKGUYZ | AI Voice Receptionist — Live Demo`
DESCRIPTION: `Talk to Luna, an AI Receptionist for a made-up AC repair shop, right in your browser. Watch her write down the job and book a time, then see the owner’s Call Notes.`

---

*`/work/private-meetup-app` — Private Meetup App: removed from the site 2026-11-11 (founder). Its copy is in git history and the portfolio keeps the build.*

---

# PROJECT DETAIL PAGES

*Lighter structure by design: tag · headline · Built For · what it does · what made it interesting · LiveFrame + status.*

## `/work/missed-call-follow-up` — Missed Call Follow-Up

*Added 2026-11-10 (#67, tekguyz/tekguyz-one#137). Words from tekguyz-one `projects/missed-call-follow-up/about.md`. Live demo link: the landing page, https://missed-call-follow-up.vercel.app.*

TAG: AI Voice Agents
BUILT FOR: Trade businesses that live on the phone: HVAC and AC repair, roofing, and boat and marine repair
HEADLINE: Every missed call gets an answer, and every lead lands in the pipeline.

A missed call gets a text, an email or a voice callback. It asks what is wrong, where and how soon. The lead lands on a board, and the owner gets an alert.

**WHAT MADE IT INTERESTING:** the business picks the channel. The same three questions go out by text, email or voice, and every answer lands on one board.

**TRY IT:** Open the demo. No sign-up. Call a made-up roofer, nobody answers, and watch the follow-up arrive and the lead land on the board. Nothing is sent.

METADATA — TITLE: `TEKGUYZ | Missed Call Follow-Up`
DESCRIPTION: `When a call is missed, the caller hears back by text, email or a voice callback. The lead lands in a pipeline and the owner gets an alert. Try the one-click demo.`

## `/work/quote-to-paid` — Quote to Paid

*Added 2026-11-10 (#67, tekguyz/tekguyz-one#138). Words from tekguyz-one `projects/quote-to-paid/about.md`. Live demo link: the landing page, https://quotetopaid.vercel.app.*

TAG: Business Systems
BUILT FOR: Roofing and AC companies that send quotes and wait to get paid
HEADLINE: No quote or invoice goes quiet. Persistent, never pushy.

Follows up by text on every unanswered quote and unpaid invoice. The invoice goes out when the crew marks the job done. The follow-ups stop when the customer answers or pays. One board shows what is waiting and who to call.

**WHAT MADE IT INTERESTING:** the stop rule. Any answer or payment ends the follow-ups, nothing goes out on Sundays, and there are never more than three.

**PULL QUOTE (large card on /work, drafted 2026-11-11):** Any answer or payment stops the follow-ups. The rules are simple enough to say out loud.

**TRY IT:** Open the demo. No sign-up. Press Skip ahead a day and watch follow-ups go out and invoices get paid. Open any job to play the customer. Nothing is sent or charged.

METADATA — TITLE: `TEKGUYZ | Quote to Paid`
DESCRIPTION: `Follows up on every quote and every unpaid invoice by text, politely, until the customer answers or pays. Then it stops. Try the one-click demo.`

## `/work/no-show-rescue` — No-Show Rescue

*Added 2026-11-11 (refs tekguyz/tekguyz-one#148), package C. Words from the app's landing page and README. Live demo link: the landing page, https://no-show-rescue.vercel.app. Poster: the app's own `showcase/webp/slot-filled-desktop-light.webp` (since 2026-11-13, tekguyz/tekguyz-one#162; a landing page capture before).*

TAG: AI Voice Agents
BUILT FOR: Dental and vet practices
HEADLINE: Fewer empty chairs: a reminder before the visit, a new time after a no-show.

A reminder text goes out the day before a visit. After a no-show, the patient is offered a new time, and the open slot goes to a short-notice waitlist. After the visit, happy patients get the review link, and the others reach the front desk privately.

**WHAT MADE IT INTERESTING:** the empty chair. Rebooking the patient is half the job. The other half is filling the slot today, from the waitlist.

**TRY IT:** Open the demo. No sign-up. Play a patient at a made-up dental practice: miss the visit, pick a new time, and watch the front desk fill the chair. Nothing is sent.

METADATA — TITLE: `TEKGUYZ | No-Show Rescue`
DESCRIPTION: `Reminders before a visit, a new time offered after a no-show, the open slot filled from a waitlist, and a review request after. Try the one-click demo.`

## `/work/win-back` — Win-Back

*Added 2026-11-11 (refs tekguyz/tekguyz-one#149), package G. Words from the app's landing page and README. Live demo link: the landing page, https://win-back-customers.vercel.app. Poster: the app's own `showcase/webp/approve-desktop-light.webp` (since 2026-11-13, tekguyz/tekguyz-one#162; a landing page capture before). It leads Smart Operations on /work, so it has a pull quote (**drafted**).*

TAG: Smart Operations
BUILT FOR: AC and heating companies with yearly service, and dental and vet offices with recalls
HEADLINE: Bring back the customers who stopped calling.

Reads the customer records the business already keeps and finds who stopped coming back. A short report says who and why, and each one gets a drafted message. The owner approves, changes or skips every one, and a reply can book a visit.

**WHAT MADE IT INTERESTING:** there is no approve-all button. Every message waits for the owner, and anyone who asked not to get texts stays off the list.

**PULL QUOTE (large card on /work):** Nothing goes out until the owner approves it, one customer at a time.

**TRY IT:** Open the demo. No sign-up. Read the report for a made-up AC company, approve the messages you like, and watch a reply book a visit. Nothing is sent.

METADATA — TITLE: `TEKGUYZ | Win-Back`
DESCRIPTION: `Finds past customers who stopped coming back in your own records, says who and why, and drafts a message to each for you to approve. Try the one-click demo.`

## `/work/book-your-visit` — Book Your Visit

*Added 2026-11-12 (refs tekguyz/tekguyz-one#152), Custom Web Apps. Words from tekguyz-one `projects/book-your-visit/about.md`. Live demo link: the landing page, https://bookyourvisit.vercel.app. Poster: the app's own `showcase/webp/booking-page-desktop-light.webp`. It leads Custom Web Apps on /work, so it has a pull quote (**drafted** from the "Say" lines).*

TAG: Custom Web Apps
BUILT FOR: Small home-service businesses, such as a cleaning company, that run on a calendar and a phone
HEADLINE: Customers pick a time themselves.

Customers pick a service and an open time, then book, move or cancel without a call. The owner sees the day: every visit, the free gaps and the blocked time. A visit booked online is marked “New”.

**WHAT MADE IT INTERESTING:** the page only shows times that fit: inside opening hours, never on a Sunday, never over blocked time, and with 30 minutes to drive between homes.

**PULL QUOTE (large card on /work):** Customers see only the times you are free. Change or cancel without a call.

**TRY IT:** Open the demo. No sign-up. Book a cleaning at a made-up company, watch it land on the owner’s day, then move or cancel it. Nothing is sent.

METADATA — TITLE: `TEKGUYZ | Book Your Visit`
DESCRIPTION: `An online booking portal where customers pick a service and an open time, and change or cancel without a call. The owner sees the day. Try the one-click demo.`

## `/work/cart-reminders` — Cart Reminders

*Added 2026-11-13 (refs tekguyz/tekguyz-one#161), Custom Web Apps (online ordering and cart systems, headless e-commerce, cart abandonment). Words from tekguyz-one `projects/cart-reminders/about.md`. Live demo link: the landing page, https://cart-reminders.vercel.app. Poster: the app's own `showcase/webp/reminder-desktop-light.webp`.*

TAG: Custom Web Apps
BUILT FOR: Small shops that sell online or want to: a roaster, a boutique, a food maker
HEADLINE: The shopper left. The cart came back.

An online shop built to fit the business, with ordering and payment. When a shopper leaves at checkout, the cart gets two reminders, after an hour and after a day, then it stops. The owner sees carts started, left, reminded and won back.

**WHAT MADE IT INTERESTING:** the cart outlives the visit. It lives in Shopify, so the reminder’s link reopens the same cart at checkout.

**TRY IT:** Open the demo. No sign-up. At Segovia Coffee, a made-up roaster, add coffee, start paying with a Stripe test card, leave, skip ahead and read the reminder. No card is charged.

METADATA — TITLE: `TEKGUYZ | Cart Reminders`
DESCRIPTION: `An online store whose left carts come back: ordering and payment built to fit, and a friendly reminder when a shopper leaves at checkout. Try the one-click demo.`

## `/work/team-performance` — Team Performance

*Back 2026-11-20 (#91) with the rebuilt demo (tekguyz/team-performance, live 2026-11-17), Business Systems. Words from its README and the portfolio's entry. Live demo link: the landing page, https://team-performance-demo.vercel.app. Poster: the portfolio's `overview.webp`. The old page and its client review were retired 2026-11-12 (#76).*

TAG: Business Systems
BUILT FOR: Service teams that work the phones and follow up with customer surveys
HEADLINE: Phone logs that credit the right person, and surveys that know when to stop.

Every desk-phone call is credited to the person who handled it, with no manual entry. A text survey runs beside it with plain rules, so customers are not texted after every call.

**WHAT MADE IT INTERESTING:** the rules that stop a text: no survey for a call under 2 minutes, and never two texts to one number in a day.

**TRY IT:** Open the demo. No sign-up. Run a batch of calls at a made-up call center and watch which rule stops each text. Nothing is sent.

METADATA — TITLE: `TEKGUYZ | Team Performance`
DESCRIPTION: `Phone logs that credit whoever did the work, and customer survey texts with plain rules that know when to stop. Try the one-click demo.`

## `/work/coffee-brand-shop` — Coffee Brand & Shop

*Added 2026-11-20 (#91), Custom Web Apps. A made-up family coffee brand built as if it were real. Words from tekguyz-one `projects/coquimba-coffee/about.md` via the portfolio's entry. Live link: the shop itself, https://coquimba-coffee.vercel.app (no landing page in front). Poster: the portfolio's `home.webp`.*

TAG: Custom Web Apps
BUILT FOR: A small brand with something to sell, and a café that posts its specials and events
HEADLINE: A coffee brand built to sell: buy a bag, subscribe, or build a bundle.

A whole brand for a made-up family coffee business: the logo, the art, the words and the site. Shoppers buy a bag, subscribe or build a bundle. The café page has the menu, specials and events. The owner sees the orders and posts specials.

**WHAT MADE IT INTERESTING:** it is a brand, not only a shop. The look and the story come first, and the shop is built on top.

**TRY IT:** Open the site. No sign-up. Buy a bag with the Stripe test card, then open the owner’s side to see the order. No card is charged.

**PULL QUOTE** *(drafted)*: Buy once, subscribe, or build a bundle, and the owner sees every order.

METADATA — TITLE: `TEKGUYZ | Coffee Brand & Shop`
DESCRIPTION: `A coffee brand built to sell: a shop with subscriptions and bundles, a café page with specials and events, and the owner’s side. Try it yourself.`

## `/work/everyday-helpers` — Everyday Helpers

*Added 2026-11-20 (#91), Custom Web Apps. Words from the fancyfam repo (README, PRODUCT.md) and the portfolio's entry. Plain words: never "AI" or "agent". Live link: https://fancyfam.com, a "coming soon" page, so there is no Try it line. Poster: the portfolio's `crew-desktop.webp`.*

TAG: Custom Web Apps
BUILT FOR: Families with people who never touch a settings screen
HEADLINE: Four friendly helpers for the everyday stuff, in plain words.

Four felt characters, each good at one chore: checking a fishy text or a high price, writing an email, keeping reminders, or a chat. You ask the way you text a friend. For now it is a “coming soon” page.

**WHAT MADE IT INTERESTING:** the house rules come first. A helper never spends your money, never sends without asking, and never shares what you tell it.

METADATA — TITLE: `TEKGUYZ | Everyday Helpers`
DESCRIPTION: `Four friendly helpers for emails, fair prices and reminders, in plain words. A phone-first “coming soon” page with no sign-up.`

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

BOOKING LINE (added 2026-10-03, #33; **drafted, not transcribed** — written from PLAYBOOK §4 and the trust line, sentence case because it starts something the visitor can abandon): Prefer to skip the form? **Book a free first conversation** → `site.bookingUrl` (Cal.com, new tab). Sits directly under the form card (the first placement, between the intro and the trust lines, read as an orphan on the owner's test). **Since 2026-10-11 (#40) it is a `secondary` outline button** (size `nav`) under the line "Prefer to skip the form?"; the founder's one job for the page is contact, and the small link was easy to miss. Never an accent fill.

## Form — two steps

**Step 1 — What do you want fixed?** (changed 2026-10-11, #40; **drafted** from playbook v3 § 3)
- "What kind of help?" (required) — placeholder "Pick the closest one". Visitor reads: Stop doing repeat work by hand / Answer my phones / Put everything in one place / Build a tool for how I work / Something else / Not sure yet. Saved values are unchanged: Smart Operations / AI Voice Agents / Business Systems / Custom Web Apps / Something else / Not sure yet
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
Every one. They're live applications. Open any of them and use it yourself.

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

*Updated 2026-11-16 (#81, **drafted**): Booking a Call (Cal.com), Spam and Abuse Protection (Upstash, IP rate limit), Our Live Demos (each sentence checked against that demo's live landing page the same day), and Upstash named in Third-Party Services and Data Retention. Rewritten 2026-08-12 (Build Phase 3), replacing the text that was live through July. Update the LAST UPDATED date if anything changes. **Still needs real legal review before being treated as final** — that has not changed.*

EYEBROW: LEGAL
HEADLINE: Privacy Policy
LAST UPDATED: November 16, 2026

TEKGUYZ ("we," "us") respects your privacy. This page explains what information we collect through this website, why, and how you can reach us about it.

**Information We Collect** — If you use our contact form or talk with our AI concierge, we collect the name, email address, phone number (optional), company (optional), area of interest, estimated budget (optional), and project details you provide. We use this only to respond to your inquiry — we don't sell it, rent it, or share it with third parties for marketing purposes.

**The AI Concierge** — If you use the chat assistant on this site, your conversation is sent to Google's Gemini AI to generate a response. Anything you share there — including contact details — may be captured as an inquiry the same way a contact form submission would be.

**Our CRM** — Inquiries submitted through the contact form or the concierge are forwarded to TEKGUYZ's own customer relationship system, not only to an inbox, so our team can track and respond to them properly.

**Booking a Call** — The free first conversation is booked on Cal.com. When you pick a time there, Cal.com collects the name, email and any notes you give it, under its own privacy policy, and sends the booking to us.

**Spam and Abuse Protection** — To stop spam, the contact form and the chat assistant limit how often one IP address can send. The count is kept in Upstash, a data service, for a few minutes at most, and is not tied to your name or email.

**Website Analytics** — This site and our live demos use Google Analytics to understand aggregate traffic: which pages are viewed, roughly where visitors are located, what device they use, and which link or site brought them here. Google Analytics sets cookies in your browser to tell visits apart. We do not use it to identify you personally, and we do not use it for advertising.

**Third-Party Services** — We use Resend to deliver contact form and concierge submissions to our inbox, Google (Gemini) to power the AI concierge, Upstash for the spam limit and the backup copy described below, Cal.com for booking calls, Google Analytics for the traffic counts described above, and Vercel to host this site. None of these services receive more information than described here.

**Our Live Demos** — Our Work page links to live demos. Each one is a separate site on its own address, built on made-up businesses and sample data, and none needs a sign-up. Most keep nothing: in Missed Call Follow-Up, No-Show Rescue, Book Your Visit and Team Performance nothing leaves your browser, and in Quote to Paid, Win-Back, Cart Reminders and Coffee Brand & Shop no message is sent and no card is charged (Cart Reminders and Coffee Brand & Shop run a real Shopify store and Stripe in test mode). The AI Voice Receptionist asks for your microphone only when you call, keeps only the words, never your voice, and deletes them after 7 days. Field Photo Reports gives you your own copy with sample data and deletes it after 7 days. The Lead & Pipeline CRM gives you your own workspace of sample data, with email, import and invites switched off. AI Meeting Notes opens sample notes; recording a real meeting needs an account, and accounts are by invitation only. Each demo's own landing page says what it does before you start.

**Data Retention** — We keep contact and concierge inquiries only as long as needed to respond to you and for reasonable business record-keeping afterward. If our system briefly fails to deliver your inquiry internally, a secure backup copy is kept in Upstash for up to 90 days so nothing gets lost, then it's automatically deleted.

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
