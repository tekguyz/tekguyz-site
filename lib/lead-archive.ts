import { Redis } from '@upstash/redis';

/**
 * Durable record of a lead whose delivery failed AFTER the visitor was told it
 * succeeded.
 *
 * The contact action now returns as soon as validation and the rate limit pass,
 * and does the CRM write and both emails inside `after()`. That is the right
 * trade — the CRM endpoint takes 2–5s and the visitor should not wait on it —
 * but it moves every dependency failure to a place the user will never see. So
 * a failure has to land somewhere a human can read it later, or a lead exists
 * with no record anywhere.
 *
 * Two channels, both required, neither sufficient alone:
 *  1. A greppable console marker (see LEAD_FAILURE_MARKER) — instant, visible in
 *     Vercel runtime logs, but logs roll off.
 *  2. This: the full payload in Upstash, which is already wired for rate
 *     limiting and needs no new infrastructure.
 *
 * Deliberately NOT a queue or a retry system. The CRM upserts BY EMAIL, so a
 * retry from stale data can overwrite a row that a later submission already
 * corrected. A record a human replays by hand is the safe shape here.
 */

/** Same credentials the rate limiter reads — Vercel KV or Upstash, either naming. */
function credentials(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

let client: Redis | null = null;
function redis(): Redis | null {
  if (client) return client;
  const creds = credentials();
  if (!creds) return null;
  client = new Redis({ url: creds.url, token: creds.token });
  return client;
}

/**
 * The one string to grep for in Vercel runtime logs. Distinct enough that it
 * cannot collide with framework output, and stable — if this changes, every
 * saved search someone made against it goes quiet without erroring.
 */
export const LEAD_FAILURE_MARKER = '[LEAD-DELIVERY-FAILURE]';

/** Fires when the honeypot silently accepts. Same reasoning: an invisible branch. */
export const LEAD_HONEYPOT_MARKER = '[LEAD-HONEYPOT]';

/** 90 days. Long enough that a failure found in a monthly review is still actionable. */
const TTL_SECONDS = 60 * 60 * 24 * 90;

/** Newest-first index so records are findable without SCAN over the keyspace. */
const INDEX_KEY = 'tg:lead:fail:index';
const INDEX_MAX = 500;

export type LeadFailureStage = 'crm' | 'notify' | 'confirm';

export interface LeadFailureRecord {
  stage: LeadFailureStage;
  at: string;
  source: string;
  email: string;
  /** The exact payload that would have reached the CRM, so it can be replayed by hand. */
  payload: unknown;
  error: string;
}

/**
 * Key shape: `tg:lead:fail:<ISO-8601>:<6 random chars>`.
 *
 * ISO first so a lexical sort is a chronological sort; the suffix only exists
 * because two submissions can land in the same millisecond.
 */
function failureKey(at: string): string {
  return `tg:lead:fail:${at}:${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Best effort by design. This runs inside `after()`, downstream of a response
 * the visitor has already been given — throwing here would replace a logged
 * failure with an unlogged one.
 */
export async function archiveFailedLead(record: LeadFailureRecord): Promise<void> {
  const db = redis();
  if (!db) {
    console.error(
      `${LEAD_FAILURE_MARKER} no Upstash credentials — failure record NOT persisted`,
      JSON.stringify(record),
    );
    return;
  }
  const key = failureKey(record.at);
  try {
    await db.set(key, JSON.stringify(record), { ex: TTL_SECONDS });
    await db.lpush(INDEX_KEY, key);
    await db.ltrim(INDEX_KEY, 0, INDEX_MAX - 1);
    console.error(`${LEAD_FAILURE_MARKER} archived key=${key}`);
  } catch (error) {
    console.error(
      `${LEAD_FAILURE_MARKER} archive write failed key=${key}`,
      error,
      JSON.stringify(record),
    );
  }
}
