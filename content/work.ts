import type { SolutionSlug } from '@/config/solutions';

/**
 * The typed array that drives /work, every detail page, generateStaticParams,
 * JSON-LD, per-slug OG images, the live status checks, and sitemap lastModified.
 *
 * Adding an entry here must produce a complete page with no template work.
 *
 * Copy is verbatim from docs/COPY.md. Demo URLs are from PLAYBOOK §6/§7 — the
 * only documented source for them.
 */

export type WorkKind = 'case-study' | 'project';

/**
 * What the home hero layers on its poster. Both parts are optional.
 * `video` is a loop of under 5 seconds, no sound, whose first frame is the
 * poster. `phone` is a real phone capture, about 0.62 wide to tall.
 */
export interface HeroMedia {
  video?: { mp4: string; webm: string };
  phone?: { src: string; alt: string };
}

interface WorkBase {
  slug: string;
  kind: WorkKind;
  name: string;
  /** Short label for tight spots such as the footer. Falls back to `name`. */
  shortName?: string;
  /** Uppercase tag label, e.g. "BUSINESS SYSTEMS". */
  tag: string;
  solution: SolutionSlug;
  headline: string;
  /** Live demo URL — drives LiveFrame, the status HEAD check, and SoftwareApplication.url. */
  url: string;
  /** 16:10 poster for compact contexts (case-study rows, detail pages). */
  poster: string;
  /** Optional distinct 16:9 asset for the home hero. */
  heroPoster?: string;
  /**
   * Optional 16:9 art-direction crop of `heroPoster` for viewports below
   * 1024px. Not a second capture — a tighter crop of the same real screenshot,
   * because a multi-panel dashboard scaled to a ~330px column is an illegible
   * smear (D-08) and `cover` cannot help: source and frame are both 16:9, so
   * there is no overflow for `object-position` to shift. Guarded by
   * `check:media` at 16:9 like the other two.
   */
  heroPosterMobile?: string;
  /** Optional extras layered on the home hero poster. */
  heroMedia?: HeroMedia;
  alt: string;
  /**
   * Live-iframe embeds are architected for but not enabled. Flipping this to
   * true requires `frame-ancestors https://tekguyz.com` on the demo app first.
   */
  embeddable: boolean;
  /** Drives sitemap lastModified. */
  updatedAt: string;
  title: string;
  description: string;
}

export interface CaseStudy extends WorkBase {
  kind: 'case-study';
  challenge: string;
  approach: string;
  outcome: string;
  pullQuote: string;
  tryIt: string;
  howItsBuilt: string;
}

export interface Project extends WorkBase {
  kind: 'project';
  builtFor: string;
  summary: string;
  whatMadeItInteresting: string;
  tryIt?: string;
  /** Team Performance is the build the verified Google review describes. */
  hasClientReview?: boolean;
}

export type WorkEntry = CaseStudy | Project;

/**
 * updatedAt: not documented in any source file. Set to the date this content was
 * authored into COPY.md rather than back-dating invented history. Flagged as an
 * assumption — correct these if real publish dates exist.
 */
const AUTHORED = '2026-08-05';

/*
 * Lineup history. The dates below were constants until 2026-10-01, when the
 * refresh below touched every entry that used them; the record stays here.
 *
 * 2026-09-04: three builds retired (`restaurant-menu`, `auto-detailer`,
 * `meeting-organizer`), `bundle-builder` moved from case study to project, and
 * two entries added — `ai-meeting-notes` (which supersedes the retired
 * `ai-audio-file-insights`, the same product one full rewrite later) and
 * `tekguyz-crm`.
 *
 * 2026-09-28 (#13, pass 1): `field-photo-reports` moved to its v2 build with new
 * copy and poster, `ai-meeting-notes` got a new Try it line, and
 * `bundle-builder` was removed — its Shopify store was cancelled and the demo
 * showed a real company's products and prices.
 *
 * 2026-09-29 (#13, pass 2): `private-meetup-app` added as the fifth case study.
 */

