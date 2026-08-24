import { PageHero } from "@/components/PageHero";
import Link from "next/link";

export default function MentorshipPage() {
  return (
    <>
      <PageHero
        eyebrow="Mentorship"
        title="Guided by people who've walked the path."
        intro="BSC's mentorship programme pairs members with mentors matched to real goals — sector, experience, and what you're actually trying to build."
      />
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 space-y-8">
          <div>
            <h2 className="font-display text-2xl text-ink mb-2">As a mentee</h2>
            <p className="text-charcoal/75 leading-relaxed">
              Set your goals, get matched with a mentor whose background fits
              what you&apos;re working towards, and track progress together.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-2">As a mentor</h2>
            <p className="text-charcoal/75 leading-relaxed">
              Share your experience and help another member move forward.
              Register your interest to mentor when you join, or update it
              anytime from your member profile.
            </p>
          </div>
          <Link href="/join" className="inline-block text-thistle font-medium hover:text-gold">
            Join and register your mentorship interest &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
