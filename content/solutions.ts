import type { SolutionSlug } from '@/config/solutions';

/**
 * Drives the /solutions index and the four /solutions/[slug] detail pages —
 * the same index-plus-detail, single-source pattern as content/work.ts.
 *
 * CANONICAL §4 reverses the earlier "one anchored page" decision: a #fragment
 * is not a separate URL to a search engine, so four solution keywords were
 * competing for relevance on one page instead of each ranking independently.
 *
 * Copy is verbatim from docs/COPY.md.
 */

export interface Solution {
  slug: SolutionSlug;
  name: string;
  /** Uppercase tag label. */
  tag: string;
  /** One-line hook — used on the home solutions section and the /solutions index. */
  hook: string;
  headline: string;
  /** Body paragraphs for the detail page. */
  body: string[];
  features: string[];
  /** Names matching content/work.ts entries. */
  relatedWork: string[];
  cta: { label: string; href: string };
  /** Short description used for the Service JSON-LD node. */
  serviceDescription: string;
  title: string;
  description: string;
}

export const solutions: Solution[] = [
  {
    slug: 'smart-operations',
    name: 'Smart Operations',
    tag: 'SMART OPERATIONS',
    hook: 'Your business makes data and tasks every hour. We build systems that handle them automatically.',
    headline: 'Your business generates new data and tasks every hour.',
    body: [
      "Files that need sorting, questions that need answering, information that needs to move from one place to another. Most of it gets done by a person doing it manually, one at a time, because that's how it's always been done.",
      'We build systems that handle the heavy lifting automatically — so the work still gets done, just without someone doing it by hand.',
    ],
    features: [
      'Custom AI assistants trained on your business',
      'Automated data sorting and file organization',
      'Task and workflow automation across your tools',
      'Real-time operational alerts when something needs you',
    ],
    relatedWork: ['AI Meeting Notes & Transcription'],
    cta: { label: 'Talk about automating this', href: '/contact?interest=smart-operations' },
    serviceDescription:
      'Custom AI assistants, automated data sorting, and workflow automation that handle the repetitive work your business generates every hour.',
    title: 'TEKGUYZ | Smart Operations — Custom AI Assistants & Automation',
    description:
      'Custom AI assistants, automated data sorting, and workflow automation that handle the repetitive work your business generates every hour.',
  },
  {
    slug: 'ai-voice-agents',
    name: 'AI Voice Agents',
    tag: 'AI VOICE AGENTS',
    hook: "Your phones don't stop ringing because your doors are closed. We answer them.",
    headline: "Your phones don't stop ringing just because your doors are closed.",
    body: [
      "Every call that goes to voicemail after hours is a lead deciding whether to wait for you or call the next name on the list. Most of them don't wait.",
      'We build AI voice agents that answer every call like your best employee would — capturing job details, scheduling consultations, and syncing everything to your systems in real time, day or night.',
    ],
    features: [
      'Real-time conversational voice AI',
      'Automatic lead capture and qualification',
      'Live appointment scheduling',
      'Instant CRM and follow-up sync',
    ],
    relatedWork: ['AI Voice Receptionist & Call Booking'],
    cta: { label: 'Hear one in action', href: '/work/ai-voice-receptionist' },
    serviceDescription:
      'Real-time conversational AI agents that answer calls, capture leads, and schedule work around the clock.',
    title: 'TEKGUYZ | AI Voice Agents — Answer Every Call, Day or Night',
    description:
      'Real-time AI voice agents that capture leads, book consultations, and sync your CRM automatically — after hours or during. See a live one in action.',
  },
  {
    slug: 'business-systems',
    name: 'Business Systems',
    tag: 'BUSINESS SYSTEMS',
    hook: 'Everything your clients and team need, in one private place instead of five.',
    headline: 'Spreadsheets, email threads, and five different tools for one job.',
    body: [
      "It works until it doesn't — usually the moment someone needs to find something and nobody's sure which version is current.",
      'We move you into one organized, private system where your clients and team log in, share documents, track projects, and see exactly where things stand. Invoicing included. Nothing scattered.',
    ],
    features: [
      'Secure client and team logins',
      'Private document portals',
      'Automated invoicing',
      'Integrations across the tools you already use',
    ],
    relatedWork: [
      'Field Photo Reports & Quality Tracking',
      'Lead & Pipeline CRM',
      'Team Performance & Automated Customer Feedback',
    ],
    cta: { label: 'Talk about consolidating this', href: '/contact?interest=business-systems' },
    serviceDescription:
      'Secure client and team logins, private document portals, automated invoicing, and integrations across the tools you already use.',
    title: 'TEKGUYZ | Business Systems — One Private System, Not Five Tools',
    description:
      'Client and team logins, document portals, and automated invoicing in one organized system — replacing the spreadsheets and email threads.',
  },
  {
    slug: 'custom-web-apps',
    name: 'Custom Web Apps',
    tag: 'CUSTOM WEB APPS',
    hook: 'If you can describe the workflow, we can build the tool that runs it.',
    headline: "Sometimes a website isn't enough — you need something that does something.",
    body: [
      'A tool your team opens every morning, or one your customers use to order, book, or track.',
      'We build those. Ordering systems, headless e-commerce, scheduling portals, client dashboards. If you can describe the workflow out loud, we can build the thing that runs it.',
    ],
    features: [
      'Online ordering and cart systems',
      'Headless e-commerce integrations',
      'Appointment and scheduling portals',
      'Client-facing dashboards',
    ],
    relatedWork: ['Shopify Bundle Builder & Storefront'],
    cta: { label: 'Describe what you need built', href: '/contact?interest=custom-web-apps' },
    serviceDescription:
      'Ordering and cart systems, headless e-commerce, scheduling and booking portals, and client-facing dashboards.',
    title: 'TEKGUYZ | Custom Web Apps — Ordering, Booking, and Dashboards',
    description:
      'Ordering systems, headless e-commerce, scheduling portals, and client dashboards — custom web apps built around the workflow you describe.',
  },
];

export function getSolution(slug: string): Solution | undefined {
  return solutions.find((s) => s.slug === slug);
}

/** The Area of Interest options on the contact form (COPY.md step 1). */
export const interestOptions = [
  { value: 'Smart Operations', slug: 'smart-operations' },
  { value: 'AI Voice Agents', slug: 'ai-voice-agents' },
  { value: 'Business Systems', slug: 'business-systems' },
  { value: 'Custom Web Apps', slug: 'custom-web-apps' },
  { value: 'Something else', slug: null },
  { value: 'Not sure yet', slug: null },
] as const;

/** COPY.md step 2 — the project-details placeholder changes with the interest. */
export const detailsPlaceholder: Record<string, string> = {
  'Smart Operations': "What's getting done by hand right now that shouldn't be?",
  'AI Voice Agents': 'Roughly how many calls are you missing after hours?',
  'Business Systems':
    'What are you using instead right now — spreadsheets, email, something else?',
  'Custom Web Apps': 'Describe the workflow you want a tool for.',
};

export const DEFAULT_DETAILS_PLACEHOLDER = "Tell us what you're trying to fix or build.";

export const budgetOptions = [
  'Under $5k',
  '$5k–$15k',
  '$15k–$50k',
  '$50k+',
  'Not sure yet',
] as const;
