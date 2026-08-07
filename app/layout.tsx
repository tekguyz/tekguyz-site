import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
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
