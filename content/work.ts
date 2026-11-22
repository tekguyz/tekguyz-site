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
  /**
   * Optional 16:10 close-up for the small /work featured card. A full desktop
   * capture shrunk to card width (about 276px) leaves its text about 3px tall,
   * so the card uses the top of the app's own feed picture (Drive
   * `social/<app>/feed/`, a real capture at phone width). The detail page keeps
   * `poster`. Falls back to `poster`.
   */
  cardPoster?: string;
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
  /**
   * Only for a project that leads its Solution on /work (a large card), which
   * shows a pull quote the way a case study row does.
   */
  pullQuote?: string;
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
 *
 * 2026-10-15: the owner reordered it again. The AI Voice Receptionist leads, as
 * the newest live demo. The Lead & Pipeline CRM is second, because its proof is
 * the strongest: it is the system TEKGUYZ runs on, and this site's contact form
 * posts into it. Then Field Photo Reports, AI Meeting Notes and the Private
 * Meetup App. Team Performance stays last, in its own project card.
 */
const REFRESH_2026_10_01 = '2026-10-01';

export const work: WorkEntry[] = [
  {
    slug: 'ai-voice-receptionist',
    kind: 'case-study',
    name: 'AI Voice Receptionist & Call Booking',
    // Card and page title since #98 (2026-11-22): "AI Voice Agents" over "AI Voice
    // Receptionist" said "AI voice" twice. The full name stays for SEO.
    shortName: 'Phone Receptionist',
    tag: 'AI VOICE AGENTS',
    solution: 'ai-voice-agents',
    headline: 'Answers the phone, writes down the job, and books the visit.',
    // The rebuilt demo (tekguyz/ai-voice-receptionist, live 2026-10-13). It
    // plays the made-up Mangrove Air, an AC repair shop in South Florida, and
    // its Receptionist is Luna. The old "Sarah" demo (tekguyz-sarah.vercel.app)
    // is retired: tekguyz/tekguyz-one#22, tekguyz/ai-voice-receptionist#10.
    // Copy below is from the app's README, PRODUCT.md and CONTEXT.md only.
    url: 'https://ai-voice-receptionist-tekguyz.vercel.app',
    // 1440x900, the app's own `showcase/sample-call-desktop-light.png`, taken
    // with `tools/capture` on 2026-10-14, converted to webp at quality 85. No
    // crop. No heroPoster: this entry is not the home hero.
    poster: '/media/voice-receptionist-thumb.webp',
    cardPoster: '/media/ai-voice-receptionist-card.webp',
    heroPoster: '/media/ai-voice-receptionist-hero.webp',
    alt: 'AI Voice Receptionist Sample Call for the made-up Mangrove Air: what Luna and the caller said on the left, and the job details on the right: name, job, urgency, address and booked time',
    embeddable: false,
    updatedAt: '2026-10-15',
    challenge:
      'Calls come in while the crew is on a job or after closing. A caller with a broken AC does not wait. They call the next shop.',
    approach:
      'Luna answers for Mangrove Air, a made-up AC repair shop. She takes the name, the job, how urgent it is and the address, then books a time. The work order fills in as she talks. She speaks Spanish too.',
    outcome:
      'The owner gets Call Notes for every call: the caller, the job, the urgency and the booked time. It is a demo, so nothing is sent.',
    pullQuote:
      'You do not watch a video of an AI receptionist. You call one, in one press.',
    tryIt:
      'Open the demo, press Call now and talk to Luna in your browser. No sign-up. No microphone? Play the Sample Call.',
    howItsBuilt:
      'The call runs in the browser. Each call gets a short-lived key, so the browser never holds the real one. Calls stop at 3 minutes. Only the words are kept, for 7 days, never the voice.',
    title: 'TEKGUYZ | AI Voice Receptionist — Live Demo',
    description:
      'Talk to Luna, an AI Receptionist for a made-up AC repair shop, right in your browser. Watch her write down the job and book a time, then see the owner’s Call Notes.',
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
    // The app's own `showcase/today-desktop-light.png` (retaken 2026-10-14
    // after the redesign), 1440x900, webp at quality 85 (#80, 2026-11-16).
    poster: '/media/tekguyz-crm.webp',
    alt: 'Lead and pipeline CRM Today view for a demo workspace: Tasks Due, SLA Critical, High-Value and Starred leads, each with its stage, value and how overdue it is',
    embeddable: false,
    updatedAt: REFRESH_2026_10_01,
    challenge:
      'Enquiries arrive by email, phone and form, and the businesses we found ourselves sit in a spreadsheet. The follow-up lives in someone’s head, and nobody sees which leads went quiet.',
    // BOTH DIRECTIONS ARE NAMED, in the copy below. The poster is the Today view
    // (swapped from the Reports view on 2026-10-06, after the Today and
    // Pipeline redesign, tekguyz-crm#47), so it no longer proves the outbound
    // half by itself; the words carry that.
    //
    // Outbound is stated as it really works since 2026-09-30: researched leads
    // arrive as a file and are imported by hand. NEVER write "automatic" here,
    // and never name the research tool — the site names no tools or apps.
    approach:
      'We built the CRM we run TEKGUYZ on. The contact form on this site posts straight into it, so an enquiry becomes a lead with no re-typing. Businesses we research are imported as a file, into the same pipeline.',
    outcome:
      'Every lead worth chasing is in one pipeline. A lead cannot go cold without showing it, and closed work records what it was worth.',
    pullQuote:
      'The contact form on this page posts into it. This is the system we run our own business on.',
    // Since 2026-10-01 each visitor gets their own workspace of sample data and
    // can write in it (tekguyz-crm#29). The old read-only demo role is gone.
    // Email, import and invites are off in the demo, per the CRM's own landing
    // page, so never invite a visitor to try those.
    tryIt:
      'Open the demo. One click opens your own workspace with sample data, no sign-up. Add and change things: the agenda, the pipeline, a lead’s timeline, the revenue report. Email, import and invites are off.',
    howItsBuilt:
      'Multi-tenant Postgres with row-level security, signed lead capture, a lead-import path, AI spam triage, voice-memo transcription and a weekly revenue email. Each demo visitor gets a private sample workspace.',
    title: 'TEKGUYZ | Lead & Pipeline CRM',
    description:
      'A multi-tenant CRM fed by website enquiries and by researched lead lists, that flags follow-ups before they go cold and records what the pipeline was actually worth.',
  },
  {
    slug: 'field-photo-reports',
    kind: 'case-study',
    name: 'Field Photo Reports & Quality Tracking',
    shortName: 'Field Reports',
    // Retagged from Business Systems by the founder, 2026-11-11.
    tag: 'CUSTOM WEB APPS',
    solution: 'custom-web-apps',
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
    // It was the home hero (#20) until 2026-11-11. Its hero picture, loop and
    // phone files were served by nothing after that and were deleted on
    // 2026-11-16 (#80, settles #70 item 2); git history has them.
    alt: 'Field Photo Reports office view of one Visit: the job, customer, Installer and address, a Submitted stamp, and a Report flagged No Before photo',
    embeddable: false,
    updatedAt: REFRESH_2026_10_01,
    // Rewritten 2026-09-28, in sync with COPY.md. The client stays unnamed.
    // "3 to 5 days" is the shop's documented
    // starting point (the app's PRODUCT.md), not a result — no result is
    // stated as measured, because none is.
    challenge:
      'A stone shop’s installers worked on paper. Photos, messages and emails went three different ways, the office pieced each job together afterward, and billing often waited 3 to 5 days.',
    approach:
      'At the end of a job, the Installer sends one Report from their phone: photos, a note, any Issues and a sign-off. Every screen reads in English or Spanish and works with dirty hands. The office sees each Report arrive live.',
    outcome:
      'Marking a Report Reviewed is the signal to bill. The photos, note, Issues and sign-off stay on one record.',
    pullQuote:
      'Every Live photo carries its own proof: job, time, place and Installer, printed into the picture.',
    tryIt:
      'Pick a side: Office staff or Installer. Either opens your own workspace with sample Visits, no sign-up, deleted after 7 days.',
    howItsBuilt:
      'A phone app for Installers and a desktop view for the office, on one live database. Every photo carries its time, place and source. English and Spanish, installable to the home screen, and built to sit beside the shop’s existing system.',
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
      'Meeting notes don’t get written, or don’t get read. The tools that fix it send a bot into the call, which is awkward with clients and blocked by many IT policies.',
    approach:
      'A notepad that records the call from the browser, so nothing joins the meeting. It separates the speakers, then writes the summary, takeaways and action items. Every line links back to the moment in the transcript that supports it.',
    outcome:
      'There is a written record of every meeting, and every claim in it can be checked against what was said.',
    pullQuote:
      'No bot joins the call — and every takeaway links back to the second of the transcript it came from.',
    tryIt:
      'Open the demo. One click opens the sample notes, no sign-up. Follow any takeaway back to its line, or ask the notes a question.',
    howItsBuilt:
      'Records system audio and the microphone in the browser, transcribes with the speakers separated, then a second pass writes the summary and traceable action items. Reading lenses change the analysis without re-recording.',
    title: 'TEKGUYZ | AI Meeting Notes & Transcription',
    description:
      'An AI meeting notepad that records without sending a bot to the call, then writes summaries, takeaways, and action items you can trace back to the transcript.',
  },
  // ---- Projects (lighter by design; project-card never carries an image) ----

  /*
   * 2026-11-10 (tekguyz-site#67, tekguyz/tekguyz-one#137, #138): the two
   * package demos, Missed Call Follow-Up (package A) and Quote to Paid
   * (package D), join as projects, ahead of Team Performance, which stays last.
   * Words are from tekguyz-one `projects/<repo>/about.md`. `url` is each
   * landing page, never the demo itself. Posters are each app's own
   * `showcase/` desktop capture, 1440x900, made-up businesses only.
   */
  {
    slug: 'missed-call-follow-up',
    kind: 'project',
    name: 'Missed Call Follow-Up',
    shortName: 'Missed Call Follow-Up',
    tag: 'AI VOICE AGENTS',
    solution: 'ai-voice-agents',
    headline: 'Every missed call gets an answer, and every lead lands in the pipeline.',
    url: 'https://missed-call-follow-up.vercel.app',
    // The app's own `showcase/lead-in-desktop-light.png` (webp), taken in the
    // demo: Keywind Roofing and its callers are made up.
    poster: '/media/missed-call-thumb.webp',
    // The home hero since 2026-11-11 (founder's pick). The top 1440x810 of the
    // same capture, and for below 1024px the phone and the alerts only
    // (x=0, y=160, 960x540), because the pipeline is a smear at phone width.
    heroPoster: '/media/missed-call-hero.webp',
    heroPosterMobile: '/media/missed-call-hero-mobile.webp',
    alt: 'Missed Call Follow-Up demo: the follow-up texts on the caller’s phone, the alerts to the owner, and the lead in the New column of the pipeline',
    embeddable: false,
    updatedAt: '2026-11-10',
    builtFor: 'Trade businesses that live on the phone: HVAC and AC repair, roofing, and boat and marine repair',
    summary:
      'A missed call gets a text, an email or a voice callback. It asks what is wrong, where and how soon. The lead lands on a board, and the owner gets an alert.',
    whatMadeItInteresting:
      'the business picks the channel. The same three questions go out by text, email or voice, and every answer lands on one board.',
    tryIt:
      'Open the demo. No sign-up. Call a made-up roofer, nobody answers, and watch the follow-up arrive and the lead land on the board. Nothing is sent.',
    title: 'TEKGUYZ | Missed Call Follow-Up',
    description:
      'When a call is missed, the caller hears back by text, email or a voice callback. The lead lands in a pipeline and the owner gets an alert. Try the one-click demo.',
  },
  {
    slug: 'quote-to-paid',
    kind: 'project',
    name: 'Quote to Paid',
    shortName: 'Quote to Paid',
    tag: 'BUSINESS SYSTEMS',
    solution: 'business-systems',
    headline: 'No quote or invoice goes quiet. Persistent, never pushy.',
    url: 'https://quotetopaid.vercel.app',
    // The app's own `showcase/board-day-summary-desktop-light.png` (webp),
    // taken in the demo: Gumbo Limbo Air, its customers and amounts are made up.
    poster: '/media/quote-to-paid-thumb.webp',
    cardPoster: '/media/quote-to-paid-card.webp',
    heroPoster: '/media/quote-to-paid-hero.webp',
    alt: 'Quote to Paid demo board: a summary of the follow-ups that went out by themselves, the quotes and invoices waiting, and the jobs that need the owner',
    embeddable: false,
    updatedAt: '2026-11-10',
    builtFor: 'Roofing and AC companies that send quotes and wait to get paid',
    summary:
      'Follows up by text on every unanswered quote and unpaid invoice. The invoice goes out when the crew marks the job done. The follow-ups stop when the customer answers or pays. One board shows what is waiting and who to call.',
    whatMadeItInteresting:
      'the stop rule. Any answer or payment ends the follow-ups, nothing goes out on Sundays, and there are never more than three.',
    tryIt:
      'Open the demo. No sign-up. Press Skip ahead a day and watch follow-ups go out and invoices get paid. Open any job to play the customer. Nothing is sent or charged.',
    pullQuote: 'Any answer or payment stops the follow-ups. The rules are simple enough to say out loud.',
    title: 'TEKGUYZ | Quote to Paid',
    description:
      'Follows up on every quote and every unpaid invoice by text, politely, until the customer answers or pays. Then it stops. Try the one-click demo.',
  },

  /*
   * 2026-11-11 (refs tekguyz/tekguyz-one#148, #149): the next two package
   * demos. No-Show Rescue is package C, Win-Back is package G. Words are from
   * each landing page and README; `url` is the landing page, never the demo.
   * Posters are each app's own `showcase/` desktop capture, 1440x900 (retaken
   * 2026-11-13 after the polish, refs tekguyz/tekguyz-one#162): No-Show Rescue
   * `slot-filled-desktop-light`, Win-Back `approve-desktop-light`.
   */
  {
    slug: 'no-show-rescue',
    kind: 'project',
    name: 'No-Show Rescue',
    shortName: 'No-Show Rescue',
    tag: 'AI VOICE AGENTS',
    solution: 'ai-voice-agents',
    headline: 'Fewer empty chairs: a reminder before the visit, a new time after a no-show.',
    url: 'https://no-show-rescue.vercel.app',
    poster: '/media/no-show-rescue-thumb.webp',
    alt: 'No-Show Rescue demo: the patient’s text thread with the new time, and the front desk’s schedule with the open chair filled from the short-notice waitlist',
    embeddable: false,
    updatedAt: '2026-11-11',
    builtFor: 'Dental and vet practices',
    summary:
      'A reminder text goes out the day before a visit. After a no-show, the patient is offered a new time, and the open slot goes to a short-notice waitlist. After the visit, happy patients get the review link, and the others reach the front desk privately.',
    whatMadeItInteresting:
      'the empty chair. Rebooking the patient is half the job. The other half is filling the slot today, from the waitlist.',
    tryIt:
      'Open the demo. No sign-up. Play a patient at a made-up dental practice: miss the visit, pick a new time, and watch the front desk fill the chair. Nothing is sent.',
    title: 'TEKGUYZ | No-Show Rescue',
    description:
      'Reminders before a visit, a new time offered after a no-show, the open slot filled from a waitlist, and a review request after. Try the one-click demo.',
  },
  {
    slug: 'win-back',
    kind: 'project',
    name: 'Win-Back',
    shortName: 'Win-Back',
    tag: 'SMART OPERATIONS',
    solution: 'smart-operations',
    headline: 'Bring back the customers who stopped calling.',
    url: 'https://win-back-customers.vercel.app',
    poster: '/media/win-back-thumb.webp',
    cardPoster: '/media/win-back-card.webp',
    heroPoster: '/media/win-back-hero.webp',
    alt: 'Win-Back demo: drafted messages to past customers, each one approved by the owner, with an edit or skip link, before anything is sent',
    embeddable: false,
    updatedAt: '2026-11-11',
    builtFor: 'AC and heating companies with yearly service, and dental and vet offices with recalls',
    summary:
      'Reads the customer records the business already keeps and finds who stopped coming back. A short report says who and why, and each one gets a drafted message. The owner approves, changes or skips every one, and a reply can book a visit.',
    whatMadeItInteresting:
      'there is no approve-all button. Every message waits for the owner, and anyone who asked not to get texts stays off the list.',
    tryIt:
      'Open the demo. No sign-up. Read the report for a made-up AC company, approve the messages you like, and watch a reply book a visit. Nothing is sent.',
    pullQuote: 'Nothing goes out until the owner approves it, one customer at a time.',
    title: 'TEKGUYZ | Win-Back',
    description:
      'Finds past customers who stopped coming back in your own records, says who and why, and drafts a message to each for you to approve. Try the one-click demo.',
  },

  /*
   * 2026-11-12 (refs tekguyz/tekguyz-one#152): Book Your Visit, a Custom Web Apps
   * demo. It leads Custom Web Apps on /work, so it has a pull quote. Words are
   * from tekguyz-one `projects/book-your-visit/about.md`. `url` is the landing
   * page (bookyourvisit.vercel.app), never the demo. The poster is the app's own
   * `showcase/webp/booking-page-desktop-light.webp`, 1440x900, made-up business.
   */
  {
    slug: 'book-your-visit',
    kind: 'project',
    name: 'Book Your Visit',
    shortName: 'Book Your Visit',
    tag: 'CUSTOM WEB APPS',
    solution: 'custom-web-apps',
    headline: 'Customers pick a time themselves.',
    url: 'https://bookyourvisit.vercel.app',
    poster: '/media/book-your-visit-thumb.webp',
    alt: 'Book Your Visit demo: the booking page for a made-up cleaning company, with its three services, next to the owner’s day showing booked visits, free gaps and a Block off time button',
    embeddable: false,
    updatedAt: '2026-11-12',
    builtFor: 'Small home-service businesses, such as a cleaning company, that run on a calendar and a phone',
    summary:
      'Customers pick a service and an open time, then book, move or cancel without a call. The owner sees the day: every visit, the free gaps and the blocked time. A visit booked online is marked “New”.',
    whatMadeItInteresting:
      'the page only shows times that fit: inside opening hours, never on a Sunday, never over blocked time, and with 30 minutes to drive between homes.',
    tryIt:
      'Open the demo. No sign-up. Book a cleaning at a made-up company, watch it land on the owner’s day, then move or cancel it. Nothing is sent.',
    pullQuote: 'Customers see only the times you are free. Change or cancel without a call.',
    title: 'TEKGUYZ | Book Your Visit',
    description:
      'An online booking portal where customers pick a service and an open time, and change or cancel without a call. The owner sees the day. Try the one-click demo.',
  },
  /*
   * 2026-11-13 (refs tekguyz/tekguyz-one#161): Cart Reminders, a Custom Web
   * Apps demo (online ordering, headless e-commerce, cart abandonment). Words
   * are from tekguyz-one `projects/cart-reminders/about.md`. `url` is the
   * landing page, never the demo. The poster is the app's own
   * `showcase/webp/reminder-desktop-light.webp`, 1440x900, made-up roaster.
   * Retaken 2026-11-20 after the demo shop became Segovia Coffee
   * (tekguyz/cart-reminders#15, #16).
   */
  {
    slug: 'cart-reminders',
    kind: 'project',
    name: 'Cart Reminders',
    shortName: 'Cart Reminders',
    tag: 'CUSTOM WEB APPS',
    solution: 'custom-web-apps',
    headline: 'The shopper left. The cart came back.',
    url: 'https://cart-reminders.vercel.app',
    poster: '/media/cart-reminders-thumb.webp',
    cardPoster: '/media/cart-reminders-card.webp',
    heroPoster: '/media/cart-reminders-hero.webp',
    alt: 'Cart Reminders demo: the reminder email a shopper gets after leaving checkout at a made-up coffee roaster, marked not sent, next to the store owner’s carts started, left, reminded and won back',
    embeddable: false,
    updatedAt: '2026-11-13',
    builtFor: 'Small shops that sell online or want to: a roaster, a boutique, a food maker',
    summary:
      'An online shop built to fit the business, with ordering and payment. When a shopper leaves at checkout, the cart gets two reminders, after an hour and after a day, then it stops. The owner sees carts started, left, reminded and won back.',
    whatMadeItInteresting:
      'the cart outlives the visit. It lives in Shopify, so the reminder’s link reopens the same cart at checkout.',
    tryIt:
      'Open the demo. No sign-up. At Segovia Coffee, a made-up roaster, add coffee, start paying with a Stripe test card, leave, skip ahead and read the reminder. No card is charged.',
    title: 'TEKGUYZ | Cart Reminders',
    description:
      'An online store whose left carts come back: ordering and payment built to fit, and a friendly reminder when a shopper leaves at checkout. Try the one-click demo.',
  },
  /*
   * 2026-11-20 (#91, founder): three builds join, so the site lists 13. The
   * Private Meetup App stays off this site (portfolio only). Words come from
   * each app's README and PRODUCT.md and the portfolio's `lib/projects.ts`
   * entry, written in "we" here. No metric is stated: none is measured.
   * Posters are the portfolio's own 1440x900 captures of each app.
   */
  {
    // The rebuilt demo (tekguyz/team-performance, live 2026-11-17). It plays
    // a made-up call center. Replaces the old demo retired 2026-11-12 (#76).
    slug: 'team-performance',
    kind: 'project',
    name: 'Team Performance',
    shortName: 'Team Performance',
    tag: 'BUSINESS SYSTEMS',
    solution: 'business-systems',
    headline: 'Phone logs that credit the right person, and surveys that know when to stop.',
    url: 'https://team-performance-demo.vercel.app',
    poster: '/media/team-performance-thumb.webp',
    alt: 'Team Performance demo for a made-up call center: the overview of calls credited, focus ratings and surveys',
    embeddable: false,
    updatedAt: '2026-11-20',
    builtFor: 'Service teams that work the phones and follow up with customer surveys',
    summary:
      'Every desk-phone call is credited to the person who handled it, with no manual entry. A text survey runs beside it with plain rules, so customers are not texted after every call.',
    whatMadeItInteresting:
      'the rules that stop a text: no survey for a call under 2 minutes, and never two texts to one number in a day.',
    tryIt:
      'Open the demo. No sign-up. Run a batch of calls at a made-up call center and watch which rule stops each text. Nothing is sent.',
    title: 'TEKGUYZ | Team Performance',
    description:
      'Phone logs that credit whoever did the work, and customer survey texts with plain rules that know when to stop. Try the one-click demo.',
  },
  {
    // A made-up family coffee brand, built as if it were real. No landing page
    // in front: the link opens the shop itself.
    slug: 'coffee-brand-shop',
    kind: 'project',
    name: 'Coffee Brand & Shop',
    shortName: 'Coffee Brand & Shop',
    tag: 'CUSTOM WEB APPS',
    solution: 'custom-web-apps',
    headline: 'A coffee brand built to sell: buy a bag, subscribe, or build a bundle.',
    url: 'https://coquimba-coffee.vercel.app',
    poster: '/media/coffee-brand-shop-thumb.webp',
    cardPoster: '/media/coffee-brand-shop-volcano.webp',
    alt: 'The home page of a made-up coffee brand: a screen-print volcano over the coffee rows, with Shop coffee and Visit the café',
    embeddable: false,
    updatedAt: '2026-11-20',
    builtFor: 'A small brand with something to sell, and a café that posts its specials and events',
    summary:
      'A whole brand for a made-up family coffee business: the logo, the art, the words and the site. Shoppers buy a bag, subscribe or build a bundle. The café page has the menu, specials and events. The owner sees the orders and posts specials.',
    whatMadeItInteresting:
      'it is a brand, not only a shop. The look and the story come first, and the shop is built on top.',
    tryIt:
      'Open the site. No sign-up. Buy a bag with the Stripe test card, then open the owner’s side to see the order. No card is charged.',
    pullQuote: 'Buy once, subscribe, or build a bundle, and the owner sees every order.',
    title: 'TEKGUYZ | Coffee Brand & Shop',
    description:
      'A coffee brand built to sell: a shop with subscriptions and bundles, a café page with specials and events, and the owner’s side. Try it yourself.',
  },
  {
    // fancyfam.com. The address keeps the app's own name; the title says what
    // it is (founder, 2026-10-24). A "coming soon" page for now, so no Try it
    // line: there is no demo to try yet. Plain words: never "AI" or "agent".
    slug: 'everyday-helpers',
    kind: 'project',
    name: 'Everyday Helpers',
    shortName: 'Everyday Helpers',
    tag: 'CUSTOM WEB APPS',
    solution: 'custom-web-apps',
    headline: 'Four friendly helpers for the everyday stuff, in plain words.',
    url: 'https://fancyfam.com',
    poster: '/media/everyday-helpers-thumb.webp',
    alt: 'Meet the crew: four felt helpers, each on a card with a sample text and their answer',
    embeddable: false,
    updatedAt: '2026-11-20',
    builtFor: 'Families with people who never touch a settings screen',
    summary:
      'Four felt characters, each good at one chore: checking a fishy text or a high price, writing an email, keeping reminders, or a chat. You ask the way you text a friend. For now it is a “coming soon” page.',
    whatMadeItInteresting:
      'the house rules come first. A helper never spends your money, never sends without asking, and never shares what you tell it.',
    title: 'TEKGUYZ | Everyday Helpers',
    description:
      'Four friendly helpers for emails, fair prices and reminders, in plain words. A phone-first “coming soon” page with no sign-up.',
  },
  /* RETIRED 2026-09-04, and the reason is worth keeping so nobody re-adds them.
   *
   * RETIRED 2026-11-12 (refs #76): `team-performance` (Team Performance &
   * Automated Customer Feedback, the old demo), and the
   * Joe M. Google review that only rendered on its page went with it. Its URL
   * redirected to /work in next.config.ts until 2026-11-20 (#91), when the
   * rebuilt demo came back under the same slug.
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
   * RETIRED 2026-11-11: `private-meetup-app`. The founder took it off
   * tekguyz.com; the portfolio keeps it. Its poster went with it.
   *
   * All six retired slugs 308 to their replacement in `next.config.ts`, because
   * Google still lists some of them.
   */
];

