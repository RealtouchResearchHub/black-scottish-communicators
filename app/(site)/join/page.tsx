"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHero } from "@/components/PageHero";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";

type Hub = { id: string; name: string; city: string };

const DEVELOPMENT_INTERESTS = [
  "Public speaking", "Interview confidence", "Leadership", "Career progression",
  "Networking", "Storytelling", "Digital communication", "Mentoring",
  "Entrepreneurship", "Civic leadership", "Media visibility", "Facilitation", "Other",
];

const PARTICIPATION_INTERESTS = [
  "Attend programmes", "Find a mentor", "Become a mentor", "Volunteer",
  "Become an ambassador", "Speak at an event", "Deliver training", "Partner/sponsor BSC",
];

type FormData = {
  firstName: string; lastName: string; preferredName: string; email: string; mobile: string; hubId: string;
  employmentStatus: string; jobTitle: string; organisation: string; sector: string; careerLevel: string; linkedinUrl: string;
  developmentInterests: string[]; participationInterests: string[];
  consentPrivacy: boolean; consentTerms: boolean; consentEmail: boolean; consentWhatsapp: boolean; consentPhoto: boolean;
};

const initialForm: FormData = {
  firstName: "", lastName: "", preferredName: "", email: "", mobile: "", hubId: "",
  employmentStatus: "", jobTitle: "", organisation: "", sector: "", careerLevel: "", linkedinUrl: "",
  developmentInterests: [], participationInterests: [],
  consentPrivacy: false, consentTerms: false, consentEmail: false, consentWhatsapp: false, consentPhoto: false,
};

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 rounded-sm border px-3 py-2 text-sm text-left transition-colors ${
        checked ? "border-gold bg-gold/10 text-ink" : "border-ink/15 text-charcoal/70 hover:border-ink/30"
      }`}
    >
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${checked ? "bg-gold border-gold" : "border-ink/25"}`}>
        {checked && <Check size={12} className="text-ink" />}
      </span>
      {label}
    </button>
  );
}

