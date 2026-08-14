/**
 * Mobile & motion audit harness — Prompt 7.
 *
 * MEASURES ONLY. It changes nothing about the site. Everything it emits is a
 * number plus the call that produced it, so `docs/archive/MOBILE-AUDIT.md` can be
 * re-derived byte-for-byte by re-running this against the same commit.
 *
 * RUN IT LIKE THIS, and only like this:
 *
 *   (Get-NetTCPConnection -LocalPort 3210 -State Listen).OwningProcess |
 *     % { taskkill /PID $_ /T /F }
 *   bun run build
 *   bunx next start -p 3210
 *   node --experimental-strip-types scripts/audit-mobile.ts
 *
 * NOT under Bun. Bun's stdio handling breaks Playwright's
 * `--remote-debugging-pipe` on Windows and `launch()` times out after 180s with
 * the browser visibly spawned (Prompt 5). The file must also live inside the
 * project directory or `playwright` does not resolve.
 *
 * Phases (`node ... scripts/audit-mobile.ts <phase>`; default `all`):
 *   sweep    A. every route x every viewport — overflow, tap targets, edge
 *            proximity, FAB occlusion, text wrapping, section rhythm
 *   surfaces B. the named surfaces, raw numbers at every viewport whether or
 *            not they failed a check
 *   motion   C. animation inventory, both reducedMotion states
 *   prod     D. production parity spot-check against https://tekguyz.com
 *   taps     E. tap targets HIT-TESTED rather than rect-measured — the only
 *            phase that can see a pseudo-element hit-area expansion, and the
 *            one DESIGN.md §8's two-tier policy is verified against
 *
 * Output: `.audit/<phase>.json` (+ `.audit/shots/*.png`). `.audit/` is
 * gitignored — the repo is public and no binary belongs in it.
 *
 * The layout sweep runs under `reducedMotion: 'reduce'` deliberately: entrance
 * transitions leave elements mid-flight, and a rect sampled mid-transition is
 * not a layout measurement. Phase C is the only place motion is enabled, and it
 * gets there through Playwright's own context override, never the OS setting.
 */
import { chromium, devices, type Browser, type BrowserContext, type Page } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3210';
const PROD = 'https://tekguyz.com';
const OUT = '.audit';

/* ------------------------------------------------------------------ routes */

const WORK = [
  'field-photo-reports',
  'ai-voice-receptionist',
  'bundle-builder',
  'ai-audio-file-insights',
  'team-performance',
  'meeting-organizer',
  'restaurant-menu',
  'auto-detailer',
];
const SOLUTIONS = ['smart-operations', 'ai-voice-agents', 'business-systems', 'custom-web-apps'];

/** All 18 rendered routes. */
const ROUTES: string[] = [
  '/',
  '/solutions',
  ...SOLUTIONS.map((s) => `/solutions/${s}`),
  '/work',
  ...WORK.map((s) => `/work/${s}`),
  '/process',
  '/contact',
  '/privacy',
];

/* --------------------------------------------------------------- viewports */

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
];

/**
 * A resized desktop context leaves isMobile/hasTouch/deviceScaleFactor at
 * desktop values, which changes how `dvh` resolves, whether `hover` matches,
 * and how tap targets hit-test. Prefer a real Playwright device descriptor
 * whose viewport matches exactly; construct an equivalent one otherwise, and
 * record which of the two every viewport got.
 */
function descriptorFor(vp: VP) {
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

/* ------------------------------------------------- in-page helper injection */

/**
 * Injected before every page script on every navigation, so each `evaluate`
 * below can use the same primitives. Keeping them here rather than inlining
 * per-call is what makes two different measurements comparable.
 */
const HELPERS = `
window.__a = (() => {
  const INTERACTIVE = 'a,button,input,select,textarea,summary,[role="button"],[role="link"],[onclick],[tabindex]:not([tabindex="-1"])';

  function visible(el) {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    let n = el;
    while (n && n.nodeType === 1) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      if (parseFloat(cs.opacity) === 0) return false;
      // Visually-hidden-but-focusable content. The skip link is
      // \`sr-only focus:not-sr-only\` with px-4/py-3 overriding sr-only's own
      // padding reset, so it reports a 32x24 rect at left -1 while being
      // clipped to nothing. Counting that as an undersized tap target sitting
      // off the left edge is a false positive on all 18 routes.
      if (cs.clip === 'rect(0px, 0px, 0px, 0px)') return false;
      if (cs.clipPath === 'inset(50%)' || cs.clipPath === 'inset(100%)') return false;
      n = n.parentElement;
    }
    return true;
  }

  function sel(el) {
    if (!el || el.nodeType !== 1) return null;
    const parts = [];
    let n = el;
    while (n && n.nodeType === 1 && n !== document.documentElement && parts.length < 5) {
      let p = n.tagName.toLowerCase();
      if (n.id) { parts.unshift(p + '#' + n.id); break; }
      const cls = (n.getAttribute('class') || '')
        .split(/\\s+/).filter(Boolean)
        .filter(c => !/^(is-revealed|reveal-armed)$/.test(c))
        .slice(0, 3);
      if (cls.length) p += '.' + cls.join('.');
      const sibs = n.parentElement ? [...n.parentElement.children].filter(s => s.tagName === n.tagName) : [];
      if (sibs.length > 1) p += ':nth-of-type(' + (sibs.indexOf(n) + 1) + ')';
      parts.unshift(p);
      n = n.parentElement;
    }
    return parts.join(' > ');
  }

  function txt(el, n = 60) {
    const t = (el.textContent || '').replace(/\\s+/g, ' ').trim();
    return t.length > n ? t.slice(0, n) + '\\u2026' : t;
  }

  function rect(el) {
    const r = el.getBoundingClientRect();
    return {
      x: +r.x.toFixed(1), y: +r.y.toFixed(1),
      w: +r.width.toFixed(1), h: +r.height.toFixed(1),
      left: +r.left.toFixed(1), right: +r.right.toFixed(1),
      top: +r.top.toFixed(1), bottom: +r.bottom.toFixed(1),
    };
  }

  /** Real rendered line boxes, from Range rects over each word. Not height/line-height. */
  function lines(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const words = [];
    let n;
    while ((n = walker.nextNode())) {
      const s = n.nodeValue || '';
      const re = /\\S+/g;
      let m;
      while ((m = re.exec(s))) {
        const r = document.createRange();
        r.setStart(n, m.index);
        r.setEnd(n, m.index + m[0].length);
        const b = r.getBoundingClientRect();
        if (b.width > 0 || b.height > 0) {
          words.push({ w: m[0], top: Math.round(b.top * 2) / 2, left: b.left, right: b.right });
        }
      }
    }
    const out = [];
    for (const w of words) {
      let line = out.find(l => Math.abs(l.top - w.top) <= 3);
      if (!line) { line = { top: w.top, words: [], left: Infinity, right: -Infinity }; out.push(line); }
      line.words.push(w);
      line.left = Math.min(line.left, w.left);
      line.right = Math.max(line.right, w.right);
    }
    out.sort((a, b) => a.top - b.top);
    return out.map(l => {
      // Adjacent text nodes with no whitespace between them — JSX interpolation
      // like {'0'}{step}{' / 02'} is three walker nodes but ONE rendered word.
      // Re-glue anything whose boxes touch, so the reported line text and word
      // count are what a reader actually sees rather than a DOM artefact.
      const glued = [];
      for (const w of l.words) {
        const prev = glued[glued.length - 1];
        if (prev && Math.abs(prev.right - w.left) < 1) { prev.w += w.w; prev.right = w.right; }
        else glued.push({ w: w.w, left: w.left, right: w.right });
      }
      return {
        top: l.top,
        text: glued.map(g => g.w).join(' '),
        words: glued.length,
        left: +l.left.toFixed(1),
        right: +l.right.toFixed(1),
        width: +(l.right - l.left).toFixed(1),
      };
    });
  }

  function box(el) {
    const cs = getComputedStyle(el);
    return {
      display: cs.display,
      position: cs.position,
      padding: cs.paddingTop + ' ' + cs.paddingRight + ' ' + cs.paddingBottom + ' ' + cs.paddingLeft,
      margin: cs.marginTop + ' ' + cs.marginRight + ' ' + cs.marginBottom + ' ' + cs.marginLeft,
      gap: cs.rowGap + ' / ' + cs.columnGap,
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      flexWrap: cs.flexWrap,
      justifyContent: cs.justifyContent,
      alignItems: cs.alignItems,
      width: cs.width,
      height: cs.height,
      maxWidth: cs.maxWidth,
      maxHeight: cs.maxHeight,
      minHeight: cs.minHeight,
      inset: cs.top + ' ' + cs.right + ' ' + cs.bottom + ' ' + cs.left,
      zIndex: cs.zIndex,
      overflow: cs.overflowX + ' / ' + cs.overflowY,
    };
  }

  /*
   * Every author rule in the served stylesheets that matches the element and
   * declares one of the named properties, in stylesheet order. This is how a
   * computed height gets traced back to the declaration it resolves from
   * (vh / dvh / px / auto) rather than guessed at from the class list.
   */
  function declarations(el, props) {
    const hits = [];
    for (const sheet of [...document.styleSheets]) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }
      // selectorText FIRST. In current Chromium a CSSStyleRule also exposes
      // .cssRules (for CSS nesting), so testing that first silently treats
      // every style rule as a grouping rule and matches nothing at all.
      const walk = (list, media) => {
        for (const rule of list) {
          if (rule.selectorText) {
            let matches = false;
            try { matches = el.matches(rule.selectorText); } catch { matches = false; }
            if (matches) {
              for (const p of props) {
                const v = rule.style.getPropertyValue(p);
                if (v) hits.push({ selector: rule.selectorText, media: media || null, prop: p, value: v.trim(), important: rule.style.getPropertyPriority(p) === 'important' });
              }
              if (rule.cssRules && rule.cssRules.length) walk(rule.cssRules, media);
            }
            continue;
          }
          if (rule.cssRules) walk(rule.cssRules, (rule.conditionText || (rule.media && rule.media.mediaText) || media));
        }
      };
      walk(rules, null);
    }
    const inline = {};
    for (const p of props) {
      const v = el.style.getPropertyValue(p);
      if (v) inline[p] = v;
    }
    return { rules: hits, inline };
  }

  function interactives() {
    return [...document.querySelectorAll(INTERACTIVE)].filter(visible);
  }

  function overlap(a, b) {
    const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (w <= 0 || h <= 0) return 0;
    return +(w * h).toFixed(1);
  }

  function byText(tag, text) {
    return [...document.querySelectorAll(tag)].find(e => (e.textContent || '').replace(/\\s+/g,' ').trim().includes(text)) || null;
  }

  return { INTERACTIVE, visible, sel, txt, rect, lines, box, declarations, interactives, overlap, byText };
})();
`;

/* ------------------------------------------------------------ context setup */

interface CtxOpts {
  vp: VP;
  theme: 'light' | 'dark';
  motion: 'reduce' | 'no-preference';
}

async function makeContext(browser: Browser, o: CtxOpts) {
  const d = descriptorFor(o.vp);
  const ctx = await browser.newContext({
    ...(d.options as Record<string, unknown>),
    viewport: { width: o.vp.width, height: o.vp.height },
    reducedMotion: o.motion,
    colorScheme: o.theme,
  });
  // next-themes: attribute="class", defaultTheme="light", enableSystem={false}.
  // The class is applied from localStorage before paint, so seed it here rather
  // than clicking the toggle after load and re-measuring a settled layout.
  await ctx.addInitScript(`try { localStorage.setItem('theme', '${o.theme}'); } catch (e) {}`);
  await ctx.addInitScript(HELPERS);
  return { ctx, descriptor: d.source };
}

async function load(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'load', timeout: 45_000 });
  await page.waitForTimeout(350);
}

