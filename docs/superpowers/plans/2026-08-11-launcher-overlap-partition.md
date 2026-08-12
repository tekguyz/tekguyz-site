# Launcher-Overlap Re-Partition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-partition the four untouched non-CTA launcher-overlap classes (meta-rail, inline `link-underline`, prev/next nav, footer) into transient-during-scroll and static-after-user-action, on a discriminator that can actually produce both verdicts, and update the three documents carrying the stale claim.

**Architecture:** Measure the two facts that can invalidate the spec's §4 decision *first* (Tasks 1–2). Only then build the yielded-state probe, prove it can emit `static` against a known case (Task 4), and run it (Task 5). Documentation last, once verdicts exist.

**Tech Stack:** Playwright 1.62 driven by `node --experimental-strip-types`, Next 16 dev server on port 3210, existing harness `scripts/audit-mobile.ts`.

**Spec:** `docs/superpowers/specs/2026-08-11-launcher-overlap-partition-design.md`

## Global Constraints

- **Runner is `node --experimental-strip-types`, from the project directory.** Not Bun — post-reinstall Bun still times out at 60s. Never `bun run scripts/audit-mobile.ts`.
- **`data-primary-cta` is not widened, on any element, under any outcome.** Hard rule, CLAUDE.md.
- **Never measure a page whose stylesheet 404s.** `main()` already guards this; any ad-hoc script must too. A stale server on 3210 serves a previous build.
- **Kill servers by port, never by process name:** `netstat -ano | grep ":3210" | grep LISTENING`, then `taskkill //PID <pid> //F`.
- **The machine matches `prefers-reduced-motion: reduce`** (`MinAnimate = 0`). Do not change it, do not emulate around it. `.tg-yield` gets `transition: none` under `reduce`, so the launcher's presented state resolves instantly — this makes the opacity read binary and cleaner, not less valid.
- **Historical numbers are FROZEN.** 143 / 44 / 99.6% and 140 / 45 / 100.0% are never edited in place. New numbers are published as a separate named baseline plus a dated erratum.
- **A partially resolved class is never summarised as resolved.** Either every summary carries the qualifier, or it is split into its own ID. CLAUDE.md hard rule.
- **`[NEEDS COPY: …]` conventions do not apply here** — this pass writes no user-facing copy.
- **Report what was not finished.** Never describe unfinished work as complete.

**Server for every measuring task:**
```bash
npx next dev -p 3210
```
Confirm `http://localhost:3210/` returns 200 and its referenced stylesheet returns 200 before trusting any number.

---

### Task 1: Measure P1 — does `closing-cta` survive to maximum scroll?

This is the fact that can invalidate spec §4. If `footer-dark` is taller than the viewport, `closing-cta` leaves the viewport at maximum scroll, the IntersectionObserver releases, and the launcher is re-presented over the footer — a static-at-rest overlap with no user action behind it.

`components/footer-dark.tsx` stacks a masthead, tagline, a 44px social row, a hairline, and **three link columns that stack vertically below 768px** because `.tg-grid` is one column there. P1 failing at 360–390 is expected, not hypothetical. Measure it before anything else.

**Files:**
- Create: `scripts/probe-p1.ts` (throwaway; deleted in Task 6)
- Read only: `components/footer-dark.tsx`, `components/closing-cta.tsx:98`

**Interfaces:**
- Consumes: nothing.
- Produces: `.audit/p1.json` — an array of `{ route, viewport, footerHeight, viewportHeight, ctaIntersectingAtMaxScroll, launcherOpacity, launcherPointerEvents, launcherPresented }`. Task 3 reads `launcherPresented` semantics from here; Task 5 cites this file.

- [ ] **Step 1: Start the dev server and confirm the stylesheet**

```bash
npx next dev -p 3210
```
In a second shell:
```bash
curl -s http://localhost:3210/ | grep -o 'href="[^"]*\.css[^"]*"' | head -1
```
Then `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3210<that href>` — expected `200`. If not 200, kill by port and restart; do not proceed.

- [ ] **Step 2: Write the P1 probe**

Create `scripts/probe-p1.ts`:

```ts
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3210';

/* The three narrow viewports the spec names, plus the two the launcher
   overlaps were originally found at. Labels match audit-mobile.ts's VIEWPORTS. */
const VPS = [
  { label: 'narrow', width: 360, height: 800 },
  { label: 'se', width: 375, height: 667 },
  { label: 'standard', width: 390, height: 844 },
  { label: 'large-phone', width: 414, height: 896 },
  { label: 'landscape', width: 844, height: 390 },
];

/* /contact is the non-degenerate route (no closing-cta). The rest are a
   representative slice of the 7 that carry one, including both dynamic
   segments, since page height differs and page height is what pushes the
   CTA out of view. */
const ROUTES = [
  '/contact',
  '/',
  '/work',
  '/work/field-photo-reports',
  '/solutions/ai-voice-agents',
  '/process',
  '/privacy',
];

const browser = await chromium.launch();
const rows: unknown[] = [];

for (const vp of VPS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.width < 768,
    hasTouch: vp.width < 768,
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    // The launcher only exists past 0.85 x innerHeight, so it must be
    // scrolled into existence before anything about it can be read.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    // The IntersectionObserver and the .tg-yield transition both need a beat.
    await page.waitForTimeout(500);

    const row = await page.evaluate(() => {
      const footer = document.querySelector('footer.footer-dark');
      const cta = document.querySelector('[data-primary-cta]');
      const launcher = [...document.querySelectorAll('button')].find((b) =>
        (b.textContent || '').includes('Ask about your project'),
      );

      const inView = (el: Element | null) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight && r.width > 0 && r.height > 0;
      };

      const cs = launcher ? getComputedStyle(launcher) : null;
      const opacity = cs ? Number(cs.opacity) : null;

      return {
        footerHeight: footer ? Math.round(footer.getBoundingClientRect().height) : null,
        viewportHeight: window.innerHeight,
        ctaPresent: !!cta,
        ctaIntersectingAtMaxScroll: inView(cta),
        launcherOpacity: opacity,
        launcherPointerEvents: cs ? cs.pointerEvents : null,
        launcherAriaHidden: launcher ? launcher.getAttribute('aria-hidden') : null,
        // The single derived field the rest of the plan keys off.
        launcherPresented: opacity !== null && opacity > 0.5 && cs!.pointerEvents !== 'none',
        scrollY: Math.round(window.scrollY),
        maxScrollY: Math.round(document.documentElement.scrollHeight - window.innerHeight),
      };
    });

    rows.push({ route, viewport: vp.label, ...row });
    console.log(
      `p1 ${vp.label.padEnd(12)} ${route.padEnd(30)} footer=${row.footerHeight} vh=${row.viewportHeight} ctaInView=${row.ctaIntersectingAtMaxScroll} launcherPresented=${row.launcherPresented}`,
    );
  }
  await ctx.close();
}

await browser.close();
await mkdir('.audit', { recursive: true });
await writeFile('.audit/p1.json', JSON.stringify(rows, null, 2));
console.log('done: p1');
```

- [ ] **Step 3: Run it**

```bash
node --experimental-strip-types scripts/probe-p1.ts
```

Expected: 35 rows, no errors. Every row must have a non-null `footerHeight` and `launcherOpacity` — a null means the selector missed and the row is not evidence.

- [ ] **Step 4: Read the result and record the verdict**

Two things to extract, and write both into the run notes before moving on:

