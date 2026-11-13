import type { Metadata, Viewport } from 'next';
import { Archivo, Atkinson_Hyperlegible_Next, Red_Hat_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import './globals.css';
import { Nav } from '@/components/nav';
import { FooterDark } from '@/components/footer-dark';
import { Concierge } from '@/components/concierge/concierge';
import { site } from '@/lib/site';

/**
 * Seam's three faces, self-hosted by `next/font` (downloaded at build time,
 * served from this origin, no request to Google at runtime).
 *
 *   Archivo                     lettering: h1-h3, variable width (wdth axis)
 *   Atkinson Hyperlegible Next  body and buttons
 *   Red Hat Mono                data only: times, status, "sample data"
 */
const lettering = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-lettering',
  display: 'swap',
});

const body = Atkinson_Hyperlegible_Next({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
});

const data = Red_Hat_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-data',
  display: 'swap',
});

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
  title: { default: 'TEKGUYZ | AI Help for South Florida Small Businesses', template: '%s' },
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
 * Seam has one look and no theme switch. Every page opens on the ink ground
 * (the nav and the hero), so the browser's own chrome is ink too.
 */
export const viewport: Viewport = {
  themeColor: '#0b0b0c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lettering.variable} ${body.variable} ${data.variable}`}>
      <body>
        <a
          href="#main"
          data-screen-ok="covered: visually hidden until focused, then z-100 above the sticky header"
          className="sr-only bg-ink px-4 py-3 text-paper focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100]"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <FooterDark />
        <Concierge />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
