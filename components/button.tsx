import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Seam buttons: square, 2px border, the body face at weight 700, sentence case.
 *
 * The action is always the OPPOSITE ground from the one it sits on: ink on
 * paper, paper on ink (`--tg-cta-*`, set by `.on-ink` / `.on-paper` in
 * globals.css). Hover inverts to an outline. **Never a lamp.**
 *
 *   nav      44px tall  — the nav bar
 *   default  52px tall  — hero, rails, the concierge hand-off
 *   form     52px tall  — Continue / Send Inquiry inside the form
 *   large    56px tall  — closing-cta only, the page's one strongest ask
 *
 * Secondary is a 2px outline in the ground's text colour, the same height as
 * a primary beside it.
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
  'inline-flex items-center justify-center gap-3 font-bold ' +
  'text-[17px]/[1] rounded-none border-2 whitespace-nowrap ' +
  'transition-[background-color,border-color,color,transform] duration-[160ms] ' +
  '[transition-timing-function:var(--ease-hover)] active:translate-y-px';

const variants = {
  primary:
    'bg-cta-bg text-cta-fg border-cta-bg hover:bg-cta-hover hover:text-cta-hover-fg hover:border-cta-hover-fg',
  secondary: 'bg-transparent text-fg border-fg hover:bg-fg hover:text-bg',
} as const;

const sizes = {
  nav: 'min-h-11 px-5 text-[16px]/[1]',
  default: 'min-h-[52px] px-8',
  form: 'min-h-[52px] px-8',
  large: 'min-h-14 px-8',
} as const;

/**
 * The concierge launcher's padding — the fifth size, kept out of `sizes` on
 * purpose so nobody can pass `size="launcher"` to a `Button`. It is not a
 * general size: it belongs to one fixed-position control.
 *
 * 1px short on every side because that control carries a hairline the four
 * above do not, so the outer box lands on 44px (mobile, exactly §8's tap floor)
 * and 40px (desktop; it was 50 until the owner called it too big, refs #55).
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
export const LAUNCHER_PADDING = 'px-[15px] py-[12px] md:py-[10px]';

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