/* --------------------------------------------------- A. the per-route sweep */

async function sweepRoute(page: Page, route: string, vp: VP) {
  await load(page, BASE + route);

  const layout = await page.evaluate(() => {
    const a = (window as any).__a;
    const de = document.documentElement;
    const vw = de.clientWidth;

    /* 1. horizontal overflow, and the elements actually responsible ---------- */
    const docScrollW = de.scrollWidth;
    const offenders: unknown[] = [];
    let widestRight: unknown = null;
    if (docScrollW > vw + 0.5) {
      let maxRight = -Infinity;
      for (const el of Array.from(document.body.querySelectorAll<HTMLElement>('*'))) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        const cs = getComputedStyle(el);
        if (r.right > maxRight) {
          maxRight = r.right;
          widestRight = { selector: a.sel(el), text: a.txt(el, 40), right: +r.right.toFixed(1), width: +r.width.toFixed(1), position: cs.position, overflowX: cs.overflowX };
        }
        if (r.right <= vw + 0.5) continue;
        const p = el.parentElement;
        const pr = p ? p.getBoundingClientRect().right : Infinity;
        // Only the outermost element of each overflowing chain: a child that
        // overflows because its parent does is not a separate defect.
        if (p && pr > vw + 0.5) continue;
        offenders.push({
          selector: a.sel(el),
          text: a.txt(el, 40),
          right: +r.right.toFixed(1),
          overBy: +(r.right - vw).toFixed(1),
          width: +r.width.toFixed(1),
          position: cs.position,
          overflowX: cs.overflowX,
        });
      }
      // An overflow with no element past the edge is a real result, not a bug
      // in the walk — record the widest box so the fix prompt has a starting
      // point instead of an empty list.
      if (offenders.length === 0 && widestRight) {
        (widestRight as any).note = 'no element rect exceeds the viewport; documentElement.scrollWidth still exceeds clientWidth';
      }
    }

    /* 2 + 3. tap targets and viewport-edge proximity ------------------------- */
    const small: unknown[] = [];
    const edge: unknown[] = [];
    for (const el of a.interactives()) {
      const r = a.rect(el);
      const cs = getComputedStyle(el);
      const inProse = !!el.closest('p') && cs.display.startsWith('inline');
      const rec = {
        selector: a.sel(el),
        text: a.txt(el, 44),
        w: r.w,
        h: r.h,
        display: cs.display,
        inProse,
      };
      if (r.w < 44 || r.h < 44) small.push(rec);
      if (r.left < 8 || r.right > vw - 8) {
        edge.push({ ...rec, left: r.left, right: r.right, viewportWidth: vw, clipped: r.right > vw || r.left < 0 });
      }
    }

    /* 5. text wrapping on the surfaces that carry the page's voice ----------- */
    const WRAP_SEL = [
      'h1', 'h2', 'h3', 'h4',
      '.button-primary', 'header a', 'nav a',
      '[class*="eyebrow"]', '[class*="tag"]',
      'a[class*="rounded"]', 'button[class*="rounded"]',
    ].join(',');
    const wraps: unknown[] = [];
    const seen = new Set<Element>();
    for (const el of Array.from(document.querySelectorAll<HTMLElement>(WRAP_SEL))) {
      if (seen.has(el) || !a.visible(el)) continue;
      seen.add(el);
      const ls = a.lines(el);
      if (ls.length === 0) continue;
      const last = ls[ls.length - 1];
      const orphan = ls.length > 1 && last.words === 1;
      if (!orphan && ls.length < 2) continue;
      const parent = el.parentElement;
      wraps.push({
        selector: a.sel(el),
        text: a.txt(el, 90),
        tag: el.tagName.toLowerCase(),
        lineCount: ls.length,
        orphan,
        lastLine: last.text,
        elementWidth: a.rect(el).w,
        containerWidth: parent ? +parent.getBoundingClientRect().width.toFixed(1) : null,
        fontSize: getComputedStyle(el).fontSize,
        lineHeight: getComputedStyle(el).lineHeight,
      });
    }

    return {
      viewportWidth: vw,
      viewportHeight: de.clientHeight,
      docScrollWidth: docScrollW,
      overflowPx: +(docScrollW - vw).toFixed(1),
      overflowOffenders: offenders,
      widestElementWhenOverflowing: widestRight,
      bodyScrollWidth: document.body.scrollWidth,
      smallTapTargets: small,
      edgeProximity: edge,
      wrapping: wraps,
      revealHooksInDom: document.querySelectorAll('.reveal').length,
    };
  });

  /* 4. FAB occlusion — the launcher only exists past 0.85 x innerHeight, so it
     has to be scrolled into existence, and the intersection re-taken at each
     scroll step because the FAB is fixed and everything else is not. */
  const occlusion = await page.evaluate(async () => {
    const a = (window as any).__a;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const findFab = () =>
      [...document.querySelectorAll('button')].find((b) =>
        (b.textContent || '').includes('Ask about your project'),
      ) || null;

    /* An overlap only counts if the launcher is actually presented. This probe
       intersected rects regardless, so pairs sampled while the launcher was
       mid-fade or fully yielded were counted at full rect area. Recorded, not
       filtered — the frozen 143/44/99.6% baseline must stay reproducible. */
    /* Attribute each overlap to one of the four re-partition classes, so the
       `classes` phase can diff its own counts against this phase's for the
       same class. Both phases must agree on which elements overlap at all. */
    const tgClassOf = (el: Element) => {
      if (el.closest('footer.footer-dark')) return 'footer';
      if (el.closest('nav[aria-label="More work"]')) return 'prev-next';
      if (el.closest('aside')) return 'meta-rail';
      if (el.matches('a.link-underline')) return 'inline-link-underline';
      return null;
    };

    const presentedState = (fab: Element) => {
      const cs = getComputedStyle(fab);
      const opacity = Number(cs.opacity);
      return {
        launcherOpacity: opacity,
        launcherPresented: opacity > 0.5 && cs.pointerEvents !== 'none',
      };
    };

    const docH = document.documentElement.scrollHeight;
    const vh = window.innerHeight;
    const step = Math.max(200, Math.round(vh * 0.6));
    const hits: Record<string, any> = {};
    let fabSeen: any = null;
    let onTop: string | null = null;

    for (let y = 0; y <= docH; y += step) {
      window.scrollTo(0, y);
      await sleep(120);
      const fab = findFab();
      if (!fab || !a.visible(fab)) continue;
      const fr = a.rect(fab);
      fabSeen = fr;
      if (!onTop) {
        const mid = document.elementFromPoint((fr.left + fr.right) / 2, (fr.top + fr.bottom) / 2);
        onTop = mid ? a.sel(mid) : null;
      }
      for (const el of a.interactives()) {
        if (el === fab || fab.contains(el) || el.contains(fab)) continue;
        const er = a.rect(el);
        const area = a.overlap(fr, er);
        if (area <= 0) continue;
        const key = a.sel(el);
        const prev = hits[key];
        if (!prev || area > prev.overlapArea) {
          hits[key] = {
            selector: key,
            text: a.txt(el, 44),
            elementRect: er,
            fabRect: fr,
            overlapArea: area,
            coveredFraction: +(area / Math.max(1, er.w * er.h)).toFixed(3),
            atScrollY: Math.round(window.scrollY),
            tgClass: tgClassOf(el),
            ...presentedState(fab),
          };
        }
      }
    }
    // Overlaps at MAXIMUM scroll are the ones that matter differently: the FAB
    // is fixed, so mid-page an overlap can be scrolled out from under it. At
    // the bottom of the document there is nowhere left to scroll, so whatever
    // sits under the launcher there stays under it.
    window.scrollTo(0, docH);
    await sleep(250);
    const atBottom: unknown[] = [];
    const fabB = findFab();
    if (fabB && a.visible(fabB)) {
      const fr = a.rect(fabB);
      for (const el of a.interactives()) {
        if (el === fabB || fabB.contains(el) || el.contains(fabB)) continue;
        const er = a.rect(el);
        const area = a.overlap(fr, er);
        if (area <= 0) continue;
        atBottom.push({
          selector: a.sel(el),
          text: a.txt(el, 44),
          elementRect: er,
          fabRect: fr,
          overlapArea: area,
          coveredFraction: +(area / Math.max(1, er.w * er.h)).toFixed(3),
          ...presentedState(fabB),
          // Is the FAB actually the topmost thing over the covered area?
          topmostAtOverlapCentre: (() => {
            const cx = (Math.max(fr.left, er.left) + Math.min(fr.right, er.right)) / 2;
            const cy = (Math.max(fr.top, er.top) + Math.min(fr.bottom, er.bottom)) / 2;
            const hit = document.elementFromPoint(cx, cy);
            return hit ? a.sel(hit) : null;
          })(),
        });
      }
    }

    window.scrollTo(0, 0);
    await sleep(150);
    return {
      fabRect: fabSeen,
      fabEverVisible: !!fabSeen,
      elementAtFabCentre: onTop,
      overlaps: Object.values(hits),
      overlapsAtMaxScroll: atBottom,
      maxScrollY: Math.max(0, docH - vh),
    };
  });

  return { route, viewport: vp.label, ...layout, occlusion };
}

async function phaseSweep(browser: Browser) {
  const results: unknown[] = [];
  const combos: { vp: VP; theme: 'light' | 'dark' }[] = [];
  for (const vp of VIEWPORTS) {
    combos.push({ vp, theme: 'light' });
    if (vp.label === 'narrow' || vp.label === 'standard') combos.push({ vp, theme: 'dark' });
  }

  for (const { vp, theme } of combos) {
    const { ctx, descriptor } = await makeContext(browser, { vp, theme, motion: 'reduce' });
    const page = await ctx.newPage();
    for (const route of ROUTES) {
      try {
        const r = await sweepRoute(page, route, vp);
        results.push({ ...r, theme, descriptor });
        const n =
          (r.overflowPx > 0.5 ? 1 : 0) +
          (r.smallTapTargets as unknown[]).length +
          (r.edgeProximity as unknown[]).length +
          (r.wrapping as unknown[]).length +
          r.occlusion.overlaps.length;
        console.log(`sweep ${vp.label}/${theme} ${route.padEnd(30)} checks-hit=${n} overflow=${r.overflowPx}`);
      } catch (e) {
        results.push({ route, viewport: vp.label, theme, error: String(e) });
        console.log(`sweep ${vp.label}/${theme} ${route} FAILED ${e}`);
      }
    }
    await ctx.close();
  }
  return results;
}

/* ------------------------------------------------------ B. named surfaces */

