'use client';

import { motion, type Variants } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';

/**
 * DESIGN.md §6 — the hero load sequence, and its closing-CTA echo.
 *
 *   flourish dots stagger 60ms apart
 *     -> headline fades up (32px -> 0)
 *     -> subhead
 *     -> CTA row
 *     -> hero media scales 0.97 -> 1 CONCURRENTLY with the CTA row, not after.
 *
 * Resolves under ~900ms. The hero runs it on mount and never re-triggers; the
 * closing CTA replays the identical sequence on scroll-into-view, once.
 *
 * This is the one place Motion earns its inclusion — CSS scroll-driven
 * animations handle every other entrance on the site.
 *
 * REDUCED MOTION, and why it's done this way: the variants below are constant,
 * never branched on a media query during render. Motion's useReducedMotion()
 * reads the query synchronously, which resolves false on the server and true on
 * a client that has the preference set — a guaranteed hydration mismatch, and
 * one that actually fired here. Instead the preference is read after mount and
 * only collapses the transition DURATION to zero, while the `tg-seq` CSS rule
 * in globals.css pins these elements visible before JS ever runs. That covers
 * both the pre-hydration paint and Motion's inline styles.
 */

const STEP = {
  dot: (i: number) => i * 0.06,
  headline: 0.36,
  subhead: 0.44,
  cta: 0.52,
  media: 0.52,
} as const;

export type SequenceRole = 'headline' | 'subhead' | 'cta' | 'media';

const DURATION = 0.36;
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
    : { duration: DURATION, ease: EASE, delay: STEP[role] };

  if (role === 'media') {
    return {
      hidden: { opacity: 0, scale: 0.97 },
      shown: { opacity: 1, scale: 1, transition },
    };
  }
  return {
    hidden: { opacity: 0, y: role === 'headline' ? 32 : 16 },
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
    <div aria-hidden className={className} style={{ display: 'flex', gap: '10px' }}>
      {DOTS.map((color, i) => (
        <motion.span
          key={color}
          className="tg-seq"
          variants={{
            hidden: { opacity: 0, scale: 0.4 },
            shown: {
              opacity: 1,
              scale: 1,
              transition: instant ? { duration: 0 } : { duration: 0.24, ease: EASE, delay: STEP.dot(i) },
            },
          }}
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '999px',
            background: color,
            display: 'block',
          }}
        />
      ))}
    </div>
  );
}
