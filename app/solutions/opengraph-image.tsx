import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'TEKGUYZ Solutions — four ways we help.';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ eyebrow: 'What We Do', title: 'Four ways we help.' });
}
