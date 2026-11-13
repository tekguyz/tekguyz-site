import Link from 'next/link';
import { AccentDot } from '@/components/solution-tag';
import { StatusLine } from '@/components/status-line';
import { site } from '@/lib/site';
import { buildCountWord, type WorkEntry } from '@/content/work';
import type { StatusResult } from '@/lib/status';

/**
 * The homepage fold, Seam form: a list of BUILD ROWS on the paper ground,
 * ruled by a 2px line on top and hairlines between.
 *
 * Each row: lamp dot, build name (to its story page), the mono status line from
 * the real hourly check ("Live · checked …"), and Open (the running demo, new
 * tab). The check time is never typed by hand: it is `lib/status.ts`'s result.
 *
 * Selection lives in `content/work.ts` (`foldSlugs`): four live builds, one
 * per Solution. The caption row below keeps "See all … builds", the Google
 * review link and the location.
 */
export function FoldBoard({
  entries,
  statuses,
}: {
  entries: WorkEntry[];
  statuses: Record<string, StatusResult | undefined>;
}) {
  return (
    <div className="tg-container">
      <ul className="m-0 list-none border-t-2 border-fg p-0">
        {entries.map((entry) => {
          const status = statuses[entry.slug];
          return (
            <li
              key={entry.slug}
              className="grid grid-cols-[16px_1fr] items-center gap-x-4 gap-y-1 border-b border-border py-4 md:grid-cols-[16px_1fr_auto_auto] md:gap-x-6"
            >
              <AccentDot solution={entry.solution} size={12} />
              <Link
                href={`/work/${entry.slug}`}
                className="tap-44 link-underline justify-self-start text-[19px] leading-[1.3] font-bold"
              >
                {entry.name}
              </Link>
              {status ? (
                <StatusLine result={status} className="col-start-2 md:col-start-auto" />
              ) : (
                <span className="hidden md:block" />
              )}
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${entry.shortName ?? entry.name} in a new tab`}
                className="tap-44 link-underline col-start-2 justify-self-start text-[16px] font-bold md:col-start-auto"
              >
                Open
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-x-12 gap-y-4">
        <Link
          href="/work"
          className="tap-44 text-[length:var(--text-body)] font-bold underline decoration-2 underline-offset-[6px]"
        >
          See all {buildCountWord} builds
        </Link>
        <div className="text-secondary flex flex-wrap items-center gap-x-[22px] gap-y-[10px] text-[length:var(--text-sm)] leading-[1.55] max-[766px]:flex-col max-[766px]:items-start">
          <span>
            A verified Google review.{' '}
            <a
              href={site.gbp}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-24 text-fg font-bold whitespace-nowrap underline decoration-2 underline-offset-[5px]"
            >
              Read it on Google &rarr;
            </a>
          </span>
          <span
            aria-hidden
            className="h-1 w-1 flex-none rounded-full max-[766px]:hidden"
            style={{ background: 'var(--tg-mute)' }}
          />
          <span>{site.locationLong}</span>
        </div>
      </div>
    </div>
  );
}
