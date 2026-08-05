'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * DESIGN.md Icon policy — the theme toggle is an icon now, not a text label.
 * A single glyph that swaps on click, thin consistent stroke, single color
 * (muted default, fg on hover), never brand-colored.
 *
 * The mounted guard exists only to pick the right GLYPH — the site's colors are
 * all CSS `dark:` variants, so no color logic is gated on JS state.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] text-secondary transition-colors duration-[var(--dur-base)] hover:text-fg focus-visible:text-fg"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {isDark ? (
          // Moon — shown while dark is active.
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </>
        )}
      </svg>
    </button>
  );
}
