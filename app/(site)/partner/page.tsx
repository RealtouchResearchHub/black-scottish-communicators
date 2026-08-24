import { PageHero } from "@/components/PageHero";

export default function PartnerPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner With BSC"
        title="Build something with us."
        intro="BSC partners with employers, schools, councils and community organisations on training, mentoring cohorts, and civic initiatives."
      />
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="text-charcoal/75 leading-relaxed mb-6">
            Whether it&apos;s an employer-funded cohort, a corporate training
            partnership, or a civic collaboration, we&apos;d like to hear what
            you&apos;re thinking of building. Reach out via the Contact page and
            the BSC team will follow up.
          </p>
        </div>
      </section>
    </>
  );
}