1. **P1 per route × viewport.** `ctaIntersectingAtMaxScroll === true` everywhere → P1 holds, spec §4's no-feeder decision stands. Any `false` where `ctaPresent === true` → **P1 fails there**, and Task 5's footer/prev-nav verdict at that viewport is expected to be `static`.
2. **`/contact` sanity.** `ctaPresent` may be `true` (the form's buttons) but `ctaIntersectingAtMaxScroll` should be `false` — the form is near the top. If so, `launcherPresented` must be `true`, and `/contact` is confirmed as the non-degenerate route the spec claims.

**If `launcherPresented` is `false` on `/contact` at maximum scroll, stop and report.** That would mean something other than `data-primary-cta` is yielding the launcher, and the spec's §2 reasoning needs revisiting before any probe is built.

- [ ] **Step 5: Commit**

```bash
git add scripts/probe-p1.ts .audit/p1.json
git commit -m "Measure P1: is closing-cta still in view at maximum scroll

The spec's no-feeder decision assumes it is. footer-dark stacks its three
link columns below 768px, so this is measured rather than assumed."
```

---

### Task 2: Measure the `/contact` non-degenerate max-scroll case

Task 1 establishes whether the launcher is *presented* on `/contact` at maximum scroll. This task establishes what, if anything, *overlaps* it there — the reading that makes Prompt 10's empty result real evidence for the footer class rather than a degenerate one.

**Files:**
- Create: `scripts/probe-contact-bottom.ts` (throwaway; deleted in Task 6)

**Interfaces:**
- Consumes: `.audit/p1.json` (for `launcherPresented` on `/contact`).
- Produces: `.audit/contact-bottom.json` — `{ viewport, launcherPresented, overlaps: [{ selector, text, coveredFraction, topmostAtOverlapCentre }] }`.

- [ ] **Step 1: Write the probe**

Create `scripts/probe-contact-bottom.ts`:

```ts
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3210';
const VPS = [
  { label: 'narrow', width: 360, height: 800 },
  { label: 'se', width: 375, height: 667 },
  { label: 'standard', width: 390, height: 844 },
  { label: 'large-phone', width: 414, height: 896 },
  { label: 'landscape', width: 844, height: 390 },
];

const browser = await chromium.launch();
const rows: unknown[] = [];

for (const vp of VPS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.width < 768,
    hasTouch: vp.width < 768,
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/contact', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(500);

  const row = await page.evaluate(() => {
    const launcher = [...document.querySelectorAll('button')].find((b) =>
      (b.textContent || '').includes('Ask about your project'),
    );
    if (!launcher) return { launcherPresented: false, reason: 'launcher not found', overlaps: [] };

    const cs = getComputedStyle(launcher);
    const presented = Number(cs.opacity) > 0.5 && cs.pointerEvents !== 'none';
    const fr = launcher.getBoundingClientRect();

    const sel = (el: Element) => {
      const id = el.id ? `#${el.id}` : '';
      const cls = typeof el.className === 'string' && el.className
        ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
        : '';
      return `${el.tagName.toLowerCase()}${id}${cls}`;
    };

    const INTERACTIVE = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const overlaps: unknown[] = [];

    for (const el of document.querySelectorAll(INTERACTIVE)) {
      if (el === launcher || launcher.contains(el) || el.contains(launcher)) continue;
      const er = el.getBoundingClientRect();
      if (er.width === 0 || er.height === 0) continue;
      const w = Math.min(fr.right, er.right) - Math.max(fr.left, er.left);
      const h = Math.min(fr.bottom, er.bottom) - Math.max(fr.top, er.top);
      if (w <= 0 || h <= 0) continue;
      const cx = (Math.max(fr.left, er.left) + Math.min(fr.right, er.right)) / 2;
      const cy = (Math.max(fr.top, er.top) + Math.min(fr.bottom, er.bottom)) / 2;
      const hit = document.elementFromPoint(cx, cy);
      overlaps.push({
        selector: sel(el),
        text: (el.textContent || '').trim().slice(0, 44),
        coveredFraction: +((w * h) / (er.width * er.height)).toFixed(3),
        topmostAtOverlapCentre: hit ? sel(hit) : null,
        // Is the covered element inside the footer? That is the class this
        // measurement is evidence about.
        inFooter: !!el.closest('footer.footer-dark'),
      });
    }
    return { launcherPresented: presented, launcherOpacity: Number(cs.opacity), overlaps };
  });

  rows.push({ viewport: vp.label, ...row });
  console.log(`contact-bottom ${vp.label.padEnd(12)} presented=${row.launcherPresented} overlaps=${row.overlaps.length}`);
  await ctx.close();
}

