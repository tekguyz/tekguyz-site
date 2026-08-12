import { describe, expect, it } from 'vitest';
import {
  NAME_MAX,
  PHONE_MAX_DIGITS,
  PHONE_MIN_DIGITS,
  capPhoneDigits,
  isPlausibleName,
  isPlausiblePhone,
  isPlausibleWebsite,
  isUiCopy,
  optionalPhone,
  optionalWebsite,
  personName,
  stripUiCopy,
} from './validation';
import { DEFAULT_DETAILS_PLACEHOLDER } from '../content/solutions';

/**
 * The regression suite docs/archive/HISTORY.md's Pass 3 claimed ("25 unit cases pass") and
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

  // The documented garbage input from docs/archive/HISTORY.md. Two @-signs make the last
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

  // The documented garbage input from docs/archive/HISTORY.md: a 19-digit run.
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

/**
 * The boilerplate guard and the client_name shape check, both added after two
 * real leads showed the CRM accepting things nobody typed: 73242a46 carried the
 * /contact hero subhead as its message, e6c84f86 carried 160 characters of
 * scraped page prose as its name. The CRM's spam shield then read that
 * boilerplate as bot-like — correctly — and misflagged genuine enquiries.
 *
 * The exact strings below are the ones that were actually submitted, curly
 * quotes and all, because that is the form they arrive in: the page renders
 * `&rsquo;`, so a scraped value is never byte-identical to the source literal.
 */

const HERO_SUBHEAD_AS_SUBMITTED =
  'Tell us what you’re working with and what you’re trying to fix. We’ll take it from there.';

describe('isUiCopy', () => {
  it('catches the hero subhead exactly as lead 73242a46 submitted it', () => {
    expect(isUiCopy(HERO_SUBHEAD_AS_SUBMITTED)).toBe(true);
  });

  it('catches it with our own budget prefix in front, which is how it arrived', () => {
    expect(isUiCopy(`Budget: $50k+\n\n${HERO_SUBHEAD_AS_SUBMITTED}`)).toBe(true);
  });

  it('catches a textarea placeholder', () => {
    expect(isUiCopy(DEFAULT_DETAILS_PLACEHOLDER)).toBe(true);
  });

  it('catches a field placeholder submitted whole', () => {
    expect(isUiCopy('you@company.com')).toBe(true);
  });

  it('does not flag a short placeholder appearing inside a real sentence', () => {
    // Containment only applies to long entries — `Select one` is a substring of
    // plenty of legitimate messages.
    expect(isUiCopy('We have three vendors and need to select one by Friday.')).toBe(false);
  });

  it('does not flag a real message', () => {
    expect(
      isUiCopy('We book about 40 jobs a week in a spreadsheet and it keeps double-booking us.'),
    ).toBe(false);
  });

  it('treats blank as not copy, so an empty optional field is never an error', () => {
    expect(isUiCopy('')).toBe(false);
    expect(isUiCopy('   ')).toBe(false);
  });
});

describe('stripUiCopy', () => {
  it('leaves a real message untouched', () => {
    const real = 'Our intake is three people re-typing the same form. Can that be one step?';
    expect(stripUiCopy(real)).toBe(real);
  });

  it('reduces a message that was only site copy to blank', () => {
    expect(stripUiCopy(HERO_SUBHEAD_AS_SUBMITTED)).toBe('');
  });

  it('keeps what the visitor wrote and drops the scraped run around it', () => {
    const mixed = `${HERO_SUBHEAD_AS_SUBMITTED} We need a booking tool for 12 vans.`;
    expect(stripUiCopy(mixed)).toBe('We need a booking tool for 12 vans.');
  });

  it('is quote-shape agnostic — the DOM form and the source form both strip', () => {
    const straight = HERO_SUBHEAD_AS_SUBMITTED.replace(/’/g, "'");
    expect(stripUiCopy(straight)).toBe('');
  });
});

describe('isPlausibleName — the client_name shape check the CRM has none of', () => {
  it.each([
    'Alex',
    'Mary-Jane O’Connell',
    'José García',
    'María del Carmen García de la Vega',
    '大野 智',
  ])('accepts a real name: %s', (value) => {
    expect(isPlausibleName(value)).toBe(true);
  });

  it('rejects the 160-character prose blob that lead e6c84f86 submitted', () => {
    const blob =
      'Tell us what you’re working with and what you’re trying to fix. Free conversation, ' +
      'flat quote, no surprises — we reply within one business day. Talk to us today.';
    expect(blob.length).toBeGreaterThan(100);
    expect(isPlausibleName(blob)).toBe(false);
  });

  it('rejects anything over NAME_MAX characters', () => {
    expect(isPlausibleName('a'.repeat(NAME_MAX + 1))).toBe(false);
    expect(isPlausibleName(`${'a'.repeat(NAME_MAX - 1)}b`)).toBe(true);
  });

  it.each([
    ['a multi-line block', 'Alex\nSecond line'],
    ['an email address', 'alex@tekguyz.com'],
    ['a URL', 'https://tekguyz.com'],
    ['mid-value sentence punctuation', 'We build systems. Talk to us'],
    ['a question', 'What do you need?'],
    ['digits and punctuation only', '123 456'],
    ['site copy', 'Your name'],
  ])('rejects %s', (_label, value) => {
    expect(isPlausibleName(value)).toBe(false);
  });

  it('rejects a value that is too short before it rejects anything else', () => {
    expect(isPlausibleName('A')).toBe(false);
  });
});

describe('personName schema', () => {
  it('accepts a name and rejects prose, so both sides of the form agree', () => {
    expect(personName.safeParse('Dana Whitfield').success).toBe(true);
    expect(personName.safeParse(HERO_SUBHEAD_AS_SUBMITTED).success).toBe(false);
  });
});
