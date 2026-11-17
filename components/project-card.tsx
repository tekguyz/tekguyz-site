import Link from 'next/link';
import { StatusLine } from '@/components/status-line';
import { SolutionTag } from '@/components/solution-tag';
import type { WorkEntry } from '@/content/work';
import type { StatusResult } from '@/lib/status';

/**
 * The small build card, on /work ("More builds") and on each Solution page.
 *
 * Cut down 2026-11-16 (#80, the founder's phone review: "bulky", "so much
 * copy"): Solution tag, the short name, the one-line headline, the "Live"
 * pill. The summary and the Try it paragraph live on the build's own page.
 * On phones these cards sit in a `SwipeRow`; from 640px they are a grid.
 *
 * NO IMAGE, EVER. The size and weight gap from case-study-row is intentional
 * signal about the depth of the build, and an image would erase it.
 *
 * Hover lifts 3px and darkens the hairline — position, never shadow.
 */
export function ProjectCard({
  entry,
  status,
  showTag = true,
}: {
  entry: WorkEntry;
  status: StatusResult;
  /** Off on a Solution page, where every card shares the page's Solution. */
  showTag?: boolean;
}) {
  const name = entry.shortName ?? entry.name;
  return (
    <Link
      href={`/work/${entry.slug}`}
      data-card
      className="hover-card flex h-full flex-col tg-frame bg-bg p-5"
    >
      {showTag && (
        <SolutionTag solution={entry.solution} label={entry.tag} variant="card" className="self-start" />
      )}
      <h3 className={`${showTag ? 'mt-3' : ''} text-[length:var(--text-title)] truncate`}>
        {name}
      </h3>
      <p
        className="mt-2 line-clamp-2 flex-1 text-[15px] leading-[1.45] text-secondary"
        style={{ textWrap: 'pretty' }}
      >
        {entry.headline}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <StatusLine result={status} variant="pill" />
        <span aria-hidden className="text-[20px] leading-none font-bold">
          &rarr;
        </span>
      </div>
    </Link>
  );
}
