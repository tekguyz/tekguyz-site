import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/page-hero';
import { ClosingCta } from '@/components/closing-cta';
import { PullQuote } from '@/components/pull-quote';
import { StatusLine } from '@/components/status-line';
import { SolutionTag } from '@/components/solution-tag';
import { ButtonLink } from '@/components/button';
import { solutions, getSolution } from '@/content/solutions';
import { workByName } from '@/content/work';
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
 * One Service node per page — cleaner schema practice than four nodes crammed
 * onto a single URL, and each now sits on the page it actually describes.
 */
export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  const statuses = await getAllStatuses();
  const related = solution.relatedWork
    .map((name) => workByName(name))
    .filter((w): w is NonNullable<typeof w> => Boolean(w));

  return (
    <>
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

      {/* The headline is drawn from this solution's own copy, not the generic
          page-hero pattern used on top-level routes. */}
      <PageHero eyebrow={solution.tag} headline={solution.headline} />

      <section className="pb-24">
        <div className="tg-container tg-grid">
          <div className="reveal" style={{ gridColumn: '1 / 8' }}>
            {solution.body.map((para) => (
              <p key={para} className="mb-6 max-w-[62ch] text-[length:var(--text-body)]">
                {para}
              </p>
            ))}
          </div>

          <div className="reveal" style={{ gridColumn: '9 / 13' }}>
            <h2 className="mb-5 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
              What that includes
            </h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {solution.features.map((f) => (
                <li
                  key={f}
                  className="border-b border-border pb-3 text-[0.9375rem] last:border-0"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="tg-section pt-0">
          <div className="tg-container">
            <h2 className="reveal font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
              Related work
            </h2>

            <div className="reveal-stagger mt-10 flex flex-col gap-12">
              {related.map((entry) => (
                <article
                  key={entry.slug}
                  className="hover-row tg-grid items-start border-t border-border pt-10"
                >
                  <div style={{ gridColumn: '1 / 7' }}>
                    <SolutionTag solution={entry.solution} label={entry.tag} />
                    <h3 className="mt-5 text-[length:var(--text-title)] leading-[1.2] font-semibold tracking-[-0.02em]">
                      <Link href={`/work/${entry.slug}`} className="link-underline">
                        {entry.name}
                      </Link>
                    </h3>
                    <StatusLine result={statuses[entry.slug]!} className="mt-4" />
                  </div>
                  <div style={{ gridColumn: '8 / 13' }}>
                    <PullQuote solution={entry.solution}>
                      {entry.kind === 'case-study' ? entry.pullQuote : entry.headline}
                    </PullQuote>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pb-32">
        <div className="tg-container">
          <ButtonLink href={solution.cta.href}>{solution.cta.label}</ButtonLink>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
