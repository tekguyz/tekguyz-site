/**
 * Concierge verification harness — Prompt 10.
 *
 * MEASURES ONLY. Companion to `scripts/audit-mobile.ts`, same protocol:
 *
 *   (Get-NetTCPConnection -LocalPort 3210 -State Listen).OwningProcess |
 *     % { taskkill /PID $_ /T /F }
 *   bun run build
 *   bunx next start -p 3210
 *   node --experimental-strip-types scripts/audit-concierge.ts <phase>
 *
 * NOT under Bun — Bun's stdio handling breaks Playwright's remote-debugging
 * pipe on Windows (see audit-mobile.ts's header).
 *
 * Phases:
 *   m19       MOBILE-AUDIT.md §7 H-4 confirm-or-kill. A MutationObserver arms a
 *             requestAnimationFrame loop that samples the launcher's computed
 *             opacity/transform from the instant it enters the DOM, under
 *             `reducedMotion: 'reduce'`. Constant through that window kills H-4.
 *   geometry  M-03 / M-14 / safe-area / sheet-threshold / keyboard + focus
 *             contract, at all 8 audited viewports.
 *
 * Output: `.audit/concierge-<phase>.json` (`.audit/` is gitignored).
 */
import { chromium, devices, type BrowserContext, type Page } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3210';
const OUT = '.audit';

interface VP {
  label: string;
  width: number;
  height: number;
  dsf: number;
}

const VIEWPORTS: VP[] = [
  { label: 'narrow', width: 360, height: 800, dsf: 3 },
  { label: 'se', width: 375, height: 667, dsf: 2 },
  { label: 'standard', width: 390, height: 844, dsf: 3 },
  { label: 'large-phone', width: 414, height: 896, dsf: 2 },
  { label: 'bp-below', width: 767, height: 1024, dsf: 2 },
  { label: 'bp-at', width: 768, height: 1024, dsf: 2 },
  { label: 'landscape', width: 844, height: 390, dsf: 3 },
  { label: 'desktop-1440', width: 1440, height: 900, dsf: 2 },
];

/** Same descriptor rule as audit-mobile.ts §descriptorFor. */
function descriptorFor(vp: VP) {
  if (vp.label === 'desktop-1440') {
    return {
      source: 'desktop context (isMobile:false)',
      options: { viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2 },
    };
  }
  for (const [name, d] of Object.entries(devices)) {
    const dev = d as (typeof devices)[string];
    if (
      dev.viewport?.width === vp.width &&
      dev.viewport?.height === vp.height &&
      dev.isMobile === true &&
      dev.hasTouch === true &&
      dev.defaultBrowserType === 'chromium'
    ) {
      return { source: `devices['${name}']`, options: { ...dev } };
    }
  }
  return {
    source: 'constructed',
    options: {
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.dsf,
      isMobile: true,
      hasTouch: true,
    },
  };
}

/**
 * A stale server on 3210 can serve a previous build's HTML — chunk filenames
 * that 404, no CSS, no hydration. Every measurement below would be garbage and
 * would look like catastrophic breakage. Confirm the stylesheet is 200 first.
 */
async function guardStylesheet(page: Page) {
  const href = await page.evaluate(() => {
    const l = document.querySelector('link[rel="stylesheet"]') as HTMLLinkElement | null;
    return l?.href ?? null;
  });
  if (!href) throw new Error('no stylesheet link in the document — stale or broken server');
  const res = await page.request.get(href);
  if (res.status() !== 200) throw new Error(`stylesheet ${href} returned ${res.status()}`);
  return { href, status: res.status() };
}

const rect = (r: DOMRect) => ({
  x: +r.x.toFixed(1),
  y: +r.y.toFixed(1),
  w: +r.width.toFixed(1),
  h: +r.height.toFixed(1),
  top: +r.top.toFixed(1),
  right: +r.right.toFixed(1),
  bottom: +r.bottom.toFixed(1),
  left: +r.left.toFixed(1),
});

/* ------------------------------------------------------------------ phase: m19 */

/**
 * H-4 confirm-or-kill. The previous pass sampled the launcher 8x at 60ms
 * intervals *after* the scroll walk, which lands after a 240ms entrance would
 * have finished and so cannot distinguish "suppressed" from "already over".
 * This arms before the launcher exists.
 */