await browser.close();
await mkdir('.audit', { recursive: true });
await writeFile('.audit/contact-bottom.json', JSON.stringify(rows, null, 2));
console.log('done: contact-bottom');
```

- [ ] **Step 2: Run it**

```bash
node --experimental-strip-types scripts/probe-contact-bottom.ts
```

Expected: 5 rows.

- [ ] **Step 3: Record the verdict**

- `launcherPresented === true` **and** `overlaps` empty at a viewport → the footer class is genuinely transient there, and Prompt 10's empty reading was real evidence.
- `launcherPresented === true` **and** `overlaps` non-empty with `inFooter: true` → **the footer class is static at that viewport.** Spec §4's no-feeder decision falls. Report it; do not pick a mechanism yet.
- `launcherPresented === false` → contradicts Task 1; stop and reconcile.

**Gate:** if Tasks 1 and 2 together show P1 failing anywhere, spec §4 is void as written. Report to the user with the numbers and get a direction before building the probe in Task 3 — the probe's shape does not change, but what the pass *delivers* does (a mechanism question, not a documentation one).

- [ ] **Step 4: Commit**

```bash
git add scripts/probe-contact-bottom.ts .audit/contact-bottom.json
git commit -m "Measure /contact at maximum scroll — the non-degenerate case

The one route with no closing-cta, so the launcher is presented at the
bottom and the max-scroll reading is real rather than structural."
```

---

### Task 3: Add the yielded-state field to the existing occlusion phase

The existing occlusion loop (`scripts/audit-mobile.ts:486-516`) intersects rects without consulting whether the launcher is presented. This adds that field without changing what the loop counts, so the frozen historical numbers stay reproducible.

**Files:**
- Modify: `scripts/audit-mobile.ts:486-516` (mid-scroll loop) and `:521-548` (max-scroll block)

**Interfaces:**
- Consumes: nothing from Tasks 1–2 in code; the `launcherPresented` definition is copied verbatim from Task 1's probe (`opacity > 0.5 && pointerEvents !== 'none'`) so the two agree.
- Produces: every entry in `occlusion.overlaps` and `occlusion.overlapsAtMaxScroll` gains `launcherPresented: boolean` and `launcherOpacity: number`. Task 5 filters on these.

- [ ] **Step 1: Add the helper inside the `occlusion` evaluate block**

In `scripts/audit-mobile.ts`, immediately after `const findFab = () => …` (line ~477), add:

```ts
    /* An overlap only counts if the launcher is actually presented. The old
       probe intersected rects regardless, so pairs sampled mid-fade or fully
       yielded were counted at full rect area — which is why "0 at maximum
       scroll" could never fail on a route ending in closing-cta. */
    const presentedState = (fab: Element) => {
      const cs = getComputedStyle(fab);
      const opacity = Number(cs.opacity);
      return { launcherOpacity: opacity, launcherPresented: opacity > 0.5 && cs.pointerEvents !== 'none' };
    };
```

- [ ] **Step 2: Record it in the mid-scroll loop**

In the `if (!prev || area > prev.overlapArea)` block (line ~504), add the two fields to the object literal, after `atScrollY`:

```ts
            atScrollY: Math.round(window.scrollY),
            ...presentedState(fab),
```

- [ ] **Step 3: Record it in the max-scroll block**

In the `atBottom.push({ … })` call (line ~532), add after `coveredFraction`:

```ts
          ...presentedState(fabB),
```

- [ ] **Step 4: Run one phase and confirm the field appears**

```bash
node --experimental-strip-types scripts/audit-mobile.ts sweep
```
Let it run to completion, then:
```bash
node -e "const d=require('./.audit/sweep.json');const o=d.flatMap(r=>r.occlusion.overlaps);console.log('overlaps',o.length,'withField',o.filter(x=>'launcherPresented' in x).length,'presented',o.filter(x=>x.launcherPresented).length)"
```

Expected: `withField` equals `overlaps` — every entry carries the field. `presented` will be lower than `overlaps`; that gap is the inflation the spec describes.

- [ ] **Step 5: Confirm the frozen numbers still reproduce**

```bash
node -e "const d=require('./.audit/sweep.json');const o=d.flatMap(r=>r.occlusion.overlaps);console.log('pairs',o.length,'above25',o.filter(x=>x.coveredFraction>0.25).length,'worst',Math.max(...o.map(x=>x.coveredFraction)))"
```

The counting logic was not changed, so these should land near the frozen 140 / 45 / 1.000. **They will not match exactly** — this is a dev build and Prompt 11's was a different build; record the actual numbers rather than asserting parity. If they differ by more than a few pairs, say so in the report rather than absorbing it.

- [ ] **Step 6: Commit**

```bash
git add scripts/audit-mobile.ts .audit/sweep.json
git commit -m "Record the launcher's presented state alongside every overlap

