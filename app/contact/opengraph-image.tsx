import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = "TEKGUYZ — Let's talk about your business.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ eyebrow: 'Get In Touch', title: "Let's talk about your business." });
}
