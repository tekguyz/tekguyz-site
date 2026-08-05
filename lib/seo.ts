import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { solutions } from '@/content/solutions';
import { faq } from '@/content/faq';
import { testimonial } from '@/content/process';
import { work } from '@/content/work';

/**
 * docs/SEO.md — all structured data. Titles and descriptions live in COPY.md and
 * are passed in; they are deliberately NOT duplicated here. An earlier version
 * duplicated them across both files and they drifted out of sync within one pass.
 */

/**
 * Every route's metadata goes through this so no route can ship title and
 * description only. Full openGraph + twitter + explicit canonical, every time.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  type = 'website',
}: {
  title: string;
  description: string;
  /** Route path with a leading slash, e.g. "/work/bundle-builder". "" for home. */
  path: string;
  /** Defaults to the route's own opengraph-image if one exists. */
  ogImage?: string;
  type?: 'website' | 'article';
}): Metadata {
  const url = `${site.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: 'en_US',
      type,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

type Json = Record<string, unknown>;

/**
 * THE BreadcrumbList helper. SEO.md is explicit that this is emitted through one
 * shared helper and never hand-repeated per page.
 *
 * Home -> [Page] for top-level routes; Home -> Work -> [Build] for detail pages.
 */
export function breadcrumbs(trail: { name: string; path: string }[]): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '' }, ...trail].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function professionalService(): Json {
  return {
    '@type': 'ProfessionalService',
    '@id': `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    email: site.publicEmail,
    description:
      'TEKGUYZ builds custom software systems, AI assistants, and automated workflows that solve real operational problems for businesses.',
    areaServed: ['South Florida', 'United States'],
    sameAs: [
      site.social.linkedin,
      site.social.instagram,
      site.social.facebook,
      site.social.github,
    ],
    makesOffer: solutions.map((s) => ({
      '@type': 'Offer',
      itemOffered: serviceNode(s.name, s.serviceDescription),
    })),
  };
}

export function serviceNode(serviceType: string, description: string): Json {
  return {
    '@type': 'Service',
    serviceType,
    description,
    provider: { '@type': 'Organization', name: site.name },
    areaServed: ['South Florida', 'United States'],
  };
}

/** SEO.md: no reviewRating — there is no numeric score attached. Do not invent one. */
export function reviewNode(): Json {
  return {
    '@type': 'Review',
    reviewBody: testimonial.body,
    author: { '@type': 'Person', name: testimonial.author },
    itemReviewed: { '@type': 'Organization', name: site.name },
  };
}

/** Answer text is verbatim from COPY.md — never a paraphrased second version. */
export function faqNode(): Json {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function softwareApplicationNode(entry: {
  name: string;
  url: string;
  description: string;
}): Json {
  return {
    '@type': 'SoftwareApplication',
    name: entry.name,
    applicationCategory: 'BusinessApplication',
    // The same field driving the LiveFrame link and the status check.
    url: entry.url,
    description: entry.description,
    creator: { '@type': 'Organization', name: site.name },
  };
}

export function workItemList(): Json {
  return {
    '@type': 'ItemList',
    itemListElement: work.map((w, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: w.name,
      url: `${site.url}/work/${w.slug}`,
    })),
  };
}

export function solutionsItemList(): Json {
  return {
    '@type': 'ItemList',
    itemListElement: solutions.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.name,
      url: `${site.url}/solutions/${s.slug}`,
    })),
  };
}

/** Wraps any set of nodes into one @graph script tag payload. */
export function jsonLd(...nodes: Json[]) {
  return {
    __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }),
  };
}
