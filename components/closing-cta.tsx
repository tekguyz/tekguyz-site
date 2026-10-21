'use client';

import { SignatureStripe } from '@/components/signature-stripe';
import { Button, ButtonLink } from '@/components/button';
import { ConnectedNodes } from '@/components/logo-lockup';
import { openConcierge } from '@/components/concierge/concierge-bus';
import { SequenceRoot, SequenceItem } from '@/components/load-sequence';

/**
 * The closing band — a split, not a centered stack. [decided 2026-10-21, the
 * owner's pick of three drawn options, refs #55]
 *
 * It was the site's one centered section and read as bulky: five centered
 * elements, ~530px tall at 1440, the ask arriving last under a grey run of
 * small text. Now the statement sits left on the site's own `tg-container`
 * edge and the ask sits right, so the eye reads claim -> ask in one sweep and
 * the band is ~40% shorter. Below 1024px the two halves stack, left-aligned.
 *
 * THE BAND HAS A GROUND — `--tg-surface`, full-bleed, in `globals.css`
 * (`.tg-closing`). The stripe above is its lid; the dark footer is its floor.
 *
 * The subhead is `fg`, not `secondary`. Grey body copy on the grey ground was
 * the readability complaint; the size step to the headline is the hierarchy.
 *
 * Two asks, one weight apart. "Let's Talk" stays the ink primary and keeps
 * `data-primary-cta` (the launcher's yield target, M-15). The concierge entry
 * was a muted `link-underline` that drew nothing at rest; it is now the
 * secondary button, lifted onto `bg` so its edge reads on the surface ground
 * in both themes. Ink stays the only fill — no accent fills a button.
 *
 * The three facts stay: they answer "what does it cost me to ask" right where
 * the ask is. Desktop and tablet stack them under the buttons, the same
 * dot-free stack the facts already took below 767px (M-04: a wrapped dot row
 * ends lines on a separator). Muted, no colour, no bullets.
 *
 * On scroll into view this replays the hero's load sequence once.
 */
export function ClosingCta() {
  return (
    <section className="tg-closing">
      <SignatureStripe />
      <SequenceRoot trigger="inView">
        <div className="tg-container grid gap-8 py-11 md:py-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div>
            <SequenceItem role="headline">
              <h2
                className="text-[length:clamp(2rem,3.4vw,3rem)] leading-[1.08] font-bold tracking-[-0.025em]"
                style={{ textWrap: 'balance' }}
              >
                Let&rsquo;s talk about your business.
              </h2>
            </SequenceItem>

            <SequenceItem role="subhead">
              <p
                className="mt-4 max-w-[46ch] text-[length:var(--text-body)] leading-[1.55]"
                style={{ textWrap: 'pretty' }}
              >
                Tell us what you&rsquo;re working with and what you&rsquo;re trying to fix.
                We&rsquo;ll take it from there.
              </p>
            </SequenceItem>
          </div>

          <div className="lg:border-l lg:border-border lg:pl-12">
            <SequenceItem role="cta">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {/* `data-primary-cta` is the concierge launcher's yield-rule
                    target (M-15). Exactly two elements carry it site-wide: this
                    button and the home hero's CTA row. */}
                <ButtonLink href="/contact" size="large" data-primary-cta>
                  Let&rsquo;s Talk
                </ButtonLink>
                <Button
                  type="button"
                  variant="secondary"
                  size="large"
                  onClick={openConcierge}
                  className="border-border-strong bg-bg hover:border-fg"
                >
                  <ConnectedNodes size={18} stroke="currentColor" strokeOpacity={0.4} />
                  Ask our AI
                </Button>
              </div>
            </SequenceItem>

            <SequenceItem role="trust">
              <ul className="mt-6 flex flex-col gap-1.5 text-[0.875rem] leading-[1.55] text-secondary">
                <li>Free first conversation</li>
                <li>A flat quote before anything starts</li>
                <li>We reply within one business day</li>
              </ul>
            </SequenceItem>
          </div>
        </div>
      </SequenceRoot>
    </section>
  );
}
