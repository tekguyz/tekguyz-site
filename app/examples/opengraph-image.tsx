import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'TEKGUYZ Examples — a closer look at what we build.';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ eyebrow: 'Examples', title: 'A closer look at what we build.' });
}
