import { STRIPE_ORDER, accent } from '@/config/solutions';

/**
 * Four-segment accent bar, exactly three per page: top of hero, above the
 * closing CTA, bottom of the footer. Nowhere else.
 *
 * Export uses a 4-column grid at 6px tall, full-bleed, in the fixed
 * blue -> violet -> amber -> teal order.
 */
export function SignatureStripe() {
  return (
    <div
      aria-hidden
      data-signature-stripe
      className="grid h-[6px] w-full grid-cols-4"
    >
      {STRIPE_ORDER.map((key) => (
        <span key={key} style={{ background: accent(key).dot }} />
      ))}
    </div>
  );
}
