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

const TIMEOUT_MS = 3000;
const REVALIDATE_SECONDS = 3600;

async function checkOne(url: string): Promise<StatusResult> {
  const checkedAt = Date.now();
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    return { status: res.ok ? 'live' : 'unreachable', checkedAt };
  } catch {
    // Timeout, DNS failure, TLS error, or a host that rejects HEAD outright.
    return { status: 'unreachable', checkedAt };
  }
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
