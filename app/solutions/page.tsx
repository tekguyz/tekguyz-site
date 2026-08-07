import { PageHero } from '@/components/page-hero';
import { SolutionRow } from '@/components/solution-row';
import { ClosingCta } from '@/components/closing-cta';
import { solutions } from '@/content/solutions';
import { buildMetadata, breadcrumbs, jsonLd, solutionsItemList } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'TEKGUYZ | Solutions — Smart Ops, Voice AI, Systems, Web Apps',
  description:
    'Custom AI assistants, voice agents, business systems, and web apps — four ways TEKGUYZ helps operational businesses run smarter. See live builds for each.',
  path: '/solutions',
});

/**
 * The light overview. Feature bullets live on the detail pages.
 *
 * The design export renders /solutions as one long page with all four sections
 * inline — it predates CANONICAL §4's reversal to index + four routes, which
 * exists because a #fragment is not a separate URL to a search engine, so all
 * four solution keywords were competing for relevance on a single page. The
 * routing follows CANONICAL; the export's section treatment is applied to the
 * four detail pages instead.
 */
export default function SolutionsPage() {
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
          breadcrumbs([{ name: 'Solutions', path: '/solutions' }]),
          solutionsItemList(),
        )}
      />

      <PageHero
        eyebrow="What We Do"
        headline="Four ways we help."
        description="Most businesses come to us with a bottleneck, not a spec. These are the four shapes that bottleneck usually takes."
      />

      <section className="pb-32">
        <div className="tg-container">
          {solutions.map((s, i) => (
            <SolutionRow key={s.slug} solution={s} last={i === solutions.length - 1} index={i} />
          ))}
        </div>
      </section>

      <ClosingCta />
    </div>
  );
}
