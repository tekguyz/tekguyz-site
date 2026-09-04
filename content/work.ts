import type { SolutionSlug } from '@/config/solutions';

/**
 * The typed array that drives /work, all 6 detail pages, generateStaticParams,
 * JSON-LD, per-slug OG images, the live status checks, and sitemap lastModified.
 *
 * Adding an entry here must produce a complete page with no template work.
 *
 * Copy is verbatim from docs/COPY.md. Demo URLs are from PLAYBOOK §6/§7 — the
 * only documented source for them.
 */

export type WorkKind = 'case-study' | 'project';

interface WorkBase {
  slug: string;
  kind: WorkKind;
  name: string;
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

/**
 * Date the 2026-09-04 lineup change was authored: three builds retired
 * (`restaurant-menu`, `auto-detailer`, `meeting-organizer`), `bundle-builder`
 * moved from case study to project, and two entries added — `ai-meeting-notes`
 * (which supersedes the retired `ai-audio-file-insights`, the same product one
 * full rewrite later) and `tekguyz-crm`.
 */
const REVISED = '2026-09-04';

export const work: WorkEntry[] = [
  {
    slug: 'field-photo-reports',
    kind: 'case-study',
    name: 'Field Photo Reports & Quality Tracking',
    tag: 'BUSINESS SYSTEMS',
    solution: 'business-systems',
    headline: 'Capture instant photo proof from the field to guarantee job quality.',
    url: 'https://rs-field-ops.netlify.app',
    poster: '/media/field-ops-thumb.webp',
    alt: 'Field Photo Reports admin dashboard showing structured job reports with timestamped installer photos',
    embeddable: false,
    updatedAt: AUTHORED,
    challenge:
      "Project managers couldn't verify field work without driving to the site. Crew notes came back too messy to share with a client, so any dispute about what was actually done turned into someone's word against someone else's — and usually a return trip to find out.",
    approach:
      'We built a photo-capture system that installers use on their phones in the field. Photos feed straight into structured digital reports, tied to the job and timestamped, so the record exists before anyone leaves the site. Admins see everything from the office in real time.',
    // Reworded 2026-08-13, in sync with COPY.md: the "seeing / what they're
    // seeing" repetition is gone and the faster-billing outcome is stated.
    // Still no statistic — the [NEEDS REAL DATA] marker was never filled and
    // is now retired, because a qualitative outcome carries the sentence.
    outcome:
      'Fewer return trips, faster dispute resolution, and invoices that go out the same day instead of waiting on paperwork from the field.',
    pullQuote:
      "Fewer return trips, faster dispute resolution, and invoices that don't wait on paperwork.",
    tryIt:
      'The demo has a switcher at the top — toggle between the Admin view and two different Installer accounts to see both sides of the same job.',
    howItsBuilt:
      'Mobile-first capture with a desktop admin view, structured job records, and role-based access so installers see their work and admins see all of it.',
    title: 'TEKGUYZ | Field Photo Reports & Quality Tracking',
    description:
      'A live field-photo capture system that replaces site visits with instant, shareable reports. Try the real Admin and Installer views yourself.',
  },
  {
    slug: 'ai-meeting-notes',
    kind: 'case-study',
    name: 'AI Meeting Notes & Transcription',
    tag: 'SMART OPERATIONS',
    solution: 'smart-operations',
    headline: 'Get the notes, the takeaways, and the action items without sending a bot to the call.',
    url: 'https://squid-ink.vercel.app',
    poster: '/media/squid-ink.webp',
    alt: 'AI meeting notepad showing generated takeaways with timestamp citations, per-speaker stats, and the diarized transcript alongside',
    embeddable: false,
    updatedAt: REVISED,
    challenge:
      "Meeting notes either don't get written or don't get read. The tools that promise to fix it send a bot to sit in the call — which is awkward in front of a client, blocked outright by plenty of IT policies, and still leaves you with a wall of transcript nobody goes back to.",
    approach:
      'We built a notepad that records the call straight from the browser, so nothing joins the meeting and nobody has to be invited. It transcribes with the speakers separated, then writes the summary, the takeaways, and the action items — and every line it writes carries a link back to the exact moment in the transcript that supports it.',
    outcome:
      'A written record of the meeting exists whether or not anyone took notes, and every claim in it can be checked against what was actually said instead of taken on trust.',
    pullQuote:
      'No bot joins the call — and every takeaway links back to the second of the transcript it came from.',
    tryIt:
      'Sign in with your email. It sends a link back, so there is no password to make up.',
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
    tag: 'BUSINESS SYSTEMS',
    solution: 'business-systems',
    headline: 'Track every lead from first enquiry to closed deal, in one pipeline.',
    // `/demo`, never the bare origin. The origin is login-gated with no public
    // route, so it resolved to a sign-in wall while the status line beside it
    // read "Live" — true, and not what "Live demo" promises. `/demo` signs the
    // visitor into a seeded instance in one click. Verified 2026-09-04: the
    // bare origin 307s to `/login`; `/demo` 307s to `/` and lands on the real
    // app. **Check it without `curl -L`** — following the redirect reports a
    // misleading 200 from the login page, which is what made this look ready a
    // day before it was.
    url: 'https://tekguyz-crm.vercel.app/demo',
    poster: '/media/tekguyz-crm.webp',
    alt: 'Lead and pipeline CRM reporting view showing open pipeline by stage, closed leads by outcome, and a win-rate figure',
    embeddable: false,
    updatedAt: REVISED,
    challenge:
      'Enquiries arrive in an inbox, a phone log, and a form notification, while the businesses you went out and found sit in a spreadsheet nobody opens twice. The follow-up lives in somebody’s head, nothing tells you which leads have gone quiet, and nothing records what the pipeline was actually worth once the dust settled.',
    // BOTH DIRECTIONS ARE NAMED, and that is a correction rather than an
    // expansion. The poster is the Reports view, which counts prospects that
    // arrived through the OUTBOUND half, and this paragraph described only the
    // inbound form — so the page was explaining a system its own picture was
    // not showing.
    //
    // The staging lane is stated rather than smoothed over, because it is the
    // load-bearing part. A scraped business is a `prospects` row and becomes a
    // `leads` row only when a human presses Promote after a real conversation.
    // "Leads flow in automatically" would describe something deliberately NOT
    // built, and would put uncontacted strangers into the pipeline the business
    // actually runs on. See docs/kb/leadgen.md.
    approach:
      'We built the CRM we run TEKGUYZ on, and work reaches it from both directions. Inbound, the contact form on this site posts straight in over a signed webhook, so an enquiry becomes a tracked lead with nobody re-typing anything. Outbound, a lead-finding pipeline we built alongside it goes and finds qualified local businesses, and those land in their own staging lane — cold prospects, never leads, until a real conversation promotes one across.',
    outcome:
      'Everything worth chasing lives in one pipeline instead of an inbox and a spreadsheet. A lead cannot quietly go cold without showing it, and closed work carries a recorded outcome and revenue figure rather than an inference from an archived row.',
    pullQuote:
      'The contact form on this page posts into it. This is the system we run our own business on.',
    // Promises BROWSING, never editing, and that is a factual constraint rather
    // than a hedge: the demo visitor is a Postgres role holding SELECT and
    // nothing else, so a write is refused by the database, not by the UI. Copy
    // that implied "create a lead and see what happens" would be describing a
    // thing the visitor is about to be denied.
    tryIt:
      'One click puts you inside a live, seeded copy — no signup, no password, no email. It is read-only, so browse the whole thing: the day’s agenda, the pipeline board, a lead’s full timeline, the revenue report. Nothing to save, nothing to break.',
    howItsBuilt:
      'Multi-tenant Postgres with row-level security, signed webhook lead capture, a prospect-import path fed by our own lead-finding pipeline, role-checked writes, AI spam triage and voice-memo transcription, and a weekly revenue report that emails itself. The public demo is a separate read-only database role, so the tour cannot reach anything real.',
    title: 'TEKGUYZ | Lead & Pipeline CRM',
    description:
      'A multi-tenant CRM fed by website enquiries and by our own lead-finding pipeline, that flags follow-ups before they go cold and records what the pipeline was actually worth.',
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
    alt: 'AI Voice Receptionist dashboard showing a customer profile, live conversation feed, and the confirmation email',
    embeddable: false,
    updatedAt: AUTHORED,
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
    slug: 'bundle-builder',
    kind: 'project',
    name: 'Shopify Bundle Builder & Storefront',
    tag: 'CUSTOM WEB APPS',
    solution: 'custom-web-apps',
    headline: "A custom storefront built directly on Shopify's API for bundled products.",
    url: 'https://reporter-resource-temp.vercel.app',
    poster: '/media/shopify-configurator.webp',
    alt: 'Bundle Builder storefront with product options and a running total that updates as the bundle is assembled',
    embeddable: false,
    updatedAt: REVISED,
    builtFor: 'Retailers selling configurable, bundled, or made-to-order products',
    summary:
      "A headless storefront built directly on Shopify's API rather than against the theme, for a catalog where a workstation is assembled from hardware, software, and accessories. Options update the running total instantly, and checkout hands off to Shopify's own secure flow — so payments, orders, and fulfillment never had to be rebuilt or re-secured.",
    whatMadeItInteresting:
      "knowing which part not to build. The interesting engineering is the configurator; the payment stack already existed and was already trusted, so the job was joining the two cleanly rather than replacing either.",
    tryIt:
      'The demo is fully sandboxed. Check out for real using `1` as the card number and any other test details.',
    title: 'TEKGUYZ | Bundle Builder — Custom Shopify Storefront',
    description:
      "A configurable product storefront built directly on Shopify's API. Build a bundle, watch the total update instantly, then check out for real in the live demo.",
  },
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
 * WHY THESE FOUR SPECIFICALLY. Every slot is a CASE STUDY, and that is the
 * rule now — the board is four builds with a story behind each, so the tier a
 * card links into is the same for all four.
 *
 * [decided 2026-08-29, replacing the 2026-08-14 selection] The amber slot was
 * `team-performance`, a PROJECT, chosen so the homepage would not repeat
 * itself: the ink band below carries `field-photo-reports` at full size. Two
 * things unwound that argument.
 *
 * 1. THE NO-REPEAT RULE WAS ALREADY BROKEN, and by more than this. Measured:
 *    `ai-voice-receptionist` is the hero's poster, the violet card here, AND
 *    the second row of the ink band — three appearances on one page. Holding
 *    the amber slot to a standard the flagship never met was buying nothing.
 * 2. IT WAS THE ONE PROJECT AMONG THREE CASE STUDIES. On a row of four
 *    identically-shaped cards that difference is invisible to the visitor and
 *    real in the content — one card led somewhere thinner than the others.
 *
 * `field-photo-reports` now appears twice, in two registers: a tagged index
 * entry here, a full-size row with a poster and a pull-quote below. That is the
 * same trade already accepted for the voice build, and it is the cheaper of the
 * two costs.
 *
 * WHAT THIS GIVES UP, stated rather than buried: `team-performance` is the
 * build the verified Google review describes, so the fold's review fact and its
 * amber card are no longer the same claim from two directions. The review fact
 * still stands on its own — it links to Google, which is where it is checkable.
 *
 * [amended 2026-09-04] TWO OF THE FOUR SLOTS CHANGED, and the "every slot is a
 * case study" rule above now has ONE EXCEPTION that is named rather than
 * quietly broken. `ai-audio-file-insights` became `ai-meeting-notes` — the same
 * product one full rewrite later, so the smart-operations slot is unchanged in
 * kind. `bundle-builder` moved from case study to PROJECT in the same change,
 * at the owner's direction, and it is the only build on the custom-web-apps
 * line, so the teal slot is now a project card. The alternative was leaving
 * teal empty, which destroys the four-accent legend this board exists to be —
 * a thinner fourth card is the cheaper cost. If a second custom-web-apps case
 * study ever ships, this slot should take it.
 */
export const foldSlugs = [
  'ai-meeting-notes',
  'ai-voice-receptionist',
  'field-photo-reports',
  'bundle-builder',
] as const;

export const foldBoard = foldSlugs
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
