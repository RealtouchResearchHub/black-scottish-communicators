"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminModal, FieldLabel, inputClass } from "./AdminModal";
import { ImageUpload } from "./ImageUpload";
import { HubSkyline } from "@/components/HubSkyline";

type Hub = {
  id: string;
  name: string;
  city: string;
  active: boolean;
  cover_image_url: string | null;
};

const emptyForm = { name: "", city: "", cover_image_url: null as string | null, active: true };

export function HubsManager({ initialHubs }: { initialHubs: Hub[] }) {
  const [hubs, setHubs] = useState(initialHubs);
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
  function openEdit(h: Hub) {
    setEditingId(h.id);
    setForm({ name: h.name, city: h.city, cover_image_url: h.cover_image_url, active: h.active });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    if (editingId) {
      const { error } = await supabase.from("hubs").update(form).eq("id", editingId);
      if (!error) {
        setHubs((prev) => prev.map((h) => (h.id === editingId ? { ...h, ...form } : h)));
        setMessage(`${form.name} hub updated`);
        setOpen(false);
      } else setMessage(error.message);
    } else {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const { data, error } = await supabase.from("hubs").insert({ ...form, slug }).select().single();
      if (!error && data) {
        setHubs((prev) => [...prev, data as Hub]);
        setMessage(`${form.name} hub added`);
        setOpen(false);
      } else setMessage(error?.message ?? "Something went wrong");
    }
    setSaving(false);
  }

  async function remove() {
    if (!editingId) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("hubs").delete().eq("id", editingId);
    setSaving(false);
    if (!error) {
      setHubs((prev) => prev.filter((h) => h.id !== editingId));
      setMessage("Hub removed");
      setOpen(false);
    } else setMessage(error.message);
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl text-ink">City hubs</h1>
          <p className="text-sm text-charcoal/60 mt-1">Add hubs, upload a cover photo, or use the built-in skyline art.</p>
        </div>
        <button onClick={openNew} className="rounded-md bg-gold text-ink text-sm font-semibold px-4 py-2.5 hover:bg-gold-light">
          + New hub
        </button>
      </div>

      {message && <div className="mb-4 rounded-md bg-thistle/10 border border-thistle/20 px-4 py-2 text-sm text-thistle">{message}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {hubs.map((h) => (
          <div key={h.id} className="relative overflow-hidden rounded-xl border border-ink/10 bg-ink text-white p-5 min-h-[10rem] flex flex-col justify-between">
            {!h.cover_image_url && <HubSkyline city={h.city} className="absolute bottom-0 left-0 w-full h-auto opacity-70 text-gold pointer-events-none" />}
            {h.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={h.cover_image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
            )}
            <button onClick={() => openEdit(h)} className="relative z-10 self-end text-xs font-semibold text-gold-light border border-white/20 rounded-md px-2 py-0.5 hover:border-gold-light">
              Edit
            </button>
            <div className="relative z-10">
              <p className="font-display text-lg">{h.name}</p>
              <p className="text-xs text-white/50">{h.active ? "Active" : "Inactive"}</p>
            </div>
          </div>
        ))}
      </div>

      <AdminModal open={open} title={editingId ? "Edit hub" : "New hub"} onClose={() => setOpen(false)}>
        <FieldLabel>Cover image (optional - falls back to skyline art)</FieldLabel>
        <ImageUpload value={form.cover_image_url} onChange={(url) => setForm({ ...form, cover_image_url: url })} folder="hubs" />
        <FieldLabel>Hub name</FieldLabel>
        <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <FieldLabel>City</FieldLabel>
        <input className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Glasgow, Edinburgh, Aberdeen, Lanarkshire…" />
        <label className="flex items-center gap-2 text-sm mt-4">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Active (visible on the public site)
        </label>
        <div className="flex items-center justify-between mt-5">
          {editingId ? (
            <button onClick={remove} disabled={saving} className="text-sm text-red-600 font-semibold hover:underline">Delete hub</button>
          ) : <span />}
          <button onClick={save} disabled={saving || !form.name} className="rounded-md bg-gold text-ink font-semibold text-sm px-5 py-2.5 hover:bg-gold-light disabled:opacity-50">
            {saving ? "Saving…" : "Save hub"}
          </button>
        </div>
      </AdminModal>
    </div>
  );
}
