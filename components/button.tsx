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
 * A fifth padding exists and is exported rather than hidden: `LAUNCHER_PADDING`,
 * the concierge launcher, the only responsive entry in the scale. It lived
 * inline in `concierge.tsx` and matched none of the four above, which is how it
 * shipped a desktop size to a 412px screen. See `DESIGN.md` §4.13.
 *
 * Dark mode inverts wholesale via --tg-cta-*: #F5F5F5 fill on #101010 text, so
 * the primary is the brightest element on a dark page. No accent ever fills a
 * button.
 */

/**
 * The line height rides ON the font-size utility (`/[1]`), and that is
 * load-bearing rather than a style preference.
 *
 * This string used to carry a separate `leading-none`, and it never reached the
 * DOM: `cn()` is tailwind-merge, Tailwind's `text-*` utilities set line-height
 * as well as size, so tailwind-merge treats a later font-size class as
 * conflicting with an earlier `leading-*` and DROPS it. Every button on the
 * site therefore inherited the 1.6 body line-height — a 14.5px button rendered
 * a 23.2px line box, 8.7px taller than the export, which is what made the nav
 * CTA read as `button-primary--large` (D-10) when its padding was already the
 * standard 14x24. `sizes.large` re-triggered it for the same reason.
 *
 * A slash modifier is one class, so there is nothing left for the merge to
 * resolve, and a caller passing their own `text-*` cannot silently strip it.
 */
const base =
  'inline-flex items-center justify-center gap-2 font-semibold ' +
  'text-[14.5px]/[1] rounded-[8px] whitespace-nowrap ' +
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
  large: 'px-8 py-[18px] text-[16px]/[1]',
} as const;

/**
 * The concierge launcher's padding — the fifth size, kept out of `sizes` on
 * purpose so nobody can pass `size="launcher"` to a `Button`. It is not a
 * general size: it belongs to one fixed-position control.
 *
 * 1px short on every side because that control carries a hairline the four
 * above do not, so the outer box lands on 44px (mobile, exactly §8's tap floor)
 * and 50px (desktop).
 *
 * **The launcher takes this string and NOT `base`, and that is a cascade fact
 * rather than laziness.** `base` declares
 * `transition-[background-color,border-color,transform]`, and the launcher
 * carries `.tg-yield`, whose `transition` shorthand is UNLAYERED in
 * `globals.css` — it beats any layered utility regardless of source order and
 * would silently drop everything `base` declared. Composing the two looks
 * correct in the JSX and quietly disables the transitions. So the launcher
 * shares the value that matters (padding) and keeps its own transition.
 */
export const LAUNCHER_PADDING = 'px-[15px] py-[12px] md:px-[23px] md:py-[15px]';

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
