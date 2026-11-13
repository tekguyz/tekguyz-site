import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { CaseStudyRow } from '@/components/case-study-row';
import { ProjectCard } from '@/components/project-card';
import { ClosingCta } from '@/components/closing-cta';
import { workLarge, workSmall, buildCountWordCapitalized } from '@/content/work';
import { getAllStatuses } from '@/lib/status';
import { buildMetadata, breadcrumbs, jsonLd, workItemList } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'TEKGUYZ | Our Work — Live, Working Software',
  description:
    'Every project here is real, running software you can open and try yourself. Case studies and builds across AI, automation, and web apps.',
  path: '/work',
});

/**
 * Founder, 2026-11-11: four large cards, one per Solution, then every other
 * build in small cards. Which build sits where is in `content/work.ts`
 * (`largeSlugs`, `smallSlugs`), not here.
 *
 * Each group gets the export's section header: a small uppercase label with a
 * muted descriptor beside it, over a 28px-padded hairline.
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
        description={`${buildCountWordCapitalized} live builds — click into any one and open it yourself.`}
      />

      <div>
        <div className="tg-container">
          <GroupHead title="One for each Solution" note="Our four kinds of work, one build each" />
        </div>
        {workLarge.map((entry, i) => (
          <CaseStudyRow key={entry.slug} entry={entry} status={statuses[entry.slug]!} index={i} />
        ))}
      </div>

      <div className="tg-container mt-16 pb-20 md:pb-32">
        <GroupHead title="More builds" note="Same standard, every one live" />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {workSmall.map((entry, i) => (
            <ProjectCard key={entry.slug} entry={entry} status={statuses[entry.slug]!} index={i} />
          ))}
        </div>
        <p className="mt-12 text-[length:var(--text-body)] text-secondary">
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

function GroupHead({ title, note }: { title: string; note: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b-2 border-fg pb-5">
      <h2 className="tg-plain tg-eyebrow">{title}</h2>
      <span className="text-[15px] text-secondary">{note}</span>
    </div>
  );
}
