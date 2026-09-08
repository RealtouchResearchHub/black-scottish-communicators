"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHero } from "@/components/PageHero";
import { ArrowRight, Check } from "lucide-react";

type Hub = { id: string; name: string };

function ClaimForm() {
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const firstName = params.get("first_name") ?? params.get("firstName") ?? "";
  const lastName = params.get("last_name") ?? params.get("lastName") ?? "";

  const [hubs, setHubs] = useState<Hub[]>([]);
  const [hubId, setHubId] = useState("");
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentEmail, setConsentEmail] = useState(false);
  const [consentWhatsapp, setConsentWhatsapp] = useState(false);
  const [consentPhoto, setConsentPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("hubs").select("id,name").eq("active", true).order("city").then(({ data }) => setHubs(data ?? []));
  }, []);

  const missingIdentity = !email || !firstName || !lastName;
  const canSubmit = !missingIdentity && hubId && consentPrivacy && consentTerms;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/claim-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, firstName, lastName, hubId,
          consentPrivacy, consentTerms, consentEmail, consentWhatsapp, consentPhoto,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      window.location.href = data.actionLink;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (missingIdentity) {
    return (
      <div className="mx-auto max-w-lg px-5 sm:px-8 text-center">
        <p className="text-charcoal/80 leading-relaxed">
          This link is missing some details. Please use the &ldquo;Get your
          member account&rdquo; link from your BSC welcome email, or{" "}
          <a href="/login" className="text-thistle underline">sign in here</a>{" "}
          if you already have an account.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 sm:px-8">
      <p className="text-charcoal/70 mb-8">
        Welcome back, <strong>{firstName}</strong>. You&apos;re activating your
        member account for <strong>{email}</strong>. Just pick your hub and
        confirm consent to finish.
      </p>

      {error && (
        <div className="mb-6 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-charcoal/70 mb-1.5">City / Hub *</label>
          <select
            value={hubId}
            onChange={(e) => setHubId(e.target.value)}
            className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm bg-white outline-none focus-visible:ring-1 focus-visible:ring-gold"
          >
            <option value="">Select a hub</option>
            {hubs.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 text-sm text-charcoal/80">
            <input type="checkbox" className="mt-1" checked={consentPrivacy} onChange={(e) => setConsentPrivacy(e.target.checked)} />
            I accept BSC&apos;s <a href="/privacy" target="_blank" className="text-thistle underline">Privacy Notice</a>. *
          </label>
          <label className="flex items-start gap-3 text-sm text-charcoal/80">
            <input type="checkbox" className="mt-1" checked={consentTerms} onChange={(e) => setConsentTerms(e.target.checked)} />
            I accept BSC&apos;s <a href="/terms" target="_blank" className="text-thistle underline">Membership Terms</a>. *
          </label>
          <label className="flex items-start gap-3 text-sm text-charcoal/80">
            <input type="checkbox" className="mt-1" checked={consentEmail} onChange={(e) => setConsentEmail(e.target.checked)} />
            I&apos;m happy to receive email updates from BSC (optional).
          </label>
          <label className="flex items-start gap-3 text-sm text-charcoal/80">
            <input type="checkbox" className="mt-1" checked={consentWhatsapp} onChange={(e) => setConsentWhatsapp(e.target.checked)} />
            I&apos;d like to be invited to BSC&apos;s WhatsApp community (optional).
          </label>
          <label className="flex items-start gap-3 text-sm text-charcoal/80">
            <input type="checkbox" className="mt-1" checked={consentPhoto} onChange={(e) => setConsentPhoto(e.target.checked)} />
            BSC may use my photo/video/testimonial in community and impact materials (optional).
          </label>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-sm bg-gold text-ink px-6 py-3.5 text-sm font-semibold hover:bg-gold-light disabled:opacity-40"
        >
          {submitting ? "Activating…" : "Activate my member account"} <ArrowRight size={16} />
        </button>
        <p className="text-xs text-charcoal/50 text-center flex items-center justify-center gap-1.5">
          <Check size={12} /> No extra email needed - you&apos;ll be signed in right away.
        </p>
      </form>
    </div>
  );
}

export default function ClaimAccountPage() {
  return (
    <>
      <PageHero eyebrow="Join BSC" title="Get your member account." />
      <section className="py-16 bg-parchment">
        <Suspense fallback={<div className="text-center text-charcoal/50">Loading…</div>}>
          <ClaimForm />
        </Suspense>
      </section>
    </>
  );
}
