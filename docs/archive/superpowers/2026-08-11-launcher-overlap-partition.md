# Launcher-Overlap Re-Partition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **Do not dispatch subagents** — Tasks 5 and 6 share a verdict function that must stay identical, and every gate here is a stop-and-report-to-the-human gate.

**Goal:** Re-partition the four untouched non-CTA launcher-overlap classes (meta-rail, inline `link-underline`, prev/next nav, footer) into transient-during-scroll and static-after-user-action, on a discriminator that can actually produce both verdicts, and update the three documents carrying the stale claim.

**Architecture:** Measure the two facts that can invalidate spec §4 *first* (Tasks 1–2), against a production build. Then extract the verdict rule into one tested pure function (Task 4) so the positive control (Task 5) exercises the same code the class partition uses (Task 6). Documentation last, once verdicts exist.

**Tech Stack:** Playwright 1.62 driven by `node --experimental-strip-types`, Next 16 production build served locally, existing harness `scripts/audit-mobile.ts`, Vitest for the pure verdict function.

**Spec:** `docs/superpowers/specs/2026-08-11-launcher-overlap-partition-design.md`

## Global Constraints

- **Runner is `node --experimental-strip-types`, from the project directory.** Never Bun — post-reinstall Bun still times out at 60s.
- **Serve a PRODUCTION build, not dev.** `bun run build` was confirmed passing 2026-08-11 (exit 0, all routes prerendered), so spec §6's production path is open and there is no reason to fall back. **Dev is forbidden here for a specific reason:** Next's dev-tools indicator is a real DOM element in the bottom corner — the launcher's corner — and would be matched by the `INTERACTIVE` query and returned by `elementFromPoint` at the overlap centre, contaminating `topmostAtOverlapCentre` and appearing as its own overlap pair.

  ```bash
  bun run build
  npx next start -p 3210
  ```

  If a future run finds `prebuild` blocking on the off-ratio media guard, the fallback is dev **plus `devIndicators: false` in `next.config.ts`**, and the report must state that dev was used and why. That is not the expected path.
- **`data-primary-cta` is not widened, on any element, under any outcome.** Hard rule, CLAUDE.md.
- **Never measure a page whose stylesheet 404s.** A stale server on 3210 serves a previous build. `main()` guards this; ad-hoc probes must too.
- **Kill servers by port, never by process name:** `netstat -ano | grep ":3210" | grep LISTENING`, then `taskkill //PID <pid> //F`.
- **`.audit/` is gitignored (`.gitignore:35`).** Do **not** `git add` anything under it — the command errors and the commit lands with the script but no evidence. Evidence numbers are transcribed into the report and into `docs/` at Task 7.
- **The machine matches `prefers-reduced-motion: reduce`** (`MinAnimate = 0`). Do not change it. `.tg-yield` gets `transition: none` under `reduce`, so the launcher's presented state resolves instantly — which makes the opacity read binary and cleaner, not less valid.
- **Historical numbers are FROZEN.** 143 / 44 / 99.6% and 140 / 45 / 100.0% are never edited in place.
- **A partially resolved class is never summarised as resolved.** CLAUDE.md hard rule.
- **Report what was not finished.** Never describe unfinished work as complete.

---

### Task 1: Shared probe primitives — one definition, five consumers

Five probes need the same launcher lookup and the same presented-state test. Two locators means two possible elements and a partition drawn across both.

**Files:**
- Create: `scripts/lib/probe-shared.ts`

**Interfaces:**
- Produces: `INIT_SCRIPT` (string), installed via `page.addInitScript`, defining `window.__tg` with `findFab()`, `presentedState(fab)`, `inView(el)`, `overlapArea(a,b)`, `sel(el)`. Consumed by Tasks 2, 3, 5, 6. Also exports `VPS`, `CLOSING_CTA_ROUTES`, `ALL_ROUTES`, and `settleToBottom` for Playwright-side use.

- [ ] **Step 1: Write the module**

