import Link from 'next/link';
import type { CSSProperties } from 'react';
import { accentForSolution } from '@/config/solutions';
import { solutions } from '@/content/solutions';

/**
 * The four Solutions as Seam lamp fields: big flat blocks in the four lamps,
 * sitting on the seam between the ink hero and the paper below. Name in
 * lettering with the arrow beside it, then the Solution's hook. Text on a lamp
 * is always ink. On phones (#80) each field is a short band: the name on one
 * line, the hook in two (the four hooks are written to the same length).
 *
 * `id="solutions"` is where `/solutions` now lands (a 308 in next.config.ts,
 * #80), and where the nav's Solutions link and each Solution page's back link
 * point. Replaces the Solution rows and tag dots that used to sit lower on Home.
 *
 * The page's one animated moment: the fields rise in on load, `--lamp-stagger`
 * (60ms) apart, and lift 8px on hover. `--i` feeds the delay. All of it lives
 * in `.tg-lampfield` in globals.css and stops under reduced motion.
 */
export function LampFields() {
  return (
    <section id="solutions" aria-label="What We Do" className="tg-seam-row scroll-mt-24">
      <div className="tg-container">
        <ul className="tg-lamps m-0 list-none p-0">
          {solutions.map((s, i) => (
            <li key={s.slug} className="flex">
              <Link
                href={`/solutions/${s.slug}`}
                className="tg-lampfield w-full"
                style={{ background: accentForSolution(s.slug).dot, '--i': i } as CSSProperties}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="block font-[family-name:var(--font-lettering)] text-[1.6rem] leading-[0.95] font-extrabold whitespace-nowrap uppercase [font-stretch:75%] min-[520px]:text-[1.9rem] min-[520px]:whitespace-normal">
                    {s.name}
                  </span>
                  <span aria-hidden className="text-[22px] leading-none font-bold">
                    &rarr;
                  </span>
                </span>
                <span className="block max-w-[34ch] text-[15px] leading-[1.45] min-[520px]:text-[16px]">
                  {s.hook}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
