import { createClient } from "@/lib/supabase/server";
import { ProgrammesManager } from "@/components/admin/ProgrammesManager";

export default async function AdminProgrammesPage() {
  const supabase = await createClient();
  const { data: programmes } = await supabase.from("programmes").select("*").order("created_at");

  return <ProgrammesManager initialProgrammes={programmes ?? []} />;
}
