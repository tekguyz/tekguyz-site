import Link from 'next/link';
import type { CSSProperties } from 'react';
import { accentForSolution } from '@/config/solutions';
import { solutions } from '@/content/solutions';

/**
 * The four Solutions as Seam lamp fields: big flat blocks in the four lamps,
 * sitting on the seam between the ink hero and the paper below. Name in
 * lettering, the Solution's one-line hook, an arrow. Text on a lamp is always
 * ink. Replaces the Solution rows and tag dots that used to sit lower on Home.
 *
 * The page's one animated moment: the fields rise in on load, `--lamp-stagger`
 * (60ms) apart, and lift 8px on hover. `--i` feeds the delay. All of it lives
 * in `.tg-lampfield` in globals.css and stops under reduced motion.
 */
export function LampFields() {
  return (
    <section aria-label="What We Do" className="tg-seam-row">
      <div className="tg-container">
        <ul className="tg-lamps m-0 list-none p-0">
          {solutions.map((s, i) => (
            <li key={s.slug} className="flex">
              <Link
                href={`/solutions/${s.slug}`}
                className="tg-lampfield w-full"
                style={{ background: accentForSolution(s.slug).dot, '--i': i } as CSSProperties}
              >
                <span>
                  <span className="block font-[family-name:var(--font-lettering)] text-[1.9rem] leading-[0.95] font-extrabold uppercase [font-stretch:75%]">
                    {s.name}
                  </span>
                  <span className="mt-3 block max-w-[28ch] text-[16px] leading-[1.45]">
                    {s.hook}
                  </span>
                </span>
                <span aria-hidden className="text-[22px] leading-none font-bold">
                  &rarr;
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
