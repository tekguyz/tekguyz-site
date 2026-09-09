import { work } from '@/content/work';

/**
 * DESIGN.md §5 / CANONICAL §3 — the signature component's data source.
 *
 * Server-side only. Never a client fetch to eight origins: that would be eight
 * cross-origin requests per visitor, most of which would fail CORS anyway, and
 * would put demo uptime on the critical path of the page rendering.
 *
 * A demo that is down renders honestly as "Temporarily unreachable" with the
 * link still available. That tradeoff is accepted deliberately (CANONICAL §10).
 */

export type LiveStatus = 'live' | 'unreachable';

export interface StatusResult {
  status: LiveStatus;
  /** When the check ran — drives the "checked N minutes ago" timestamp. */
  checkedAt: number;
}

/**
 * 8s, not 3s, and the number is measured rather than chosen. Every demo here is
 * a scale-to-zero deployment, so the FIRST request after an idle window pays a
 * cold start the second one does not: `rs-field-ops.netlify.app` answered a
 * cold HEAD in 4.7s and the next one in 0.4s (measured 2026-09-08). A 3s budget
 * therefore reported a healthy demo as down purely for being asleep — and since
 * each route freezes its own snapshot for the revalidate window, home and /work
 * disagreed for the better part of an hour.
 */
const TIMEOUT_MS = 8000;
/**
 * 5 minutes, not an hour. This does not stop a wrong answer — the check is a
 * network probe and can always be wrong — it bounds how long one survives on
 * the page. An hour of "Temporarily unreachable" beside a demo that is up is a
 * worse lie than the check being cheap.
 */
const REVALIDATE_SECONDS = 300;

/**
 * Two attempts, because the first one is the one that pays the cold start.
 * A retry is only meaningful against a warm second knock, so it is immediate:
 * the first attempt is what woke the host up.
 */
const ATTEMPTS = 2;

async function attemptOne(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    return res.ok;
  } catch {
    // Timeout, DNS failure, TLS error, or a host that rejects HEAD outright.
    return false;
  }
}

async function checkOne(url: string): Promise<StatusResult> {
  const checkedAt = Date.now();
  for (let i = 0; i < ATTEMPTS; i++) {
    if (await attemptOne(url)) return { status: 'live', checkedAt };
  }
  return { status: 'unreachable', checkedAt };
}

/**
 * One hang can't block the page — Promise.allSettled, never Promise.all.
 * The result is cached for the revalidate window and shared across all renders
 * in it, so a page with eight status lines still issues at most eight checks
 * per hour in total, not per request.
 */
export async function getAllStatuses(): Promise<Record<string, StatusResult>> {
  const settled = await Promise.allSettled(
    work.map(async (entry) => [entry.slug, await checkOne(entry.url)] as const),
  );

  const out: Record<string, StatusResult> = {};
  for (const [i, result] of settled.entries()) {
    if (result.status === 'fulfilled') {
      out[result.value[0]] = result.value[1];
    } else {
      // checkOne already swallows its own errors, so this is belt-and-braces.
      out[work[i]!.slug] = { status: 'unreachable', checkedAt: Date.now() };
    }
  }
  return out;
}

export async function getStatus(slug: string): Promise<StatusResult> {
  const entry = work.find((w) => w.slug === slug);
  if (!entry) return { status: 'unreachable', checkedAt: Date.now() };
  return checkOne(entry.url);
}
