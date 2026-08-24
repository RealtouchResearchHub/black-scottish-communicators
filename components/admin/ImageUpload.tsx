"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, Loader2 } from "lucide-react";

export function ImageUpload({
  value,
  onChange,
  folder,
  label = "Click or drop to upload an image",
}: {
  value: string | null;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("bsc-media")
        .upload(path, file, { upsert: false, cacheControl: "3600" });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("bsc-media")
        .getPublicUrl(path);
      onChange(publicUrlData.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="w-full h-24 object-cover rounded-md mb-2 bg-parchment"
        />
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-ink/15 py-3.5 text-xs text-charcoal/60 hover:border-gold/60 hover:text-ink transition-colors disabled:opacity-60"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {uploading ? "Uploading…" : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}