async function phaseM19(ctxFor: (vp: VP, reduce: 'reduce' | 'no-preference') => Promise<BrowserContext>) {
  const routes = ['/', '/work', '/process'];
  const rows: unknown[] = [];

  for (const reduce of ['reduce', 'no-preference'] as const) {
    for (const vpLabel of ['standard', 'bp-at'] as const) {
      const vp = VIEWPORTS.find((v) => v.label === vpLabel)!;
      const ctx = await ctxFor(vp, reduce);
      for (const route of routes) {
        const page = await ctx.newPage();
        // Arm BEFORE any of the page's own script runs.
        await page.addInitScript(() => {
          (window as unknown as { __m19: unknown }).__m19 = (() => {
            const samples: {
              t: number;
              opacity: string;
              transform: string;
              translate: string;
              animations: number;
            }[] = [];
            let armed = false;
            let el: HTMLElement | null = null;
            const t0 = performance.now();

            const isLauncher = (n: Node) =>
              n.nodeType === 1 &&
              (n as Element).tagName === 'BUTTON' &&
              ((n as Element).textContent || '').includes('Ask about your project');

            const sample = () => {
              if (!el) return;
              const cs = getComputedStyle(el);
              samples.push({
                t: +(performance.now() - t0).toFixed(1),
                opacity: cs.opacity,
                transform: cs.transform,
                translate: cs.translate,
                animations: el.getAnimations().length,
              });
              if (samples.length < 60) requestAnimationFrame(sample);
            };

            const obs = new MutationObserver((records) => {
              if (armed) return;
              for (const r of records) {
                for (const n of Array.from(r.addedNodes)) {
                  const hit = isLauncher(n)
                    ? (n as HTMLElement)
                    : n.nodeType === 1
                      ? ([...(n as Element).querySelectorAll('button')].find((b) =>
                          (b.textContent || '').includes('Ask about your project'),
                        ) ?? null)
                      : null;
                  if (hit) {
                    armed = true;
                    el = hit;
                    // Sample synchronously at insertion, then every frame.
                    sample();
                    return;
                  }
                }
              }
            });
            // `addInitScript` runs before `document.documentElement` exists;
            // `document` itself is always there and subtree:true reaches the
            // whole tree from it.
            obs.observe(document, { childList: true, subtree: true });

            return {
              samples,
              armed: () => armed,
              // The yield-rule build keeps the launcher mounted from first
              // paint; the shipped build mounts it on scroll. Either way the
              // observer fires on insertion — but if it is already in the DOM
              // when this runs, latch it directly.
              latchExisting: () => {
                if (armed) return;
                const b = [...document.querySelectorAll('button')].find((x) =>
                  (x.textContent || '').includes('Ask about your project'),
                );
                if (b) {
                  armed = true;
                  el = b as HTMLElement;
                  sample();
                }
              },
              rest: () => {
                if (!el) return null;
                const cs = getComputedStyle(el);
                return {
                  opacity: cs.opacity,
                  transform: cs.transform,
                  translate: cs.translate,
                  transition: cs.transitionProperty + ' / ' + cs.transitionDuration,
                  animations: el.getAnimations().length,
                  ariaHidden: el.getAttribute('aria-hidden'),
                  tabIndex: el.tabIndex,
                  pointerEvents: cs.pointerEvents,
                };
              },
            };
          })();
        });

        await page.goto(BASE + route, { waitUntil: 'networkidle' });
        if (route === '/') await guardStylesheet(page);
        // The shipped launcher only mounts past 0.85 x innerHeight.
        await page.evaluate(() => (window as any).__m19.latchExisting());
        await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2));
        await page.waitForTimeout(1200);
        await page.evaluate(() => (window as any).__m19.latchExisting());
        await page.waitForTimeout(600);

        const r = await page.evaluate(() => {
          const m = (window as any).__m19;
          return { samples: m.samples, armed: m.armed(), rest: m.rest() };
        });

        const opacities = [...new Set(r.samples.map((s: any) => s.opacity))];
        const transforms = [...new Set(r.samples.map((s: any) => s.transform))];
        const translates = [...new Set(r.samples.map((s: any) => s.translate))];

        rows.push({
          reduce,
          viewport: vpLabel,
          route,
          armed: r.armed,
          sampleCount: r.samples.length,
          windowMs: r.samples.length ? r.samples[r.samples.length - 1].t - r.samples[0].t : 0,
          distinctOpacity: opacities,
          distinctTransform: transforms,
          distinctTranslate: translates,
          constant: opacities.length === 1 && transforms.length === 1 && translates.length === 1,
          firstSample: r.samples[0] ?? null,
          lastSample: r.samples[r.samples.length - 1] ?? null,
          rest: r.rest,
        });
        await page.close();
      }
      await ctx.close();
    }
  }
  return rows;
}

/* ------------------------------------------------------------- phase: geometry */

