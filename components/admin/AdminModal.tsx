"use client";

import { X } from "lucide-react";

export function AdminModal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-5" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-ink">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-parchment flex items-center justify-center hover:bg-ink/10">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-charcoal/70 mb-1.5 mt-3 first:mt-0">{children}</label>;
}

export const inputClass =
  "w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-gold";
