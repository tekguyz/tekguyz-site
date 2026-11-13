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
    shortName: 'AI Voice Receptionist',
    tag: 'AI VOICE AGENTS',
    solution: 'ai-voice-agents',
    headline: 'An AI Receptionist that answers the phone, writes down the job, and books the visit.',
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
    alt: 'AI Voice Receptionist Sample Call for the made-up Mangrove Air: what Luna and the caller said on the left, and the job details on the right: name, job, urgency, address and booked time',
    embeddable: false,
    updatedAt: '2026-10-15',
    challenge:
      'A small shop or trade misses calls while the crew is out on a job or after the doors close. A caller with a broken AC often does not wait for a call back. They call the next name on the list.',
    approach:
      'We built Luna, an AI Receptionist for Mangrove Air, a made-up AC repair shop in South Florida. She answers, asks for the name, the job, how urgent it is and the address with its zip code, then books one of two open times. While she talks, the work order fills in live. She answers in Spanish when the caller speaks Spanish.',
    outcome:
      'The owner gets Call Notes for every call: a summary, the caller’s details, the job, the urgency and the booked time, plus a preview of the confirmation text. The Dashboard shows every call in one place. It is a demo, so no calendar is connected and nothing is sent.',
    pullQuote:
      'You do not watch a video of an AI receptionist. You call one, in one press.',
    tryIt:
      'Press Try the demo on its landing page, then Call now, and talk to Luna through your browser’s microphone. No sign-up, and no phone number is dialled. No microphone? Play the Sample Call: a real call to Luna, with an AI actor as the caller. Your Call Notes are deleted after 7 days.',
    howItsBuilt:
      'A phone-first web app. The call runs in the browser, and the server gives each call a short-lived token that only works for Luna, so the browser never holds a key. Calls stop at 3 minutes and have daily limits. Only the words are kept, for 7 days, never the caller’s voice.',
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
    slug: 'field-photo-reports',
    kind: 'case-study',
    name: 'Field Photo Reports & Quality Tracking',
    shortName: 'Field Photo Reports',
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
    // Rewritten 2026-09-28, in sync with COPY.md. The client stays unnamed.
    // "3 to 5 days" is the shop's documented
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
      'When a call goes unanswered, the caller hears back by text, email or an automated voice callback, whichever the business picks. The follow-up asks what is wrong, where, and how soon. The lead lands on a pipeline board, and the owner gets an alert when the call is missed and again when the lead lands.',
    whatMadeItInteresting:
      'the business picks the channel. Some callers answer a text, some read email, some want to hear a voice. The same three questions go out on whichever one fits, and every answer lands on the same board.',
    tryIt:
      'Press Try the demo on its landing page. No sign-up. You play a caller to a made-up roofer: pick the channel, call, and nobody answers. The follow-up arrives on a phone on screen, and the lead lands on the owner’s board. Nothing is sent.',
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
    alt: 'Quote to Paid demo board: a summary of the follow-ups that went out by themselves, the quotes and invoices waiting, and the jobs that need the owner',
    embeddable: false,
    updatedAt: '2026-11-10',
    builtFor: 'Roofing and AC companies that send quotes and wait to get paid',
    summary:
      'Follows up on every quote that got no answer and every unpaid invoice, by text, politely. The invoice goes out by itself when the crew marks the job done. The follow-ups stop the moment the customer answers or pays, and after the last one the owner is asked to call. One board shows what is waiting, who answered, who to call and what got paid.',
    whatMadeItInteresting:
      'the stop rule. A follow-up that keeps going after the customer answers is the pushy kind. Here any answer or payment ends it, nothing goes out on Sundays, and it never passes three. The rules are simple enough to say out loud.',
    tryIt:
      'Press Try the demo on its landing page. No sign-up. It opens a made-up AC company. Press Skip ahead a day and watch follow-ups go out, customers answer and invoices get paid. Open any job to play the customer. Nothing is sent or charged.',
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
      'Patients get a reminder text the day before a visit. When someone does not come, they are offered a new time, and the open slot goes to a short-notice waitlist: the first to reply takes it. After the visit, one message asks how it went. Happy patients get the review link, and the others reach the front desk, privately.',
    whatMadeItInteresting:
      'the empty chair. Rebooking the patient who missed is half the job. The other half is filling the slot today, so the waitlist hears about it at once and is told when it is taken.',
    tryIt:
      'Press Try the demo on its landing page. No sign-up. You play a patient at a made-up dental practice: get the reminder, miss the visit, pick a new time, and watch the front desk fill the open chair. Nothing is sent.',
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
    alt: 'Win-Back demo: drafted messages to past customers, each one approved by the owner, with an edit or skip link, before anything is sent',
    embeddable: false,
    updatedAt: '2026-11-11',
    builtFor: 'AC and heating companies with yearly service, and dental and vet offices with recalls',
    summary:
      'Reads the customer records the business already keeps and finds who stopped coming back: a missed tune-up, a plan that ran out, one visit and never again. A short report says who and why, and each customer gets a drafted message signed by the owner. The owner approves, changes or skips every one, and a reply can book a visit.',
    whatMadeItInteresting:
      'there is no approve-all button. Every message waits for the owner, it starts from the business’s own customers only, and anyone who asked not to get texts stays off the list.',
    tryIt:
      'Press Try the demo on its landing page. No sign-up. It opens a made-up AC company with its past-customer records. Read the report, approve the messages you like, and watch a reply book a visit. Nothing is sent.',
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
      'Customers pick a service and an open time, then book, move or cancel without a call. Each service has a length, so the page never offers a time that cannot fit. The owner sees the day: every visit, the free gaps and the blocked time. A visit booked online lands there marked “New”.',
    whatMadeItInteresting:
      'the page only shows open times: inside opening hours, never on a Sunday, never over blocked time, and with 30 minutes kept free to drive between homes. When the owner blocks off time, it leaves the booking page at once.',
    tryIt:
      'Press Try the demo on its landing page. No sign-up. You play a customer and the owner of a made-up cleaning company: book a cleaning, watch it land on the owner’s day, block off time, then move or cancel the visit. Nothing is sent.',
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
    alt: 'Cart Reminders demo: the reminder email a shopper gets after leaving checkout at a made-up coffee roaster, marked not sent, next to the store owner’s carts started, left, reminded and won back',
    embeddable: false,
    updatedAt: '2026-11-13',
    builtFor: 'Small shops that sell online or want to: a roaster, a boutique, a food maker',
    summary:
      'A shop built to fit the business, with online ordering and payment. Its products and carts come from a real Shopify store, and payment runs through Stripe in test mode. When a shopper leaves at checkout, the cart is marked as left and gets two reminders, one after an hour and one after a day, then it stops. The owner sees carts started, left, reminded and won back.',
    whatMadeItInteresting:
      'the cart outlives the visit. It lives in Shopify, so the reminder’s link reopens the same cart at checkout, and a paid cart becomes a real test order in the store.',
    tryIt:
      'Press Try the demo on its landing page. No sign-up. It opens a made-up coffee roaster in Miami. Add coffee to the cart, start paying with a Stripe test card, leave, skip ahead on the demo clock and read the reminder. Nothing is sent and no card is charged.',
    title: 'TEKGUYZ | Cart Reminders',
    description:
      'An online store whose left carts come back: ordering and payment built to fit, and a friendly reminder when a shopper leaves at checkout. Try the one-click demo.',
  },
  /* RETIRED 2026-09-04, and the reason is worth keeping so nobody re-adds them.
   *
   * RETIRED 2026-11-12 (refs #76): `team-performance` (Team Performance &
   * Automated Customer Feedback, the archived Advantage-Teams app), and the
   * Joe M. Google review that only rendered on its page went with it. Its URL
   * redirects to /work in next.config.ts.
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
 * /work, decided by the founder 2026-11-11 (Book Your Visit took the Custom Web
 * Apps card from Field Photo Reports on 2026-11-12): four large cards, one per
 * Solution, in this order, then every other build in small cards, newest first.
 * `content/work.test.ts` fails if a build is in neither list, or in both.
 */
