import Link from 'next/link';
import { LogoLockup } from '@/components/logo-lockup';
import { SignatureStripe } from '@/components/signature-stripe';
import { AccentDot } from '@/components/solution-tag';
import { solutions } from '@/content/solutions';
import { site } from '@/lib/site';

/**
 * DESIGN.md §4 — always dark regardless of the toggle, always bg-dark,
 * separated by a persistent 1px border-dark top border.
 *
 * Structure: masthead (lockup + tagline left, social row right)
 *   -> hairline divider -> 3-column nav -> bottom bar -> signature stripe.
 *
 * Masthead padding is 40/32 — deliberately much tighter than section rhythm.
 * Column headings and the bottom bar use muted-dark, never a bare hex.
 *
 * The bottom bar carries the copyright and the Privacy link ONLY. The reference
 * render repeats the tagline on the right there; nothing belongs in that slot.
 */

const SOCIALS = [
  {
    href: site.social.linkedin,
    label: 'LinkedIn',
    path: 'M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68Z',
  },
  {
    href: site.social.instagram,
    label: 'Instagram',
    path: 'M12 2.2c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85C2.42 3.92 3.93 2.38 7.15 2.23 8.42 2.21 8.8 2.2 12 2.2Zm0 5.6a4.2 4.2 0 1 0 0 8.4 4.2 4.2 0 0 0 0-8.4Zm0 6.93a2.73 2.73 0 1 1 0-5.46 2.73 2.73 0 0 1 0 5.46Zm4.36-8.11a.98.98 0 1 0 0 1.96.98.98 0 0 0 0-1.96Z',
  },
  {
    href: site.social.facebook,
    label: 'Facebook',
    path: 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.24 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22C18.34 21.24 22 17.08 22 12.06Z',
  },
  {
    href: site.social.github,
    label: 'GitHub',
    path: 'M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10Z',
  },
];

export function FooterDark() {
  return (
    <footer className="footer-dark border-t" style={{ borderTopColor: '#2A2A2C' }}>
      {/* Masthead — 40/32, deliberately not section rhythm. */}
      <div className="tg-container">
        <div className="flex flex-col gap-6 pt-10 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <LogoLockup size={30} withTagline />

          <ul className="m-0 flex list-none items-center gap-1 p-0">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] text-secondary transition-colors duration-[var(--dur-base)] hover:text-[#F5F5F5] focus-visible:text-[#F5F5F5]"
                >
                  {/* One consistent set, monochrome, never brand-colored. */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <hr className="m-0 border-0 border-t" style={{ borderTopColor: '#2A2A2C' }} />

        {/* 3-column nav */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-3">
          <div>
            <h2 className="mb-4 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
              Solutions
            </h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {solutions.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/solutions/${s.slug}`}
                    className="link-underline inline-flex items-center gap-[10px] text-[0.875rem] text-[#F5F5F5]"
                  >
                    <AccentDot solution={s.slug} size={8} />
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
              Company
            </h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {[
                { href: '/work', label: 'Work' },
                { href: '/process', label: 'Process' },
                { href: '/contact', label: 'Contact' },
                { href: '/privacy', label: 'Privacy' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="link-underline inline-flex text-[0.875rem] text-[#F5F5F5]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-secondary uppercase">
              Get In Touch
            </h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[0.875rem]">
              <li>
                <a
                  href={`mailto:${site.publicEmail}`}
                  className="link-underline inline-flex text-[#F5F5F5]"
                >
                  {site.publicEmail}
                </a>
              </li>
              <li className="text-secondary">{site.location}</li>
              <li className="text-secondary">{site.hours}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar — copyright and Privacy link only. Nothing else belongs here. */}
        <hr className="m-0 border-0 border-t" style={{ borderTopColor: '#2A2A2C' }} />
        <div className="flex flex-col gap-2 py-6 text-[0.875rem] text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} TEKGUYZ. Built by TEKGUYZ.</p>
          <Link href="/privacy" className="link-underline inline-flex self-start sm:self-auto">
            Privacy
          </Link>
        </div>
      </div>

      <SignatureStripe />
    </footer>
  );
}
