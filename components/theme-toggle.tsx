'use client';

import { useTheme } from 'next-themes';

/**
 * 38x38, 1px hairline border, 6px radius, muted glyph that goes ink on hover
 * alongside the border darkening to border-strong.
 *
 * The two SVGs are copied exactly from the design export: 18px, viewBox 0 0 24
 * 24, fill none, stroke currentColor, stroke-width 1.75, round caps and joins.
 * The moon shows while light is active (it's the action, not the state); the
 * sun shows while dark is active.
 *
 * WHICH GLYPH SHOWS IS DECIDED BY CSS, not by React state. This used to render
 * both the glyph and the button's label from a `mounted` flag set in an effect,
 * purely to avoid a hydration mismatch. That is the pattern DESIGN.md §7 rules
 * out ("never gate on useTheme() or mount state when a CSS `dark:` variant
 * solves it"), and React's own set-state-in-effect rule flags it too: the effect
 * fires a second render on every mount for a value CSS already knows, since
 * next-themes puts `.dark` on <html> before paint.
 *
 * The accessible name follows the same rule — two `sr-only` spans, one per
 * theme, with the inactive one at `display:none` so it is not exposed. An
 * `aria-label` string could not have been theme-aware without the state.
 *
 * `resolvedTheme` is still read, but only inside the click handler, where it
 * runs long after mount and cannot desynchronize the markup.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={
        'flex h-[38px] w-[38px] flex-none cursor-pointer items-center justify-center rounded-[6px] ' +
        'border border-border text-secondary transition-[border-color,color] duration-[240ms] ' +
        'hover:border-border-strong hover:text-fg ' +
        (className ?? '')
      }
    >
      <span className="sr-only dark:hidden">Switch to dark mode</span>
      <span className="sr-only hidden dark:block">Switch to light mode</span>
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
        {/* Sun while dark is active, moon while light is active — the glyph is
            the action, not the state. Both are always in the DOM; the `dark:`
            variant hides one. */}
        <g className="hidden dark:block">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.7v2.2M12 19.1v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.7 12h2.2M19.1 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
        </g>
        <g className="dark:hidden">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </g>
      </svg>
    </button>
  );
}
