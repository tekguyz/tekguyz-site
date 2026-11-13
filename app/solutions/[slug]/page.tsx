import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ClosingCta } from '@/components/closing-cta';
import { AccentDot } from '@/components/solution-tag';
import { StatusLine } from '@/components/status-line';
import { accentForSolution } from '@/config/solutions';
import { solutions, getSolution } from '@/content/solutions';
import { workByName } from '@/content/work';
import { examplesForSolution } from '@/content/examples';
import { getAllStatuses } from '@/lib/status';
import { buildMetadata, breadcrumbs, jsonLd, serviceNode } from '@/lib/seo';

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return {};
  return buildMetadata({
    title: solution.title,
    description: solution.description,
    path: `/solutions/${solution.slug}`,
  });
}

/**
 * The export's solution-section treatment, given its own route.
 *
 * Layout: dot + display title + a colored eyebrow in that line's `-text`
 * variant on cols 1-6; body, hairline feature list and the related-work/CTA row
 * on cols 7-13.
 *
 * One Service node per page — cleaner schema practice than four nodes crammed
 * onto a single URL, and each now sits on the page it describes.
 */
export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  const a = accentForSolution(solution.slug);
  const statuses = await getAllStatuses();
  const related = solution.relatedWork
    .map((name) => workByName(name))
    .filter((w): w is NonNullable<typeof w> => Boolean(w));
  const solutionExamples = examplesForSolution(solution.slug);

  return (
    <div>
    {/* One root element, never a multi-child fragment — Next scrolls the new
        segment into view on every client-side transition, and a fragment routes
        that through FragmentInstance.scrollIntoView(), which calls
        scrollIntoView() on EVERY top-level child. Mechanism in full:
        app/contact/page.tsx. Keep the JSON-LD script inside the wrapper. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbs([
            { name: 'Solutions', path: '/solutions' },
            { name: solution.name, path: `/solutions/${solution.slug}` },
          ]),
          serviceNode(solution.name, solution.serviceDescription),
        )}
      />

      {/* Seam: the ink ground holds the problem and the promise; the paper
          ground below holds what we build and the proof. */}
      <section className="on-ink pt-10 pb-16 md:pb-24">
        <div className="tg-container">
          <Link
            href="/solutions"
            className="tap-44 link-underline text-[16px] font-bold text-secondary"
          >
            ← Solutions
          </Link>

          <div className="tg-grid items-end pt-10">
            {/* 768–1023: display-scale title beside body prose is the same narrow-column
                artifact as page-hero — both take all 8 tracks and stack. */}
            <div className="[grid-column:1/7] max-lg:[grid-column:1/-1]">
              <p className="tg-eyebrow text-fg inline-flex items-center gap-2">
                <AccentDot solution={solution.slug} size={12} />
                {solution.tag}
              </p>
              <h1 className="lettering mt-5 text-[length:var(--text-hero)]">{solution.name}</h1>
            </div>

            <div className="[grid-column:8/13] max-lg:[grid-column:1/-1]">
              <p className="text-[length:var(--text-body)] leading-[1.55]">{solution.body[0]}</p>
              <p className="text-secondary mt-5 text-[length:var(--text-body)] leading-[1.55]">
                {solution.body[1]}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="tg-container pt-16 pb-20 md:pt-20 md:pb-28">
        <div>
          <div>
            <ul className="m-0 list-none border-t-2 border-fg p-0 md:grid md:grid-cols-2 md:gap-x-12">
              {solution.features.map((f) => (
                <li
                  key={f}
                  className="flex items-baseline gap-[14px] border-b border-border py-4 text-[length:var(--text-body)] font-bold"
                >
                  <span
                    aria-hidden
                    className="h-[10px] w-[10px] flex-none rounded-full"
                    style={{ background: a.dot }}
                  />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-baseline justify-between gap-8">
              {/* Resolved names only, and no label at all when none resolve —
                  an empty "Related work" reads as a broken page (#13). */}
              {related.length > 0 && (
                <p className="text-[length:var(--text-sm)] leading-[1.55] text-secondary">
                  <span className="tg-eyebrow">
                    Related work
                  </span>{' '}
                  &nbsp;{related.map((w) => w.name).join(', ')}
                </p>
              )}
              <Link
                href={solution.cta.href}
                className="tap-44 flex-none text-[17px] font-bold underline decoration-2 underline-offset-[6px]"
              >
                {solution.cta.label} →
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 md:mt-24">
            <p className="mb-8 tg-eyebrow text-secondary">
              The builds
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {related.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/work/${entry.slug}`}
                  data-card
                  className="hover-card flex flex-col tg-frame bg-bg p-6"
                >
                  <h2
                    className="text-[length:var(--text-title)]"
                    style={{ textWrap: 'pretty' }}
                  >
                    {entry.name}
                  </h2>
                  <StatusLine result={statuses[entry.slug]!} className="mt-5" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Examples sit apart from the builds, under their own label, because
            they are made-up businesses on sample data, not running software. */}
        {solutionExamples.length > 0 && (
          <div className="mt-16 md:mt-24">
            <p className="mb-8 tg-eyebrow text-secondary">
              Examples
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {solutionExamples.map((ex) => (
                <Link
                  key={ex.slug}
                  href={`/examples/${ex.slug}`}
                  data-card
                  className="hover-card flex flex-col tg-frame bg-bg p-6"
                >
                  <h2
                    className="text-[length:var(--text-title)]"
                    style={{ textWrap: 'pretty' }}
                  >
                    {ex.name}
                  </h2>
                  <p className="mt-3 text-[15px] text-secondary">
                    Example on a made-up business: {ex.business}.
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <ClosingCta />
    </div>
  );
}
