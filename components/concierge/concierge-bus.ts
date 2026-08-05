/**
 * A one-event bus so the closing CTA's quiet text link can open the concierge
 * panel without threading a provider through every page.
 *
 * Deliberately not React context: the panel is mounted once in the root layout
 * and the only cross-tree interaction is "open" — a context provider would be
 * more machinery than the single message justifies.
 */
export const CONCIERGE_OPEN_EVENT = 'tg:open-concierge';

export function openConcierge() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(CONCIERGE_OPEN_EVENT));
}
