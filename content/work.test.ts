import { describe, expect, it } from 'vitest';

import { SOLUTION_ACCENT, STRIPE_ORDER } from '@/config/solutions';
import { solutions } from './solutions';
import {
  buildCountWord,
  featured,
  featuredSlugs,
  foldBoard,
  foldSlugs,
  footerSlugs,
  footerWork,
  getWork,
  heroSlug,
  largeSlugs,
  smallSlugs,
  work,
  workLarge,
} from './work';

/**
 * Lineup invariants (#13). Every place that names a build by slug or by name
 * resolves it at render time and silently drops a miss — so a lineup change
 * that leaves a hole ships as a missing card, an empty label, or a wrong count,
 * and nothing in the build notices. These pin what a visitor would see.
 */

describe('work lineup', () => {
  it('every slug is unique', () => {
    const slugs = work.map((w) => w.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every featured slug resolves to a case study', () => {
    for (const slug of featuredSlugs) expect(getWork(slug)?.kind, slug).toBe('case-study');
    expect(featured).toHaveLength(featuredSlugs.length);
  });

  it('every fold slug resolves to an entry', () => {
    for (const slug of foldSlugs) expect(getWork(slug), slug).toBeDefined();
    expect(foldBoard).toHaveLength(foldSlugs.length);
  });

  // Founder, 2026-11-11: four large cards, one per Solution, then the rest.
  it('/work shows every build exactly once, large or small', () => {
    const shown = [...largeSlugs, ...smallSlugs];
    expect(new Set(shown).size).toBe(shown.length);
    expect([...shown].sort()).toEqual(work.map((w) => w.slug).sort());
  });

  it('the large cards are one per Solution, in the founder’s order', () => {
    expect(workLarge.map((w) => w.solution)).toEqual([
      'ai-voice-agents',
      'business-systems',
      'smart-operations',
      'custom-web-apps',
    ]);
  });

  it('every large card has a pull quote', () => {
    for (const w of workLarge) expect(w.pullQuote, w.slug).toBeTruthy();
  });

  it('Home never shows the CRM, and the band never repeats the hero', () => {
    const home = [heroSlug, ...featuredSlugs, ...foldSlugs, ...footerSlugs];
    expect(home).not.toContain('tekguyz-crm');
    expect(featuredSlugs).not.toContain(heroSlug);
    expect(getWork(heroSlug)?.heroPoster).toBeTruthy();
  });

  it('the footer Work column resolves every slug and gives each a short label', () => {
    for (const slug of footerSlugs) expect(getWork(slug), slug).toBeDefined();
    expect(footerWork).toHaveLength(footerSlugs.length);
    for (const w of footerWork) expect(w.shortName, w.slug).toBeTruthy();
  });

  it('the fold board has at most one card per solution line, in stripe order', () => {
    const accents = foldBoard.map((w) => SOLUTION_ACCENT[w.solution]);
    expect(new Set(accents).size).toBe(accents.length);
    const order = accents.map((a) => STRIPE_ORDER.indexOf(a));
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it('the fold board shows four cards, one per line', () => {
    expect(foldBoard).toHaveLength(4);
  });

  it('every solution’s Related work name resolves to an entry', () => {
    const names = new Set(work.map((w) => w.name));
    for (const s of solutions) {
      for (const name of s.relatedWork) expect(names.has(name), `${s.slug}: ${name}`).toBe(true);
    }
  });

  it('never names a client brand or an app brand in visible copy or metadata', () => {
    const banned = /meet4weed|reporter resource/i;
    for (const w of work) {
      const text = Object.entries(w)
        .filter(([key]) => key !== 'url')
        .map(([, value]) => String(value))
        .join('\n');
      expect(text, w.slug).not.toMatch(banned);
    }
  });

  it('the build count word matches the entry count', () => {
    expect(buildCountWord).toBe('10');
    expect(work).toHaveLength(10);
  });
});
