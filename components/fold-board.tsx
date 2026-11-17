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
 * Each row, on ONE line at every width since #80 (2026-11-16; it was 3 to 4
 * lines on a phone): lamp dot, the build's short name (to its story page), the
 * "Live" pill from the real hourly check (the time is its tooltip), and Open
 * (the running demo, new tab).
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
          const name = entry.shortName ?? entry.name;
          return (
            <li
              key={entry.slug}
              className="grid grid-cols-[12px_minmax(0,1fr)_auto_auto] items-center gap-x-3 border-b border-border py-3 md:gap-x-6 md:py-4"
            >
              <AccentDot solution={entry.solution} size={12} />
              <Link
                href={`/work/${entry.slug}`}
                className="tap-44 link-underline max-w-full min-w-0 justify-self-start text-[17px] leading-[1.3] font-bold md:text-[19px]"
              >
                {/* Truncation sits on the inner span: `overflow: hidden` on the
                    link itself would clip the `.tap-44` ::before tap area. */}
                <span className="block truncate">{name}</span>
              </Link>
              {status ? <StatusLine result={status} variant="pill" /> : <span />}
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${name} in a new tab`}
                className="tap-44 link-underline text-[16px] font-bold"
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
              data-screen-ok="taps: a link inside a sentence, so tap-24 (24x24) is its tier"
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
