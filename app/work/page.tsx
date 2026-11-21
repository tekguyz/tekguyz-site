import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { FeaturedCard } from '@/components/featured-card';
import { ProjectCard } from '@/components/project-card';
import { WorkIndex } from '@/components/work-index';
import { ClosingCta } from '@/components/closing-cta';
import { workLarge, workSmall, buildCountWordCapitalized } from '@/content/work';
import { solutions } from '@/content/solutions';
import { getAllStatuses } from '@/lib/status';
import { buildMetadata, breadcrumbs, jsonLd, workItemList } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'TEKGUYZ | Our Work — Live, Working Software',
  description:
    'Every project here is real, running software you can open and try yourself. Case studies and builds across AI, automation, and web apps.',
  path: '/work',
});

/**
 * Since 2026-11-20 (#91, founder): a Solution filter, then six featured cards
 * two across (picture beside the words, about a third of the old row's
 * height), then the other seven as small cards, three across, swiping on
 * phones. Which build sits where is in `content/work.ts` (`largeSlugs`,
 * `smallSlugs`), not here. The cards render here on the server, with their
 * status checks; `WorkIndex` only shows and hides them.
 */
export default async function WorkPage() {
  const statuses = await getAllStatuses();

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
          breadcrumbs([{ name: 'Work', path: '/work' }]),
          workItemList(),
        )}
      />

      {/* The count is DERIVED, never typed. This line read "Eight live builds"
          until 2026-09-04, when the lineup dropped to six and the sentence
          became false with nothing in the build able to see it — not tsc, not
          the linter, not `check:media`. `buildCountWord` reads `work.length`,
          so the only way to make it wrong now is to make the array wrong. */}
      <PageHero
        eyebrow="Our Work"
        headline="Everything here is running right now."
        description={`${buildCountWordCapitalized} live builds. Open any one yourself.`}
      />

      <WorkIndex
        options={solutions.map((s) => ({ solution: s.slug, label: s.name }))}
        featured={workLarge.map((entry) => ({
          slug: entry.slug,
          solution: entry.solution,
          node: <FeaturedCard entry={entry} />,
        }))}
        more={workSmall.map((entry) => ({
          slug: entry.slug,
          solution: entry.solution,
          node: <ProjectCard entry={entry} status={statuses[entry.slug]!} />,
        }))}
      />
      <div className="tg-container mt-12 pb-20 md:mt-16 md:pb-32">
        <p className="text-[length:var(--text-body)] text-secondary">
          Want a quick look at more of what we build?{' '}
          <Link href="/examples" className="tap-44 font-bold text-fg underline decoration-2 underline-offset-[6px]">
            See the examples →
          </Link>
        </p>
      </div>

      <ClosingCta />
    </div>
  );
}
