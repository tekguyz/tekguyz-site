import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ViewTransition } from 'react';
import { SignatureStripe } from '@/components/signature-stripe';
import { FlourishMark } from '@/components/flourish-mark';
import { Frame, FrameMeta, BuildNarrative } from '@/components/live-frame';
import { StatusLine } from '@/components/status-line';
import { PullQuote } from '@/components/pull-quote';
import { SolutionTag, AccentDot } from '@/components/solution-tag';
import { Testimonial } from '@/components/testimonial';
import { ClosingCta } from '@/components/closing-cta';
import { work, getWork, adjacentWork, type WorkEntry } from '@/content/work';
import { getSolution, type Solution } from '@/content/solutions';
import { getStatus, type StatusResult } from '@/lib/status';
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
 * The sticky meta rail, cols 10-13 (DESIGN.md §3). BOTH tiers get it.
 *
 * Its job is Solution line / Status / Live demo — nothing else. It used to end
 * with its own `Let's Talk` button, which put two asks on one page: the rail's
 * and the `closing-cta` band's. The band is the documented size exception
 * *because* it is meant to be the page's single strongest ask, so a second
 * button above it was competing with the thing it was supposed to lead into.
 * Don't reintroduce it.
 */
function MetaRail({
  entry,
  solution,
  status,
}: {
  entry: WorkEntry;
  solution: Solution;
  status: StatusResult;
}) {
  return (
    // The rail is not `hidden lg:block` — it renders in the 768–1023 band, so the
    // band gets two real columns: content 6 tracks, rail 2. Only the pinning is
    // `lg:`-gated.
    <aside className="lg:sticky lg:top-[116px] [grid-column:10/13] max-lg:[grid-column:7/9]">
      <div className="border-t border-border pt-5">
        <p className="mb-3 text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-secondary uppercase">
          Solution line
        </p>
        <Link href={`/solutions/${solution.slug}`} className="tap-44 flex items-center gap-3">
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
          className="tap-44 link-underline text-[14.5px] font-semibold"
        >
          Open it in a new tab
        </a>
      </div>
    </aside>
  );
}

/**
 * Case studies get content on cols 1-9, projects on 1-8 — thin copy is not
 * stretched wider than it needs, per DESIGN.md §3's left-anchor rule. Both tiers
 * carry the sticky meta rail on 10-13.
 *
 * Projects previously had NO rail and NO image, so the page was a narrow text
 * column against a large empty right side, with the Solution line, status, and
 * demo link appearing nowhere. That was a documentation gap, not a deliberate
 * weight distinction — the distinction DESIGN.md actually protects is on
 * `project-card` (which still never carries an image) and in the amount of
 * narrative content, which is unchanged here.
 *
 * Challenge / Approach / Outcome render as `180px 1fr` label-and-body rows
 * separated by hairlines, not as stacked headings.
 *
 * These eight pages are the site's strongest long-tail SEO surface, so their
 * content is deliberately NOT compressed back to card length.
 *
 * The case-study poster carries a view-transition-name matching the card that
 * linked here, so the visitor watches what they clicked become the page. A
 * project's frame has no counterpart to morph from — `project-card` has no
 * image — so it deliberately carries no transition name.
 */
export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getWork(slug);
  if (!entry) notFound();

  const status = await getStatus(entry.slug);
  const solution = getSolution(entry.solution)!;
  const { prev, next } = adjacentWork(entry.slug);
  const isCase = entry.kind === 'case-study';

  // One root element, never a multi-child fragment — see app/contact/page.tsx
  // for the full mechanism. Keep the JSON-LD script inside the wrapper.
  return (
    <div>
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

      <div className="tg-container tg-grid items-start pt-10 pb-20 md:pb-32">
        <div
          className={`max-lg:[grid-column:1/7] ${isCase ? '[grid-column:1/9]' : '[grid-column:1/8]'}`}
        >
          <Link href="/work" className="tap-44 link-underline text-[0.875rem] font-semibold text-secondary">
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
                    data-reveal-index={i}
                    className={`reveal grid gap-6 border-t border-border py-10 md:grid-cols-[180px_1fr] ${i === 2 ? 'border-b' : ''}`}
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

              <PullQuote solution={entry.solution} className="reveal mt-18">
                {entry.pullQuote}
              </PullQuote>

              {/* Frame, status, "Try it" and the narrative enter as one unit —
                  same rule as the Featured Work rows. */}
              <div className="reveal mt-20">
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
              <div className="reveal mt-14 grid gap-6 border-y border-border py-7 md:grid-cols-[180px_1fr]">
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

              <div className="reveal mt-12 border-t border-border pt-8">
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

              {/* Frame and its meta row enter as one unit, same rule as the
                  Featured Work rows. 16:10 — every compact context is, and a
                  detail page is a compact context. The poster file already
                  existed in content/work.ts and was rendered nowhere: this page
                  had no image and `project-card` deliberately never has one, so
                  four captured assets were wired to nothing. */}
              <div className="reveal mt-14">
                <Frame poster={entry.poster} alt={entry.alt} priority />
                <FrameMeta status={status} url={entry.url} />
              </div>

              {entry.tryIt && (
                <p className="mt-6 max-w-[62ch] text-[0.875rem] leading-[1.55] text-secondary">
                  <span className="text-[0.75rem] font-bold tracking-[0.1em] uppercase">Try it</span>{' '}
                  &nbsp;{entry.tryIt}
                </p>
              )}

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
                  className="tap-44 link-underline text-[14.5px] font-semibold text-secondary"
                >
                  ← {prev.name}
                </Link>
              )}
              {next && (
                <Link
                  href={`/work/${next.slug}`}
                  className="tap-44 link-underline text-[14.5px] font-semibold text-secondary"
                >
                  {next.name} →
                </Link>
              )}
            </nav>
          )}
        </div>

        <MetaRail entry={entry} solution={solution} status={status} />
      </div>

      <ClosingCta />
    </div>
  );
}
