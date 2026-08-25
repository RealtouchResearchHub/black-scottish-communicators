"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const groups = [
  {
    title: "Community",
    items: [
      { href: "/admin", label: "Overview" },
      { href: "/admin/members", label: "Members & CRM" },
      { href: "/admin/team", label: "Team & leadership" },
      { href: "/admin/hubs", label: "City hubs" },
      { href: "/admin/events", label: "Events" },
      { href: "/admin/programmes", label: "Programmes" },
      { href: "/admin/mentoring", label: "Mentorship" },
      { href: "/admin/opportunities", label: "Opportunities" },
    ],
  },
  {
    title: "Revenue & Partnerships",
    items: [
      { href: "/admin/membership", label: "Membership & payments" },
      { href: "/admin/partners", label: "Partner CRM" },
      { href: "/admin/funding", label: "Funding pipeline" },
    ],
  },
  {
    title: "Impact & Operations",
    items: [
      { href: "/admin/communications", label: "Communications" },
      { href: "/admin/governance", label: "Governance" },
    ],
  },
  {
    title: "Site content",
    items: [
      { href: "/admin/content", label: "Website content editor" },
      { href: "/admin/roadmap", label: "Build roadmap" },
    ],
  },
];

export function AdminSidebar({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
  }

  return (
    <aside className="bg-ink text-white p-5 h-full overflow-y-auto">
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/10 px-1">
        <Image
          src={logoUrl || "/brand/logo.png"}
          alt="BSC"
          width={40}
          height={40}
          className="rounded-md h-10 w-10 object-cover"
        />
        <div>
          <h1 className="text-sm font-display leading-tight">
            Black Scottish
            <br />
            Communicators
          </h1>
          <p className="text-[11px] text-gold-light/70">Admin - /admin</p>
        </div>
      </div>
      <nav>
        {groups.map((group) => (
          <div key={group.title} className="mb-2">
            <h4 className="text-[11px] uppercase tracking-wide text-white/40 px-2 mt-4 mb-1.5">{group.title}</h4>
            {group.items.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-[13.5px] mb-0.5 transition-colors ${
                    active ? "bg-white/10 text-white border-l-2 border-gold pl-2.5" : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-6 block w-full text-center rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-[12.5px] text-gold-light hover:bg-white/10 transition-colors"
      >
        &larr; Log out to public site
      </button>
    </aside>
  );
}
