import Link from 'next/link';
import { ButtonLink } from '@/components/button';
import { Frame } from '@/components/live-frame';
import { SolutionTag } from '@/components/solution-tag';
import { StatusLine } from '@/components/status-line';
import type { WorkEntry } from '@/content/work';
import type { StatusResult } from '@/lib/status';

/**
 * The /work large card: one per Solution (founder, 2026-11-11).
 *
 * Cut down 2026-11-16 (#80, the founder's phone review: "so much copy", each
 * card was about 1,190px tall at 375px): the picture, the Solution and a
 * "Live" pill, the short name, the build's headline as its one line, then
 * Open the demo and Full story. The summary or approach, the pull quote and
 * the Try it paragraph live on the build's own page.
 *
 * Desktop alternates by offset, not mirror:
 *   even  text 1-6  / media 7-13
 *   odd   media 1-7 / text 8-13
 *
 * DOM order is media, then text, on every row: on a phone the picture leads
 * the card, and it is the same order on every row, so two pictures never sit
 * back to back. The alternation rides on `grid-column` alone, both halves
 * pinned to `grid-row: 1` (.claude/rules/cascade.md). `tg-stack-md` stacks
 * the 768-1023 band, so the `max-lg:` placements are its safe fallback only.
 */
export function CaseStudyRow({
  entry,
  status,
  index,
}: {
  entry: WorkEntry;
  status: StatusResult;
  index: number;
}) {
  const mediaFirst = index % 2 === 1;
  const name = entry.shortName ?? entry.name;

  return (
    <article
      className={`tg-container tg-grid tg-split tg-card-row tg-stack-md items-center py-10 md:py-16 ${index > 0 ? 'border-t border-border' : ''}`}
    >
      <div
        className={
          mediaFirst
            ? '[grid-row:1] [grid-column:1/7] max-lg:[grid-column:1/5]'
            : '[grid-row:1] [grid-column:7/13] max-lg:[grid-column:5/9]'
        }
      >
        <Frame poster={entry.poster} alt={entry.alt} />
      </div>

      <div
        className={
          mediaFirst
            ? '[grid-row:1] [grid-column:8/13] max-lg:[grid-column:6/9]'
            : '[grid-row:1] [grid-column:1/6] max-lg:[grid-column:1/4]'
        }
      >
        <div className="flex items-center justify-between gap-3">
          <SolutionTag solution={entry.solution} label={entry.tag} />
          <StatusLine result={status} variant="pill" />
        </div>
        <h3 className="mt-3 text-[length:var(--text-subhead)] md:mt-5">
          <Link href={`/work/${entry.slug}`} className="tap-44 link-underline">
            {name}
          </Link>
        </h3>
        <p
          className="mt-2 text-[length:var(--text-body)] leading-[1.5] text-secondary md:mt-4"
          style={{ textWrap: 'pretty' }}
        >
          {entry.headline}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-8">
          <ButtonLink
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open the ${name} demo in a new tab`}
          >
            Open the demo
          </ButtonLink>
          <Link
            href={`/work/${entry.slug}`}
            aria-label={`${name}: the full story`}
            className="tap-44 text-[16px] font-bold underline decoration-2 underline-offset-[6px]"
          >
            Full story
          </Link>
        </div>
      </div>
    </article>
  );
}
