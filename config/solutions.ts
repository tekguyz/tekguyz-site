/**
 * THE single source of truth for accent-to-solution mapping.
 *
 * CLAUDE.md hard rule: never hardcode an accent per component or per page.
 * Every dot, tag, pull-quote border, eyebrow, and OG image reads from here.
 *
 * Seam lamp values (tekguyz-one/brand/design). A lamp is a field, a dot or the
 * stripe. Text on a lamp is always ink, and a lamp is never text on paper.
 */

export type AccentKey = 'blue' | 'violet' | 'amber' | 'teal';
export type SolutionSlug =
  | 'smart-operations'
  | 'ai-voice-agents'
  | 'business-systems'
  | 'custom-web-apps';

export interface Accent {
  key: AccentKey;
  /** The lamp. Fields, dots and the stripe. */
  dot: string;
  /** Text that labels this Solution. The ground's own text colour: a lamp is
   *  never text on paper, so the lamp shows as the dot beside it instead. */
  text: string;
  /** 12% tint over the current background, for tag fills. */
  tint: string;
  /** Raw hex, for contexts with no CSS cascade: OG images, favicons, SVG. */
  hex: string;
  /** Raw hex for a Solution label on paper with no cascade (OG cards): ink,
   *  because a lamp is never text on paper. */
  textHex: string;
  /** Raw hex for a Solution label on ink with no cascade: the lamp itself,
   *  which passes on ink (6.3:1 and up). */
  darkTextHex: string;
}

const ACCENTS: Record<AccentKey, Accent> = {
  blue: {
    key: 'blue',
    dot: 'var(--lamp-blue)',
    text: 'var(--tg-fg)',
    tint: 'color-mix(in srgb, var(--lamp-blue) 12%, transparent)',
    hex: '#5B8DFF',
    textHex: '#0B0B0C',
    darkTextHex: '#5B8DFF',
  },
  violet: {
    key: 'violet',
    dot: 'var(--lamp-violet)',
    text: 'var(--tg-fg)',
    tint: 'color-mix(in srgb, var(--lamp-violet) 12%, transparent)',
    hex: '#9B8CFF',
    textHex: '#0B0B0C',
    darkTextHex: '#9B8CFF',
  },
  amber: {
    key: 'amber',
    dot: 'var(--lamp-amber)',
    text: 'var(--tg-fg)',
    tint: 'color-mix(in srgb, var(--lamp-amber) 12%, transparent)',
    hex: '#FFB938',
    textHex: '#0B0B0C',
    darkTextHex: '#FFB938',
  },
  teal: {
    key: 'teal',
    dot: 'var(--lamp-teal)',
    text: 'var(--tg-fg)',
    tint: 'color-mix(in srgb, var(--lamp-teal) 12%, transparent)',
    hex: '#35C48D',
    textHex: '#0B0B0C',
    darkTextHex: '#35C48D',
  },
};

/** Locked mapping. Solution line -> accent. Never reorder, never extend to a 5th. */
export const SOLUTION_ACCENT: Record<SolutionSlug, AccentKey> = {
  'smart-operations': 'blue',
  'ai-voice-agents': 'violet',
  'business-systems': 'amber',
  'custom-web-apps': 'teal',
};

/**
 * Fixed order for the signature stripe, the flourish mark, and the concierge's
 * thinking indicator: blue -> violet -> amber -> teal. Never reordered.
 */
export const STRIPE_ORDER: AccentKey[] = ['blue', 'violet', 'amber', 'teal'];

export function accent(key: AccentKey): Accent {
  return ACCENTS[key];
}

export function accentForSolution(slug: SolutionSlug): Accent {
  return ACCENTS[SOLUTION_ACCENT[slug]];
}

export const ALL_ACCENTS = ACCENTS;
