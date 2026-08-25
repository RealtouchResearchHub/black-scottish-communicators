import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getSiteContent } from "@/lib/site-content";

const values = [
  { letter: "B", word: "Belonging", copy: "A community where Black Scottish voices are seen, heard and rooted." },
  { letter: "L", word: "Leadership", copy: "Building the presence and confidence to lead in any room." },
  { letter: "A", word: "Advancement", copy: "Real progression - career, civic, and platform." },
  { letter: "C", word: "Collaboration", copy: "Growing together across Scotland's hubs and beyond." },
  { letter: "K", word: "Knowledge", copy: "Skills, mentorship and craft that compound over time." },
];

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-parchment">
        <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 w-[340px] h-[340px] opacity-60 pointer-events-none">
          <Image src={content.logo_url || "/brand/logo.png"} alt="" width={340} height={340} className="w-full h-full object-contain" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-8">
              <Image
                src={content.logo_url || "/brand/logo.png"}
                alt=""
                width={20}
                height={20}
                className="rounded-sm h-5 w-5 object-cover"
              />
              <span className="text-xs tracking-[0.2em] uppercase text-gold-light">Black Scottish Communicators</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-parchment">
              {content.hero_headline}
            </h1>
            <p className="mt-8 text-lg text-parchment/75 max-w-xl leading-relaxed">
              {content.hero_subtext}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/join" className="inline-flex items-center gap-2 rounded-sm bg-gold px-7 py-3.5 text-ink font-medium hover:bg-gold-light transition-colors">
                Join BSC <ArrowRight size={18} />
              </Link>
              <Link href="/about" className="inline-flex items-center gap-2 rounded-sm border border-parchment/25 px-7 py-3.5 text-parchment hover:border-gold-light hover:text-gold-light transition-colors">
                Learn our story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-parchment py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="divider-thistle mb-4 max-w-xs">
            <span className="text-xs tracking-[0.2em] uppercase text-thistle whitespace-nowrap">Our Values</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-14 max-w-2xl">
            BLACK - five commitments behind everything we build.
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {values.map((v) => (
              <div key={v.letter} className="border border-ink/10 rounded-sm p-6 bg-white/40">
                <span className="font-display text-4xl text-gold">{v.letter}</span>
                <h3 className="font-display text-xl mt-3 mb-2 text-ink">{v.word}</h3>
                <p className="text-sm text-charcoal/80 leading-relaxed">{v.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
          <div>
            <span className="text-xs tracking-[0.2em] uppercase text-gold-light">Community</span>
            <h2 className="font-display text-3xl sm:text-4xl text-parchment mt-3 mb-5">
              Real conversations. A room that gets it.
            </h2>
            <p className="text-parchment/70 leading-relaxed max-w-md">
              BSC brings together Black professionals, creatives, communicators
              and emerging leaders from across Scotland - city ambassadors,
              mentors and members, in the same room, building something
              together.
            </p>
          </div>
          <div className="relative rounded-lg overflow-hidden aspect-[3/2]">
            <Image
              src="/images/community-gathering.jpg"
              alt="BSC members and ambassadors in conversation"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-thistle text-parchment py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="font-display text-3xl sm:text-4xl mb-3">Become one of BSC&apos;s Founding 100.</h2>
            <p className="text-parchment/75">
              Founding members get free lifetime membership and a permanent
              badge recognising them as part of BSC&apos;s first community.
            </p>
          </div>
          <Link href="/join" className="inline-flex items-center gap-2 rounded-sm bg-gold px-8 py-4 text-ink font-medium hover:bg-gold-light transition-colors shrink-0">
            Join BSC <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