The occlusion probe intersected rects without asking whether the launcher
was opaque and hit-testable, so a yielded launcher still counted overlaps
at full rect area. Counting logic unchanged; the frozen baseline still
reproduces."
```

---

### Task 4: The positive control — prove the probe can emit `static`

Spec §7. A discriminator that has never emitted `static` has not been shown able to. **No verdict from Task 5 may be reported until this passes.**

**Files:**
- Create: `scripts/probe-control.ts` (throwaway; deleted in Task 6)
- Read only: `components/concierge/concierge-bus.ts`, `components/faq-accordion.tsx`

**Interfaces:**
- Consumes: the `launcherPresented` definition from Task 3.
- Produces: `.audit/control.json` — `{ suppressionDisabled: true, verdict: 'static' | 'transient', pair: {…} }`.

- [ ] **Step 1: Write the control probe**

The suppression is disabled *in the page*, not in source — no shipped file is edited. `useSuppressLauncher` is a module-scoped `Set` behind `useSyncExternalStore`, so it cannot be reached from the page. Instead the control reproduces D-02's **geometry** directly: expand an FAQ row, then force the launcher back to presented by overriding `.tg-yield`'s opacity with an injected `!important` rule — which is what the suppression would otherwise have removed.

Create `scripts/probe-control.ts`:

```ts
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3210';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 3,
});
const page = await ctx.newPage();
await page.goto(BASE + '/contact', { waitUntil: 'networkidle' });

// Reproduce D-02's pre-fix state: an expanded FAQ row with the launcher
// presented over it. The shipped suppression removes the launcher here, so
// the control overrides it — an inline rule needs !important to beat
// .tg-yield's own declaration.
await page.addStyleTag({
  content: `.tg-yield { opacity: 1 !important; pointer-events: auto !important; }`,
});

const triggers = page.locator('button[aria-expanded]');
const count = await triggers.count();
if (count === 0) throw new Error('No FAQ accordion triggers found — control cannot run.');
await triggers.nth(0).scrollIntoViewIfNeeded();
await triggers.nth(0).click();
await page.waitForTimeout(400);

const result = await page.evaluate(() => {
  const launcher = [...document.querySelectorAll('button')].find((b) =>
    (b.textContent || '').includes('Ask about your project'),
  );
  if (!launcher) return { verdict: 'error', reason: 'launcher not found' };

  const cs = getComputedStyle(launcher);
  const presented = Number(cs.opacity) > 0.5 && cs.pointerEvents !== 'none';
  const fr = launcher.getBoundingClientRect();

  const expanded = document.querySelector('button[aria-expanded="true"]');
  const panelId = expanded?.getAttribute('aria-controls');
  const panel = panelId ? document.getElementById(panelId) : null;
  if (!panel) return { verdict: 'error', reason: 'expanded panel not found', presented };

  const er = panel.getBoundingClientRect();
  const w = Math.min(fr.right, er.right) - Math.max(fr.left, er.left);
  const h = Math.min(fr.bottom, er.bottom) - Math.max(fr.top, er.top);
  const area = w > 0 && h > 0 ? w * h : 0;

  return {
    verdict: presented && area > 0 ? 'static' : 'transient',
    presented,
    launcherOpacity: Number(cs.opacity),
    overlapArea: Math.round(area),
    coveredFraction: er.width && er.height ? +(area / (er.width * er.height)).toFixed(3) : 0,
    panelRect: { top: Math.round(er.top), bottom: Math.round(er.bottom) },
    launcherRect: { top: Math.round(fr.top), bottom: Math.round(fr.bottom) },
  };
});

