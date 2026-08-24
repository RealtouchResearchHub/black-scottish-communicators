"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminModal, FieldLabel, inputClass } from "./AdminModal";
import { ImageUpload } from "./ImageUpload";

type Programme = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  cover_image_url: string | null;
};

const CATEGORIES = [
  "public_speaking_leadership",
  "mentorship",
  "storytelling_events",
  "digital_media_training",
  "behavioural_coaching",
];

const emptyForm = {
  title: "", description: "", category: CATEGORIES[0], status: "draft",
  cover_image_url: null as string | null,
};

export function ProgrammesManager({ initialProgrammes }: { initialProgrammes: Programme[] }) {
  const [programmes, setProgrammes] = useState(initialProgrammes);
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
  function openEdit(p: Programme) {
    setEditingId(p.id);
    setForm({ title: p.title, description: p.description ?? "", category: p.category, status: p.status, cover_image_url: p.cover_image_url });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    if (editingId) {
      const { error } = await supabase.from("programmes").update(form).eq("id", editingId);
      if (!error) {
        setProgrammes((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...form } : p)));
        setMessage(`${form.title} updated`);
        setOpen(false);
      } else setMessage(error.message);
    } else {
      const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const { data, error } = await supabase.from("programmes").insert({ ...form, slug }).select().single();
      if (!error && data) {
        setProgrammes((prev) => [...prev, data as Programme]);
        setMessage(`${form.title} added`);
        setOpen(false);
      } else setMessage(error?.message ?? "Something went wrong");
    }
    setSaving(false);
  }

  async function remove() {
    if (!editingId) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("programmes").delete().eq("id", editingId);
    setSaving(false);
    if (!error) {
      setProgrammes((prev) => prev.filter((p) => p.id !== editingId));
      setMessage("Programme deleted");
      setOpen(false);
    } else setMessage(error.message);
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl text-ink">Programme management</h1>
          <p className="text-sm text-charcoal/60 mt-1">Add or edit programmes shown on the public Programmes page.</p>
        </div>
        <button onClick={openNew} className="rounded-md bg-gold text-ink text-sm font-semibold px-4 py-2.5 hover:bg-gold-light">
          + New programme
        </button>
      </div>

      {message && <div className="mb-4 rounded-md bg-thistle/10 border border-thistle/20 px-4 py-2 text-sm text-thistle">{message}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {programmes.map((p) => (
          <div key={p.id} className="rounded-xl border border-ink/10 bg-white p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${p.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{p.status}</span>
              <button onClick={() => openEdit(p)} className="text-xs font-semibold text-thistle border border-ink/15 rounded-md px-2 py-0.5 hover:border-thistle">Edit</button>
            </div>
            <p className="font-display text-lg text-ink">{p.title}</p>
            <p className="text-xs text-charcoal/60 mt-1 line-clamp-2">{p.description}</p>
          </div>
        ))}
      </div>

      <AdminModal open={open} title={editingId ? "Edit programme" : "New programme"} onClose={() => setOpen(false)}>
        <FieldLabel>Cover image (optional)</FieldLabel>
        <ImageUpload value={form.cover_image_url} onChange={(url) => setForm({ ...form, cover_image_url: url })} folder="programmes" />
        <FieldLabel>Programme title</FieldLabel>
        <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <FieldLabel>Description</FieldLabel>
        <textarea rows={3} className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Category</FieldLabel>
            <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
            </select>
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-5">
          {editingId ? (
            <button onClick={remove} disabled={saving} className="text-sm text-red-600 font-semibold hover:underline">Delete programme</button>
          ) : <span />}
          <button onClick={save} disabled={saving || !form.title} className="rounded-md bg-gold text-ink font-semibold text-sm px-5 py-2.5 hover:bg-gold-light disabled:opacity-50">
            {saving ? "Saving…" : "Save programme"}
          </button>
        </div>
      </AdminModal>
    </div>
  );
}