/**
 * Date of the 2026-10-01 refresh: five posters re-captured, and the work list
 * reordered so the four builds with a one-click demo lead (Field Photo Reports,
 * AI Meeting Notes, Lead & Pipeline CRM, Private Meetup App), then the voice
 * receptionist, then Team Performance.
 */
const REFRESH_2026_10_01 = '2026-10-01';

export const work: WorkEntry[] = [
  {
    slug: 'field-photo-reports',
    kind: 'case-study',
    name: 'Field Photo Reports & Quality Tracking',
    shortName: 'Field Photo Reports',
    tag: 'BUSINESS SYSTEMS',
    solution: 'business-systems',
    headline: 'One Report from the job site, with the proof printed on every photo.',
    // The public demo deploy (tekguyz/realstone-field-ops#64): it plays the
    // made-up Seagrape Stone Co., never the real shop. The bare origin is the
    // landing page, and only its two buttons sign a visitor in —
    // DEMO-STANDARD's "a link opens the landing page" rule.
    url: 'https://field-photo-reports.vercel.app',
    // 1080x675, the top of the app's own `showcase/visit-feed-light.png` (cut at
    // y=108), taken from the Seagrape demo with `tools/capture` on 2026-10-05.
    // The feed picture shows the app in its phone layout, so it fills a 16:10
    // frame; the desktop picture left wide gray sides. Swapped 2026-10-06.
    poster: '/media/field-reports-thumb.webp',
    // The home hero (#20). `field-reports-hero.webp` is 1040x585, the top of the
    // same office Visit view, cropped from the first frame of the loop
    // `tools/capture` made on 2026-10-05 (the loop scrolls that page). On
    // 2026-10-06 it was cut tight to the app (x=196, 1040 wide) so the app's own
    // gray side margin is gone and its text reads about 40% larger; the loop
    // files got the same cut so the poster and the video still match. On
    // 2026-10-07 the app's showcase was retaken on a wider layout with no gray
    // sides, so the hero is now the top 1440x810 of the new `visit-desktop`
    // loop, scaled to 1040 wide, with no side cut. The phone
    // is `installer-visits-phone-light.png` from the app's `showcase/`, cropped
    // to 780x1250. Real captures, never restyled.
    heroPoster: '/media/field-reports-hero.webp',
    heroMedia: {
      video: {
        mp4: '/media/field-reports-hero.mp4',
        webm: '/media/field-reports-hero.webm',
      },
      phone: {
        src: '/media/field-reports-phone.webp',
        alt: 'Field Photo Reports Installer app on a phone: today’s Visit, an upcoming Visit, and past Visits with their state',
      },
    },
    alt: 'Field Photo Reports office view of one Visit: the job, customer, Installer and address, a Submitted stamp, and a Report flagged No Before photo',
    embeddable: false,
    updatedAt: REFRESH_2026_10_01,
    // Rewritten 2026-09-28, in sync with COPY.md. The client stays unnamed, as
    // on the voice receptionist page. "3 to 5 days" is the shop's documented
    // starting point (the app's PRODUCT.md), not a result — no result is
    // stated as measured, because none is.
    challenge:
      'A stone fabrication shop sent its installers out with paper. Photos went through one app, messages to the office through another, and the owners got an email somewhere else. The office pieced the job together afterward, and sales often waited 3 to 5 days before they could bill for work that was already done.',
    approach:
      'We built one place for the whole Visit. At the end of a job, the Installer sends one Report from their phone: photos, a note, any Issues, and a sign-off from whoever is on site. The crews are Spanish-first and often work with dirty hands, so every screen reads in English or Spanish and the key actions fit without long scrolling. In the office, each Report arrives live, with nothing to refresh.',
    outcome:
      'Marking a Report Reviewed is the signal to bill: the Salesperson knows the job is done and proven, without waiting on paper from the field. The photos, the note, the Issues and the sign-off stay together on one record instead of across paper, two apps and an email.',
    pullQuote:
      'Every Live photo carries its own proof: job, time, place and Installer, printed into the picture.',
    tryIt:
      'Pick a side on the landing page: As Office staff, or As an Installer. Either button opens your own workspace with sample Visits — no sign-up, and it is deleted after 7 days. Try both to see each end of the job.',
    howItsBuilt:
      'A phone-first Installer app and a dense desktop Office view on one live database. Every photo carries its time, place and source, and says so honestly when it has none. English and Spanish throughout, light and dark mode, installable to the home screen, and built to sit beside the shop’s existing business system rather than replace it.',
    title: 'TEKGUYZ | Field Photo Reports & Quality Tracking',
    description:
      'Installers send one Report with stamped photos from the job site, and the office sees it live. Try it yourself as Office staff or as an Installer.',
  },
  {
    slug: 'ai-meeting-notes',
    kind: 'case-study',
    name: 'AI Meeting Notes & Transcription',
    shortName: 'AI Meeting Notes',
    tag: 'SMART OPERATIONS',
    solution: 'smart-operations',
    headline: 'Get the notes, the takeaways, and the action items without sending a bot to the call.',
    url: 'https://squid-ink.vercel.app',
    poster: '/media/squid-ink.webp',
    alt: 'AI Meeting Notes, close up: the reading lenses (Neutral Analyst, Sales Coach, Investor), quick actions, and the title of a sample meeting note',
    embeddable: false,
    updatedAt: REFRESH_2026_10_01,
    challenge:
      "Meeting notes either don't get written or don't get read. The tools that promise to fix it send a bot to sit in the call — which is awkward in front of a client, blocked outright by plenty of IT policies, and still leaves you with a wall of transcript nobody goes back to.",
    approach:
      'We built a notepad that records the call straight from the browser, so nothing joins the meeting and nobody has to be invited. It transcribes with the speakers separated, then writes the summary, the takeaways, and the action items — and every line it writes carries a link back to the exact moment in the transcript that supports it.',
    outcome:
      'A written record of the meeting exists whether or not anyone took notes, and every claim in it can be checked against what was actually said instead of taken on trust.',
    pullQuote:
      'No bot joins the call — and every takeaway links back to the second of the transcript it came from.',
    tryIt:
      'Press Try the demo on its landing page. One click opens the sample notes — no email, no password. Follow any takeaway back to the line it came from, or ask the notes a question.',
    howItsBuilt:
      'In-browser system and microphone capture, batch transcription with speaker separation, and a second pass that turns the transcript into a summary, takeaways, and traceable action items. Reading lenses change how the same recording is analyzed without re-recording it.',
    title: 'TEKGUYZ | AI Meeting Notes & Transcription',
    description:
      'An AI meeting notepad that records without sending a bot to the call, then writes summaries, takeaways, and action items you can trace back to the transcript.',
  },
  {
    slug: 'tekguyz-crm',
    kind: 'case-study',
    name: 'Lead & Pipeline CRM',
    shortName: 'Lead & Pipeline CRM',
    tag: 'BUSINESS SYSTEMS',
    solution: 'business-systems',
    headline: 'Track every lead from first enquiry to closed deal, in one pipeline.',
    // The bare origin is the CRM's landing page. Its "Try the demo" button is
    // the only thing that signs a visitor in (DEMO-STANDARD). Verified
    // 2026-10-02: the origin returns 200; `/demo` now just redirects to it.
    // **Check it without `curl -L`** — following a redirect hides where it went.
    url: 'https://tekguyz-crm.vercel.app/',
    poster: '/media/tekguyz-crm.webp',
    alt: 'Lead and pipeline CRM Today view, close up: the Tasks Due list with the first two tasks and how many days overdue each one is',
    embeddable: false,
    updatedAt: REFRESH_2026_10_01,
    challenge:
      'Enquiries arrive in an inbox, a phone log, and a form notification, while the businesses you went out and found sit in a spreadsheet nobody opens twice. The follow-up lives in somebody’s head, nothing tells you which leads have gone quiet, and nothing records what the pipeline was actually worth once the dust settled.',
    // BOTH DIRECTIONS ARE NAMED, in the copy below. The poster is the Today view
    // (swapped from the Reports view on 2026-10-06, after the Today and
    // Pipeline redesign, tekguyz-crm#47), so it no longer proves the outbound
    // half by itself; the words carry that.
    //
    // Outbound is stated as it really works since 2026-09-30: researched leads
    // arrive as a file and are imported by hand. NEVER write "automatic" here,
    // and never name the research tool — the site names no tools or apps.
    approach:
      'We built the CRM we run TEKGUYZ on, and work reaches it from both directions. Inbound, the contact form on this site posts straight in over a signed webhook, so an enquiry becomes a tracked lead with nobody re-typing anything. Outbound, we research local businesses worth a call and import them into the CRM as a file, so the ones we went out and found sit in the same pipeline as the enquiries.',
    outcome:
      'Everything worth chasing lives in one pipeline instead of an inbox and a spreadsheet. A lead cannot quietly go cold without showing it, and closed work carries a recorded outcome and revenue figure rather than an inference from an archived row.',
    pullQuote:
      'The contact form on this page posts into it. This is the system we run our own business on.',
    // Since 2026-10-01 each visitor gets their own workspace of sample data and
    // can write in it (tekguyz-crm#29). The old read-only demo role is gone.
    // Email, import and invites are off in the demo, per the CRM's own landing
    // page, so never invite a visitor to try those.
    tryIt:
      'One click opens your own workspace with sample data — no signup, no password, no email. Add and change things as well as browse: the day’s agenda, the pipeline board, a lead’s full timeline, the revenue report. Email, import and invites are switched off in the demo.',
    howItsBuilt:
      'Multi-tenant Postgres with row-level security, signed webhook lead capture, a lead-import path for researched lead lists, role-checked writes, AI spam triage and voice-memo transcription, and a weekly revenue report that emails itself. Each demo visitor gets a private workspace of sample data, so the tour cannot reach anything real.',
    title: 'TEKGUYZ | Lead & Pipeline CRM',
    description:
      'A multi-tenant CRM fed by website enquiries and by researched lead lists, that flags follow-ups before they go cold and records what the pipeline was actually worth.',
  },
  {
    slug: 'private-meetup-app',
    kind: 'case-study',
    name: 'Private Meetup App',
    shortName: 'Private Meetup App',
    tag: 'CUSTOM WEB APPS',
    solution: 'custom-web-apps',
    headline: 'Small private meetups, where a person checks every card and the address stays hidden until the host says yes.',
    // The bare origin is the landing page; only its "Try the demo" button signs
    // a visitor in (DEMO-STANDARD). The app's brand name is in this url and
    // nowhere else on the site — `content/work.test.ts` fails if it leaks into
    // any other field.
    url: 'https://meet4weed.vercel.app',
    // 1080x675, cut from the app's own `showcase/list-feed-light.png` (at y=270),
    // taken in the demo: every member and meetup in it is invented. The app is
    // one phone-width column, so its desktop picture left wide empty sides; the
    // feed picture fills the frame. Swapped 2026-10-06.
    poster: '/media/meetup-thumb.webp',
    alt: 'Private Meetup App list view: category filters, a search box, a List and Map switch, and the first meetup card with its date and time',
    embeddable: false,
    updatedAt: REFRESH_2026_10_01,
    // Written 2026-09-29 (#13 pass 2), in sync with COPY.md, from the app's
    // PRODUCT.md and CONTEXT.md. No member count and no result is stated,
    // because none exists: it launches small and private.
    challenge:
      'Florida law lets medical cannabis patients consume at a private home. A meetup there only works if everyone in the room is a verified patient, 21 or older. An ordinary event app cannot promise that: it checks nobody’s card, and anyone who finds the page can find the house.',
    approach:
      'We built a members-only app around the gate. Every new member takes a live photo of their card, then of their face with a random challenge, and a person reviews each one by eye. AI reads the card and lists concerns, but it never decides. Hosts approve every guest by hand. Until they do, the map shows only a circle about half a mile across. The app never handles a sale of any kind.',
    outcome:
      'Every member at a meetup was checked by a person, and nobody outside the guest list knows where it is. Card and face photos are deleted when the reviewer decides, within 7 days at most, and the app forgets the address a week after the meetup.',
    pullQuote:
      'Hide by default, reveal by approval: nobody sees who or where until a person has said yes.',
    tryIt:
      'Press Try the demo on its landing page. One click opens your own visitor account among sample members and meetups — no card, no sign-up, and it is deleted after 7 days. Browse the list and the map, open a meetup, and see what stays hidden until a host says yes.',
    howItsBuilt:
      'A phone-first web app that installs to the home screen, on one database where every row is locked to who may see it. Verification is a one-step-per-screen camera flow with no gallery upload. Notifications name no member and no meetup, and the app stores no data on the phone. The demo runs in a sealed copy that can never reach a real member. Light and dark mode throughout.',
    title: 'TEKGUYZ | Private Meetup App',
    description:
      'A members-only meetup app for verified Florida medical cannabis patients. A person checks every card, the host approves every guest, and the address stays hidden until they do.',
  },
  {
    slug: 'ai-voice-receptionist',
    kind: 'case-study',
    name: 'AI Voice Receptionist & Call Booking',
    tag: 'AI VOICE AGENTS',
    solution: 'ai-voice-agents',
    headline: 'Answer every after-hours call like your best employee would, live, in real time.',
    url: 'https://tekguyz-sarah.vercel.app',
    // Decided, and now documented in PLAYBOOK §12: the compact 16:10 asset is
    // `sarah-thumb.webp`, matching the `-thumb` convention every other build
    // uses. It replaces `sarah-project-thumb.webp`, which appeared in no doc and
    // was a crop of the retired phone-call simulator — a PLAYBOOK §12 hard-rule
    // violation, not just a naming problem. `bun run check:media` fails the
    // build until the recaptured file lands; that is the guard working.
    poster: '/media/sarah-thumb.webp',
    // 1600x900 native — the hero's own 16:9 context, per DESIGN.md LiveFrame.
    heroPoster: '/media/sarah-poster.webp',
    // 1038x584, cropped from `sarah-poster.webp` at (12, 316) — the Live
    // Conversation Feed panel, whole, with its own left and right edges intact.
    // The full four-panel dashboard is unreadable below 1024px; this crop keeps
    // the one thing the hero has to prove — the AI holding a real booking
    // conversation, CALL ACTIVE — legible at ~330px. Same capture, so PLAYBOOK
    // §12 is satisfied by construction, and it is 33KB against the source's
    // 117KB, so mobile also pays less.
    heroPosterMobile: '/media/sarah-poster-mobile.webp',
    alt: 'AI Voice Receptionist dashboard panel listing live CRM sync: a caller just saved to a profile, and earlier callers already synced to the CRM',
    embeddable: false,
    updatedAt: REFRESH_2026_10_01,
    challenge:
      'A stone fabrication shop was losing leads to after-hours calls. The voicemail box was a dead end — callers with a real project either waited until morning or called someone else, and there was no way to know how many did which.',
    approach:
      'We built a real-time AI voice agent that answers, holds an actual conversation, captures the project details, and books the consultation on the spot. Alongside it, a live dashboard shows the call transcript, the CRM sync, and the follow-up email firing as it happens.',
    outcome:
      'Calls that used to end in voicemail now end in a booked consultation and a record in the CRM — with nothing left for anyone to type up in the morning.',
    pullQuote:
      'Watch the call, the CRM sync, and the follow-up email happen in real time — not after the fact.',
    tryIt:
      'Start a call in the demo and watch the dashboard on the same screen. Everything you see happening is happening.',
    howItsBuilt:
      'Real-time conversational voice AI with live transcription, structured lead extraction, calendar booking, and CRM write-through — all in one pass, no post-processing.',
    title: 'TEKGUYZ | AI Voice Receptionist — Live Demo',
    description:
      'A real-time AI voice agent that answers calls, books consultations, and syncs your CRM automatically. Watch it happen live, or call it yourself.',
  },
  // ---- Projects (lighter by design; project-card never carries an image) ----

  {
    slug: 'team-performance',
    kind: 'project',
    name: 'Team Performance & Automated Customer Feedback',
    tag: 'BUSINESS SYSTEMS',
    solution: 'business-systems',
    headline: 'Phone logs that credit the right person, and surveys that know when to stop.',
    url: 'https://advantage-teams.vercel.app/dashboard',
    poster: '/media/advantage-teams-thumb.webp',
    alt: 'Team Performance dashboard connecting desk-phone logs to CRM records with per-team-member job credit',
    embeddable: false,
    updatedAt: AUTHORED,
    builtFor: 'Service businesses with phone-based teams and customer follow-up surveys',
    summary:
      'Connects desk-phone logs directly to the CRM so team members get automatic credit for the jobs they actually handled — no manual entry, no micro-management. Paired with a smart-limit SMS feedback loop that only surveys a customer when it’s genuinely useful, instead of every single time.',
    whatMadeItInteresting:
      'the survey limiter. Most feedback tools send on every trigger, which trains customers to ignore them. Capping it protects the response rate and the customer relationship at the same time.',
    hasClientReview: true,
    title: 'TEKGUYZ | Team Performance & Automated Feedback',
    description:
      'Desk-phone logs connected straight to the CRM, plus a smart-limit SMS feedback loop that only surveys customers when it actually matters.',
  },
  /* RETIRED 2026-09-04, and the reason is worth keeping so nobody re-adds them.
   *
   * `meeting-organizer` (crispy-bacon.netlify.app) was the SAME PRODUCT as
   * `ai-meeting-notes` one full rewrite earlier. Listing both showed a visitor
   * one app twice, with the worse version presented as separate work.
   *
   * `restaurant-menu` (dragonfly-nica) and `auto-detailer` (the-executivedetailer)
   * were retired by the owner as carrying no real value for the site. Their
   * posters were deleted from `public/media/` in the same change, so
   * `check:media` would fail the build if an entry came back without one.
   *
   * RETIRED 2026-09-28 (#13): `bundle-builder`. The
   * owner cancelled its Shopify store, so checkout said the store was closed,
   * and the demo showed a real company's products and prices, which the demo
   * standard bans. Its poster went with it.
   *
   * All five retired slugs 308 to their replacement in `next.config.ts`, because
   * Google still lists some of them.
   */
];

