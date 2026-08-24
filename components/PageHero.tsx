import { ThistleMark } from "./ThistleMark";

export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-parchment">
      <div className="absolute -right-16 -top-10 opacity-[0.08] pointer-events-none">
        <ThistleMark className="w-72 h-96" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-24">
        <span className="text-xs tracking-[0.2em] uppercase text-gold-light">
          {eyebrow}
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-3 max-w-2xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-6 text-lg text-parchment/70 max-w-2xl leading-relaxed">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
