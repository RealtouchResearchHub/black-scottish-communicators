"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminModal, FieldLabel, inputClass } from "./AdminModal";
import { ImageUpload } from "./ImageUpload";
import { Plus, User } from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  sort_order: number;
};

const emptyForm = { name: "", role: "", bio: "", photo_url: null as string | null };

export function TeamManager({ initialTeam }: { initialTeam: TeamMember[] }) {
  const [team, setTeam] = useState(initialTeam);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }
  function openEdit(m: TeamMember) {
    setEditingId(m.id);
    setForm({ name: m.name, role: m.role, bio: m.bio ?? "", photo_url: m.photo_url });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    if (editingId) {
      const { error } = await supabase.from("team_members").update(form).eq("id", editingId);
      if (!error) {
        setTeam((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...form } : t)));
        setMessage(`${form.name} updated`);
        setOpen(false);
      } else setMessage(error.message);
    } else {
      const { data, error } = await supabase
        .from("team_members")
        .insert({ ...form, sort_order: team.length })
        .select()
        .single();
      if (!error && data) {
        setTeam((prev) => [...prev, data as TeamMember]);
        setMessage(`${form.name} added to the team`);
        setOpen(false);
      } else setMessage(error?.message ?? "Something went wrong");
    }
    setSaving(false);
  }

  async function remove() {
    if (!editingId) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("team_members").delete().eq("id", editingId);
    setSaving(false);
    if (!error) {
      setTeam((prev) => prev.filter((t) => t.id !== editingId));
      setMessage("Team member removed");
      setOpen(false);
    } else setMessage(error.message);
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl text-ink">Team &amp; leadership</h1>
          <p className="text-sm text-charcoal/60 mt-1">Add, edit or remove team members. Upload a photo any time.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-1.5 rounded-md bg-gold text-ink text-sm font-semibold px-4 py-2.5 hover:bg-gold-light">
          <Plus size={15} /> Add team member
        </button>
      </div>

      {message && (
        <div className="mb-4 rounded-md bg-thistle/10 border border-thistle/20 px-4 py-2 text-sm text-thistle">{message}</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {team.map((m) => (
          <div key={m.id} className="rounded-xl border border-ink/10 bg-white p-5 text-center relative">
            <button onClick={() => openEdit(m)} className="absolute top-3 right-3 text-xs font-semibold text-thistle border border-ink/15 rounded-md px-2 py-0.5 hover:border-thistle">
              Edit
            </button>
            <div className={`mx-auto mb-3 w-16 h-16 rounded-full flex items-center justify-center overflow-hidden bg-parchment ${m.photo_url ? "border border-gold" : "border border-dashed border-ink/20"}`}>
              {m.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
              ) : (
                <User size={26} className="text-gold/50" />
              )}
            </div>
            <p className="font-display text-base text-ink">{m.name}</p>
            <p className="text-[11px] uppercase tracking-wide text-thistle font-semibold">{m.role}</p>
          </div>
        ))}
      </div>

      <AdminModal open={open} title={editingId ? "Edit team member" : "New team member"} onClose={() => setOpen(false)}>
        <FieldLabel>Profile photo</FieldLabel>
        <ImageUpload value={form.photo_url} onChange={(url) => setForm({ ...form, photo_url: url })} folder="team" />
        <FieldLabel>Full name</FieldLabel>
        <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <FieldLabel>Role / title</FieldLabel>
        <input className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        <FieldLabel>Short bio</FieldLabel>
        <textarea rows={3} className={inputClass} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <div className="flex items-center justify-between mt-5">
          {editingId ? (
            <button onClick={remove} disabled={saving} className="text-sm text-red-600 font-semibold hover:underline">Remove member</button>
          ) : <span />}
          <button onClick={save} disabled={saving || !form.name} className="rounded-md bg-gold text-ink font-semibold text-sm px-5 py-2.5 hover:bg-gold-light disabled:opacity-50">
            {saving ? "Saving…" : "Save member"}
          </button>
        </div>
      </AdminModal>
    </div>
  );
}
