import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { client, queries } from "@/lib/sanity";

type SiteSettings = {
  contactAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
};

const serviceLinks = [
  { href: "/sluzby/hypoteky", label: "Hypotéky" },
  { href: "/sluzby/refinancovanie", label: "Refinancovanie" },
  { href: "/sluzby/investovanie", label: "Investovanie" },
  { href: "/sluzby/zivotne-poistenie", label: "Životné poistenie" },
  { href: "/sluzby/najlacnejsie-pzp", label: "Najlacnejšie PZP" },
  { href: "/sluzby/dochodok", label: "Dôchodok" },
];

const companyLinks = [
  { href: "/o-nas", label: "O nás" },
  { href: "/#tim", label: "Naši odborníci" },
  { href: "/blog", label: "Články" },
  { href: "/kontakt", label: "Kontakt" },
];

function getPhoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export default async function SiteFooter() {
  const settings: SiteSettings | null = await client.fetch(
    queries.siteSettings,
  );

  const currentYear = new Date().getFullYear();

  const hasContact =
    settings?.contactPhone ||
    settings?.contactEmail ||
    settings?.contactAddress;

  const hasSocialLinks =
    settings?.facebookUrl ||
    settings?.instagramUrl ||
    settings?.linkedinUrl;

  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* FINIX */}
          <div>
            <Link href="/" className="inline-flex">
              <Image
                src="/logo_text.png"
                alt="FINIX"
                width={140}
                height={42}
                className="h-8 w-auto"
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Pomáhame klientom robiť lepšie finančné rozhodnutia. Hypotéky,
              poistenie, investície a dôchodok riešime zrozumiteľne a s dôrazom
              na dlhodobý výsledok.
            </p>

            <Link
              href="/kontakt"
              className="mt-5 inline-flex rounded-md bg-brand-teal px-4 py-2.5 text-sm font-semibold text-brand-navy transition hover:bg-brand-teal/90"
            >
              Kontaktujte nás
            </Link>
          </div>

          {/* Služby */}
          <div>
            <h2 className="text-sm font-semibold text-white">
              Služby
            </h2>

            <nav className="mt-4 flex flex-col gap-2">
              {serviceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-300 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Spoločnosť */}
          <div>
            <h2 className="text-sm font-semibold text-white">
              Spoločnosť
            </h2>

            <nav className="mt-4 flex flex-col gap-2">
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-300 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Kontakt */}
          <div>
            <h2 className="text-sm font-semibold text-white">
              Kontakt
            </h2>

            {hasContact ? (
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                {settings?.contactPhone && (
                  <a
                    href={getPhoneHref(settings.contactPhone)}
                    className="flex items-start gap-3 transition hover:text-white"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />

                    <span>
                      {settings.contactPhone}
                    </span>
                  </a>
                )}

                {settings?.contactEmail && (
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="flex items-start gap-3 transition hover:text-white"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />

                    <span className="break-all">
                      {settings.contactEmail}
                    </span>
                  </a>
                )}

                {settings?.contactAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />

                    <span className="whitespace-pre-line leading-5">
                      {settings.contactAddress}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">
                Kontaktné údaje pripravujeme.
              </p>
            )}

            {hasSocialLinks && (
              <div className="mt-5 flex items-center gap-3">
                {settings?.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-300 transition hover:border-brand-teal hover:text-brand-teal"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}

                {settings?.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-300 transition hover:border-brand-teal hover:text-brand-teal"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}

                {settings?.linkedinUrl && (
                  <a
                    href={settings.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-300 transition hover:border-brand-teal hover:text-brand-teal"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Spodná časť */}
        <div className="mt-8 border-t border-white/10 pt-5">
          <div className="flex flex-col gap-4 text-xs leading-5 text-slate-400 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p>
                FINIX poskytuje služby finančného sprostredkovania
                prostredníctvom samostatného finančného agenta Finportal, a.s.
              </p>

              <p className="mt-1">
                Informácie na tejto stránke majú všeobecný charakter a
                nenahrádzajú individuálne finančné odporúčanie.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:items-end">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <Link
                  href="/ochrana-osobnych-udajov"
                  className="transition hover:text-white"
                >
                  Ochrana osobných údajov
                </Link>

                <Link
                  href="/pravne/cookies"
                  className="transition hover:text-white"
                >
                  Cookies
                </Link>
              </div>

              <p>
                © {currentYear} FINIX. Všetky práva vyhradené.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}