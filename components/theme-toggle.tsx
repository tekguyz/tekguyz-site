'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * 38x38, 1px hairline border, 6px radius, muted glyph that goes ink on hover
 * alongside the border darkening to border-strong.
 *
 * The two SVGs are copied exactly from the design export: 18px, viewBox 0 0 24
 * 24, fill none, stroke currentColor, stroke-width 1.75, round caps and joins.
 * The moon shows while light is active (it's the action, not the state); the
 * sun shows while dark is active.
 *
 * The mounted guard only picks the glyph — every color on the site resolves
 * through CSS custom properties, so no color logic is gated on JS state.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={
        'flex h-[38px] w-[38px] flex-none cursor-pointer items-center justify-center rounded-[6px] ' +
        'border border-border text-secondary transition-[border-color,color] duration-[240ms] ' +
        'hover:border-border-strong hover:text-fg ' +
        (className ?? '')
      }
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden
        style={{
          display: 'block',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.75,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
      >
        {isDark ? (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.7v2.2M12 19.1v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.7 12h2.2M19.1 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
          </>
        ) : (
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        )}
      </svg>
    </button>
  );
}
