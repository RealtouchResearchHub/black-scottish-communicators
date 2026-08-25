import { PageHero } from "@/components/PageHero";
import { Mail, MapPin, Building2 } from "lucide-react";
import { getSiteContent } from "@/lib/site-content";

const REGISTERED_ADDRESS = "22 Montrose Street, Glasgow, Scotland, G1 1RE";

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
          <div className="flex items-start gap-4 sm:col-span-2">
            <Building2 className="text-gold shrink-0 mt-1" size={22} />
            <div>
              <h2 className="font-display text-xl text-ink mb-1">Registered office address</h2>
              <p className="text-charcoal/75">{REGISTERED_ADDRESS}</p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-5 sm:px-8 mt-10">
          <div className="rounded-sm overflow-hidden border border-ink/10 aspect-[16/9]">
            <iframe
              title="Map to BSC registered office"
              src={`https://www.google.com/maps?q=${encodeURIComponent(REGISTERED_ADDRESS)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(REGISTERED_ADDRESS)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-thistle font-medium hover:text-gold"
          >
            <MapPin size={16} /> Get directions
          </a>
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
