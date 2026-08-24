"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminModal, FieldLabel, inputClass } from "./AdminModal";
import { Award } from "lucide-react";

type Tier = {
  id: string;
  name: string;
  description: string | null;
  price_pence: number;
  billing_interval: string;
  is_founding: boolean;
};

export function TiersManager({ initialTiers }: { initialTiers: Tier[] }) {
  const [tiers, setTiers] = useState(initialTiers);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tier | null>(null);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function openEdit(t: Tier) {
    setEditing(t);
    setPrice((t.price_pence / 100).toString());
    setDescription(t.description ?? "");
    setOpen(true);
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();
    const price_pence = Math.round(parseFloat(price || "0") * 100);
    const { error } = await supabase.from("membership_tiers").update({ price_pence, description }).eq("id", editing.id);
    setSaving(false);
    if (!error) {
      setTiers((prev) => prev.map((t) => (t.id === editing.id ? { ...t, price_pence, description } : t)));
      setMessage(`${editing.name} updated`);
      setOpen(false);
    } else setMessage(error.message);
  }

  function formatPrice(pence: number, interval: string) {
    if (pence === 0) return "Free";
    return `£${(pence / 100).toFixed(0)}${interval === "annual" ? "/yr" : interval === "monthly" ? "/mo" : ""}`;
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-ink">Membership &amp; payments</h1>
        <p className="text-sm text-charcoal/60 mt-1">
          Protect the free Founding 100 promise while editing pricing and descriptions for paid tiers.
        </p>
      </div>

      {message && <div className="mb-4 rounded-md bg-thistle/10 border border-thistle/20 px-4 py-2 text-sm text-thistle">{message}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tiers.map((t) => (
          <div key={t.id} className={`rounded-xl border p-5 ${t.is_founding ? "bg-ink text-white border-gold" : "bg-white border-ink/10"}`}>
            {t.is_founding && <div className="flex items-center gap-1.5 mb-2"><Award size={14} className="text-gold-light" /><span className="text-[10px] uppercase tracking-wide text-gold-light">Legacy status</span></div>}
            <p className="font-display text-lg">{t.name}</p>
            <p className={`font-display text-2xl my-2 ${t.is_founding ? "text-gold-light" : "text-thistle"}`}>{formatPrice(t.price_pence, t.billing_interval)}</p>
            <p className={`text-xs leading-relaxed mb-4 ${t.is_founding ? "text-white/60" : "text-charcoal/60"}`}>{t.description}</p>
            <button
              onClick={() => openEdit(t)}
              className={`text-xs font-semibold rounded-md px-2.5 py-1 border ${t.is_founding ? "border-white/20 text-gold-light hover:border-gold-light" : "border-ink/15 text-thistle hover:border-thistle"}`}
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      <AdminModal open={open} title={`Edit ${editing?.name ?? "tier"}`} onClose={() => setOpen(false)}>
        {editing?.is_founding && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mb-3">
            This is the Founding 100 tier — its free lifetime promise should not be changed lightly.
          </p>
        )}
        <FieldLabel>Price (£, per year)</FieldLabel>
        <input type="number" step="0.01" className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} />
        <FieldLabel>Description</FieldLabel>
        <textarea rows={3} className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
        <button onClick={save} disabled={saving} className="mt-5 w-full rounded-md bg-gold text-ink font-semibold text-sm py-2.5 hover:bg-gold-light disabled:opacity-50">
          {saving ? "Saving…" : "Save tier"}
        </button>
      </AdminModal>
    </div>
  );
}
