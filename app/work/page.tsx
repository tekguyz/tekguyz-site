import { PageHero } from '@/components/page-hero';
import { CaseStudyRow } from '@/components/case-study-row';
import { ProjectCard } from '@/components/project-card';
import { ClosingCta } from '@/components/closing-cta';
import { caseStudies, projects } from '@/content/work';
import { getAllStatuses } from '@/lib/status';
import { buildMetadata, breadcrumbs, jsonLd, workItemList } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'TEKGUYZ | Our Work — Live, Working Software',
  description:
    'Every project here is real, running software you can open and try yourself — not a screenshot. Case studies and builds across AI, automation, and web apps.',
  path: '/work',
});

/**
 * Case studies and projects are never interleaved — the weight difference
 * between the two components is deliberate signal about the depth of the build.
 *
 * Each group gets the export's section header: a small uppercase label with a
 * muted descriptor beside it, over a 28px-padded hairline.
 */
export default async function WorkPage() {
  const statuses = await getAllStatuses();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbs([{ name: 'Work', path: '/work' }]),
          workItemList(),
        )}
      />

      <PageHero
        eyebrow="Our Work"
        headline="Everything here is running right now."
        description="Not screenshots of things that used to work. Eight live builds — click into any one and open it yourself."
      />

      <div>
        <div className="tg-container">
          <GroupHead title="Case Studies" note="The deep-dive builds" />
        </div>
        {caseStudies.map((entry, i) => (
          <CaseStudyRow key={entry.slug} entry={entry} status={statuses[entry.slug]!} index={i} />
        ))}
      </div>

      <div className="tg-container mt-16 pb-32">
        <GroupHead title="Projects" note="Lighter builds, same standard" />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((entry, i) => (
            <ProjectCard key={entry.slug} entry={entry} status={statuses[entry.slug]!} index={i} />
          ))}
        </div>
      </div>

      <ClosingCta />
    </>
  );
}

function GroupHead({ title, note }: { title: string; note: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-border pb-7">
      <h2 className="text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] uppercase">{title}</h2>
      <span className="text-[0.875rem] text-secondary">{note}</span>
    </div>
  );
}
