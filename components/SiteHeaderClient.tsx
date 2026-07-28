"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/o-nas", label: "O nás" },
  { href: "/#sluzby", label: "Služby" },
  { href: "/blog", label: "Články" },
  {
    href: "https://www.finixreal.sk",
    label: "Reality",
    external: true,
  },
  { href: "/kontakt", label: "Kontakt" },
];

export default function SiteHeaderClient() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75">
      <div className="flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="inline-flex shrink-0"
        >
          <Image
            src="/logo_text.png"
            alt="FINIX"
            width={120}
            height={36}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <nav className="hidden gap-5 text-sm text-slate-600 md:flex">
          {links.map((link) => (
  <Link
    key={link.href}
    href={link.href}
    target={link.external ? "_blank" : undefined}
    rel={link.external ? "noopener noreferrer" : undefined}
    onClick={() => setOpen(false)}
    className="rounded-md px-3 py-2.5 text-sm text-slate-700 transition hover:text-brand-blue"
  >
    {link.label}
  </Link>
))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="-mr-2 rounded-md p-2 text-brand-navy transition hover:bg-slate-100 md:hidden"
          aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
          aria-expanded={open}
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200/70 bg-white/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-slate-700 transition-colors hover:text-brand-blue"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}