await browser.close();
await mkdir('.audit', { recursive: true });
await writeFile(
  '.audit/control.json',
  JSON.stringify({ suppressionDisabled: true, viewport: 'standard 390x844', ...result }, null, 2),
);
console.log('control verdict:', JSON.stringify(result));
```

- [ ] **Step 2: Run it**

```bash
node --experimental-strip-types scripts/probe-control.ts
```

**Expected: `verdict: "static"`.**

- [ ] **Step 3: Gate on the result**

- `static` → the discriminator can emit both verdicts. Proceed to Task 5.
- `transient` or `error` → **stop.** The probe cannot detect the one overlap already known to be static. Fix the probe and re-run; do not run Task 5, and do not report any class verdict.

- [ ] **Step 4: Confirm nothing shipped was modified**

```bash
git status --short components/
```
Expected: empty. The control overrides styles in the page only; if any component file is dirty, revert it — the suppression channel must be measured in its shipped state by Task 5.

- [ ] **Step 5: Commit**

```bash
git add scripts/probe-control.ts .audit/control.json
git commit -m "Positive control: the probe emits static on D-02's geometry

A discriminator that has never emitted static has not been shown able to.
Suppression is overridden in-page for the control only; no component file
is touched, and control.json records that it was disabled."
```

---

### Task 5: Partition the four classes

**Files:**
- Create: `scripts/probe-classes.ts` (throwaway; deleted in Task 6)

**Interfaces:**
- Consumes: `.audit/p1.json`, `.audit/contact-bottom.json`, `.audit/control.json`, and the `launcherPresented` field added in Task 3.
- Produces: `.audit/classes.json` — per class: `{ class, admittedPairs, peakCoveredFraction, verdict: 'transient' | 'static' | 'partial', evidence }`.

- [ ] **Step 1: Define the four classes by selector, not by route**

Spec §6 requires selector-driven discovery. The selectors:

| Class | Selector |
| --- | --- |
| meta-rail | `[data-meta-rail] a[href]` — confirm the attribute exists in `app/work/[slug]/page.tsx`'s `MetaRail`; if it does not, use the rail's actual container class and record which was used |
| inline `link-underline` | `a.link-underline:not(footer a)` |
| prev/next nav | the prev/next container in `app/work/[slug]/page.tsx` — read the file and record the selector used |
| footer | `footer.footer-dark a[href]` |

**Read `app/work/[slug]/page.tsx` and `components/footer-dark.tsx` first and write the four real selectors into the script.** Do not guess. If a selector matches zero elements on every route, that is a finding to report, not a class to silently drop.

- [ ] **Step 2: Write the class probe**

It reuses Task 1's viewport list and Task 2's overlap maths. For each class × route × viewport it scrolls in steps of `max(200, 0.6 * innerHeight)` to the bottom, and at each step records overlaps **only where `launcherPresented` is true**. Then:

```
verdict = 'static'    if an admitted overlap exists at maximum scroll
        = 'transient' if every admitted overlap has a reachable scroll
                      position where it is absent
        = 'partial'   if the two differ across viewports
