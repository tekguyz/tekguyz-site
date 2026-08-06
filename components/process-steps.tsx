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
 * stacked list, which is the accessibility floor CANONICAL §6 requires.
 */
export function ProcessSteps() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

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
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      setProgress(p);
      setActive(Math.max(0, Math.min(3, Math.floor(p * 3.999))));
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
    <div ref={wrapRef} className="tg-container tg-grid items-start pb-32">
      <div
        className="hidden lg:block lg:sticky lg:top-[140px] motion-reduce:lg:static"
        style={{ gridColumn: '1 / 3' }}
      >
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
            className={`relative border-t border-border pt-18 pb-24 ${i === processSteps.length - 1 ? 'border-b' : ''}`}
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
