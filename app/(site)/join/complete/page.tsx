"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHero } from "@/components/PageHero";

type Draft = {
  firstName: string; lastName: string; preferredName: string; email: string;
  mobile: string; hubId: string; employmentStatus: string; jobTitle: string;
  organisation: string; sector: string; careerLevel: string; linkedinUrl: string;
  developmentInterests: string[]; participationInterests: string[];
  consentPrivacy: boolean; consentTerms: boolean; consentEmail: boolean;
  consentWhatsapp: boolean; consentPhoto: boolean;
};

export default function JoinCompletePage() {
  const router = useRouter();
  const [status, setStatus] = useState<"working" | "error" | "done">("working");
  const [message, setMessage] = useState("Finishing your BSC profile…");

  useEffect(() => {
    async function run() {
      const supabase = createClient();
      const { data: userData, error: userErr } = await supabase.auth.getUser();

      if (userErr || !userData.user) {
        setStatus("error");
        setMessage("We couldn't confirm your sign-in. Please try the link from your email again, or start over from Join BSC.");
        return;
      }

      const raw = localStorage.getItem("bsc_join_draft");
      if (!raw) {
        router.replace("/member");
        return;
      }

      const draft: Draft = JSON.parse(raw);
      const user = userData.user;

      const { error: upsertErr } = await supabase.from("members").upsert({
        id: user.id,
        first_name: draft.firstName,
        last_name: draft.lastName,
        preferred_name: draft.preferredName || null,
        email: draft.email,
        mobile: draft.mobile || null,
        hub_id: draft.hubId || null,
        employment_status: draft.employmentStatus || null,
        job_title: draft.jobTitle || null,
        organisation: draft.organisation || null,
        sector: draft.sector || null,
        career_level: draft.careerLevel || null,
        linkedin_url: draft.linkedinUrl || null,
        skills: [],
        development_interests: draft.developmentInterests,
        participation_interests: draft.participationInterests,
        status: "active",
      });

      if (upsertErr) {
        setStatus("error");
        setMessage(`We hit a problem saving your profile: ${upsertErr.message}`);
        return;
      }

      const consentRows = [
        { member_id: user.id, consent_type: "privacy_notice", granted: draft.consentPrivacy },
        { member_id: user.id, consent_type: "membership_terms", granted: draft.consentTerms },
        { member_id: user.id, consent_type: "marketing_email", granted: draft.consentEmail },
        { member_id: user.id, consent_type: "marketing_whatsapp", granted: draft.consentWhatsapp },
        { member_id: user.id, consent_type: "photo_video_testimonial", granted: draft.consentPhoto },
      ];
      await supabase.from("consents").insert(consentRows);

      const { error: rpcErr } = await supabase.rpc("complete_member_signup");
      if (rpcErr) {
        setStatus("error");
        setMessage(`We saved your profile but couldn't finish membership setup: ${rpcErr.message}. Please contact BSC.`);
        return;
      }

      localStorage.removeItem("bsc_join_draft");
      setStatus("done");
      setMessage("Welcome to BSC — your profile is ready.");
      setTimeout(() => router.replace("/member"), 1500);
    }

    run();
  }, [router]);

  return (
    <>
      <PageHero eyebrow="Join BSC" title="Almost there." />
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-lg px-5 sm:px-8 text-center">
          <p className={`leading-relaxed ${status === "error" ? "text-red-700" : "text-charcoal/80"}`}>{message}</p>
          {status === "error" && (
            <a href="/join" className="inline-block mt-6 text-thistle font-medium hover:text-gold">Back to Join BSC &rarr;</a>
          )}
        </div>
      </section>
    </>
  );
}
