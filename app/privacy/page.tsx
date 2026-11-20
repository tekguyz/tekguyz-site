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
 *
 * Updated 2026-11-18 (tekguyz-one#23): Vercel Web Analytics and Speed Insights
 * removed; Google Analytics 4 named instead (it uses cookies, so the old
 * "no cookies" sentence is gone). No consent banner, per the founder's call.
 *
 * Updated 2026-11-16 (#81): Cal.com (`site.bookingUrl`), Upstash (the IP rate
 * limit in lib/rate-limit.ts, a 60-second sliding window, and the backup
 * above), and the live demos. Each demo sentence was checked against that
 * demo's live landing page the same day; none was guessed.
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
    'Booking a Call',
    'The free first conversation is booked on Cal.com. When you pick a time there, Cal.com collects the name, email and any notes you give it, under its own privacy policy, and sends the booking to us.',
  ],
  [
    'Spam and Abuse Protection',
    'To stop spam, the contact form and the chat assistant limit how often one IP address can send. The count is kept in Upstash, a data service, for a few minutes at most, and is not tied to your name or email.',
  ],
  [
    'Website Analytics',
    'This site and our live demos use Google Analytics to understand aggregate traffic: which pages are viewed, roughly where visitors are located, what device they use, and which link or site brought them here. Google Analytics sets cookies in your browser to tell visits apart. We do not use it to identify you personally, and we do not use it for advertising.',
  ],
  [
    'Third-Party Services',
    'We use Resend to deliver contact form and concierge submissions to our inbox, Google (Gemini) to power the AI concierge, Upstash for the spam limit and the backup copy described below, Cal.com for booking calls, Google Analytics for the traffic counts described above, and Vercel to host this site. None of these services receive more information than described here.',
  ],
  [
    'Our Live Demos',
    'Our Work page links to live demos. Each one is a separate site on its own address, built on made-up businesses and sample data, and none needs a sign-up. Most keep nothing: in Missed Call Follow-Up, No-Show Rescue, Book Your Visit and Team Performance nothing leaves your browser, and in Quote to Paid, Win-Back, Cart Reminders and Coffee Brand & Shop no message is sent and no card is charged (Cart Reminders and Coffee Brand & Shop run a real Shopify store and Stripe in test mode). The AI Voice Receptionist asks for your microphone only when you call, keeps only the words, never your voice, and deletes them after 7 days. Field Photo Reports gives you your own copy with sample data and deletes it after 7 days. The Lead & Pipeline CRM gives you your own workspace of sample data, with email, import and invites switched off. AI Meeting Notes opens sample notes; recording a real meeting needs an account, and accounts are by invitation only. Each demo’s own landing page says what it does before you start.',
  ],
  [
    'Data Retention',
    'We keep contact and concierge inquiries only as long as needed to respond to you and for reasonable business record-keeping afterward. If our system briefly fails to deliver your inquiry internally, a secure backup copy is kept in Upstash for up to 90 days so nothing gets lost, then it’s automatically deleted.',
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

      <section className="pt-16 pb-20 md:pt-20 md:pb-28">
        <div className="tg-container">
          <p className="label text-mute">
            <span className="tabular">Last updated: November 16, 2026</span>
          </p>

          <p className="mt-10 max-w-[68ch] text-[length:var(--text-body)]">
            TEKGUYZ (&ldquo;we,&rdquo; &ldquo;us&rdquo;) respects your privacy. This page explains
            what information we collect through this website, why, and how you can reach us about
            it.
          </p>

          <div className="mt-12 flex flex-col gap-10">
            {SECTIONS.map(([heading, body]) => (
              <section key={heading}>
                <h2 className="text-[length:var(--text-title)]">
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