```ts
/**
 * One definition of every primitive the overlap probes share. Two locators for
 * the launcher would mean two possible elements and a partition drawn across
 * both — audit-mobile.ts's own `findFab` is reproduced here verbatim.
 */

/** Routes that render <ClosingCta />, derived from the JSX usages, not sampled. */
export const CLOSING_CTA_ROUTES = [
  '/',
  '/privacy',
  '/process',
  '/solutions',
  '/solutions/ai-voice-agents',
  '/work',
  '/work/field-photo-reports',
] as const;

/** /contact renders no ClosingCta — the export has no closing CTA there. */
export const ALL_ROUTES = [...CLOSING_CTA_ROUTES, '/contact'] as const;

/** Labels match audit-mobile.ts's VIEWPORTS. Dark runs at narrow + standard,
 *  the two the existing sweep already darkens (audit-mobile.ts:570). */
export const VPS = [
  { label: 'narrow', width: 360, height: 800, dsf: 3 },
  { label: 'se', width: 375, height: 667, dsf: 2 },
  { label: 'standard', width: 390, height: 844, dsf: 3 },
  { label: 'large-phone', width: 414, height: 896, dsf: 2 },
  { label: 'landscape', width: 844, height: 390, dsf: 3 },
] as const;

export const DARK_VPS = ['narrow', 'standard'] as const;

export const INIT_SCRIPT = `
window.__tg = {
  /* Verbatim from audit-mobile.ts:474-477. */
  findFab: () =>
    [...document.querySelectorAll('button')].find((b) =>
      (b.textContent || '').includes('Ask about your project'),
    ) || null,

  presentedState: (fab) => {
    if (!fab) return { launcherOpacity: null, launcherPresented: false };
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
 * scrollHeight is not stable at `load`: footer images and the font swap both
 * change it afterwards. Scrolling once can leave the page ~200px above the
 * bottom — exactly where the P1 answer flips. Loop until the height stops
 * moving, then confirm we are actually at the bottom.
 */
export async function settleToBottom(page: import('playwright').Page) {
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
```

- [ ] **Step 2: Verify the route list against source**

```bash
grep -rn "<ClosingCta" --include=*.tsx app/ | sed 's/:.*//' | sort -u
```

Expected exactly 7 files: `app/page.tsx`, `app/privacy/page.tsx`, `app/process/page.tsx`, `app/solutions/page.tsx`, `app/solutions/[slug]/page.tsx`, `app/work/page.tsx`, `app/work/[slug]/page.tsx`. **`/privacy` does carry one** (`app/privacy/page.tsx:97`) — confirmed, not assumed.

If the count is not 7, `CLOSING_CTA_ROUTES` is wrong and must be corrected before anything runs.

- [ ] **Step 3: Verify the footer selector against source**

```bash
grep -n "<footer" components/footer-dark.tsx
```
Expected: `<footer className="footer-dark border-t"` — so `footer.footer-dark` is correct. Confirmed 2026-08-11. If it has changed, update every probe; a null `footerHeight` silently drops rows from evidence.

- [ ] **Step 4: Commit**

```bash
git add scripts/lib/probe-shared.ts
git commit -m "Add shared probe primitives so five probes agree on one launcher"
```

---

### Task 2: Measure P1 — does `closing-cta` survive to maximum scroll?

The fact that can invalidate spec §4. `components/footer-dark.tsx` stacks a masthead, tagline, 44px social row, hairline, and **three link columns that stack vertically below 768px** because `.tg-grid` is one column there. P1 failing at 360–390 is expected, not hypothetical.

**Files:**
- Create: `scripts/probe-p1.ts`

**Interfaces:**
- Consumes: `scripts/lib/probe-shared.ts`.
- Produces: `.audit/p1.json` — rows of `{ route, viewport, theme, footerHeight, viewportHeight, ctaCount, ctaIntersectingAtMaxScroll, launcherPresented, atBottom }`.

- [ ] **Step 1: Build and serve production**

```bash
bun run build
```
Expected: exit 0. Then in a second shell:
```bash
npx next start -p 3210
```
Confirm:
```bash
curl -s http://localhost:3210/ | grep -o 'href="[^"]*\.css[^"]*"' | head -1
```
and that that href returns 200. Do not proceed otherwise.

- [ ] **Step 2: Write the probe**

```ts
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { INIT_SCRIPT, VPS, DARK_VPS, ALL_ROUTES, CLOSING_CTA_ROUTES, settleToBottom } from './lib/probe-shared.ts';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3210';

const browser = await chromium.launch();
const rows: any[] = [];

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
      // stronger, because what matters is scrollHeight being stable, not the
      // network being quiet.
      await page.goto(BASE + route, { waitUntil: 'load' });
      const settle = await settleToBottom(page);

      const row = await page.evaluate(() => {
        const t = (window as any).__tg;
        const footer = document.querySelector('footer.footer-dark');
        const fab = t.findFab();

        /* EVERY data-primary-cta, not the first. Home carries two — the hero
           CTA and closing-cta — and querySelector returns the hero, which is
           far out of view at maximum scroll. Reading that as "P1 fails" would
           fabricate the exact result this probe exists to detect. */
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
        `p1 ${vp.label.padEnd(12)} ${theme.padEnd(5)} ${route.padEnd(30)} footer=${row.footerHeight} vh=${row.viewportHeight} ctas=${row.ctaCount} ctaInView=${row.ctaIntersectingAtMaxScroll} presented=${row.launcherPresented} atBottom=${settle.atBottom}`,
      );
    }
    await ctx.close();
  }
}

await browser.close();
await mkdir('.audit', { recursive: true });
await writeFile('.audit/p1.json', JSON.stringify(rows, null, 2));

/* Self-check: every closing-cta route must report at least one CTA. A zero
   means the route list or the selector is wrong, and no P1 verdict from this
   run is trustworthy. */
const bad = rows.filter(
  (r) => (CLOSING_CTA_ROUTES as readonly string[]).includes(r.route) && !(r.ctaCount > 0),
);
const notAtBottom = rows.filter((r) => !r.atBottom);
console.log('SELF-CHECK ctaCount==0 on closing-cta routes:', bad.length);
console.log('SELF-CHECK rows not at bottom:', notAtBottom.length);
if (bad.length || notAtBottom.length) console.log('DO NOT TRUST THIS RUN');
console.log('done: p1');
```

- [ ] **Step 3: Run it**

```bash
node --experimental-strip-types scripts/probe-p1.ts
```

Expected: 56 rows (5 viewports + 2 dark repeats = 7 contexts × 8 routes). Both self-checks must print `0`. If either does not, **stop** — the run is not evidence.

- [ ] **Step 4: Read the P1 verdict**

1. **P1 per route × viewport × theme.** On the 7 `closing-cta` routes, `ctaIntersectingAtMaxScroll === true` → P1 holds there. Any `false` → **P1 fails there**, and footer/prev-nav at that viewport are expected `static`.
2. **`/contact` sanity.** `ctaCount` may be > 0 (the form's buttons) but `ctaIntersectingAtMaxScroll` should be `false`, and `launcherPresented` therefore `true`. That confirms `/contact` as the non-degenerate route.
3. **Footer vs viewport.** Compare `footerHeight` to `viewportHeight` at 360 / 375 / 390. This is the mechanism behind any P1 failure and belongs in the report as a number, not an inference.

**If `launcherPresented` is `false` on `/contact` at maximum scroll, stop and report** — something other than `data-primary-cta` is yielding the launcher and spec §2 needs revisiting.

- [ ] **Step 5: Commit (script only — `.audit/` is gitignored)**

```bash
git add scripts/probe-p1.ts
git commit -m "Measure P1: is closing-cta still in view at maximum scroll

Reads every [data-primary-cta], not the first: home carries two and the
hero one is far out of view at the bottom, which would have fabricated a
P1 failure. Production build, settled scroll height, light + dark."
```

**GATE — stop here and report the P1 numbers to the user before Task 3.** If P1 fails at 360–390, Tasks 3–7 change from a documentation pass into a mechanism decision, and that decision is the user's.

---

### Task 3: Measure the `/contact` non-degenerate max-scroll case

What, if anything, overlaps the launcher on the one route where it is presented at the bottom.

**Files:**
- Create: `scripts/probe-contact-bottom.ts`

**Interfaces:**
- Consumes: `scripts/lib/probe-shared.ts`, `.audit/p1.json`.
- Produces: `.audit/contact-bottom.json` — `{ viewport, theme, launcherPresented, overlaps: [{ selector, text, coveredFraction, topmostAtOverlapCentre, inFooter }] }`.

- [ ] **Step 1: Write the probe**

Same context/theme loop as Task 2, `/contact` only. After `settleToBottom`:

```ts
      const row = await page.evaluate(() => {
        const t = (window as any).__tg;
        const fab = t.findFab();
        if (!fab) return { launcherPresented: false, reason: 'launcher not found', overlaps: [] };

        const state = t.presentedState(fab);
        const fr = fab.getBoundingClientRect();
        const overlaps: any[] = [];

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
```

- [ ] **Step 2: Run it**

```bash
node --experimental-strip-types scripts/probe-contact-bottom.ts
```

- [ ] **Step 3: Record the verdict**

- `launcherPresented === true` and `overlaps` empty → the footer class is genuinely transient there, and Prompt 10's empty reading was real evidence.
- `launcherPresented === true` and an overlap with `inFooter: true` → **the footer class is static there.** Spec §4 falls. Report; do not pick a mechanism.
- `launcherPresented === false` → contradicts Task 2; stop and reconcile.

**Because this is a production build, `topmostAtOverlapCentre` is uncontaminated by the Next dev indicator.** If any value looks like a dev-tools element, the wrong server is being measured — stop.

- [ ] **Step 4: Commit**

```bash
git add scripts/probe-contact-bottom.ts
git commit -m "Measure /contact at maximum scroll — the non-degenerate case"
```

---

### Task 4: Extract the verdict rule into one tested pure function

**This is what makes the positive control mean anything.** If Task 5 computes its own two-line rule and Task 6 uses a different one, the control proves the intersection maths can fire and proves nothing about the discriminator.

**Files:**
- Create: `lib/overlap-verdict.ts`
- Create: `lib/overlap-verdict.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface Sample { scrollY: number; launcherPresented: boolean; coveredFraction: number; }
  export type Verdict = 'static' | 'transient' | 'none';
  export function admittedSamples(samples: Sample[]): Sample[];
  export function verdictFor(samples: Sample[], maxScrollY: number): Verdict;
  export function rollUp(perViewport: Verdict[]): Verdict | 'partial';
  ```
  Consumed by Tasks 5 and 6, unchanged.

- [ ] **Step 1: Write the failing tests**

Follow `lib/validation.test.ts`'s existing Vitest shape.

```ts
import { describe, it, expect } from 'vitest';
import { admittedSamples, verdictFor, rollUp } from './overlap-verdict';

const s = (scrollY: number, launcherPresented: boolean, coveredFraction: number) => ({
  scrollY, launcherPresented, coveredFraction,
});

describe('admittedSamples', () => {
  it('drops samples where the launcher is not presented', () => {
    expect(admittedSamples([s(0, false, 0.9), s(100, true, 0.5)])).toEqual([s(100, true, 0.5)]);
  });
  it('drops samples with no overlap even when presented', () => {
    expect(admittedSamples([s(0, true, 0)])).toEqual([]);
  });
});

describe('verdictFor', () => {
  it('is none when nothing is admitted', () => {
    expect(verdictFor([s(0, false, 0.9)], 1000)).toBe('none');
  });
  it('is static when an admitted overlap survives to maximum scroll', () => {
    expect(verdictFor([s(1000, true, 0.6)], 1000)).toBe('static');
  });
  it('is transient when every admitted overlap has a clearing position', () => {
    expect(verdictFor([s(400, true, 0.6), s(800, true, 0)], 1000)).toBe('transient');
  });
  it('is static when the launcher is yielded at max scroll but overlap persists elsewhere with no clearing sample', () => {
    // Only one admitted sample and no sample clears it -> cannot prove transient.
    expect(verdictFor([s(400, true, 0.6)], 1000)).toBe('static');
  });
});

describe('rollUp', () => {
  it('is partial when viewports disagree', () => {
    expect(rollUp(['static', 'transient'])).toBe('partial');
  });
  it('collapses agreement', () => {
    expect(rollUp(['transient', 'transient'])).toBe('transient');
  });
  it('ignores none when something else is present', () => {
    expect(rollUp(['none', 'transient'])).toBe('transient');
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
bun run test
```
Expected: FAIL, module not found.

- [ ] **Step 3: Implement**

```ts
export interface Sample {
  scrollY: number;
  launcherPresented: boolean;
  coveredFraction: number;
}
export type Verdict = 'static' | 'transient' | 'none';

/** An overlap only counts where the launcher is opaque and hit-testable. */
export function admittedSamples(samples: Sample[]): Sample[] {
  return samples.filter((x) => x.launcherPresented && x.coveredFraction > 0);
}

/**
 * `transient` REQUIRES positive evidence of a clearing scroll position. A
 * single admitted sample with nothing clearing it cannot be called transient —
 * that is the assumption the original partition made.
 */
export function verdictFor(samples: Sample[], maxScrollY: number): Verdict {
  const admitted = admittedSamples(samples);
  if (admitted.length === 0) return 'none';
  const atMax = admitted.some((x) => Math.abs(x.scrollY - maxScrollY) <= 2);
  if (atMax) return 'static';
  const clears = samples.some((x) => x.coveredFraction === 0 || !x.launcherPresented);
  return clears ? 'transient' : 'static';
}

export function rollUp(perViewport: Verdict[]): Verdict | 'partial' {
  const real = perViewport.filter((v) => v !== 'none');
  if (real.length === 0) return 'none';
  const unique = [...new Set(real)];
  return unique.length === 1 ? unique[0] : 'partial';
}
```

- [ ] **Step 4: Run to verify they pass**

```bash
bun run test
```
Expected: PASS, and the existing 73 validation cases still pass.

- [ ] **Step 5: Commit**

```bash
git add lib/overlap-verdict.ts lib/overlap-verdict.test.ts
git commit -m "Extract the overlap verdict rule into one tested pure function

The control and the class partition must run the same rule, or the control
proves the intersection maths fires and nothing about the discriminator."
```

---

### Task 5: The positive control — prove the discriminator can emit `static`

Spec §7. **No verdict from Task 6 may be reported until this passes.**

**Files:**
- Create: `scripts/probe-control.ts`

**Interfaces:**
- Consumes: `lib/overlap-verdict.ts` (**`verdictFor`, called directly — not reimplemented**), `scripts/lib/probe-shared.ts`.
- Produces: `.audit/control.json` — `{ suppressionDisabled: true, verdict, samples }`.

- [ ] **Step 1: Write the control**

It collects `Sample[]` from D-02's geometry and passes them to the **real** `verdictFor`. The suppression is overridden in-page (the hook's `Set` is module-scoped and unreachable), so `.tg-yield` is forced back to presented — which is what the shipped suppression would otherwise have removed.

```ts
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { INIT_SCRIPT } from './lib/probe-shared.ts';
import { verdictFor, type Sample } from '../lib/overlap-verdict.ts';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3210';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3,
});
await ctx.addInitScript({ content: INIT_SCRIPT });
const page = await ctx.newPage();
await page.goto(BASE + '/contact', { waitUntil: 'load' });
await page.addStyleTag({ content: `.tg-yield { opacity: 1 !important; pointer-events: auto !important; }` });

const triggers = page.locator('button[aria-expanded]');
if ((await triggers.count()) === 0) throw new Error('No FAQ triggers — control cannot run.');
await triggers.nth(0).scrollIntoViewIfNeeded();
await triggers.nth(0).click();
await page.waitForTimeout(400);

const { samples, maxScrollY } = await page.evaluate(() => {
  const t = (window as any).__tg;
  const fab = t.findFab();
  const expanded = document.querySelector('button[aria-expanded="true"]');
  const panel = expanded ? document.getElementById(expanded.getAttribute('aria-controls') || '') : null;
  if (!fab || !panel) return { samples: [], maxScrollY: 0 };
  const fr = fab.getBoundingClientRect();
  const er = panel.getBoundingClientRect();
  const area = t.overlapArea(fr, er);
  const maxScrollY = Math.round(document.documentElement.scrollHeight - window.innerHeight);
  return {
    samples: [{
      scrollY: Math.round(window.scrollY),
      ...t.presentedState(fab),
      coveredFraction: er.width && er.height ? +(area / (er.width * er.height)).toFixed(3) : 0,
    }],
    maxScrollY,
  };
});

// The control's whole point: run the REAL rule, not a local one.
const verdict = verdictFor(samples as Sample[], maxScrollY);
await browser.close();
await mkdir('.audit', { recursive: true });
await writeFile('.audit/control.json', JSON.stringify({ suppressionDisabled: true, verdict, samples, maxScrollY }, null, 2));
console.log('control verdict:', verdict);
```

- [ ] **Step 2: Run it**

```bash
node --experimental-strip-types scripts/probe-control.ts
```

**Expected: `static`.**

- [ ] **Step 3: Gate**

- `static` → proceed to Task 6.
- anything else → **stop.** The discriminator cannot detect the one overlap already known to be static. Fix and re-run; report no class verdict.

- [ ] **Step 4: Confirm nothing shipped was modified**

```bash
git status --short components/
```
Expected: empty.

- [ ] **Step 5: Commit**

```bash
git add scripts/probe-control.ts
git commit -m "Positive control: the real verdict function emits static on D-02"
```

---

### Task 6: Partition the four classes, as an `audit-mobile.ts` phase

Spec §6 asks for a re-runnable result, so this is a named phase, not a throwaway.

**Files:**
- Modify: `scripts/audit-mobile.ts` — add `phaseClasses`, register `classes` in `main()`, and add the presented-state fields to the existing occlusion phase

**Interfaces:**
- Consumes: `lib/overlap-verdict.ts`, `scripts/lib/probe-shared.ts`.
- Produces: `.audit/classes.json`.

- [ ] **Step 1: Add the presented-state field to the existing occlusion phase**

After `const findFab = …` (line ~477) add `presentedState` (copy from `probe-shared.ts`'s `INIT_SCRIPT`), then spread `...presentedState(fab)` into the mid-scroll object literal (after `atScrollY`, line ~512) and `...presentedState(fabB)` into `atBottom.push({…})` (after `coveredFraction`, line ~538). **Counting logic is not changed** — the frozen baseline must stay reproducible.

- [ ] **Step 2: Read the four class selectors from source — do not guess**

```bash
grep -n "MetaRail\|prev\|next" "app/work/[slug]/page.tsx" | head -30
grep -n "link-underline" components/*.tsx app/**/*.tsx | head -20
```

Write the four real selectors into the phase. Footer is `footer.footer-dark a[href]` (verified Task 1 Step 3). If any selector matches zero elements on every route, that is a **finding to report**, not a class to drop silently.

- [ ] **Step 3: Implement `phaseClasses` with two-stage scroll sampling**

Coarse pass at `max(200, 0.6 * innerHeight)`, then — **within one coarse step either side of any detected peak — refine at 100px.** At 360×800 the coarse step is 480px, far too wide to tell "peaks then clears" from "plateau," which is the transient verdict's entire basis.

At every sample record `{ scrollY, launcherPresented, coveredFraction }` per element. Then per class × route × viewport call `verdictFor(samples, maxScrollY)`, and across viewports call `rollUp(...)`. Record, for every `transient`, **the scroll position that clears it** — a transient verdict with no clearing position recorded is not reportable.

- [ ] **Step 4: Run both phases**

```bash
node --experimental-strip-types scripts/audit-mobile.ts sweep
node --experimental-strip-types scripts/audit-mobile.ts classes
```

- [ ] **Step 5: Check the frozen baseline still reproduces**

```bash
node -e "const d=require('./.audit/sweep.json');const o=d.flatMap(r=>r.occlusion.overlaps);console.log('pairs',o.length,'above25',o.filter(x=>x.coveredFraction>0.25).length,'worst',Math.max(...o.map(x=>x.coveredFraction)),'presented',o.filter(x=>x.launcherPresented).length)"
```

This is a production build, so the comparison against the frozen 140 / 45 / 100.0% is legitimate. **Report the actual numbers.** If they differ materially, say so plainly — do not pre-excuse a mismatch.

- [ ] **Step 6: Cross-check against the row's stated counts**

The row attributes 38 pairs (12 + 11 + 9 + 6). Report `admittedPairs` **and** 38 side by side. A large shortfall is expected — the frozen count admitted overlaps regardless of launcher state.

- [ ] **Step 7: Commit**

```bash
git add scripts/audit-mobile.ts
git commit -m "Add the classes phase and record the launcher's presented state"
```

---

### Task 7: Update the three documents

**Files:**
- Modify: `docs/PROGRESS.md` (Known Gaps row), `docs/DESIGN.md:747`, `docs/MOBILE-AUDIT.md:57`
- Delete: `scripts/probe-p1.ts`, `scripts/probe-contact-bottom.ts`, `scripts/probe-control.ts` (their results are transcribed; the re-runnable deliverable is the `classes` phase)

- [ ] **Step 1: Erratum on `docs/DESIGN.md:747`** — leave *"All 143 remain transient — 0 at maximum scroll"* unedited; append a dated erratum naming the degeneracy, the 7-of-8 scope, and the new baseline.
- [ ] **Step 2: Erratum on `docs/MOBILE-AUDIT.md:57`** — same treatment; this file's own *"the row below it is not edited"* is the precedent.
- [ ] **Step 3: Rewrite the `docs/PROGRESS.md` Known Gaps row** in spec §8's fixed order: invalid basis and why → `/contact` as the non-degenerate case → replacement discriminator → P1 result → per-class verdicts → `data-primary-cta` not widened → what remains open.
- [ ] **Step 4: Record the Playwright fix** — browser reinstall (`playwright install chromium --with-deps`, `playwright install chromium-headless-shell`). **`docs/PROGRESS.md:1182`'s Bun-stdio mechanism stays flagged unverified:** post-reinstall node works and Bun still times out, consistent with it but not establishing it.
- [ ] **Step 5: Verify**

```bash
bun run lint
bun run test
bun run build
```
Expected: 0 lint errors (1 known warning at `contact-form.tsx:92`), all tests pass, build passes.

- [ ] **Step 6: Commit, then kill the server by port**

```bash
git add docs/ scripts/ && git commit -m "Re-partition the four launcher-overlap classes on a valid discriminator"
netstat -ano | grep ":3210" | grep LISTENING
```

---

## Self-Review

| Spec section | Task |
| --- | --- |
| §2 — degeneracy on 7 of 8 routes; `/contact` non-degenerate | Tasks 2, 3 |
| §3 — replacement discriminator | Task 4 (rule), Task 6 (application) |
| §4 — P1 measured before the conclusion | Task 2, gate after Step 5 |
| §5 — both outcomes written in advance | Task 2 Step 4 |
| §6 — node runner, production build, selector-driven, phase not throwaway | Global Constraints, Task 6 Steps 2–3 |
| §7 — positive control on the real rule | Tasks 4, 5 |
| §8 — deliverables, three documents, freeze | Task 7 |
| §9 — risks | Gates at Task 2 Step 5, Task 3 Step 3, Task 5 Step 3 |

**Known gaps, stated rather than hidden:**

1. **Task 6 Step 3 specifies the sampling algorithm but not full source.** The four selectors must be read from source first (Step 2); writing fabricated selectors into a plan is the error the spec is about.
2. **Task 5's control overrides `.tg-yield` in the page** rather than disabling `useSuppressLauncher`, whose `Set` is module-scoped and unreachable. It reproduces D-02's geometry faithfully but is not literally the pre-fix code path; `control.json` records `suppressionDisabled: true`, and Step 4 confirms no component file was touched.
3. **`verdictFor`'s `transient` branch requires positive evidence of clearing.** A single admitted sample with nothing clearing it returns `static`, deliberately — assuming transience without a clearing position is the original error. This will read as conservative; that is intended, and any resulting `static` is re-checked by hand before it reaches a document.

**Type consistency:** `Sample`, `Verdict`, `verdictFor`, `rollUp`, `admittedSamples` are defined once in `lib/overlap-verdict.ts` and imported by Tasks 5 and 6. `launcherPresented` is defined once in `INIT_SCRIPT` and consumed by Tasks 2, 3, 5, 6. `.audit/` filenames are distinct per task and never `git add`ed.
