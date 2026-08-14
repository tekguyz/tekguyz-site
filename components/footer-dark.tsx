import Link from 'next/link';
import { ConnectedNodes } from '@/components/logo-lockup';
import { SignatureStripe } from '@/components/signature-stripe';
import { solutions } from '@/content/solutions';
import { accentForSolution } from '@/config/solutions';
import { site } from '@/lib/site';

/**
 * Always dark regardless of the toggle, separated by a persistent 1px top
 * border in the scope's own `--tg-border`.
 *
 * Structure per the export: masthead (40px top padding, 40px mark + 26px
 * wordmark + tagline left, 44x44 social row right) -> hairline -> 3-column nav
 * on the 12-col grid (1/5, 5/9, 9/13) -> bottom bar -> signature stripe.
 *
 * The bottom bar carries the copyright ONLY. No second Privacy link, no
 * repeated tagline — Privacy already lives in the Company column, and the
 * reference render's duplicate was wrong.
 *
 * EVERY colour here reads the `.footer-dark` scope root in globals.css — which
 * is what the previous version of this line CLAIMED while the file carried four
 * bare hexes. Two of them (#9CA3AF for the tagline, location, hours and the
 * social row) had drifted off the scope's own `--tg-secondary`, so the footer
 * shipped two different secondary greys; it is now the one muted-dark.
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

const HAIRLINE = 'var(--tg-border)';

export function FooterDark() {
  return (
    <footer className="footer-dark border-t" style={{ borderTopColor: HAIRLINE }}>
      <div className="tg-container pt-10">
        {/* Masthead.

            M-05: below the wrap point the social row drops under the tagline
            and the 48px `gap-12` — sized for the side-by-side arrangement —
            became a wide empty band. The LEFT ALIGNMENT is correct and is not
            the defect (DESIGN.md §9 left-anchors everything but the closing
            CTA, so a wrapped social row belongs at the lockup's `left: 24px`).
            Only the row gap is. 24px below 767 makes the stack read as a
            deliberate group, and stays tighter than the 32px that follows it
            down to the divider, which is what groups it with the lockup rather
            than with the nav. Column gap is untouched, so the un-wrapped
            arrangement at >=767 is byte-identical. */}
        <div className="flex flex-wrap items-start justify-between gap-12 max-[766px]:gap-y-6">
          <div className="flex items-start gap-4">
            <ConnectedNodes size={40} stroke={HAIRLINE} />
            <div>
              <p className="text-fg text-[26px] leading-[1.1] font-extrabold tracking-[-0.03em]">
                TEKGUYZ
              </p>
              <p className="text-secondary mt-[10px] text-[0.875rem] leading-[1.55]">
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
                className="text-secondary hover:text-fg focus-visible:text-fg flex h-11 w-11 items-center justify-center transition-colors duration-[120ms]"
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
              (136px) and the email address (126px) both need the wide one.

              M-10, and the arithmetic is the whole decision. The links are
              22.4px tall, so a 44px target needs 10.8px above AND below. At the
              shipped `gap: 12px` two vertically adjacent links would each grow
              10.8px into a 12px gap and OVERLAP BY 9.6px — two invisible
              targets fighting, resolved by source order, so tapping `Process`
              could land on `Work`. That is worse than the 22px target it
              replaces, because at least a small target can be aimed at.

              Resolution (a) of the two permitted: widen the column gap to
              **22px** so the 44px targets tile without touching. 10.8 + 10.8 =
              21.6 against 22.0 — 0.4px of clearance, hit-tested at all 7
              viewports. Resolution (b), real padding on each link, would have
              cost 74px of footer height per column instead of 30px, and
              DESIGN.md §4 is explicit that this row must not inherit
              section-level spacing. 22px is the tightest value that works. */}
          <div className="[grid-column:1/5] max-lg:[grid-column:1/4]">
            <p className="text-secondary mb-5 tg-eyebrow">
              Solutions
            </p>
            <div className="flex flex-col items-start gap-[22px]">
              {solutions.map((s) => (
                <Link
                  key={s.slug}
                  href={`/solutions/${s.slug}`}
                  className="tap-44 text-fg flex items-center gap-3 text-[0.875rem]"
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
            <p className="text-secondary mb-5 tg-eyebrow">
              Company
            </p>
            <div className="flex flex-col items-start gap-[22px]">
              {[
                { href: '/work', label: 'Work' },
                { href: '/process', label: 'Process' },
                { href: '/contact', label: 'Contact' },
                { href: '/privacy', label: 'Privacy' },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="tap-44 link-underline text-fg text-[0.875rem]"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="[grid-column:9/13] max-lg:[grid-column:6/9]">
            <p className="text-secondary mb-5 tg-eyebrow">
              Get In Touch
            </p>
            <div className="flex flex-col items-start gap-[22px] tabular-nums">
              <a
                href={`mailto:${site.publicEmail}`}
                className="tap-44 link-underline text-fg text-[0.875rem]"
              >
                {site.publicEmail}
              </a>
              <span className="text-secondary text-[0.875rem]">{site.location}</span>
              <span className="text-secondary text-[0.875rem]">{site.hours}</span>
            </div>
          </div>
        </div>

        {/* Bottom bar — copyright only. Nothing else belongs here. */}
        <div className="mt-14 border-t py-6" style={{ borderTopColor: HAIRLINE }}>
          <p className="text-secondary text-[0.875rem] tabular-nums">
            &copy; {new Date().getFullYear()} TEKGUYZ. Built by TEKGUYZ.
          </p>
        </div>
      </div>

      <SignatureStripe />
    </footer>
  );
}