async function measureClosingCta(page: Page) {
  return page.evaluate(() => {
    const a = (window as any).__a;
    const h2 = [...document.querySelectorAll('h2')].find((h) =>
      (h.textContent || '').includes('Let’s talk about your business'),
    );
    if (!h2) return { present: false };
    const section = h2.closest('section')!;
    const inner = h2.closest('div.mx-auto') as HTMLElement | null;
    const subhead = inner?.querySelector('p');
    // The INNERMOST matching div. The outermost is the SequenceItem wrapper,
    // whose flex-wrap is `nowrap` — measuring it reports the trust row as not
    // wrapping at exactly the widths where it visibly does.
    const trustRow = [...(inner?.querySelectorAll('div') || [])]
      .filter((d) => (d.textContent || '').includes('Free first conversation'))
      .pop() as HTMLElement | undefined;
    const btn = [...(inner?.querySelectorAll('a') || [])].find((x) =>
      (x.textContent || '').trim().startsWith('Let’s Talk'),
    ) as HTMLElement | undefined;
    const secondary = [...(inner?.querySelectorAll('button') || [])].find((x) =>
      (x.textContent || '').includes('ask our AI'),
    ) as HTMLElement | undefined;
    const stripe = section.querySelector('div[class*="grid-cols-4"]') as HTMLElement | null;

    return {
      present: true,
      sectionRect: a.rect(section),
      innerSelector: a.sel(inner),
      innerBox: inner ? a.box(inner) : null,
      innerRect: inner ? a.rect(inner) : null,
      headline: { rect: a.rect(h2), box: a.box(h2), lines: a.lines(h2) },
      subhead: subhead ? { rect: a.rect(subhead), box: a.box(subhead), lines: a.lines(subhead) } : null,
      trustRow: trustRow
        ? {
            rect: a.rect(trustRow),
            box: a.box(trustRow),
            lines: a.lines(trustRow),
            children: [...trustRow.children].map((c) => ({
              text: a.txt(c as HTMLElement, 60),
              rect: a.rect(c as HTMLElement),
              isDot: (c as HTMLElement).getAttribute('aria-hidden') === 'true',
            })),
          }
        : null,
      button: btn ? { rect: a.rect(btn), box: a.box(btn), lines: a.lines(btn) } : null,
      secondaryLink: secondary ? { text: a.txt(secondary, 80), rect: a.rect(secondary), box: a.box(secondary), lines: a.lines(secondary) } : null,
      signatureStripe: stripe ? { rect: a.rect(stripe), box: a.box(stripe) } : null,
    };
  });
}

async function measureFooter(page: Page) {
  return page.evaluate(() => {
    const a = (window as any).__a;
    const footer = document.querySelector('footer.footer-dark') as HTMLElement | null;
    if (!footer) return { present: false };
    const container = footer.querySelector('.tg-container') as HTMLElement;
    const masthead = container.firstElementChild as HTMLElement; // flex-wrap row
    const lockupBlock = masthead.firstElementChild as HTMLElement;
    const socialRow = masthead.lastElementChild as HTMLElement;
    const tagline = lockupBlock.querySelector('p:nth-of-type(2)') as HTMLElement | null;
    const navGrid = container.querySelector('.tg-grid') as HTMLElement;
    const cols = [...navGrid.children] as HTMLElement[];
    const bottomBar = container.lastElementChild as HTMLElement;
    const stripe = footer.querySelector('div[class*="grid-cols-4"]') as HTMLElement | null;

    const mr = masthead.getBoundingClientRect();
    const lr = lockupBlock.getBoundingClientRect();
    const sr = socialRow.getBoundingClientRect();
    const nr = navGrid.getBoundingClientRect();
    const tr = tagline?.getBoundingClientRect();

    return {
      present: true,
      footerRect: a.rect(footer),
      containerBox: a.box(container),
      masthead: {
        rect: a.rect(masthead),
        box: a.box(masthead),
        wrapped: sr.top > lr.bottom - 1,
      },
      lockupBlock: { rect: a.rect(lockupBlock), box: a.box(lockupBlock) },
      tagline: tagline ? { text: a.txt(tagline, 60), rect: a.rect(tagline), lines: a.lines(tagline) } : null,
      socialRow: {
        rect: a.rect(socialRow),
        box: a.box(socialRow),
        items: [...socialRow.children].map((c) => ({ label: (c as HTMLElement).getAttribute('aria-label'), rect: a.rect(c as HTMLElement) })),
      },
      gaps: {
        lockupBottom_to_socialTop: +(sr.top - lr.bottom).toFixed(1),
        taglineBottom_to_socialTop: tr ? +(sr.top - tr.bottom).toFixed(1) : null,
        socialBottom_to_dividerTop: +(nr.top - sr.bottom).toFixed(1),
        mastheadBottom_to_dividerTop: +(nr.top - mr.bottom).toFixed(1),
        socialRow_isAbove_divider: sr.bottom <= nr.top + 1,
        socialRow_isLeftAligned: Math.abs(sr.left - lr.left) < 2,
      },
      divider: {
        selector: a.sel(navGrid),
        borderTop: getComputedStyle(navGrid).borderTopWidth + ' ' + getComputedStyle(navGrid).borderTopColor,
        top: +nr.top.toFixed(1),
        paddingTop: getComputedStyle(navGrid).paddingTop,
        marginTop: getComputedStyle(navGrid).marginTop,
      },
      navGrid: {
        rect: a.rect(navGrid),
        box: a.box(navGrid),
        gridTemplateColumns: getComputedStyle(navGrid).gridTemplateColumns,
        renderedColumnCount: new Set(cols.map((c) => Math.round(c.getBoundingClientRect().left))).size,
        columns: cols.map((c) => ({
          heading: a.txt(c.querySelector('p') as HTMLElement, 30),
          rect: a.rect(c),
          gridColumn: (c as HTMLElement).style.gridColumn,
        })),
      },
      bottomBar: { text: a.txt(bottomBar, 80), rect: a.rect(bottomBar), box: a.box(bottomBar) },
      signatureStripe: stripe ? a.rect(stripe) : null,
    };
  });
}

async function measureContactForm(page: Page) {
  return page.evaluate(() => {
    const a = (window as any).__a;
    const form = document.querySelector('form') as HTMLElement | null;
    if (!form) return { present: false };
    const card = form.closest('div[class*="rounded"]') as HTMLElement | null;
    const header = form.querySelector('div[class*="border-b"]') as HTMLElement;
    const title = header.querySelector('p') as HTMLElement;
    const counter = header.querySelector('span') as HTMLElement;
    const fieldWrap = form.querySelector('div[class*="gap-6"]') as HTMLElement | null;
    const groups = fieldWrap ? ([...fieldWrap.children] as HTMLElement[]) : [];
    // Step 1's advance control is a plain button, not type=submit — take the
    // last visible button in the form rather than assuming which it is.
    const buttons = [...form.querySelectorAll('button')].filter((b) => a.visible(b)) as HTMLElement[];
    const submit = buttons[buttons.length - 1] ?? null;

    return {
      present: true,
      cardSelector: a.sel(card),
      cardRect: card ? a.rect(card) : null,
      cardBox: card ? a.box(card) : null,
      pageContainer: (() => {
        const c = form.closest('.tg-container') as HTMLElement | null;
        return c ? { selector: a.sel(c), rect: a.rect(c), box: a.box(c) } : null;
      })(),
      stepHeader: {
        selector: a.sel(header),
        rect: a.rect(header),
        box: a.box(header),
        containerWidth: +header.getBoundingClientRect().width.toFixed(1),
        title: { text: a.txt(title, 60), rect: a.rect(title), box: a.box(title), lines: a.lines(title) },
        counter: { text: a.txt(counter, 20), rect: a.rect(counter), box: a.box(counter), lines: a.lines(counter) },
        gapBetween: +(counter.getBoundingClientRect().left - title.getBoundingClientRect().right).toFixed(1),
      },
      fieldGroupGap: fieldWrap ? getComputedStyle(fieldWrap).rowGap : null,
      fields: groups.map((g) => {
        const label = g.querySelector('label') as HTMLElement | null;
        const control = g.querySelector('input,select,textarea') as HTMLElement | null;
        return {
          label: label ? { text: a.txt(label, 40), rect: a.rect(label), box: a.box(label) } : null,
          control: control
            ? { tag: control.tagName.toLowerCase(), id: control.id, rect: a.rect(control), box: a.box(control) }
            : null,
          labelBottom_to_controlTop:
            label && control
              ? +(control.getBoundingClientRect().top - label.getBoundingClientRect().bottom).toFixed(1)
              : null,
        };
      }),
      submit: submit ? { text: a.txt(submit, 40), rect: a.rect(submit), box: a.box(submit) } : null,
      allFormButtons: buttons.map((b) => ({ text: a.txt(b, 40), type: b.getAttribute('type'), rect: a.rect(b), box: a.box(b) })),
    };
  });
}

async function measureFab(page: Page) {
  // Scroll past the hero: the launcher is deliberately absent above it.
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.4));
  await page.waitForTimeout(500);
  return page.evaluate(() => {
    const a = (window as any).__a;
    const fab = [...document.querySelectorAll('button')].find((b) =>
      (b.textContent || '').includes('Ask about your project'),
    ) as HTMLElement | undefined;
    if (!fab) return { present: false };
    const cs = getComputedStyle(fab);
    return {
      present: true,
      selector: a.sel(fab),
      rect: a.rect(fab),
      box: a.box(fab),
      computed: {
        position: cs.position,
        right: cs.right,
        bottom: cs.bottom,
        width: cs.width,
        height: cs.height,
        padding: cs.paddingTop + ' ' + cs.paddingRight + ' ' + cs.paddingBottom + ' ' + cs.paddingLeft,
        fontSize: cs.fontSize,
        borderRadius: cs.borderRadius,
        zIndex: cs.zIndex,
        gap: cs.gap,
      },
      // env(safe-area-inset-*) never reaches computed style as the function
      // itself, so the only honest check is whether any declaration that
      // matches this element mentions it at all.
      safeAreaDeclarations: a.declarations(fab, [
        'inset', 'top', 'right', 'bottom', 'left',
        'padding', 'padding-bottom', 'padding-right', 'margin-bottom', 'margin-right',
      ]).rules.filter((r: any) => /env\(/.test(r.value)),
      insetDeclarations: a.declarations(fab, ['right', 'bottom', 'position']),
      distanceToViewportRight: +(document.documentElement.clientWidth - fab.getBoundingClientRect().right).toFixed(1),
      distanceToViewportBottom: +(window.innerHeight - fab.getBoundingClientRect().bottom).toFixed(1),
    };
  });
}

