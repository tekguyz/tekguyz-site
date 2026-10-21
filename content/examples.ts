import type { SolutionSlug } from '@/config/solutions';

/**
 * The typed array that drives /examples, every example page,
 * generateStaticParams, the sitemap and the solution pages' example links.
 *
 * An example is NOT a build. /work holds real, running software; an example
 * is a short look at one kind of tool we build, played on a made-up business
 * with sample data, so the range of the Solutions is visible before every
 * offering has a full demo (owner, 2026-10-21). Each example plays its own
 * made-up business and never reuses one from another demo. The page says so in
 * plain words, every time.
 *
 * Nothing in an example is sent, saved or connected. No prices, no figures:
 * the sample data carries names, jobs and times only.
 */

export type ExampleScreen = 'quote-follow-up' | 'voicemail' | 'inbox' | 'booking';

export interface Example {
  slug: string;
  solution: SolutionSlug;
  /** Uppercase tag label, matching the solution's tag. */
  tag: string;
  /** Short name of the tool, used in cards and the breadcrumb. */
  name: string;
  headline: string;
  /** The made-up business the example plays. */
  business: string;
  /** One line on who the made-up business is. */
  businessLine: string;
  problem: string;
  /** What the tool does, one short line each. */
  does: string[];
  /** One line under the screen: how to use the example. */
  tryIt: string;
  screen: ExampleScreen;
  updatedAt: string;
  title: string;
  description: string;
}

const ADDED = '2026-10-21';

export const examples: Example[] = [
  {
    slug: 'quote-and-invoice-follow-up',
    solution: 'business-systems',
    tag: 'BUSINESS SYSTEMS',
    name: 'Quote & Invoice Follow-Up',
    headline: 'No quote goes quiet, and no invoice is forgotten.',
    business: 'Bayline Roofing',
    businessLine: 'a made-up roofing company in South Florida',
    problem:
      'A roofer sends a quote and hears nothing. An invoice goes out and sits unpaid. Nobody has time to chase every one, so jobs and money slip away without anyone deciding to let them go.',
    does: [
      'Keeps every open quote and unpaid invoice in one list',
      'Writes a polite follow-up when one has waited too long',
      'The owner approves each message before it goes out',
      'Stops the moment the customer answers or pays',
    ],
    tryIt:
      'Pick a quote or an invoice to read the follow-up we wrote for it, then approve it. It is an example, so nothing is sent.',
    screen: 'quote-follow-up',
    updatedAt: ADDED,
    title: 'TEKGUYZ | Quote & Invoice Follow-Up — Example',
    description:
      'An example of a quote and invoice follow-up tool for a made-up roofing company. See the open quotes, the unpaid invoices, and the follow-ups waiting for the owner’s approval.',
  },
  {
    slug: 'voicemail-summaries',
    solution: 'ai-voice-agents',
    tag: 'AI VOICE AGENTS',
    name: 'Voicemail to Summaries',
    headline: 'Every voicemail, read for you, with what the caller needs.',
    business: 'Saltmarsh Plumbing',
    businessLine: 'a made-up plumber in South Florida',
    problem:
      'A plumber comes back from a job to a full voicemail box. Listening to every message takes time, and the urgent one, a leak at 7 a.m., sits behind three calls that could have waited.',
    does: [
      'Turns each voicemail into words the owner can read',
      'Writes a short summary of what the caller needs',
      'Marks how urgent each call is, so the worst goes first',
      'Keeps the caller’s name and address with the message',
    ],
    tryIt:
      'Pick a voicemail to read what the caller said and what they need. It is an example on made-up calls.',
    screen: 'voicemail',
    updatedAt: ADDED,
    title: 'TEKGUYZ | Voicemail to Summaries — Example',
    description:
      'An example of voicemail summaries for a made-up plumber. Each message becomes words, a short summary and an urgency, so the urgent call is answered first.',
  },
  {
    slug: 'inbox-sorter',
    solution: 'smart-operations',
    tag: 'SMART OPERATIONS',
    name: 'Inbox Sorter',
    headline: 'The inbox sorts itself, and the replies are already written.',
    business: 'Palm Row Property Management',
    businessLine: 'a made-up property manager in South Florida',
    problem:
      'A property manager gets repair requests, rent questions, leasing leads and junk, all in one inbox. Each one has to be opened, read and answered by hand, and a real repair can hide under the rest.',
    does: [
      'Sorts each email into repairs, rent, leasing or junk',
      'Writes a reply in the manager’s own words',
      'The manager approves each reply before it goes out',
      'Puts urgent repairs at the top',
    ],
    tryIt:
      'Pick a group to filter the inbox, then pick an email to read the reply we wrote. It is an example, so nothing is sent.',
    screen: 'inbox',
    updatedAt: ADDED,
    title: 'TEKGUYZ | Inbox Sorter — Example',
    description:
      'An example of an inbox sorter for a made-up property manager. Email is sorted into repairs, rent, leasing and junk, with a reply written and waiting for approval.',
  },
  {
    slug: 'online-booking',
    solution: 'custom-web-apps',
    tag: 'CUSTOM WEB APPS',
    name: 'Online Booking',
    headline: 'Customers book themselves, and the day’s schedule fills in.',
    business: 'Driftwood Mobile Grooming',
    businessLine: 'a made-up mobile pet groomer in South Florida',
    problem:
      'A mobile groomer books every visit by phone and text, often while driving or with a dog on the table. Calls get missed, times get mixed up, and the day’s route lives on paper.',
    does: [
      'Customers pick a service and an open time themselves',
      'Only real open times are shown, so nothing double-books',
      'The owner sees the day’s visits in order',
      'Made for phones first, in the business’s own colors',
    ],
    tryIt:
      'Book a visit as a customer, then look at the owner’s day to see it appear. It is an example, so nothing is saved.',
    screen: 'booking',
    updatedAt: ADDED,
    title: 'TEKGUYZ | Online Booking — Example',
    description:
      'An example of an online booking app for a made-up mobile pet groomer. Customers pick a service and a time, and the owner’s day fills in.',
  },
];

export function getExample(slug: string): Example | undefined {
  return examples.find((e) => e.slug === slug);
}

export function examplesForSolution(solution: SolutionSlug): Example[] {
  return examples.filter((e) => e.solution === solution);
}
