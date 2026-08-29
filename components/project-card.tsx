import Link from 'next/link';
import { StatusLine } from '@/components/status-line';
import { SolutionTag } from '@/components/solution-tag';
import type { Project } from '@/content/work';
import type { StatusResult } from '@/lib/status';

/**
 * Compact: surface fill, 1px hairline, 12px radius, 24px padding.
 * Tag (tight variant) -> title -> one description -> status line.
 *
 * NO IMAGE, EVER. The size and weight gap from case-study-row is intentional
 * signal about the depth of the build, and an image would erase it.
 *
 * Hover lifts 3px and darkens the hairline — position, never shadow.
 */
export function ProjectCard({
  entry,
  status,
  index = 0,
}: {
  entry: Project;
  status: StatusResult;
  /** Position within its grid, for the 80ms reveal stagger. */
  index?: number;
}) {
  return (
    <Link
      href={`/work/${entry.slug}`}
      data-card
      data-reveal-index={index}
      className="reveal hover-card flex h-full flex-col rounded-[12px] border border-border bg-surface"
      style={{ padding: 'var(--pad-card)' }}
    >
      <SolutionTag solution={entry.solution} label={entry.tag} variant="card" className="self-start" />

      <h3
        className="mt-[18px] text-[length:var(--text-title)] leading-[1.2] font-semibold tracking-[-0.02em]"
        style={{ textWrap: 'pretty' }}
      >
        {entry.headline}
      </h3>

      <p
        className="mt-[14px] flex-1 text-[0.875rem] leading-[1.55] text-secondary"
        style={{ textWrap: 'pretty' }}
      >
        {/* COPY.md's summary verbatim. The export shows a shortened card
            variant, but copy is authored in COPY.md and not rewritten here. */}
        {entry.summary}
      </p>

      <StatusLine result={status} className="mt-[22px]" />

      {/* Matches `case-study-row`'s affordance so both tiers say what a click
          does. Not a <Link> — the whole card is already one, and nesting an
          anchor inside an anchor is invalid HTML that browsers recover from by
          un-nesting, which splits one card into two tab stops.

          Deliberately NOT a second "open the live demo" link: the demo is one
          click further in, on the detail page, which now carries the frame,
          the status line and the demo link together. Two competing actions on a
          compact card is the exact ambiguity this tier is meant to avoid. */}
      <span
        aria-hidden
        className="link-underline mt-6 self-start text-[14.5px] font-semibold"
      >
        Read the full story →
      </span>
    </Link>
  );
}
