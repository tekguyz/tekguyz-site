import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SignatureStripe } from '@/components/signature-stripe';
import { FlourishMark } from '@/components/flourish-mark';
import { SolutionTag, AccentDot } from '@/components/solution-tag';
import { ClosingCta } from '@/components/closing-cta';
import { ExampleScreen } from '@/components/example-screens';
import { accentForSolution } from '@/config/solutions';
import { examples, getExample } from '@/content/examples';
import { getSolution } from '@/content/solutions';
import { buildMetadata, breadcrumbs, jsonLd } from '@/lib/seo';

export function generateStaticParams() {
  return examples.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getExample(slug);
  if (!entry) return {};
  return buildMetadata({
    title: entry.title,
    description: entry.description,
    path: `/examples/${entry.slug}`,
  });
}

/**
 * One example: what the problem is, what the tool does, then the screen to
 * click through. The made-up business is named above the headline and again
 * in the screen's own top bar, so it is never read as a client's build.
 *
 * Deliberately no SoftwareApplication node: there is no running app to point
 * at. Breadcrumbs only.
 */
export default async function ExamplePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getExample(slug);
  if (!entry) notFound();

  const solution = getSolution(entry.solution)!;
  const a = accentForSolution(entry.solution);

  return (
    <div>
      {/* One root element, never a multi-child fragment. Mechanism in full:
          app/contact/page.tsx. Keep the JSON-LD script inside the wrapper. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbs([
            { name: 'Examples', path: '/examples' },
            { name: entry.name, path: `/examples/${entry.slug}` },
          ]),
        )}
      />

      <SignatureStripe />

      <div className="tg-container pt-10 pb-20 md:pb-32">
        <Link href="/examples" className="tap-44 link-underline text-[0.875rem] font-semibold text-secondary">
          ← Examples
        </Link>

        <FlourishMark className="mt-10 mb-8" />

        <div className="tg-grid pt-4">
          <div className="[grid-column:1/7] max-lg:[grid-column:1/-1]">
            <SolutionTag solution={entry.solution} label={entry.tag} />
            <h1
              className="mt-6 text-[length:var(--text-display)] leading-[1.1] font-semibold tracking-[-0.025em]"
              style={{ textWrap: 'pretty' }}
            >
              {entry.headline}
            </h1>
            <p className="mt-6 text-[length:var(--text-body)] text-secondary">
              Example: {entry.business}, {entry.businessLine}.
            </p>
          </div>

          <div className="[grid-column:7/13] max-lg:[grid-column:1/-1]">
            <p className="tg-eyebrow text-secondary">The problem</p>
            <p className="mt-3 text-[length:var(--text-body)]" style={{ textWrap: 'pretty' }}>
              {entry.problem}
            </p>
            <p className="mt-9 tg-eyebrow text-secondary">What it does</p>
            <ul className="m-0 mt-3 list-none p-0">
              {entry.does.map((f, i) => (
                <li
                  key={f}
                  className={`flex items-baseline gap-[14px] border-t border-border py-[14px] text-[length:var(--text-body)] ${
                    i === entry.does.length - 1 ? 'border-b' : ''
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
          </div>
        </div>

        <div className="mt-16 md:mt-24">
          <p className="mb-6 text-[length:var(--text-body)] text-secondary" style={{ textWrap: 'pretty' }}>
            {entry.tryIt}
          </p>
          <ExampleScreen example={entry} />
        </div>

        <div className="mt-12 flex flex-wrap items-baseline justify-between gap-8 border-t border-border pt-8">
          <p className="flex items-center gap-3 text-[0.875rem] text-secondary">
            <AccentDot solution={entry.solution} size={8} />
            Part of{' '}
            <Link href={`/solutions/${solution.slug}`} className="tap-44 link-underline font-semibold text-fg">
              {solution.name}
            </Link>
          </p>
          <p className="max-w-[46ch] text-[0.875rem] text-secondary" style={{ textWrap: 'pretty' }}>
            Your version is built around your business, your tools and your words.
          </p>
        </div>
      </div>

      <ClosingCta />
    </div>
  );
}
