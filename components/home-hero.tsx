'use client';

import { Frame } from '@/components/live-frame';
import { StatusLine } from '@/components/status-line';
import { ButtonLink } from '@/components/button';
import { SequenceRoot, SequenceItem, SequenceDots } from '@/components/load-sequence';
import type { StatusResult } from '@/lib/status';

/**
 * The asymmetric hero.
 *
 * Text spans cols 1-7. The media column is a SURFACE-FILLED PANEL — not a bare
 * image — that bleeds off the right viewport edge:
 *
 *   margin-right: calc(-1 * max(0px, (100vw - 1216px) / 2) - 10vw)
 *   background surface · 1px hairline with NO right border
 *   border-radius 16px 0 0 16px · padding 32px 0 32px 32px
 *
 * so the panel visibly runs off the page rather than sitting politely inset.
 * Inside it: a 16:9 poster (its own ratio, distinct from the 16:10 used
 * everywhere else) that also drops its right border and right radius, then the
 * status line, the demo link, and the hourly-check note.
 *
 * The earlier "empty space around the hero image" complaint was a ratio
 * mismatch inside the image container, not this panel — `aspect-ratio:16/9`
 * with `object-fit:cover` is what fixes it, and the panel is real design.
 *
 * Under 1024px the bleed is abandoned rather than squeezed: the panel gets its
 * right border and full radius back and the media stacks below the text.
 *
 * Media is a static poster. The looped sarah-demo.mp4 still shows the retired
 * phone-call simulator and must not ship.
 */
export function HomeHero({
  poster,
  url,
  alt,
  status,
}: {
  poster: string;
  url: string;
  alt: string;
  status: StatusResult;
}) {
  return (
    <section className="overflow-x-clip pt-24 pb-32">
      <SequenceRoot trigger="load">
        <div data-hero-grid className="tg-container tg-grid items-center gap-y-14">
          <div style={{ gridColumn: '1 / 7' }}>
            <SequenceDots className="mb-9" />

            <SequenceItem role="headline">
              <h1
                className="text-[length:var(--text-hero)] leading-[0.95] font-bold tracking-[-0.045em]"
                style={{ textWrap: 'pretty' }}
              >
                We build tech that actually works for your business.
              </h1>
            </SequenceItem>

            <SequenceItem role="subhead">
              <p
                className="mt-8 max-w-[52ch] text-[length:var(--text-body)] text-secondary"
                style={{ textWrap: 'pretty' }}
              >
                Most businesses don&rsquo;t need more software. They need the right system, built
                correctly, by people who actually understand how they work. That&rsquo;s what we do.
              </p>
            </SequenceItem>

            <SequenceItem role="cta">
              {/* The concierge launcher yields while this row is on screen
                  (M-15). Tagged on the row, not the two buttons, so the
                  launcher yields to the pair as one conversion moment. */}
              <div data-primary-cta className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/work">See Our Work</ButtonLink>
                <ButtonLink href="/contact" variant="secondary" size="nav">
                  Let&rsquo;s Talk
                </ButtonLink>
              </div>
              <StatusLine result={status} className="mt-10" />
            </SequenceItem>
          </div>

          <SequenceItem role="media" className="[grid-column:7/13] max-lg:[grid-column:1/-1]">
            <div data-hero-frame className="tg-hero-frame">
              <div data-hero-poster className="tg-hero-poster">
                <Frame poster={poster} alt={alt} ratio="16/9" priority className="tg-hero-img" />
              </div>
              <div className="flex max-w-[52ch] flex-col gap-[14px]">
                <StatusLine result={status} />
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline self-start text-[14.5px] font-semibold"
                >
                  Open it in a new tab
                </a>
                <p className="text-[0.875rem] leading-[1.55] text-secondary italic">
                  We check every demo hourly. This is the real status, not a badge.
                </p>
              </div>
            </div>
          </SequenceItem>
        </div>
      </SequenceRoot>
    </section>
  );
}
