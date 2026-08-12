/**
 * What overlaps the launcher at maximum scroll — across ALL 8 routes.
 *
 * P1 measured the launcher fully presented at the bottom of every route
 * (footer-dark is 956px against mobile viewports of 667-896, so closing-cta is
 * off-screen before the bottom is reached). `/contact` is therefore not
 * uniquely non-degenerate; every route is. Anything overlapping here is a
 * static-at-rest overlap with no user action behind it.
 */

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { INIT_SCRIPT, VPS, DARK_VPS, ALL_ROUTES, settleToBottom } from './lib/probe-shared.ts';

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
      await page.goto(BASE + route, { waitUntil: 'load' });
      const settle = await settleToBottom(page);

      const row = await page.evaluate(() => {
        const t = (window as unknown as { __tg: Record<string, any> }).__tg;
        const fab = t.findFab();
        if (!fab) return { reason: 'launcher not found', launcherPresented: false, overlaps: [] };

        const state = t.presentedState(fab);
        const fr = fab.getBoundingClientRect();
        const overlaps: Record<string, unknown>[] = [];

        for (const el of document.querySelectorAll(t.INTERACTIVE)) {
          if (el === fab || fab.contains(el) || el.contains(fab)) continue;
          const er = el.getBoundingClientRect();
          if (er.width === 0 || er.height === 0) continue;
          const area = t.overlapArea(fr, er);
          if (area <= 0) continue;
          const cx = (Math.max(fr.left, er.left) + Math.min(fr.right, er.right)) / 2;
          const cy = (Math.max(fr.top, er.top) + Math.min(fr.bottom, er.bottom)) / 2;
          overlaps.push({
            selector: t.sel(el),
            text: (el.textContent || '').trim().slice(0, 44),
            coveredFraction: +(area / (er.width * er.height)).toFixed(3),
            topmostAtOverlapCentre: t.sel(document.elementFromPoint(cx, cy)),
            inFooter: !!el.closest('footer.footer-dark'),
          });
        }
        return { ...state, overlaps };
      });

      rows.push({ route, viewport: vp.label, theme, ...settle, ...row });
      const ov = (row.overlaps as unknown[]) ?? [];
      console.log(
        `bottom ${vp.label.padEnd(12)} ${theme.padEnd(5)} ${route.padEnd(30)} presented=${String(row.launcherPresented).padEnd(5)} overlaps=${ov.length}`,
      );
    }
    await ctx.close();
  }
}

await browser.close();
await mkdir('.audit', { recursive: true });
await writeFile('.audit/bottom.json', JSON.stringify(rows, null, 2));

const total = rows.reduce((n, r) => n + ((r.overlaps as unknown[]) ?? []).length, 0);
const notAtBottom = rows.filter((r) => !r.atBottom).length;
const notPresented = rows.filter((r) => !r.launcherPresented).length;
console.log('SELF-CHECK rows not at bottom:', notAtBottom);
console.log('SELF-CHECK rows where launcher not presented:', notPresented);
console.log('TOTAL overlap pairs at maximum scroll:', total);
console.log('done: bottom  rows=' + rows.length);
