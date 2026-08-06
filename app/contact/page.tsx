import { Suspense } from 'react';
import { SignatureStripe } from '@/components/signature-stripe';
import { FlourishMark } from '@/components/flourish-mark';
import { ContactForm } from '@/components/contact-form';
import { FaqAccordion } from '@/components/faq-accordion';
import { STRIPE_ORDER, accent } from '@/config/solutions';
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
 * The trust lines render as hairline-separated rows with accent dots, not the
 * mid-dot run used in the closing CTA.
 */
const TRUST = [
  'Free first conversation',
  'A flat quote before anything starts',
  'We reply within one business day',
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbs([{ name: 'Contact', path: '/contact' }]),
          faqNode(),
        )}
      />

      <SignatureStripe />

      <div className="tg-container tg-grid items-start pt-24 pb-32">
        <div style={{ gridColumn: '1 / 6' }}>
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

          <div className="mt-12 flex flex-col">
            {TRUST.map((line, i) => (
              <div
                key={line}
                className={`flex items-center gap-3 border-t border-border py-[14px] text-[0.875rem] leading-[1.55] ${i === TRUST.length - 1 ? 'border-b' : ''}`}
              >
                {/* Blue, amber, teal — the export skips violet here. */}
                <span
                  aria-hidden
                  className="h-[6px] w-[6px] flex-none rounded-full"
                  style={{ background: accent(STRIPE_ORDER[i === 0 ? 0 : i + 1]!).dot }}
                />
                {line}
              </div>
            ))}
          </div>

          <p className="mt-9 text-[0.875rem] leading-[1.55] tabular-nums text-secondary">
            {site.publicEmail} · {site.hoursLong} · {site.locationLong}
          </p>
        </div>

        <div style={{ gridColumn: '7 / 13' }}>
          {/* useSearchParams needs a Suspense boundary to keep this route static. */}
          <Suspense fallback={<div className="min-h-[520px]" />}>
            <ContactForm />
          </Suspense>
        </div>
      </div>

      {/* FAQ — emits FAQPage schema from these exact strings, never a paraphrase. */}
      <section className="pb-32">
        <div className="tg-container">
          <p className="mb-10 text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-secondary uppercase">
            Common Questions
          </p>
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
