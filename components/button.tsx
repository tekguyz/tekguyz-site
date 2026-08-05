import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * DESIGN.md §4.
 *
 * button-primary: ink bg, white text, radius 8px, 14x24 padding, hover #242424,
 * press scale(0.98). In dark mode it INVERTS to #F5F5F5 fill / #101010 text —
 * it must be the brightest element on a dark page, not a darker shade of the
 * background. Both sides of that inversion come from --tg-cta-* in globals.css.
 *
 * `size="large"` is the site's ONE documented size exception: 18x32 padding,
 * ~16px text, used only by closing-cta.
 *
 * No accent color ever fills a button.
 */

const base =
  'inline-flex items-center justify-center gap-2 font-semibold leading-none ' +
  'transition-[background-color,transform,border-color] duration-[var(--dur-base)] ' +
  '[transition-timing-function:var(--ease-hover)] active:scale-[0.98] ' +
  'min-h-[44px] whitespace-nowrap';

const variants = {
  primary: 'bg-cta-bg text-cta-fg hover:bg-cta-hover',
  secondary: 'bg-transparent text-fg border border-border hover:border-border-strong',
} as const;

const sizes = {
  default: 'rounded-[8px] px-6 py-[14px] text-[14.5px]',
  large: 'rounded-[8px] px-8 py-[18px] text-[16px]',
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'default',
  className,
  children,
  ...rest
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = 'primary',
  size = 'default',
  className,
  children,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
} & ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        'disabled:cursor-not-allowed disabled:opacity-55',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
