import Link from 'next/link';
import { ButtonLink } from '@/components/button';
import { Frame } from '@/components/live-frame';
import { SolutionTag } from '@/components/solution-tag';
import { StatusLine } from '@/components/status-line';
import type { WorkEntry } from '@/content/work';
import type { StatusResult } from '@/lib/status';

/**
 * The /work featured card (#91, founder 2026-11-20): six of them, two across.
 *
 * It replaced the full-width alternating rows, whose pictures ran about 370px
 * tall at 1440 ("far too big on desktop and phones"). Here the picture takes
 * two fifths of the card beside its words, still 16:10, so it lands near 140px
 * tall at 1440: about a third of the old height.
 *
 * Phones stack it, picture first, capped at 168px: `cover` with a top anchor
 * trims the bottom of the capture, which keeps the app's own header and first
 * rows, the readable part (live-frame.tsx).
 *
 * No outer box: the picture already carries the frame's 2px line, and a box
 * around it would be a frame in a frame. The grid's gaps separate the cards.
 *
 * The picture links to the full story too, but out of the tab order and hidden
 * from screen readers, so the name stays the one link a keyboard meets for it.
 */
export function FeaturedCard({ entry, status }: { entry: WorkEntry; status: StatusResult }) {
  const name = entry.shortName ?? entry.name;
  const story = `/work/${entry.slug}`;

  return (
    <article className="grid h-full grid-cols-1 content-start gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
      <Link href={story} tabIndex={-1} aria-hidden className="tg-feature-pic block">
        <Frame poster={entry.poster} alt="" sizes="(max-width: 639px) 100vw, (max-width: 1023px) 40vw, 240px" />
      </Link>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <SolutionTag solution={entry.solution} label={entry.tag} />
          <StatusLine result={status} variant="pill" />
        </div>
        <h3 className="mt-3 text-[length:var(--text-title)]">
          <Link href={story} className="tap-44 link-underline">
            {name}
          </Link>
        </h3>
        <p
          className="mt-2 text-[15px] leading-[1.5] text-secondary"
          style={{ textWrap: 'pretty' }}
        >
          {entry.headline}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <ButtonLink
            href={entry.url}
            size="nav"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open the ${name} demo in a new tab`}
          >
            Open the demo
          </ButtonLink>
          <Link
            href={story}
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
