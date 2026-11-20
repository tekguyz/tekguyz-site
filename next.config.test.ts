import { describe, expect, it } from 'vitest';

import { work } from '@/content/work';
import nextConfig from './next.config';

/**
 * Retired /work URLs (#13). Google still lists some of them, so each one must
 * answer a permanent 308 to the page that replaced it, never a 404.
 */

const EXPECTED: Record<string, string> = {
  '/work/meeting-organizer': '/work/ai-meeting-notes',
  '/work/ai-audio-file-insights': '/work/ai-meeting-notes',
  '/work/restaurant-menu': '/work',
  '/work/auto-detailer': '/work',
  '/work/bundle-builder': '/work',
  // `/work/team-performance` redirected from 2026-11-12 (#76) until the
  // rebuilt demo took the slug back on 2026-11-20 (#91): never redirect a live
  // build's page.
  // #80: the /solutions index went to Home's four Solution blocks.
  '/solutions': '/#solutions',
};

describe('redirects', async () => {
  const redirects = (await nextConfig.redirects?.()) ?? [];

  it('sends every retired slug to its replacement, permanently', () => {
    for (const [source, destination] of Object.entries(EXPECTED)) {
      const r = redirects.find((x) => x.source === source);
      expect(r, source).toMatchObject({ destination, permanent: true });
    }
  });

  it('never redirects away from a live detail page', () => {
    const live = new Set(work.map((w) => `/work/${w.slug}`));
    for (const r of redirects) expect(live.has(r.source), r.source).toBe(false);
  });
});
