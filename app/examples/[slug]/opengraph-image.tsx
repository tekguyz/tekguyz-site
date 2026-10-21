import { notFound } from 'next/navigation';
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { examples, getExample } from '@/content/examples';
import { SOLUTION_ACCENT } from '@/config/solutions';

export const alt = 'TEKGUYZ example';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return examples.map((e) => ({ slug: e.slug }));
}

/** One link preview per example — tool name, solution line, that line's accent. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getExample(slug);
  if (!entry) notFound();

  return ogCard({
    eyebrow: `${entry.tag} · EXAMPLE`,
    title: entry.name,
    accentKey: SOLUTION_ACCENT[entry.solution],
  });
}
