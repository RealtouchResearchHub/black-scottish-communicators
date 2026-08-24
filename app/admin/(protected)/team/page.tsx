import { createClient } from "@/lib/supabase/server";
import { TeamManager } from "@/components/admin/TeamManager";

export default async function AdminTeamPage() {
  const supabase = await createClient();
  const { data: team } = await supabase.from("team_members").select("*").order("sort_order");

  return <TeamManager initialTeam={team ?? []} />;
}
