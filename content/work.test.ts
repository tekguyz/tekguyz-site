import { describe, expect, it } from 'vitest';

import { SOLUTION_ACCENT, STRIPE_ORDER } from '@/config/solutions';
import { solutions } from './solutions';
import { buildCountWord, featured, featuredSlugs, foldBoard, foldSlugs, getWork, work } from './work';

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

  it('the fold board has at most one card per solution line, in stripe order', () => {
    const accents = foldBoard.map((w) => SOLUTION_ACCENT[w.solution]);
    expect(new Set(accents).size).toBe(accents.length);
    const order = accents.map((a) => STRIPE_ORDER.indexOf(a));
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  // Pass 1 of #13 empties the teal slot; pass 2 fills it with the meetup app.
  it('the fold board shows three cards', () => {
    expect(foldBoard).toHaveLength(3);
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
    expect(buildCountWord).toBe('five');
    expect(work).toHaveLength(5);
  });
});
