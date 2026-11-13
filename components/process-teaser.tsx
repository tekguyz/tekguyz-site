import Link from 'next/link';
import { SectionHead } from '@/components/page-hero';
import { processSteps } from '@/content/process';

/**
 * Home's Process teaser, Seam form: a four-step list ruled by a 2px line.
 * The numbers stay because the order matters; they are mono, small and mute.
 * Copy is COPY.md's "Process teaser" block verbatim.
 */
export function ProcessTeaser() {
  return (
    <section className="py-20 md:py-28">
      <SectionHead
        eyebrow="How We Work"
        headline="How We Work"
        description="Four steps. No surprises. No disappearing acts."
      />
      <ol className="tg-container mt-12 grid list-none grid-cols-1 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((s, i) => (
          <li key={s.title} className="tg-steps pt-6 pb-8 md:pr-6">
            <span aria-hidden className="label text-mute mb-3 block tabular-nums">
              {i + 1}
            </span>
            <h3 className="text-[1.6rem]">{s.title}</h3>
            <p className="text-secondary mt-2 max-w-[30ch] text-[16px] leading-[1.5]">
              {s.teaser}
            </p>
          </li>
        ))}
      </ol>
      <div className="tg-container mt-10">
        <Link
          href="/process"
          className="tap-44 text-fg text-[16px] font-bold underline decoration-2 underline-offset-[6px]"
        >
          See our full process →
        </Link>
      </div>
    </section>
  );
}
