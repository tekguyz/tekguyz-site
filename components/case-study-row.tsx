import Link from 'next/link';
import { ViewTransition } from 'react';
import { LiveFrame } from '@/components/live-frame';
import { StatusLine } from '@/components/status-line';
import { PullQuote } from '@/components/pull-quote';
import { BuildNarrative } from '@/components/build-narrative';
import { SolutionTag } from '@/components/solution-tag';
import type { CaseStudy } from '@/content/work';
import type { StatusResult } from '@/lib/status';

/**
 * DESIGN.md §4 — full-width alternating row, on the ink band (home) or the
 * standard background (/work index).
 *
 * Solution tag, title, Challenge/Approach/Outcome as three labeled beats,
 * pull-quote, LiveFrame, status line, and build-narrative. Substantial by
 * design — the weight gap from project-card is intentional signal.
 *
 * Rows alternate offset, not mirrored:
 *   even -> text 1-5  / media 7-12
 *   odd  -> media 1-6 / text 8-12
 *
 * Text and media reveal as ONE unit: one idea, not two. That's why the reveal
 * class sits on the row, never on the halves.
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
    <div style={{ gridColumn: mediaFirst ? '8 / 13' : '1 / 6' }}>
      <SolutionTag solution={entry.solution} label={entry.tag} />

      <h3 className="mt-6 text-[length:var(--text-display)] leading-[1.05] font-bold tracking-[-0.03em]">
        <Link href={`/work/${entry.slug}`} className="link-underline">
          {entry.name}
        </Link>
      </h3>

      <dl className="mt-8 flex flex-col gap-6">
        {[
          ['The Challenge', entry.challenge],
          ['The Approach', entry.approach],
          ['The Outcome', entry.outcome],
        ].map(([label, body]) => (
          <div key={label}>
            <dt className="mb-2 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
              {label}
            </dt>
            <dd className="m-0 max-w-[62ch] text-[length:var(--text-body)]">{body}</dd>
          </div>
        ))}
      </dl>

      <PullQuote solution={entry.solution} className="mt-10">
        {entry.pullQuote}
      </PullQuote>

      <Link
        href={`/work/${entry.slug}`}
        className="link-underline mt-10 inline-flex text-[0.875rem] font-semibold"
      >
        Read the full build
        <span aria-hidden className="ml-1">
          →
        </span>
      </Link>
    </div>
  );

  const media = (
    <div style={{ gridColumn: mediaFirst ? '1 / 7' : '7 / 13' }}>
      <ViewTransition name={`work-${entry.slug}`} share="morph" default="none">
        <div>
          <LiveFrame poster={entry.poster} url={entry.url} alt={entry.alt} />
        </div>
      </ViewTransition>
      <StatusLine result={status} className="mt-4" />
      <BuildNarrative className="mt-6">{entry.howItsBuilt}</BuildNarrative>
    </div>
  );

  return (
    <article className="reveal tg-container tg-grid items-start gap-y-12">
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
