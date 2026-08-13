import Image, { getImageProps } from 'next/image';
import { StatusLine } from '@/components/status-line';
import type { StatusResult } from '@/lib/status';
import { cn } from '@/lib/utils';

/**
 * The deferred-embed container. DESIGN.md §4, `LiveFrame` → "the container".
 *
 * Export values: native `aspect-ratio` (16/10 in every compact context, 16/9 in
 * the hero) with `overflow:hidden`, a 1px hairline and 12px radius. The image is
 * `object-fit:cover` with `object-position:top center` — a dashboard screenshot
 * cropped from the bottom keeps its header and primary content, which is the
 * readable part.
 *
 * PADDING IS ZERO AND STAYS ZERO. `aspect-ratio` governs the OUTER box, so any
 * padding is subtracted from the media: the frame keeps its 16:10 and the
 * screenshot inside it quietly stops being 16:10. It also produces the mat of
 * dead space that made this read as chrome around an asset rather than the
 * asset. `cover` crops and can never letterbox, so space around the media is
 * always the container's, never the capture's.
 *
 * The fill is `--tg-surface`, not a literal white. Under `cover` it is never
 * visible once the poster paints — it is a loading/failure state, not a design
 * surface, and its only job is to avoid punching a white rectangle into a dark
 * page while the image decodes. Inside `.ink-band` the same token already
 * resolves to #1A1A1C, so no branch is needed.
 *
 * The hero's `tg-hero-frame` is a different thing on purpose: a surface panel
 * with 32px padding that bleeds off the viewport edge. Don't port it down.
 *
 * This is a real `aspect-ratio` property, not a padding-top percentage hack.
 *
 * embeddable is false for every entry at launch. Flipping it to true requires
 * `frame-ancestors https://tekguyz.com` on the demo app first and produces the
 * click-to-activate iframe in the same frame at the same dimensions, so there
 * is zero layout change. Mobile stays poster + link regardless of the flag.
 *
 * No fake browser chrome — the real product's own UI is what makes it credible.
 *
 * ART DIRECTION (`posterMobile`, optional, off for every compact context).
 * `object-position` cannot crop here: source and frame are both the same ratio,
 * so there is no overflow to shift, and `cover` only ever crops the axis that
 * overflows. A genuinely different crop below 1024px therefore needs a second
 * file — and `next/image` has no art-direction prop, by design. The documented
 * answer is `getImageProps` feeding a `<picture>`: the browser evaluates
 * `media` and fetches ONE variant, where two `<Image>`s toggled by `hidden`
 * would download both on the LCP path. Absent the prop this renders the plain
 * `<Image>` it always did, byte for byte.
 */
const SIZES = '(max-width: 1023px) 100vw, 55vw';

export function Frame({
  poster,
  posterMobile,
  alt,
  ratio = '16/10',
  priority = false,
  onInk = false,
  viewTransitionName,
  className,
}: {
  poster: string;
  /** Optional <1024px crop of the same capture. See the note above. */
  posterMobile?: string;
  alt: string;
  ratio?: '16/10' | '16/9';
  priority?: boolean;
  onInk?: boolean;
  viewTransitionName?: string;
  className?: string;
}) {
  const common = { alt, fill: true, sizes: SIZES, priority } as const;
  // One alt, one crop of one capture: the two variants are the same picture, so
  // a second alt string would describe the same thing twice and read out twice.
  const { srcSet: wide } = getImageProps({ ...common, src: poster }).props;
  const { srcSet: narrow, ...fallback } = getImageProps({
    ...common,
    src: posterMobile ?? poster,
  }).props;

  return (
    <div
      className={cn('relative w-full overflow-hidden rounded-[12px] border p-0', className)}
      style={{
        aspectRatio: ratio,
        background: 'var(--tg-surface)',
        borderColor: onInk ? '#2A2A2C' : 'var(--tg-border)',
        ...(viewTransitionName ? { viewTransitionName } : {}),
      }}
    >
      {posterMobile ? (
        <picture>
          <source media="(min-width: 1024px)" srcSet={wide} sizes={SIZES} />
          <source srcSet={narrow} sizes={SIZES} />
          {/* Not an unoptimized <img>: every attribute here comes from
              getImageProps, so this is next/image's own output with a
              <picture> wrapped around it to carry the media query. */}
          <img {...fallback} className="object-cover object-top" alt={alt} />
        </picture>
      ) : (
        <Image
          src={poster}
          alt={alt}
          fill
          priority={priority}
          sizes={SIZES}
          className="object-cover object-top"
        />
      )}
    </div>
  );
}

/**
 * The caption beneath a frame — DESIGN.md §4. BENEATH, never inside: an overlay
 * would cover the real product's own header, which is the part that makes the
 * poster credible, and is the same lie as drawing fake browser chrome.
 *
 * 12px below the frame, not 18px. 12 reads as belonging to the frame above; 18
 * reads as the next block starting.
 *
 * Left-anchored, 20px apart, NOT `justify-between`. On an 803px detail-page
 * frame `space-between` threw "Live · checked 4 minutes ago" and "Open it in a
 * new tab" to opposite corners — two labels in two places instead of one
 * caption saying "this is running, go look". No mid-dot between them either:
 * `status-line` already owns a `·` internally, and a second dot device at a
 * second weight inside one caption line is noise.
 *
 * `flex-wrap` so they stack rather than crush on narrow columns.
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
    <div className={cn('mt-3 flex flex-wrap items-center gap-x-5 gap-y-3', className)}>
      <StatusLine result={status} onInk={onInk} />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        data-uline
        className="tap-44 link-underline text-[14.5px] font-semibold"
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
