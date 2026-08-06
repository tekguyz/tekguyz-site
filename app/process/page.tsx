import { PageHero } from '@/components/page-hero';
import { ProcessSteps } from '@/components/process-steps';
import { ClosingCta } from '@/components/closing-cta';
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
        paddingBottom={96}
      />

      <ProcessSteps />

      <ClosingCta />
    </>
  );
}
