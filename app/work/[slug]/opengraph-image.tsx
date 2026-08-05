import { notFound } from 'next/navigation';
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { work, getWork } from '@/content/work';
import { SOLUTION_ACCENT } from '@/config/solutions';

export const alt = 'TEKGUYZ build';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

/** Eight distinct link previews — build name, solution line, that line's accent. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getWork(slug);
  if (!entry) notFound();

  return ogCard({
    eyebrow: entry.tag,
    title: entry.name,
    accentKey: SOLUTION_ACCENT[entry.solution],
  });
}
