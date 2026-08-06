import { STRIPE_ORDER, accent } from '@/config/solutions';

/**
 * The "thinking" indicator — the ONLY moving use of the four-colour system on
 * the entire site.
 *
 * Export values: a 72px x 3px four-column grid sitting INLINE beside the word
 * "Thinking" with a 10px gap. It is small and typographic, not a full-width
 * progress bar. Segments hold at 0.2 opacity and flash to 1 briefly, staggered
 * 120ms apart, on a 1200ms loop — that stagger is what reads as a sweep without
 * any gradient being involved.
 *
 * Do not extend this pattern anywhere else. A four-colour moment that shows up
 * in more than one place stops being a signature and becomes wallpaper, which
 * is the failure mode the rest of the system exists to avoid.
 *
 * prefers-reduced-motion falls back to a static four-segment bar (handled in
 * globals.css), never a spinner.
 */
export function ThinkingStripe() {
  return (
    <div
      role="status"
      className="flex items-center gap-[10px] text-[0.875rem] leading-[1.55] tracking-[0.04em] text-secondary"
    >
      <span aria-hidden className="grid h-[3px] w-[72px] flex-none grid-cols-4">
        {STRIPE_ORDER.map((key, i) => (
          <span
            key={key}
            className="shimmer-seg"
            style={{ background: accent(key).dot, animationDelay: `${i * 120}ms` }}
          />
        ))}
      </span>
      <span>Thinking</span>
    </div>
  );
}
