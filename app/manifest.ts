import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TEKGUYZ',
    short_name: 'TEKGUYZ',
    description:
      'We build tech that actually works for your business. Smart operations, AI voice agents, and custom web apps.',
    start_url: '/',
    display: 'standalone',
    // Light is the default every new visitor sees, so the install surface matches.
    background_color: '#0B0B0C',
    theme_color: '#0B0B0C',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
