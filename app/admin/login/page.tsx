"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
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
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
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
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-[#15130f] border border-white/10 rounded-2xl p-10 text-center">
        <div className="inline-block bg-black/40 border border-white/10 rounded px-3 py-1.5 text-[11px] text-white/40 font-mono mb-6">
          yoursite.org/admin
        </div>
        <Image src="/brand/logo.png" alt="BSC" width={56} height={56} className="mx-auto rounded-lg mb-4 object-cover" />
        <h1 className="font-display text-xl text-white mb-1.5">Staff sign-in</h1>
        <p className="text-white/50 text-[13px] mb-7 leading-relaxed">
          This area is separate from the public site and restricted to BSC
          staff, directors and city ambassadors.
        </p>

        {sent ? (
          <p className="text-white/70 text-sm leading-relaxed">
            We&apos;ve sent a secure sign-in link to <strong className="text-white">{email}</strong>. Open it on this device to continue to the admin portal.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-left">
            {error && (
              <div className="rounded-md border border-red-400/30 bg-red-900/20 px-3 py-2 text-xs text-red-300">{error}</div>
            )}
            <input
              type="email"
              required
              placeholder="you@blackscottishcommunicators.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-white/15 bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus-visible:ring-1 focus-visible:ring-gold"
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gold text-ink px-4 py-2.5 text-sm font-semibold hover:bg-gold-light disabled:opacity-50"
            >
              {sending ? "Sending…" : "Sign in to admin"} <ArrowRight size={15} />
            </button>
          </form>
        )}

        <a href="/" className="block mt-6 text-xs text-white/40 hover:text-white/70">
          &larr; Back to public website
        </a>
      </div>
    </div>
  );
}
