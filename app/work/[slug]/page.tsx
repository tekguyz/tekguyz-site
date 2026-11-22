import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Frame, BuildNarrative } from '@/components/live-frame';
import { ButtonLink } from '@/components/button';
import { StatusLine } from '@/components/status-line';
import { PullQuote } from '@/components/pull-quote';
import { SolutionTag, AccentDot } from '@/components/solution-tag';
import { ClosingCta } from '@/components/closing-cta';
import { work, getWork, adjacentWork, type WorkEntry } from '@/content/work';
import { getSolution, type Solution } from '@/content/solutions';
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
 * The sticky rail, cols 10-13 (DESIGN.md §3), from 1024px only. BOTH tiers.
 *
 * Since #98 (2026-11-22) it carries the Solution and nothing else. The hero
 * owns the Live line and the one "Open the demo" button; the rail repeating
 * them put the same two things on screen twice, and on phones the whole rail
 * stacked again at the bottom of the page. Below 1024px the hero's tag already
 * names the Solution, so the rail is hidden there. Never a button here: the
 * `closing-cta` band is the page's single strongest ask.
 */
function MetaRail({ entry, solution }: { entry: WorkEntry; solution: Solution }) {
  return (
    <aside className="lg:sticky lg:top-[116px] [grid-column:10/13] max-lg:hidden">
      <div className="border-t border-border pt-5">
        <p className="mb-3 tg-eyebrow text-secondary">Solution</p>
        <Link href={`/solutions/${solution.slug}`} className="tap-44 flex items-center gap-3">
          <AccentDot solution={entry.solution} />
          <span className="link-underline text-[16px] font-semibold">{solution.name}</span>
        </Link>
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
 * Each section is a few short sentences, cut to about half on 2026-11-21
 * (#82, founder: "so much copy everywhere") so a page scans on a phone. Keep
 * only facts the code and the demo back.
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
  const name = entry.shortName ?? entry.name;

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

      {/* Seam: the ink ground holds the promise (tag and headline); the paper
          ground below holds the story, the frame and the rail. */}
      {/* #98 (founder, 2026-11-22): the build's name is the h1, and the
          headline, the Live line and the one demo button sit beside it, the
          same split as PageHero. The old hero set the headline alone, hard
          left, with half the ink empty, and the name appeared nowhere. */}
      <section className="on-ink pt-10 pb-12 md:pb-20">
        <div className="tg-container">
          <Link href="/work" className="tap-44 link-underline text-[16px] font-bold text-secondary">
            ← Work
          </Link>
        </div>
        <div className="tg-container tg-grid mt-10 items-end gap-y-6">
          <div className="[grid-column:1/9] max-lg:[grid-column:1/-1]">
            <SolutionTag solution={entry.solution} label={entry.tag} className="flex w-fit" />
            <h1 className="lettering mt-5 text-balance text-[length:var(--text-hero)]">{name}</h1>
          </div>
          <div className="[grid-column:9/13] max-lg:[grid-column:1/-1]">
            <p
              className="text-secondary text-[length:var(--text-body)] leading-[1.55]"
              style={{ textWrap: 'pretty' }}
            >
              {entry.headline}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <ButtonLink
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open the ${name} demo in a new tab`}
              >
                Open the demo
              </ButtonLink>
              <StatusLine result={status} />
            </div>
          </div>
        </div>
      </section>

      <div className="tg-container tg-grid items-start pt-14 pb-20 md:pt-20 md:pb-28">
        <div
          className={`max-lg:[grid-column:1/-1] ${isCase ? '[grid-column:1/9]' : '[grid-column:1/8]'}`}
        >
          {isCase ? (
            <>
              <div>
                {[
                  ['The Challenge', entry.challenge],
                  ['The Approach', entry.approach],
                  ['The Outcome', entry.outcome],
                ].map(([label, body], i) => (
                  <div
                    key={label}
                    className={`grid gap-6 py-10 md:grid-cols-[180px_1fr] ${i === 0 ? 'border-t-2 border-fg' : 'border-t border-border'} ${i === 2 ? 'border-b border-border' : ''}`}
                  >
                    <p className="tg-eyebrow text-secondary">
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

              {/* Frame, status, "Try it" and the narrative enter as one unit —
                  same rule as the Featured Work rows. */}
              <div className="mt-20">
                <Frame poster={entry.poster} alt={entry.alt} />
                <p className="mt-6 max-w-[62ch] text-[length:var(--text-sm)] leading-[1.55] text-secondary">
                  <span className="tg-eyebrow">Try it</span>{' '}
                  &nbsp;{entry.tryIt}
                </p>
                <BuildNarrative maxWidth="62ch">{entry.howItsBuilt}</BuildNarrative>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-6 border-t-2 border-b border-t-fg border-b-border py-7 md:grid-cols-[180px_1fr]">
                <p className="tg-eyebrow text-secondary">
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
                <p className="mb-[14px] tg-eyebrow text-secondary">
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
              <div className="mt-14">
                <Frame poster={entry.poster} alt={entry.alt} />
              </div>

              {entry.tryIt && (
                <p className="mt-6 max-w-[62ch] text-[length:var(--text-sm)] leading-[1.55] text-secondary">
                  <span className="tg-eyebrow">Try it</span>{' '}
                  &nbsp;{entry.tryIt}
                </p>
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
                  className="tap-44 link-underline text-[16px] font-bold text-secondary"
                >
                  ← {prev.name}
                </Link>
              )}
              {next && (
                <Link
                  href={`/work/${next.slug}`}
                  className="tap-44 link-underline text-[16px] font-bold text-secondary"
                >
                  {next.name} →
                </Link>
              )}
            </nav>
          )}
        </div>

        <MetaRail entry={entry} solution={solution} />
      </div>

      <ClosingCta />
    </div>
  );
}
