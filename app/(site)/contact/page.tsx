import { PageHero } from "@/components/PageHero";
import { Mail, MapPin } from "lucide-react";
import { getSiteContent } from "@/lib/site-content";

export default async function ContactPage() {
  const content = await getSiteContent();

  return (
    <>
      <PageHero eyebrow="Contact" title="Get in touch with BSC." />
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 grid sm:grid-cols-2 gap-10">
          <div className="flex items-start gap-4">
            <Mail className="text-gold shrink-0 mt-1" size={22} />
            <div>
              <h2 className="font-display text-xl text-ink mb-1">Email</h2>
              <p className="text-charcoal/75">{content.contact_email}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="text-gold shrink-0 mt-1" size={22} />
            <div>
              <h2 className="font-display text-xl text-ink mb-1">Hubs</h2>
              <p className="text-charcoal/75">Lanarkshire &middot; Glasgow &middot; Edinburgh &middot; Aberdeen</p>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-5 sm:px-8 mt-14 border-t border-ink/10 pt-10">
          <p className="text-charcoal/70 text-sm">
            Prefer to talk it through first? The BSC Assistant in the bottom
            corner of this page can answer questions about programmes,
            membership and hubs any time.
          </p>
        </div>
      </section>
    </>
  );
}
