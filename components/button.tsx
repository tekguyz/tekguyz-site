import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Sizes are taken literally from the design export, which uses four distinct
 * paddings for four distinct jobs. They are NOT interchangeable:
 *
 *   nav      14px 24px  — the only button size in the nav bar
 *   default  15px 24px  — hero primary, sticky-rail CTA, cap-reached handoff
 *   form     15px 28px  — Continue / Send Inquiry inside the form card
 *   large    18px 32px  — closing-cta only, the site's one documented exception
 *
 * Secondary is 14px 24px with a hairline border, so a primary and a secondary
 * sitting side by side in the hero end up the same visual height (the primary's
 * extra 1px per side compensates for the border the secondary carries).
 *
 * Dark mode inverts wholesale via --tg-cta-*: #F5F5F5 fill on #101010 text, so
 * the primary is the brightest element on a dark page. No accent ever fills a
 * button.
 */

const base =
  'inline-flex items-center justify-center gap-2 font-semibold leading-none ' +
  'text-[14.5px] rounded-[8px] whitespace-nowrap ' +
  'transition-[background-color,border-color,transform] duration-[120ms] ' +
  '[transition-timing-function:var(--ease-hover)] active:scale-[0.98]';

const variants = {
  primary: 'bg-cta-bg text-cta-fg hover:bg-cta-hover',
  secondary:
    'bg-transparent text-fg border border-border hover:border-border-strong duration-[240ms]',
} as const;

const sizes = {
  nav: 'px-6 py-[14px]',
  default: 'px-6 py-[15px]',
  form: 'px-7 py-[15px]',
  large: 'px-8 py-[18px] text-[16px]',
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
        'cursor-pointer disabled:cursor-not-allowed disabled:opacity-55',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
