import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Twitter, Music2 } from "lucide-react";

const columns = [
  {
    title: "Community",
    links: [
      { href: "/about", label: "About BSC" },
      { href: "/team", label: "Our team" },
      { href: "/programmes", label: "Programmes" },
      { href: "/mentorship", label: "Mentorship" },
      { href: "/hubs", label: "City Hubs" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { href: "/join", label: "Join BSC" },
      { href: "/events", label: "Events" },
      { href: "/partner", label: "Partner With BSC" },
      { href: "/sponsor", label: "Sponsor BSC" },
    ],
  },
  {
    title: "Organisation",
    links: [
      { href: "/impact", label: "Impact" },
      { href: "/resources", label: "Resources & News" },
      { href: "/contact", label: "Contact" },
      { href: "/login", label: "Member Login" },
    ],
  },
];

export function SiteFooter({
  logoUrl,
  contactEmail,
  social,
}: {
  logoUrl?: string;
  contactEmail?: string;
  social?: {
    facebook_url?: string;
    instagram_url?: string;
    x_url?: string;
    tiktok_url?: string;
    youtube_url?: string;
  };
}) {
  const src = logoUrl || "/brand/logo.png";
  const socialLinks = [
    { url: social?.facebook_url, icon: Facebook, label: "Facebook" },
    { url: social?.instagram_url, icon: Instagram, label: "Instagram" },
    { url: social?.x_url, icon: Twitter, label: "X" },
    { url: social?.tiktok_url, icon: Music2, label: "TikTok" },
    { url: social?.youtube_url, icon: Youtube, label: "YouTube" },
  ].filter((s) => s.url);

  return (
    <footer className="bg-ink text-parchment/70 border-t border-gold/20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src={src} alt="BSC logo" width={34} height={34} className="rounded-md h-8 w-8 object-cover" />
              <span className="font-display text-lg text-parchment">Black Scottish Communicators</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs mb-5">
              Building communication confidence, leadership presence and civic
              voice for Black Scottish communities — Belonging, Leadership,
              Advancement, Collaboration, Knowledge.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-parchment/20 hover:border-gold-light hover:text-gold-light transition-colors"
                  >
                    <s.icon size={15} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-parchment text-sm font-semibold tracking-wide uppercase mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm hover:text-gold-light transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-gold/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-parchment/50">
            <span>&copy; {new Date().getFullYear()} Black Scottish Communicators CIC. All rights reserved.</span>
            {contactEmail && <span className="ml-3">{contactEmail}</span>}
          </div>
          <div className="flex items-center gap-6 text-xs text-parchment/50">
            <Link href="/privacy" className="hover:text-gold-light">Privacy Notice</Link>
            <Link href="/terms" className="hover:text-gold-light">Membership Terms</Link>
            <Link
              href="/admin/login"
              className="rounded-sm border border-parchment/15 px-3 py-1.5 hover:border-gold-light hover:text-gold-light transition-colors"
            >
              Staff &amp; admin access &rarr;
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
