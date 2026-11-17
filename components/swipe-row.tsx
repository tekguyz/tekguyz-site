'use client';

import { Children, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * A row of cards that swipe on phones (#80, founder 2026-11-16): each card
 * snaps, the next one peeks in, and dots under the row say where you are. It
 * never moves by itself — no auto-play, so it reads at the visitor's pace and
 * passes WCAG 2.2.2.
 *
 * From 640px it is a plain grid (`sm:` columns from `gridClass`) and the dots
 * go away: there is room to show every card.
 *
 * The dots are buttons (tap one to go to that card). The active one follows
 * the scroll through an IntersectionObserver on the cards, never a scroll
 * handler, and scrolling uses `behavior: 'smooth'` only when motion is allowed.
 */
export function SwipeRow({
  children,
  label,
  gridClass = 'sm:grid-cols-2 lg:grid-cols-3',
}: {
  children: ReactNode;
  /** What the row holds, for the dots' group label ("More builds"). */
  label: string;
  gridClass?: string;
}) {
  const items = Children.toArray(children);
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const cards = Array.from(list.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(cards.indexOf(e.target as HTMLElement));
        }
      },
      { root: list, threshold: 0.6 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [items.length]);

  const go = (i: number) => {
    const list = listRef.current;
    const card = list?.children[i] as HTMLElement | undefined;
    if (!list || !card) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.scrollTo({ left: card.offsetLeft - list.offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div>
      <ul
        ref={listRef}
        data-screen-ok="scroll-inside: a swipe row scrolls sideways on purpose (#80)"
        className={`tg-swipe m-0 list-none p-0 sm:grid sm:gap-5 ${gridClass}`}
      >
        {items.map((child, i) => (
          <li key={i} className="tg-swipe-item">
            {child}
          </li>
        ))}
      </ul>
      {items.length > 1 && (
        <div role="group" aria-label={`${label}: pick a card`} className="mt-1 flex justify-center sm:hidden">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Card ${i + 1} of ${items.length}`}
              aria-current={i === active ? 'true' : undefined}
              onClick={() => go(i)}
              className="flex h-11 w-11 cursor-pointer items-center justify-center"
            >
              <span
                aria-hidden
                className="block h-2 w-2 rounded-full"
                style={{ background: i === active ? 'var(--tg-fg)' : 'var(--tg-border)' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
