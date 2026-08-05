import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Poster images are local .webp assets; no remote patterns are needed.
  images: {
    formats: ['image/webp'],
  },
};

export default nextConfig;
