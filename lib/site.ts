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
   * this points at the listing rather than the individual review.
   */
  gbp: 'https://share.google/7N09GDWh3d0R1UhEY',
} as const;

export type Site = typeof site;
