import Image from "next/image";

export function PageHero({
  eyebrow,
  title,
  intro,
  logoUrl,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  logoUrl?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-parchment">
      <div className="hidden sm:block absolute right-10 top-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none">
        <Image
          src={logoUrl || "/brand/logo.png"}
          alt=""
          width={128}
          height={128}
          className="w-full h-full object-contain rounded-2xl shadow-2xl border border-white/10"
        />
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
