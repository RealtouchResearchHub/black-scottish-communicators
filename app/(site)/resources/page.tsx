import { PageHero } from "@/components/PageHero";

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources & News"
        title="Learning and updates from BSC."
        intro="Guides, news and community resources will appear here as BSC's learning centre develops."
      />
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center py-16 border border-dashed border-ink/15 rounded-sm">
          <p className="font-display text-2xl text-ink mb-2">Resources are on the way</p>
          <p className="text-charcoal/60">
            Members will get access to public speaking, leadership and media
            training resources as BSC&apos;s learning centre launches.
          </p>
        </div>
      </section>
    </>
  );
}
