import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Award, CalendarDays, Users, GraduationCap, Settings } from "lucide-react";

export default async function MemberDashboard() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const uid = userData.user.id;

  const { data: member } = await supabase.from("members").select("*, hubs(name)").eq("id", uid).maybeSingle();

  if (!member) {
    redirect("/join/complete");
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select("*, membership_tiers(name, is_founding)")
    .eq("member_id", uid)
    .eq("status", "active")
    .maybeSingle();

  const { data: roles } = await supabase.from("member_roles").select("role").eq("member_id", uid);

  const isFounding = roles?.some((r) => r.role === "founding_100");
  const displayName = member.preferred_name || member.first_name;

  return (
    <section className="bg-ink text-parchment min-h-[60vh]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-xs tracking-[0.2em] uppercase text-gold-light">Member Dashboard</span>
            <h1 className="font-display text-4xl mt-2">Welcome, {displayName}.</h1>
          </div>
          {isFounding && (
            <div className="flex items-center gap-2 rounded-sm border border-gold bg-gold/10 px-4 py-2.5">
              <Image src="/brand/logo.png" alt="" width={16} height={16} className="rounded-sm" />
              <span className="text-sm text-gold-light font-medium">Founding 100 Member</span>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          <StatCard label="Member number" value={member.member_number ?? "-"} />
          <StatCard label="Membership" value={membership?.membership_tiers?.name ?? "Pending"} />
          <StatCard label="Hub" value={member.hubs?.name ?? "Not set"} />
          <StatCard label="Status" value={member.status.charAt(0).toUpperCase() + member.status.slice(1)} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <QuickAction icon={CalendarDays} label="Upcoming events" href="/events" />
          <QuickAction icon={Users} label="Find a mentor" href="/mentorship" />
          <QuickAction icon={GraduationCap} label="Programmes" href="/programmes" />
          <QuickAction icon={Settings} label="Edit profile" href="/member/profile" />
        </div>

        {member.development_interests?.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-xl mb-4">Your development interests</h2>
            <div className="flex flex-wrap gap-2">
              {member.development_interests.map((i: string) => (
                <span key={i} className="rounded-sm border border-parchment/20 px-3 py-1.5 text-sm text-parchment/80">{i}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-parchment/15 p-6">
      <p className="text-xs uppercase tracking-wide text-parchment/50 mb-2">{label}</p>
      <p className="font-display text-2xl text-gold-light">{value}</p>
    </div>
  );
}

function QuickAction({ icon: Icon, label, href }: { icon: React.ElementType; label: string; href: string }) {
  return (
    <a href={href} className="flex items-center gap-3 rounded-sm border border-parchment/15 p-5 hover:border-gold/50 transition-colors">
      <Icon size={20} className="text-gold shrink-0" />
      <span className="text-sm text-parchment/90">{label}</span>
    </a>
  );
}