/**
 * The number of live builds, SPELLED, for the two places copy says it out loud:
 * `/work`'s page hero and the home fold board's "See all N builds" link.
 *
 * Both of those read "eight" as a hand-typed word from 2026-08-29 until
 * 2026-09-04, when the lineup dropped to six and both sentences became false at
 * once. Nothing in the build could see it — a count typed into a string is
 * invisible to tsc, to ESLint, and to `check:media`, and the only reader who
 * would ever catch it is a visitor counting the cards.
 *
 * So it is derived. Prose spells counts under ten; past nine the digit is
 * correct anyway, and returning `String(n)` there is deliberate rather than a
 * gap. Callers capitalize at the sentence start themselves — this returns
 * lowercase, because that is what the mid-sentence caller needs and the
 * sentence-start caller is the one that can afford a helper.
 */
const SPELLED = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

export const buildCountWord = SPELLED[work.length] ?? String(work.length);

/** Sentence-start form of `buildCountWord`. */
export const buildCountWordCapitalized =
  buildCountWord.charAt(0).toUpperCase() + buildCountWord.slice(1);

export const caseStudies = work.filter((w): w is CaseStudy => w.kind === 'case-study');
export const projects = work.filter((w): w is Project => w.kind === 'project');

/**
 * Home shows exactly two, in this order (CANONICAL §4).
 *
 * [changed 2026-09-04] The second slot was `ai-voice-receptionist` and is now
 * `ai-meeting-notes` — **the first two of `caseStudies` in array order**, which
 * is what `/work` shows a visitor one click later. The old pair was left
 * untouched when the lineup was rewritten earlier the same day, so the home
 * band and the work index disagreed about which builds lead.
 *
 * It also fixes a repeat this page could not afford: `ai-voice-receptionist` is
 * ALREADY the hero's poster and the violet card on the fold board. Holding the
 * ink band as well made it three appearances on one page while
 * `ai-meeting-notes` had one. The voice build loses nothing — it is still the
 * hero, still on the board, still a case study.
 */
