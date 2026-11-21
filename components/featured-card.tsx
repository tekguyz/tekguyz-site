import { getImageProps } from 'next/image';
import Link from 'next/link';
import { ButtonLink } from '@/components/button';
import { Frame } from '@/components/live-frame';
import { SolutionTag } from '@/components/solution-tag';
import type { WorkEntry } from '@/content/work';

/**
 * The /work featured card (#91, founder 2026-11-20): six of them, two across.
 *
 * It replaced the full-width alternating rows, whose pictures ran about 370px
 * tall at 1440 ("far too big on desktop and phones"). Here the picture sits
 * beside its words, still 16:10: two fifths of the card in the one-column
 * band (640-1023), half of it from 1024 in the two-column grid, so it lands
 * near 175px tall at 1440 and never shrinks as the screen grows past 1024.
 *
 * Phones stack it, picture first, capped at 136px: `cover` with a top anchor
 * trims the bottom of the capture, which keeps the app's own header and first
 * rows, the readable part (live-frame.tsx).
 *
 * No outer box: the picture already carries the frame's 2px line, and a box
 * around it would be a frame in a frame. The grid's gaps separate the cards.
 *
 * The picture links to the full story too, but out of the tab order and hidden
 * from screen readers, so the name stays the one link a keyboard meets for it.
 *
 * Hover to enlarge (founder, 2026-11-21): the card shows a close-up crop
 * (`cardPoster`), so on a mouse screen hovering it opens the full desktop
 * capture at twice the picture's width, anchored top-left. Twice the picture
 * is never wider than the card at any band (2/5 → 4/5 below 1024, 1/2 → 1/1
 * from 1024), so it never leaves the card or the screen. Flat like every
 * frame: a 2px ink line, no shadow. A build with no close-up shows its desktop
 * capture already, so it gets no enlarge.
 */
export function FeaturedCard({ entry }: { entry: WorkEntry }) {
  const name = entry.shortName ?? entry.name;
  const story = `/work/${entry.slug}`;

  return (
    <article className="grid h-full grid-cols-1 content-start gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6 lg:grid-cols-2">
      <Link href={story} tabIndex={-1} aria-hidden className="tg-feature-pic relative block self-start">
        <Frame poster={entry.cardPoster ?? entry.poster} alt="" sizes="(max-width: 639px) 100vw, (max-width: 1023px) 40vw, 300px" />
        {/* Hover to enlarge (2026-11-21): the full desktop screen at twice the
            picture's width, over the card. Mouse screens only; phones never
            download it. CSS only: `.tg-feature-pop` in globals.css. */}
        {entry.cardPoster ? <EnlargedPicture poster={entry.poster} /> : null}
      </Link>

      <div className="min-w-0">
        {/* No Live mark here since 2026-11-21: the founder found one on each
            of six cards bulky. The build's own page and the home hero keep it. */}
        <SolutionTag solution={entry.solution} label={entry.tag} />
        <h3 className="mt-2 text-[20px] leading-[1.15]">
          <Link href={story} className="tap-44 link-underline">
            {name}
          </Link>
        </h3>
        <p
          className="mt-1.5 text-[15px] leading-[1.45] text-secondary"
          style={{ textWrap: 'pretty' }}
        >
          {entry.headline}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
          <ButtonLink
            href={entry.url}
            size="card"
            className="tap-44"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open the ${name} demo in a new tab`}
          >
            Open the demo
          </ButtonLink>
          <Link
            href={story}
            aria-label={`${name}: the full story`}
            className="tap-44 text-[14px] font-bold underline decoration-2 underline-offset-[5px]"
          >
            Full story
          </Link>
        </div>
      </div>
    </article>
  );
}

/** An empty 1x1 GIF: what every screen without a mouse gets instead. */
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const MOUSE = '(hover: hover) and (pointer: fine)';

/**
 * The hover-to-enlarge picture. A `<picture>` whose only real source carries
 * the mouse media query, so the browser fetches the big capture on mouse
 * screens only. `display: none` alone did not stop it: a phone downloaded all
 * five at 1920px wide (measured 2026-11-21). Lazy, so a laptop fetches each one
 * as its card nears the screen, not on page load.
 */
function EnlargedPicture({ poster }: { poster: string }) {
  const { props } = getImageProps({ src: poster, alt: '', fill: true, sizes: '640px' });
  return (
    <span className="tg-feature-pop">
      <picture>
        <source media={MOUSE} srcSet={props.srcSet} sizes={props.sizes} />
        <img
          src={BLANK}
          alt=""
          loading="lazy"
          decoding="async"
          style={props.style}
          className="object-cover object-top"
        />
      </picture>
    </span>
  );
}
