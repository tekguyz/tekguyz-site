import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ViewTransition } from 'react';
import { SignatureStripe } from '@/components/signature-stripe';
import { FlourishMark } from '@/components/flourish-mark';
import { Frame, FrameMeta, BuildNarrative } from '@/components/live-frame';
import { StatusLine } from '@/components/status-line';
import { PullQuote } from '@/components/pull-quote';
import { SolutionTag, AccentDot } from '@/components/solution-tag';
import { ButtonLink } from '@/components/button';
import { Testimonial } from '@/components/testimonial';
import { ClosingCta } from '@/components/closing-cta';
import { work, getWork, adjacentWork } from '@/content/work';
import { getSolution } from '@/content/solutions';
import { getStatus } from '@/lib/status';
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
 * Case studies get content on cols 1-9 with a sticky meta rail on 10-13.
 * Projects are lighter by design: a single 1-8 column, no rail, no image — the
 * same weight distinction project-card carries on the index.
 *
 * Challenge / Approach / Outcome render as `180px 1fr` label-and-body rows
 * separated by hairlines, not as stacked headings.
 *
 * These eight pages are the site's strongest long-tail SEO surface, so their
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

      <SignatureStripe />

      <div className="tg-container tg-grid items-start pt-10 pb-32">
        <div style={{ gridColumn: isCase ? '1 / 9' : '1 / 8' }}>
          <Link href="/work" className="link-underline text-[0.875rem] font-semibold text-secondary">
            ← Work
          </Link>

          <FlourishMark className="mt-10 mb-8" />

          <SolutionTag solution={entry.solution} label={entry.tag} />

          <ViewTransition name={`work-title-${entry.slug}`} share="morph" default="none">
            <h1
              className="mt-7 text-[length:var(--text-display)] leading-[1.05] font-bold tracking-[-0.03em]"
              style={{ textWrap: 'pretty' }}
            >
              {entry.headline}
            </h1>
          </ViewTransition>

          {isCase ? (
            <>
              <div className="mt-18">
                {[
                  ['The Challenge', entry.challenge],
                  ['The Approach', entry.approach],
                  ['The Outcome', entry.outcome],
                ].map(([label, body], i) => (
                  <div
                    key={label}
                    className={`grid gap-6 border-t border-border py-10 md:grid-cols-[180px_1fr] ${i === 2 ? 'border-b' : ''}`}
                  >
                    <p className="text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-secondary uppercase">
                      {label}
                    </p>
                    <p
                      className="max-w-[62ch] text-[length:var(--text-body)]"
                      style={{ textWrap: 'pretty' }}
                    >
                      {body}
                    </p>
                  </div>
                ))}
              </div>

              <PullQuote solution={entry.solution} className="mt-18">
                {entry.pullQuote}
              </PullQuote>

              <div className="mt-20">
                <ViewTransition name={`work-${entry.slug}`} share="morph" default="none">
                  <div>
                    <Frame poster={entry.poster} alt={entry.alt} priority />
                  </div>
                </ViewTransition>
                <FrameMeta status={status} url={entry.url} />
                <p className="mt-6 max-w-[62ch] text-[0.875rem] leading-[1.55] text-secondary">
                  <span className="text-[0.75rem] font-bold tracking-[0.1em] uppercase">Try it</span>{' '}
                  &nbsp;{entry.tryIt}
                </p>
                <BuildNarrative maxWidth="62ch">{entry.howItsBuilt}</BuildNarrative>
              </div>
            </>
          ) : (
            <>
              <div className="mt-14 grid gap-6 border-y border-border py-7 md:grid-cols-[180px_1fr]">
                <p className="text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-secondary uppercase">
                  Built for
                </p>
                <p className="text-[length:var(--text-body)]">{entry.builtFor}</p>
              </div>

              <p
                className="mt-11 max-w-[62ch] text-[length:var(--text-body)]"
                style={{ textWrap: 'pretty' }}
              >
                {entry.summary}
              </p>

              <div className="mt-12 border-t border-border pt-8">
                <p className="mb-[14px] text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-secondary uppercase">
                  What made it interesting
                </p>
                <p
                  className="max-w-[62ch] text-[length:var(--text-body)] text-secondary"
                  style={{ textWrap: 'pretty' }}
                >
                  {entry.whatMadeItInteresting}
                </p>
              </div>

              {entry.tryIt && (
                <p className="mt-8 max-w-[62ch] text-[0.875rem] leading-[1.55] text-secondary">
                  <span className="text-[0.75rem] font-bold tracking-[0.1em] uppercase">Try it</span>{' '}
                  &nbsp;{entry.tryIt}
                </p>
              )}

              {/* The export shows only the status line here. The demo link is
                  kept because "open it yourself" is the entire brand thesis and
                  this is the only place a project's demo is reachable. */}
              <div className="mt-12 flex flex-wrap items-center gap-6">
                <StatusLine result={status} />
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-[14.5px] font-semibold"
                >
                  Open it in a new tab
                </a>
              </div>

              {entry.hasClientReview && (
                <div className="mt-16">
                  <p className="mb-6 text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-secondary uppercase">
                    Client review
                  </p>
                  <Testimonial contextSlug={entry.slug} />
                </div>
              )}
            </>
          )}

          {(prev || next) && (
            <nav
              aria-label="More work"
              className="mt-16 flex flex-wrap justify-between gap-6 border-t border-border pt-8"
            >
              {prev && (
                <Link
                  href={`/work/${prev.slug}`}
                  className="link-underline text-[14.5px] font-semibold text-secondary"
                >
                  ← {prev.name}
                </Link>
              )}
              {next && (
                <Link
                  href={`/work/${next.slug}`}
                  className="link-underline text-[14.5px] font-semibold text-secondary"
                >
                  {next.name} →
                </Link>
              )}
            </nav>
          )}
        </div>

        {isCase && (
          <aside className="lg:sticky lg:top-[116px]" style={{ gridColumn: '10 / 13' }}>
            <div className="border-t border-border pt-5">
              <p className="mb-3 text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-secondary uppercase">
                Solution line
              </p>
              <Link href={`/solutions/${solution.slug}`} className="flex items-center gap-3">
                <AccentDot solution={entry.solution} />
                <span className="link-underline text-[14.5px] font-semibold">{solution.name}</span>
              </Link>
            </div>

            <div className="mt-7 border-t border-border pt-5">
              <p className="mb-3 text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-secondary uppercase">
                Status
              </p>
              <StatusLine result={status} />
              <p className="mt-[14px] text-[0.875rem] leading-[1.55] text-secondary italic">
                We check every demo hourly. This is the real status, not a badge.
              </p>
            </div>

            <div className="mt-7 border-t border-border pt-5">
              <p className="mb-3 text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-secondary uppercase">
                Live demo
              </p>
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-[14.5px] font-semibold"
              >
                Open it in a new tab
              </a>
            </div>

            <ButtonLink href="/contact" className="mt-9 w-full">
              Let&rsquo;s Talk
            </ButtonLink>
          </aside>
        )}
      </div>

      <ClosingCta />
    </>
  );
}
