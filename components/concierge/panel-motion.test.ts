import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PANEL_DUR, PANEL_EASE } from './panel-motion';

/**
 * `panel-motion.ts` mirrors CSS custom properties that Motion's JS API cannot
 * read. This pins the mirror to the source so the two cannot drift apart
 * silently — the failure mode `nav.tsx:104` is on the STATUS board for, where a
 * hardcoded 240ms agrees with `--dur-base` by coincidence rather than by
 * reference and would keep the old value if the token moved.
 *
 * `bun run test` gates `prebuild`, so drift fails the build rather than
 * shipping a panel animating on a duration the design system retired.
 */

const CSS = readFileSync(join(import.meta.dirname, '../../app/globals.css'), 'utf8');

/**
 * Every declaration of a token, not the first — `--ease-entrance` is declared
 * twice (once in `@theme` for Tailwind, once in `:root`). Reading only one
 * would let the other drift unnoticed, which is the same class of bug this
 * file exists to catch.
 */
function declarations(token: string): string[] {
  const found = [...CSS.matchAll(new RegExp(`--${token}:\\s*([^;]+);`, 'g'))].map((m) =>
    m[1].trim(),
  );
  if (!found.length) throw new Error(`--${token} is not declared in app/globals.css`);
  return found;
}

/** One agreed value across every declaration, or the token is already broken. */
function token(name: string): string {
  const all = declarations(name);
  const unique = [...new Set(all)];
  expect(unique, `--${name} is declared with conflicting values`).toHaveLength(1);
  return unique[0];
}

function ms(name: string): number {
  const value = token(name);
  const match = /^(\d+(?:\.\d+)?)ms$/.exec(value);
  if (!match) throw new Error(`--${name} is "${value}", which is not a plain ms value`);
  return Number(match[1]);
}

function bezier(name: string): number[] {
  const value = token(name);
  const match = /^cubic-bezier\(([^)]+)\)$/.exec(value);
  if (!match) throw new Error(`--${name} is "${value}", which is not a cubic-bezier`);
  return match[1].split(',').map((n) => Number(n.trim()));
}

describe('concierge panel motion mirrors the CSS tokens', () => {
  it('PANEL_DUR.fast is --dur-fast', () => {
    expect(PANEL_DUR.fast * 1000).toBe(ms('dur-fast'));
  });

  it('PANEL_DUR.base is --dur-base', () => {
    expect(PANEL_DUR.base * 1000).toBe(ms('dur-base'));
  });

  it('PANEL_DUR.state is --dur-state', () => {
    expect(PANEL_DUR.state * 1000).toBe(ms('dur-state'));
  });

  it('PANEL_EASE.entrance is --ease-entrance', () => {
    expect([...PANEL_EASE.entrance]).toEqual(bezier('ease-entrance'));
  });

  it('PANEL_EASE.hover is --ease-hover', () => {
    expect([...PANEL_EASE.hover]).toEqual(bezier('ease-hover'));
  });
});

describe('the panel easings cannot overshoot', () => {
  /**
   * The standing v2.2 decision: no easing on this site overshoots. For a
   * cubic-bezier the output stays within [0,1] as long as both control-point
   * y-values do — so this is checkable, and it is checked, because "presence
   * may carry more weight" (DESIGN.md §6.1) is the exact argument someone
   * would use to reach for a spring here.
   */
  it.each([
    ['entrance', PANEL_EASE.entrance],
    ['hover', PANEL_EASE.hover],
  ])('%s holds its control points within [0,1]', (_name, ease) => {
    const [, y1, , y2] = ease;
    expect(y1).toBeLessThanOrEqual(1);
    expect(y2).toBeLessThanOrEqual(1);
    expect(y1).toBeGreaterThanOrEqual(0);
    expect(y2).toBeGreaterThanOrEqual(0);
  });
});
