import { PageHero } from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Check, Award } from "lucide-react";

function formatPrice(pence: number, interval: string) {
  if (pence === 0) return "Free";
  const pounds = (pence / 100).toFixed(0);
  return `£${pounds}${interval === "annual" ? "/year" : interval === "monthly" ? "/month" : ""}`;
}

export default async function MembershipPage() {
  const supabase = await createClient();
  const { data: tiers } = await supabase
    .from("membership_tiers")
    .select("*")
    .eq("active", true)
    .order("sort_order");

  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Membership built for where you are."
        intro="Every BSC membership starts with a real profile, clear consent, and a place in the community - not a WhatsApp link. Choose the tier that fits you."
      />
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(tiers ?? []).map((tier) => (
              <div
                key={tier.id}
                className={`flex flex-col rounded-sm border p-7 ${
                  tier.is_founding ? "border-gold bg-ink text-parchment" : "border-ink/10 bg-white/50 text-ink"
                }`}
              >
                {tier.is_founding && (
                  <div className="mb-3 flex items-center gap-2">
                    <Award size={16} className="text-gold-light" />
                    <span className="text-[10px] tracking-[0.15em] uppercase text-gold-light">Limited to first 100</span>
                  </div>
                )}
                <h3 className="font-display text-2xl mb-1">{tier.name}</h3>
                <p className={`text-2xl font-display mb-4 ${tier.is_founding ? "text-gold-light" : "text-thistle"}`}>
                  {formatPrice(tier.price_pence, tier.billing_interval)}
                </p>
                <p className={`text-sm leading-relaxed mb-6 flex-1 ${tier.is_founding ? "text-parchment/70" : "text-charcoal/75"}`}>
                  {tier.description}
                </p>
                <Link
                  href="/join"
                  className={`inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm font-medium transition-colors ${
                    tier.is_founding ? "bg-gold text-ink hover:bg-gold-light" : "bg-ink text-parchment hover:bg-charcoal"
                  }`}
                >
                  Choose {tier.name}
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-16 max-w-2xl mx-auto text-center">
            <p className="text-sm text-charcoal/60 flex items-center justify-center gap-2">
              <Check size={16} className="text-gold" />
              Sponsored and student/community concession memberships may be available - contact BSC to ask.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
