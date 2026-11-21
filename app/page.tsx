import Link from 'next/link';
import { HomeHero } from '@/components/home-hero';
import { LampFields } from '@/components/lamp-fields';
import { SectionHead } from '@/components/page-hero';
import { FoldLinks } from '@/components/fold-board';
import { Frame } from '@/components/live-frame';
import { StatusLine } from '@/components/status-line';
import { PullQuote } from '@/components/pull-quote';
import { SolutionTag } from '@/components/solution-tag';
import { ClosingCta } from '@/components/closing-cta';
import { ProcessTeaser } from '@/components/process-teaser';
import { featured, heroBuilds, type CaseStudy } from '@/content/work';
import { getAllStatuses, type StatusResult } from '@/lib/status';
import { buildMetadata, jsonLd, professionalService, solutionsItemList } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'TEKGUYZ | AI Help for South Florida Small Businesses',
  description:
    'AI help for South Florida small businesses. We answer your phones, cut repeat work and put everything in one place. Free first conversation, flat quote.',
  path: '',
});

/**
 * Home, Seam layout (docs/superpowers/specs/2026-11-12-seam-reskin.md):
 *
 *   ink    hero: the problem and the promise
 *   seam   the four Solutions as lamp fields, straddling the edge
 *   paper  the fold's caption row, the two featured builds, the four steps
 *   ink    the closing band, then the footer
 *
 * The four Solutions moved up from below the build board to sit on the seam:
 * that is where Seam puts them, and they replace the Solution rows.
 */
export default async function HomePage() {
  const statuses = await getAllStatuses();
  // Four builds, picked by button (founder, 2026-11-21). `heroSlugs` in content/work.ts.
  const builds = heroBuilds.map((w) => ({
    slug: w.slug,
    name: w.shortName ?? w.name,
    solution: w.solution,
    url: w.url,
    poster: w.heroPoster ?? w.poster,
    status: statuses[w.slug]!,
  }));

  return (
    // One root element, never a multi-child fragment: Next scrolls the new
    // segment into view on every client-side transition, and a fragment calls
    // scrollIntoView() on EVERY top-level child. Mechanism in full:
    // app/contact/page.tsx. Keep the JSON-LD script inside the wrapper.
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(professionalService(), solutionsItemList())}
      />

      <HomeHero builds={builds} />

      <LampFields />

      {/* The fold's caption row: all builds, the Google review, the location.
          The four build rows above it were removed 2026-11-21 (founder): they
          repeated the four Solution blocks. Its bottom and the band's top are
          one gap with the band's 2px rule in it, not two stacked paddings. */}
      <section className="pt-10 pb-16 md:pt-14 md:pb-20">
        <FoldLinks />
      </section>

      {/* Featured Work — the two deep builds, on paper with the rest of the
          proof. Ruled off from the board above by a 2px line. No bottom
          padding: the process teaser's own top padding is the one gap below
          it (#91). */}
      <section>
        <div className="tg-container">
          <div className="border-t-2 border-fg" />
        </div>
        <div className="pt-12 md:pt-16">
          <SectionHead
            eyebrow="Our Work"
            headline="Two we're proud of."
            description="Both are running right now. Open either one and use it yourself."
          />
        </div>
        {featured.map((entry, i) => (
          <BandRow key={entry.slug} entry={entry} status={statuses[entry.slug]!} index={i} />
        ))}
      </section>

      {/* No review on Home (owner, 2026-11-12); it was retired with Team Performance. */}
      <ProcessTeaser />

      <ClosingCta />
    </div>
  );
}

/** A featured-work row: tag, title, pull-quote, status, link, and the frame. */
function BandRow({
  entry,
  status,
  index,
}: {
  entry: CaseStudy;
  status: StatusResult;
  index: number;
}) {
  const mediaFirst = index % 2 === 1;

  const text = (
    <div
      className={
        mediaFirst
          ? '[grid-row:1] [grid-column:9/13] max-lg:[grid-column:1/-1] lg:pl-6'
          : '[grid-row:1] [grid-column:1/5] max-lg:[grid-column:1/-1] lg:pr-6'
      }
    >
      <SolutionTag solution={entry.solution} label={entry.tag} />
      <h3 className="text-fg mt-4 text-[length:var(--text-subhead)]">{entry.headline}</h3>
      <PullQuote solution={entry.solution} size="row" className="mt-8">
        {entry.pullQuote}
      </PullQuote>
      <StatusLine result={status} className="mt-8" />
      <Link
        href={`/work/${entry.slug}`}
        className="tap-44 text-fg mt-[22px] inline-block text-[16px] font-bold underline decoration-2 underline-offset-[6px]"
      >
        Read the full story →
      </Link>
    </div>
  );

  const media = (
    <div
      className={
        mediaFirst
          ? '[grid-row:1] [grid-column:1/9] max-lg:[grid-column:1/-1]'
          : '[grid-row:1] [grid-column:5/13] max-lg:[grid-column:1/-1]'
      }
    >
      <Frame poster={entry.poster} alt={entry.alt} sizes="(max-width: 1023px) 100vw, 800px" />
    </div>
  );

  return (
    // DOM order is READING order — text, then media — on every row. The
    // alternation rides on `grid-column`, both halves pinned to `grid-row: 1`.
    // Since #91 the picture takes 8 of 12 columns (it read tiny next to /work
    // at 6), and below 1024 the row stacks (`tg-stack-md`), picture full width.
    <article
      className={`tg-container tg-grid tg-split tg-stack-md items-center ${index === 0 ? 'mt-12 md:mt-16 border-b border-border pb-16 md:pb-20' : 'pt-16 md:pt-20'}`}
    >
      {text}
      {media}
    </article>
  );
}
