import { createClient } from "@/lib/supabase/server";
import { HubsManager } from "@/components/admin/HubsManager";

export default async function AdminHubsPage() {
  const supabase = await createClient();
  const { data: hubs } = await supabase.from("hubs").select("*").order("city");

  return <HubsManager initialHubs={hubs ?? []} />;
}
