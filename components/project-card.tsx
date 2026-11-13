import Link from 'next/link';
import { StatusLine } from '@/components/status-line';
import { SolutionTag } from '@/components/solution-tag';
import type { WorkEntry } from '@/content/work';
import type { StatusResult } from '@/lib/status';

/**
 * Since 2026-11-11 the /work small cards also hold case studies that do not
 * lead their Solution (AI Meeting Notes, the CRM); those show their outcome.
 *
 * Compact: surface fill, 1px hairline, 12px radius, 24px padding.
 *
 * Slimmed 2026-11-12 (owner: "bulky" now there are 9): title at `--text-body`
 * not `--text-title`, the summary clamped to 3 lines (the full text is on the
 * detail page), tighter steps, and 3 across from 1024px in app/work/page.tsx.
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
  entry: WorkEntry;
  status: StatusResult;
  /** Position within its grid, for the 80ms reveal stagger. */
  index?: number;
}) {
  return (
    <Link
      href={`/work/${entry.slug}`}
      data-card
      className="hover-card flex h-full flex-col tg-frame bg-bg"
      style={{ padding: 'var(--pad-card)' }}
    >
      <SolutionTag solution={entry.solution} label={entry.tag} variant="card" className="self-start" />

      <h3
        className="mt-4 text-[length:var(--text-title)]"
        style={{ textWrap: 'pretty' }}
      >
        {entry.headline}
      </h3>

      <p
        className="mt-2.5 line-clamp-3 flex-1 text-[length:var(--text-sm)] leading-[1.55] text-secondary"
        style={{ textWrap: 'pretty' }}
      >
        {/* COPY.md's summary verbatim. The export shows a shortened card
            variant, but copy is authored in COPY.md and not rewritten here. */}
        {entry.kind === 'project' ? entry.summary : entry.outcome}
      </p>

      <StatusLine result={status} className="mt-5" />

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
        className="link-underline mt-4 self-start text-[16px] font-semibold"
      >
        Read the full story →
      </span>
    </Link>
  );
}
