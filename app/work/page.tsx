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

      <section className="pb-32">
        <div className="tg-container">
          <h2 className="reveal font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
            Case Studies
          </h2>
        </div>
        <div className="mt-16 flex flex-col gap-32">
          {caseStudies.map((entry, i) => (
            <CaseStudyRow key={entry.slug} entry={entry} status={statuses[entry.slug]!} index={i} />
          ))}
        </div>
      </section>

      <section className="pb-32">
        <div className="tg-container">
          <h2 className="reveal font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
            Projects
          </h2>
          <div className="reveal-stagger mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {projects.map((entry) => (
              <ProjectCard key={entry.slug} entry={entry} status={statuses[entry.slug]!} />
            ))}
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
