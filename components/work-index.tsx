'use client';

import { useState, useSyncExternalStore, type ReactNode } from 'react';
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
 * hears what a press did. On phones the row is one line that scrolls sideways,
 * so the pressed rule always sits on the shared hairline.
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
  // The filter lives in the address (`?solution=ai-voice-agents`), so a
  // filtered view can be shared. Read through `useSyncExternalStore`: the
  // server and the first client render both see "all", then the address wins,
  // so there is no hydration mismatch and no setState in an effect.
  const param = useSyncExternalStore(subscribe, readParam, () => null);
  // Phones: the row scrolls sideways and its right edge fades until the last
  // label is in view, so the hidden filters read as "swipe for more" (#98).
  const [atEnd, setAtEnd] = useState(false);
  const on: SolutionSlug | 'all' = options.some((o) => o.solution === param)
    ? (param as SolutionSlug)
    : 'all';
  const setOn = (next: SolutionSlug | 'all') => {
    const url = new URL(window.location.href);
    if (next === 'all') url.searchParams.delete('solution');
    else url.searchParams.set('solution', next);
    window.history.replaceState(window.history.state, '', url);
    window.dispatchEvent(new Event(FILTER_EVENT));
  };
  const keep = (i: IndexItem) => on === 'all' || i.solution === on;
  const shownFeatured = featured.filter(keep);
  const shownMore = more.filter(keep);
  const total = featured.length + more.length;
  const shown = shownFeatured.length + shownMore.length;
  const counts = new Map<SolutionSlug, number>();
  for (const i of [...featured, ...more]) counts.set(i.solution, (counts.get(i.solution) ?? 0) + 1);

  const buttons: { key: SolutionSlug | 'all'; label: string; n: number }[] = [
    { key: 'all', label: 'All', n: total },
    ...options.map((o) => ({ key: o.solution, label: o.label, n: counts.get(o.solution) ?? 0 })),
  ];

  return (
    <div className="pt-10 md:pt-16">
      <div className="tg-container">
        <div
          role="group"
          aria-label="Show builds by Solution"
          data-screen-ok="scroll-inside: the filter row scrolls sideways on phones (#91)"
          data-end={atEnd ? 'true' : undefined}
          onScroll={(e) => {
            const el = e.currentTarget;
            setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
          }}
          className="tg-filter flex gap-x-6 overflow-x-auto border-b border-border sm:flex-wrap sm:overflow-visible md:gap-x-7"
        >
          {buttons.map((b) => (
            <button
              key={b.key}
              type="button"
              aria-pressed={on === b.key}
              data-on={on === b.key ? 'true' : undefined}
              onClick={() => setOn(b.key)}
              className="tg-rule flex min-h-11 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap text-[15px] font-bold text-fg"
            >
              {b.key !== 'all' && <AccentDot solution={b.key} />}
              {b.label}
              <span className="tabular-nums font-normal text-secondary">{b.n}</span>
            </button>
          ))}
        </div>
        {/* Always in the DOM, so the live region exists before the first
            press; visible only while a filter narrows the list (the page hero
            already says the total). */}
        <p aria-live="polite" className={on === 'all' ? 'sr-only' : 'mt-4 text-[15px] text-secondary'}>
          {on === 'all' ? `Showing all ${total} builds.` : `${shown} of ${total} builds.`}
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

const FILTER_EVENT = 'tg-work-filter';

function subscribe(onChange: () => void) {
  window.addEventListener(FILTER_EVENT, onChange);
  window.addEventListener('popstate', onChange);
  return () => {
    window.removeEventListener(FILTER_EVENT, onChange);
    window.removeEventListener('popstate', onChange);
  };
}

function readParam() {
  return new URLSearchParams(window.location.search).get('solution');
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