export const featuredSlugs = ['field-photo-reports', 'ai-meeting-notes'] as const;
export const featured = featuredSlugs
  .map((slug) => work.find((w) => w.slug === slug))
  .filter((w): w is CaseStudy => w?.kind === 'case-study');

/**
 * The homepage fold's build board — ONE live build per solution line, in
 * `STRIPE_ORDER` (blue → violet → amber → teal). Selection lives here rather
 * than in the component for the same reason `featuredSlugs` does: which builds
 * a page shows is content, not layout.
 *
 * The order is not editorial. Four cards carrying the four locked accents in
 * their canonical order makes the fold a LEGEND for the wayfinding system the
 * rest of the site then uses — a visitor meets all four accents attached to
 * four real product names before they reach the Solutions rows. Reordering
 * these breaks that; adding a fifth is impossible by construction, since there
 * is no fifth line.
 *
 * WHY THESE SPECIFICALLY. Every slot on the board is a CASE STUDY, so the tier
 * a card links into is the same for all of them.
 *
 * [2026-08-29] The amber slot moved from `team-performance` (a project) to
 * `field-photo-reports`, which then appears twice on home: a tagged entry
 * here and a full-size row in the ink band. The voice build already appeared
 * three times, so a no-repeat rule was buying nothing, and one thinner project
 * card among case studies led somewhere lighter than its neighbours. The cost:
 * `team-performance` is the build the verified Google review describes, so the
 * fold's review fact and its amber card no longer make the same claim. The
 * review fact still stands alone — it links to Google, where it is checkable.
 *
 * [2026-09-28, #13 pass 1] THE TEAL SLOT IS EMPTY, SO THE BOARD SHOWS THREE.
 * `bundle-builder` held it as a project — the one named exception to the rule
 * above — and was removed because its store was cancelled and its demo showed
 * a real company's products and prices. The owner chose three cards over
 * keeping that data up while the replacement waited for its screenshots.
 *
 * [2026-09-29, #13 pass 2] `private-meetup-app`, a custom-web-apps case study,
 * holds the teal slot. Four cards, four lines, and every one a case study: the
 * named exception is gone.
 *
 * `content/work.test.ts` fails if a slug here stops resolving, or if two cards
 * share a line or leave stripe order.
 */
