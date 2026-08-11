import { z } from 'zod';
// Relative, not `@/content/solutions`: this module is covered by a Vitest suite
// that runs without a config, so it has no tsconfig path aliases to resolve.
import { detailsPlaceholder, DEFAULT_DETAILS_PLACEHOLDER } from '../content/solutions';

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

/** E.164's own bounds. The schema and the typing cap both read these. */
export const PHONE_MIN_DIGITS = 7;
export const PHONE_MAX_DIGITS = 15;

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
  if (digits.length < PHONE_MIN_DIGITS || digits.length > PHONE_MAX_DIGITS) return false;
  // A leading + is only meaningful at the very start.
  if (value.includes('+') && !value.startsWith('+')) return false;
  return true;
}

/**
 * Real-time typing guard for the phone input: truncate once the value carries
 * more than PHONE_MAX_DIGITS digits, so the field cannot accept input the
 * schema will reject on blur.
 *
 * The cap counts DIGITS, not characters. A plain 15-character `maxLength` would
 * be the same mistake as the 10-digit cap this replaces, one breakpoint over:
 * `+44 20 7123 4567` is 13 digits and 16 characters, and a character cap would
 * cut a valid international number mid-entry. Formatting (`+`, spaces,
 * parentheses, dots, dashes) is unlimited and free; only digits are counted,
 * which is exactly what isPlausiblePhone measures.
 */
export function capPhoneDigits(value: string, max = PHONE_MAX_DIGITS): string {
  let seen = 0;
  for (let i = 0; i < value.length; i += 1) {
    if (value[i]! >= '0' && value[i]! <= '9') {
      seen += 1;
      // Cut before the offending digit, keeping any formatting typed ahead of it.
      if (seen > max) return value.slice(0, i);
    }
  }
  return value;
}

/* -------------------------------------------------------------------------
 * Two additions beyond the original phone/website scope, both deliberate:
 * a boilerplate guard and a shape check for `client_name`. Everything above
 * this line is unchanged.
 *
 * WHY THEY LIVE HERE. This module exists so the client schema and the server
 * schema cannot drift, and both new rules have to hold on both sides — the
 * client so a person gets a normal inline error, the server because the client
 * is not the only caller (the concierge and anything POSTing the action
 * directly both bypass it). Putting them anywhere else recreates exactly the
 * drift this file was written to prevent.
 * ---------------------------------------------------------------------- */

/**
 * Static UI copy that has been observed arriving as if a visitor had typed it.
 *
 * This is not hypothetical. Lead 73242a46 carried the /contact hero subhead as
 * its message; lead e6c84f86 carried 160 characters of scraped page prose as
 * its name. Automated form-fillers read visible copy and placeholders off the
 * DOM, and the CRM's spam shield then — correctly — reads that boilerplate as
 * bot-like, which is why genuine leads kept getting misflagged.
 *
 * The placeholders are IMPORTED rather than transcribed, so editing the copy
 * cannot silently unhook the guard. The two page strings are literals because
 * they live in JSX prose, not in a constant.
 */
const UI_COPY: readonly string[] = [
  ...Object.values(detailsPlaceholder),
  DEFAULT_DETAILS_PLACEHOLDER,
  // Field placeholders, in DOM order.
  'Your name',
  'you@company.com',
  'Company name',
  '(xxx) xxx-xxxx',
  'yoursite.com',
  'Select one',
  // /contact hero subhead + meta description.
  "Tell us what you're working with and what you're trying to fix. We'll take it from there.",
  "Tell us what you're working with and what you're trying to fix. Free conversation, flat quote, no surprises — we reply within one business day.",
];

/**
 * Curly quotes and dashes are the whole reason this exists: the page renders
 * `&rsquo;`, so the string a scraper submits is never byte-identical to the
 * source literal. Normalising both sides is what makes the comparison hold.
 */
function normalizeCopy(v: string): string {
  return v
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[‐-―]/g, '-')
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Containment is only safe for long strings. `Select one` appears inside plenty
 * of legitimate sentences; the 89-character hero subhead does not.
 */
const CONTAINMENT_MIN = 40;

const NORMALIZED_COPY = UI_COPY.map(normalizeCopy);

/** True when the value IS site copy — exact for short entries, substring for long ones. */
export function isUiCopy(raw: string): boolean {
  const value = normalizeCopy(raw);
  if (!value) return false;
  return NORMALIZED_COPY.some(
    (copy) => copy === value || (copy.length >= CONTAINMENT_MIN && value.includes(copy)),
  );
}

/**
 * Remove any long UI-copy run from a value and return what the visitor actually
 * wrote — usually nothing, which is the point. The observed message was
 * `Budget: $50k+\n\n<hero subhead>`: the budget prefix is ours and legitimate,
 * the rest was never typed.
 *
 * Short entries are not stripped, only matched whole, for the containment
 * reason above. A value that reduces to blank is treated as absent, never as an
 * error — message is optional to the CRM, and failing a visitor over a field
 * they left empty would be worse than the bug.
 */
export function stripUiCopy(raw: string): string {
  let value = raw;
  for (const entry of UI_COPY) {
    if (normalizeCopy(entry).length < CONTAINMENT_MIN) continue;
    value = value.replace(copyPattern(entry), ' ');
  }
  // Short entries are matched whole, never stripped — see CONTAINMENT_MIN.
  return isUiCopy(value) ? '' : value.replace(/\s+\n/g, '\n').trim();
}

/**
 * A regex that matches an entry as it appears in the DOM rather than in source:
 * whitespace runs are interchangeable, and every quote and dash matches its
 * typographic variants. Operating on the raw string this way avoids having to
 * map a normalized index back onto the original characters.
 */
function copyPattern(entry: string): RegExp {
  const body = entry
    .split('')
    .map((ch) => {
      if (/\s/.test(ch)) return '\\s+';
      if (/['‘’ʼ]/.test(ch)) return "['‘’ʼ]";
      if (/["“”]/.test(ch)) return '["“”]';
      if (/[-‐-―]/.test(ch)) return '[-‐-―]';
      return ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('')
    // The trailing period of a sentence is often dropped or kept inconsistently.
    .replace(/\\\.$/, '\\.?');
  return new RegExp(body, 'gi');
}

/**
 * `client_name` shape check.
 *
 * The CRM enforces no length or shape on this column at all, which is how a
 * 160-character prose blob became somebody's name. The rules are deliberately
 * about what a name ISN'T — TEKGUYZ takes international enquiries, so anything
 * asserting a script, a word count of two, or a capitalisation pattern would
 * reject real people.
 */
export const NAME_MAX = 80;
/** Long enough for `María del Carmen García de la Vega`; short of a sentence. */
const NAME_MAX_WORDS = 8;

export function isPlausibleName(raw: string): boolean {
  const value = raw.trim();
  if (value.length < 2 || value.length > NAME_MAX) return false;
  // A name is one line. Prose and scraped blocks are not.
  if (/[\r\n]/.test(value)) return false;
  // Contact details and URLs have their own fields.
  if (/[@]|https?:\/\/|www\./i.test(value)) return false;
  // Sentence punctuation mid-value means this is prose, not a name.
  if (/[.!?][)\]"']?\s/.test(value)) return false;
  if (/[!?]$/.test(value)) return false;
  if (value.split(/\s+/).length > NAME_MAX_WORDS) return false;
  // Must actually contain a letter, in any script.
  if (!/\p{L}/u.test(value)) return false;
  return !isUiCopy(value);
}

export const NAME_ERROR = 'Enter your name as you’d like us to use it';

export const personName = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .refine(isPlausibleName, { message: NAME_ERROR });

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
