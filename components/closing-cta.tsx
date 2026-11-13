'use client';

import { ButtonLink } from '@/components/button';
import { openConcierge } from '@/components/concierge/concierge-bus';

/**
 * The closing band, Seam form: the ink ground, the headline in lettering, one
 * sentence, ONE button. It sits directly on the ink footer, so the page closes
 * the way it opened.
 *
 * "Ask our AI" is kept as a text link rather than a second button: Seam's
 * close band has one button, and the concierge is still one tap away here
 * (and from the launcher everywhere).
 *
 * `.tg-closing` is the hook for the "gap counted once" rule in globals.css.
 */
export function ClosingCta() {
  return (
    <section className="tg-closing on-ink">
      <div className="tg-container grid gap-10 py-20 md:py-28 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-16">
        <h2 className="text-[clamp(2.5rem,6vw,4.75rem)]">Let&rsquo;s talk about your business.</h2>
        <div>
          <p className="text-secondary mb-8 max-w-[40ch] text-[20px] leading-[1.5]">
            Tell us what you&rsquo;re working with and what you&rsquo;re trying to fix. We&rsquo;ll
            take it from there.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href="/contact" size="large" data-primary-cta>
              Let&rsquo;s Talk
            </ButtonLink>
            <button
              type="button"
              onClick={openConcierge}
              className="tap-44 text-fg cursor-pointer text-[17px] font-bold underline decoration-2 underline-offset-[6px]"
            >
              Ask our AI
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
