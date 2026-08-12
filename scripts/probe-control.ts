/**
 * POSITIVE CONTROL — the discriminator must be shown able to emit `static`
 * before any verdict it produces on the four classes is reported.
 *
 * Case: D-02's pre-fix geometry. `/contact` with an FAQ accordion expanded and
 * the launcher presented over the expanded body text — the state the user
 * recorded on a phone before Prompt 13 shipped the suppression channel.
 *
 * `useSuppressLauncher`'s Set is module-scoped and unreachable from the page,
 * so the shipped suppression is overridden in-page instead. `control.json`
 * records that it was disabled, so a control artefact can never be read later
 * as a shipped-state measurement. No component file is modified.
 */

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { INIT_SCRIPT } from './lib/probe-shared.ts';
import { verdictFor, type Sample } from '../lib/overlap-verdict.ts';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3210';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 3,
});
await ctx.addInitScript({ content: INIT_SCRIPT });
const page = await ctx.newPage();
await page.goto(BASE + '/contact', { waitUntil: 'load' });

// Force the launcher back to presented — what the shipped suppression removes.
// An injected rule needs !important to beat .tg-yield's own declaration.
await page.addStyleTag({
  content: `.tg-yield { opacity: 1 !important; pointer-events: auto !important; }`,
});

const triggers = page.locator('button[aria-expanded]');
const triggerCount = await triggers.count();
if (triggerCount === 0) throw new Error('No FAQ accordion triggers found — control cannot run.');

await triggers.nth(0).scrollIntoViewIfNeeded();
await triggers.nth(0).click();
await page.waitForTimeout(500);

const probed = await page.evaluate(() => {
  const t = (window as unknown as { __tg: Record<string, any> }).__tg;
  const fab = t.findFab();
  const expanded = document.querySelector('button[aria-expanded="true"]');
  const panel = expanded
    ? document.getElementById(expanded.getAttribute('aria-controls') || '')
    : null;

  if (!fab) return { error: 'launcher not found', samples: [], maxScrollY: 0 };
  if (!panel) return { error: 'expanded panel not found', samples: [], maxScrollY: 0 };

  const fr = fab.getBoundingClientRect();
  const er = panel.getBoundingClientRect();
  const area = t.overlapArea(fr, er);
  const maxScrollY = Math.round(document.documentElement.scrollHeight - window.innerHeight);

  return {
    error: null,
    panelRect: { top: Math.round(er.top), bottom: Math.round(er.bottom) },
    launcherRect: { top: Math.round(fr.top), bottom: Math.round(fr.bottom) },
    overlapArea: Math.round(area),
    samples: [
      {
        scrollY: Math.round(window.scrollY),
        launcherPresented: t.presentedState(fab).launcherPresented,
        coveredFraction: er.width && er.height ? +(area / (er.width * er.height)).toFixed(3) : 0,
      },
    ],
    maxScrollY,
  };
});

await browser.close();

if (probed.error) {
  console.log('CONTROL ERROR:', probed.error);
  process.exit(1);
}

/* The control's whole point: run the REAL rule, not a local reimplementation.
   `stateInduced` is what makes this a test of the discriminator rather than of
   the intersection maths — D-02 is static because an expanded accordion
   persists at rest, not because a scroll position fails to clear it. */
const verdict = verdictFor(probed.samples as Sample[], probed.maxScrollY, { stateInduced: true });

await mkdir('.audit', { recursive: true });
await writeFile(
  '.audit/control.json',
  JSON.stringify(
    {
      case: "D-02 pre-fix geometry: /contact, first FAQ row expanded, launcher forced presented",
      suppressionDisabled: true,
      viewport: '390x844 standard',
      verdict,
      ...probed,
    },
    null,
    2,
  ),
);

console.log('control overlapArea:', probed.overlapArea);
console.log('control samples:', JSON.stringify(probed.samples));
console.log('CONTROL VERDICT:', verdict, verdict === 'static' ? '(PASS)' : '(FAIL — do not report class verdicts)');
