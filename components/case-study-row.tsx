import Link from 'next/link';
import { ViewTransition } from 'react';
import { Frame, FrameMeta, BuildNarrative } from '@/components/live-frame';
import { PullQuote } from '@/components/pull-quote';
import { SolutionTag } from '@/components/solution-tag';
import type { CaseStudy } from '@/content/work';
import type { StatusResult } from '@/lib/status';

/**
 * The /work index case-study row.
 *
 * Export layout alternates by offset, not mirror:
 *   even  text 1-6  / media 7-13
 *   odd   media 1-7 / text 8-13
 *
 * 80px vertical padding, hairline between rows, `align-items:start`.
 *
 * The media column carries frame -> status + demo link -> the "Try it" note ->
 * "How it's built". That last block belongs HERE as well as on the standalone
 * detail pages: the index shows the identical full-length content and had the
 * identical trailing-empty-space problem without it.
 *
 * Text and media as one unit — one idea, not two — so the class
 * sits on the row, never on the halves.
 */
export function CaseStudyRow({
  entry,
  status,
  index,
}: {
  entry: CaseStudy;
  status: StatusResult;
  index: number;
}) {
  const mediaFirst = index % 2 === 1;

  const text = (
    <div
      className={
        mediaFirst
          ? '[grid-column:8/13] max-lg:[grid-column:6/9]'
          : '[grid-column:1/6] max-lg:[grid-column:1/4]'
      }
    >
      <SolutionTag solution={entry.solution} label={entry.tag} />
      <h3
        className="mt-6 text-[length:var(--text-title)] leading-[1.2] font-semibold tracking-[-0.02em]"
        style={{ textWrap: 'pretty' }}
      >
        <Link href={`/work/${entry.slug}`} className="tap-44 link-underline">
          {entry.name}
        </Link>
      </h3>
      <p
        className="mt-6 text-[length:var(--text-body)] text-secondary"
        style={{ textWrap: 'pretty' }}
      >
        {entry.approach}
      </p>
      <PullQuote solution={entry.solution} className="mt-11">
        {entry.pullQuote}
      </PullQuote>
      <Link
        href={`/work/${entry.slug}`}
        className="tap-44 link-underline mt-9 inline-block text-[14.5px] font-semibold"
      >
        Read the full story →
      </Link>
    </div>
  );

  const media = (
    // 768–1023: the offset alternation is preserved, not flattened to halves —
    // 5/gap/6 becomes 3/gap/4 and 6/gap/5 becomes 4/gap/3.
    <div
      className={
        mediaFirst
          ? '[grid-column:1/7] max-lg:[grid-column:1/5]'
          : '[grid-column:7/13] max-lg:[grid-column:5/9]'
      }
    >
      <ViewTransition name={`work-${entry.slug}`} share="morph" default="none">
        <div>
          <Frame poster={entry.poster} alt={entry.alt} />
        </div>
      </ViewTransition>
      <FrameMeta status={status} url={entry.url} />
      <p className="mt-5 text-[0.875rem] leading-[1.55] text-secondary">{entry.tryIt}</p>
      <BuildNarrative>{entry.howItsBuilt}</BuildNarrative>
    </div>
  );

  return (
    // `reveal` on the row, never on the halves — text and media enter as one
    // unit, because they are one idea.
    <article
      className={`reveal tg-container tg-grid items-start gap-y-12 py-20 ${index > 0 ? 'border-t border-border' : ''}`}
    >
      {mediaFirst ? (
        <>
          {media}
          {text}
        </>
      ) : (
        <>
          {text}
          {media}
        </>
      )}
    </article>
  );
}
