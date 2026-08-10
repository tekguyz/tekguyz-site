'use client';

import { useRef, useState } from 'react';
import { useSuppressLauncher } from '@/components/concierge/concierge-bus';
import { faq } from '@/content/faq';

/**
 * Hairline rows, no card, no fill — the solution-row logic applied at small
 * scale.
 *
 * Export values: 22px vertical padding, question in Geist 600 at 1.25rem /
 * 1.3 / -0.02em, a thin + / − in the right gutter at 1.125rem, and the answer
 * in body size capped at 62ch with 48px of right padding.
 *
 * A collapsed question sits at `muted`; the open one goes ink, along with its
 * indicator. One open at a time — opening a second closes the first, which is
 * what keeps the list scannable rather than turning into a wall.
 *
 * Rows are full-width buttons so the entire 44px-plus row is the target.
 *
 * NOTHING HERE RUNS ON MOUNT. No autoFocus, no effect, no scrollIntoView — the
 * only focus() call in this file is the arrow-key handler, and it is reachable
 * only from a real keydown. `open` starts at null, so the server and client
 * agree that every row is collapsed and no row can pull the viewport to itself
 * on first paint.
 *
 * Panels stay in the DOM and collapse with `hidden` rather than unmounting.
 * Conditional rendering left all six `aria-controls` pointing at ids that did
 * not exist while collapsed, which is exactly the state a screen reader meets
 * on page load.
 */
export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  /* D-02. An expanded answer is body copy the visitor deliberately asked for,
     on the conversion route, and the launcher sits over its last lines. The FAQ
     never moves: it is FAQPage JSON-LD and it is the content the page is for.
     The floating element yields instead — and it yields on app state, because
     "a row is expanded" is a discrete boolean, not something the launcher's
     scroll-driven observer can see. */
  useSuppressLauncher(open !== null);

  // WAI-ARIA accordion keys. Tab still moves in and out of the group normally;
  // this only adds movement BETWEEN headers, and only on an explicit keypress.
  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = faq.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowDown') next = i === last ? 0 : i + 1;
    else if (e.key === 'ArrowUp') next = i === 0 ? last : i - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    triggers.current[next]?.focus();
  }

  return (
    <div>
      {faq.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.question}
            className={`border-t border-border ${i === faq.length - 1 ? 'border-b' : ''}`}
          >
            <h3 className="m-0">
              <button
                type="button"
                id={`faq-trigger-${i}`}
                ref={(el) => {
                  triggers.current[i] = el;
                }}
                onClick={() => setOpen(isOpen ? null : i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="flex w-full cursor-pointer items-baseline justify-between gap-6 py-[22px] text-left transition-colors duration-[120ms]"
                style={{ color: isOpen ? 'var(--tg-fg)' : 'var(--tg-secondary)' }}
              >
                <span className="text-[1.25rem] leading-[1.3] font-semibold tracking-[-0.02em]">
                  {item.question}
                </span>
                <span aria-hidden className="flex-none text-[1.125rem] leading-none">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>
            {/* Focus deliberately STAYS on the trigger when a row opens — that
                is the ARIA pattern, and moving it into the panel would scroll
                the row the visitor just tapped out from under their thumb. */}
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-trigger-${i}`}
              hidden={!isOpen}
            >
              <p
                className="m-0 max-w-[62ch] pr-12 pb-8 text-[length:var(--text-body)] text-secondary"
                style={{ textWrap: 'pretty' }}
              >
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
