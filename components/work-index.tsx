'use client';

import { useState, type ReactNode } from 'react';
import { AccentDot } from '@/components/solution-tag';
import { SwipeRow } from '@/components/swipe-row';
import type { SolutionSlug } from '@/config/solutions';

export interface IndexItem {
  slug: string;
  solution: SolutionSlug;
  /** The rendered card. Built on the server, so the status checks stay there. */
  node: ReactNode;
}

export interface FilterOption {
  solution: SolutionSlug;
  label: string;
}

/**
 * /work's two groups and the Solution filter above them (#91, 2026-11-20).
 *
 * The filter is a row of toggle buttons, `aria-pressed`, marked by the site's
 * one state primitive (`.tg-rule`, persistent ink on the pressed one), never a
 * filled pill: a lamp never fills a control. Each Solution keeps its lamp dot.
 *
 * Without JavaScript nothing is filtered: the server renders "All", which is
 * every card, so the filter only ever narrows a page that already works.
 * The count line under the filter is a polite live region, so a screen reader
 * hears what a press did.
 */
export function WorkIndex({
  options,
  featured,
  more,
}: {
  options: FilterOption[];
  featured: IndexItem[];
  more: IndexItem[];
}) {
  const [on, setOn] = useState<SolutionSlug | 'all'>('all');
  const keep = (i: IndexItem) => on === 'all' || i.solution === on;
  const shownFeatured = featured.filter(keep);
  const shownMore = more.filter(keep);
  const total = featured.length + more.length;
  const shown = shownFeatured.length + shownMore.length;
  const count = (s: SolutionSlug) => [...featured, ...more].filter((i) => i.solution === s).length;

  const buttons: { key: SolutionSlug | 'all'; label: string; n: number }[] = [
    { key: 'all', label: 'All', n: total },
    ...options.map((o) => ({ key: o.solution, label: o.label, n: count(o.solution) })),
  ];

  return (
    <div className="pt-10 md:pt-16">
      <div className="tg-container">
        <div
          role="group"
          aria-label="Show builds by Solution"
          className="flex flex-wrap gap-x-5 gap-y-0 border-b border-border md:gap-x-7"
        >
          {buttons.map((b) => (
            <button
              key={b.key}
              type="button"
              aria-pressed={on === b.key}
              data-on={on === b.key ? 'true' : undefined}
              onClick={() => setOn(b.key)}
              className="tg-rule flex min-h-11 cursor-pointer items-center gap-2 text-[15px] font-bold text-fg"
            >
              {b.key !== 'all' && <AccentDot solution={b.key} size={9} />}
              {b.label}
              <span className="tabular-nums font-normal text-secondary">{b.n}</span>
            </button>
          ))}
        </div>
        <p aria-live="polite" className="mt-4 text-[15px] text-secondary">
          {on === 'all' ? `All ${total} builds.` : `${shown} of ${total} builds.`}
        </p>

        {shownFeatured.length > 0 && (
          <section aria-labelledby="work-featured" className="mt-10 md:mt-14">
            <GroupHead id="work-featured" title="Featured" note="Open any one and use it yourself" />
            <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-x-12 gap-y-8 p-0 md:gap-y-10 lg:grid-cols-2">
              {shownFeatured.map((i) => (
                <li key={i.slug}>{i.node}</li>
              ))}
            </ul>
          </section>
        )}

        {shownMore.length > 0 && (
          <section aria-labelledby="work-more" className="mt-16 md:mt-24">
            <GroupHead id="work-more" title="More builds" note="Same standard, every one live" />
            <div className="mt-6 md:mt-8">
              {/* Keyed by the filter: a new set of cards starts the swipe row
                  and its dots from the first card. */}
              <SwipeRow key={on} label="More builds">
                {shownMore.map((i) => (
                  <div key={i.slug} className="h-full">
                    {i.node}
                  </div>
                ))}
              </SwipeRow>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function GroupHead({ id, title, note }: { id: string; title: string; note: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b-2 border-fg pb-5">
      <h2 id={id} className="tg-plain tg-eyebrow">
        {title}
      </h2>
      <span className="text-[15px] text-secondary">{note}</span>
    </div>
  );
}
