import Link from 'next/link';
import { StatusLine } from '@/components/status-line';
import { SolutionTag } from '@/components/solution-tag';
import type { Project } from '@/content/work';
import type { StatusResult } from '@/lib/status';

/**
 * DESIGN.md §4 — compact, surface-card fill, radius 12px, 24px padding.
 * Tag, title, one description, status line.
 *
 * NO IMAGE, EVER — deliberately removed, don't reintroduce. The size gap from
 * case-study-row is intentional signal about the depth of the build.
 */
export function ProjectCard({ entry, status }: { entry: Project; status: StatusResult }) {
  return (
    <article className="hover-card flex h-full flex-col rounded-[12px] border border-border bg-surface p-6">
      <SolutionTag solution={entry.solution} label={entry.tag} className="self-start" />

      <h3 className="mt-5 text-[length:var(--text-title)] leading-[1.2] font-semibold tracking-[-0.02em]">
        <Link href={`/work/${entry.slug}`} className="link-underline">
          {entry.name}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-[0.875rem] leading-[1.55] text-secondary">{entry.summary}</p>

      <StatusLine result={status} className="mt-6" />
    </article>
  );
}
