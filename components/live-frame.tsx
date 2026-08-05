import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * DESIGN.md §4 — the deferred-embed container.
 *
 * Two locked ratios, context-dependent:
 *   hero    -> 16:9  (matches 1600x900 screen captures; the poster bleeds
 *                     directly with NO background frame and NO padding around
 *                     it — the reference render's visible gutter is a bug)
 *   compact -> 16:10 (case-study rows, project detail pages), no exceptions
 *
 * object-fit: cover in both cases. Compact posters are currently 4:3/near-square
 * and will crop hard in a 16:10 frame; that is known, accepted, and gets fixed
 * by recapturing the assets — not by loosening the ratio or adding per-image
 * object-position compensation.
 *
 * embeddable is false for every entry at launch. Flipping it to true requires
 * `frame-ancestors https://tekguyz.com` on the demo app first, and produces the
 * click-to-activate iframe in the same frame at the same dimensions — zero
 * layout change. Mobile stays poster + link regardless of the flag.
 *
 * No fake browser chrome: the real product's own UI is what makes it credible.
 */
export function LiveFrame({
  poster,
  url,
  alt,
  ratio = 'compact',
  priority = false,
  viewTransitionName,
  className,
}: {
  poster: string;
  url: string;
  alt: string;
  ratio?: 'hero' | 'compact';
  priority?: boolean;
  viewTransitionName?: string;
  className?: string;
}) {
  const isHero = ratio === 'hero';

  return (
    <figure className={cn('m-0', className)}>
      <div
        className={cn(
          'relative w-full overflow-hidden bg-canvas',
          // The hero bleeds directly with no border/frame; compact contexts get
          // the 1px hairline + 12px radius described in DESIGN.md.
          isHero ? 'rounded-[12px]' : 'rounded-[12px] border border-border',
        )}
        style={{
          aspectRatio: isHero ? '16 / 9' : '16 / 10',
          ...(viewTransitionName ? { viewTransitionName } : {}),
        }}
      >
        <Image
          src={poster}
          alt={alt}
          fill
          priority={priority}
          sizes={isHero ? '(max-width: 1023px) 100vw, 60vw' : '(max-width: 1023px) 100vw, 50vw'}
          className="object-cover"
        />
      </div>

      <figcaption className="mt-3">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline inline-flex text-[0.875rem] text-secondary hover:text-fg focus-visible:text-fg"
        >
          Open it in a new tab
          <span aria-hidden className="ml-1">
            ↗
          </span>
        </a>
      </figcaption>
    </figure>
  );
}
