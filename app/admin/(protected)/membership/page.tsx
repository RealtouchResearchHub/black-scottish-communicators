import { createClient } from "@/lib/supabase/server";
import { TiersManager } from "@/components/admin/TiersManager";

export default async function AdminMembershipPage() {
  const supabase = await createClient();
  const { data: tiers } = await supabase.from("membership_tiers").select("*").order("sort_order");

  return <TiersManager initialTiers={tiers ?? []} />;
}