async function measurePanel(page: Page) {
  const opened = await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const fab = [...document.querySelectorAll('button')].find((b) =>
      (b.textContent || '').includes('Ask about your project'),
    ) as HTMLElement | undefined;
    if (!fab) return false;
    fab.click();
    await sleep(600);
    return true;
  });
  if (!opened) return { present: false, reason: 'launcher not reachable at this scroll position' };

  return page.evaluate(async () => {
    const a = (window as any).__a;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const panel = document.querySelector('div[role="dialog"]') as HTMLElement | null;
    if (!panel) return { present: false, reason: 'dialog did not mount' };

    const cs = getComputedStyle(panel);
    const list = panel.querySelector('div[class*="overflow-y-auto"]') as HTMLElement | null;
    const input = panel.querySelector('input#concierge-input') as HTMLElement | null;
    const send = panel.querySelector('button[type="submit"]') as HTMLElement | null;
    const close = panel.querySelector('button[aria-label="Close"]') as HTMLElement | null;
    const fabNow = [...document.querySelectorAll('button')].find((b) =>
      (b.textContent || '').includes('Ask about your project'),
    ) as HTMLElement | undefined;

    // Does the page behind the panel still scroll while it is open?
    const before = window.scrollY;
    window.scrollBy(0, 300);
    await sleep(250);
    const after = window.scrollY;
    window.scrollTo(0, before);
    await sleep(150);

    const pr = panel.getBoundingClientRect();

    return {
      present: true,
      rect: a.rect(panel),
      box: a.box(panel),
      computed: {
        position: cs.position,
        width: cs.width,
        height: cs.height,
        maxWidth: cs.maxWidth,
        maxHeight: cs.maxHeight,
        minHeight: cs.minHeight,
        right: cs.right,
        bottom: cs.bottom,
        zIndex: cs.zIndex,
        overflow: cs.overflow,
      },
      // Where the height actually comes from, traced through the cascade —
      // not inferred from the class names.
      heightDeclarations: a.declarations(panel, ['height', 'max-height', 'min-height', 'width', 'max-width', 'inset', 'top', 'bottom']),
      messageListDeclarations: list ? a.declarations(list, ['height', 'max-height', 'min-height', 'flex']) : null,
      heightResolvesFrom:
        cs.height === 'auto'
          ? 'auto (content-sized; no height declaration on the panel)'
          : 'computed ' + cs.height,
      viewportProbe: { width: document.documentElement.clientWidth, height: window.innerHeight, dvhProbe: (() => {
        const d = document.createElement('div');
        d.style.cssText = 'position:fixed;height:100dvh;width:1px;top:0;left:-9999px;';
        document.body.appendChild(d);
        const h = d.getBoundingClientRect().height;
        d.style.height = '100vh';
        const vh = d.getBoundingClientRect().height;
        d.remove();
        return { dvh100: +h.toFixed(1), vh100: +vh.toFixed(1) };
      })() },
      overflowsViewportTop: pr.top < 0,
      panelTop: +pr.top.toFixed(1),
      panelBottom: +pr.bottom.toFixed(1),
      messageList: list ? { rect: a.rect(list), box: a.box(list), scrollHeight: list.scrollHeight, clientHeight: list.clientHeight } : null,
      input: input ? { rect: a.rect(input), box: a.box(input), distanceToPanelBottom: +(pr.bottom - input.getBoundingClientRect().bottom).toFixed(1), distanceToViewportBottom: +(window.innerHeight - input.getBoundingClientRect().bottom).toFixed(1) } : null,
      sendButton: send ? { rect: a.rect(send), box: a.box(send) } : null,
      closeAffordance: close ? { text: a.txt(close, 10), ariaLabel: close.getAttribute('aria-label'), rect: a.rect(close), box: a.box(close) } : null,
      fabStillVisible: !!(fabNow && a.visible(fabNow)),
      fabRectWhileOpen: fabNow ? a.rect(fabNow) : null,
      fabZIndex: fabNow ? getComputedStyle(fabNow).zIndex : null,
      pageScrollsBehind: { before, after, moved: +(after - before).toFixed(1) },
      bodyOverflow: getComputedStyle(document.body).overflow,
    };
  });
}

async function measureNav(page: Page) {
  return page.evaluate(() => {
    const a = (window as any).__a;
    const header = document.querySelector('header') as HTMLElement;
    const bar = header.querySelector('.tg-container') as HTMLElement;
    const lockup = header.querySelector('a[aria-label="TEKGUYZ home"]') as HTMLElement;
    const burger = header.querySelector('button[aria-controls="mobile-drawer"]') as HTMLElement | null;
    // Both the theme toggle and the CTA are rendered twice — once in the
    // md:flex desktop nav, once in the md:hidden mobile row. Picking the first
    // match measures a display:none element with a zero rect and reports it as
    // if it were the one on screen.
    const toggles = [...header.querySelectorAll('button')].filter((b) =>
      /mode/i.test(b.getAttribute('aria-label') || b.textContent || ''),
    ) as HTMLElement[];
    const ctas = [...header.querySelectorAll('a')].filter((x) =>
      (x.textContent || '').trim().startsWith('Let’s Talk'),
    ) as HTMLElement[];
    const toggle = toggles.find((t) => a.visible(t)) ?? toggles[0];
    const cta = ctas.find((c) => a.visible(c)) ?? ctas[0];
    const stripe = document.querySelector('header + div[class*="grid-cols-4"], header ~ * div[class*="grid-cols-4"]') as HTMLElement | null;
    const firstStripe = [...document.querySelectorAll('div[class*="grid-cols-4"]')][0] as HTMLElement | undefined;
    const hr = header.getBoundingClientRect();

    const ctaBox = (el?: HTMLElement) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        rect: a.rect(el),
        padding: cs.paddingTop + ' ' + cs.paddingRight + ' ' + cs.paddingBottom + ' ' + cs.paddingLeft,
        fontSize: cs.fontSize,
        borderRadius: cs.borderRadius,
        display: cs.display,
        className: el.getAttribute('class'),
      };
    };

    const items = [lockup, toggle, burger, cta].filter(Boolean) as HTMLElement[];
    const sumWidths = items.reduce((n, el) => n + el.getBoundingClientRect().width, 0);

    return {
      headerRect: a.rect(header),
      headerBorderBottom: getComputedStyle(header).borderBottomWidth + ' ' + getComputedStyle(header).borderBottomColor,
      barRect: a.rect(bar),
      barBox: a.box(bar),
      headerHeight: +hr.height.toFixed(1),
      stripeTop: firstStripe ? +firstStripe.getBoundingClientRect().top.toFixed(1) : null,
      stripeRect: firstStripe ? a.rect(firstStripe) : null,
      stripeGapFromHeaderBottom: firstStripe ? +(firstStripe.getBoundingClientRect().top - hr.bottom).toFixed(1) : null,
      lockup: ctaBox(lockup),
      themeToggle: ctaBox(toggle),
      themeToggleInstances: toggles.map((t) => ({ visible: a.visible(t), ...ctaBox(t)! })),
      hamburger: ctaBox(burger),
      navCta: ctaBox(cta),
      navCtaInstances: ctas.map((c) => ({ visible: a.visible(c), ...ctaBox(c)! })),
      navCtaRendersInCollapsedHeader: !!(cta && a.visible(cta)),
      horizontalBudget: {
        viewportWidth: document.documentElement.clientWidth,
        containerPadding: getComputedStyle(bar).paddingLeft + ' / ' + getComputedStyle(bar).paddingRight,
        sumOfItemWidths: +sumWidths.toFixed(1),
        items: items.map((el) => ({ selector: a.sel(el), text: a.txt(el, 20), w: +el.getBoundingClientRect().width.toFixed(1) })),
      },
      desktopLinksVisible: [...header.querySelectorAll('[data-navlink]')].filter((l) => a.visible(l)).length,
    };
  });
}

async function measureDrawerCta(page: Page) {
  return page.evaluate(async () => {
    const a = (window as any).__a;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const burger = document.querySelector('button[aria-controls="mobile-drawer"]') as HTMLElement | null;
    if (!burger || !a.visible(burger)) return { drawerAvailable: false };
    burger.click();
    await sleep(350);
    const drawer = document.getElementById('mobile-drawer');
    if (!drawer) return { drawerAvailable: false, reason: 'drawer did not mount' };
    const cta = [...drawer.querySelectorAll('a')].find((x) =>
      (x.textContent || '').trim().startsWith('Let’s Talk'),
    ) as HTMLElement | undefined;
    const cs = cta ? getComputedStyle(cta) : null;
    const out = {
      drawerAvailable: true,
      drawerRect: a.rect(drawer),
      drawerCta: cta && cs
        ? {
            rect: a.rect(cta),
            padding: cs.paddingTop + ' ' + cs.paddingRight + ' ' + cs.paddingBottom + ' ' + cs.paddingLeft,
            fontSize: cs.fontSize,
            borderRadius: cs.borderRadius,
          }
        : null,
      drawerLinks: [...drawer.querySelectorAll('a,button')].filter((e) => a.visible(e)).map((e) => ({
        text: a.txt(e as HTMLElement, 30),
        rect: a.rect(e as HTMLElement),
      })),
    };
    (burger as HTMLElement).click();
    await sleep(250);
    return out;
  });
}

/**
 * DESIGN.md §3 has the hero media bleeding past the right edge at desktop
 * widths and §8 turns that off below `md`. Which side of 767/768 each layout
 * actually lands on is a claim worth measuring rather than reading.
 */
async function measureHero(page: Page) {
  return page.evaluate(() => {
    const a = (window as any).__a;
    const vw = document.documentElement.clientWidth;
    const media = document.querySelector('section img, section [class*="rounded-l"], section picture') as HTMLElement | null;
    const img = document.querySelector('main img, body img') as HTMLElement | null;
    const el = media ?? img;
    if (!el) return { present: false, viewportWidth: vw };
    const panel = (el.closest('[class*="rounded"]') as HTMLElement) ?? el;
    return {
      present: true,
      viewportWidth: vw,
      mediaSelector: a.sel(el),
      mediaRect: a.rect(el),
      panelSelector: a.sel(panel),
      panelRect: a.rect(panel),
      panelBleedPastRightEdge: +(panel.getBoundingClientRect().right - vw).toFixed(1),
      borderRadius: getComputedStyle(panel).borderRadius,
      aspectRatio: getComputedStyle(el).aspectRatio,
      objectFit: getComputedStyle(el).objectFit,
      docScrollWidth: document.documentElement.scrollWidth,
    };
  });
}

async function phaseSurfaces(browser: Browser) {
  const out: Record<string, unknown[]> = {
    closingCta: [], footer: [], contactForm: [], fab: [], panel: [], nav: [], drawer: [], fabDesktop: [], hero: [],
  };

  for (const vp of VIEWPORTS) {
    const { ctx, descriptor } = await makeContext(browser, { vp, theme: 'light', motion: 'reduce' });
    const page = await ctx.newPage();
    const tag = { viewport: vp.label, size: `${vp.width}x${vp.height}`, theme: 'light', descriptor };

    // closing-cta + footer + nav live on `/` (closing-cta is absent on /contact
    // by design — that page is itself the ask).
    await load(page, BASE + '/');
    out.nav.push({ ...tag, route: '/', ...(await measureNav(page)) });
    out.hero.push({ ...tag, route: '/', ...(await measureHero(page)) });
    out.drawer.push({ ...tag, route: '/', ...(await measureDrawerCta(page)) });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(500);
    out.closingCta.push({ ...tag, route: '/', ...(await measureClosingCta(page)) });
    out.footer.push({ ...tag, route: '/', ...(await measureFooter(page)) });

    // concierge FAB + panel, measured on `/` where the page is long enough to
    // scroll past the hero.
    await load(page, BASE + '/');
    out.fab.push({ ...tag, route: '/', ...(await measureFab(page)) });
    out.panel.push({ ...tag, route: '/', ...(await measurePanel(page)) });

    // contact form
    await load(page, BASE + '/contact');
    out.contactForm.push({ ...tag, route: '/contact', ...(await measureContactForm(page)) });
    out.nav.push({ ...tag, route: '/contact', ...(await measureNav(page)) });

    await ctx.close();
  }

  // Desktop comparison for the FAB — the reported symptom is that mobile and
  // desktop are identical, which is a claim about both numbers, not one.
  const dctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });
  await dctx.addInitScript(`try { localStorage.setItem('theme','light'); } catch (e) {}`);
  await dctx.addInitScript(HELPERS);
  const dpage = await dctx.newPage();
  await load(dpage, BASE + '/');
  out.fabDesktop.push({ viewport: 'desktop-1440', size: '1440x900', route: '/', descriptor: 'desktop context (isMobile:false)', ...(await measureFab(dpage)) });
  out.panel.push({ viewport: 'desktop-1440', size: '1440x900', route: '/', descriptor: 'desktop context (isMobile:false)', ...(await measurePanel(dpage)) });
  out.nav.push({ viewport: 'desktop-1440', size: '1440x900', route: '/', descriptor: 'desktop context (isMobile:false)', ...(await measureNav(dpage)) });
  await dctx.close();

  return out;
}

