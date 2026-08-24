import { createClient } from "@/lib/supabase/server";
import { MembersManager } from "@/components/admin/MembersManager";

export default async function AdminMembersPage() {
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("members")
    .select("id, member_number, first_name, last_name, email, job_title, organisation, status, hubs(name)")
    .order("created_at", { ascending: false });

  return <MembersManager initialMembers={(members ?? []) as never} />;
}
