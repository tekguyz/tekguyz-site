import Link from 'next/link';
import { ButtonLink } from '@/components/button';

export const metadata = { title: 'TEKGUYZ | Page Not Found', robots: { index: false } };

export default function NotFound() {
  return (
    <section className="tg-section">
      <div className="tg-container">
        <h1 className="max-w-[18ch] text-[length:var(--text-display)] leading-[1.05] font-bold tracking-[-0.03em]">
          This page doesn&rsquo;t exist.
        </h1>
        <p className="mt-6 max-w-[52ch] text-[length:var(--text-body)] text-secondary">
          The link might be old, or it might be a typo. Head back to the homepage, or{' '}
          <Link href="/work" className="link-underline text-fg">
            see our work
          </Link>
          .
        </p>
        <ButtonLink href="/" className="mt-9">
          Back to Home
        </ButtonLink>
      </div>
    </section>
  );
}
