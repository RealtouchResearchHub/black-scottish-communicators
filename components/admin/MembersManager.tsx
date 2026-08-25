"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminModal, FieldLabel, inputClass } from "./AdminModal";
import { Plus, ShieldCheck } from "lucide-react";

type Member = {
  id: string;
  member_number: string | null;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string | null;
  organisation: string | null;
  status: string;
  hubs: { name: string } | null;
};

const STAFF_ROLES = [
  { value: "staff_admin", label: "Staff Admin" },
  { value: "finance_admin", label: "Finance Admin" },
  { value: "impact_admin", label: "Impact Admin" },
  { value: "director", label: "Director" },
  { value: "super_admin", label: "Super Admin (full access)" },
];

export function MembersManager({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [status, setStatus] = useState("active");
  const [roles, setRoles] = useState<string[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function openEdit(m: Member) {
    setEditing(m);
    setStatus(m.status);
    setRoles([]);
    setOpen(true);
    setRolesLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("member_roles").select("role").eq("member_id", m.id);
    setRoles((data ?? []).map((r) => r.role));
    setRolesLoading(false);
  }

  function toggleRole(role: string) {
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  }

  async function saveMember() {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();

    const { error: statusError } = await supabase.from("members").update({ status }).eq("id", editing.id);

    const { data: existingRoles } = await supabase.from("member_roles").select("role").eq("member_id", editing.id);
    const currentStaffRoles = (existingRoles ?? []).map((r) => r.role).filter((r) => STAFF_ROLES.some((s) => s.value === r));
    const toAdd = roles.filter((r) => !currentStaffRoles.includes(r));
    const toRemove = currentStaffRoles.filter((r) => !roles.includes(r));

    if (toAdd.length > 0) {
      await supabase.from("member_roles").insert(toAdd.map((role) => ({ member_id: editing.id, role })));
    }
    for (const role of toRemove) {
      await supabase.from("member_roles").delete().eq("member_id", editing.id).eq("role", role);
    }

    setSaving(false);
    if (!statusError) {
      setMembers((prev) => prev.map((m) => (m.id === editing.id ? { ...m, status } : m)));
      setMessage(`${editing.first_name} ${editing.last_name} updated`);
      setOpen(false);
    } else {
      setMessage(statusError.message);
    }
  }

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      !q ||
      `${m.first_name} ${m.last_name} ${m.email} ${m.hubs?.name ?? ""} ${m.organisation ?? ""}`.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl text-ink">Members &amp; CRM</h1>
          <p className="text-sm text-charcoal/60 mt-1">Every BSC member, from Join BSC signups onward. Click Edit to grant admin access.</p>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-md bg-thistle/10 border border-thistle/20 px-4 py-2 text-sm text-thistle">{message}</div>
      )}

      <input
        className={`${inputClass} bg-white mb-4 max-w-sm`}
        placeholder="Search members…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="rounded-xl border border-ink/10 bg-white overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="bg-ink text-gold-light text-xs uppercase text-left">
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Hub</th>
              <th className="px-4 py-3">Organisation</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-charcoal/50">No members yet - they&apos;ll appear here as people join BSC.</td></tr>
            )}
            {filtered.map((m) => (
              <tr key={m.id} className="border-t border-ink/5 hover:bg-parchment/50">
                <td className="px-4 py-3">
                  <div className="font-medium">{m.first_name} {m.last_name}</div>
                  <div className="text-xs text-charcoal/50">{m.member_number ?? "-"} · {m.email}</div>
                </td>
                <td className="px-4 py-3">{m.hubs?.name ?? "-"}</td>
                <td className="px-4 py-3">{m.organisation ?? "-"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                    m.status === "active" ? "bg-emerald-50 text-emerald-700" : m.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                  }`}>{m.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(m)} className="text-xs font-semibold text-thistle border border-ink/15 rounded-md px-2.5 py-1 hover:border-thistle">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal open={open} title="Edit member" onClose={() => setOpen(false)}>
        {editing && (
          <div>
            <p className="text-sm text-charcoal/70 mb-1">{editing.first_name} {editing.last_name}</p>
            <p className="text-xs text-charcoal/50 mb-4">{editing.email}</p>
            <FieldLabel>Status</FieldLabel>
            <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="mt-5 pt-4 border-t border-ink/10">
              <div className="flex items-center gap-1.5 mb-2">
                <ShieldCheck size={14} className="text-thistle" />
                <FieldLabel>Admin access</FieldLabel>
              </div>
              {rolesLoading ? (
                <p className="text-xs text-charcoal/50">Loading roles…</p>
              ) : (
                <div className="space-y-2">
                  {STAFF_ROLES.map((r) => (
                    <label key={r.value} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={roles.includes(r.value)} onChange={() => toggleRole(r.value)} />
                      {r.label}
                    </label>
                  ))}
                </div>
              )}
              <p className="text-xs text-charcoal/40 mt-2">Checking any role above grants this person access to /admin.</p>
            </div>

            <button
              onClick={saveMember}
              disabled={saving || rolesLoading}
              className="mt-5 w-full rounded-md bg-gold text-ink font-semibold text-sm py-2.5 hover:bg-gold-light disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        )}
      </AdminModal>
    </div>
  );
}

export function AddMemberNote() {
  return (
    <p className="flex items-center gap-1.5 text-xs text-charcoal/50">
      <Plus size={12} /> New members are created automatically through the Join BSC flow.
    </p>
  );
}
