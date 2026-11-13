import { HeroMedia } from '@/components/hero-media';
import type { HeroMedia as HeroMediaData } from '@/content/work';
import { StatusLine } from '@/components/status-line';
import { ButtonLink } from '@/components/button';
import type { StatusResult } from '@/lib/status';

/**
 * The home hero, Seam form: the ink ground, the headline in lettering, the
 * same copy and the same media as before.
 *
 * `.tg-seam-above` reserves room at the bottom of the ink block: the four lamp
 * fields in the next section pull up over it, so they straddle the seam (top
 * half on ink, bottom half on paper).
 *
 * Text spans cols 1-7, the media cols 7-13; under 1024px the media stacks
 * beneath (`.tg-hero-frame` carries the 56px gap, because `.tg-grid`'s
 * unlayered `gap` eats any `gap-y-*` utility). Nothing here animates: Seam's
 * one moment on this page is the lamp fields rising in. The media's own video
 * loop is the product, not decoration, and still stops under reduced motion.
 */
export function HomeHero({
  poster,
  posterMobile,
  url,
  alt,
  media,
  status,
}: {
  poster: string;
  posterMobile?: string;
  url: string;
  alt: string;
  /** Optional video loop and phone capture layered on the poster. */
  media?: HeroMediaData;
  status: StatusResult;
}) {
  return (
    <section className="on-ink tg-seam-above overflow-x-clip pt-14 md:pt-20">
      <div data-hero-grid className="tg-container tg-grid items-center">
        <div style={{ gridColumn: '1 / 7' }}>
          <h1 className="lettering text-[clamp(2.75rem,7.4vw,5.75rem)] min-[1024px]:text-[clamp(3rem,6.2vw,5.75rem)]">
            We build the systems your business runs on.
          </h1>

          <p className="text-secondary mt-8 max-w-[46ch] text-[20px] leading-[1.5]">
            Most businesses don&rsquo;t need more software. They need the right system, built
            correctly.
          </p>

          {/* The concierge launcher yields while this row is on screen (M-15).
              Tagged on the row so the pair yields as one conversion moment.
              Contact leads (#40); the browse link is the outline. */}
          <div data-primary-cta className="mt-10 flex flex-wrap gap-3 md:mt-12">
            <ButtonLink href="/contact">Start a Free Conversation</ButtonLink>
            <ButtonLink href="/work" variant="secondary">
              See Our Work
            </ButtonLink>
          </div>
        </div>

        <div className="[grid-column:7/13] max-lg:[grid-column:1/-1]">
          <div data-hero-frame className="tg-hero-frame">
            <div data-hero-poster>
              <HeroMedia poster={poster} posterMobile={posterMobile} alt={alt} media={media} />
            </div>
            <div className="flex max-w-[52ch] flex-col gap-[14px]">
              <StatusLine result={status} />
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-44 link-underline self-start text-[16px] font-bold"
              >
                Open it in a new tab
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
