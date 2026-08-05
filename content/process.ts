/** Verbatim from docs/COPY.md. /process is the only page on the site with numerals. */
export interface ProcessStep {
  numeral: string;
  title: string;
  body: string;
  /** Condensed line used by the homepage process teaser. */
  teaser: string;
}

export const processSteps: ProcessStep[] = [
  {
    numeral: '01',
    title: 'Discovery',
    body: 'We start by learning your business: your workflow, your pain points, and what success actually looks like for you. No templates. No assumptions. Most of this step is us asking questions and listening.',
    teaser: 'Learn your business first.',
  },
  {
    numeral: '02',
    title: 'Blueprint',
    body: "Before any building starts, we map out exactly what we're creating and why. You'll know what you're getting, what it costs, and how long it takes — in plain language, not a spec document you need someone to translate.",
    teaser: 'Map it out before we build.',
  },
  {
    numeral: '03',
    title: 'Build',
    body: "You get regular check-ins throughout the build, not radio silence. We work fast, but we don't cut corners. You'll see it working before it's done.",
    teaser: 'Regular check-ins, not silence.',
  },
  {
    numeral: '04',
    title: 'Launch & Support',
    body: "We don't disappear after go-live. We make sure everything works the way it's supposed to, and we're here when questions come up — because they will.",
    teaser: "We don't disappear after go-live.",
  },
];

/** PLAYBOOK §11 / SEO.md — Review schema, no reviewRating (no numeric score exists). */
export const testimonial = {
  body: "TEKGUYZ integrated our 3CX phones with Twilio and Zoho CRM to fully automate our text surveys and protect our customer experience. They also built a custom internal tool that tracks our team's offline project work perfectly without micro-management. Exceptional execution.",
  author: 'Joe M.',
  source: 'Verified Google review',
  /** The build he is describing. */
  contextSlug: 'team-performance',
} as const;
