import { PageHero } from '@/components/page-hero';
import { ProcessSteps } from '@/components/process-steps';
import { ClosingCta } from '@/components/closing-cta';
import { ButtonLink } from '@/components/button';
import { buildMetadata, breadcrumbs, jsonLd } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'TEKGUYZ | How We Work',
  description:
    'Four steps, no surprises: Discovery, Blueprint, Build, and Launch & Support. See exactly how a TEKGUYZ project actually runs.',
  path: '/process',
});

export default function ProcessPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbs([{ name: 'Process', path: '/process' }]))}
      />

      <PageHero
        eyebrow="How We Work"
        headline="How We Work"
        description="Four steps. No surprises. No disappearing acts."
      />

      <section className="pb-32">
        <ProcessSteps />
      </section>

      <section className="pb-32">
        <div className="tg-container">
          <ButtonLink href="/contact">Ready to start?</ButtonLink>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
