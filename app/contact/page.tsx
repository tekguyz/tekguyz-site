import { Suspense } from 'react';
import { PageHero } from '@/components/page-hero';
import { ContactForm } from '@/components/contact-form';
import { ClosingCta } from '@/components/closing-cta';
import { faq } from '@/content/faq';
import { site } from '@/lib/site';
import { buildMetadata, breadcrumbs, faqNode, jsonLd } from '@/lib/seo';

export const metadata = buildMetadata({
  title: "TEKGUYZ | Let's Talk About Your Business",
  description:
    'Tell us what you’re working with and what you’re trying to fix. Free conversation, flat quote, no surprises — we reply within one business day.',
  path: '/contact',
});

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

      <PageHero
        eyebrow="Get In Touch"
        headline="Let's talk about your business."
        description="Tell us what you're working with and what you're trying to fix. We'll take it from there."
      />

      <section className="pb-32">
        <div className="tg-container tg-grid items-start gap-y-14">
          <div style={{ gridColumn: '1 / 8' }}>
            {/* useSearchParams needs a Suspense boundary to keep this route static. */}
            <Suspense fallback={<div className="min-h-[420px]" />}>
              <ContactForm />
            </Suspense>
          </div>

          <aside style={{ gridColumn: '9 / 13' }}>
            <div className="border-t border-border pt-6">
              <p className="text-[0.875rem] text-secondary">
                Free first conversation · A flat quote before anything starts · We reply within one
                business day
              </p>

              <dl className="mt-10 m-0 flex flex-col gap-5 text-[0.875rem]">
                <div>
                  <dt className="mb-1 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
                    Email
                  </dt>
                  <dd className="m-0">
                    <a href={`mailto:${site.publicEmail}`} className="link-underline">
                      {site.publicEmail}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="mb-1 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
                    Hours
                  </dt>
                  <dd className="m-0">{site.hoursLong}</dd>
                </div>
                <div>
                  <dt className="mb-1 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
                    Based in
                  </dt>
                  <dd className="m-0">{site.locationLong}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQ — emits FAQPage schema from these exact strings, never a paraphrase. */}
      <section className="tg-section pt-0">
        <div className="tg-container">
          <h2 className="reveal font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
            Common Questions
          </h2>
          <div className="reveal-stagger mt-10">
            {faq.map((item) => (
              <details
                key={item.question}
                className="group border-t border-border py-6 last:border-b"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[length:var(--text-title)] leading-[1.3] font-semibold tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden
                    className="flex-none text-secondary transition-transform duration-[var(--dur-base)] group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-[68ch] text-[length:var(--text-body)] text-secondary">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
