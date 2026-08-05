import { STRIPE_ORDER, accent } from '@/config/solutions';

/**
 * DESIGN.md §3 — four-segment accent bar, EXACTLY three per page:
 * top of hero, above the closing CTA, bottom of the footer. Nowhere else.
 *
 * Identical treatment every time: full-bleed edge to edge, 6px, four equal
 * segments in the fixed blue -> violet -> amber -> teal order.
 */
export function SignatureStripe() {
  return (
    <div aria-hidden className="flex h-[6px] w-full" data-signature-stripe>
      {STRIPE_ORDER.map((key) => (
        <span key={key} className="h-full flex-1" style={{ background: accent(key).dot }} />
      ))}
    </div>
  );
}
