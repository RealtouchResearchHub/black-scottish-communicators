"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHero } from "@/components/PageHero";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/member`,
          shouldCreateUser: false,
        },
      });
      if (otpError) throw otpError;
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong sending your sign-in link.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <PageHero eyebrow="Member Login" title="Welcome back." />
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-md px-5 sm:px-8">
          {sent ? (
            <p className="text-charcoal/80 text-center leading-relaxed">
              We&apos;ve sent a secure sign-in link to <strong>{email}</strong>.
              Open it on this device to sign in — no password needed.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}
              <div>
                <label className="block text-sm text-charcoal/70 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm bg-white outline-none focus-visible:ring-1 focus-visible:ring-gold"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full inline-flex items-center justify-center gap-2 rounded-sm bg-ink text-parchment px-6 py-3 text-sm font-medium hover:bg-charcoal disabled:opacity-50"
              >
                {sending ? "Sending…" : "Send sign-in link"} <ArrowRight size={16} />
              </button>
              <p className="text-center text-sm text-charcoal/60">
                Not a member yet? <Link href="/join" className="text-thistle font-medium hover:text-gold">Join BSC</Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
