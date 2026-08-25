"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImageUpload } from "./ImageUpload";
import { FieldLabel, inputClass } from "./AdminModal";
import Image from "next/image";

export function ContentEditor({ initial }: { initial: Record<string, string> }) {
  const [heroHeadline, setHeroHeadline] = useState(initial.hero_headline ?? "");
  const [heroSubtext, setHeroSubtext] = useState(initial.hero_subtext ?? "");
  const [aboutCopy, setAboutCopy] = useState(initial.about_copy ?? "");
  const [contactEmail, setContactEmail] = useState(initial.contact_email ?? "");
  const [logoUrl, setLogoUrl] = useState<string | null>(initial.logo_url || null);
  const [facebookUrl, setFacebookUrl] = useState(initial.facebook_url ?? "");
  const [instagramUrl, setInstagramUrl] = useState(initial.instagram_url ?? "");
  const [xUrl, setXUrl] = useState(initial.x_url ?? "");
  const [tiktokUrl, setTiktokUrl] = useState(initial.tiktok_url ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initial.youtube_url ?? "");
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function saveKey(key: string, value: string) {
    setSaving(key);
    const supabase = createClient();
    const { error } = await supabase.from("site_content").upsert({ key, value });
    setSaving(null);
    setMessage(error ? error.message : "Saved");
    setTimeout(() => setMessage(null), 2500);
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-ink">Website content editor</h1>
        <p className="text-sm text-charcoal/60 mt-1">Edit text and images across the public site without touching code.</p>
      </div>

      {message && <div className="mb-4 rounded-md bg-thistle/10 border border-thistle/20 px-4 py-2 text-sm text-thistle">{message}</div>}

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="rounded-xl border border-ink/10 bg-white p-5">
          <h3 className="font-display text-lg text-ink mb-3">Home hero</h3>
          <FieldLabel>Headline</FieldLabel>
          <input className={inputClass} value={heroHeadline} onChange={(e) => setHeroHeadline(e.target.value)} />
          <FieldLabel>Sub-text</FieldLabel>
          <textarea rows={3} className={inputClass} value={heroSubtext} onChange={(e) => setHeroSubtext(e.target.value)} />
          <button
            onClick={() => { saveKey("hero_headline", heroHeadline); saveKey("hero_subtext", heroSubtext); }}
            disabled={saving !== null}
            className="mt-3 rounded-md bg-gold text-ink font-semibold text-sm px-4 py-2 hover:bg-gold-light disabled:opacity-50"
          >
            Save
          </button>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-5">
          <h3 className="font-display text-lg text-ink mb-3">Logo &amp; brand mark</h3>
          <div className="flex items-center gap-4 mb-3">
            <Image src={logoUrl || "/brand/logo.png"} alt="" width={56} height={56} className="rounded-lg object-cover" />
            <div className="flex-1">
              <ImageUpload value={logoUrl} onChange={(url) => setLogoUrl(url)} folder="brand" label="Replace logo" />
            </div>
          </div>
          <p className="text-xs text-charcoal/50 mb-3">Used in site nav, admin sidebar, footer and the homepage hero.</p>
          <button
            onClick={() => saveKey("logo_url", logoUrl ?? "")}
            disabled={saving !== null}
            className="rounded-md bg-gold text-ink font-semibold text-sm px-4 py-2 hover:bg-gold-light disabled:opacity-50"
          >
            Save logo
          </button>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-5">
          <h3 className="font-display text-lg text-ink mb-3">About page copy</h3>
          <textarea rows={5} className={inputClass} value={aboutCopy} onChange={(e) => setAboutCopy(e.target.value)} />
          <button
            onClick={() => saveKey("about_copy", aboutCopy)}
            disabled={saving !== null}
            className="mt-3 rounded-md bg-gold text-ink font-semibold text-sm px-4 py-2 hover:bg-gold-light disabled:opacity-50"
          >
            Save
          </button>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-5">
          <h3 className="font-display text-lg text-ink mb-3">Contact details</h3>
          <FieldLabel>Email</FieldLabel>
          <input className={inputClass} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          <button
            onClick={() => saveKey("contact_email", contactEmail)}
            disabled={saving !== null}
            className="mt-3 rounded-md bg-gold text-ink font-semibold text-sm px-4 py-2 hover:bg-gold-light disabled:opacity-50"
          >
            Save
          </button>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-5 sm:col-span-2">
          <h3 className="font-display text-lg text-ink mb-3">Social media</h3>
          <p className="text-xs text-charcoal/50 mb-4">Only networks with a link filled in will show as icons in the footer.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <FieldLabel>Facebook</FieldLabel>
              <input className={inputClass} value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} placeholder="https://facebook.com/…" />
            </div>
            <div>
              <FieldLabel>Instagram</FieldLabel>
              <input className={inputClass} value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/…" />
            </div>
            <div>
              <FieldLabel>X (Twitter)</FieldLabel>
              <input className={inputClass} value={xUrl} onChange={(e) => setXUrl(e.target.value)} placeholder="https://x.com/…" />
            </div>
            <div>
              <FieldLabel>TikTok</FieldLabel>
              <input className={inputClass} value={tiktokUrl} onChange={(e) => setTiktokUrl(e.target.value)} placeholder="https://tiktok.com/@…" />
            </div>
            <div>
              <FieldLabel>YouTube</FieldLabel>
              <input className={inputClass} value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/@…" />
            </div>
          </div>
          <button
            onClick={() => {
              saveKey("facebook_url", facebookUrl);
              saveKey("instagram_url", instagramUrl);
              saveKey("x_url", xUrl);
              saveKey("tiktok_url", tiktokUrl);
              saveKey("youtube_url", youtubeUrl);
            }}
            disabled={saving !== null}
            className="mt-4 rounded-md bg-gold text-ink font-semibold text-sm px-4 py-2 hover:bg-gold-light disabled:opacity-50"
          >
            Save social links
          </button>
        </div>
      </div>
    </div>
  );
}