async function phaseGeometry(ctxFor: (vp: VP, reduce: 'reduce' | 'no-preference') => Promise<BrowserContext>) {
  const rows: unknown[] = [];

  for (const vp of VIEWPORTS) {
    const ctx = await ctxFor(vp, 'reduce');
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await guardStylesheet(page);

    // Scroll the launcher into existence, then open via keyboard so focus
    // behaviour is measured the way a keyboard user would reach it.
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
    await page.waitForTimeout(500);

    const launcher = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((x) =>
        (x.textContent || '').includes('Ask about your project'),
      ) as HTMLElement | undefined;
      if (!b) return null;
      const cs = getComputedStyle(b);
      const r = b.getBoundingClientRect();
      return {
        rect: {
          w: +r.width.toFixed(1),
          h: +r.height.toFixed(1),
          top: +r.top.toFixed(1),
          right: +r.right.toFixed(1),
          bottom: +r.bottom.toFixed(1),
          left: +r.left.toFixed(1),
        },
        opacity: cs.opacity,
        pointerEvents: cs.pointerEvents,
        ariaHidden: b.getAttribute('aria-hidden'),
        tabIndex: b.tabIndex,
        bottom: cs.bottom,
        right: cs.right,
        insetDeclarations: (() => {
          const found: string[] = [];
          for (const sheet of Array.from(document.styleSheets)) {
            let rules: CSSRuleList;
            try {
              rules = sheet.cssRules;
            } catch {
              continue;
            }
            for (const rule of Array.from(rules)) {
              const txt = (rule as CSSRule).cssText;
              if (txt.includes('safe-area-inset') && b.matches?.(( rule as CSSStyleRule).selectorText ?? ' '))
                found.push(txt.slice(0, 160));
            }
          }
          return found;
        })(),
        inlineStyle: b.getAttribute('style'),
      };
    });

    // Open it.
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((x) =>
        (x.textContent || '').includes('Ask about your project'),
      ) as HTMLElement | undefined;
      b?.focus();
      b?.click();
    });
    await page.waitForTimeout(600);

    const panel = await page.evaluate(() => {
      const p = document.querySelector('div[role="dialog"]') as HTMLElement | null;
      if (!p) return { present: false as const };
      const cs = getComputedStyle(p);
      const r = p.getBoundingClientRect();
      const close = p.querySelector('button[aria-label="Close"]') as HTMLElement | null;
      const cr = close?.getBoundingClientRect();
      const glyph = close ? getComputedStyle(close).fontSize : null;
      const list = p.querySelector('div[class*="overflow-y-auto"]') as HTMLElement | null;
      const lr = list?.getBoundingClientRect();
      const active = document.activeElement as HTMLElement | null;
      return {
        present: true as const,
        rect: {
          w: +r.width.toFixed(1),
          h: +r.height.toFixed(1),
          top: +r.top.toFixed(1),
          right: +r.right.toFixed(1),
          bottom: +r.bottom.toFixed(1),
          left: +r.left.toFixed(1),
        },
        viewport: { w: window.innerWidth, h: window.innerHeight },
        overflowsViewportTop: r.top < 0,
        overflowsViewportBottom: r.bottom > window.innerHeight,
        maxHeight: cs.maxHeight,
        height: cs.height,
        inset: `${cs.top} ${cs.right} ${cs.bottom} ${cs.left}`,
        inlineStyle: p.getAttribute('style'),
        ariaModal: p.getAttribute('aria-modal'),
        bodyOverflow: getComputedStyle(document.body).overflow,
        close: cr
          ? { w: +cr.width.toFixed(1), h: +cr.height.toFixed(1), onScreen: cr.top >= 0 && cr.bottom <= window.innerHeight, fontSize: glyph }
          : null,
        list: lr
          ? {
              h: +lr.height.toFixed(1),
              minHeight: getComputedStyle(list!).minHeight,
              flex: getComputedStyle(list!).flex,
              scrollable: list!.scrollHeight > list!.clientHeight,
            }
          : null,
        focusInsidePanel: !!(active && p.contains(active)),
        activeElement: active ? active.tagName + (active.id ? '#' + active.id : '') : null,
      };
    });

    /* Can the page still scroll behind the panel? (non-modal contract)
       It must be a REAL wheel, not `window.scrollBy`: `overflow: hidden` stops
       user scrolling and never stops a scripted scroll, so the programmatic
       form reports every scroll lock as broken. */
    const scrollBefore = await page.evaluate(() => window.scrollY);
    /* Top-left, deliberately: in non-sheet mode that is the page behind the
       bottom-right panel, and in sheet mode it is the sheet's own 56px header —
       which does not scroll, so the wheel can only reach the page. Wheeling
       over the message list would scroll the list and prove nothing. */
    await page.mouse.move(Math.round(vp.width * 0.12), Math.round(vp.height * 0.12));
    await page.mouse.wheel(0, 240);
    await page.waitForTimeout(300);
    const scrollAfter = await page.evaluate(() => window.scrollY);
    const scrollBehind = {
      method: 'page.mouse.wheel(0, 240)',
      before: scrollBefore,
      after: scrollAfter,
      moved: scrollAfter !== scrollBefore,
    };
    await page.evaluate((y) => window.scrollTo(0, y), scrollBefore);

    // Focus trap probe: Tab from the last focusable inside the panel.
    const trap = await page.evaluate(() => {
      const p = document.querySelector('div[role="dialog"]') as HTMLElement | null;
      if (!p) return null;
      const f = [...p.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])')];
      return { focusableCount: f.length, first: f[0]?.getAttribute('aria-label') ?? f[0]?.tagName ?? null };
    });

    await page.keyboard.press('Tab');
    await page.waitForTimeout(80);
    const afterTab = await page.evaluate(() => {
      const p = document.querySelector('div[role="dialog"]');
      const a = document.activeElement as HTMLElement | null;
      return { inPanel: !!(p && a && p.contains(a)), tag: a?.tagName ?? null };
    });

    // Escape closes; focus returns to the launcher.
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    const afterEscape = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      return {
        panelPresent: !!document.querySelector('div[role="dialog"]'),
        activeElement: a ? a.tagName + '.' + (a.className || '').split(' ').slice(0, 2).join('.') : null,
        activeIsLauncher: !!(a && (a.textContent || '').includes('Ask about your project')),
        bodyOverflow: getComputedStyle(document.body).overflow,
      };
    });

    rows.push({
      viewport: vp.label,
      size: `${vp.width}x${vp.height}`,
      descriptor: descriptorFor(vp).source,
      sheetExpected: vp.height <= 560,
      launcher,
      panel,
      scrollBehind,
      trap,
      afterTab,
      afterEscape,
    });

    await page.close();
    await ctx.close();
  }
  return rows;
}

