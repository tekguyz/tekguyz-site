'use client';

import { useState } from 'react';
import { Frame } from '@/components/live-frame';
import { StatusLine } from '@/components/status-line';
import { accentForSolution, type SolutionSlug } from '@/config/solutions';
import type { StatusResult } from '@/lib/status';

export interface HeroBuild {
  slug: string;
  name: string;
  solution: SolutionSlug;
  url: string;
  poster: string;
  status: StatusResult;
}

/**
 * The home hero's picture (founder, 2026-11-21): the four builds that lead
 * their Solution, one button each, and the picture shows the one picked. The
 * first shows on load and is the LCP image; the others load only when picked.
 *
 * Nothing switches on its own: Seam allows one moment per page, and a picture
 * that changes while someone reads it is the thing being avoided. The picked
 * button carries the site's one state primitive, `.tg-rule` drawn in full
 * (`data-drawn`), and `aria-pressed` says the same to a screen reader. Each
 * button's dot is its Solution's lamp, a lamp as a dot, never as text.
 *
 * The pictures are the top of each app's own feed picture at 16:9, not its
 * desktop capture: a 1440px desktop screen shrunk into this column left its
 * text about 5px tall, the reason Missed Call Follow-Up's hero was replaced.
 */
export function HeroSwitch({ builds }: { builds: HeroBuild[] }) {
  const [picked, setPicked] = useState(0);
  const build = builds[picked]!;

  return (
    <div data-hero-frame className="tg-hero-frame">
      <div role="group" aria-label="Pick a build to see" className="flex flex-wrap gap-x-5 gap-y-1">
        {builds.map((b, i) => (
          <button
            key={b.slug}
            type="button"
            aria-pressed={i === picked}
            data-drawn={i === picked}
            onClick={() => setPicked(i)}
            className="tg-rule tap-44 inline-flex items-center gap-2 py-1.5 text-[14px] font-bold leading-none whitespace-nowrap"
            style={{ color: i === picked ? 'var(--tg-fg)' : 'var(--tg-secondary)' }}
          >
            <span
              aria-hidden
              className="h-2 w-2 flex-none rounded-full"
              style={{ background: accentForSolution(b.solution).dot }}
            />
            {b.name}
          </button>
        ))}
      </div>

      <div data-hero-poster>
        <Frame
          key={build.slug}
          poster={build.poster}
          alt={`A close-up of the ${build.name} demo`}
          ratio="16/9"
          priority={picked === 0}
          sizes="(max-width: 1023px) 100vw, 640px"
          className="tg-hero-img"
        />
      </div>

      <div className="flex max-w-[52ch] flex-col gap-[14px]">
        <StatusLine result={build.status} />
        <a
          href={build.url}
          target="_blank"
          rel="noopener noreferrer"
          className="tap-44 link-underline self-start text-[16px] font-bold"
        >
          Open {build.name} in a new tab
        </a>
      </div>
    </div>
  );
}
