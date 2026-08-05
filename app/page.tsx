import Link from 'next/link';
import { SignatureStripe } from '@/components/signature-stripe';
import { HomeHero } from '@/components/home-hero';
import { SectionHead } from '@/components/page-hero';
import { SolutionRow } from '@/components/solution-row';
import { CaseStudyRow } from '@/components/case-study-row';
import { ClosingCta } from '@/components/closing-cta';
import { solutions } from '@/content/solutions';
import { featured, getWork } from '@/content/work';
import { processSteps, testimonial } from '@/content/process';
import { getAllStatuses } from '@/lib/status';
import { site } from '@/lib/site';
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
  const contextBuild = getWork(testimonial.contextSlug)!;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(professionalService(), reviewNode())}
      />

      {/* Stripe 1 of 3 — top of hero. */}
      <SignatureStripe />

      <HomeHero
        // The hero's own 16:9 asset, distinct from the compact-context still.
        poster={hero.heroPoster ?? hero.poster}
        url={hero.url}
        alt={hero.alt}
        status={statuses[hero.slug]!}
      />

      {/* Proof line — one sentence, no card. */}
      <section className="pb-24 md:pb-32">
        <div className="tg-container">
          <p className="reveal max-w-[30ch] text-[length:var(--text-title)] leading-[1.2] font-semibold tracking-[-0.02em]">
            Eight live builds.{' '}
            <Link href="/work" className="link-underline text-secondary">
              Open any of them right now.
            </Link>
          </p>
        </div>
      </section>

      {/* Solutions — four full-width rows, never a four-card grid. */}
      <section className="tg-section pt-0">
        <SectionHead
          eyebrow="What We Do"
          headline="What We Do"
          description="Four ways we help operational businesses run smarter."
        />
        <div className="tg-container mt-16">
          {solutions.map((s) => (
            <SolutionRow key={s.slug} solution={s} />
          ))}
          <div className="border-t border-border" />
        </div>
      </section>

      {/* Featured Work — the full-bleed ink band. Ink in BOTH themes; in dark
          mode it's separated from the page by a hairline, not a fill change. */}
      <section className="ink-band border-y border-[#2A2A2C]">
        <div className="tg-section">
          <SectionHead
            eyebrow="Our Work"
            headline="Two we're proud of."
            description="Both are running right now. Open either one and use it yourself."
          />
          <div className="mt-20 flex flex-col gap-28">
            {featured.map((entry, i) => (
              <CaseStudyRow
                key={entry.slug}
                entry={entry}
                status={statuses[entry.slug]!}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial — Review schema, no numeric rating (none exists). */}
      <section className="tg-section">
        <div className="tg-container tg-grid">
          <div className="reveal" style={{ gridColumn: '1 / 6' }}>
            <p className="font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
              What Clients Say
            </p>
          </div>
          <figure className="reveal m-0" style={{ gridColumn: '6 / 13' }}>
            <blockquote className="m-0 max-w-[46ch] text-[length:var(--text-title)] leading-[1.4] font-medium">
              {testimonial.body}
            </blockquote>
            <figcaption className="mt-8 flex flex-col gap-2 text-[0.875rem]">
              <span>
                <strong className="font-semibold">{testimonial.author}</strong>
                <span className="text-secondary"> · {testimonial.source}</span>
              </span>
              <a
                href={site.gbp}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline self-start text-secondary hover:text-fg"
              >
                Read it on Google ↗
              </a>
              <Link
                href={`/work/${contextBuild.slug}`}
                className="link-underline self-start text-secondary hover:text-fg"
              >
                This is the work he&rsquo;s describing →
              </Link>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Process teaser — no numerals here; /process is the only page that
          earns them, because it's the only genuinely ordered sequence. */}
      <section className="tg-section pt-0">
        <SectionHead
          eyebrow="How We Work"
          headline="How We Work"
          description="Four steps. No surprises. No disappearing acts."
        />
        <div className="tg-container reveal-stagger mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[12px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <div key={step.numeral} className="bg-bg p-6">
              <h3 className="text-[length:var(--text-title)] leading-[1.2] font-semibold tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="mt-2 text-[0.875rem] text-secondary">{step.teaser}</p>
            </div>
          ))}
        </div>
        <div className="tg-container mt-10">
          <Link
            href="/process"
            className="link-underline inline-flex text-[0.875rem] font-semibold"
          >
            See our full process →
          </Link>
        </div>
      </section>

      {/* Stripe 2 of 3 lives inside ClosingCta; stripe 3 is in the footer. */}
      <ClosingCta />
    </>
  );
}
