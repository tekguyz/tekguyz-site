/**
 * End-to-end verification driver.
 *
 * Two jobs, both against a running production build:
 *   1. Screenshot every route in light and dark, desktop and mobile.
 *   2. Submit the real contact form through the real UI, so the server action,
 *      Resend, the CRM webhook and the confirmation email all actually run.
 *
 * Usage:
 *   bun run scripts/verify.ts shots
 *   bun run scripts/verify.ts form            (real submission)
 *   bun run scripts/verify.ts honeypot        (fills hp_confirm; must drop)
 *   bun run scripts/verify.ts concierge       (drives the panel in the browser)
 */
import { chromium, type Page } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.VERIFY_BASE ?? 'http://localhost:3000';
const OUT = 'C:/Users/alexu/AppData/Local/Temp/claude/C--Projects-tekguyz-site/0d94df02-6bec-443d-a3c8-ab00baaeffa6/scratchpad/shots';

const ROUTES: [string, string][] = [
  ['/', 'home'],
  ['/solutions', 'solutions'],
  ['/solutions/ai-voice-agents', 'solution-detail'],
  ['/work', 'work'],
  ['/work/ai-voice-receptionist', 'case-detail'],
  ['/work/team-performance', 'project-detail'],
  ['/process', 'process'],
  ['/contact', 'contact'],
  ['/privacy', 'privacy'],
];

async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

async function setTheme(page: Page, theme: 'light' | 'dark') {
  await page.evaluate((t) => {
    localStorage.setItem('theme', t);
  }, theme);
}

async function shots() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  for (const theme of ['light', 'dark'] as const) {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      colorScheme: theme,
      reducedMotion: 'no-preference',
    });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await setTheme(page, theme);

    for (const [route, name] of ROUTES) {
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      // Scroll the whole page once so the closing-CTA sequence (Motion
      // whileInView, once:true) actually fires, then return to the top. Without
      // this the capture shows it at its opacity:0 initial state — a screenshot
      // artefact, not a rendering bug: the sequence stays visible after.
      await scrollThrough(page);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${OUT}/${name}-${theme}.png`, fullPage: true });
      console.log(`shot ${name}-${theme}`);
    }
    await ctx.close();
  }

  // Mobile, light only — the responsive collapse is the thing being checked.
  const mob = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const mp = await mob.newPage();
  for (const [route, name] of [ROUTES[0]!, ROUTES[4]!, ROUTES[7]!]) {
    await mp.goto(BASE + route, { waitUntil: 'networkidle' });
    await mp.waitForTimeout(1200);
    await mp.screenshot({ path: `${OUT}/${name}-mobile.png`, fullPage: true });
    console.log(`shot ${name}-mobile`);
  }
  await mob.close();

  await browser.close();
  console.log('screenshots written to', OUT);
}

/** Drives the concierge panel so the reply renders through <Markdown>. */
async function concierge() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/work/ai-voice-receptionist', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(600);

  await page.getByRole('button', { name: /ask about your project/i }).click();
  await page.waitForTimeout(400);

  const input = page.locator('#concierge-input');
  await input.fill(
    'We run a stone fabrication shop and our phone goes to voicemail after 5. What would you build?',
  );
  await page.screenshot({ path: `${OUT}/concierge-before.png` });

  await page.getByRole('button', { name: 'Send' }).click();
  // Catch the thinking stripe while it is on screen.
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/concierge-thinking.png` });

  await page.waitForFunction(
    () => !document.querySelector('[role="status"]'),
    undefined,
    { timeout: 60000 },
  );
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/concierge-reply.png` });

  const text = await page.locator('[role="dialog"]').innerText();
  console.log('--- panel text ---');
  console.log(text);
  console.log('--- raw markdown leaked? ---');
  console.log('contains "**":', text.includes('**'));
  console.log('contains "](": ', text.includes(']('));

  await browser.close();
}

async function submitForm(fillHoneypot: boolean) {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(BASE + '/contact?interest=ai-voice-agents', { waitUntil: 'networkidle' });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const marker = fillHoneypot ? 'HONEYPOT' : 'REAL';

  await page.selectOption('#projectType', 'AI Voice Agents');
  await page.fill('#name', 'Alex Rivera');
  await page.fill('#email', 'admin@tekguyz.com');

  if (fillHoneypot) {
    await page.evaluate(() => {
      const el = document.querySelector<HTMLInputElement>('#hp_confirm');
      if (!el) throw new Error('honeypot field #hp_confirm not found');
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value',
      )!.set!;
      setter.call(el, 'bot-was-here');
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  // The action enforces a 2s minimum fill time.
  await page.waitForTimeout(2500);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(500);

  await page.fill('#company', 'Rivera Stone Co');
  await page.fill('#phone', '(555) 010-2233');
  await page.fill('#website', 'riverastone.example.com');
  await page.fill(
    '#message',
    `[${marker} TEST ${stamp}] Automated verification of the TEKGUYZ contact pipeline. ` +
      `We miss after-hours calls and want an AI receptionist. Please ignore this submission.`,
  );
  await page.selectOption('#budget', '$15k–$50k');

  const t0 = Date.now();
  await page.getByRole('button', { name: 'Send Inquiry' }).click();
  await page.waitForTimeout(8000);
  const elapsed = Date.now() - t0;

  const card = await page.locator('form, [role="status"]').first().innerText();
  const alerts = await page.locator('[role="alert"]').allInnerTexts();
  const success = card.includes('Message sent');
  console.log(`[${marker}] success state shown:`, success);
  console.log(`[${marker}] round trip: ${elapsed}ms`);
  console.log(`[${marker}] alerts:`, JSON.stringify(alerts));
  if (!success) {
    console.log('--- form card text ---');
    console.log(card.slice(0, 1500));
  }
  await page.screenshot({ path: `${OUT}/form-${marker.toLowerCase()}.png`, fullPage: false });
  await browser.close();
  return success;
}

const mode = process.argv[2];
if (mode === 'shots') await shots();
else if (mode === 'form') await submitForm(false);
else if (mode === 'honeypot') await submitForm(true);
else if (mode === 'concierge') await concierge();
else console.log('modes: shots | form | honeypot | concierge');