/**
 * The number of live builds, SPELLED, for the two places copy says it out loud:
 * `/work`'s page hero and the home fold's "See all N builds" link.
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
 * /work, decided by the founder 2026-11-11 (Book Your Visit took the Custom Web
 * Apps card from Field Photo Reports on 2026-11-12): four large cards, one per
 * Solution, in this order, then every other build in small cards. Cart Reminders
 * took the Custom Web Apps card from Book Your Visit on 2026-11-16 (#80).
 * Since 2026-11-20 (#91): six featured cards, the four that lead their
 * Solution, then Coffee Brand & Shop and Field Photo Reports. The first four
 * stay the lead four (the footer), so their order is fixed.
 * Since 2026-11-22 (#98, founder): the lead four follow the Solution order
 * (Smart Operations, AI Voice Agents, Business Systems, Custom Web Apps), the
 * same as the menu, the stripe, the Home lamp fields and the /work filter.
 * `content/work.test.ts` fails if a build is in neither list, or in both.
 */
export const largeSlugs = [
  'win-back',
  'ai-voice-receptionist',
  'quote-to-paid',
  'cart-reminders',
  'coffee-brand-shop',
  'field-photo-reports',
] as const;

export const smallSlugs = [
  'book-your-visit',
  'no-show-rescue',
  'missed-call-follow-up',
  'team-performance',
  'ai-meeting-notes',
  'tekguyz-crm',
  'everyday-helpers',
] as const;

