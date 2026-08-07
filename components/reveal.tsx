'use client';

import { useEffect } from 'react';

/**
 * Scroll reveals — DESIGN.md §6.
 *
 * IntersectionObserver adds `.is-revealed` on FIRST intersection and then stops
 * observing that element. A plain CSS transition on the class change does the
 * animating. No scroll-linked timeline.
 *
 * Why not `animation-timeline: view()`, which an earlier pass used: that API
 * scrubs with scroll position, so scrolling back up ran the reveal in reverse
 * and content faded out again. It cannot express "once", which is the whole
 * contract here.
 *
 * THE SAFETY PROPERTY, and the reason this is a component rather than a CSS
 * rule: elements are visible by default. `.reveal` alone does nothing. The
 * hidden state lives on `.reveal-armed`, which only this component adds, and it
 * adds it from an effect — so JS is already running by the time anything is
 * hidden. If the observer never runs (no JS, unsupported browser, hydration
 * failure), every section simply renders visible. The previous implementation
 * shipped `opacity: 0` in static CSS with nothing guaranteed to remove it, which
 * blanked half the homepage.
 */
export function RevealController() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (targets.length === 0) return;

    // Anything already on screen at mount is revealed immediately without
    // animating — a first-paint fade of above-the-fold content reads as jank,
    // and the hero has its own choreographed sequence already.
    const pending: HTMLElement[] = [];
    for (const el of targets) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add('is-revealed');
      } else {
        el.classList.add('reveal-armed');
        pending.push(el);
      }
    }
    if (pending.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          // Stagger within a group, capped so a long list never trails.
          const index = Number(el.dataset.revealIndex ?? '0');
          el.style.transitionDelay = `${Math.min(index, 3) * 80}ms`;
          el.classList.add('is-revealed');
          // Once only: stop watching this element immediately.
          observer.unobserve(el);
        }
      },
      // Fire when 15% of the element has entered the viewport.
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' },
    );

    for (const el of pending) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return null;
}