/* ------------------------------------------------------------------------ run */

async function main() {
  const phase = process.argv[2] ?? 'all';
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  const ctxFor = async (vp: VP, reduce: 'reduce' | 'no-preference') =>
    browser.newContext({ ...descriptorFor(vp).options, reducedMotion: reduce, colorScheme: 'light' });

  if (phase === 'm19' || phase === 'all') {
    const rows = await phaseM19(ctxFor);
    await writeFile(`${OUT}/concierge-m19.json`, JSON.stringify(rows, null, 2));
    console.log('m19 rows:', rows.length);
    for (const r of rows as any[]) {
      console.log(
        `  ${r.reduce.padEnd(14)} ${r.viewport.padEnd(9)} ${r.route.padEnd(10)} armed=${r.armed} n=${String(r.sampleCount).padStart(2)} win=${Math.round(r.windowMs)}ms constant=${r.constant} opacity=${JSON.stringify(r.distinctOpacity)} transform=${JSON.stringify(r.distinctTransform)} translate=${JSON.stringify(r.distinctTranslate)} restAnims=${r.rest?.animations}`,
      );
    }
  }

  if (phase === 'geometry' || phase === 'all') {
    const rows = await phaseGeometry(ctxFor);
    await writeFile(`${OUT}/concierge-geometry.json`, JSON.stringify(rows, null, 2));
    console.log('\ngeometry rows:', rows.length);
    for (const r of rows as any[]) {
      console.log(
        `  ${r.viewport.padEnd(13)} ${r.size.padEnd(9)} sheet=${r.sheetExpected} panel=${r.panel.present ? `${r.panel.rect.w}x${r.panel.rect.h} top=${r.panel.rect.top} overTop=${r.panel.overflowsViewportTop} maxH=${r.panel.maxHeight}` : 'ABSENT'} close=${r.panel.close ? `${r.panel.close.w}x${r.panel.close.h} on=${r.panel.close.onScreen} fs=${r.panel.close.fontSize}` : 'n/a'} modal=${r.panel.ariaModal} bodyOverflow=${r.panel.bodyOverflow} scrollBehind=${r.scrollBehind.moved} focusIn=${r.panel.focusInsidePanel} tabInPanel=${r.afterTab.inPanel} escClosed=${!r.afterEscape.panelPresent} focusBack=${r.afterEscape.activeIsLauncher}`,
      );
      console.log(
        `                 launcher=${r.launcher ? `${r.launcher.rect.w}x${r.launcher.rect.h} bottom=${r.launcher.bottom} right=${r.launcher.right} opacity=${r.launcher.opacity} pe=${r.launcher.pointerEvents} ariaHidden=${r.launcher.ariaHidden} tabIndex=${r.launcher.tabIndex}` : 'ABSENT'}`,
      );
    }
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
