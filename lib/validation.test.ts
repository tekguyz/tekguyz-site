import { describe, expect, it } from 'vitest';
import {
  PHONE_MAX_DIGITS,
  PHONE_MIN_DIGITS,
  capPhoneDigits,
  isPlausiblePhone,
  isPlausibleWebsite,
  optionalPhone,
  optionalWebsite,
} from './validation';

/**
 * The regression suite PROGRESS.md's Pass 3 claimed ("25 unit cases pass") and
 * the repo never actually had. These rules are shared by the client schema in
 * components/contact-form.tsx and the server schema in app/actions/contact.ts,
 * so a silent loosening here reaches the CRM — which is exactly how the two
 * documented garbage inputs got through the first time.
 *
 * Run with `bun run test`. Pure functions, no DOM, no network.
 */

describe('isPlausibleWebsite', () => {
  it('accepts a bare domain', () => {
    expect(isPlausibleWebsite('tekguyz.com')).toBe(true);
  });

  it('accepts a www. prefix', () => {
    expect(isPlausibleWebsite('www.tekguyz.com')).toBe(true);
  });

  it.each(['http://tekguyz.com', 'https://tekguyz.com', 'HTTPS://TEKGUYZ.COM'])(
    'accepts an explicit http(s) scheme: %s',
    (value) => {
      expect(isPlausibleWebsite(value)).toBe(true);
    },
  );

  it('accepts a path, query and hash after the host', () => {
    expect(isPlausibleWebsite('tekguyz.com/work/team-performance?utm=x#top')).toBe(true);
  });

  it('accepts a multi-label host and a long TLD', () => {
    expect(isPlausibleWebsite('shop.eu.tekguyz.co.uk')).toBe(true);
    expect(isPlausibleWebsite('tekguyz.technology')).toBe(true);
  });

  it('accepts punycode labels, so internationalised domains still work', () => {
    expect(isPlausibleWebsite('xn--80akhbyknj4f.com')).toBe(true);
  });

  it('accepts an explicit numeric port', () => {
    expect(isPlausibleWebsite('https://tekguyz.com:8443/pricing')).toBe(true);
  });

  // The documented garbage input from PROGRESS.md. Two @-signs make the last
  // one the authority delimiter, so `aedD@DWDD` parses as credentials and
  // `#33uyz.com` as a hostname — which is why it looked like a valid URL.
  it('rejects the documented garbage input via the credentials check', () => {
    expect(isPlausibleWebsite('aedD@DWDD@#33uyz.com')).toBe(false);
  });

  it.each(['user@tekguyz.com', 'user:pass@tekguyz.com', 'https://user:pass@tekguyz.com'])(
    'rejects credentials in the authority: %s',
    (value) => {
      expect(isPlausibleWebsite(value)).toBe(false);
    },
  );

  it.each([
    ['no dot at all', 'tekguyz'],
    ['single-character TLD', 'tekguyz.c'],
    ['numeric TLD', 'tekguyz.123'],
    ['leading-hyphen label', '-tekguyz.com'],
    ['trailing-hyphen label', 'tekguyz-.com'],
    ['internal whitespace', 'tek guyz.com'],
    ['empty string', ''],
  ])('rejects %s', (_label, value) => {
    expect(isPlausibleWebsite(value)).toBe(false);
  });

  it.each(['javascript:alert(1)', 'ftp://tekguyz.com', 'mailto:hello@tekguyz.com'])(
    'rejects a non-http(s) scheme: %s',
    (value) => {
      expect(isPlausibleWebsite(value)).toBe(false);
    },
  );

  it('rejects a value past the length ceiling', () => {
    expect(isPlausibleWebsite(`${'a'.repeat(2400)}.com`)).toBe(false);
  });
});

describe('isPlausiblePhone', () => {
  it('accepts the minimum 7 digits', () => {
    expect(PHONE_MIN_DIGITS).toBe(7);
    expect(isPlausiblePhone('555-0123')).toBe(true); // exactly 7
  });

  it('accepts the maximum 15 digits — E.164 international, not US-only', () => {
    expect(PHONE_MAX_DIGITS).toBe(15);
    expect(isPlausiblePhone('+123456789012345')).toBe(true); // exactly 15
  });

  it('rejects one digit under the floor and one over the ceiling', () => {
    expect(isPlausiblePhone('555012')).toBe(false); // 6
    expect(isPlausiblePhone('+1234567890123456')).toBe(false); // 16
  });

  it.each([
    ['US, formatted', '(954) 555-0123'],
    ['US, with country code', '+1 (954) 555-0123'],
    ['UK', '+44 20 7123 4567'],
    ['Germany', '+49 30 901820'],
    ['dot separated', '954.555.0123'],
    ['en dash from a contacts-app paste', '954–555–0123'],
  ])('accepts a valid number — %s', (_label, value) => {
    expect(isPlausiblePhone(value)).toBe(true);
  });

  // The documented garbage input from PROGRESS.md: a 19-digit run.
  it('rejects the documented 19-digit garbage input', () => {
    expect(isPlausiblePhone('4353535353535353535')).toBe(false);
  });

  it('rejects letters, which is the known-and-accepted strictness', () => {
    expect(isPlausiblePhone('1 (954) 555-0123 ext 4')).toBe(false);
    expect(isPlausiblePhone('555-CALL-NOW')).toBe(false);
  });

  it('rejects a + that is not at the very start', () => {
    expect(isPlausiblePhone('954+555+0123')).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(isPlausiblePhone('')).toBe(false);
  });
});

describe('capPhoneDigits', () => {
  it('leaves a value at or under the cap untouched', () => {
    expect(capPhoneDigits('+1 (954) 555-0123')).toBe('+1 (954) 555-0123');
    expect(capPhoneDigits('+123456789012345')).toBe('+123456789012345');
  });

  it('truncates the 16th digit and everything after it', () => {
    expect(capPhoneDigits('+1234567890123456789')).toBe('+123456789012345');
  });

  it('counts digits, not characters — formatting is free', () => {
    // 16 characters, 13 digits: a plain maxLength=15 would have cut this valid
    // international number mid-entry.
    const uk = '+44 20 7123 4567';
    expect(uk).toHaveLength(16);
    expect(capPhoneDigits(uk)).toBe(uk);
    expect(isPlausiblePhone(uk)).toBe(true);
  });

  it('never produces a value the schema would reject for being too long', () => {
    const capped = capPhoneDigits('+44 (0) 20 7123 4567 8901 2345');
    expect(capped.replace(/\D/g, '').length).toBeLessThanOrEqual(PHONE_MAX_DIGITS);
  });
});

describe('optional schemas — blank is fine, a filled value is checked', () => {
  it.each([undefined, '', '   '])('treats %o as absent', (value) => {
    expect(optionalPhone.safeParse(value).success).toBe(true);
    expect(optionalWebsite.safeParse(value).success).toBe(true);
  });

  it('rejects a filled-but-invalid value on both', () => {
    expect(optionalPhone.safeParse('4353535353535353535').success).toBe(false);
    expect(optionalWebsite.safeParse('aedD@DWDD@#33uyz.com').success).toBe(false);
  });

  it('accepts a filled-and-valid value on both', () => {
    expect(optionalPhone.safeParse('(954) 555-0123').success).toBe(true);
    expect(optionalWebsite.safeParse('tekguyz.com').success).toBe(true);
  });
});
