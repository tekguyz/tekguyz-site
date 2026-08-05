import { cn } from '@/lib/utils';

/**
 * DESIGN.md §4 — the "How it's built" block.
 *
 * Applies EVERYWHERE the full-length case-study content appears: the standalone
 * /work/[slug] detail pages AND the /work index, which shows the identical
 * content and had the identical empty-space problem.
 *
 * Sits directly beneath the LiveFrame's status line and caption in the media
 * column. Exists specifically to balance the two-column layout — if the media
 * column still reads short with this included, tighten the text column rather
 * than padding the media column to match.
 */
export function BuildNarrative({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('max-w-[60ch]', className)}>
      <h3 className="mb-2 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
        How it&rsquo;s built
      </h3>
      <p className="text-[0.875rem] leading-[1.55] text-secondary">{children}</p>
    </div>
  );
}
