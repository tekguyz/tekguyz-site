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
    <div className="rounded-[16px] bg-[#111111] px-8 py-14 sm:px-16 sm:py-18">
      <span
        aria-hidden
        className="mb-3 block text-[72px] leading-[0.6] font-bold text-[#2A2A2C]"
      >
        &ldquo;
      </span>

      <blockquote
        className="max-w-[34ch] text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.22] font-semibold tracking-[-0.025em] text-[#F5F5F5]"
        style={{ textWrap: 'pretty' }}
      >
        {testimonial.body}
      </blockquote>

      <div className="mt-14 flex flex-wrap items-baseline justify-between gap-8 border-t border-[#2A2A2C] pt-8">
        <div className="flex flex-wrap items-baseline gap-4">
          <span className="text-[1.0625rem] font-semibold text-[#F5F5F5]">
            {testimonial.author}
          </span>
          <span className="text-[0.875rem] text-[#9CA3AF]">{testimonial.source}</span>
          <a
            href={site.gbp}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-[14.5px] font-semibold text-[#F5F5F5]"
          >
            Read it on Google →
          </a>
        </div>
        <Link
          href={`/work/${contextSlug}`}
          className="link-underline text-[0.875rem] text-[#9CA3AF]"
        >
          This is the work he&rsquo;s describing →
        </Link>
      </div>
    </div>
  );
}
