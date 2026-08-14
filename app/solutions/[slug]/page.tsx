import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SignatureStripe } from '@/components/signature-stripe';
import { FlourishMark } from '@/components/flourish-mark';
import { ClosingCta } from '@/components/closing-cta';
import { AccentDot } from '@/components/solution-tag';
import { StatusLine } from '@/components/status-line';
import { accentForSolution } from '@/config/solutions';
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

      <SignatureStripe />

      <div className="tg-container pt-10 pb-20 md:pb-32">
        <Link
          href="/solutions"
          className="tap-44 link-underline text-[0.875rem] font-semibold text-secondary"
        >
          ← Solutions
        </Link>

        <FlourishMark className="mt-10 mb-8" />

        <div className="tg-grid pt-4">
          {/* 768–1023: display-scale title beside body prose is the same narrow-column
              artifact as page-hero — both take all 8 tracks and stack. */}
          <div className="[grid-column:1/6] max-lg:[grid-column:1/-1]">
            <div className="flex items-start gap-[22px]">
              <AccentDot solution={solution.slug} style={{ marginTop: 22 }} />
              <div>
                <h1 className="text-[length:var(--text-display)] leading-[1.1] font-semibold tracking-[-0.025em]">
                  {solution.name}
                </h1>
                <p
                  className="mt-5 tg-eyebrow"
                  style={{ color: a.text }}
                >
                  {solution.tag}
                </p>
              </div>
            </div>
          </div>

          <div className="[grid-column:7/13] max-lg:[grid-column:1/-1]">
            <p
              className="text-[length:var(--text-body)]"
              style={{ textWrap: 'pretty' }}
            >
              {solution.body[0]}
            </p>
            <p
              className="mt-5 text-[length:var(--text-body)] text-secondary"
              style={{ textWrap: 'pretty' }}
            >
              {solution.body[1]}
            </p>

            <ul className="m-0 mt-9 list-none p-0">
              {solution.features.map((f, i) => (
                <li
                  key={f}
                  className={`flex items-baseline gap-[14px] border-t border-border py-[14px] text-[length:var(--text-body)] ${
                    i === solution.features.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <span
                    aria-hidden
                    className="h-[5px] w-[5px] flex-none rounded-full"
                    style={{ background: a.dot, transform: 'translateY(-3px)' }}
                  />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-baseline justify-between gap-8">
              <p className="text-[0.875rem] leading-[1.55] text-secondary">
                <span className="tg-eyebrow">
                  Related work
                </span>{' '}
                &nbsp;{solution.relatedWork.join(', ')}
              </p>
              <Link
                href={solution.cta.href}
                className="tap-44 link-underline flex-none text-[14.5px] font-semibold"
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
              {related.map((entry, i) => (
                <Link
                  key={entry.slug}
                  href={`/work/${entry.slug}`}
                  data-card
                  data-reveal-index={i}
                  className="reveal hover-card flex flex-col rounded-[12px] border border-border bg-surface p-6"
                >
                  <h2
                    className="text-[length:var(--text-title)] leading-[1.2] font-semibold tracking-[-0.02em]"
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
      </div>

      <ClosingCta />
    </div>
  );
}
