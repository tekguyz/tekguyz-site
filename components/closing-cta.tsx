'use client';

import { SignatureStripe } from '@/components/signature-stripe';
import { ButtonLink } from '@/components/button';
import { SequenceRoot, SequenceItem } from '@/components/load-sequence';
import { openConcierge } from '@/components/concierge/concierge-bus';

/**
 * DESIGN.md §4 — centered, the ONE section permitted to be.
 *
 * Deliberately more compact than a standard section, not equal to one:
 * ~64px / 48px mobile. NOT the 128px section rhythm — that leak has happened
 * twice already.
 *
 * button-primary--large (18x32, ~16px text) is the site's one documented size
 * exception. The earlier "still doesn't work" complaint was the button being
 * underweighted against the headline, not the padding, which was already right.
 *
 * Beneath it, one quiet text link to the concierge — a lower-commitment path,
 * not a competing CTA. This is the only second entry point the concierge gets.
 *
 * On scroll into view this replays the hero's load sequence once. Per DESIGN.md's
 * "one flourish-mark per page, home only" rule, it replays the sequence's timing
 * without adding a second set of dots.
 *
 * No proof line — it duplicated the homepage proof strip and read as filler.
 */
export function ClosingCta() {
  return (
    <>
      <SignatureStripe />
      <section className="px-[var(--container-pad)] py-12 md:py-16">
        <SequenceRoot trigger="inView" className="mx-auto max-w-[760px] text-center">
          <SequenceItem role="headline">
            <h2 className="text-[length:var(--text-display)] leading-[1.05] font-bold tracking-[-0.03em]">
              Let&rsquo;s talk about your business.
            </h2>
          </SequenceItem>

          <SequenceItem role="subhead">
            <p className="mx-auto mt-5 max-w-[52ch] text-[length:var(--text-body)] text-secondary">
              Tell us what you&rsquo;re working with and what you&rsquo;re trying to fix.
              We&rsquo;ll take it from there.
            </p>
            <p className="mt-4 text-[0.875rem] text-secondary">
              Free first conversation · A flat quote before anything starts · We reply within one
              business day
            </p>
          </SequenceItem>

          <SequenceItem role="cta">
            <div className="mt-9 flex flex-col items-center gap-4">
              <ButtonLink href="/contact" size="large">
                Let&rsquo;s Talk
              </ButtonLink>
              <button
                type="button"
                onClick={openConcierge}
                className="link-underline text-[0.875rem] text-secondary hover:text-fg"
              >
                Or ask our AI what we&rsquo;d build for you
              </button>
            </div>
          </SequenceItem>
        </SequenceRoot>
      </section>
    </>
  );
}
