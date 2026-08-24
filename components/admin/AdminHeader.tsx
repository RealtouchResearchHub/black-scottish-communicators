export function AdminHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="p-6 sm:p-8 pb-0 max-w-6xl mx-auto flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl text-ink">{title}</h1>
        {description && <p className="text-sm text-charcoal/60 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
