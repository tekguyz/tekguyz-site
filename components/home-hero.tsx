'use client';

import { LiveFrame } from '@/components/live-frame';
import { StatusLine } from '@/components/status-line';
import { ButtonLink } from '@/components/button';
import { SequenceRoot, SequenceItem, SequenceDots } from '@/components/load-sequence';
import type { StatusResult } from '@/lib/status';

/**
 * DESIGN.md §0 #4 and §3 — the asymmetric hero.
 *
 * Text spans cols 1-6. Media spans cols 7-12 and BLEEDS PAST the right viewport
 * edge: the media container extends beyond the 1280px container cap, so the
 * poster is genuinely cut off by the viewport rather than politely inset.
 *
 * The hero LiveFrame is 16:9 (its own ratio, distinct from the 16:10 used
 * everywhere else) and the image bleeds directly — no background frame, no
 * padding wrapper around it. The reference render shows a gutter there; that's
 * the ratio-mismatch bug, not the spec.
 *
 * Media is a static poster. The looped sarah-demo.mp4 still shows the retired
 * phone-call simulator and must not ship as-is (CANONICAL §1).
 *
 * Runs the load sequence once on mount, never re-triggering.
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
    <section className="overflow-x-clip pt-20 pb-28 md:pt-24 md:pb-32">
      <SequenceRoot trigger="load">
        <div
          className="tg-container tg-grid items-center gap-y-14"
          style={
            {
              // Distance from the container's right edge out to the viewport
              // edge, plus 80px so the frame is visibly cut off rather than
              // merely flush.
              '--bleed':
                'calc((100vw - min(100vw - 2 * var(--container-pad), 1280px)) / 2 + 80px)',
            } as React.CSSProperties
          }
        >
          <div style={{ gridColumn: '1 / 7' }}>
            <SequenceDots className="mb-7" />

            <SequenceItem role="headline">
              <h1 className="max-w-[16ch] text-[length:var(--text-hero)] leading-[0.95] font-bold tracking-[-0.045em]">
                We build tech that actually works for your business.
              </h1>
            </SequenceItem>

            <SequenceItem role="subhead">
              <p className="mt-7 max-w-[54ch] text-[length:var(--text-body)] text-secondary">
                Most businesses don&rsquo;t need more software. They need the right system, built
                correctly, by people who actually understand how they work. That&rsquo;s what we do.
              </p>
            </SequenceItem>

            <SequenceItem role="cta">
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <ButtonLink href="/work">See Our Work</ButtonLink>
                <ButtonLink href="/contact" variant="secondary">
                  Let&rsquo;s Talk
                </ButtonLink>
              </div>
            </SequenceItem>
          </div>

          <SequenceItem
            role="media"
            className="[grid-column:7/13] max-lg:[grid-column:1/-1] max-lg:!mr-0"
          >
            <div className="mr-[calc(-1*var(--bleed))] max-lg:mr-0">
              <LiveFrame poster={poster} url={url} alt={alt} ratio="hero" priority />
              <StatusLine result={status} className="mt-4" />
            </div>
          </SequenceItem>
        </div>
      </SequenceRoot>
    </section>
  );
}
