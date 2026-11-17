import { STRIPE_ORDER, accent } from '@/config/solutions';

/**
 * Seam's stripe: four lamps, equal width, 10px, in the fixed
 * blue -> violet -> amber -> teal order. Once per page: the top edge of the
 * closing "Let's talk" band, or the bottom of the footer on a page without one
 * (globals.css hides the footer copy when the band is there). Nowhere else.
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
