'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogoLockup } from '@/components/logo-lockup';
import { ThemeToggle } from '@/components/theme-toggle';
import { ButtonLink } from '@/components/button';
import { AccentDot } from '@/components/solution-tag';
import { solutions } from '@/content/solutions';
import { cn } from '@/lib/utils';

/**
 * DESIGN.md §4 — sticky. Transparent with no fill and no border at scroll 0.
 * Past 24px: bg at 80% opacity, backdrop-blur(12px), hairline border-bottom
 * fading in over 200ms. Those values live on --tg-nav-* in globals.css and are
 * switched by the data-scrolled attribute, so there is no inline style churn.
 *
 * Active-page indicator: 2px ink underline under the current link, width
 * matching the link, no accent color.
 *
 * Mobile: hamburger, full-screen drawer, Solutions expands inline to the four
 * accent-dot entries — which are now four ROUTES, not anchors (CANONICAL §4
 * reversed the single anchored page).
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

  // Close the drawer on navigation.
  useEffect(() => {
    setOpen(false);
    setSolutionsOpen(false);
  }, [pathname]);

  // Lock body scroll while the full-screen drawer is open.
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
      className="sticky top-0 z-50 w-full"
    >
      <div
        className="w-full border-b transition-[background-color,border-color,backdrop-filter] duration-200"
        style={{
          backgroundColor: 'var(--tg-nav-bg)',
          borderBottomColor: 'var(--tg-nav-border)',
          backdropFilter: 'blur(var(--tg-nav-blur))',
          WebkitBackdropFilter: 'blur(var(--tg-nav-blur))',
        }}
      >
        <div className="tg-container flex h-[72px] items-center justify-between gap-6">
          <Link href="/" aria-label="TEKGUYZ home" className="flex-none">
            <LogoLockup size={26} />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? 'page' : undefined}
                className="relative py-2 text-[0.875rem] font-medium text-secondary transition-colors duration-[var(--dur-base)] hover:text-fg"
                style={isActive(l.href) ? { color: 'var(--tg-fg)' } : undefined}
              >
                {l.label}
                {isActive(l.href) && (
                  <span
                    aria-hidden
                    className="absolute right-0 -bottom-[2px] left-0 h-[2px]"
                    style={{ background: 'var(--tg-fg)' }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex flex-none items-center gap-1 md:gap-2">
            <ThemeToggle />
            <ButtonLink href="/contact" className="hidden md:inline-flex">
              Let&rsquo;s Talk
            </ButtonLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-drawer"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] text-secondary hover:text-fg md:hidden"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden
              >
                {open ? (
                  <path d="M18 6 6 18M6 6l12 12" />
                ) : (
                  <path d="M3 6h18M3 12h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          id="mobile-drawer"
          className="fixed inset-0 top-[72px] z-40 overflow-y-auto bg-bg md:hidden"
        >
          <nav aria-label="Mobile" className="tg-container flex flex-col py-8">
            <button
              type="button"
              onClick={() => setSolutionsOpen((v) => !v)}
              aria-expanded={solutionsOpen}
              className="flex items-center justify-between border-b border-border py-5 text-left text-[length:var(--text-title)] font-semibold"
            >
              Solutions
              <span aria-hidden className="text-secondary">
                {solutionsOpen ? '−' : '+'}
              </span>
            </button>

            {solutionsOpen && (
              <ul className="m-0 list-none border-b border-border py-2 pl-1">
                {solutions.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/solutions/${s.slug}`}
                      className="flex items-center gap-3 py-3 text-[1.0625rem] text-secondary"
                    >
                      <AccentDot solution={s.slug} size={8} />
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {LINKS.filter((l) => l.href !== '/solutions').map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? 'page' : undefined}
                className={cn(
                  'border-b border-border py-5 text-[length:var(--text-title)] font-semibold',
                  isActive(l.href) ? 'text-fg' : 'text-secondary',
                )}
              >
                {l.label}
              </Link>
            ))}

            <ButtonLink href="/contact" className="mt-8 w-full">
              Let&rsquo;s Talk
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  );
}