export const largeSlugs = [
  'ai-voice-receptionist',
  'quote-to-paid',
  'win-back',
  'book-your-visit',
] as const;

export const smallSlugs = [
  'cart-reminders',
  'no-show-rescue',
  'missed-call-follow-up',
  'field-photo-reports',
  'ai-meeting-notes',
  'tekguyz-crm',
] as const;

const bySlugs = (slugs: readonly string[]) =>
  slugs.map((slug) => work.find((w) => w.slug === slug)).filter((w): w is WorkEntry => Boolean(w));

export const workLarge = bySlugs(largeSlugs);
export const workSmall = bySlugs(smallSlugs);

/**
 * The home hero (founder, 2026-11-11): Missed Call Follow-Up, replacing Field
 * Photo Reports.
 */
export const heroSlug = 'missed-call-follow-up';

/**
 * The home ink band, "Two we're proud of" (founder, 2026-11-11). It never
 * repeats the hero, and the Lead & Pipeline CRM never appears on Home.
 */
export const featuredSlugs = ['ai-voice-receptionist', 'field-photo-reports'] as const;
export const featured = featuredSlugs
  .map((slug) => work.find((w) => w.slug === slug))
  .filter((w): w is CaseStudy => w?.kind === 'case-study');

/**
 * The homepage fold's build board: one build per Solution line, in
 * `STRIPE_ORDER` (blue, violet, amber, teal), so the fold is a legend for the
 * four accents. Since 2026-11-11 a slot may hold a project: the two newest
 * demos and Quote to Paid lead their lines, and the CRM stays off Home.
 */
export const foldSlugs = [
  'win-back',
  'no-show-rescue',
  'quote-to-paid',
  'field-photo-reports',
] as const;

export const foldBoard = bySlugs(foldSlugs);

/**
 * The footer's Work column, shown on every page including Home: the four
 * builds that lead their Solution on /work. Never the CRM (it is off Home).
 */
export const footerSlugs = largeSlugs;

export const footerWork = workLarge;

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
