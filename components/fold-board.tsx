import Link from 'next/link';
import { site } from '@/lib/site';
import { buildCountWord } from '@/content/work';

/**
 * The homepage fold's caption row, under the four Solution blocks: "See all …
 * builds", the Google review link and the location.
 *
 * Until 2026-11-21 it sat under four build rows (one build per Solution). The
 * founder removed them: right after the four Solution blocks they read as the
 * same four twice, and the "Two we're proud of" band below is already the
 * sneak peek of the work. /work carries the rest.
 */
export function FoldLinks() {
  return (
    <div className="tg-container">
      <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
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
