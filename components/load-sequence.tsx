'use client';

import { motion, type Variants } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';

/**
 * The hero load sequence and its closing-CTA echo.
 *
 * Timings are the export's literal animation-delays, which resolve the
 * choreography DESIGN.md describes in prose:
 *
 *   dots      0 / 60 / 120 / 180ms   (60ms stagger, fade)
 *   headline  360ms                  (+180ms after the last dot)
 *   subhead   440ms
 *   trust     480ms
 *   cta       600ms
 *   media     600ms                  (concurrent with the CTA row, not chained)
 *
 * Every element uses the same 500ms cubic-bezier(.16,1,.3,1) and a 32px rise,
 * matching the export's `tgUp` keyframe. Resolves at ~1.1s.
 *
 * REDUCED MOTION: the variants below are constant and never branched on a media
 * query during render. Motion's useReducedMotion() reads the query
 * synchronously, resolving false on the server and true on a client that has
 * the preference set — a guaranteed hydration mismatch, and one that actually
 * fired here. The preference is read after mount and only collapses the
 * transition duration to zero, while the `tg-seq` rule in globals.css pins
 * these elements visible before JS runs at all.
 */

const DELAY = {
  headline: 0.36,
  subhead: 0.44,
  trust: 0.48,
  cta: 0.6,
  media: 0.6,
} as const;

export type SequenceRole = keyof typeof DELAY;

const DURATION = 0.5;
const EASE = [0.16, 1, 0.3, 1] as const;

/** Mount-gated so the first client render always matches the server's. */
function useReducedAfterMount(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return reduced;
}

function variantsFor(role: SequenceRole, instant: boolean): Variants {
  const transition = instant
    ? { duration: 0 }
    : { duration: DURATION, ease: EASE, delay: DELAY[role] };

  if (role === 'media') {
    return {
      hidden: { opacity: 0, scale: 0.97 },
      shown: { opacity: 1, scale: 1, transition },
    };
  }
  return {
    hidden: { opacity: 0, y: 32 },
    shown: { opacity: 1, y: 0, transition },
  };
}

export function SequenceRoot({
  trigger,
  children,
  className,
}: {
  /** 'load' for the hero, 'inView' for the closing-CTA echo. */
  trigger: 'load' | 'inView';
  children: ReactNode;
  className?: string;
}) {
  const common = { initial: 'hidden' as const, className };
  return trigger === 'load' ? (
    <motion.div {...common} animate="shown">
      {children}
    </motion.div>
  ) : (
    <motion.div {...common} whileInView="shown" viewport={{ once: true, amount: 0.3 }}>
      {children}
    </motion.div>
  );
}

export function SequenceItem({
  role,
  children,
  className,
}: {
  role: SequenceRole;
  children: ReactNode;
  className?: string;
}) {
  const instant = useReducedAfterMount();
  return (
    <motion.div
      variants={variantsFor(role, instant)}
      className={className ? `tg-seq ${className}` : 'tg-seq'}
    >
      {children}
    </motion.div>
  );
}

const DOTS = [
  'var(--tg-accent-blue)',
  'var(--tg-accent-violet)',
  'var(--tg-accent-amber)',
  'var(--tg-accent-teal)',
] as const;

/** The flourish dots, staggered 60ms apart, as the sequence's first beat. */
export function SequenceDots({ className }: { className?: string }) {
  const instant = useReducedAfterMount();

  return (
    <div aria-hidden className={className} style={{ display: 'flex', gap: '9px' }}>
      {DOTS.map((color, i) => (
        <motion.span
          key={color}
          className="tg-seq"
          variants={{
            hidden: { opacity: 0 },
            shown: {
              opacity: 1,
              transition: instant
                ? { duration: 0 }
                : { duration: DURATION, ease: EASE, delay: i * 0.06 },
            },
          }}
          style={{
            width: '9px',
            height: '9px',
            borderRadius: '999px',
            background: color,
            display: 'block',
          }}
        />
      ))}
    </div>
  );
}
