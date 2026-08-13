/**
 * Verbatim from docs/COPY.md. The same strings feed both the rendered accordion
 * at the bottom of /contact and the FAQPage JSON-LD — SEO.md is explicit that
 * the schema must not be a paraphrased second version.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: 'How much does a project cost?',
    answer:
      'It depends on what you’re building, and we won’t pretend otherwise. Every project starts with a free conversation, you get a flat quote once we understand the scope, and nothing begins until you’ve seen that number and agreed to it. No retainers you didn’t ask for.',
  },
  {
    question: 'How long does a project take?',
    answer:
      'Also scope-dependent — but you’ll have a real timeline before any building starts, laid out in the Blueprint step. If something changes mid-build, you hear it from us when it happens, not at the end.',
  },
  {
    question: 'Do you work with businesses outside South Florida?',
    answer:
      'Yes. We’re based in South Florida and deliver remotely nationwide. Most of our work happens over video calls and shared systems, regardless of where you’re located.',
  },
  {
    question: 'Can you work with the systems we already have?',
    answer:
      'Usually, yes — that’s most of what we do. Integrating with tools you already pay for is almost always cheaper and less disruptive than replacing them. If something genuinely needs replacing, we’ll tell you why.',
  },
  {
    question: 'What happens after launch?',
    answer:
      'We make sure everything works the way it’s supposed to, and we stay available when questions come up. We don’t hand over a login and disappear.',
  },
  {
    question: 'Are the demos on this site real?',
    answer:
      'Every one. They’re live applications, not screenshots — we check their status hourly and show you the result. Open any of them and use it yourself.',
  },
];
