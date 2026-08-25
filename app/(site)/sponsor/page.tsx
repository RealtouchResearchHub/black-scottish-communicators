import { PageHero } from "@/components/PageHero";

export default function SponsorPage() {
  return (
    <>
      <PageHero
        eyebrow="Sponsor BSC"
        title="Invest in Black Scottish voices."
        intro="Sponsorship funds programmes, hub events and Founding 100 membership access - with clear reporting back on the impact of your support."
      />
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="text-charcoal/75 leading-relaxed">
            BSC is developing formal sponsorship packages with defined
            benefits and reporting. To discuss sponsoring a programme, event,
            or hub, get in touch via the Contact page.
          </p>
        </div>
      </section>
    </>
  );
}
