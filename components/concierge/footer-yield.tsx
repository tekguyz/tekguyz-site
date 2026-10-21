'use client';

import { useEffect, useRef, useState } from 'react';
import { useSuppressLauncher } from '@/components/concierge/concierge-bus';

/**
 * Hides the concierge launcher while any part of the footer is on screen
 * (refs #55). At 412px the launcher sat on the footer's link columns, and at
 * 1440 on "Get in touch".
 *
 * It feeds the SECOND yield channel (app state), never the observer over
 * `[data-primary-cta]` — widening that target set is what causes flicker. This
 * one boundary cannot flicker in practice: the closing CTA band sits directly
 * above the footer on every route that has one and already yields the launcher,
 * so the launcher is hidden before the footer arrives and stays hidden past it.
 *
 * Renders an empty, `aria-hidden` span inside the footer and observes the
 * footer itself, so the server-rendered footer stays a server component.
 */
export function FooterLauncherYield() {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const footer = ref.current?.closest('footer');
    if (!footer) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  useSuppressLauncher(inView);

  return <span ref={ref} aria-hidden hidden />;
}
