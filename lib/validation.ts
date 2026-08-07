import { z } from 'zod';

/**
 * Shared field rules for the contact form.
 *
 * Deliberately in one module rather than duplicated across the client schema in
 * components/contact-form.tsx and the server schema in app/actions/contact.ts.
 * Those two must agree: if the client is looser the server rejects a submission
 * the visitor was told was fine, and if the client is stricter it blocks input
 * the CRM would have happily taken.
 *
 * "Optional" here means the field may be BLANK. It does not mean a value that IS
 * present goes unchecked — that was the bug: `aedD@DWDD@#33uyz.com` sailed
 * through as a website and a 19-digit run sailed through as a phone number.
 */

/** Treat "" and whitespace-only as absent, so optional stays genuinely optional. */
function isBlank(v: string | undefined): boolean {
  return v === undefined || v.trim() === '';
}

/**
 * Hostname check, applied after any scheme is stripped.
 *
 * Requires at least one dot, labels of letters/digits/hyphens that don't start
 * or end with a hyphen, and an alphabetic TLD of 2+. Punycode (`xn--…`) passes
 * as ordinary label characters, so internationalised domains still work.
 */
const HOSTNAME = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*\.[A-Za-z]{2,}$/;

/**
 * Accepts a bare domain (`tekguyz.com`), `www.` prefixed, an explicit scheme,
 * and any path/query/hash after the host. Rejects anything with credentials,
 * whitespace, or stray punctuation in the authority — which is what the garbage
 * test input actually was.
 */
export function isPlausibleWebsite(raw: string): boolean {
  const value = raw.trim();
  if (value.length > 253 + 2048) return false;
  // A scheme other than http(s) is not something we want to store as a website.
  if (/^[A-Za-z][A-Za-z0-9+.-]*:/.test(value) && !/^https?:\/\//i.test(value)) return false;

  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return false;
  }

  // Credentials in a "your website" field are never legitimate, and they are how
  // `aedD@DWDD@#33uyz.com` would otherwise sneak past as a valid-looking URL.
  if (url.username || url.password) return false;
  if (url.port && !/^\d+$/.test(url.port)) return false;

  return HOSTNAME.test(url.hostname);
}

/**
 * Plausibility, not format. TEKGUYZ delivers nationwide and takes international
 * enquiries, so forcing a US pattern would reject valid input — the rule is a
 * sane character set plus an E.164-shaped digit count (7–15).
 */
export function isPlausiblePhone(raw: string): boolean {
  const value = raw.trim();
  // Digits, spaces, and the punctuation people actually type: + ( ) . and any
  // of the unicode dash variants a paste from a contacts app can carry.
  if (!/^[+()\d\s.\-‐-―]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return false;
  // A leading + is only meaningful at the very start.
  if (value.includes('+') && !value.startsWith('+')) return false;
  return true;
}

export const WEBSITE_ERROR = 'Enter a valid website, like tekguyz.com';
export const PHONE_ERROR = 'Enter a valid phone number';

/** Blank is fine; a value that is present must be well formed. */
export const optionalWebsite = z
  .string()
  .optional()
  .refine((v) => isBlank(v) || isPlausibleWebsite(v!), { message: WEBSITE_ERROR });

export const optionalPhone = z
  .string()
  .optional()
  .refine((v) => isBlank(v) || isPlausiblePhone(v!), { message: PHONE_ERROR });
