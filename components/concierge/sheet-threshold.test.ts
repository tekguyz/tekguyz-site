import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * D-04's sheet threshold, pinned to both arms.
 *
 * `SHEET_QUERY` is a module-private literal inside a `'use client'` component,
 * so this reads the source the same way `panel-motion.test.ts` reads
 * `globals.css` — the point is to pin a value that no linter and no type check
 * can see, not to exercise React.
 *
 * The pair exists because NEITHER arm alone is sufficient, and each of the two
 * viewports below is the case the other arm misses:
 *
 *   844 x 390 — a phone held sideways. Height arm only; it is WIDER than 768px,
 *     so a width-keyed threshold misses it entirely. This is M-03 (blocking),
 *     which is why the height arm never comes out under any refactor.
 *   390 x 844 — a tall portrait phone. Width arm only; it clears 560px of
 *     height, a case the height arm legitimately cannot cover.
 *
 * 1440 x 900 pins the other side: above the threshold the non-modal contract
 * holds, so a query that accidentally matched everywhere would fail here.
 */
const SOURCE = join(import.meta.dirname, 'concierge.tsx');

function sheetQuery(): string {
  const src = readFileSync(SOURCE, 'utf8');
  const m = src.match(/const SHEET_QUERY = '([^']+)';/);
  if (!m) throw new Error('SHEET_QUERY literal not found in concierge.tsx');
  return m[1];
}

/**
 * Evaluates the comma-separated media query against a viewport. A comma in a
 * media query list IS the OR, so each arm is tested independently and any match
 * wins — the same semantics `window.matchMedia` applies.
 */
function matches(query: string, width: number, height: number): boolean {
  return query.split(',').some((arm) => {
    const f = arm.trim().match(/^\((max-width|max-height):\s*(\d+)px\)$/);
    if (!f) throw new Error(`unrecognised media feature: ${arm.trim()}`);
    const value = Number(f[2]);
    return f[1] === 'max-width' ? width <= value : height <= value;
  });
}

describe('concierge sheet threshold (D-04)', () => {
  it('carries both arms, as an OR', () => {
    expect(sheetQuery()).toBe('(max-height: 560px), (max-width: 767px)');
  });

  it('sheets a phone held sideways — the height arm, M-03', () => {
    const q = sheetQuery();
    expect(matches(q, 844, 390)).toBe(true);
    // The arm that catches it is height. A width-only threshold would not.
    expect(matches('(max-width: 767px)', 844, 390)).toBe(false);
  });

  it('sheets a tall portrait phone — the width arm', () => {
    const q = sheetQuery();
    expect(matches(q, 390, 844)).toBe(true);
    // The arm that catches it is width. A height-only threshold would not.
    expect(matches('(max-height: 560px)', 390, 844)).toBe(false);
  });

  it('leaves the desktop non-modal contract alone', () => {
    expect(matches(sheetQuery(), 1440, 900)).toBe(false);
  });
});
