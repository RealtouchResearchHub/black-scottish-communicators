"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminModal, FieldLabel, inputClass } from "./AdminModal";
import { ImageUpload } from "./ImageUpload";

type Hub = { id: string; name: string };
type EventRow = {
  id: string;
  title: string;
  starts_at: string;
  location: string | null;
  capacity: number | null;
  status: string;
  hub_id: string | null;
  cover_image_url: string | null;
};

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
}

export function EventsManager({ initialEvents, hubs }: { initialEvents: EventRow[]; hubs: Hub[] }) {
  const emptyForm = {
    title: "", starts_at: "", location: "", capacity: "", hub_id: "", status: "draft",
    cover_image_url: null as string | null, visibility: "public",
  };
  const [events, setEvents] = useState(initialEvents);
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
  function openEdit(e: EventRow) {
    setEditingId(e.id);
    setForm({
      title: e.title,
      starts_at: toLocalInput(e.starts_at),
      location: e.location ?? "",
      capacity: e.capacity?.toString() ?? "",
      hub_id: e.hub_id ?? "",
      status: e.status,
      cover_image_url: e.cover_image_url,
      visibility: "public",
    });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      title: form.title,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
      location: form.location || null,
      capacity: form.capacity ? Number(form.capacity) : null,
      hub_id: form.hub_id || null,
      status: form.status,
      cover_image_url: form.cover_image_url,
      visibility: form.visibility,
    };
    if (editingId) {
      const { error } = await supabase.from("events").update(payload).eq("id", editingId);
      if (!error) {
        setEvents((prev) => prev.map((ev) => (ev.id === editingId ? { ...ev, ...payload } as EventRow : ev)));
        setMessage(`${form.title} updated`);
        setOpen(false);
      } else setMessage(error.message);
    } else {
      const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-5);
      const { data, error } = await supabase.from("events").insert({ ...payload, slug }).select().single();
      if (!error && data) {
        setEvents((prev) => [...prev, data as EventRow]);
        setMessage(`${form.title} created`);
        setOpen(false);
      } else setMessage(error?.message ?? "Something went wrong");
    }
    setSaving(false);
  }

  async function remove() {
    if (!editingId) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("events").delete().eq("id", editingId);
    setSaving(false);
    if (!error) {
      setEvents((prev) => prev.filter((e) => e.id !== editingId));
      setMessage("Event deleted");
      setOpen(false);
    } else setMessage(error.message);
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl text-ink">Events</h1>
          <p className="text-sm text-charcoal/60 mt-1">Create events, upload a cover image, and publish when ready.</p>
        </div>
        <button onClick={openNew} className="rounded-md bg-gold text-ink text-sm font-semibold px-4 py-2.5 hover:bg-gold-light">
          + Create event
        </button>
      </div>

      {message && <div className="mb-4 rounded-md bg-thistle/10 border border-thistle/20 px-4 py-2 text-sm text-thistle">{message}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((e) => (
          <div key={e.id} className="rounded-xl border border-ink/10 bg-white overflow-hidden">
            {e.cover_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={e.cover_image_url} alt="" className="w-full h-28 object-cover" />
            ) : (
              <div className="w-full h-28 bg-thistle/10" />
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${e.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{e.status}</span>
                <button onClick={() => openEdit(e)} className="text-xs font-semibold text-thistle border border-ink/15 rounded-md px-2 py-0.5 hover:border-thistle">Edit</button>
              </div>
              <p className="font-display text-base text-ink mt-2">{e.title}</p>
              <p className="text-xs text-charcoal/50 mt-1">
                {e.starts_at ? new Date(e.starts_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "No date set"}
                {e.location ? ` · ${e.location}` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>

      <AdminModal open={open} title={editingId ? "Edit event" : "New event"} onClose={() => setOpen(false)}>
        <FieldLabel>Event image</FieldLabel>
        <ImageUpload value={form.cover_image_url} onChange={(url) => setForm({ ...form, cover_image_url: url })} folder="events" />
        <FieldLabel>Event title</FieldLabel>
        <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <div><FieldLabel>Date &amp; time</FieldLabel><input type="datetime-local" className={inputClass} value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></div>
          <div><FieldLabel>Capacity</FieldLabel><input type="number" className={inputClass} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
        </div>
        <FieldLabel>Location</FieldLabel>
        <input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Venue name, or 'Online'" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Hub</FieldLabel>
            <select className={inputClass} value={form.hub_id} onChange={(e) => setForm({ ...form, hub_id: e.target.value })}>
              <option value="">No specific hub</option>
              {hubs.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-5">
          {editingId ? (
            <button onClick={remove} disabled={saving} className="text-sm text-red-600 font-semibold hover:underline">Delete event</button>
          ) : <span />}
          <button onClick={save} disabled={saving || !form.title} className="rounded-md bg-gold text-ink font-semibold text-sm px-5 py-2.5 hover:bg-gold-light disabled:opacity-50">
            {saving ? "Saving…" : "Save event"}
          </button>
        </div>
      </AdminModal>
    </div>
  );
}
