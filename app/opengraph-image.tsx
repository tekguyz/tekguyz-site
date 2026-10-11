import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'TEKGUYZ — We build tech that actually works for your business.';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: 'AI Help for Small Businesses',
    title: 'We build tech that actually works for your business.',
  });
}
