export default function AdminRoadmapPage() {
  const phases = [
    {
      title: "Phase 1 - Foundation (this build)",
      color: "border-gold",
      items: [
        "Public website + Founding 100 funnel",
        "Registration, consent, authentication",
        "Member CRM + profiles",
        "Membership tiers, hubs, events, programmes",
        "Team page + gated /admin portal",
        "Website content editor + image uploads",
      ],
    },
    {
      title: "Phase 2 - Experience",
      color: "border-thistle",
      items: [
        "Mentor matching, opportunities board",
        "Partner CRM + funding pipeline",
        "Certificates + digital member card",
        "Advanced impact dashboards",
      ],
    },
    {
      title: "Phase 3 - Intelligence & Scale",
      color: "border-saltire",
      items: [
        "AI opportunity & mentor matching",
        "Employer / sponsor dashboards",
        "PWA / mobile experience",
      ],
    },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-ink">Three-phase build roadmap</h1>
        <p className="text-sm text-charcoal/60 mt-1">Foundation first, then member experience, then intelligence and scale.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-5">
        {phases.map((p) => (
          <div key={p.title} className={`rounded-xl border-t-4 ${p.color} border-x border-b border-ink/10 bg-white p-5`}>
            <h3 className="font-display text-lg text-ink mb-3">{p.title}</h3>
            <ul className="space-y-2 text-sm text-charcoal/70 list-disc pl-4">
              {p.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
