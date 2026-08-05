import { notFound } from 'next/navigation';
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { solutions, getSolution } from '@/content/solutions';
import { SOLUTION_ACCENT } from '@/config/solutions';

export const alt = 'TEKGUYZ solution line';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  return ogCard({
    eyebrow: solution.tag,
    title: solution.headline,
    accentKey: SOLUTION_ACCENT[solution.slug],
  });
}
