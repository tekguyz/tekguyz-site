import Link from 'next/link';
import { HomeHero } from '@/components/home-hero';
import { LampFields } from '@/components/lamp-fields';
import { SectionHead } from '@/components/page-hero';
import { FoldBoard } from '@/components/fold-board';
import { Frame } from '@/components/live-frame';
import { StatusLine } from '@/components/status-line';
import { PullQuote } from '@/components/pull-quote';
import { SolutionTag } from '@/components/solution-tag';
import { ClosingCta } from '@/components/closing-cta';
import { ProcessTeaser } from '@/components/process-teaser';
import { featured, foldBoard, getWork, heroSlug, type CaseStudy } from '@/content/work';
import { getAllStatuses, type StatusResult } from '@/lib/status';
import { buildMetadata, jsonLd, professionalService } from '@/lib/seo';

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
 *   paper  the fold's build rows, the two featured builds, the four steps
 *   ink    the closing band, then the footer
 *
 * The four Solutions moved up from below the build board to sit on the seam:
 * that is where Seam puts them, and they replace the Solution rows.
 */
export default async function HomePage() {
  const statuses = await getAllStatuses();
  // Missed Call Follow-Up since 2026-11-11 (founder). `heroSlug` in content/work.ts.
  const hero = getWork(heroSlug)!;

  return (
    // One root element, never a multi-child fragment: Next scrolls the new
    // segment into view on every client-side transition, and a fragment calls
    // scrollIntoView() on EVERY top-level child. Mechanism in full:
    // app/contact/page.tsx. Keep the JSON-LD script inside the wrapper.
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(professionalService())}
      />

      <HomeHero
        poster={hero.heroPoster ?? hero.poster}
        posterMobile={hero.heroPosterMobile}
        url={hero.url}
        alt={hero.alt}
        media={hero.heroMedia}
        status={statuses[hero.slug]!}
      />

      <LampFields />

      {/* The fold's proof: four live builds as build rows. */}
      <section className="pt-16 pb-20 md:pt-20 md:pb-28">
        <FoldBoard entries={foldBoard} statuses={statuses} />
      </section>

      {/* Featured Work — the two deep builds, on paper with the rest of the
          proof. Ruled off from the board above by a 2px line. */}
      <section className="py-20 md:py-28">
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
          ? '[grid-row:1] [grid-column:8/13] max-lg:[grid-column:6/9]'
          : '[grid-row:1] [grid-column:1/6] max-lg:[grid-column:1/4]'
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
          ? '[grid-row:1] [grid-column:1/7] max-lg:[grid-column:1/5]'
          : '[grid-row:1] [grid-column:7/13] max-lg:[grid-column:5/9]'
      }
    >
      <Frame poster={entry.poster} alt={entry.alt} />
    </div>
  );

  return (
    // DOM order is READING order — text, then media — on every row. The
    // alternation rides on `grid-column`, both halves pinned to `grid-row: 1`.
    <article
      className={`tg-container tg-grid tg-split items-center ${index === 0 ? 'mt-12 md:mt-16 border-b border-border pb-16 md:pb-20' : 'pt-16 md:pt-20'}`}
    >
      {text}
      {media}
    </article>
  );
}
