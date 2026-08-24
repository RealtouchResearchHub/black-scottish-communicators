import { PageHero } from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { User } from "lucide-react";

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: team } = await supabase
    .from("team_members")
    .select("*")
    .eq("active", true)
    .order("sort_order");

  return (
    <>
      <PageHero
        eyebrow="Our team"
        title="The people behind BSC."
        intro="Directors, programme leads and city ambassadors driving BSC's work across Scotland."
      />
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          {team && team.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {team.map((m) => (
                <div key={m.id} className="rounded-sm border border-ink/10 bg-white/50 p-6 text-center relative">
                  {!m.photo_url && (
                    <span className="absolute top-3 left-3 text-[9px] uppercase tracking-wide text-charcoal/40 bg-parchment border border-ink/10 rounded-full px-2 py-0.5">
                      Photo pending
                    </span>
                  )}
                  <div
                    className={`mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-parchment ${
                      m.photo_url ? "border border-gold" : "border border-dashed border-ink/20"
                    }`}
                  >
                    {m.photo_url ? (
                      <Image src={m.photo_url} alt={m.name} width={80} height={80} className="object-cover w-full h-full" />
                    ) : (
                      <User size={30} className="text-gold/50" />
                    )}
                  </div>
                  <h3 className="font-display text-lg text-ink mb-0.5">{m.name}</h3>
                  <p className="text-[11px] uppercase tracking-wide text-thistle font-semibold mb-2">{m.role}</p>
                  {m.bio && <p className="text-sm text-charcoal/70 leading-relaxed">{m.bio}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-ink/15 rounded-sm">
              <p className="font-display text-2xl text-ink mb-2">Team profiles are on the way</p>
              <p className="text-charcoal/60">Check back soon to meet the people leading BSC.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
