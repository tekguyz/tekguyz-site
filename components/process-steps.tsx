'use client';

import { useEffect, useRef, useState } from 'react';
import { NumeralDevice } from '@/components/numeral-device';
import { STRIPE_ORDER } from '@/config/solutions';
import { processSteps } from '@/content/process';

/**
 * DESIGN.md §6 — the ONE pinned moment on the site, /process only.
 *
 * Steps pin while a progress rail advances. It's used exactly once, which is
 * what makes it register; the same logic is why /process is the only page that
 * gets numerals — it's the only genuinely ordered sequence on the site.
 *
 * Under prefers-reduced-motion the pin is removed entirely and this degrades to
 * a plain stacked list, which is the accessibility floor CANONICAL §6 requires.
 */
export function ProcessSteps() {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = stepRefs.current.findIndex((el) => el === e.target);
            if (i >= 0) setActive(i);
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    for (const el of stepRefs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div className="tg-container tg-grid items-start">
      {/* Progress rail — pinned while the steps scroll past it. */}
      <div
        className="hidden lg:block lg:sticky lg:top-32 motion-reduce:lg:static"
        style={{ gridColumn: '1 / 4' }}
      >
        <ol className="m-0 flex list-none flex-col gap-4 p-0">
          {processSteps.map((step, i) => {
            const on = !reduced && i === active;
            return (
              <li key={step.numeral} className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="h-[2px] transition-all duration-[var(--dur-base)]"
                  style={{
                    width: on ? 32 : 16,
                    background: on ? 'var(--tg-fg)' : 'var(--tg-border-strong)',
                  }}
                />
                <span
                  className="font-mono text-[0.875rem] tabular-nums transition-colors duration-[var(--dur-base)]"
                  style={{ color: on ? 'var(--tg-fg)' : 'var(--tg-secondary)' }}
                >
                  {step.numeral} {step.title}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex flex-col gap-24 lg:gap-40" style={{ gridColumn: '5 / 13' }}>
        {processSteps.map((step, i) => (
          <div
            key={step.numeral}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            className="reveal relative"
          >
            <NumeralDevice numeral={step.numeral} accentKey={STRIPE_ORDER[i]!} />
            <h2 className="relative text-[length:var(--text-display)] leading-[1.05] font-bold tracking-[-0.03em]">
              {step.title}
            </h2>
            <p className="relative mt-6 max-w-[62ch] text-[length:var(--text-body)]">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