export default function JoinPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("hubs").select("id,name,city").eq("active", true).order("city").then(({ data }) => setHubs(data ?? []));
  }, []);

  function toggle(list: keyof Pick<FormData, "developmentInterests" | "participationInterests">, value: string) {
    setForm((f) => {
      const has = f[list].includes(value);
      return { ...f, [list]: has ? f[list].filter((v) => v !== value) : [...f[list], value] };
    });
  }

  const steps = ["Core details", "Professional profile", "Interests", "Consent & review"];
  const canProceedStep0 = form.firstName && form.lastName && form.email && form.hubId;
  const canSubmit = form.consentPrivacy && form.consentTerms;

  async function handleSubmit() {
    setError(null);
    if (!canSubmit) {
      setError("Privacy notice and membership terms must be accepted to continue.");
      return;
    }
    setSubmitting(true);
    try {
      localStorage.setItem("bsc_join_draft", JSON.stringify({ ...form, email: form.email.trim().toLowerCase() }));

      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: form.email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/join/complete`,
          shouldCreateUser: true,
        },
      });

      if (otpError) throw otpError;
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <>
        <PageHero eyebrow="Join BSC" title="Check your email" />
        <section className="py-20 bg-parchment">
          <div className="mx-auto max-w-lg px-5 sm:px-8 text-center">
            <p className="text-charcoal/80 leading-relaxed">
              We&apos;ve sent a secure sign-in link to <strong>{form.email}</strong>.
              Open it on this device to confirm your email and finish
              creating your BSC profile - your details are saved and waiting.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Join BSC"
        title="Create your profile."
        intro="Discover → Create profile → Confirm consent → Welcome. WhatsApp and other community channels are optional and come after this."
      />
      <section className="py-16 bg-parchment">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <div className="flex items-center gap-2 mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex-1">
                <div className={`h-1 rounded-full ${i <= step ? "bg-gold" : "bg-ink/10"}`} />
                <p className={`text-xs mt-2 ${i === step ? "text-ink font-medium" : "text-charcoal/40"}`}>{s}</p>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          {step === 0 && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="First name" required value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
                <Field label="Last name" required value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
              </div>
              <Field label="Preferred name (optional)" value={form.preferredName} onChange={(v) => setForm({ ...form, preferredName: v })} />
              <Field label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Field label="Mobile (optional)" type="tel" value={form.mobile} onChange={(v) => setForm({ ...form, mobile: v })} />
              <div>
                <label className="block text-sm text-charcoal/70 mb-1.5">City / Hub *</label>
                <select
                  value={form.hubId}
                  onChange={(e) => setForm({ ...form, hubId: e.target.value })}
                  className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm bg-white outline-none focus-visible:ring-1 focus-visible:ring-gold"
                >
                  <option value="">Select a hub</option>
                  {hubs.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <Field label="Employment status" value={form.employmentStatus} onChange={(v) => setForm({ ...form, employmentStatus: v })} />
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Job title" value={form.jobTitle} onChange={(v) => setForm({ ...form, jobTitle: v })} />
                <Field label="Organisation" value={form.organisation} onChange={(v) => setForm({ ...form, organisation: v })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Sector / industry" value={form.sector} onChange={(v) => setForm({ ...form, sector: v })} />
                <Field label="Career level" value={form.careerLevel} onChange={(v) => setForm({ ...form, careerLevel: v })} />
              </div>
              <Field label="LinkedIn URL" value={form.linkedinUrl} onChange={(v) => setForm({ ...form, linkedinUrl: v })} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div>
                <p className="text-sm font-medium text-ink mb-3">Development interests</p>
                <div className="flex flex-wrap gap-2">
                  {DEVELOPMENT_INTERESTS.map((v) => (
                    <Toggle key={v} label={v} checked={form.developmentInterests.includes(v)} onChange={() => toggle("developmentInterests", v)} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-ink mb-3">How would you like to participate?</p>
                <div className="flex flex-wrap gap-2">
                  {PARTICIPATION_INTERESTS.map((v) => (
                    <Toggle key={v} label={v} checked={form.participationInterests.includes(v)} onChange={() => toggle("participationInterests", v)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="flex items-start gap-3 text-sm text-charcoal/80">
                <input type="checkbox" className="mt-1" checked={form.consentPrivacy} onChange={(e) => setForm({ ...form, consentPrivacy: e.target.checked })} />
                I accept BSC&apos;s <a href="/privacy" target="_blank" className="text-thistle underline">Privacy Notice</a>. *
              </label>
              <label className="flex items-start gap-3 text-sm text-charcoal/80">
                <input type="checkbox" className="mt-1" checked={form.consentTerms} onChange={(e) => setForm({ ...form, consentTerms: e.target.checked })} />
                I accept BSC&apos;s <a href="/terms" target="_blank" className="text-thistle underline">Membership Terms</a>. *
              </label>
              <label className="flex items-start gap-3 text-sm text-charcoal/80">
                <input type="checkbox" className="mt-1" checked={form.consentEmail} onChange={(e) => setForm({ ...form, consentEmail: e.target.checked })} />
                I&apos;m happy to receive email updates from BSC (optional).
              </label>
              <label className="flex items-start gap-3 text-sm text-charcoal/80">
                <input type="checkbox" className="mt-1" checked={form.consentWhatsapp} onChange={(e) => setForm({ ...form, consentWhatsapp: e.target.checked })} />
                I&apos;d like to be invited to BSC&apos;s WhatsApp community (optional).
              </label>
              <label className="flex items-start gap-3 text-sm text-charcoal/80">
                <input type="checkbox" className="mt-1" checked={form.consentPhoto} onChange={(e) => setForm({ ...form, consentPhoto: e.target.checked })} />
                BSC may use my photo/video/testimonial in community and impact materials (optional, separate consent).
              </label>
              <p className="text-xs text-charcoal/50 pt-2">
                You can update or withdraw non-essential consent at any time from your member profile.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mt-10">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 text-sm text-charcoal/60 disabled:opacity-0"
            >
              <ArrowLeft size={16} /> Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(3, s + 1))}
                disabled={step === 0 && !canProceedStep0}
                className="inline-flex items-center gap-2 rounded-sm bg-ink text-parchment px-6 py-3 text-sm font-medium disabled:opacity-40"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !canSubmit}
                className="inline-flex items-center gap-2 rounded-sm bg-gold text-ink px-6 py-3 text-sm font-medium hover:bg-gold-light disabled:opacity-40"
              >
                {submitting ? "Sending…" : "Create my profile"} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label, value, onChange, type = "text", required = false,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm text-charcoal/70 mb-1.5">{label} {required && "*"}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm bg-white outline-none focus-visible:ring-1 focus-visible:ring-gold"
      />
    </div>
  );
}
