import Link from 'next/link';
import { testimonial } from '@/content/process';
import { site } from '@/lib/site';

/**
 * Deliberately NOT the pull-quote.
 *
 * The pull-quote is our own claim, on canvas, with an accent rule. This is
 * someone else's words — so it sits on an ink card, carries real quotation
 * marks, and ends in verifiable attribution plus a cross-link to the build
 * being described.
 *
 * Export values: ink card, 16px radius, 72px/64px padding. A 72px Geist quote
 * glyph on the hairline sits above the quote at 0.6 line-height. Attribution
 * row is separated by 56px + a 32px-padded hairline rule and wraps.
 *
 * IT CARRIES `.ink-band`, and that is what makes the colours readable rather
 * than a coincidence. This is a permanently-dark card sitting on a canvas page
 * in light mode, so it is the one shape that CANNOT just read `--tg-fg` — the
 * page root resolves that to #101010, invisible on the card. It used to solve
 * that with four literal hexes; the scope root already solves it for the home
 * band, and its ink is the same #111111 this card was hardcoding, so it now
 * consumes that instead of re-deriving it. `.ink-band` is unlayered and paints
 * the background itself, which is why the `bg-*` utility is gone too.
 *
 * Marked up as Review schema — no reviewRating, since no numeric score exists.
 */
export function Testimonial({ contextSlug }: { contextSlug: string }) {
  return (
    <div
      className="ink-band rounded-[16px]"
      style={{ padding: 'var(--pad-container)' }}
    >
      {/* The glyph clamps WITH the quote instead of against it. 72px beside a
          24px quote is a desktop ratio shipped to a phone — at 360px it was
          the single largest thing in the component and it is decoration. The
          ceiling is unchanged at 72px, so nothing about the desktop
          composition moves. */}
      <span
        aria-hidden
        className="text-border mb-1.5 block text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.6] font-bold sm:mb-3"
      >
        &ldquo;
      </span>

      <blockquote
        /* The 34ch cap STAYS, and releasing it on mobile was tried and
           measured as wrong: at 360px the card's content box is 264px, so the
           cap is not binding and removing it changes nothing; the width where
           it would start to matter is ~700px, where releasing it hands the
           quote a 650px measure. It is a reading-measure decision, not a
           desktop artefact. */
        className="text-fg max-w-[34ch] text-[clamp(1.3125rem,2.6vw,2.125rem)] leading-[1.26] font-semibold tracking-[-0.025em] sm:leading-[1.22]"
        style={{ textWrap: 'pretty' }}
      >
        {testimonial.body}
      </blockquote>

      {/* This row used to be `flex flex-wrap justify-between gap-8` carrying
          four items, which is not a mobile layout — it is a desktop layout
          coming apart. At 360px all four wrapped to their own line with a 32px
          gap between each, so the attribution alone was ~200px of a ~500px
          component.

          It is now an explicit two-mode layout: a deliberate stack below the
          container break, the original single row above it. The stack is
          declared, so its gaps are chosen (`--gap-group` between the two
          groups, 10px inside them) rather than inherited from whatever the
          wrap happened to do. */}
      <div
        className="border-border flex flex-col gap-6 border-t pt-5 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-8 sm:pt-8"
        style={{ marginTop: 'var(--gap-group)' }}
      >
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 sm:gap-4">
          <span className="text-fg text-[1rem] font-semibold sm:text-[1.0625rem]">
            {testimonial.author}
          </span>
          <span className="text-secondary text-[0.8125rem] sm:text-[0.875rem]">
            {testimonial.source}
          </span>
        </div>
        {/* Pulled out of the name group: it is an action, and it was competing
            for the same wrap decisions as two labels.

            THE STACK GAP IS 24px BECAUSE OF `tap-44`, not because 24 looked
            right. Both links carry a 44px hit overlay centred on a ~21px
            painted box, so they need ≥44px centre-to-centre or the overlays
            intersect and source order silently decides which one a tap lands
            on — the footer's 22px column gap exists for exactly this reason.
            At 24px the closest pair measures ~45px apart. Any future change to
            this gap or to either link's size has to be re-checked with
            `bun run scripts/audit-mobile.ts taps`, which hit-tests rather than
            measuring rects. */}
        <a
          href={site.gbp}
          target="_blank"
          rel="noopener noreferrer"
          className="tap-44 link-underline text-fg self-start text-[14px] font-semibold sm:text-[14.5px]"
        >
          Read it on Google →
        </a>
        <Link
          href={`/work/${contextSlug}`}
          className="tap-44 link-underline text-secondary self-start text-[0.8125rem] sm:text-[0.875rem]"
        >
          This is the work he&rsquo;s describing →
        </Link>
      </div>
    </div>
  );
}
