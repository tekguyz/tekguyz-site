import { cn } from '@/lib/utils';

/**
 * Connected Nodes — four accent circles (top blue, right violet, bottom amber,
 * left teal) joined by hairline connectors, no container.
 *
 * Export geometry: viewBox 0 0 64 64, r=8 circles, stroke-width 3 connectors.
 * This is the one brand mark; every instance is this same geometry, never a
 * redrawn approximation.
 *
 * `stroke` is a prop because the connectors are context-dependent: the ground's
 * mute grey by default, and currentColor at 40%
 * inside the concierge launcher. The four circles take the Seam lamp values.
 */
export function ConnectedNodes({
  size = 26,
  stroke = 'var(--tg-mute)',
  strokeOpacity,
  className,
}: {
  size?: number;
  stroke?: string;
  strokeOpacity?: number;
  className?: string;
}) {
  const line = { stroke, strokeWidth: 3, ...(strokeOpacity ? { opacity: strokeOpacity } : {}) };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={cn('block flex-none', className)}
      aria-hidden
      focusable="false"
    >
      <line x1="32" y1="12" x2="12" y2="32" style={line} />
      <line x1="32" y1="12" x2="52" y2="32" style={line} />
      <line x1="12" y1="32" x2="32" y2="52" style={line} />
      <line x1="52" y1="32" x2="32" y2="52" style={line} />
      <circle cx="32" cy="12" r="8" style={{ fill: 'var(--lamp-blue)' }} />
      <circle cx="52" cy="32" r="8" style={{ fill: 'var(--lamp-violet)' }} />
      <circle cx="32" cy="52" r="8" style={{ fill: 'var(--lamp-amber)' }} />
      <circle cx="12" cy="32" r="8" style={{ fill: 'var(--lamp-teal)' }} />
    </svg>
  );
}
