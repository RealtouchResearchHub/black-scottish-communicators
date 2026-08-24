import { PageHero } from "@/components/PageHero";

const metrics = [
  { label: "Members registered", value: "Growing" },
  { label: "Programmes running", value: "5 categories" },
  { label: "City hubs", value: "4" },
  { label: "Confidence tracked", value: "Baseline → completion" },
];

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Impact"
        title="Evidence, not anecdotes."
        intro="BSC tracks outcomes from day one — registrations, attendance, completion, and self-reported confidence change — so our impact is measurable, not assumed."
      />
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {metrics.map((m) => (
              <div key={m.label} className="border border-ink/10 rounded-sm p-6 bg-white/50 text-center">
                <p className="font-display text-3xl text-gold mb-1">{m.value}</p>
                <p className="text-sm text-charcoal/70">{m.label}</p>
              </div>
            ))}
          </div>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl text-ink mb-4">How we measure</h2>
            <p className="text-charcoal/75 leading-relaxed">
              At programme baseline and again at completion, members are
              invited to self-report on public speaking confidence, interview
              confidence, leadership readiness, ability to contribute in
              meetings, and professional network strength — each on a 1–10
              scale. As BSC&apos;s community grows, this dashboard will show real,
              aggregated results.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
