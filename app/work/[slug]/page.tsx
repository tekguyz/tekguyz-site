import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ViewTransition } from 'react';
import { LiveFrame } from '@/components/live-frame';
import { StatusLine } from '@/components/status-line';
import { PullQuote } from '@/components/pull-quote';
import { BuildNarrative } from '@/components/build-narrative';
import { SolutionTag } from '@/components/solution-tag';
import { ClosingCta } from '@/components/closing-cta';
import { SignatureStripe } from '@/components/signature-stripe';
import { work, getWork, adjacentWork } from '@/content/work';
import { getSolution } from '@/content/solutions';
import { testimonial } from '@/content/process';
import { getStatus } from '@/lib/status';
import { site } from '@/lib/site';
import { buildMetadata, breadcrumbs, jsonLd, softwareApplicationNode } from '@/lib/seo';

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getWork(slug);
  if (!entry) return {};
  return buildMetadata({
    title: entry.title,
    description: entry.description,
    path: `/work/${entry.slug}`,
    type: 'article',
  });
}

/**
 * DESIGN.md §3 — content cols 1-8, sticky meta rail cols 10-12.
 *
 * These eight pages are the site's strongest long-tail SEO surface: they target
 * problem-language queries the homepage structurally cannot rank for. Their
 * content is deliberately NOT compressed back to card length.
 *
 * The poster carries a view-transition-name matching the card that linked here,
 * so the visitor watches what they clicked become the page.
 */
export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getWork(slug);
  if (!entry) notFound();

  const status = await getStatus(entry.slug);
  const solution = getSolution(entry.solution)!;
  const { prev, next } = adjacentWork(entry.slug);
  const isCase = entry.kind === 'case-study';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbs([
            { name: 'Work', path: '/work' },
            { name: entry.name, path: `/work/${entry.slug}` },
          ]),
          softwareApplicationNode({
            name: entry.name,
            url: entry.url,
            description: entry.description,
          }),
        )}
      />

      {/* Stripe 1 of 3. These pages carry their own hero rather than <PageHero>,
          so the top stripe is placed here explicitly. */}
      <SignatureStripe />

      <section className="pt-32 pb-16">
        <div className="tg-container">
          <SolutionTag solution={entry.solution} label={entry.tag} />
          <ViewTransition name={`work-title-${entry.slug}`} share="morph" default="none">
            <h1 className="mt-6 max-w-[20ch] text-[length:var(--text-display)] leading-[1.05] font-bold tracking-[-0.03em]">
              {entry.headline}
            </h1>
          </ViewTransition>
        </div>
      </section>

      <div className="tg-container tg-grid items-start gap-y-16 pb-32">
        {/* Content column */}
        <div style={{ gridColumn: '1 / 9' }}>
          <ViewTransition name={`work-${entry.slug}`} share="morph" default="none">
            <div>
              <LiveFrame poster={entry.poster} url={entry.url} alt={entry.alt} priority />
            </div>
          </ViewTransition>
          <StatusLine result={status} className="mt-4" />

          {isCase ? (
            <>
              <dl className="mt-14 flex flex-col gap-10">
                {[
                  ['The Challenge', entry.challenge],
                  ['The Approach', entry.approach],
                  ['The Outcome', entry.outcome],
                ].map(([label, body]) => (
                  <div key={label} className="reveal">
                    <dt className="mb-3 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
                      {label}
                    </dt>
                    <dd className="m-0 max-w-[68ch] text-[length:var(--text-body)]">{body}</dd>
                  </div>
                ))}
              </dl>

              <PullQuote solution={entry.solution} className="reveal mt-14">
                {entry.pullQuote}
              </PullQuote>

              <div className="reveal mt-14 rounded-[12px] border border-border bg-surface p-6">
                <h2 className="mb-2 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
                  Try it
                </h2>
                <p className="max-w-[62ch] text-[0.9375rem]">{entry.tryIt}</p>
              </div>

              <BuildNarrative className="reveal mt-14">{entry.howItsBuilt}</BuildNarrative>
            </>
          ) : (
            <>
              <div className="reveal mt-14">
                <h2 className="mb-3 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
                  Built for
                </h2>
                <p className="max-w-[68ch] text-[length:var(--text-body)]">{entry.builtFor}</p>
              </div>

              <p className="reveal mt-10 max-w-[68ch] text-[length:var(--text-body)]">
                {entry.summary}
              </p>

              <div className="reveal mt-10">
                <h2 className="mb-3 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
                  What made it interesting
                </h2>
                <p className="max-w-[68ch] text-[length:var(--text-body)]">
                  {entry.whatMadeItInteresting}
                </p>
              </div>

              {entry.tryIt && (
                <div className="reveal mt-10 rounded-[12px] border border-border bg-surface p-6">
                  <h2 className="mb-2 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
                    Try it
                  </h2>
                  <p className="max-w-[62ch] text-[0.9375rem]">{entry.tryIt}</p>
                </div>
              )}

              {/* Cross-linked from the homepage testimonial — this is the build
                  the verified Google review describes. */}
              {entry.hasClientReview && (
                <figure className="reveal mt-14 m-0">
                  <h2 className="mb-4 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
                    Client review
                  </h2>
                  <blockquote className="m-0 max-w-[52ch] text-[length:var(--text-title)] leading-[1.4] font-medium">
                    {testimonial.body}
                  </blockquote>
                  <figcaption className="mt-6 flex flex-col gap-2 text-[0.875rem]">
                    <span>
                      <strong className="font-semibold">{testimonial.author}</strong>
                      <span className="text-secondary"> · {testimonial.source}</span>
                    </span>
                    <a
                      href={site.gbp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline self-start text-secondary hover:text-fg"
                    >
                      Read it on Google ↗
                    </a>
                  </figcaption>
                </figure>
              )}
            </>
          )}
        </div>

        {/* Sticky meta rail */}
        <aside className="lg:sticky lg:top-28" style={{ gridColumn: '10 / 13' }}>
          <dl className="m-0 flex flex-col gap-6 border-t border-border pt-6 text-[0.875rem]">
            <div>
              <dt className="mb-1 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
                Solution line
              </dt>
              <dd className="m-0">
                <Link href={`/solutions/${solution.slug}`} className="link-underline">
                  {solution.name}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="mb-1 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
                Type
              </dt>
              <dd className="m-0">{isCase ? 'Case study' : 'Project'}</dd>
            </div>
            <div>
              <dt className="mb-1 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
                Live demo
              </dt>
              <dd className="m-0">
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline break-all"
                >
                  Open it in a new tab ↗
                </a>
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      {/* prev / next within the same kind, so a case study never hands off to a project */}
      {(prev || next) && (
        <nav aria-label="More work" className="border-t border-border">
          <div className="tg-container grid grid-cols-1 gap-px sm:grid-cols-2">
            {prev && (
              <Link href={`/work/${prev.slug}`} className="hover-row group py-10 sm:pr-8">
                <span className="font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
                  ← Previous
                </span>
                <span className="mt-3 block text-[length:var(--text-title)] leading-[1.2] font-semibold tracking-[-0.02em]">
                  {prev.name}
                </span>
              </Link>
            )}
            {next && (
              <Link
                href={`/work/${next.slug}`}
                className="hover-row group py-10 sm:border-l sm:border-border sm:pl-8 sm:text-right"
              >
                <span className="font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
                  Next →
                </span>
                <span className="mt-3 block text-[length:var(--text-title)] leading-[1.2] font-semibold tracking-[-0.02em]">
                  {next.name}
                </span>
              </Link>
            )}
          </div>
        </nav>
      )}

      <ClosingCta />
    </>
  );
}
