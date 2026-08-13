import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeColorMeta } from '@/components/theme-color';
import { Nav } from '@/components/nav';
import { FooterDark } from '@/components/footer-dark';
import { Concierge } from '@/components/concierge/concierge';
import { RevealController } from '@/components/reveal';
import { site } from '@/lib/site';

/**
 * metadataBase is set once here, hardcoded to the production URL rather than an
 * env var (CANONICAL §7b — one less thing to misconfigure per environment).
 * Pages never resolve image URLs independently.
 *
 * No fallback description on this object: every route defines its own, so a
 * root-level default would be dead code that is never served.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'TEKGUYZ | Smart Operations & AI Systems', template: '%s' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.webmanifest',
};

/**
 * The value in the SERVER-RENDERED html, and deliberately the light one with no
 * `prefers-color-scheme` arm: `defaultTheme` is light and `enableSystem` is
 * false, so light is what a first-time visitor gets regardless of their OS. A
 * dark arm here would paint the browser chrome dark for an OS-dark visitor who
 * is looking at the light site.
 *
 * `ThemeColorMeta` overwrites this after hydration for a returning visitor whose
 * stored theme is dark. That leaves one frame of white chrome on their first
 * paint — the same class of flash next-themes' own blocking script exists to
 * prevent for the page, which cannot be reached from here without inlining a
 * second script of our own.
 */
export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      // next-themes writes the class before paint; suppress the expected
      // server/client mismatch on <html> only.
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <ThemeProvider>
          {/* Inside the provider — it reads `resolvedTheme` from that context. */}
          <ThemeColorMeta />
          <a
            href="#main"
            className="sr-only rounded-[8px] bg-cta-bg px-4 py-3 text-cta-fg focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100]"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main">{children}</main>
          <FooterDark />
          <Concierge />
          {/* Adds the hidden state and observes; content is visible without it. */}
          <RevealController />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
