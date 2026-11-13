import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { SolutionTag } from '@/components/solution-tag';
import { ClosingCta } from '@/components/closing-cta';
import { examples } from '@/content/examples';
import { site } from '@/lib/site';
import { buildMetadata, breadcrumbs, jsonLd } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'TEKGUYZ | Examples — A Closer Look at What We Build',
  description:
    'Short examples of the tools we build for small businesses, each on a made-up business with sample data: quote follow-up, voicemail summaries, an inbox sorter and online booking.',
  path: '/examples',
});

/**
 * Examples are not builds, so they never share a list with /work. The hero
 * says what they are in its first line, and every card repeats the made-up
 * business by name.
 */
export default function ExamplesPage() {
  return (
    <div>
      {/* One root element, never a multi-child fragment. Mechanism in full:
          app/contact/page.tsx. Keep the JSON-LD script inside the wrapper. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbs([{ name: 'Examples', path: '/examples' }]), {
          '@type': 'ItemList',
          itemListElement: examples.map((e, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: e.name,
            url: `${site.url}/examples/${e.slug}`,
          })),
        })}
      />

      <PageHero
        eyebrow="Examples"
        headline="A closer look at what we build."
        description="Short examples on made-up businesses, with sample data you can click through. For finished builds you can open and use, see Our Work."
      />

      <div className="tg-container pt-16 pb-20 md:pt-20 md:pb-28">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {examples.map((e) => (
            <Link
              key={e.slug}
              href={`/examples/${e.slug}`}
              data-card
              className="hover-card flex flex-col tg-frame bg-bg p-6"
            >
              <SolutionTag solution={e.solution} label={e.tag} variant="card" className="self-start" />
              <h2
                className="mt-5 text-[length:var(--text-title)]"
                style={{ textWrap: 'pretty' }}
              >
                {e.name}
              </h2>
              <p className="mt-3 text-[length:var(--text-body)] text-secondary" style={{ textWrap: 'pretty' }}>
                {e.headline}
              </p>
              <p className="mt-auto pt-6 text-[15px] text-secondary">
                Example: {e.business}, {e.businessLine}.
              </p>
            </Link>
          ))}
        </div>
        <p className="mt-12 text-[length:var(--text-body)]">
          <Link href="/work" className="tap-44 font-bold underline decoration-2 underline-offset-[6px]">
            See the finished builds in Our Work →
          </Link>
        </p>
      </div>

      <ClosingCta />
    </div>
  );
}
