import { PageHero } from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";
import { CalendarDays, MapPin, Ticket } from "lucide-react";

function extractUrl(text: string | null): string | null {
  if (!text) return null;
  const match = text.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : null;
}

function descriptionWithoutUrl(text: string | null, url: string | null): string {
  if (!text) return "";
  if (!url) return text;
  return text.replace(url, "").replace(/Register free on Eventbrite:\s*$/i, "").trim();
}

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*, hubs(name)")
    .eq("status", "published")
    .eq("visibility", "public")
    .order("starts_at");

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Community, in person and online."
        intro="Workshops, storytelling nights and hub meetups - open to members and, where noted, the public."
      />
      <section className="py-20 bg-parchment">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          {events && events.length > 0 ? (
            <div className="space-y-5">
              {events.map((e) => {
                const registrationUrl = extractUrl(e.description);
                const bodyText = descriptionWithoutUrl(e.description, registrationUrl);
                return (
                  <div key={e.id} className="border border-ink/10 rounded-sm overflow-hidden bg-white/50 flex flex-col sm:flex-row">
                    {e.cover_image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={e.cover_image_url} alt="" className="w-full sm:w-40 h-32 sm:h-auto object-cover" />
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 p-6 flex-1">
                      <div className="shrink-0 text-center sm:w-20">
                        <p className="font-display text-3xl text-gold">{new Date(e.starts_at).getDate()}</p>
                        <p className="text-xs uppercase tracking-wide text-charcoal/60">
                          {new Date(e.starts_at).toLocaleString("en-GB", { month: "short" })}
                        </p>
                      </div>
                      <div className="flex-1">
                        <h2 className="font-display text-xl text-ink mb-1">{e.title}</h2>
                        <div className="flex flex-wrap gap-4 text-sm text-charcoal/60 mb-3">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays size={14} />
                            {new Date(e.starts_at).toLocaleString("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {(e.location || e.hubs?.name) && (
                            <span className="flex items-center gap-1.5">
                              <MapPin size={14} />
                              {e.location || e.hubs?.name}
                            </span>
                          )}
                        </div>
                        {bodyText && (
                          <p className="text-sm text-charcoal/70 leading-relaxed whitespace-pre-line mb-4">{bodyText}</p>
                        )}
                        <div className="flex flex-wrap gap-3">
                          {registrationUrl && (
                            <a
                              href={registrationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-sm bg-gold px-5 py-2.5 text-sm font-medium text-ink hover:bg-gold-light transition-colors"
                            >
                              <Ticket size={16} /> Register free
                            </a>
                          )}
                          {e.location && !e.is_online && (
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(e.location)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-sm border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink hover:border-gold transition-colors"
                            >
                              <MapPin size={16} /> Get directions
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-ink/15 rounded-sm">
              <p className="font-display text-2xl text-ink mb-2">No events published yet</p>
              <p className="text-charcoal/60">Check back soon, or join BSC to be first to hear about upcoming events.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
