"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/PageHero";

type Member = {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  mobile: string | null;
  job_title: string | null;
  organisation: string | null;
  linkedin_url: string | null;
  directory_visible: boolean;
};

export default function ProfileEditPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }
      const { data: m } = await supabase
        .from("members")
        .select("id,first_name,last_name,preferred_name,mobile,job_title,organisation,linkedin_url,directory_visible")
        .eq("id", data.user.id)
        .single();
      setMember(m);
    });
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!member) return;
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    const { error } = await supabase
      .from("members")
      .update({
        preferred_name: member.preferred_name,
        mobile: member.mobile,
        job_title: member.job_title,
        organisation: member.organisation,
        linkedin_url: member.linkedin_url,
        directory_visible: member.directory_visible,
      })
      .eq("id", member.id);
    setSaving(false);
    if (!error) setSaved(true);
  }

  if (!member) {
    return (
      <section className="py-24 bg-parchment text-center">
        <p className="text-charcoal/60">Loading your profile…</p>
      </section>
    );
  }

  return (
    <>
      <PageHero eyebrow="Your Profile" title={`${member.first_name} ${member.last_name}`} />
      <section className="py-16 bg-parchment">
        <form onSubmit={handleSave} className="mx-auto max-w-lg px-5 sm:px-8 space-y-5">
          <TextField label="Preferred name" value={member.preferred_name ?? ""} onChange={(v) => setMember({ ...member, preferred_name: v })} />
          <TextField label="Mobile" value={member.mobile ?? ""} onChange={(v) => setMember({ ...member, mobile: v })} />
          <TextField label="Job title" value={member.job_title ?? ""} onChange={(v) => setMember({ ...member, job_title: v })} />
          <TextField label="Organisation" value={member.organisation ?? ""} onChange={(v) => setMember({ ...member, organisation: v })} />
          <TextField label="LinkedIn URL" value={member.linkedin_url ?? ""} onChange={(v) => setMember({ ...member, linkedin_url: v })} />
          <label className="flex items-center gap-3 text-sm text-charcoal/80 pt-2">
            <input
              type="checkbox"
              checked={member.directory_visible}
              onChange={(e) => setMember({ ...member, directory_visible: e.target.checked })}
            />
            Show my profile in the member directory
          </label>
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-ink text-parchment px-6 py-3 text-sm font-medium hover:bg-charcoal disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved && <p className="text-sm text-thistle">Profile updated.</p>}
        </form>
      </section>
    </>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm text-charcoal/70 mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm bg-white outline-none focus-visible:ring-1 focus-visible:ring-gold"
      />
    </div>
  );
}
