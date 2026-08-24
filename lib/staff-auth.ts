import { createClient } from "@/lib/supabase/server";

export const STAFF_ROLES = [
  "staff_admin",
  "finance_admin",
  "impact_admin",
  "director",
  "super_admin",
] as const;

export async function getStaffSession() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return { user: null, isStaff: false, roles: [] as string[] };
  }

  const { data: roles } = await supabase
    .from("member_roles")
    .select("role")
    .eq("member_id", userData.user.id);

  const roleList = (roles ?? []).map((r) => r.role as string);
  const isStaff = roleList.some((r) => (STAFF_ROLES as readonly string[]).includes(r));

  return { user: userData.user, isStaff, roles: roleList };
}
