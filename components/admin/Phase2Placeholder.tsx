export function Phase2Placeholder({
  title,
  description,
  cards,
}: {
  title: string;
  description: string;
  cards: { label: string; value: string; note?: string }[];
}) {
  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="font-display text-2xl text-ink">{title}</h1>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-thistle/10 text-thistle">Phase 2</span>
        </div>
        <p className="text-sm text-charcoal/60">{description}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-ink/10 bg-white p-5">
            <p className="font-display text-2xl text-ink">{c.value}</p>
            <p className="text-sm text-charcoal/60 mt-1">{c.label}</p>
            {c.note && <p className="text-xs text-charcoal/40 mt-2">{c.note}</p>}
          </div>
        ))}
      </div>
      <p className="text-xs text-charcoal/40 mt-8">
        This module is a visual preview. Its live backend — with its own
        database tables and workflows — is planned for Phase 2 of the build.
      </p>
    </div>
  );
}
