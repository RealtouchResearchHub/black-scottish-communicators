import { PageHero } from "@/components/PageHero";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <>
      <PageHero
        eyebrow="About BSC"
        title="Black Scottish Communicators"
        intro="A Community Interest Company built around one belief: that communication confidence changes what's possible — for a person, and for a community."
        backgroundImage="/images/brand-banner.jpg"
      />
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 space-y-16">
          <div>
            <h2 className="font-display text-3xl text-ink mb-4">Mission, Vision &amp; BLACK Values</h2>
            <p className="text-charcoal/80 leading-relaxed">{content.about_copy}</p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-ink mb-4">Founder &amp; Leadership</h2>
            <p className="text-charcoal/80 leading-relaxed">
              BSC is led by a small, committed team of directors and city
              ambassadors across Scotland.{" "}
              <Link href="/team" className="text-thistle underline hover:text-gold">
                Meet the team
              </Link>
              .
            </p>
          </div>
          <div className="rounded-sm border border-thistle/20 bg-thistle/5 p-8">
            <h2 className="font-display text-2xl text-ink mb-3">Why &ldquo;Founding 100&rdquo;?</h2>
            <p className="text-charcoal/80 leading-relaxed">
              BSC&apos;s first 100 members shape the organisation from the ground
              up. In recognition, Founding 100 members receive permanent free
              membership and a lifetime badge — a promise BSC intends to keep.
            </p>
            <Link href="/join" className="inline-block mt-5 text-thistle font-medium hover:text-gold">
              Become a Founding 100 member &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
