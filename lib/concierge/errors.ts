import { site } from '@/lib/site';

/**
 * The concierge's request-failed message, in one place.
 *
 * **This existed twice and had already drifted.** The route defined it as
 * `ERROR_REPLY` and returned it for a server-side failure; `concierge.tsx`
 * carried its own literal for a transport failure, and the two sentences were
 * not the same — the client's stopped at the email address, the route's went on
 * to "and we'll pick it up from there." Same failure from the visitor's side,
 * two different endings depending on whether the request reached the route.
 * Neither file referenced the other, so the drift was invisible to anyone
 * editing one side (docs/audits/2026-08-13-component-audit.md, finding #3).
 *
 * **The route's wording is the one that survives**, unedited. It is a strict
 * superset of the client's — same first two sentences, plus a closing clause the
 * client's simply lacked — so keeping it loses nothing that was on screen
 * before, and no new copy was written to unify them.
 *
 * Consumers: `app/api/concierge/route.ts` (server-side failure) and
 * `components/concierge/concierge.tsx` (fetch threw / network failure).
 *
 * Not a motion or design token and deliberately not in `globals.css` — it is a
 * user-facing sentence, and `COPY.md` governs the words. This module only
 * guarantees there is one copy of them.
 */
export const CONCIERGE_ERROR_REPLY = `Something broke on our end — not yours. Try again in a moment, or email ${site.publicEmail} and we'll pick it up from there.`;
