import { cn } from '@/lib/utils';

/**
 * DESIGN.md §4 — Connected Nodes: four accent circles (top blue, right violet,
 * bottom amber, left teal) joined by hairline connectors, no container.
 *
 * This is the one brand mark. Every instance is this same geometry — never a
 * redrawn approximation (a plain 2x2 dot grid has appeared in its place before
 * and is wrong). Connectors theme-swap via var(--tg-border); the nodes never do.
 *
 * The wordmark uses currentColor so it resolves in both themes with no JS.
 * This component never wraps itself in a <Link>.
 */

export function ConnectedNodes({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden
      focusable="false"
    >
      <line x1="32" y1="12" x2="12" y2="32" stroke="var(--tg-border)" strokeWidth="2" />
      <line x1="32" y1="12" x2="52" y2="32" stroke="var(--tg-border)" strokeWidth="2" />
      <line x1="12" y1="32" x2="32" y2="52" stroke="var(--tg-border)" strokeWidth="2" />
      <line x1="52" y1="32" x2="32" y2="52" stroke="var(--tg-border)" strokeWidth="2" />
      <circle cx="32" cy="12" r="7" fill="var(--tg-accent-blue)" />
      <circle cx="52" cy="32" r="7" fill="var(--tg-accent-violet)" />
      <circle cx="32" cy="52" r="7" fill="var(--tg-accent-amber)" />
      <circle cx="12" cy="32" r="7" fill="var(--tg-accent-teal)" />
    </svg>
  );
}

export function LogoLockup({
  size = 28,
  withTagline = false,
  className,
}: {
  size?: number;
  withTagline?: boolean;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-[10px]', className)}>
      <ConnectedNodes size={size} />
      <span className="flex flex-col leading-none">
        <span
          className="font-extrabold tracking-[-0.02em]"
          style={{ fontSize: size * 0.66, color: 'var(--tg-fg)' }}
        >
          TEKGUYZ
        </span>
        {withTagline && (
          <span className="mt-[6px] text-[0.875rem] font-normal text-secondary">
            We build tech that actually works.
          </span>
        )}
      </span>
    </span>
  );
}
