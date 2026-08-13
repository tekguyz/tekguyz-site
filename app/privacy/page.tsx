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
 * Ships as written in COPY.md. Rewritten 2026-08-12 (Build Phase 3) to cover the
 * three data flows the previously-live text predated: the AI concierge (Gemini),
 * forwarding to TEKGUYZ's own CRM, and the optional phone field. Speed Insights
 * was live and undisclosed; it is now named alongside Web Analytics.
 *
 * Still needs real legal review before being treated as final — that has not
 * changed. No cookie-consent or state-specific (CCPA etc.) language, per the
 * user's call; flagged for the reviewer in COPY.md.
 *
 * The 90-day retention sentence describes lib/lead-archive.ts: a backup copy is
 * written ONLY when internal delivery fails, with a 90-day TTL. If that TTL or
 * that condition changes, this sentence stops being true.
 */

const SECTIONS: [string, string][] = [
  [
    'Information We Collect',
    'If you use our contact form or talk with our AI concierge, we collect the name, email address, phone number (optional), company (optional), area of interest, estimated budget (optional), and project details you provide. We use this only to respond to your inquiry — we don’t sell it, rent it, or share it with third parties for marketing purposes.',
  ],
  [
    'The AI Concierge',
    'If you use the chat assistant on this site, your conversation is sent to Google’s Gemini AI to generate a response. Anything you share there — including contact details — may be captured as an inquiry the same way a contact form submission would be.',
  ],
  [
    'Our CRM',
    'Inquiries submitted through the contact form or the concierge are forwarded to TEKGUYZ’s own customer relationship system, not only to an inbox, so our team can track and respond to them properly.',
  ],
  [
    'Website Analytics & Performance Monitoring',
    'This site uses Vercel Web Analytics and Vercel Speed Insights to understand aggregate traffic and page performance. Neither uses cookies or collects personal identifiers — visitors are identified only by a temporary hash that’s automatically discarded within 24 hours. We cannot use this data to identify you individually.',
  ],
  [
    'Third-Party Services',
    'We use Resend to deliver contact form and concierge submissions to our inbox, Google (Gemini) to power the AI concierge, and Vercel to host this site and run the anonymized analytics and performance monitoring described above. None of these services receive more information than described here.',
  ],
  [
    'Data Retention',
    'We keep contact and concierge inquiries only as long as needed to respond to you and for reasonable business record-keeping afterward. If our system briefly fails to deliver your inquiry internally, a secure backup copy is kept for up to 90 days so nothing gets lost, then it’s automatically deleted.',
  ],
  [
    'Your Rights',
    `You can ask us to tell you what information we have about you, or to delete it, at any time — email ${site.publicEmail}.`,
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
            <span className="tabular">Last updated: August 12, 2026</span>
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
