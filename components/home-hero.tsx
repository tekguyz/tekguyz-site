import { HeroSwitch, type HeroBuild } from '@/components/hero-switch';
import { ButtonLink } from '@/components/button';

/**
 * The home hero, Seam form: the ink ground, the headline in lettering, the
 * same copy and the same media as before.
 *
 * `.tg-seam-above` reserves room at the bottom of the ink block: the four lamp
 * fields in the next section pull up over it, so they straddle the seam (top
 * half on ink, bottom half on paper).
 *
 * Since 2026-11-21 the picture is `HeroSwitch`: four builds, picked by button.
 *
 * Text spans cols 1-7, the media cols 7-13; under 1024px the media stacks
 * beneath (`.tg-hero-frame` carries the 56px gap, because `.tg-grid`'s
 * unlayered `gap` eats any `gap-y-*` utility). Nothing here animates: Seam's
 * one moment on this page is the lamp fields rising in. The media's own video
 * loop is the product, not decoration, and still stops under reduced motion.
 */
export function HomeHero({ builds }: { builds: HeroBuild[] }) {
  return (
    <section className="on-ink tg-seam-above overflow-x-clip pt-10 md:pt-20">
      <div data-hero-grid className="tg-container tg-grid items-center">
        <div style={{ gridColumn: '1 / 7' }}>
          <h1 className="lettering text-[clamp(2.75rem,7.4vw,5.75rem)] min-[1024px]:text-[clamp(3rem,6.2vw,5.75rem)]">
            We build the systems your business runs on.
          </h1>

          <p className="text-secondary mt-6 max-w-[46ch] md:mt-8 text-[20px] leading-[1.5]">
            Most businesses don&rsquo;t need more software. They need the right system, built
            correctly.
          </p>

          {/* The concierge launcher yields while this row is on screen (M-15).
              Tagged on the row so the pair yields as one conversion moment.
              Contact leads (#40); the browse link is the outline. */}
          <div data-primary-cta className="mt-8 flex flex-wrap gap-3 md:mt-12">
            <ButtonLink href="/contact">Let&rsquo;s Talk</ButtonLink>
            <ButtonLink href="/work" variant="secondary">
              See Our Work
            </ButtonLink>
          </div>
        </div>

        <div className="[grid-column:7/13] max-lg:[grid-column:1/-1]">
          <HeroSwitch builds={builds} />
        </div>
      </div>
    </section>
  );
}
