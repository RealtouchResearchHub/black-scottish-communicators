import { PageHero } from "@/components/PageHero";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mic, Handshake, MessageCircle, Radio, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const ICONS = [Mic, Handshake, MessageCircle, Radio, Target];

const fallbackProgrammes = [
  { title: "Public Speaking & Leadership Workshops", description: "Hands-on sessions building the confidence and technique to speak and lead with presence — in meetings, on stage, and in your career." },
  { title: "Mentorship Programme", description: "One-to-one relationships pairing members with mentors across sectors, matched to real goals and reviewed for progress along the way." },
  { title: "Community Storytelling Events", description: "Live spaces to share your story and hear others' — building community while sharpening your own voice." },
  { title: "Digital Media Training", description: "Practical training in building visibility and communicating confidently across digital and media platforms." },
  { title: "Behavioural Assessment, Debriefing & Coaching", description: "Structured coaching to understand your communication style and turn insight into practical growth." },
];

export default async function ProgrammesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("programmes")
    .select("*")
    .eq("status", "published")
    .order("created_at");

  const programmes = data && data.length > 0
    ? data.map((p) => ({ title: p.title, description: p.description || "", cover_image_url: p.cover_image_url }))
    : fallbackProgrammes;

  return (
    <>
      <PageHero
        eyebrow="Programmes"
        title="Five paths to a stronger voice."
        intro="Every BSC programme is built to move you from where you are to where you want to be — with people who show up for you along the way."
      />
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 space-y-6">
          {programmes.map((p, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div key={p.title} className="flex flex-col sm:flex-row gap-6 sm:gap-10 border-b border-ink/10 pb-8">
                <div className="shrink-0 w-14">
                  <div className="w-12 h-12 rounded-full border border-gold/60 bg-white/50 flex items-center justify-center">
                    <Icon size={20} className="text-gold" />
                  </div>
                </div>
                <div className="flex-1">
                  {"cover_image_url" in p && p.cover_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.cover_image_url} alt="" className="w-full max-w-md h-40 object-cover rounded-sm mb-4" />
                  )}
                  <h2 className="font-display text-2xl text-ink mb-2">{p.title}</h2>
                  <p className="text-charcoal/80 leading-relaxed max-w-2xl">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="bg-ink text-parchment py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-display text-2xl text-center sm:text-left">Ready to start a programme?</p>
          <Link href="/join" className="inline-flex items-center gap-2 rounded-sm bg-gold px-7 py-3.5 text-ink font-medium hover:bg-gold-light transition-colors">
            Join BSC <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
