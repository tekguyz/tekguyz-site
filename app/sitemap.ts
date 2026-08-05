import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { solutions } from '@/content/solutions';
import { getWork } from '@/content/work';
import { generateStaticParams as workParams } from '@/app/work/[slug]/page';

/**
 * SEO.md — lastModified comes from each content entry's real updatedAt field,
 * not request-time new Date(). Request-time is valid but a weak freshness
 * signal: every route claims to have changed on every crawl, so none of them
 * mean anything.
 *
 * The 8 work-detail entries are driven by generateStaticParams rather than a
 * second hand-written slug list, so the sitemap can't drift from the routes
 * that actually exist.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Static routes have no natural content date; request-time is the documented
  // lesser fallback for these, and the content-driven routes are the priority.
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/solutions`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/work`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/process`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${site.url}/privacy`, lastModified: new Date('2026-07-13'), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const solutionRoutes: MetadataRoute.Sitemap = solutions.map((s) => ({
    url: `${site.url}/solutions/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const workRoutes: MetadataRoute.Sitemap = workParams().map(({ slug }) => {
    const entry = getWork(slug);
    return {
      url: `${site.url}/work/${slug}`,
      lastModified: new Date(entry!.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    };
  });

  return [...staticRoutes, ...solutionRoutes, ...workRoutes];
}