/* -------------------------------------------------- C. animation inventory */

const MOTION_ROUTES = [
  '/',
  '/work',
  '/work/ai-voice-receptionist',
  '/work/team-performance',
  '/solutions',
  '/solutions/ai-voice-agents',
  '/process',
  '/contact',
];

async function animationWalk(page: Page, route: string) {
  await load(page, BASE + route);

  return page.evaluate(async () => {
    const a = (window as any).__a;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const describe = (an: Animation) => {
      const t = an.effect?.getTiming?.();
      const target = (an.effect as KeyframeEffect | undefined)?.target as Element | undefined;
      return {
        kind: an.constructor.name,
        name: (an as any).animationName ?? (an as any).transitionProperty ?? null,
        durationMs: typeof t?.duration === 'number' ? t.duration : String(t?.duration ?? ''),
        delayMs: t?.delay ?? null,
        easing: t?.easing ?? null,
        playState: an.playState,
        target: target ? a.sel(target) : null,
        targetText: target ? a.txt(target as HTMLElement, 44) : null,
      };
    };

    /** Elements worth watching for a computed-value change during the walk. */
    const watched = [
      ...document.querySelectorAll('.reveal, .tg-seq, .shimmer-seg, .status-dot-live, .tg-pin, [data-navlink]'),
    ] as HTMLElement[];
    const snap = () =>
      watched.map((el) => {
        const cs = getComputedStyle(el);
        return { sel: a.sel(el), opacity: cs.opacity, translate: cs.translate, transform: cs.transform };
      });

    const seen: Record<string, any> = {};
    const changes: Record<string, any> = {};
    const steps: any[] = [];

    let prev = snap();
    const docH = document.documentElement.scrollHeight;
    const vh = window.innerHeight;
    const step = Math.max(240, Math.round(vh * 0.45));

    for (let y = 0; y <= docH; y += step) {
      window.scrollTo(0, y);
      await sleep(90);
      const running = document.getAnimations().map(describe);
      for (const r of running) {
        const key = `${r.kind}|${r.name}|${r.target}`;
        if (!seen[key]) seen[key] = { ...r, firstSeenAtScrollY: Math.round(window.scrollY), count: 0 };
        seen[key].count++;
      }
      await sleep(180);
      const now = snap();
      for (let i = 0; i < now.length; i++) {
        const p = prev[i], n = now[i];
        if (!p || !n) continue;
        for (const prop of ['opacity', 'translate', 'transform'] as const) {
          if (p[prop] !== n[prop]) {
            const key = `${n.sel}|${prop}`;
            if (!changes[key]) changes[key] = { selector: n.sel, property: prop, from: p[prop], to: n[prop], atScrollY: Math.round(window.scrollY) };
          }
        }
      }
      prev = now;
      steps.push({ y: Math.round(window.scrollY), animationsRunning: running.length });
    }

    const revealEls = [...document.querySelectorAll('.reveal')] as HTMLElement[];
    return {
      animations: Object.values(seen),
      computedChanges: Object.values(changes),
      steps,
      revealTotal: revealEls.length,
      revealFired: revealEls.filter((e) => e.classList.contains('is-revealed')).length,
      revealStillArmed: revealEls.filter((e) => e.classList.contains('reveal-armed') && !e.classList.contains('is-revealed')).length,
      anyLeftInvisible: revealEls.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).map((e) => ({ sel: a.sel(e), opacity: getComputedStyle(e).opacity })),
    };
  });
}

/**
 * The /process progress fill and readout, sampled at real scroll offsets.
 *
 * The rail is `.tg-pin hidden lg:block`, so it does not render at ANY viewport
 * in the mobile matrix. Resolving docs/archive/HISTORY.md's open question ("does the fill
 * advance with scroll, motion on") therefore has to happen at a >=1024px width;
 * measuring it at 390px would only re-measure `display: none`.
 *
 * The fill is a vertical bar — an absolutely-positioned 2px-wide div whose
 * INLINE `height` is set as a percentage from scroll state. Looking for a width
 * change or a scaleX would find nothing and read as "never advances".
 */
async function processRail(page: Page) {
  await load(page, BASE + '/process');
  return page.evaluate(async () => {
    const a = (window as any).__a;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const pin = document.querySelector('.tg-pin') as HTMLElement | null;
    const railVisible = !!pin && getComputedStyle(pin).display !== 'none';
    const fillEl = pin
      ? ([...pin.querySelectorAll('div')] as HTMLElement[]).find(
          (d) => getComputedStyle(d).position === 'absolute' && parseFloat(getComputedStyle(d).width) <= 3,
        )
      : undefined;
    const stepEls = [...document.querySelectorAll('[data-step], section h3, h3')] as HTMLElement[];

    const samples: any[] = [];
    const docH = document.documentElement.scrollHeight;
    const vh = window.innerHeight;
    for (let y = 0; y <= docH; y += Math.round(vh * 0.4)) {
      window.scrollTo(0, y);
      await sleep(220);
      samples.push({
        scrollY: Math.round(window.scrollY),
        referenceLineY: Math.round(vh * 0.45),
        readout: pin ? (pin.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120) : null,
        fillInlineHeight: fillEl ? fillEl.style.height : null,
        fillRenderedHeightPx: fillEl ? +fillEl.getBoundingClientRect().height.toFixed(1) : null,
        fillTransition: fillEl ? getComputedStyle(fillEl).transitionProperty + ' ' + getComputedStyle(fillEl).transitionDuration : null,
        // The rail prints all four labels at once and marks the active one by
        // style, not by swapping text — so "which step does the rail claim" has
        // to be read off computed colour/opacity, not off textContent.
        railLabels: pin
          ? ([...pin.querySelectorAll('span,div')] as HTMLElement[])
              .filter((el) => /^\s*0[1-4]\s/.test(el.textContent || '') && el.children.length === 0)
              .map((el) => ({
                text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 24),
                opacity: getComputedStyle(el).opacity,
                color: getComputedStyle(el).color,
                fontWeight: getComputedStyle(el).fontWeight,
              }))
          : null,
        // Which step heading is actually under the reference line right now —
        // the readout has to agree with this or the rail is lying.
        headingUnderReferenceLine: (() => {
          const line = vh * 0.45;
          let best: string | null = null;
          for (const h of stepEls) {
            const r = h.getBoundingClientRect();
            if (r.top <= line) best = (h.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
          }
          return best;
        })(),
      });
    }
    return {
      pinPresent: !!pin,
      railVisible,
      pinDisplay: pin ? getComputedStyle(pin).display : null,
      pinPosition: pin ? getComputedStyle(pin).position : null,
      fillSelector: fillEl ? a.sel(fillEl) : null,
      viewport: { w: document.documentElement.clientWidth, h: vh },
      samples,
    };
  });
}

/** The closing-CTA echo — its own sample, since it is scroll-triggered once. */
async function closingEcho(page: Page) {
  await load(page, BASE + '/');
  return page.evaluate(async () => {
    const a = (window as any).__a;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const h2 = [...document.querySelectorAll('h2')].find((h) => (h.textContent || '').includes('Let’s talk about your business')) as HTMLElement | undefined;
    if (!h2) return { present: false };
    const items = [...(h2.closest('div.mx-auto')?.querySelectorAll('.tg-seq') || [])] as HTMLElement[];
    const before = items.map((el) => ({ sel: a.sel(el), opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform }));
    // Land it just below the fold so the in-view trigger has to fire.
    const target = h2.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.95;
    window.scrollTo(0, Math.max(0, target));
    await sleep(150);
    const armed = items.map((el) => ({ sel: a.sel(el), opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform }));
    window.scrollTo(0, Math.max(0, target + window.innerHeight * 0.6));
    const frames: any[] = [];
    for (let i = 0; i < 12; i++) {
      await sleep(70);
      frames.push({
        t: i * 70,
        running: document.getAnimations().length,
        opacities: items.map((el) => getComputedStyle(el).opacity),
        transforms: items.map((el) => getComputedStyle(el).transform),
      });
    }
    return { present: true, itemCount: items.length, before, armed, frames };
  });
}

async function reducedMotionFloor(page: Page, route: string) {
  await load(page, BASE + route);
  return page.evaluate(async () => {
    const a = (window as any).__a;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const docH = document.documentElement.scrollHeight;
    const vh = window.innerHeight;
    let maxRunning = 0;
    const running: any[] = [];
    for (let y = 0; y <= docH; y += Math.round(vh * 0.6)) {
      window.scrollTo(0, y);
      await sleep(160);
      const anims = document.getAnimations();
      if (anims.length > maxRunning) maxRunning = anims.length;
      for (const an of anims) {
        const target = (an.effect as KeyframeEffect | undefined)?.target as Element | undefined;
        running.push({ kind: an.constructor.name, name: (an as any).animationName ?? (an as any).transitionProperty ?? null, target: target ? a.sel(target) : null });
      }
    }
    const hidden = [...document.querySelectorAll<HTMLElement>('.reveal, .tg-seq')].filter(
      (e) => parseFloat(getComputedStyle(e).opacity) < 0.99,
    ).map((e) => ({ sel: a.sel(e), opacity: getComputedStyle(e).opacity }));
    const pin = document.querySelector('.tg-pin');
    const dot = document.querySelector('.status-dot-live') as HTMLElement | null;
    const shimmer = document.querySelector('.shimmer-seg') as HTMLElement | null;

    // The concierge launcher is animated by Motion, not by CSS, and it is not
    // `.tg-seq`, so the reduced-motion block's `!important` pins do not reach
    // it. Sample it over time rather than asserting either way.
    const fab = [...document.querySelectorAll('button')].find((b) =>
      (b.textContent || '').includes('Ask about your project'),
    ) as HTMLElement | undefined;
    const fabSamples: any[] = [];
    if (fab) {
      for (let i = 0; i < 8; i++) {
        const cs = getComputedStyle(fab);
        fabSamples.push({ t: i * 60, opacity: cs.opacity, transform: cs.transform });
        await sleep(60);
      }
    }

    window.scrollTo(0, 0);
    return {
      fabPresent: !!fab,
      fabSamplesUnderReduce: fabSamples,
      fabMovedUnderReduce:
        fabSamples.length > 1 &&
        fabSamples.some((s) => s.opacity !== fabSamples[0].opacity || s.transform !== fabSamples[0].transform),
      prefersReducedMotionMatches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      maxAnimationsRunning: maxRunning,
      runningSample: running.slice(0, 10),
      elementsLeftInvisible: hidden,
      revealTotal: document.querySelectorAll('.reveal').length,
      pinPosition: pin ? getComputedStyle(pin).position : null,
      statusDotOpacity: dot ? getComputedStyle(dot).opacity : null,
      statusDotAnimation: dot ? getComputedStyle(dot).animationName : null,
      shimmerAnimation: shimmer ? getComputedStyle(shimmer).animationName : null,
    };
  });
}

