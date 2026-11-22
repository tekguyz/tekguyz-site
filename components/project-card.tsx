import Link from 'next/link';
import { SolutionTag } from '@/components/solution-tag';
import type { WorkEntry } from '@/content/work';

/**
 * The small build card, on /work ("More builds") and on each Solution page.
 *
 * Cut down 2026-11-16 (#80, "bulky") and again 2026-11-22 (#98): it was
 * 392x191, taller than the featured cards that carry a picture, so the lesser
 * tier looked heavier. Now: Solution tag, the name with its arrow, one line of
 * headline. No Live mark (the build's own page has it). On phones these cards
 * sit in a `SwipeRow`; from 640px they are a grid.
 *
 * NO IMAGE, EVER, not even on hover (founder, 2026-11-22). The size gap from
 * featured-card is the signal about the depth of the build.
 *
 * Hover lifts and darkens the hairline (`.hover-card`): position, never shadow.
 */
export function ProjectCard({
  entry,
  showTag = true,
}: {
  entry: WorkEntry;
  /** Off on a Solution page, where every card shares the page's Solution. */
  showTag?: boolean;
}) {
  const name = entry.shortName ?? entry.name;
  return (
    <Link
      href={`/work/${entry.slug}`}
      data-card
      className="hover-card flex h-full flex-col tg-frame bg-bg px-4 py-3.5"
    >
      {showTag && (
        <SolutionTag solution={entry.solution} label={entry.tag} variant="card" className="self-start" />
      )}
      <h3 className={`${showTag ? 'mt-2' : ''} flex items-baseline justify-between gap-3 text-[18px] leading-[1.2]`}>
        <span className="min-w-0 truncate">{name}</span>
        <span aria-hidden className="flex-none font-bold">
          &rarr;
        </span>
      </h3>
      <p className="mt-1 line-clamp-2 text-[14px] leading-[1.45] text-secondary">{entry.headline}</p>
    </Link>
  );
}