/** The four builds that lead their Solution: the footer's Work column. */
export const leadSlugs = largeSlugs.slice(0, 4);

const bySlugs = (slugs: readonly string[]) =>
  slugs.map((slug) => work.find((w) => w.slug === slug)).filter((w): w is WorkEntry => Boolean(w));

export const workLarge = bySlugs(largeSlugs);
export const workSmall = bySlugs(smallSlugs);

/**
 * The home hero (founder, 2026-11-21): the four builds that lead their
 * Solution, one button each, and the visitor picks which picture shows. The
 * first is shown on load. Nothing switches on its own (Seam: nothing moves on
 * its own). Each needs a 16:9 `heroPoster`: the top of the app's own feed
 * picture, so its words still read at hero size. Missed Call Follow-Up was the
 * hero 2026-11-11 to 2026-11-21; its desktop capture read too small.
 */
export const heroSlugs = leadSlugs;
export const heroBuilds = bySlugs(heroSlugs);

/**
 * The home band, "Two we're proud of". No build appears twice on Home (#80):
 * it never repeats the hero. Since 2026-11-21 the fold's four build rows are
 * gone, so this band is Home's one look at the work (/work has the rest). The
 * Lead & Pipeline CRM never appears on Home.
 */
export const featuredSlugs = ['field-photo-reports', 'ai-meeting-notes'] as const;
export const featured = featuredSlugs
  .map((slug) => work.find((w) => w.slug === slug))
  .filter((w): w is CaseStudy => w?.kind === 'case-study');

/**
 * The footer's Work column, shown on every page including Home: the four
 * builds that lead their Solution on /work. Never the CRM (it is off Home).
 */
export const footerSlugs = leadSlugs;

export const footerWork = bySlugs(leadSlugs);

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
