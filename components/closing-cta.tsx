'use client';

import { SignatureStripe } from '@/components/signature-stripe';
import { ButtonLink } from '@/components/button';
import { openConcierge } from '@/components/concierge/concierge-bus';
import { SequenceRoot, SequenceItem } from '@/components/load-sequence';

/**
 * Centered — the one section permitted to be.
 *
 * Export values: max-width 760px, padding 64px 32px 48px. Deliberately more
 * compact than a standard 128px section; that spacing leak has happened twice.
 *
 * The subhead and the trust line are TWO SEPARATE ELEMENTS. The trust row is
 * its own flex-wrap row with 3px muted-soft dot separators, so it reflows to
 * multiple lines on narrow viewports instead of becoming an unreadable run-on.
 * Merging them into one paragraph was a mistake in an earlier pass.
 *
 * The button is the site's ONE documented size exception: 18px 32px, 16px text.
 * Beneath it, one quiet text link to the concierge — a lower-commitment path,
 * not a competing CTA, and the concierge's only second entry point.
 *
 * On scroll into view this replays the hero's load sequence once.
 */
export function ClosingCta() {
  return (
    <section>
      <SignatureStripe />
      <SequenceRoot trigger="inView">
        <div className="mx-auto max-w-[760px] px-8 pt-16 pb-12 text-center">
          <SequenceItem role="headline">
            <h2 className="text-[length:var(--text-display)] leading-[1.05] font-bold tracking-[-0.03em]">
              Let&rsquo;s talk about your business.
            </h2>
          </SequenceItem>

          <SequenceItem role="subhead">
            <p
              className="mx-auto mt-6 max-w-[48ch] text-[length:var(--text-body)] text-secondary"
              style={{ textWrap: 'pretty' }}
            >
              Tell us what you&rsquo;re working with and what you&rsquo;re trying to fix.
              We&rsquo;ll take it from there.
            </p>
          </SequenceItem>

          {/* Its own element, not merged into the subhead. */}
          <SequenceItem role="trust">
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-[22px] gap-y-[10px] text-[0.875rem] leading-[1.55] text-secondary">
              <span>Free first conversation</span>
              <Dot />
              <span>A flat quote before anything starts</span>
              <Dot />
              <span>We reply within one business day</span>
            </div>
          </SequenceItem>

          <SequenceItem role="cta">
            <div className="mt-9 flex flex-col items-center gap-[18px]">
              <ButtonLink href="/contact" size="large">
                Let&rsquo;s Talk
              </ButtonLink>
              <button
                type="button"
                onClick={openConcierge}
                className="link-underline cursor-pointer text-[0.875rem] leading-[1.55] text-secondary"
              >
                Or ask our AI what we&rsquo;d build for you
              </button>
            </div>
          </SequenceItem>
        </div>
      </SequenceRoot>
    </section>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      className="h-[3px] w-[3px] flex-none rounded-full"
      style={{ background: 'var(--tg-muted-soft)' }}
    />
  );
}
