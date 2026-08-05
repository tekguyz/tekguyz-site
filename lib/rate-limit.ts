import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Shared rate limiter for BOTH the concierge route and the contact action.
 *
 * Replaces the previous per-route in-memory token bucket. That version was
 * per-instance on Vercel and reset on every cold start, which made it closer to
 * decoration than protection: an attacker gets a fresh budget each time a new
 * lambda spins up, and legitimate traffic gets limited inconsistently depending
 * on which instance it lands on.
 *
 * Backed by Vercel KV or Upstash Redis. Both expose the same REST API, so either
 * env naming works.
 */

type Limiter = (key: string) => Promise<boolean>;

function credentials(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

/**
 * Dev-only fallback. Explicitly NOT production protection — it has the exact
 * per-instance weakness described above. It exists so `bun run dev` and
 * `bun run build` work without KV credentials, and it says so loudly once.
 */
function inMemoryLimiter(limit: number, windowMs: number): Limiter {
  const buckets = new Map<string, { count: number; resetAt: number }>();
  let warned = false;

  return async (key: string) => {
    if (!warned) {
      warned = true;
      console.warn(
        '[rate-limit] No KV/Upstash credentials found — falling back to an in-memory limiter. ' +
          'This resets on cold start and is not real protection. Set KV_REST_API_URL and ' +
          'KV_REST_API_TOKEN before production traffic.',
      );
    }
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    if (bucket.count >= limit) return false;
    bucket.count += 1;
    return true;
  };
}

function durableLimiter(prefix: string, limit: number, window: `${number} s`): Limiter {
  const creds = credentials();
  if (!creds) return inMemoryLimiter(limit, Number(window.split(' ')[0]) * 1000);

  const ratelimit = new Ratelimit({
    redis: new Redis({ url: creds.url, token: creds.token }),
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix: `tg:${prefix}`,
    analytics: false,
  });

  return async (key: string) => {
    try {
      const { success } = await ratelimit.limit(key);
      return success;
    } catch (error) {
      // A limiter outage must not take the form or the concierge down with it.
      // Fail open: losing rate limiting briefly beats losing lead capture.
      console.error('[rate-limit] backend error, failing open:', error);
      return true;
    }
  };
}

/** Concierge: conversational, so a slightly higher ceiling than the form. */
const conciergeLimiter = durableLimiter('concierge', 12, '60 s');

/** Contact form: a human submits once, maybe twice on a typo. */
const contactLimiter = durableLimiter('contact', 5, '60 s');

export function checkConciergeLimit(key: string): Promise<boolean> {
  return conciergeLimiter(key);
}

export function checkContactLimit(key: string): Promise<boolean> {
  return contactLimiter(key);
}

/** Best-effort client identity for limiting. Never logged. */
export function clientKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}
