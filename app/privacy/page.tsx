import { PageHero } from '@/components/page-hero';
import { ClosingCta } from '@/components/closing-cta';
import { site } from '@/lib/site';
import { buildMetadata, breadcrumbs, jsonLd } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'TEKGUYZ | Privacy Policy',
  description:
    'What information TEKGUYZ collects through this website, why, and how to reach us about it.',
  path: '/privacy',
});

/**
 * Ships as written in COPY.md, which reproduces the currently-live policy.
 *
 * KNOWN GAP, surfaced in docs/archive/HISTORY.md and the build summary: this text predates
 * three data flows the rebuild introduces and does NOT yet cover them —
 *   1. the AI concierge (conversations go to Google for processing, and details
 *      shared there may be captured as a lead exactly like a form submission),
 *   2. forwarding to TEKGUYZ's own CRM, not only to an inbox,
 *   3. the new optional phone field.
 * Those need a human legal decision, not drafted text from a build step.
 */

const SECTIONS: [string, string][] = [
  [
    'Information We Collect',
    'If you use our contact form, we collect the name, email address, company (optional), area of interest, estimated budget (optional), and project details you provide. We use this only to respond to your inquiry — we don’t sell it, rent it, or share it with third parties for marketing purposes.',
  ],
  [
    'Website Analytics',
    'This site uses Vercel Web Analytics to understand aggregate traffic patterns. It does not use cookies and does not collect personal identifiers — visitors are identified only by a temporary hash that Vercel automatically discards within 24 hours. We cannot use this data to identify you individually.',
  ],
  [
    'Third-Party Services',
    'We use Resend to deliver contact form submissions to our inbox, and Vercel to host this site and run the anonymized analytics described above. Neither service receives more information than described here.',
  ],
  [
    'Data Retention',
    'We keep contact form submissions only as long as needed to respond to your inquiry and for reasonable business record-keeping afterward.',
  ],
  [
    'Your Rights',
    `You can ask us to tell you what information we have about you, or to delete it, at any time — email ${site.publicEmail}.`,
  ],
  [
    'Children’s Privacy',
    'This site is not directed at children under 13, and we do not knowingly collect information from them.',
  ],
  [
    'Changes to This Policy',
    'We may update this policy from time to time. The date at the top reflects the most recent revision.',
  ],
  ['Contact', `Questions about this policy: ${site.publicEmail}`],
];

export default function PrivacyPage() {
  return (
    <div>
    {/* One root element, never a multi-child fragment — Next scrolls the new
        segment into view on every client-side transition, and a fragment routes
        that through FragmentInstance.scrollIntoView(), which calls
        scrollIntoView() on EVERY top-level child. Mechanism in full:
        app/contact/page.tsx. Keep the JSON-LD script inside the wrapper. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbs([{ name: 'Privacy', path: '/privacy' }]))}
      />

      <PageHero eyebrow="Legal" headline="Privacy Policy" />

      <section className="pb-20 md:pb-32">
        <div className="tg-container">
          <p className="text-[0.875rem] text-secondary">
            <span className="tabular">Last updated: July 13, 2026</span>
          </p>

          <p className="mt-10 max-w-[68ch] text-[length:var(--text-body)]">
            TEKGUYZ (&ldquo;we,&rdquo; &ldquo;us&rdquo;) respects your privacy. This page explains
            what information we collect through this website, why, and how you can reach us about
            it.
          </p>

          <div className="mt-12 flex flex-col gap-10">
            {SECTIONS.map(([heading, body]) => (
              <section key={heading}>
                <h2 className="text-[length:var(--text-title)] leading-[1.2] font-semibold tracking-[-0.02em]">
                  {heading}
                </h2>
                <p className="mt-3 max-w-[68ch] text-[length:var(--text-body)]">{body}</p>
              </section>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta />
    </div>
  );
}
