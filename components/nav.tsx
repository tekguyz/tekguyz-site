'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ConnectedNodes } from '@/components/logo-lockup';
import { ThemeToggle } from '@/components/theme-toggle';
import { ButtonLink } from '@/components/button';
import { AccentDot } from '@/components/solution-tag';
import { solutions } from '@/content/solutions';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Sticky, 76px tall. Transparent with no fill and no border at scroll 0; past
 * 24px it fills to 82% opacity with a 14px backdrop blur and the hairline
 * border fades in. Those values live on --tg-nav-* and switch on data-scrolled.
 *
 * The active-page indicator is an animated ::after rule (scaleX from the left,
 * 240ms) sitting 10px below the link — not a static bar. 2px, ink, never accent.
 *
 * The "Let's Talk" CTA is 14px 24px — the only button size in the nav.
 *
 * Mobile: hamburger, full-screen drawer, Solutions expanding inline to the four
 * accent-dot entries, which are four ROUTES (CANONICAL reversed the single
 * anchored page).
 */

const LINKS = [
  { href: '/solutions', label: 'Solutions' },
  { href: '/work', label: 'Work' },
  { href: '/process', label: 'Process' },
  { href: '/contact', label: 'Contact' },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile drawer when the route changes — including on a back/forward
  // navigation, which is why it can't just live in the links' onClick.
  //
  // Adjusting state during render, not from an effect. An effect would commit
  // one render with the drawer still open over the new page and then a second
  // render closing it; React discards this one before it ever paints. This is
  // React's documented "derive state from props" pattern, and it's what
  // react-hooks/set-state-in-effect points at.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setSolutionsOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      data-scrolled={scrolled ? 'true' : 'false'}
      style={{ viewTransitionName: 'site-nav' }}
      // The <header> itself carries no border. An unqualified Tailwind v4
      // `border-b` resolves to currentColor, which painted an opaque ink (light)
      // / near-white (dark) hairline below the 76px bar at EVERY scroll
      // position — doubling the real hairline once scrolled, and sitting
      // directly on the signature stripe that starts flush at the nav's bottom
      // edge. The one specified border lives on the fill layer below, colored
      // by --tg-nav-border so it can fade in with the rest of the scrolled state.
      className="sticky top-0 z-[60] w-full"
    >
      <div
        className="absolute inset-0 -z-10 border-b"
        style={{
          backgroundColor: 'var(--tg-nav-bg)',
          borderBottomColor: 'var(--tg-nav-border)',
          backdropFilter: 'blur(var(--tg-nav-blur))',
          WebkitBackdropFilter: 'blur(var(--tg-nav-blur))',
          transition: 'background-color 240ms, border-color 240ms, backdrop-filter 240ms',
        }}
      />

      <div className="tg-container flex h-[76px] items-center gap-10">
        <Link href="/" aria-label="TEKGUYZ home" className="flex flex-none items-center gap-[11px]">
          <ConnectedNodes size={26} />
          <span className="text-[19px] font-extrabold tracking-[-0.025em]">TEKGUYZ</span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-[34px] md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? 'page' : undefined}
              data-navlink
              data-on={isActive(l.href) ? 'true' : 'false'}
              className="text-[14.5px] font-medium transition-colors duration-[120ms]"
              style={{ color: isActive(l.href) ? 'var(--tg-fg)' : 'var(--tg-secondary)' }}
            >
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
          <ButtonLink href="/contact" size="nav">
            Let&rsquo;s Talk
          </ButtonLink>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-11 w-11 cursor-pointer flex-col items-end justify-center gap-[5px] p-0"
          >
            {open ? (
              <span className="text-[17px] leading-none">✕</span>
            ) : (
              <>
                <span className="block h-[1.5px] w-[22px]" style={{ background: 'var(--tg-fg)' }} />
                <span className="block h-[1.5px] w-[22px]" style={{ background: 'var(--tg-fg)' }} />
              </>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-drawer"
          className="fixed inset-0 top-[76px] z-40 flex flex-col bg-bg md:hidden"
        >
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-[var(--container-pad)] pt-2">
            <div className="border-b border-border py-5">
              <button
                type="button"
                onClick={() => setSolutionsOpen((v) => !v)}
                aria-expanded={solutionsOpen}
                className="flex w-full items-center justify-between text-left text-[2rem] leading-[1.1] font-semibold tracking-[-0.025em]"
              >
                Solutions
                <span aria-hidden className="text-[1.125rem] leading-none text-secondary">
                  {solutionsOpen ? '−' : '+'}
                </span>
              </button>
              {solutionsOpen && (
                <div className="mt-3 flex flex-col">
                  {solutions.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/solutions/${s.slug}`}
                      className="flex h-12 items-center gap-[14px] text-[1.0625rem] text-secondary"
                    >
                      <AccentDot solution={s.slug} size={8} />
                      {s.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {LINKS.filter((l) => l.href !== '/solutions').map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? 'page' : undefined}
                className={cn(
                  'flex h-[72px] items-center border-b border-border text-[2rem] leading-[1.1] font-semibold tracking-[-0.025em]',
                  isActive(l.href) ? 'text-fg' : 'text-fg',
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-none flex-col gap-4 border-t border-border p-6">
            <ButtonLink href="/contact" className="h-[52px] w-full">
              Let&rsquo;s Talk
            </ButtonLink>
            <a
              href={`mailto:${site.publicEmail}`}
              className="link-underline self-start text-[0.875rem] text-secondary"
            >
              {site.publicEmail}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
