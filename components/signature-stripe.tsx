import { STRIPE_ORDER, accent } from '@/config/solutions';

/**
 * Seam's stripe: four lamps, equal width, 10px, in the fixed
 * blue -> violet -> amber -> teal order. Once per page, along the bottom of the
 * footer. Nowhere else.
 */
export function SignatureStripe() {
  return (
    <div aria-hidden data-signature-stripe className="tg-stripe w-full">
      {STRIPE_ORDER.map((key) => (
        <span key={key} style={{ background: accent(key).dot }} />
      ))}
    </div>
  );
}
