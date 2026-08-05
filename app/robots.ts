import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The concierge endpoint is a POST API — nothing to crawl, and keeping it
      // out avoids pointless hits against a rate-limited, model-backed route.
      disallow: ['/api/'],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
