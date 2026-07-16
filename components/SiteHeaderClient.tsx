"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/o-nas", label: "O nás" },
  { href: "/#sluzby", label: "Služby" },
  { href: "/blog", label: "Články" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function SiteHeaderClient() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" onClick={() => setOpen(false)}>
          <Image
            src="/logo_text.png"
            alt="FINIX"
            width={120}
            height={36}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-brand-blue"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen((current) => !current)}
          className="-mr-2 p-2 text-brand-navy md:hidden"
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
        <nav className="flex flex-col gap-4 border-t border-slate-200 bg-white px-6 py-4 text-sm text-slate-700 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="transition hover:text-brand-blue"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}