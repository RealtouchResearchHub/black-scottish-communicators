import { createClient } from "@/lib/supabase/server";

export const SITE_CONTENT_DEFAULTS: Record<string, string> = {
  hero_headline: "Find your voice. Lead the room.",
  hero_subtext:
    "BSC helps Black ethnic minority individuals across Scotland build communication confidence, leadership presence and civic voice — through programmes, mentorship and a community that shows up for you.",
  about_copy:
    "BSC exists to help Black ethnic minority individuals in Scotland develop communication confidence, public-speaking capability, leadership presence, digital voice, mentoring relationships, visibility, career progression and civic and professional influence.",
  contact_email: "hello@britishscottishcommunicators.org.uk",
  logo_url: "",
};

export async function getSiteContent(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_content").select("key, value");
    const map: Record<string, string> = { ...SITE_CONTENT_DEFAULTS };
    (data ?? []).forEach((row) => {
      if (row.value !== null && row.value !== undefined) {
        map[row.key] = row.value;
      }
    });
    return map;
  } catch {
    return SITE_CONTENT_DEFAULTS;
  }
}
