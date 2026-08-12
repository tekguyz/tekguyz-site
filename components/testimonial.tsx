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
 * Export values: #111111 card, 16px radius, 72px/64px padding. A 72px Geist
 * quote glyph at #2A2A2C sits above the quote at 0.6 line-height. Attribution
 * row is separated by 56px + a 32px-padded #2A2A2C rule and wraps.
 *
 * Marked up as Review schema — no reviewRating, since no numeric score exists.
 */
export function Testimonial({ contextSlug }: { contextSlug: string }) {
  return (
    <div
      className="rounded-[16px] bg-[#111111]"
      style={{ padding: 'var(--pad-container)' }}
    >
      {/* The glyph clamps WITH the quote instead of against it. 72px beside a
          24px quote is a desktop ratio shipped to a phone — at 360px it was
          the single largest thing in the component and it is decoration. The
          ceiling is unchanged at 72px, so nothing about the desktop
          composition moves. */}
      <span
        aria-hidden
        className="mb-1.5 block text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.6] font-bold text-[#2A2A2C] sm:mb-3"
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
        className="max-w-[34ch] text-[clamp(1.3125rem,2.6vw,2.125rem)] leading-[1.26] font-semibold tracking-[-0.025em] text-[#F5F5F5] sm:leading-[1.22]"
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
        className="flex flex-col gap-6 border-t border-[#2A2A2C] pt-5 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-8 sm:pt-8"
        style={{ marginTop: 'var(--gap-group)' }}
      >
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 sm:gap-4">
          <span className="text-[1rem] font-semibold text-[#F5F5F5] sm:text-[1.0625rem]">
            {testimonial.author}
          </span>
          <span className="text-[0.8125rem] text-[#9CA3AF] sm:text-[0.875rem]">
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
          className="tap-44 link-underline self-start text-[14px] font-semibold text-[#F5F5F5] sm:text-[14.5px]"
        >
          Read it on Google →
        </a>
        <Link
          href={`/work/${contextSlug}`}
          className="tap-44 link-underline self-start text-[0.8125rem] text-[#9CA3AF] sm:text-[0.875rem]"
        >
          This is the work he&rsquo;s describing →
        </Link>
      </div>
    </div>
  );
}
