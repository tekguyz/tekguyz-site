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
