'use client';

import { useState } from 'react';
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
 */
export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

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
                onClick={() => setOpen(isOpen ? null : i)}
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
            {isOpen && (
              <p
                id={`faq-panel-${i}`}
                className="m-0 max-w-[62ch] pr-12 pb-8 text-[length:var(--text-body)] text-secondary"
                style={{ textWrap: 'pretty' }}
              >
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
