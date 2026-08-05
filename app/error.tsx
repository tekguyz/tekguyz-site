'use client';

import { useEffect } from 'react';
import { Button } from '@/components/button';
import { site } from '@/lib/site';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="tg-section">
      <div className="tg-container">
        <h1 className="max-w-[18ch] text-[length:var(--text-display)] leading-[1.05] font-bold tracking-[-0.03em]">
          Something broke on our end.
        </h1>
        <p className="mt-6 max-w-[52ch] text-[length:var(--text-body)] text-secondary">
          Not yours — ours. Refresh, and if it keeps happening, tell us at{' '}
          <a href={`mailto:${site.publicEmail}`} className="link-underline text-fg">
            {site.publicEmail}
          </a>
          .
        </p>
        <Button onClick={reset} className="mt-9">
          Refresh Page
        </Button>
      </div>
    </section>
  );
}