```

The `partial` case is mandatory, not optional — CLAUDE.md forbids summarising a partially resolved class as resolved.

Record for every `transient` verdict **the scroll position that clears it**, as evidence. A transient verdict with no clearing position recorded is not reportable.

- [ ] **Step 3: Run it**

```bash
node --experimental-strip-types scripts/probe-classes.ts
```

- [ ] **Step 4: Cross-check against the row's stated counts**

The row attributes 38 pairs to these classes (12 meta-rail + 11 inline + 9 prev/next + 6 footer). Compare `admittedPairs` against it. **A large shortfall is expected** — the frozen count admitted overlaps regardless of launcher state — but report the two numbers side by side rather than only the new one.

- [ ] **Step 5: Commit**

```bash
git add scripts/probe-classes.ts .audit/classes.json
git commit -m "Partition the four classes on the yielded-state discriminator"
```

---

### Task 6: Update the three documents

Spec §8. All three carry the stale claim; updating one leaves the others quoting the old number.

**Files:**
- Modify: `docs/PROGRESS.md` — the Known Gaps row
- Modify: `docs/DESIGN.md:747`
- Modify: `docs/MOBILE-AUDIT.md:57`
- Delete: `scripts/probe-p1.ts`, `scripts/probe-contact-bottom.ts`, `scripts/probe-control.ts`, `scripts/probe-classes.ts`

- [ ] **Step 1: Fold the probes into the harness or delete them**

The four throwaway scripts were scaffolding. Either fold the class probe into `scripts/audit-mobile.ts` as a named phase (preferred — spec §6 asks for a re-runnable result) or delete all four. **Do not leave them loose in `scripts/`.** Whichever is chosen, say which in the report.

- [ ] **Step 2: Add the erratum to `docs/DESIGN.md:747`**

Leave *"All 143 remain transient — 0 at maximum scroll"* **unedited**. Append a dated erratum beneath it naming the degeneracy, the 7-of-8 route scope, and the new baseline by name.

- [ ] **Step 3: Add the erratum to `docs/MOBILE-AUDIT.md:57`**

Same treatment — the M-06/M-15 banner's *"**0 at maximum scroll**, unchanged"* is not edited. This file's own convention (*"the row below it is not edited"*) is the precedent.

- [ ] **Step 4: Rewrite the `docs/PROGRESS.md` Known Gaps row**

In the order spec §8 fixes: the original partition's basis was invalid on the 7 `closing-cta` routes and why; `/contact` as the non-degenerate case and what it showed for the footer; the replacement discriminator; the P1 result; the per-class verdicts; that `data-primary-cta` was not widened; what remains open.

Also record in the Prompt 14 row and/or the harness notes that **the Playwright blocker was a browser install, fixed by `playwright install chromium --with-deps` and `playwright install chromium-headless-shell`** — and that `docs/PROGRESS.md:1182`'s Bun-stdio mechanism is **unverified**: post-reinstall, node works and Bun still times out, which is consistent with it but does not establish it.

- [ ] **Step 5: Verify the build and lint still pass**

```bash
bun run lint
```
Expected: 0 errors, 1 known warning (`contact-form.tsx:92`).

If `scripts/audit-mobile.ts` was modified in Task 3 and kept, also:
```bash
bun run build
```
Expected: passes, 45 routes prerendered, zero type errors.

- [ ] **Step 6: Commit**

```bash
git add docs/ scripts/
git commit -m "Re-partition the four launcher-overlap classes on a valid discriminator"
```

- [ ] **Step 7: Kill the dev server**

```bash
netstat -ano | grep ":3210" | grep LISTENING
```
Then `taskkill //PID <pid> //F` for each. Confirm `curl http://localhost:3210/` fails.

---

## Self-Review

**Spec coverage:**

| Spec section | Task |
| --- | --- |
| §2 — degeneracy on 7 of 8 routes; `/contact` non-degenerate | Tasks 1, 2 |
| §3 — replacement discriminator | Task 3 (field), Task 5 (verdict logic) |
| §4 — P1 measured before the conclusion | Task 1, gate at Task 2 Step 3 |
| §5 — both outcomes written in advance | Task 1 Step 4, Task 2 Step 3 |
| §6 — node runner, selector-driven routes, ordering | Global Constraints, Task 5 Step 1, Tasks 1–2 first |
| §7 — positive control with a blocking fail condition | Task 4 |
| §8 — deliverables, three documents, freeze | Task 6 |
| §9 — risks | Gates in Tasks 2 and 4; dev-vs-prod noted at Task 3 Step 5 |

**Known gaps in this plan, stated rather than hidden:**

1. **Task 5 Step 2 does not contain the full probe source.** It specifies the algorithm, the verdict rule, and the evidence requirement, but the selectors must be read from source first (Step 1) and the script written against them. Writing fabricated selectors into the plan would be worse than this gap — it is exactly the error the spec is about. The implementer writes it; the rule it must implement is fully specified.
2. **Spec §9's production-build re-confirmation is not its own task.** It is conditional — it only fires if a P1 result lands near the boundary at 360–390. Noted at Task 3 Step 5 and Task 1 Step 4 rather than given a task that may never run.
3. **Task 4's control overrides `.tg-yield` in the page rather than disabling `useSuppressLauncher`.** The hook's `Set` is module-scoped and unreachable from the page. This reproduces D-02's geometry faithfully but is not literally the pre-fix code path; `control.json` records it, and Task 4 Step 4 confirms no component file was touched.

**Type consistency:** `launcherPresented` is defined once (`opacity > 0.5 && pointerEvents !== 'none'`) and used identically in Tasks 1, 2, 3, 4 and 5. `.audit/` filenames are distinct per task and each is read by name where consumed.
