import { ImageResponse } from 'next/og';
import { STRIPE_ORDER, ALL_ACCENTS, type AccentKey } from '@/config/solutions';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

/**
 * Shared OG card renderer.
 *
 * next/og runs Satori, which has no CSS cascade and no access to the site's
 * tokens — so this is the one place raw hex is unavoidable. The values still
 * come from config/solutions.ts rather than being retyped, so the accent
 * mapping stays single-source even here.
 *
 * Each /work/[slug] gets its own card with the build name, its solution line,
 * and that line's accent — eight distinct link previews instead of one generic
 * image, which matters because outbound is the actual lead channel.
 */
export function ogCard({
  eyebrow,
  title,
  accentKey,
}: {
  eyebrow: string;
  title: string;
  accentKey?: AccentKey;
}) {
  // The card is always on white, and the eyebrow is small bold text — so this
  // takes the `-text` variant, not the plain accent. Plain amber would land at
  // 2.1:1 here; the variant is 5.92:1.
  const accentHex = accentKey ? ALL_ACCENTS[accentKey].textHex : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#FFFFFF',
          padding: '72px 80px 96px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Connected Nodes — the one brand mark, same geometry as everywhere else.
            The connectors use border-strong (#D1D5DB) rather than the hairline
            token here: at OG scale the hairline is effectively invisible, and a
            mark whose connectors don't read degrades into a scatter of colored
            dots — precisely the wrong-icon failure DESIGN.md calls out. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg width="52" height="52" viewBox="0 0 64 64">
            <line x1="32" y1="12" x2="12" y2="32" stroke="#D1D5DB" strokeWidth="2.5" />
            <line x1="32" y1="12" x2="52" y2="32" stroke="#D1D5DB" strokeWidth="2.5" />
            <line x1="12" y1="32" x2="32" y2="52" stroke="#D1D5DB" strokeWidth="2.5" />
            <line x1="52" y1="32" x2="32" y2="52" stroke="#D1D5DB" strokeWidth="2.5" />
            <circle cx="32" cy="12" r="7" fill="#3B6FE0" />
            <circle cx="52" cy="32" r="7" fill="#7C6FE0" />
            <circle cx="32" cy="52" r="7" fill="#F2A93C" />
            <circle cx="12" cy="32" r="7" fill="#2FA679" />
          </svg>
          <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', color: '#111111' }}>
            TEKGUYZ
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: accentHex ?? '#6A717E',
              marginBottom: 24,
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#111111',
              maxWidth: 940,
            }}
          >
            {title}
          </span>
        </div>

        {/* The signature stripe, genuinely full-bleed along the bottom edge. */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            display: 'flex',
            height: 10,
            width: '100%',
          }}
        >
          {STRIPE_ORDER.map((key) => (
            <div key={key} style={{ flex: 1, background: ALL_ACCENTS[key].hex }} />
          ))}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
