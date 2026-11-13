'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { processSteps } from '@/content/process';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

/**
 * The ONE pinned moment on the site, /process only.
 *
 * Export layout: a sticky rail on cols 1-3 (top 140px) holding a 2px, 300px-tall
 * hairline track with an ink fill whose height tracks scroll progress, and four
 * labels distributed across that same 300px. The active label goes ink and 600
 * weight; the rest stay muted at 400. A "Step 0N of 04" readout sits below.
 *
 * Steps occupy cols 4-13 with 72px/96px padding and hairline separators. Each
 * carries its numeral as a small mono label above the title (Seam: numbers stay
 * because the order matters, and data is mono).

 *
 * Under prefers-reduced-motion the pin is removed and this degrades to a plain
 * stacked list, which is the accessibility floor CANONICAL §6 requires. The pin
 * itself is `.tg-pin` in globals.css rather than a `lg:sticky ...
 * motion-reduce:lg:static` utility stack — see the comment there for why that
 * stack could not be relied on.
 *
 * THE RAIL READS THE STEPS' OWN POSITIONS, not a fraction of the section's
 * scrollable range. It used to compute `p = -rect.top / (sectionHeight -
 * innerHeight)` and derive the active step as `floor(p * 3.999)`. Those two
 * measurements are unrelated: measured at 1280x720, the scrollable range was
 * 714px while the four steps spanned 1434px, so the readout hit "Step 04 of 04"
 * at 536px into the section when step 04 did not begin until 993px — the rail
 * ran a step and a half ahead of the content the whole way down. A progress
 * indicator that disagrees with the page is worse than none, and this one is
 * only on the site because /process is a genuine sequence where scroll position
 * encodes real information (CANONICAL §6).
 */
export function ProcessSteps() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  /* Where each step begins along the rail's track, 0–1. Measured from the steps'
     own tops, for the same reason `progress` is: the node for step N sits where
     the fill is when step N starts, not at an even quarter. Starts even and is
     replaced on the first scroll/resize measurement. */
  const [marks, setMarks] = useState<number[]>(() =>
    processSteps.map((_, i) => i / processSteps.length),
  );
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);

  /* This file used to carry its own character-identical copy of the query +
     `change` listener that `load-sequence.tsx` had already named as a hook —
     the copy existed only because the original was trapped in a component file
     and could not be imported without importing the load sequence. Shared as of
     2026-08-13; behaviour is unchanged. */
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[];
      if (steps.length === 0) return;

      // The reference line the rail reads against: a little above the middle of
      // the viewport, which is where a reader's eye actually is.
      const line = window.innerHeight * 0.45;

      const first = steps[0]!.getBoundingClientRect();
      const last = steps[steps.length - 1]!.getBoundingClientRect();
      const span = last.bottom - first.top;
      setProgress(span > 0 ? Math.min(1, Math.max(0, (line - first.top) / span)) : 0);
      if (span > 0) {
        const next = steps.map((s) => (s.getBoundingClientRect().top - first.top) / span);
        // Relative offsets don't change while scrolling, only on resize; skip the
        // state write unless one actually moved, so a scroll doesn't re-render twice.
        setMarks((prev) =>
          prev.length === next.length && prev.every((v, i) => Math.abs(v - next[i]!) < 0.002)
            ? prev
            : next,
        );
      }

      let current = 0;
      for (let i = 0; i < steps.length; i++) {
        if (steps[i]!.getBoundingClientRect().top <= line) current = i;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  return (
    <div className="tg-container tg-grid items-start pt-4 pb-20 md:pt-8 md:pb-28">
      <div className="tg-pin hidden lg:block" style={{ gridColumn: '1 / 3' }}>
        {/* One 300px box holds the track and the four nodes. Each node sits at its
            step's measured start, with its label hung off it, so the label, the
            dot and the fill all agree about where step N begins. */}
        <div className="relative my-3 tabular-nums" style={{ height: 300 }}>
          <div
            className="absolute inset-y-0 left-0 w-[2px]"
            style={{ background: 'var(--tg-border)' }}
          >
            <div
              className="absolute inset-0 origin-top"
              style={{
                transform: `scaleY(${progress})`,
                background: 'var(--tg-fg)',
                transition: 'transform 120ms linear',
              }}
            />
          </div>
          {processSteps.map((step, i) => {
            const reached = !reduced && i <= active;
            const on = !reduced && i === active;
            return (
              <div
                key={step.numeral}
                className="absolute left-0 flex items-center"
                style={{ top: `${marks[i]! * 100}%`, transform: 'translateY(-50%)' }}
              >
                <span
                  aria-hidden
                  className="-ml-[5px] block size-3 flex-none rounded-full border-2 transition-[background-color,border-color,transform] duration-[120ms]"
                  style={{
                    background: reached ? 'var(--tg-fg)' : 'var(--tg-bg)',
                    borderColor: reached ? 'var(--tg-fg)' : 'var(--tg-border-strong)',
                    transform: on ? 'scale(1.25)' : 'scale(1)',
                  }}
                />
                <span
                  className="ml-4 text-[15px] leading-[1.35] transition-colors duration-[120ms]"
                  style={{
                    fontWeight: on ? 700 : 400,
                    color: on ? 'var(--tg-fg)' : 'var(--tg-secondary)',
                  }}
                >
                  {step.numeral} {step.title}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-9 text-[15px] leading-[1.55] tabular-nums text-secondary">
          Step {String(active + 1).padStart(2, '0')} of {String(processSteps.length).padStart(2, '0')}
        </p>
      </div>

      {/* The rail beside this is `hidden lg:block`, so in the 768–1023 band there
          is no second column and the steps take all 8 tracks. */}
      <div className="[grid-column:4/13] max-lg:[grid-column:1/-1]">
        {processSteps.map((step, i) => {
          // Under reduced motion nothing tracks scroll, so every step reads as lit.
          const lit = reduced || i === active;
          return (
            <div
              key={step.numeral}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              // No data-reveal-index: the stagger is for grids that enter
              // together. These four are a screen apart, so an index would just
              // add up to 240ms of dead time before a step that arrives alone.
              //
              // The top edge is the home teaser's staircase: `.tg-rule` drawn
              // 25 / 50 / 75 / 100% of the way across, ink once the reader has
              // reached that step. The same object as the teaser and the contact
              // form's rail, not a new state mechanism (DESIGN.md §4.17).
              data-on={reduced || i <= active}
              style={{ '--tg-rule-scale': (i + 1) / processSteps.length } as CSSProperties}
              className={`tg-rule tg-rule-top relative border-t border-border pt-18 pb-16 md:pb-24 ${i === processSteps.length - 1 ? 'border-b' : ''}`}
            >
              <span
                aria-hidden
                className="label text-mute pointer-events-none absolute left-0 top-8 hidden tabular-nums select-none lg:block"
              >
                {step.numeral}
              </span>
              <div className="relative">
                {/* Below 1024px the rail is hidden, so this is the only place a
                    phone or tablet reader is told where they are in the sequence. */}
                <p className="mb-4 text-[15px] leading-[1.55] tabular-nums text-secondary lg:hidden">
                  Step {step.numeral} of {String(processSteps.length).padStart(2, '0')}
                </p>
                <h2
                  className="text-[length:var(--text-display)] transition-colors duration-[120ms]"
                  style={{ color: lit ? 'var(--tg-fg)' : 'var(--tg-secondary)' }}
                >
                  {step.title}
                </h2>
                <p
                  className="mt-7 max-w-[58ch] text-[length:var(--text-body)] text-secondary"
                  style={{ textWrap: 'pretty' }}
                >
                  {step.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
