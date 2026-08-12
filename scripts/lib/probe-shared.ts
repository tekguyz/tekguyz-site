/**
 * One definition of every primitive the overlap probes share.
 *
 * Two locators for the launcher would mean two possible elements and a
 * partition drawn across both, so `findFab` is reproduced verbatim from
 * `audit-mobile.ts:474-477` rather than rewritten.
 */

import type { Page } from 'playwright';

/**
 * Routes that render `<ClosingCta />`, derived from the JSX usages rather than
 * sampled. Verified 2026-08-11: exactly 7 files match `<ClosingCta`, and
 * `/privacy` is genuinely one of them (`app/privacy/page.tsx:97`). The two
 * dynamic segments are represented by one concrete instance each.
 */
export const CLOSING_CTA_ROUTES = [
  '/',
  '/privacy',
  '/process',
  '/solutions',
  '/solutions/ai-voice-agents',
  '/work',
  '/work/field-photo-reports',
] as const;

/**
 * `/contact` renders no ClosingCta — the design export has no closing CTA
 * there, since the page itself is the ask. That makes it the one route where
 * the launcher can still be presented at maximum scroll, and therefore the
 * only non-degenerate max-scroll measurement available.
 */
export const ALL_ROUTES = [...CLOSING_CTA_ROUTES, '/contact'] as const;

/** Labels match `audit-mobile.ts`'s VIEWPORTS. */
export const VPS = [
  { label: 'narrow', width: 360, height: 800, dsf: 3 },
  { label: 'se', width: 375, height: 667, dsf: 2 },
  { label: 'standard', width: 390, height: 844, dsf: 3 },
  { label: 'large-phone', width: 414, height: 896, dsf: 2 },
  { label: 'landscape', width: 844, height: 390, dsf: 3 },
] as const;

/** The two the existing sweep already darkens (`audit-mobile.ts:570`). */
export const DARK_VPS = ['narrow', 'standard'] as const;

export const INIT_SCRIPT = `
window.__tg = {
  /* Verbatim from audit-mobile.ts:474-477. */
  findFab: () =>
    [...document.querySelectorAll('button')].find((b) =>
      (b.textContent || '').includes('Ask about your project'),
    ) || null,

  presentedState: (fab) => {
    if (!fab) return { launcherOpacity: null, launcherPointerEvents: null, launcherAriaHidden: null, launcherPresented: false };
    const cs = getComputedStyle(fab);
    const opacity = Number(cs.opacity);
    return {
      launcherOpacity: opacity,
      launcherPointerEvents: cs.pointerEvents,
      launcherAriaHidden: fab.getAttribute('aria-hidden'),
      launcherPresented: opacity > 0.5 && cs.pointerEvents !== 'none',
    };
  },

  inView: (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight && r.width > 0 && r.height > 0;
  },

  overlapArea: (a, b) => {
    const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    return w > 0 && h > 0 ? w * h : 0;
  },

  sel: (el) => {
    if (!el) return null;
    const id = el.id ? '#' + el.id : '';
    const cls = typeof el.className === 'string' && el.className
      ? '.' + el.className.trim().split(/\\s+/).slice(0, 3).join('.')
      : '';
    return el.tagName.toLowerCase() + id + cls;
  },

  INTERACTIVE: 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',
};
`;

/**
 * `scrollHeight` is not stable at `load`: footer images and the font swap both
 * change it afterwards. Scrolling once can leave the page ~200px above the
 * bottom — exactly where the P1 answer flips. Loop until the height stops
 * moving, then report whether we actually reached the bottom so a row that
 * did not can be excluded from evidence rather than silently trusted.
 */
export async function settleToBottom(page: Page) {
  return page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    let prev = -1;
    let guard = 0;
    while (prev !== document.documentElement.scrollHeight && guard++ < 12) {
      prev = document.documentElement.scrollHeight;
      window.scrollTo(0, prev);
      await sleep(250);
    }
    await sleep(250);
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
    return {
      scrollY: Math.round(window.scrollY),
      maxScrollY: Math.round(maxScrollY),
      atBottom: Math.abs(window.scrollY - maxScrollY) <= 2,
      settleIterations: guard,
    };
  });
}
