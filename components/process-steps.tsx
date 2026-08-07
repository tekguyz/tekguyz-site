'use client';

import { useEffect, useRef, useState } from 'react';
import { STRIPE_ORDER, accent } from '@/config/solutions';
import { processSteps } from '@/content/process';

/**
 * The ONE pinned moment on the site, /process only.
 *
 * Export layout: a sticky rail on cols 1-3 (top 140px) holding a 2px, 300px-tall
 * hairline track with an ink fill whose height tracks scroll progress, and four
 * labels distributed across that same 300px. The active label goes ink and 600
 * weight; the rest stay muted at 400. A "Step 0N of 04" readout sits below.
 *
 * Steps occupy cols 4-13 with 72px/96px padding and hairline separators. Each
 * carries its numeral absolutely positioned behind the title at 8% opacity in
 * that step's accent — the only numerals on the site, because /process is the
 * only genuinely ordered sequence.
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
  const [reduced, setReduced] = useState(false);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

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
    <div className="tg-container tg-grid items-start pb-32">
      <div className="tg-pin hidden lg:block" style={{ gridColumn: '1 / 3' }}>
        <div className="flex gap-5">
          <div
            className="relative w-[2px] flex-none"
            style={{ height: 300, background: 'var(--tg-border)' }}
          >
            <div
              className="absolute top-0 left-0 w-[2px]"
              style={{
                height: `${Math.round(progress * 100)}%`,
                background: 'var(--tg-fg)',
                transition: 'height 120ms linear',
              }}
            />
          </div>
          <div
            className="flex flex-col justify-between tabular-nums"
            style={{ height: 300 }}
          >
            {processSteps.map((step, i) => {
              const on = !reduced && i === active;
              return (
                <span
                  key={step.numeral}
                  className="text-[0.875rem] leading-[1.55] tracking-[0.04em] transition-colors duration-[120ms]"
                  style={{
                    fontWeight: on ? 600 : 400,
                    color: on ? 'var(--tg-fg)' : 'var(--tg-secondary)',
                  }}
                >
                  {step.numeral} {step.title}
                </span>
              );
            })}
          </div>
        </div>
        <p className="mt-9 text-[0.875rem] leading-[1.55] tabular-nums text-secondary">
          Step {String(active + 1).padStart(2, '0')} of 04
        </p>
      </div>

      <div style={{ gridColumn: '4 / 13' }}>
        {processSteps.map((step, i) => (
          <div
            key={step.numeral}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            // No data-reveal-index: the stagger is for grids that enter
            // together. These four are a screen apart, so an index would just
            // add up to 240ms of dead time before a step that arrives alone.
            className={`reveal relative border-t border-border pt-18 pb-24 ${i === processSteps.length - 1 ? 'border-b' : ''}`}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -left-4 top-9 text-[length:var(--text-hero)] leading-none font-bold tracking-[-0.045em] tabular-nums select-none"
              style={{ color: accent(STRIPE_ORDER[i]!).dot, opacity: 0.08 }}
            >
              {step.numeral}
            </span>
            <div className="relative">
              <h2 className="text-[length:var(--text-display)] leading-[1.1] font-semibold tracking-[-0.025em]">
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
        ))}
      </div>
    </div>
  );
}
