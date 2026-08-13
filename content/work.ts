import type { SolutionSlug } from '@/config/solutions';

/**
 * The typed array that drives /work, all 8 detail pages, generateStaticParams,
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
    slug: 'ai-voice-receptionist',
    kind: 'case-study',
    name: 'AI Voice Receptionist & Live Demo',
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
  {
    slug: 'bundle-builder',
    kind: 'case-study',
    name: 'Bundle Builder',
    tag: 'CUSTOM WEB APPS',
    solution: 'custom-web-apps',
    headline: "A custom storefront built directly on Shopify's API for bundled products.",
    url: 'https://reporter-resource-temp.vercel.app',
    poster: '/media/shopify-configurator.webp',
    alt: 'Bundle Builder storefront with product options and a running total that updates as the bundle is assembled',
    embeddable: false,
    updatedAt: AUTHORED,
    challenge:
      "The retailer's existing theme couldn't handle configurable, bundled products. Customers assembling a workstation from hardware, software, and accessories had no clean way to see the total update as they chose options — so they guessed, or they left.",
    approach:
      "We built a custom storefront directly on Shopify's API rather than fighting the theme. Options update the running total instantly, and checkout hands off to Shopify's own secure flow — so nothing about payments or order management had to be rebuilt or re-secured.",
    outcome:
      "Customers can see exactly what they're building and what it costs while they build it, and the merchant keeps every piece of Shopify's existing order infrastructure.",
    pullQuote:
      'Watch the total update instantly as the order comes together — then check out for real, risk-free.',
    tryIt:
      'The demo is fully sandboxed. Check out for real using `1` as the card number and any other test details.',
    howItsBuilt:
      "Headless storefront on Shopify's API with live price computation, handing off to Shopify Checkout for payment and fulfillment.",
    title: 'TEKGUYZ | Bundle Builder — Custom Shopify Storefront',
    description:
      "A configurable product storefront built directly on Shopify's API. Build a bundle, watch the total update instantly, then check out for real in the live demo.",
  },
  {
    slug: 'ai-audio-file-insights',
    kind: 'case-study',
    name: 'AI Audio & File Insights',
    tag: 'SMART OPERATIONS',
    solution: 'smart-operations',
    headline: 'Turn your files and recordings into automatic summaries and a searchable archive.',
    url: 'https://crunch-wrap.netlify.app',
    poster: '/media/crunch-wrap-dashboard.webp',
    alt: 'AI Audio & File Insights workspace showing automatic summaries, action items, and a searchable archive',
    embeddable: false,
    updatedAt: AUTHORED,
    challenge:
      "Consultants and ops teams were losing details buried in audio recordings and documents. The information existed — it just wasn't findable, so the same questions got re-asked and the same recordings got re-listened to.",
    approach:
      'We built a workspace that listens to your files, pulls out what matters, and organizes it automatically into summaries, action trackers, and an archive you can actually search.',
    outcome:
      'Details that used to be effectively lost the moment a recording ended are now findable in seconds by anyone on the team.',
    pullQuote:
      'Never lose track of a small but important detail buried in a long recording, ever again.',
    tryIt: "There's a demo button at the bottom of the sign-in page — no account needed.",
    howItsBuilt:
      'Audio and document ingestion, automatic transcription and extraction, structured summaries and action items, full-text search across everything.',
    title: 'TEKGUYZ | AI Audio & File Insights',
    description:
      'A digital workspace that turns recordings and documents into automatic summaries and a searchable archive. Try it — no account required.',
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
  {
    slug: 'meeting-organizer',
    kind: 'project',
    name: 'Automated Meeting & Research Organizer',
    tag: 'SMART OPERATIONS',
    solution: 'smart-operations',
    headline: 'Record the meeting, get the follow-up automatically.',
    url: 'https://crispy-bacon.netlify.app',
    poster: '/media/meeting-organizer-thumb.webp',
    alt: 'Automated Meeting & Research Organizer showing extracted takeaways and action items in a searchable archive',
    embeddable: false,
    updatedAt: AUTHORED,
    builtFor: 'Professionals and teams who record meetings and need organized follow-up',
    summary:
      'A secure recording tool that pulls out takeaways and action items on its own, then files everything into a clean, searchable archive — so the notes exist whether or not anyone remembered to take them.',
    whatMadeItInteresting:
      'the archive matters more than the transcript. Anyone can transcribe a meeting; the value is being able to find the one thing that was said three weeks ago.',
    tryIt: 'Sign up with your email to use it.',
    title: 'TEKGUYZ | Automated Meeting & Research Organizer',
    description:
      "A secure recording tool that extracts takeaways and action items automatically, filed into a searchable archive you'll actually use later.",
  },
  {
    slug: 'restaurant-menu',
    kind: 'project',
    name: 'Bilingual Restaurant Menu & WhatsApp Ordering',
    tag: 'CUSTOM WEB APPS',
    solution: 'custom-web-apps',
    headline: 'A photo menu customers order from directly in WhatsApp.',
    url: 'https://dragonfly-nica.netlify.app',
    poster: '/media/dragonfly-nica-thumb.webp',
    alt: 'Bilingual restaurant menu with a photo-rich item grid and WhatsApp ordering',
    embeddable: false,
    updatedAt: AUTHORED,
    builtFor: 'Local restaurants, food vendors, bilingual markets',
    summary:
      'A bilingual ordering platform where customers browse a photo-rich menu and send their order straight through WhatsApp — no app to download, no account to make. Cart management, order notes, and instant confirmation keep it simple on both sides of the counter.',
    whatMadeItInteresting:
      "meeting customers where they already are. For a bilingual market, WhatsApp isn't a workaround — it's the primary channel, and building for it removed every step between hungry and ordered.",
    title: 'TEKGUYZ | Bilingual Restaurant Menu & WhatsApp Ordering',
    description:
      'A photo-rich, bilingual ordering platform that takes real orders over WhatsApp — no app, no download, no account needed.',
  },
  {
    slug: 'auto-detailer',
    kind: 'project',
    name: 'Auto Detailer Booking & Lead Tracker',
    tag: 'CUSTOM WEB APPS',
    solution: 'custom-web-apps',
    headline: 'Booking, lead tracking, and the gallery that closes the sale.',
    url: 'https://the-executivedetailer.vercel.app',
    poster: '/media/executive-detailer-thumb.webp',
    alt: 'Auto detailer booking platform with a request form, scheduling, and a work gallery',
    embeddable: false,
    updatedAt: AUTHORED,
    builtFor: 'Premium vehicle detailing shops, mobile auto services',
    summary:
      "A booking platform for premium detailing with responsive request forms and built-in lead tracking, so an inquiry doesn't die in an inbox. Automated scheduling, a custom gallery, and review tools built to earn the second appointment, not just the first.",
    whatMadeItInteresting:
      'for premium detailing, the gallery is the pitch. Treating it as a first-class part of the booking flow rather than a separate page changed what the site was for.',
    title: 'TEKGUYZ | Auto Detailer Booking & Lead Tracker',
    description:
      'A booking platform for premium vehicle detailing with automated scheduling, lead tracking, and review tools built to earn repeat business.',
  },
];

export const caseStudies = work.filter((w): w is CaseStudy => w.kind === 'case-study');
export const projects = work.filter((w): w is Project => w.kind === 'project');

/** Home shows exactly two, in this order (CANONICAL §4). */
export const featuredSlugs = ['field-photo-reports', 'ai-voice-receptionist'] as const;
export const featured = featuredSlugs
  .map((slug) => work.find((w) => w.slug === slug))
  .filter((w): w is CaseStudy => w?.kind === 'case-study');

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
