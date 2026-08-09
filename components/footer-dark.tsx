import Link from 'next/link';
import { ConnectedNodes } from '@/components/logo-lockup';
import { SignatureStripe } from '@/components/signature-stripe';
import { solutions } from '@/content/solutions';
import { accentForSolution } from '@/config/solutions';
import { site } from '@/lib/site';

/**
 * Always dark regardless of the toggle, separated by a persistent 1px #2A2A2C
 * top border.
 *
 * Structure per the export: masthead (40px top padding, 40px mark + 26px
 * wordmark + tagline left, 44x44 social row right) -> hairline -> 3-column nav
 * on the 12-col grid (1/5, 5/9, 9/13) -> bottom bar -> signature stripe.
 *
 * The bottom bar carries the copyright ONLY. No second Privacy link, no
 * repeated tagline — Privacy already lives in the Company column, and the
 * reference render's duplicate was wrong.
 *
 * Column headings and the copyright use muted-dark, never a bare hex.
 */

const SOCIALS = [
  {
    href: site.social.linkedin,
    label: 'LinkedIn',
    d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z',
    extra: (
      <>
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    href: site.social.instagram,
    label: 'Instagram',
    d: '',
    extra: (
      <>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    href: site.social.facebook,
    label: 'Facebook',
    d: 'M18 2.5h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4v-3a1 1 0 0 1 1-1h3z',
    extra: null,
  },
  {
    href: site.social.github,
    label: 'GitHub',
    d: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 4.44-2.22 4.44-6.15a4.77 4.77 0 0 0-1.38-3.28 4.42 4.42 0 0 0-.08-3.28S16.73 1.65 14 3.5a13.38 13.38 0 0 0-7 0C4.27 1.65 3.36 2.81 3.36 2.81a4.42 4.42 0 0 0-.08 3.28A4.77 4.77 0 0 0 1.9 9.37c0 3.91 1.3 5.8 4.44 6.15A3.37 3.37 0 0 0 5.4 18.13V22',
    extra: null,
  },
];

const HAIRLINE = '#2A2A2C';

export function FooterDark() {
  return (
    <footer className="footer-dark border-t" style={{ borderTopColor: HAIRLINE }}>
      <div className="tg-container pt-10">
        {/* Masthead */}
        <div className="flex flex-wrap items-start justify-between gap-12">
          <div className="flex items-start gap-4">
            <ConnectedNodes size={40} stroke={HAIRLINE} />
            <div>
              <p className="text-[26px] leading-[1.1] font-extrabold tracking-[-0.03em] text-[#F5F5F5]">
                TEKGUYZ
              </p>
              <p className="mt-[10px] text-[0.875rem] leading-[1.55] text-[#9CA3AF]">
                We build tech that actually works.
              </p>
            </div>
          </div>

          {/* Social row — one consistent stroke set, monochrome, never brand-colored. */}
          <div className="-mr-[10px] flex items-center gap-1">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center text-[#9CA3AF] transition-colors duration-[120ms] hover:text-[#F5F5F5] focus-visible:text-[#F5F5F5]"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  aria-hidden
                  style={{
                    display: 'block',
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: 1.75,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                  }}
                >
                  {s.d && <path d={s.d} />}
                  {s.extra}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* 3-column nav on the 12-col grid */}
        <div
          className="tg-grid mt-8 border-t pt-10"
          style={{ borderTopColor: HAIRLINE }}
        >
          {/* 768–1023: 4/4/4 of 12 becomes 3/2/3 of 8. Company gets the narrow
              track because its longest item is `Process` at 51px; Solutions
              (136px) and the email address (126px) both need the wide one. */}
          <div className="[grid-column:1/5] max-lg:[grid-column:1/4]">
            <p className="mb-5 text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-[#747C8B] uppercase">
              Solutions
            </p>
            <div className="flex flex-col items-start gap-3">
              {solutions.map((s) => (
                <Link
                  key={s.slug}
                  href={`/solutions/${s.slug}`}
                  className="flex items-center gap-3 text-[0.875rem] text-[#F5F5F5]"
                >
                  {/* Dots use the real accent from config/solutions.ts and
                      never theme-swap — the footer is dark either way. */}
                  <span
                    aria-hidden
                    className="h-[6px] w-[6px] flex-none rounded-full"
                    style={{ background: accentForSolution(s.slug).hex }}
                  />
                  <span className="link-underline">{s.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="[grid-column:5/9] max-lg:[grid-column:4/6]">
            <p className="mb-5 text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-[#747C8B] uppercase">
              Company
            </p>
            <div className="flex flex-col items-start gap-3">
              {[
                { href: '/work', label: 'Work' },
                { href: '/process', label: 'Process' },
                { href: '/contact', label: 'Contact' },
                { href: '/privacy', label: 'Privacy' },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="link-underline text-[0.875rem] text-[#F5F5F5]"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="[grid-column:9/13] max-lg:[grid-column:6/9]">
            <p className="mb-5 text-[0.75rem] leading-[1.4] font-bold tracking-[0.1em] text-[#747C8B] uppercase">
              Get In Touch
            </p>
            <div className="flex flex-col items-start gap-3 tabular-nums">
              <a
                href={`mailto:${site.publicEmail}`}
                className="link-underline text-[0.875rem] text-[#F5F5F5]"
              >
                {site.publicEmail}
              </a>
              <span className="text-[0.875rem] text-[#9CA3AF]">{site.location}</span>
              <span className="text-[0.875rem] text-[#9CA3AF]">{site.hours}</span>
            </div>
          </div>
        </div>

        {/* Bottom bar — copyright only. Nothing else belongs here. */}
        <div className="mt-14 border-t py-6" style={{ borderTopColor: HAIRLINE }}>
          <p className="text-[0.875rem] tabular-nums text-[#747C8B]">
            &copy; {new Date().getFullYear()} TEKGUYZ. Built by TEKGUYZ.
          </p>
        </div>
      </div>

      <SignatureStripe />
    </footer>
  );
}