export const foldSlugs = [
  'ai-meeting-notes',
  'ai-voice-receptionist',
  'field-photo-reports',
  'private-meetup-app',
] as const;

export const foldBoard = foldSlugs
  .map((slug) => work.find((w) => w.slug === slug))
  .filter((w): w is WorkEntry => Boolean(w));

/**
 * The footer's Work column: the four builds with a one-click demo, in the order
 * the owner set on 2026-10-01. Content, not layout, like `featuredSlugs`.
 * `content/work.test.ts` fails if a slug stops resolving.
 */
export const footerSlugs = [
  'field-photo-reports',
  'ai-meeting-notes',
  'tekguyz-crm',
  'private-meetup-app',
] as const;

export const footerWork = footerSlugs
  .map((slug) => work.find((w) => w.slug === slug))
  .filter((w): w is WorkEntry => Boolean(w));

export function getWork(slug: string): WorkEntry | undefined {
  return work.find((w) => w.slug === slug);
}

/**
 * prev/next within the same kind, so a case study never hands off to a project.
 */
export function adjacentWork(slug: string): { prev?: WorkEntry; next?: WorkEntry } {
  const entry = getWork(slug);
  if (!entry) return {};
  const siblings = entry.kind === 'case-study' ? caseStudies : projects;
  const i = siblings.findIndex((w) => w.slug === slug);
  return {
    prev: i > 0 ? siblings[i - 1] : siblings[siblings.length - 1],
    next: i < siblings.length - 1 ? siblings[i + 1] : siblings[0],
  };
}

export function workByName(name: string): WorkEntry | undefined {
  return work.find((w) => w.name === name);
}
