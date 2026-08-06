/**
 * THE single source of truth for accent-to-solution mapping.
 *
 * CLAUDE.md hard rule: never hardcode an accent per component or per page.
 * Every dot, tag, pull-quote border, eyebrow, and OG image reads from here.
 *
 * The one documented exception on the whole site is the home ink band, which is
 * dark in both themes and therefore sets its own literal values via the
 * `.ink-band` class in globals.css rather than resolving theme-aware tokens.
 */

export type AccentKey = 'blue' | 'violet' | 'amber' | 'teal';
export type SolutionSlug =
  | 'smart-operations'
  | 'ai-voice-agents'
  | 'business-systems'
  | 'custom-web-apps';

export interface Accent {
  key: AccentKey;
  /** Full accent. Dots use this in both themes and never theme-swap. */
  dot: string;
  /** Accent rendered as small/bold text — resolves per theme. */
  text: string;
  /** 12% tint over the current background, for tag fills. */
  tint: string;
  /** Raw hex, for contexts with no CSS cascade: OG images, favicons, SVG. */
  hex: string;
  /**
   * Raw light-mode `-text` hex. Needed wherever an accent renders as small bold
   * text with no CSS cascade to resolve the token — OG cards being the case
   * that exists. Using `hex` there would fail contrast badly (amber is 2.1:1 on
   * white against this variant's 5.92:1).
   */
  textHex: string;
  /**
   * Raw dark-mode `-text` hex, for surfaces that are dark in BOTH themes (the
   * home ink band, the footer) where a theme-aware token would resolve to the
   * light-mode value whenever the site itself is in light mode.
   */
  darkTextHex: string;
}

const ACCENTS: Record<AccentKey, Accent> = {
  blue: {
    key: 'blue',
    dot: 'var(--tg-accent-blue)',
    text: 'var(--tg-accent-blue-on-bg)',
    tint: 'color-mix(in srgb, var(--tg-accent-blue) 12%, transparent)',
    hex: '#3B6FE0',
    textHex: '#1E3F94',
    darkTextHex: '#5380E4',
  },
  violet: {
    key: 'violet',
    dot: 'var(--tg-accent-violet)',
    text: 'var(--tg-accent-violet-on-bg)',
    tint: 'color-mix(in srgb, var(--tg-accent-violet) 12%, transparent)',
    hex: '#7C6FE0',
    textHex: '#4433A8',
    darkTextHex: '#8377E2',
  },
  amber: {
    key: 'amber',
    dot: 'var(--tg-accent-amber)',
    text: 'var(--tg-accent-amber-on-bg)',
    tint: 'color-mix(in srgb, var(--tg-accent-amber) 12%, transparent)',
    hex: '#F2A93C',
    textHex: '#8A5A0A',
    darkTextHex: '#F2A93C',
  },
  teal: {
    key: 'teal',
    dot: 'var(--tg-accent-teal)',
    text: 'var(--tg-accent-teal-on-bg)',
    tint: 'color-mix(in srgb, var(--tg-accent-teal) 12%, transparent)',
    hex: '#2FA679',
    textHex: '#1D6B4D',
    darkTextHex: '#2FA679',
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
