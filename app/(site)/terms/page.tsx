import { PageHero } from "@/components/PageHero";

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Membership Terms" />
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="text-charcoal/80 leading-relaxed">
            By joining BSC you agree to participate respectfully in the
            community, keep your profile information accurate, and follow
            BSC&apos;s programme and event guidelines. Founding 100 membership is
            free for life for BSC&apos;s first 100 registered members, preserved
            unless BSC administrators explicitly change this policy. Paid
            memberships renew annually unless cancelled, with clear notice
            given before any charge.
          </p>
          <p className="text-charcoal/60 text-sm mt-6">
            This is a working draft of membership terms for the Phase 1
            platform and will be reviewed and finalised with BSC&apos;s governance
            team.
          </p>
        </div>
      </section>
    </>
  );
}
