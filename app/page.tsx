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
import { solutions } from '@/content/solutions';
import { featured, getWork, type CaseStudy } from '@/content/work';
import { processSteps, testimonial } from '@/content/process';
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
        url={hero.url}
        alt={hero.alt}
        status={statuses[hero.slug]!}
      />

      {/* Proof line — a bordered band, one sentence, no card. */}
      <section className="border-y border-border">
        <div className="tg-container py-9">
          <p className="text-[length:var(--text-title)] leading-[1.2] font-semibold tracking-[-0.02em]">
            Eight live builds.{' '}
            <Link href="/work" className="link-underline text-secondary">
              Open any of them right now.
            </Link>
          </p>
        </div>
      </section>

      {/* Solutions — four full-width rows, never a four-card grid. */}
      <section className="py-32">
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
      <section className="ink-band border-y border-border py-32">
        <SectionHead
          eyebrow="Our Work"
          headline="Two we're proud of."
          description="Both are running right now. Open either one and use it yourself."
          onInk
        />
        {featured.map((entry, i) => (
          <BandRow key={entry.slug} entry={entry} status={statuses[entry.slug]!} index={i} />
        ))}
      </section>

      {/* Testimonial — Review schema, no numeric rating (none exists). */}
      <section className="py-32">
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
          closing CTA. Copy is COPY.md's "Process teaser" block verbatim; the
          four condensed lines are the `teaser` field that content/process.ts has
          always carried for exactly this section. No numerals: DESIGN.md §4
          scopes `numeral-device` to /process and nothing else on the site. */}
      <section className="border-t border-border py-32">
        <SectionHead
          eyebrow="How We Work"
          headline="How We Work"
          description="Four steps. No surprises. No disappearing acts."
        />
        {/* Not tg-grid: at the 8-column tablet breakpoint a 12-column `span 3`
            leaves a ragged 2 + 2 with a stray gap. Plain responsive columns. */}
        <div className="tg-container mt-16 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s, i) => (
            <div
              key={s.numeral}
              data-reveal-index={i}
              className="reveal border-t border-border pt-6"
            >
              <h3 className="text-[1.125rem] leading-[1.3] font-semibold tracking-[-0.02em]">
                {s.title}
              </h3>
              <p className="mt-2 text-[0.875rem] leading-[1.55] text-secondary">{s.teaser}</p>
            </div>
          ))}
        </div>
        <div className="tg-container mt-14">
          <Link
            href="/process"
            className="link-underline text-[14.5px] font-semibold text-fg"
          >
            See our full process →
          </Link>
        </div>
      </section>

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
    <div style={{ gridColumn: mediaFirst ? '8 / 13' : '1 / 6' }}>
      <SolutionTag solution={entry.solution} label={entry.tag} onInk />
      <h3
        className="mt-6 text-[length:var(--text-title)] leading-[1.2] font-semibold tracking-[-0.02em] text-[#F5F5F5]"
        style={{ textWrap: 'pretty' }}
      >
        {entry.headline}
      </h3>
      <PullQuote solution={entry.solution} size="band" onInk className="mt-10">
        {entry.pullQuote}
      </PullQuote>
      <StatusLine result={status} onInk className="mt-10" />
      <Link
        href={`/work/${entry.slug}`}
        className="link-underline mt-[22px] inline-block text-[14.5px] font-semibold text-[#F5F5F5]"
      >
        Read the full story →
      </Link>
    </div>
  );

  const media = (
    <div style={{ gridColumn: mediaFirst ? '1 / 7' : '7 / 13' }}>
      <ViewTransition name={`work-${entry.slug}`} share="morph" default="none">
        <div>
          <Frame poster={entry.poster} alt={entry.alt} onInk />
        </div>
      </ViewTransition>
    </div>
  );

  return (
    // `reveal` on the row, never on the halves — DESIGN.md §6 is explicit that
    // Featured Work rows enter text and media as one unit. This is the home
    // band's own row component, distinct from components/case-study-row.tsx,
    // which is why the earlier pass's hook-up missed it entirely.
    <article
      data-reveal-index={index}
      className={`reveal tg-container tg-grid items-center gap-y-12 ${index === 0 ? 'mt-24 border-b border-[#2A2A2C] pb-24' : 'pt-24'}`}
    >
      {mediaFirst ? (
        <>
          {media}
          {text}
        </>
      ) : (
        <>
          {text}
          {media}
        </>
      )}
    </article>
  );
}
