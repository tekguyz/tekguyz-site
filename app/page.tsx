import Link from 'next/link';
import { ViewTransition } from 'react';
import { SignatureStripe } from '@/components/signature-stripe';
import { HomeHero } from '@/components/home-hero';
import { SectionHead } from '@/components/page-hero';
import { SolutionRow } from '@/components/solution-row';
import { Frame } from '@/components/live-frame';
import { StatusLine } from '@/components/status-line';
import { PullQuote } from '@/components/pull-quote';
import { SolutionTag } from '@/components/solution-tag';
import { Testimonial } from '@/components/testimonial';
import { ClosingCta } from '@/components/closing-cta';
import { ProcessTeaser } from '@/components/process-teaser';
import { solutions } from '@/content/solutions';
import { featured, getWork, type CaseStudy } from '@/content/work';
import { testimonial } from '@/content/process';
import { getAllStatuses, type StatusResult } from '@/lib/status';
import { buildMetadata, jsonLd, professionalService, reviewNode } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'TEKGUYZ | Smart Operations & AI Systems',
  description:
    'We build tech that actually works for your business. Smart operations, AI voice agents, and custom web apps designed for measurable impact.',
  path: '',
});

export default async function HomePage() {
  const statuses = await getAllStatuses();
  const hero = getWork('ai-voice-receptionist')!;

  return (
    <div>
    {/* One root element, never a multi-child fragment — Next scrolls the new
        segment into view on every client-side transition, and a fragment routes
        that through FragmentInstance.scrollIntoView(), which calls
        scrollIntoView() on EVERY top-level child. Mechanism in full:
        app/contact/page.tsx. Keep the JSON-LD script inside the wrapper. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(professionalService(), reviewNode())}
      />

      {/* Stripe 1 of 3 — top of hero. */}
      <SignatureStripe />

      <HomeHero
        poster={hero.heroPoster ?? hero.poster}
        posterMobile={hero.heroPosterMobile}
        url={hero.url}
        alt={hero.alt}
        status={statuses[hero.slug]!}
      />

      {/* Proof line — CANONICAL §98, treatment in DESIGN.md §4 `proof-line`.
          Hairlines top and bottom, no fill, no radius: that IS the "no card".
          36px is the band's own padding, not section rhythm — it's a
          rule-to-rule beat between two sections, not a section.

          Two clauses, two scales, one baseline row. The claim is the anchor;
          the invitation is the click, and it is INK, not `muted`. It shipped
          muted, and `link-underline` grows from 0% — it draws nothing at rest —
          so the only actionable element on the proof band had no rest-state
          affordance and was the lighter half of its own sentence. v2.5 fixed
          the colour; the affordance is fixed below with `tg-rule-rest`. */}
      <section className="border-y border-border">
        <div className="tg-container flex flex-wrap items-baseline gap-x-5 gap-y-2 py-9">
          <p className="text-[length:var(--text-title)] leading-[1.2] font-semibold tracking-[-0.02em]">
            Eight live builds.
          </p>
          {/* tap-44, not tap-24: the 24px tier is for links inline in running
              prose, and this one is no longer inside the sentence's `<p>` —
              it's its own element on its own baseline, and it stacks onto its
              own line below 768. Nothing interactive is adjacent, so the
              overlay has nothing to collide with.

              `tg-rule tg-rule-rest`, NOT `link-underline`: v2.5 fixed the
              colour half of this defect and left the affordance half open. The
              site's one state primitive already draws partway, so the rest
              state is a position on the gesture the visitor learns everywhere
              else — 34% at rest, completing to 100% on hover and focus — not a
              second underline mechanism. tap-44 owns ::before, tg-rule ::after;
              one pseudo per job, no collision. */}
          <Link
            href="/work"
            className="tap-44 tg-rule tg-rule-rest text-[length:var(--text-body)] font-semibold"
          >
            Open any of them right now.
          </Link>
        </div>
      </section>

      {/* Solutions — four full-width rows, never a four-card grid. */}
      <section className="py-20 md:py-32">
        <SectionHead
          eyebrow="What We Do"
          headline="What We Do"
          description="Four ways we help operational businesses run smarter."
        />
        <div className="tg-container mt-16">
          {solutions.map((s, i) => (
            <SolutionRow key={s.slug} solution={s} last={i === solutions.length - 1} index={i} />
          ))}
        </div>
      </section>

      {/* Featured Work — the full-bleed ink band. Ink in BOTH themes; in dark
          mode it's separated from the page by a hairline, not a fill change. */}
      <section className="ink-band border-y border-border py-20 md:py-32">
        <SectionHead
          eyebrow="Our Work"
          headline="Two we're proud of."
          description="Both are running right now. Open either one and use it yourself."
        />
        {featured.map((entry, i) => (
          <BandRow key={entry.slug} entry={entry} status={statuses[entry.slug]!} index={i} />
        ))}
      </section>

      {/* Testimonial — Review schema, no numeric rating (none exists). */}
      <section className="py-20 md:py-32">
        <div className="tg-container">
          <p className="mb-10 text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-secondary uppercase">
            What Clients Say
          </p>
          <div className="reveal">
            <Testimonial contextSlug={testimonial.contextSlug} />
          </div>
        </div>
      </section>

      {/* Process teaser — CANONICAL §4 item 7, between Testimonial and the
          closing CTA. Copy is COPY.md's "Process teaser" block verbatim. Now a
          component of its own (Wave 3); treatment and reasoning in DESIGN.md
          §4.17. */}
      <ProcessTeaser />

      <ClosingCta />
    </div>
  );
}

/** A featured-work row on the ink band: tag, title, pull-quote, status, link. */
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
      <SolutionTag solution={entry.solution} label={entry.tag} onInk />
      <h3
        className="text-fg mt-6 text-[length:var(--text-title)] leading-[1.2] font-semibold tracking-[-0.02em]"
        style={{ textWrap: 'pretty' }}
      >
        {entry.headline}
      </h3>
      <PullQuote solution={entry.solution} size="band" className="mt-10">
        {entry.pullQuote}
      </PullQuote>
      <StatusLine result={status} className="mt-10" />
      <Link
        href={`/work/${entry.slug}`}
        className="tap-44 link-underline text-fg mt-[22px] inline-block text-[14.5px] font-semibold"
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
      <ViewTransition name={`work-${entry.slug}`} share="morph" default="none">
        <div>
          <Frame poster={entry.poster} alt={entry.alt} />
        </div>
      </ViewTransition>
    </div>
  );

  return (
    // `reveal` on the row, never on the halves — DESIGN.md §6 is explicit that
    // Featured Work rows enter text and media as one unit. This is the home
    // band's own row component, distinct from components/case-study-row.tsx,
    // which is why the earlier pass's hook-up missed it entirely.
    //
    // DOM order is READING order — text, then media, on every row, whichever
    // side the media takes on desktop. The alternation is now carried entirely
    // by `grid-column`, with both halves pinned to `grid-row: 1` so sparse
    // auto-flow can't push the left-hand item down a row. Swapping the DOM
    // instead put two posters back to back below 768px, where the grid is one
    // column and source order is all that's left of the layout: row 0 ended on
    // its image and row 1 opened with the next one.
    <article
      data-reveal-index={index}
      className={`reveal tg-container tg-grid tg-split items-center ${index === 0 ? 'mt-16 md:mt-24 border-b border-border pb-16 md:pb-24' : 'pt-16 md:pt-24'}`}
    >
      {text}
      {media}
    </article>
  );
}
