import { Fragment, Suspense } from 'react';
import { SignatureStripe } from '@/components/signature-stripe';
import { FlourishMark } from '@/components/flourish-mark';
import { ContactForm } from '@/components/contact-form';
import { FaqAccordion } from '@/components/faq-accordion';
import { site } from '@/lib/site';
import { buildMetadata, breadcrumbs, faqNode, jsonLd } from '@/lib/seo';

export const metadata = buildMetadata({
  title: "TEKGUYZ | Let's Talk About Your Business",
  description:
    'Tell us what you’re working with and what you’re trying to fix. Free conversation, flat quote, no surprises — we reply within one business day.',
  path: '/contact',
});

/**
 * Contact is the one route without a closing CTA — the whole page IS the ask,
 * and repeating it below the form would be a second, competing conversion path.
 *
 * The trust lines render exactly as `closing-cta` renders the same three facts:
 * one `muted` line, mid-dot separated, no color. They previously carried leading
 * dots in three of the four wayfinding accents, which is a misuse of the color
 * system — those accents mean *solution line* everywhere else on the site, and
 * these three facts have nothing to do with a solution line.
 */
const TRUST = [
  'Free first conversation',
  'A flat quote before anything starts',
  'We reply within one business day',
];

/**
 * THIS PAGE MUST RETURN EXACTLY ONE ELEMENT — see the wrapper below.
 *
 * On every client-side transition into a route, Next.js asks React to scroll
 * the new segment into view. When a page returns a multi-child fragment, React
 * hands Next a FragmentInstance, and `FragmentInstance.scrollIntoView()` calls
 * `Element.scrollIntoView()` on EVERY top-level child in reverse document
 * order, relying on the last call — the page's first child — to win.
 *
 * That contract broke here. The four children were the JSON-LD `<script>`, the
 * 6px SignatureStripe, the hero/form grid, and the FAQ `<section>` — so the
 * loop's FIRST call scrolled to the FAQ, ~1400px down the mobile page, and the
 * LAST call, the one meant to undo it, landed on the `<script>`. A zero-box
 * element cannot be scrolled to: measured, `script.scrollIntoView()` left
 * scrollY at 1500 unchanged. The page's resting position was therefore decided
 * by whichever leftover child in the chain happened to have a layout box — a
 * 6px stripe — rather than by the top of the page. Where that fallback also
 * fails to move the viewport, the FAQ's scroll is the one that sticks.
 *
 * One root element removes the loop entirely: there is a single child, it has a
 * real box, and its top is the top of the page. Do not flatten this back into a
 * fragment, and do not hoist the JSON-LD script out of the wrapper.
 */
export default function ContactPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbs([{ name: 'Contact', path: '/contact' }]),
          faqNode(),
        )}
      />

      <SignatureStripe />

      <div className="tg-container tg-grid items-start pt-16 md:pt-24 pb-20 md:pb-32">
        {/* 768–1023: the form card is a single column at every width — there is no
            second column for it to sit beside — so intake and its trust column
            each take all 8 tracks rather than a third of the row. */}
        <div className="[grid-column:1/6] max-lg:[grid-column:1/-1]">
          <FlourishMark className="mb-9" />
          <p className="mb-6 text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-secondary uppercase">
            Get In Touch
          </p>
          <h1
            className="text-[length:var(--text-hero)] leading-[0.95] font-bold tracking-[-0.045em]"
            style={{ textWrap: 'pretty' }}
          >
            Let&rsquo;s talk about your business.
          </h1>
          <p
            className="mt-8 max-w-[44ch] text-[length:var(--text-body)] text-secondary"
            style={{ textWrap: 'pretty' }}
          >
            Tell us what you&rsquo;re working with and what you&rsquo;re trying to fix. We&rsquo;ll
            take it from there.
          </p>

          {/* M-04's sub-767 half. Prompt 8 fixed this row's 768 and 844 cases
              via the 8-column grid; below 767 the cause is different and the
              fix is the same one `closing-cta` uses — see the long note there
              for why it is a 766px media query and not a sibling selector.
              `items-start` is re-asserted in the column direction: `items-center`
              is cross-axis, so it would centre these three facts horizontally
              once stacked, and DESIGN.md §9 left-anchors everything but the
              closing CTA. */}
          <div className="reveal mt-12 flex flex-wrap items-center gap-x-[22px] gap-y-[10px] text-[0.875rem] leading-[1.55] text-secondary max-[766px]:flex-col max-[766px]:items-start">
            {TRUST.map((line, i) => (
              <Fragment key={line}>
                {i > 0 && (
                  <span
                    aria-hidden
                    className="h-[3px] w-[3px] flex-none rounded-full max-[766px]:hidden"
                    style={{ background: 'var(--tg-muted-soft)' }}
                  />
                )}
                <span>{line}</span>
              </Fragment>
            ))}
          </div>

          <p className="mt-9 text-[0.875rem] leading-[1.55] tabular-nums text-secondary">
            {site.publicEmail} · {site.hoursLong} · {site.locationLong}
          </p>
        </div>

        <div className="[grid-column:7/13] max-lg:[grid-column:1/-1]">
          {/* useSearchParams needs a Suspense boundary to keep this route static. */}
          <Suspense fallback={<div className="min-h-[520px]" />}>
            <ContactForm />
          </Suspense>
        </div>
      </div>

      {/* FAQ — emits FAQPage schema from these exact strings, never a paraphrase.
          Revealed, along with the trust lines above. The form itself deliberately
          is NOT: it sits in the first viewport, and a form fading in on first
          paint reads as the page loading slowly — the opposite of what this
          route needs to convey. (The controller reveals anything already on
          screen at mount without animating, so a reveal here is only ever an
          entrance for a visitor who scrolls to it.) */}
      <section className="reveal pb-20 md:pb-32">
        <div className="tg-container">
          <p className="mb-10 text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-secondary uppercase">
            Common Questions
          </p>
          <FaqAccordion />
        </div>
      </section>
    </div>
  );
}
