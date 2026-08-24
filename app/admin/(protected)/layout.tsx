import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/staff-auth";
import { getSiteContent } from "@/lib/site-content";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isStaff } = await getStaffSession();
  const content = await getSiteContent();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <p className="font-display text-2xl text-parchment mb-3">Access restricted</p>
          <p className="text-parchment/60 text-sm mb-6">
            Your account is signed in but doesn&apos;t have staff access to the
            admin portal. Contact a BSC director if you believe this is a
            mistake.
          </p>
          <a href="/" className="text-gold-light text-sm hover:text-gold">
            &larr; Back to the public site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[265px_1fr] min-h-screen bg-parchment">
      <div className="hidden md:block sticky top-0 h-screen">
        <AdminSidebar logoUrl={content.logo_url} />
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
