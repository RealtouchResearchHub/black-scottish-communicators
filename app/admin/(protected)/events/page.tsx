import { createClient } from "@/lib/supabase/server";
import { EventsManager } from "@/components/admin/EventsManager";

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const [{ data: events }, { data: hubs }] = await Promise.all([
    supabase.from("events").select("*").order("starts_at", { ascending: false }),
    supabase.from("hubs").select("id, name").eq("active", true).order("city"),
  ]);

  return <EventsManager initialEvents={events ?? []} hubs={hubs ?? []} />;
}
