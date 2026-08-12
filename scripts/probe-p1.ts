/**
 * P1 — is `closing-cta` still intersecting the viewport at maximum scroll?
 *
 * This is the fact the re-partition's no-feeder decision rests on. If
 * `footer-dark` is taller than the viewport, `closing-cta` is pushed out of
 * view at the bottom, the launcher's IntersectionObserver releases, the
 * launcher is re-presented, and footer/prev-next overlaps can persist at rest
 * with no user action behind them.
 */

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import {
  INIT_SCRIPT,
  VPS,
  DARK_VPS,
  ALL_ROUTES,
  CLOSING_CTA_ROUTES,
  settleToBottom,
} from './lib/probe-shared.ts';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3210';

const browser = await chromium.launch();
const rows: Record<string, unknown>[] = [];

for (const vp of VPS) {
  const themes: ('light' | 'dark')[] = (DARK_VPS as readonly string[]).includes(vp.label)
    ? ['light', 'dark']
    : ['light'];

  for (const theme of themes) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.width < 768,
      hasTouch: vp.width < 768,
      deviceScaleFactor: vp.dsf,
      colorScheme: theme,
    });
    await ctx.addInitScript({ content: INIT_SCRIPT });
    const page = await ctx.newPage();

    for (const route of ALL_ROUTES) {
      // 'networkidle' is deprecated and flaky; 'load' plus the settle loop is
      // stronger here, because what matters is scrollHeight being stable, not
      // the network being quiet.
      await page.goto(BASE + route, { waitUntil: 'load' });
      const settle = await settleToBottom(page);

      const row = await page.evaluate(() => {
        const t = (window as unknown as { __tg: Record<string, any> }).__tg;
        const footer = document.querySelector('footer.footer-dark');
        const fab = t.findFab();

        /* EVERY [data-primary-cta], never the first. Home carries two — the
           hero CTA and closing-cta — and querySelector returns the hero, which
           is far out of view at maximum scroll. Reading that as "P1 fails"
           would fabricate the exact result this probe exists to detect. */
        const ctas = [...document.querySelectorAll('[data-primary-cta]')];

        return {
          footerHeight: footer ? Math.round(footer.getBoundingClientRect().height) : null,
          viewportHeight: window.innerHeight,
          ctaCount: ctas.length,
          ctaIntersectingAtMaxScroll: ctas.length ? ctas.some((c) => t.inView(c)) : null,
          ...t.presentedState(fab),
        };
      });

      rows.push({ route, viewport: vp.label, theme, ...settle, ...row });
      console.log(
        `p1 ${vp.label.padEnd(12)} ${theme.padEnd(5)} ${route.padEnd(30)} footer=${String(row.footerHeight).padStart(4)} vh=${String(row.viewportHeight).padStart(4)} ctas=${row.ctaCount} ctaInView=${String(row.ctaIntersectingAtMaxScroll).padEnd(5)} presented=${String(row.launcherPresented).padEnd(5)} atBottom=${settle.atBottom}`,
      );
    }
    await ctx.close();
  }
}

await browser.close();
await mkdir('.audit', { recursive: true });
await writeFile('.audit/p1.json', JSON.stringify(rows, null, 2));

/* Self-checks. A zero ctaCount on a closing-cta route means the route list or
   the selector is wrong, and no P1 verdict from this run is trustworthy. A row
   that never reached the bottom is not a max-scroll measurement at all. */
const bad = rows.filter(
  (r) => (CLOSING_CTA_ROUTES as readonly string[]).includes(r.route as string) && !((r.ctaCount as number) > 0),
);
const notAtBottom = rows.filter((r) => !r.atBottom);
console.log('SELF-CHECK ctaCount==0 on closing-cta routes:', bad.length);
console.log('SELF-CHECK rows not at bottom:', notAtBottom.length);
if (bad.length || notAtBottom.length) console.log('*** DO NOT TRUST THIS RUN ***');
console.log('done: p1  rows=' + rows.length);