async function phaseMotion(browser: Browser) {
  const out: Record<string, unknown> = {};

  for (const vpLabel of ['standard', 'bp-at'] as const) {
    const vp = VIEWPORTS.find((v) => v.label === vpLabel)!;

    // --- motion ON, via Playwright's own context override -------------------
    const { ctx: on } = await makeContext(browser, { vp, theme: 'light', motion: 'no-preference' });
    const onPage = await on.newPage();
    const onResults: Record<string, unknown> = {};
    onResults['__mediaQuery'] = await onPage.evaluate(() => ({ url: location.href }));
    for (const route of MOTION_ROUTES) {
      try {
        onResults[route] = await animationWalk(onPage, route);
      } catch (e) {
        onResults[route] = { error: String(e) };
      }
      console.log(`motion(no-preference) ${vpLabel} ${route}`);
    }
    onResults['__processRail_atThisViewport'] = await processRail(onPage);
    onResults['__closingEcho'] = await closingEcho(onPage);
    onResults['__mqMatches'] = await onPage.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
    out[`no-preference@${vpLabel}`] = onResults;
    await on.close();

    // --- motion OFF: the accessibility floor at mobile widths ---------------
    const { ctx: off } = await makeContext(browser, { vp, theme: 'light', motion: 'reduce' });
    const offPage = await off.newPage();
    const offResults: Record<string, unknown> = {};
    for (const route of MOTION_ROUTES) {
      try {
        offResults[route] = await reducedMotionFloor(offPage, route);
      } catch (e) {
        offResults[route] = { error: String(e) };
      }
      console.log(`motion(reduce) ${vpLabel} ${route}`);
    }
    out[`reduce@${vpLabel}`] = offResults;
    await off.close();
  }

  // The /process rail is `hidden lg:block`. docs/archive/HISTORY.md's open question about
  // the fill advancing can only be answered above that breakpoint, so it gets
  // its own desktop context with motion on — stated as such in the report
  // rather than filed under a mobile viewport where it renders `display:none`.
  const deskOn = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'no-preference',
    colorScheme: 'light',
  });
  await deskOn.addInitScript(`try { localStorage.setItem('theme','light'); } catch (e) {}`);
  await deskOn.addInitScript(HELPERS);
  const dp = await deskOn.newPage();
  out['__processRail@1280x900-motion-on'] = await processRail(dp);
  out['__closingEcho@1280x900-motion-on'] = await closingEcho(dp);
  await deskOn.close();

  const deskOff = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });
  await deskOff.addInitScript(`try { localStorage.setItem('theme','light'); } catch (e) {}`);
  await deskOff.addInitScript(HELPERS);
  const dpo = await deskOff.newPage();
  out['__processRail@1280x900-motion-reduce'] = await processRail(dpo);
  await deskOff.close();

  // Server-rendered `.reveal` hook count per route, straight off the wire —
  // the denominator for "how many actually fire".
  const rc: Record<string, number> = {};
  for (const route of ROUTES) {
    const res = await fetch(BASE + route);
    const html = await res.text();
    rc[route] = (html.match(/class="[^"]*\breveal\b[^"]*"/g) || []).length;
  }
  out['__serverRenderedRevealHooks'] = rc;

  return out;
}

/* --------------------------------------------- E. tap targets, hit-tested */

/**
 * Phase A's tap-target check reads `getBoundingClientRect`, which is the right
 * measurement for "is the painted box 44px" and the WRONG one for "is the hit
 * area 44px". DESIGN.md §8 expands targets by a pseudo-element overlay
 * precisely so the painted box does NOT change, so a rect-based re-run of
 * phase A after the fix reports every expanded target as still failing.
 *
 * This phase hit-tests instead. For each interactive element it probes the four
 * corners and the centre of the tier box centred on the element, and asks
 * `elementFromPoint` who owns that point. Owned by the element (or a descendant,
 * or its own pseudo) = the tap lands. Owned by a DIFFERENT interactive element =
 * an overlap, which §5 calls a defect in its own right because whichever paints
 * last wins invisibly by source order.
 *
 * Both numbers are emitted: `rectSmall` stays comparable with the 2,707
 * instances M-09 – M-13 recorded, `tierFail` is the one the fix is judged on.
 */
const TAP_PROBE = `
(() => {
  const a = window.__a;

  /* SCOPE. Unset (the normal route sweep) means "every interactive on the
     page". Set to a selector — see the panel-open pass in \`phaseTaps\` — it
     means "only the controls inside this overlay", which is the whole point of
     that pass: the concierge panel's own chips, input, send and close button
     have never been in the site-wide tierFail number because the sweep never
     opened the panel. */
  const scopeSel = window.__tapScope || null;
  const scopeRoot = scopeSel ? document.querySelector(scopeSel) : null;
  if (scopeSel && !scopeRoot) {
    return { scope: scopeSel, error: 'scope root not found — pass did not run', rectSmall: [], tierFail: [], overlaps: [], multiline: [], radiusClipped: [], probed: 0 };
  }

  /* BORDER-RADIUS, and why it gets its own bucket rather than a pass.

     \`elementFromPoint\` honours border-radius. The corner probes sit at
     \`tier/2 - 1\` from the centre — 1px inside each edge of the tier box — and
     for a target whose PAINTED box already equals the tier box, that point
     lands in the clipped arc: 1px in from both edges is 7.07px from the centre
     of a 6px arc, so it is outside the shape and the parent owns it.

     The concierge's 44x44 close button is exactly that case, and it is what
     the panel pass first reported. Counting it as \`tierFail\` next to a
     genuine 40px chip conflates a missing ~1% of corner area with a target a
     finger cannot reliably hit.

     So it is classified, not forgiven — \`radiusClipped\` is emitted and
     printed. The carve-out is deliberately narrow: it applies ONLY when the
     painted box already meets the tier on BOTH axes (so the target is
     genuinely big enough) and the point is outside the element's own rounded
     shape. An undersized target still fails, because its tier box is larger
     than its painted box and the miss is then real distance, not an arc. */
  const cornerRadii = (el) => {
    const cs = getComputedStyle(el);
    const px = (v) => parseFloat(v) || 0;
    return {
      tl: px(cs.borderTopLeftRadius), tr: px(cs.borderTopRightRadius),
      bl: px(cs.borderBottomLeftRadius), br: px(cs.borderBottomRightRadius),
    };
  };
  // Is (x,y) inside the element's rounded rect? Only the four arcs can exclude
  // a point that is already inside the plain rect.
  const insideRounded = (el, r, x, y) => {
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) return false;
    const rad = cornerRadii(el);
    const corners = [
      [r.left + rad.tl, r.top + rad.tl, rad.tl, x < r.left + rad.tl && y < r.top + rad.tl],
      [r.right - rad.tr, r.top + rad.tr, rad.tr, x > r.right - rad.tr && y < r.top + rad.tr],
      [r.left + rad.bl, r.bottom - rad.bl, rad.bl, x < r.left + rad.bl && y > r.bottom - rad.bl],
      [r.right - rad.br, r.bottom - rad.br, rad.br, x > r.right - rad.br && y > r.bottom - rad.br],
    ];
    for (const [ccx, ccy, rr, inCornerBox] of corners) {
      if (rr > 0 && inCornerBox) {
        if ((x - ccx) ** 2 + (y - ccy) ** 2 > rr * rr) return false;
      }
    }
    return true;
  };

  const out = { scope: scopeSel, rectSmall: [], tierFail: [], overlaps: [], multiline: [], radiusClipped: [], probed: 0 };
  const els = scopeRoot
    ? a.interactives().filter((el) => scopeRoot.contains(el))
    : a.interactives();

  // The declared tier wins where one is declared — the probe then checks what
  // the code claims rather than what a heuristic guesses. Undeclared elements
  // fall back to the same prose test phase A uses.
  const tierOf = (el) => {
    if (el.classList.contains('tap-24')) return 24;
    if (el.classList.contains('tap-44')) return 44;
    const cs = getComputedStyle(el);
    const inProse = !!el.closest('p,li') && cs.display.startsWith('inline');
    return inProse ? 24 : 44;
  };

  for (const el of els) {
    // elementFromPoint only hit-tests the VISIBLE viewport, so every below-fold
    // control reads as a miss unless it is scrolled in first. Centre it, then
    // re-read the rect — the first version of this probe skipped the scroll and
    // reported 44x44 footer icons as failures on every route.
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    const t = tierOf(el);
    const rec = {
      selector: a.sel(el),
      text: a.txt(el, 44),
      w: +r.width.toFixed(1),
      h: +r.height.toFixed(1),
      tier: t,
      declared: el.classList.contains('tap-44') ? 'tap-44'
              : el.classList.contains('tap-24') ? 'tap-24' : null,
    };
    if (r.width < 44 || r.height < 44) out.rectSmall.push(rec);

    // An inline link that WRAPS has one client rect per line box, and its
    // bounding rect is their union — whose centre often lands in the gutter
    // between two lines, on no line box at all. Probing that centre measures
    // the gutter, not the link. Where the union already clears the tier on both
    // axes the target is genuinely large (the tap lands on whichever line the
    // finger is over), so it passes and is counted separately.
    const rects = [...el.getClientRects()];
    if (rects.length > 1) {
      if (r.width >= t && r.height >= t) {
        out.multiline.push({ ...rec, lineBoxes: rects.length });
        continue;
      }
    }
    const box = rects.length ? rects.reduce((a2, b) => (b.width * b.height > a2.width * a2.height ? b : a2)) : r;
    const cx = (box.left + box.right) / 2;
    const cy = (box.top + box.bottom) / 2;
    const d = t / 2 - 1;
    const pts = [
      ['c', cx, cy],
      ['tl', cx - d, cy - d],
      ['tr', cx + d, cy - d],
      ['bl', cx - d, cy + d],
      ['br', cx + d, cy + d],
    ];
    const miss = [];
    const clipped = [];
    // Painted box already meets the tier on both axes? Then a corner miss can
    // only be the arc, never distance. Precondition for the radius carve-out.
    const bigEnough = box.width >= t && box.height >= t;
    for (const [name, x, y] of pts) {
      // A probe point outside the viewport cannot be hit-tested and is not a
      // failure of the element — recorded so it is never silently a pass.
      if (x < 0 || y < 0 || x > window.innerWidth || y > document.documentElement.clientHeight) {
        miss.push({ at: name, owner: 'offscreen' });
        continue;
      }
      const hit = document.elementFromPoint(x, y);
      out.probed++;
      // The element itself, one of its descendants, or its own pseudo (which
      // hit-tests as the originating element) all count as the tap landing.
      // An ANCESTOR owning the point does not — that is the tap falling
      // through to the container, which is exactly the failure being measured.
      if (hit && (hit === el || el.contains(hit))) continue;
      // Big enough, and the point is outside the element's own rounded shape:
      // the arc clipped it. Recorded in its own bucket, never silently passed.
      if (bigEnough && hit && hit.contains(el) && !insideRounded(el, box, x, y)) {
        clipped.push({ at: name, owner: a.sel(hit) });
        continue;
      }
      const thief = hit ? hit.closest('a,button,input,select,textarea,summary,[role="button"]') : null;
      // The concierge launcher is fixed and floats over everything. Its
      // overlaps are the recorded, out-of-scope gap from Prompt 10 — counting
      // them as new adjacency defects here would be double-booking.
      const isLauncher = !!thief && (thief.textContent || '').includes('Ask about your project');
      // SAME EXEMPTION, WIDENED — not a second mechanism. An OPEN OVERLAY
      // legitimately covers the page beneath it, exactly as the fixed launcher
      // does. A control inside the overlay taking a point away from a target
      // outside it is the overlay doing its job, not an adjacency defect, and
      // counting it would flood this pass with every link the panel happens to
      // sit over. Overlay-to-overlay theft is NOT exempt — two panel chips
      // stealing from each other is the real defect this pass exists to catch.
      const isOverlay = !!scopeRoot && !!thief && scopeRoot.contains(thief) && !scopeRoot.contains(el);
      const exempt = isLauncher || isOverlay;
      miss.push({ at: name, owner: hit ? a.sel(hit) : null, thiefText: thief ? a.txt(thief, 30) : null, isInteractive: !!thief, isLauncher, isOverlay });
      if (thief && !exempt) out.overlaps.push({ target: rec.selector, targetText: rec.text, at: name, stolenBy: a.sel(thief), stolenByText: a.txt(thief, 30) });
    }
    if (clipped.length) out.radiusClipped.push({ ...rec, radius: cornerRadii(el), clipped });
    if (miss.length) out.tierFail.push({ ...rec, miss });
  }
  return out;
})()
`;

