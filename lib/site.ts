/**
 * Company facts. Sourced from PLAYBOOK §9 — do not invent additions here.
 * A phone number is deliberately absent: none is published yet.
 */
export const site = {
  name: 'TEKGUYZ',
  url: 'https://tekguyz.com',
  tagline: 'We build tech that actually works.',

  /** Shown to visitors, used in all public-facing copy. */
  publicEmail: 'hello@tekguyz.com',
  /** Internal inbox the contact form actually delivers to. */
  formDeliveryEmail: 'contact@tekguyz.com',

  location: 'South Florida',
  locationLong: 'South Florida, remote nationwide',
  hours: 'Mon–Fri, 9am–5pm',
  hoursLong: 'Mon–Fri, 9:00 AM–5:00 PM',

  social: {
    linkedin: 'https://linkedin.com/company/tekguyz',
    instagram: 'https://instagram.com/tekguyz',
    facebook: 'https://facebook.com/profile.php?id=61590634780166',
    github: 'https://github.com/tekguyz',
  },

  /**
   * Google Business Profile listing. COPY.md's testimonial asks for a "Read it
   * on Google" link and marks the direct review permalink as still open, so
   * this points at the listing rather than the individual review — Google
   * offers no durable per-review permalink, and the profile URL is the stable
   * substitute by decision (COPY.md, "WRITING GAPS STILL OPEN" §2).
   *
   * The `cid=` form, NOT the `share.google/…` shortlink this used to hold.
   * COPY.md recorded this exact URL as the resolved one on 2026-08-10 and the
   * code kept the shortlink, so the two drifted. The cid is Google's stable
   * place identifier and is auditable on sight; a `share.google` link is an
   * external redirector whose target can change or be revoked without any
   * change to this repo, which is the drift class that has bitten this project
   * before. Re-verified 200 on 2026-08-13.
   */
  gbp: 'https://www.google.com/maps?cid=13204262572880001655',
} as const;

export type Site = typeof site;
