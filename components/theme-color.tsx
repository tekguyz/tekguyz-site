'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

/**
 * Paints the browser's own chrome — Chrome's Android address bar, Safari's iOS
 * toolbars, the PWA title bar — to match the page instead of leaving a white
 * strip above a dark site.
 *
 * **The media-query form does not work here, and that is not a shortcut being
 * skipped.** The documented way to do this is two static tags:
 *
 *     <meta name="theme-color" media="(prefers-color-scheme: dark)"  content="#101010">
 *     <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff">
 *
 * That tracks the OPERATING SYSTEM. This site is `attribute="class"` with
 * `enableSystem={false}` and `defaultTheme="light"` (DESIGN.md §7 — manual
 * toggle only, the site never auto-switches off the OS preference), so a visitor
 * whose phone is in dark mode and who has left the site in light mode would get
 * a black address bar above a white page. The tag has to follow `resolvedTheme`,
 * which only exists in JS.
 *
 * This is the documented exception to `theme-toggle.tsx`'s rule about never
 * gating on `useTheme()` — that rule's escape hatch is "when a CSS `dark:`
 * variant would do", and no CSS variant can reach a `<meta>` tag's content.
 *
 * Values are the page background in each theme, because the nav is transparent
 * at scroll 0 and what actually sits under the browser's chrome is the canvas.
 * They are literals rather than a `getComputedStyle` read of `--tg-bg`: this
 * runs on theme change, and reading a custom property mid-swap can return the
 * value being replaced.
 *
 * Mutates a DOM node; sets no state. `useState` + `useEffect` here would trip
 * `react-hooks/set-state-in-effect`, which is an error in this repo.
 */
const COLORS = { light: '#ffffff', dark: '#101010' } as const;

export function ThemeColorMeta() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color = COLORS[resolvedTheme === 'dark' ? 'dark' : 'light'];
    let tag = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'theme-color';
      document.head.appendChild(tag);
    }
    tag.content = color;
  }, [resolvedTheme]);

  return null;
}
