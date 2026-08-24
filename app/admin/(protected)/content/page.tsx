import { getSiteContent } from "@/lib/site-content";
import { ContentEditor } from "@/components/admin/ContentEditor";

export default async function AdminContentPage() {
  const content = await getSiteContent();
  return <ContentEditor initial={content} />;
}
