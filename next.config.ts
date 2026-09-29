import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Poster images are local .webp assets; no remote patterns are needed.
  images: {
    formats: ['image/webp'],
  },
  /**
   * Retired /work slugs (#13). Google still lists some of them, so each one
   * sends a permanent 308 to what replaced it, and never a 404. The two meeting
   * builds were earlier versions of `ai-meeting-notes`; the rest go to the index.
   * `next.config.test.ts` pins these, and fails if one shadows a live page.
   */
  async redirects() {
    return [
      { source: '/work/meeting-organizer', destination: '/work/ai-meeting-notes', permanent: true },
      { source: '/work/ai-audio-file-insights', destination: '/work/ai-meeting-notes', permanent: true },
      { source: '/work/restaurant-menu', destination: '/work', permanent: true },
      { source: '/work/auto-detailer', destination: '/work', permanent: true },
      { source: '/work/bundle-builder', destination: '/work', permanent: true },
    ];
  },
};

export default nextConfig;
