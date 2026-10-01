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
  work,
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

  // The owner's order, 2026-10-01: the four builds with a one-click demo lead.
  it('the work list leads with the four demo builds, in the owner’s order', () => {
    expect(work.slice(0, 4).map((w) => w.slug)).toEqual([...footerSlugs]);
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

  // Pass 2 of #13 fills the teal slot with the meetup app: four lines, four cards.
  it('the fold board shows four cards, all case studies', () => {
    expect(foldBoard).toHaveLength(4);
    for (const w of foldBoard) expect(w.kind, w.slug).toBe('case-study');
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
    expect(buildCountWord).toBe('six');
    expect(work).toHaveLength(6);
  });
});
