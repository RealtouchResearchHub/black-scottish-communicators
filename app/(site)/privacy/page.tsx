import { PageHero } from "@/components/PageHero";

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Notice" />
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="text-charcoal/80 leading-relaxed">
            BSC collects only the personal data needed to run membership,
            programmes, events and community communications, in line with UK
            GDPR and the Data Protection Act. Special-category data (such as
            ethnicity, collected for impact reporting) is optional, clearly
            explained, and access-restricted. You can view, update, or
            request deletion of your data, and withdraw non-essential consent
            (such as marketing preferences) at any time from your member
            profile or by contacting BSC directly.
          </p>
          <p className="text-charcoal/60 text-sm mt-6">
            This is a working draft privacy notice for the Phase 1 platform
            and will be reviewed and finalised with BSC&apos;s governance team.
          </p>
        </div>
      </section>
    </>
  );
}
