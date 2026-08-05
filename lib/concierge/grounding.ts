import { solutions } from '@/content/solutions';
import { work } from '@/content/work';
import { faq } from '@/content/faq';
import { site } from '@/lib/site';

/**
 * CANONICAL §7 — grounding data, scoped deliberately. Not "everything on the
 * site."
 *
 * The concierge's job is scoping plus lead capture, not general customer
 * service, so it gets:
 *   - all four Solutions (name, description, features)
 *   - all 8 builds (name, line, one-liner, URL) — NOT the full
 *     Challenge/Approach/Outcome narratives, which cost real tokens per request
 *     for a job that doesn't need them
 *   - the FAQ, so its answers to "how much" and "do you serve outside Florida"
 *     match the site's own published answers instead of improvising something
 *     adjacent
 *   - basic company facts
 *
 * Deliberately excluded: the testimonial and the Playbook. Voice comes from the
 * system prompt's instructions, not from injecting the brand doc wholesale.
 * Process steps are optional context, not required.
 */
export function buildGrounding(): string {
  const solutionLines = solutions
    .map(
      (s) =>
        `- ${s.name}: ${s.serviceDescription}\n  Components: ${s.features.join('; ')}\n  Page: /solutions/${s.slug}`,
    )
    .join('\n');

  const builds = work
    .map((w) => {
      const oneLiner = w.kind === 'case-study' ? w.headline : w.summary.split('.')[0] + '.';
      return `- ${w.name} (${w.tag}) — ${oneLiner} Live demo: ${w.url} · Page: /work/${w.slug}`;
    })
    .join('\n');

  const faqLines = faq.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');

  return `## Solution lines
${solutionLines}

## Existing builds (all live, all openable right now)
${builds}

## Published answers to common questions
${faqLines}

## Company facts
Location: ${site.locationLong}. Hours: ${site.hoursLong}. Public email: ${site.publicEmail}.
Delivery is remote and cloud-based nationwide.
Pricing is never quoted without a conversation: every project starts free, then a flat quote once scope is understood.`;
}
