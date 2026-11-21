import { describe, expect, it } from 'vitest';

import { solutions } from './solutions';
import {
  buildCountWord,
  featured,
  featuredSlugs,
  footerSlugs,
  footerWork,
  getWork,
  heroSlugs,
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

  // Founder, 2026-11-11: four large cards, one per Solution, then the rest.
  it('/work shows every build exactly once, large or small', () => {
    const shown = [...largeSlugs, ...smallSlugs];
    expect(new Set(shown).size).toBe(shown.length);
    expect([...shown].sort()).toEqual(work.map((w) => w.slug).sort());
  });

  // #91 (2026-11-20): six featured cards. The first four lead their Solution,
  // one each, in the founder's order; then Coffee Brand & Shop and Field
  // Photo Reports.
  it('the featured cards lead with one per Solution, in the founder’s order', () => {
    expect(workLarge).toHaveLength(6);
    expect(workLarge.slice(0, 4).map((w) => w.solution)).toEqual([
      'ai-voice-agents',
      'business-systems',
      'smart-operations',
      'custom-web-apps',
    ]);
    expect(workLarge.slice(4).map((w) => w.slug)).toEqual(['coffee-brand-shop', 'field-photo-reports']);
  });

  it('the Private Meetup App stays off this site', () => {
    expect(getWork('private-meetup-app')).toBeUndefined();
  });

  // #80: cards carry one line, so every build needs a short name that fits a
  // one-line row at 375px, and a headline to be that line.
  it('every build has a short name and a headline for its card', () => {
    for (const w of work) {
      expect(w.shortName, w.slug).toBeTruthy();
      expect(w.shortName!.length, w.slug).toBeLessThanOrEqual(22);
      expect(w.headline, w.slug).toBeTruthy();
    }
  });

  it('Home shows no build twice', () => {
    const home = [...heroSlugs, ...featuredSlugs];
    expect(new Set(home).size).toBe(home.length);
  });

  it('Home never shows the CRM, and every hero build has a 16:9 hero picture', () => {
    const home = [...heroSlugs, ...featuredSlugs, ...footerSlugs];
    expect(home).not.toContain('tekguyz-crm');
    expect(heroSlugs).toHaveLength(4);
    for (const slug of heroSlugs) expect(getWork(slug)?.heroPoster, slug).toBeTruthy();
  });

  it('the footer Work column resolves every slug and gives each a short label', () => {
    for (const slug of footerSlugs) expect(getWork(slug), slug).toBeDefined();
    expect(footerWork).toHaveLength(footerSlugs.length);
    for (const w of footerWork) expect(w.shortName, w.slug).toBeTruthy();
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
    expect(buildCountWord).toBe('13');
    expect(work).toHaveLength(13);
  });
});