async function phaseTaps(browser: Browser) {
  const results: unknown[] = [];
  const combos: { vp: VP; theme: 'light' | 'dark' }[] = [];
  for (const vp of VIEWPORTS) {
    combos.push({ vp, theme: 'light' });
    if (vp.label === 'narrow' || vp.label === 'standard') combos.push({ vp, theme: 'dark' });
  }

  for (const { vp, theme } of combos) {
    const { ctx, descriptor } = await makeContext(browser, { vp, theme, motion: 'reduce' });
    const page = await ctx.newPage();
    for (const route of ROUTES) {
      try {
        await load(page, BASE + route);
        const r = (await page.evaluate(TAP_PROBE)) as {
          rectSmall: unknown[];
          tierFail: unknown[];
          overlaps: unknown[];
          multiline: unknown[];
          radiusClipped: unknown[];
          probed: number;
        };
        results.push({ route, viewport: vp.label, theme, descriptor, ...r });
        console.log(
          `taps ${vp.label}/${theme} ${route.padEnd(30)} rectSmall=${r.rectSmall.length} tierFail=${r.tierFail.length} overlaps=${r.overlaps.length} multiline=${r.multiline.length} radiusClipped=${r.radiusClipped.length}`,
        );
      } catch (e) {
        results.push({ route, viewport: vp.label, theme, error: String(e) });
        console.log(`taps ${vp.label}/${theme} ${route} FAILED ${e}`);
      }
    }

    /* ------------------------------------------------ concierge panel open
       THE BLIND SPOT THIS PASS CLOSES. Everything above sweeps the page as
       loaded, and the concierge panel is not mounted until the launcher is
       clicked — so the panel's own controls (three suggestion chips, the
       input, send, close) have never been in the site-wide `tierFail=0`
       number. Found 2026-08-12 by hand: the chips were 40px against a 44px
       tier. Real, pre-existing, and invisible to the sweep.

       One route is enough. The panel is a single fixed component rendered
       from the root layout, identical on every route — sweeping all eight
       would multiply runtime for eight copies of one answer. `/contact` is
       the route it was found on and the one where the FAQ suppression
       channel also runs, so it is the least forgiving.

       `__tapScope` restricts the probe to the panel's own subtree. That is
       what keeps this honest in both directions: it does not re-report the
       page's controls (already covered above), and the widened exemption in
       TAP_PROBE stops the open panel from being blamed for covering the page
       beneath it — the same allowance the fixed launcher already had.

       NOTHING in `concierge.tsx` is touched. This drives the component
       through its real launcher click, exactly as a visitor would. */
    try {
      const panelPage = await ctx.newPage();
      await load(panelPage, BASE + '/contact');
      const opened = await panelPage.evaluate(async () => {
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
        // The launcher is deliberately absent above the hero.
        window.scrollTo(0, window.innerHeight * 1.4);
        await sleep(400);
        const fab = [...document.querySelectorAll('button')].find((b) =>
          (b.textContent || '').includes('Ask about your project'),
        ) as HTMLElement | undefined;
        if (!fab) return 'launcher not reachable';
        fab.click();
        await sleep(700);
        return document.querySelector('div[role="dialog"]') ? 'ok' : 'dialog did not mount';
      });

      if (opened !== 'ok') {
        // Never a silent pass. A pass that could not open the panel reports
        // that it did not run, rather than contributing a clean zero.
        results.push({ route: '/contact', viewport: vp.label, theme, pass: 'concierge-panel', ran: false, reason: opened });
        console.log(`taps ${vp.label}/${theme} ${'/contact [panel]'.padEnd(30)} DID NOT RUN — ${opened}`);
      } else {
        await panelPage.evaluate(() => {
          (window as unknown as { __tapScope: string }).__tapScope = 'div[role="dialog"]';
        });
        const r = (await panelPage.evaluate(TAP_PROBE)) as {
          rectSmall: unknown[];
          tierFail: unknown[];
          overlaps: unknown[];
          multiline: unknown[];
          radiusClipped: unknown[];
          probed: number;
          error?: string;
        };
        // A scoped pass that probed nothing is a broken selector, not a clean
        // panel — the same silent-zero failure the classes phase guards.
        const vacuous = !r.error && r.probed === 0;
        results.push({
          route: '/contact', viewport: vp.label, theme, descriptor,
          pass: 'concierge-panel', ran: true, vacuous, ...r,
        });
        console.log(
          `taps ${vp.label}/${theme} ${'/contact [panel]'.padEnd(30)} rectSmall=${r.rectSmall.length} tierFail=${r.tierFail.length} overlaps=${r.overlaps.length} radiusClipped=${r.radiusClipped.length} probed=${r.probed}${vacuous ? '  [VACUOUS — probed nothing]' : ''}`,
        );
      }
      await panelPage.close();
    } catch (e) {
      results.push({ route: '/contact', viewport: vp.label, theme, pass: 'concierge-panel', ran: false, error: String(e) });
      console.log(`taps ${vp.label}/${theme} /contact [panel] FAILED ${e}`);
    }

    await ctx.close();
  }
  return results;
}

/* ------------------------------------------------------ D. production parity */

async function phaseProd(browser: Browser) {
  const rows: unknown[] = [];
  for (const label of ['narrow', 'standard'] as const) {
    const vp = VIEWPORTS.find((v) => v.label === label)!;
    for (const [name, base] of [['local', BASE], ['production', PROD]] as const) {
      const { ctx } = await makeContext(browser, { vp, theme: 'light', motion: 'reduce' });
      const page = await ctx.newPage();
      try {
        await page.goto(base + '/', { waitUntil: 'load', timeout: 45_000 });
        await page.waitForTimeout(600);
        const nav = await measureNav(page);
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.waitForTimeout(600);
        const cta = await measureClosingCta(page);
        const overflow = await page.evaluate(() => {
          const de = document.documentElement;
          return { clientWidth: de.clientWidth, scrollWidth: de.scrollWidth, overflowPx: +(de.scrollWidth - de.clientWidth).toFixed(1) };
        });
        await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.4));
        await page.waitForTimeout(500);
        const fab = await measureFab(page);
        const identity = await page.evaluate(() => ({
          title: document.title,
          generator: (document.querySelector('meta[name="generator"]') as HTMLMetaElement | null)?.content ?? null,
          hasNextData: !!document.querySelector('script#__NEXT_DATA__, script[src*="/_next/"]'),
          stylesheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => (l as HTMLLinkElement).href),
          h1: (document.querySelector('h1')?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120),
        }));
        rows.push({
          source: name, base, viewport: label,
          identity,
          headerHeight: nav.headerHeight,
          navCta: nav.navCta,
          closingCtaButton: (cta as any).button ?? null,
          fab: (fab as any).present ? { rect: (fab as any).rect, computed: (fab as any).computed } : { present: false },
          overflow,
        });
      } catch (e) {
        rows.push({ source: name, base, viewport: label, error: String(e) });
      }
      await ctx.close();
    }
  }
  return rows;
}

/* ------------------------------------------------------------------- shots */

async function phaseShots(browser: Browser) {
  await mkdir(`${OUT}/shots`, { recursive: true });
  const taken: string[] = [];
  for (const label of ['narrow', 'standard'] as const) {
    const vp = VIEWPORTS.find((v) => v.label === label)!;
    for (const theme of ['light', 'dark'] as const) {
      if (theme === 'dark' && label !== 'narrow') continue;
      const { ctx } = await makeContext(browser, { vp, theme, motion: 'reduce' });
      const page = await ctx.newPage();
      for (const route of ROUTES) {
        const name = `${label}-${theme}${route.replace(/\//g, '_') || '_home'}.png`;
        try {
          await load(page, BASE + route);
          await page.screenshot({ path: `${OUT}/shots/${name}`, fullPage: true });
          taken.push(name);
        } catch (e) {
          console.log(`shot ${name} failed: ${e}`);
        }
      }
      await ctx.close();
    }
  }
  return taken;
}

/* -------------------------------------------------------------------- main */

/* ---------------------------------------------------------------- classes
   The launcher-overlap re-partition. Samples each of the four non-CTA classes
   across the scroll range and admits an overlap ONLY where the launcher is
   presented. It emits `Sample`-shaped rows (`scrollY` / `launcherPresented` /
   `coveredFraction`) for `verdictFor` in `lib/overlap-verdict.ts` to consume;
   it does NOT call the rule itself. `scripts/probe-control.ts` is what runs
   the rule, on the D-02 positive control, and it imports the real function
   rather than reimplementing it.

   Selectors are read from source, never guessed:
     meta-rail   `aside a[href]`                        app/work/[slug]/page.tsx:56
     prev/next   `nav[aria-label="More work"] a[href]`  app/work/[slug]/page.tsx:274
     inline      `a.link-underline` minus the three containers above
     footer      `footer.footer-dark a[href]`           components/footer-dark.tsx:65
---------------------------------------------------------------------------- */
const CLASS_SELECTORS = {
  'meta-rail': 'aside a[href]',
  'prev-next': 'nav[aria-label="More work"] a[href]',
  'inline-link-underline': 'a.link-underline',
  footer: 'footer.footer-dark a[href]',
} as const;

