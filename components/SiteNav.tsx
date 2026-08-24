"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/programmes", label: "Programmes" },
  { href: "/membership", label: "Membership" },
  { href: "/mentorship", label: "Mentorship" },
  { href: "/events", label: "Events" },
  { href: "/hubs", label: "City Hubs" },
  { href: "/impact", label: "Impact" },
  { href: "/partner", label: "Partner" },
];

export function SiteNav({ logoUrl }: { logoUrl?: string }) {
  const [open, setOpen] = useState(false);
  const src = logoUrl || "/brand/logo.png";

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-gold/20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
            <Image src={src} alt="BSC logo" width={40} height={40} className="rounded-md h-10 w-10 object-cover" />
            <span className="hidden sm:block font-display text-lg text-parchment leading-tight">
              Black Scottish
              <br />
              Communicators
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-parchment/80 hover:text-gold-light transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            <Link href="/login" className="text-sm text-parchment/80 hover:text-gold-light transition-colors">
              Member Login
            </Link>
            <Link
              href="/join"
              className="inline-flex items-center rounded-sm bg-gold px-5 py-2.5 text-sm font-medium text-ink hover:bg-gold-light transition-colors"
            >
              Join BSC
            </Link>
          </div>

          <button
            className="lg:hidden text-parchment"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gold/20 bg-ink px-5 py-6">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-parchment/90 text-base">
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-gold/20 my-2" />
            <Link href="/login" onClick={() => setOpen(false)} className="text-parchment/90">
              Member Login
            </Link>
            <Link
              href="/join"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-sm bg-gold px-5 py-3 text-sm font-medium text-ink"
            >
              Join BSC
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
