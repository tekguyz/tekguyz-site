import Image from 'next/image';
import { StatusLine } from '@/components/status-line';
import type { StatusResult } from '@/lib/status';
import { cn } from '@/lib/utils';

/**
 * The deferred-embed container.
 *
 * Export values: native `aspect-ratio` (16/10 in every compact context, 16/9 in
 * the hero) with `overflow:hidden`, a white fill, a 1px hairline and 12px
 * radius. The image is `object-fit:cover` with `object-position:top center` —
 * a dashboard screenshot cropped from the bottom keeps its header and primary
 * content, which is the readable part.
 *
 * This is a real `aspect-ratio` property, not a padding-top percentage hack.
 *
 * embeddable is false for every entry at launch. Flipping it to true requires
 * `frame-ancestors https://tekguyz.com` on the demo app first and produces the
 * click-to-activate iframe in the same frame at the same dimensions, so there
 * is zero layout change. Mobile stays poster + link regardless of the flag.
 *
 * No fake browser chrome — the real product's own UI is what makes it credible.
 */
export function Frame({
  poster,
  alt,
  ratio = '16/10',
  priority = false,
  onInk = false,
  viewTransitionName,
  className,
}: {
  poster: string;
  alt: string;
  ratio?: '16/10' | '16/9';
  priority?: boolean;
  onInk?: boolean;
  viewTransitionName?: string;
  className?: string;
}) {
  return (
    <div
      className={cn('relative w-full overflow-hidden rounded-[12px] border', className)}
      style={{
        aspectRatio: ratio,
        background: '#FFFFFF',
        borderColor: onInk ? '#2A2A2C' : 'var(--tg-border)',
        ...(viewTransitionName ? { viewTransitionName } : {}),
      }}
    >
      <Image
        src={poster}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1023px) 100vw, 55vw"
        className="object-cover object-top"
      />
    </div>
  );
}

/**
 * The row beneath a frame: status on the left, the demo link on the right.
 * Export puts these on one `space-between` row with 18px of separation from the
 * frame and `flex-wrap` so they stack rather than crush on narrow columns.
 */
export function FrameMeta({
  status,
  url,
  onInk = false,
  className,
}: {
  status: StatusResult;
  url: string;
  onInk?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('mt-[18px] flex flex-wrap items-center justify-between gap-6', className)}>
      <StatusLine result={status} onInk={onInk} />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        data-uline
        className="link-underline text-[14.5px] font-semibold"
        style={{ color: onInk ? '#F5F5F5' : 'var(--tg-fg)' }}
      >
        Open it in a new tab
      </a>
    </div>
  );
}

/** The "How it's built" block — hairline-separated, capped at 60ch. */
export function BuildNarrative({
  children,
  onInk = false,
  className,
  maxWidth = '60ch',
}: {
  children: React.ReactNode;
  onInk?: boolean;
  className?: string;
  maxWidth?: string;
}) {
  return (
    <div
      className={cn('mt-7 border-t pt-6', className)}
      style={{ maxWidth, borderTopColor: onInk ? '#2A2A2C' : 'var(--tg-border)' }}
    >
      <p
        className="mb-[10px] text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] uppercase"
        style={{ color: onInk ? '#9CA3AF' : 'var(--tg-secondary)' }}
      >
        How it&rsquo;s built
      </p>
      <p
        className="text-[0.875rem] leading-[1.55]"
        style={{ color: onInk ? '#9CA3AF' : 'var(--tg-secondary)' }}
      >
        {children}
      </p>
    </div>
  );
}
