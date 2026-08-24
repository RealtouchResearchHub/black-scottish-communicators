import { PageHero } from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";
import { HubSkyline } from "@/components/HubSkyline";
import Link from "next/link";

export default async function HubsPage() {
  const supabase = await createClient();
  const { data: hubs } = await supabase.from("hubs").select("*").eq("active", true).order("city");

  return (
    <>
      <PageHero
        eyebrow="City Hubs"
        title="Rooted across Scotland."
        intro="BSC runs local hubs so community, mentoring and events happen close to home. New hubs are added as membership grows."
      />
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 grid sm:grid-cols-2 gap-6">
          {(hubs ?? []).map((hub) => (
            <div
              key={hub.id}
              className="relative overflow-hidden rounded-sm bg-ink text-parchment p-10 flex flex-col justify-between min-h-[14rem]"
              style={hub.cover_image_url ? { backgroundImage: `url(${hub.cover_image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
            >
              {!hub.cover_image_url && (
                <HubSkyline city={hub.city} className="absolute bottom-0 left-0 w-full h-auto opacity-90 text-gold pointer-events-none" />
              )}
              {hub.cover_image_url && <div className="absolute inset-0 bg-ink/50" />}
              <div className="relative z-10">
                <span className="text-xs tracking-[0.2em] uppercase text-gold-light">BSC Hub</span>
                <h2 className="font-display text-3xl mt-3">{hub.name}</h2>
              </div>
              <p className="relative z-10 text-parchment/70 text-sm mt-6">
                Local events, mentoring and community for members based in and around {hub.city}.
              </p>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-6xl px-5 sm:px-8 mt-14 text-center">
          <p className="text-charcoal/70 mb-4">Not near a hub yet? You can still join BSC and take part online.</p>
          <Link href="/join" className="text-thistle font-medium hover:text-gold">Join BSC &rarr;</Link>
        </div>
      </section>
    </>
  );
}