async function phaseClasses(browser: Browser) {
  const out: Record<string, unknown>[] = [];

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ ...descriptorFor(vp), colorScheme: 'light' });
    const page = await ctx.newPage();

    for (const route of ROUTES) {
      await load(page, BASE + route);

      const samples = await page.evaluate(async (SEL) => {
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
        const findFab = () =>
          [...document.querySelectorAll('button')].find((b) =>
            (b.textContent || '').includes('Ask about your project'),
          ) || null;
        const presented = (fab: Element) => {
          const cs = getComputedStyle(fab);
          return Number(cs.opacity) > 0.5 && cs.pointerEvents !== 'none';
        };
        const area = (a: DOMRect, b: DOMRect) => {
          const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          return w > 0 && h > 0 ? w * h : 0;
        };
        const inClass = (el: Element, cls: string) => {
          if (cls !== 'inline-link-underline') return el.matches(SEL[cls]);
          // Inline links are link-underline anchors that are NOT in the other
          // three containers, or the classes would double-count.
          return (
            el.matches('a.link-underline') &&
            !el.closest('aside') &&
            !el.closest('nav[aria-label="More work"]') &&
            !el.closest('footer.footer-dark')
          );
        };

        const classes = Object.keys(SEL);
        const byClass: Record<string, { scrollY: number; launcherPresented: boolean; coveredFraction: number }[]> =
          Object.fromEntries(classes.map((c) => [c, []]));
        const counts: Record<string, number> = Object.fromEntries(classes.map((c) => [c, 0]));
        const rawCounts: Record<string, number> = Object.fromEntries(classes.map((c) => [c, 0]));
        /* Distinct elements that EVER overlapped, per class. This is the
           metric comparable with the sweep phase, which dedupes by selector
           and keeps the max — a per-sample count is not. */
        const distinct: Record<string, Set<string>> = Object.fromEntries(classes.map((c) => [c, new Set<string>()]));
        const keyOf = (el: Element) => {
          const a = el as HTMLAnchorElement;
          return (a.getAttribute('href') || '') + '|' + (el.textContent || '').trim().slice(0, 30);
        };

        const docH = document.documentElement.scrollHeight;
        const vh = window.innerHeight;
        const maxScrollY = Math.max(0, docH - vh);

        // Coarse pass, then refine at 100px around any position that produced
        // an admitted overlap. 0.6 x innerHeight is 480px at 360x800 — far too
        // wide to tell "peaks then clears" from "plateau", which is the whole
        // basis of a transient verdict.
        const coarse = Math.max(200, Math.round(vh * 0.6));
        const positions = new Set<number>();
        for (let y = 0; y <= maxScrollY; y += coarse) positions.add(y);
        positions.add(maxScrollY);

        /* CROSS-CHECK, and it is load-bearing rather than diagnostic.
           The class counts above come from `a[href]` + `Element.matches`. This
           second count walks the same INTERACTIVE set the occlusion phase
           walks and attributes each overlapping element by `closest`. Two
           different traversals over the same page must agree. When they did
           not, the class counts silently read 0 and three classes were nearly
           reported clean on the strength of it. Disagreement now fails the
           run rather than producing a number. */
        const INTERACTIVE =
          'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
        const crossCounts: Record<string, number> = Object.fromEntries(classes.map((c) => [c, 0]));
        const classOf = (el: Element) => {
          if (el.closest('footer.footer-dark')) return 'footer';
          if (el.closest('nav[aria-label="More work"]')) return 'prev-next';
          if (el.closest('aside')) return 'meta-rail';
          if (el.matches('a.link-underline')) return 'inline-link-underline';
          return null;
        };

        const sampleAt = async (y: number) => {
          window.scrollTo(0, y);
          await sleep(140);
          const fab = findFab();
          if (!fab) return false;
          const isPresented = presented(fab);
          const fr = fab.getBoundingClientRect();
          let anyAdmitted = false;

          // Cross-check traversal, run at the same scroll position.
          for (const el of document.querySelectorAll(INTERACTIVE)) {
            if (el === fab || fab.contains(el) || el.contains(fab)) continue;
            const cls = classOf(el);
            if (!cls) continue;
            const er = el.getBoundingClientRect();
            if (er.width === 0 || er.height === 0) continue;
            if (area(fr, er) > 0) crossCounts[cls] += 1;
          }

          for (const cls of classes) {
            for (const el of document.querySelectorAll('a[href]')) {
              if (!inClass(el, cls)) continue;
              const er = el.getBoundingClientRect();
              if (er.width === 0 || er.height === 0) continue;
              const a = area(fr, er);
              const frac = a > 0 ? +(a / (er.width * er.height)).toFixed(3) : 0;
              byClass[cls].push({
                scrollY: Math.round(window.scrollY),
                launcherPresented: isPresented,
                coveredFraction: frac,
              });
              // `raw` counts every intersection regardless of the launcher's
              // state, so it is comparable with the cross-check traversal.
              // `counts` is the admitted subset the verdict rule consumes.
              if (frac > 0) {
                rawCounts[cls] += 1;
                distinct[cls].add(keyOf(el));
              }
              if (frac > 0 && isPresented) {
                anyAdmitted = true;
                counts[cls] += 1;
              }
            }
          }
          return anyAdmitted;
        };

        const peaks: number[] = [];
        for (const y of [...positions].sort((a, b) => a - b)) {
          if (await sampleAt(y)) peaks.push(y);
        }
        // Refinement pass at 100px either side of every peak.
        for (const p of peaks) {
          for (let y = Math.max(0, p - coarse); y <= Math.min(maxScrollY, p + coarse); y += 100) {
            await sampleAt(y);
          }
        }

        window.scrollTo(0, 0);
        const mismatches = classes
          .filter((c) => rawCounts[c] !== crossCounts[c])
          .map((c) => ({ cls: c, selectorTraversal: rawCounts[c], interactiveTraversal: crossCounts[c] }));
        const distinctCounts = Object.fromEntries(classes.map((c) => [c, distinct[c].size]));
        return { byClass, counts, rawCounts, crossCounts, mismatches, distinctCounts, maxScrollY, elementCounts: Object.fromEntries(
          classes.map((c) => [c, [...document.querySelectorAll('a[href]')].filter((el) => inClass(el, c)).length]),
        ) };
      }, CLASS_SELECTORS as unknown as Record<string, string>);

      out.push({ route, viewport: vp.label, ...samples });
      const admitted = Object.entries(samples.counts as Record<string, number>)
        .filter(([, n]) => n > 0)
        .map(([c, n]) => `${c}=${n}`)
        .join(' ');
      const mm = (samples.mismatches as { cls: string; selectorTraversal: number; interactiveTraversal: number }[]) ?? [];
      if (mm.length) {
        for (const m of mm) {
          console.log(
            `  !! MISMATCH ${vp.label}/${route} ${m.cls}: selector=${m.selectorTraversal} interactive=${m.interactiveTraversal}`,
          );
        }
      }
      console.log(`classes ${vp.label.padEnd(12)} ${route.padEnd(30)} ${admitted || '-'}${mm.length ? '  [MISMATCH]' : ''}`);
    }
    await ctx.close();
  }

  /* Hard-fail rather than return a number two traversals disagree about. The
     verdict rule is tested and the control passes; the sampling is what has
     been wrong, and a silent 0 from a broken traversal reads exactly like a
     clean class. */
  /* THE GUARD THAT MATTERS: diff this phase's per-class element counts against
     the sweep phase's for the same class. The two phases sample on different
     scroll grids, and a grid that steps over an overlap window produces a
     silent 0 that reads exactly like a clean class — which is what nearly
     happened to meta-rail, prev/next and inline link-underline on 2026-08-11.
     Requires `sweep` to have been run first; says so rather than passing
     vacuously if it has not. */
  try {
    const { readFileSync } = await import('node:fs');
    const sweep = JSON.parse(readFileSync(`${OUT}/sweep.json`, 'utf8')) as {
      route: string;
      viewport: string;
      occlusion: { overlaps: { tgClass: string | null }[] };
    }[];
    const sweepByClass: Record<string, number> = {};
    for (const r of sweep) {
      for (const o of r.occlusion.overlaps) {
        if (!o.tgClass) continue;
        sweepByClass[o.tgClass] = (sweepByClass[o.tgClass] ?? 0) + 1;
      }
    }
    const mineByClass: Record<string, number> = {};
    for (const r of out) {
      const dc = (r.distinctCounts ?? {}) as Record<string, number>;
      for (const [c, n] of Object.entries(dc)) mineByClass[c] = (mineByClass[c] ?? 0) + n;
    }
    const names = [...new Set([...Object.keys(sweepByClass), ...Object.keys(mineByClass)])];
    const disagree = names.filter((c) => (sweepByClass[c] ?? 0) !== (mineByClass[c] ?? 0));
    console.log('');
    console.log('cross-phase check (classes vs sweep), distinct overlapping elements:');
    for (const c of names) {
      const a = mineByClass[c] ?? 0;
      const b = sweepByClass[c] ?? 0;
      console.log(`  ${c.padEnd(24)} classes=${String(a).padStart(4)}  sweep=${String(b).padStart(4)}  ${a === b ? 'ok' : '<-- DISAGREE'}`);
    }
    if (disagree.length) {
      console.log('');
      console.log(`*** CLASSES PHASE FAILED: ${disagree.join(', ')} disagree with the sweep phase.`);
      console.log('*** A zero here is NOT a clean class — it is very likely a scroll grid that');
      console.log('*** stepped over the overlap window. DO NOT read verdicts from classes.json.');
      (globalThis as { process?: { exitCode?: number } }).process!.exitCode = 1;
    }
  } catch {
    console.log('');
    console.log('*** CROSS-PHASE CHECK SKIPPED: .audit/sweep.json not found.');
    console.log('*** Run `sweep` before `classes`, or no class verdict is reportable.');
    (globalThis as { process?: { exitCode?: number } }).process!.exitCode = 1;
  }

  const bad = out.filter((r) => ((r.mismatches as unknown[]) ?? []).length > 0);
  if (bad.length) {
    console.log('');
    console.log(`*** CLASSES PHASE FAILED: ${bad.length} of ${out.length} route/viewport rows disagree`);
    console.log('*** The two traversals must agree before any class verdict is reportable.');
    console.log('*** Wrote .audit/classes.json for diagnosis; DO NOT read verdicts from it.');
    (globalThis as { process?: { exitCode?: number } }).process!.exitCode = 1;
  } else {
    console.log(`classes cross-check OK: ${out.length} rows, both traversals agree`);
  }
  return out;
}

async function main() {
  const phase = process.argv[2] ?? 'all';
  await mkdir(OUT, { recursive: true });

  // Never measure a page whose stylesheet 404s. A stale `next start` holding
  // the port serves HTML referencing chunks that no longer exist, and every
  // number below would be garbage that looks like catastrophic breakage.
  const html = await (await fetch(BASE + '/')).text();
  const href = html.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/)?.[1];
  if (!href) throw new Error('No stylesheet link in served HTML — refusing to measure.');
  const css = await fetch(BASE + href);
  if (css.status !== 200) throw new Error(`Stylesheet ${href} returned ${css.status} — refusing to measure.`);
  const cssText = await css.text();
  const guard = { href, status: css.status, bytes: cssText.length, tgPinRules: (cssText.match(/\.tg-pin/g) || []).length };
  console.log('stylesheet guard:', JSON.stringify(guard));
  await writeFile(`${OUT}/guard.json`, JSON.stringify(guard, null, 2));

  const browser = await chromium.launch();
  const write = (n: string, d: unknown) => writeFile(`${OUT}/${n}.json`, JSON.stringify(d, null, 2));

  if (phase === 'all' || phase === 'sweep') await write('sweep', await phaseSweep(browser));
  if (phase === 'all' || phase === 'surfaces') await write('surfaces', await phaseSurfaces(browser));
  if (phase === 'all' || phase === 'motion') await write('motion', await phaseMotion(browser));
  if (phase === 'all' || phase === 'prod') await write('prod', await phaseProd(browser));
  if (phase === 'all' || phase === 'taps') await write('taps', await phaseTaps(browser));
  if (phase === 'shots') await write('shots', await phaseShots(browser));
  if (phase === 'all' || phase === 'classes') await write('classes', await phaseClasses(browser));

  await browser.close();
  console.log('done:', phase);
}

await main();
