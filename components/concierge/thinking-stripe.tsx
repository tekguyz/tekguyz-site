import { STRIPE_ORDER, accent } from '@/config/solutions';

/**
 * DESIGN.md §4 — the "thinking" indicator.
 *
 * A 3px bar of the same four equal segments as the signature stripe, in the same
 * fixed blue -> violet -> amber -> teal order, with a slow shimmer sweeping left
 * to right across them on a 1200ms loop. Resolves to nothing once the reply
 * arrives. prefers-reduced-motion falls back to a static four-segment bar.
 *
 * THIS IS THE ONLY MOVING USE OF THE FOUR-COLOR SYSTEM ON THE ENTIRE SITE.
 * It's earned here because the AI is genuinely doing work in that moment, so the
 * signal means something. Do not extend it anywhere else — not around a button,
 * not as a page-load flourish, not as ambient decoration. A four-color moment
 * that appears in more than one place stops being a signature and becomes
 * wallpaper.
 *
 * Four discrete segments, never a blended gradient.
 */
export function ThinkingStripe() {
  return (
    <div
      role="status"
      aria-label="Thinking"
      className="flex h-[3px] w-full max-w-[180px] overflow-hidden rounded-full"
    >
      {STRIPE_ORDER.map((key, i) => (
        <span
          key={key}
          className="shimmer-seg h-full flex-1"
          style={{
            background: accent(key).dot,
            // Staggering the same 1200ms loop across four segments is what
            // reads as a sweep, without a gradient.
            animationDelay: `${i * 180}ms`,
          }}
        />
      ))}
    </div>
  );
}
