import { ImageResponse } from 'next/og';
import { STRIPE_ORDER, ALL_ACCENTS, type AccentKey } from '@/config/solutions';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

/**
 * Shared OG card renderer, Seam form.
 *
 * next/og runs Satori, which has no CSS cascade and no access to the site's
 * tokens — so this is the one place raw hex is unavoidable. Lamp values still
 * come from config/solutions.ts rather than being retyped, so the Solution
 * mapping stays single-source even here.
 *
 * Both grounds, like every page: an ink block with the mark, the Solution line
 * (its lamp dot, then the label in white) and the title in white caps; a paper
 * band under a straight seam with the ink wordmark; the four-lamp stripe along
 * the bottom edge. A lamp is never text on paper, so the label stays white.
 *
 * Each /work/[slug] gets its own card with the build name and its Solution
 * line — distinct link previews, because outbound is the actual lead channel.
 */
const INK = '#0B0B0C';
const PAPER = '#FFFFFF';
const ON_INK_SOFT = '#B4B8C0';
const MUTE_ON_INK = '#8A8F98';

export function ogCard({
  eyebrow,
  title,
  accentKey,
}: {
  eyebrow: string;
  title: string;
  accentKey?: AccentKey;
}) {
  const lamp = accentKey ? ALL_ACCENTS[accentKey].hex : undefined;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: PAPER,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: INK,
            padding: '64px 80px 56px',
          }}
        >
          <svg width="52" height="52" viewBox="0 0 64 64">
            <line x1="32" y1="12" x2="12" y2="32" stroke={MUTE_ON_INK} strokeWidth="2.5" />
            <line x1="32" y1="12" x2="52" y2="32" stroke={MUTE_ON_INK} strokeWidth="2.5" />
            <line x1="12" y1="32" x2="32" y2="52" stroke={MUTE_ON_INK} strokeWidth="2.5" />
            <line x1="52" y1="32" x2="32" y2="52" stroke={MUTE_ON_INK} strokeWidth="2.5" />
            <circle cx="32" cy="12" r="7" fill={ALL_ACCENTS.blue.hex} />
            <circle cx="52" cy="32" r="7" fill={ALL_ACCENTS.violet.hex} />
            <circle cx="32" cy="52" r="7" fill={ALL_ACCENTS.amber.hex} />
            <circle cx="12" cy="32" r="7" fill={ALL_ACCENTS.teal.hex} />
          </svg>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              {lamp && (
                <div style={{ width: 18, height: 18, borderRadius: 999, background: lamp }} />
              )}
              <span style={{ fontSize: 24, fontWeight: 700, color: ON_INK_SOFT }}>{eyebrow}</span>
            </div>
            <span
              style={{
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 0.98,
                textTransform: 'uppercase',
                color: PAPER,
                maxWidth: 1000,
              }}
            >
              {title}
            </span>
          </div>
        </div>

        <div
          style={{
            height: 110,
            display: 'flex',
            alignItems: 'center',
            padding: '0 80px',
            background: PAPER,
          }}
        >
          <span style={{ fontSize: 34, fontWeight: 800, color: INK }}>TEKGUYZ</span>
        </div>

        <div style={{ display: 'flex', height: 10, width: '100%' }}>
          {STRIPE_ORDER.map((key) => (
            <div key={key} style={{ flex: 1, background: ALL_ACCENTS[key].hex }} />
          ))}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
