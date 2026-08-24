import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { BscAssistant } from "@/components/assistant/BscAssistant";
import { getSiteContent } from "@/lib/site-content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();

  return (
    <>
      <SiteNav logoUrl={content.logo_url} />
      <main className="flex-1">{children}</main>
      <SiteFooter logoUrl={content.logo_url} contactEmail={content.contact_email} />
      <BscAssistant />
    </>
  );
}
