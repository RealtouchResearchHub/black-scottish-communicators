import { createClient } from "@/lib/supabase/server";
import { Users, UserCheck, Award, CalendarDays, GraduationCap, MapPin } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalMembers },
    { count: activeMembers },
    { count: paidMembers },
    { count: foundingMembers },
    { count: publishedEvents },
    { count: publishedProgrammes },
    { data: hubs },
  ] = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }),
    supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("memberships").select("*", { count: "exact", head: true }).eq("status", "active").eq("is_founding_100", false),
    supabase.from("memberships").select("*", { count: "exact", head: true }).eq("is_founding_100", true),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("programmes").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("hubs").select("id, name, members(count)").eq("active", true),
  ]);

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-ink to-[#2c251e] text-white rounded-2xl p-7 mb-8">
        <span className="inline-block border border-gold text-gold-light text-[11px] rounded-full px-3 py-1 mb-3">
          BSC DIGITAL COMMUNITY &amp; IMPACT PLATFORM
        </span>
        <h1 className="font-display text-3xl mb-2">Welcome to the BSC control centre.</h1>
        <p className="text-white/70 text-sm max-w-2xl">
          Manage members, hubs, events, programmes, the team page and every
          word of copy on the public site — all from here.
        </p>
      </div>

      <h2 className="font-display text-xl text-ink mb-4">Executive dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Metric icon={Users} label="Total members" value={totalMembers ?? 0} />
        <Metric icon={UserCheck} label="Active members" value={activeMembers ?? 0} />
        <Metric icon={Award} label="Founding 100" value={`${foundingMembers ?? 0} / 100`} />
        <Metric icon={Users} label="Paid memberships" value={paidMembers ?? 0} />
        <Metric icon={CalendarDays} label="Published events" value={publishedEvents ?? 0} />
        <Metric icon={GraduationCap} label="Published programmes" value={publishedProgrammes ?? 0} />
      </div>

      <h2 className="font-display text-xl text-ink mb-4 flex items-center gap-2">
        <MapPin size={18} className="text-gold" /> Hub breakdown
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(hubs ?? []).map((h) => (
          <div key={h.id} className="rounded-xl border border-ink/10 bg-white/60 p-5">
            <p className="font-display text-lg text-ink mb-1">{h.name}</p>
            <p className="text-sm text-charcoal/60">
              {(h.members as unknown as { count: number }[])?.[0]?.count ?? 0} members
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-charcoal/40 mt-10">
        This dashboard reflects live data from Supabase. Mentoring,
        opportunities, partner CRM and funding pipeline are visual previews —
        their real backends are planned for Phase 2.
      </p>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white/60 p-5 flex items-center gap-3.5">
      <div className="rounded-lg bg-ink p-2.5">
        <Icon size={18} className="text-gold" />
      </div>
      <div>
        <p className="font-display text-xl text-ink">{value}</p>
        <p className="text-xs text-charcoal/60">{label}</p>
      </div>
    </div>
  );
}
