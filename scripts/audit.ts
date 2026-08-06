import { chromium } from 'playwright';

const BASE = process.env.VERIFY_BASE ?? 'http://localhost:3000';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const out: Record<string, unknown> = {};

// 1. Nav CTA — 14px 24px, radius 8px, and the only button size in the nav.
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
out['1_navCta'] = await page.evaluate(() => {
  const cta = [...document.querySelectorAll('header a')].find(
    (a) => a.textContent?.trim() === 'Let’s Talk',
  )!;
  const cs = getComputedStyle(cta);
  return {
    padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
    radius: cs.borderRadius,
    fontSize: cs.fontSize,
  };
});

// 2. Closing CTA — subhead and trust row are SEPARATE elements, trust wraps.
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1500);
out['2_closingCta'] = await page.evaluate(() => {
  const items = [...document.querySelectorAll('.tg-seq')];
  const subhead = items.find((e) => e.textContent?.includes('Tell us what you'));
  const trust = items.find((e) => e.textContent?.includes('Free first conversation'));
  const btn = [...document.querySelectorAll('a')].find(
    (a) => a.textContent?.trim() === 'Let’s Talk' && !a.closest('header'),
  )!;
  const bcs = getComputedStyle(btn);
  const trustRow = trust?.firstElementChild as HTMLElement | undefined;
  return {
    separateElements: Boolean(subhead && trust && subhead !== trust),
    trustFlexWrap: trustRow ? getComputedStyle(trustRow).flexWrap : null,
    largeButtonPadding: `${bcs.paddingTop} ${bcs.paddingRight}`,
    largeButtonFontSize: bcs.fontSize,
  };
});

// 3. Footer bottom bar — copyright only.
out['3_footerBottom'] = await page.evaluate(() => {
  const footer = document.querySelector('footer')!;
  const bars = [...footer.querySelectorAll('div')].filter((d) =>
    d.textContent?.includes('Built by TEKGUYZ'),
  );
  const bar = bars[bars.length - 1]!;
  return {
    text: bar.textContent?.trim(),
    linkCount: bar.querySelectorAll('a').length,
    privacyLinksInFooterTotal: [...footer.querySelectorAll('a')].filter(
      (a) => a.textContent?.trim() === 'Privacy',
    ).length,
  };
});

// 4. Concierge FAB — 16px 24px, radius 8px (not a pill).
await page.evaluate(() => window.scrollTo(0, 1400));
await page.waitForTimeout(700);
out['4_fab'] = await page.evaluate(() => {
  const fab = [...document.querySelectorAll('button')].find((b) =>
    b.textContent?.includes('Ask about your project'),
  );
  if (!fab) return 'FAB NOT FOUND';
  const cs = getComputedStyle(fab);
  return {
    padding: `${cs.paddingTop} ${cs.paddingRight}`,
    radius: cs.borderRadius,
    position: cs.position,
    right: cs.right,
    bottom: cs.bottom,
  };
});

// 5. Thinking indicator — 72px wide, 3px tall, 4 columns, inline with a label.
out['5_thinking'] = await page.evaluate(() => {
  const fab = [...document.querySelectorAll('button')].find((b) =>
    b.textContent?.includes('Ask about your project'),
  ) as HTMLButtonElement | undefined;
  fab?.click();
  return 'panel opened';
});
await page.waitForTimeout(500);
await page.fill('#concierge-input', 'test');
await page.getByRole('button', { name: 'Send' }).click();
await page.waitForTimeout(700);
out['5_thinking'] = await page.evaluate(() => {
  const status = document.querySelector('[role="status"]');
  if (!status) return 'no thinking indicator visible';
  const bar = status.querySelector('span[aria-hidden]') as HTMLElement | null;
  if (!bar) return 'no bar';
  const cs = getComputedStyle(bar);
  return {
    width: cs.width,
    height: cs.height,
    gridColumns: cs.gridTemplateColumns.split(' ').length,
    segments: bar.children.length,
    inlineLabel: status.textContent?.trim(),
    parentDisplay: getComputedStyle(status).display,
  };
});

// 6. Image frames — native aspect-ratio + overflow hidden, no padding hack.
await page.goto(BASE + '/work', { waitUntil: 'networkidle' });
out['6_frames'] = await page.evaluate(() => {
  const frames = [...document.querySelectorAll('main div')].filter(
    (d) => getComputedStyle(d).aspectRatio !== 'auto' && d.querySelector('img'),
  );
  return frames.slice(0, 3).map((f) => {
    const cs = getComputedStyle(f);
    const img = f.querySelector('img')!;
    const ics = getComputedStyle(img);
    return {
      aspectRatio: cs.aspectRatio,
      overflow: cs.overflow,
      paddingTop: cs.paddingTop,
      objectFit: ics.objectFit,
      objectPosition: ics.objectPosition,
    };
  });
});

// 7. "How it's built" on the /work index AND the standalone detail page.
out['7_howItsBuilt_workIndex'] = await page.evaluate(
  () =>
    [...document.querySelectorAll('p')].filter((p) => /how it.s built/i.test(p.textContent ?? ''))
      .length,
);
await page.goto(BASE + '/work/ai-voice-receptionist', { waitUntil: 'networkidle' });
out['7_howItsBuilt_detail'] = await page.evaluate(
  () =>
    [...document.querySelectorAll('p')].filter((p) => /how it.s built/i.test(p.textContent ?? ''))
      .length,
);

// 8. Theme toggle — 18px icon, stroke-width 1.75, exact export paths.
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
out['8_themeToggle'] = await page.evaluate(() => {
  const btn = document.querySelector('button[aria-label*="mode"]')!;
  const svg = btn.querySelector('svg')!;
  const cs = getComputedStyle(btn);
  return {
    buttonSize: `${cs.width} x ${cs.height}`,
    borderRadius: cs.borderRadius,
    hasBorder: cs.borderTopWidth,
    svgSize: `${svg.getAttribute('width')}x${svg.getAttribute('height')}`,
    strokeWidth: (svg.style.strokeWidth || getComputedStyle(svg).strokeWidth),
    firstPath: svg.querySelector('path')?.getAttribute('d')?.slice(0, 40),
  };
});

// Extra: signature stripe count per route.
const stripes: Record<string, number> = {};
for (const r of ['/', '/solutions', '/work', '/process', '/contact', '/privacy', '/work/bundle-builder']) {
  await page.goto(BASE + r, { waitUntil: 'domcontentloaded' });
  stripes[r] = await page.evaluate(
    () => document.querySelectorAll('[data-signature-stripe]').length,
  );
}
out['extra_stripesPerRoute'] = stripes;

console.log(JSON.stringify(out, null, 1));
await browser.close();
