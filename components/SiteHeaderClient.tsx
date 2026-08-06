"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  RotateCcw,
  X,
} from "lucide-react";
import {
  useIntroExperience,
} from "@/components/home/IntroExperienceContext";

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

const REPLAY_BUTTON_VISIBLE_MS = 3000;

export default function SiteHeaderClient() {
  const [open, setOpen] = useState(false);
  const [showReplayButton, setShowReplayButton] =
    useState(false);

  const hideTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  const {
    canReplayIntro,
    replayIntro,
    dismissReplayPrompt,
  } = useIntroExperience();

  useEffect(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (!canReplayIntro) {
      setShowReplayButton(false);
      return;
    }

    setShowReplayButton(true);

    hideTimerRef.current = setTimeout(() => {
      setShowReplayButton(false);
      dismissReplayPrompt();
      hideTimerRef.current = null;
    }, REPLAY_BUTTON_VISIBLE_MS);

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [
    canReplayIntro,
    dismissReplayPrompt,
  ]);

  const handleReplayIntro = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    setShowReplayButton(false);
    setOpen(false);
    replayIntro();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75">
      <div className="flex items-center px-6 py-4">
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

        <div className="ml-auto hidden items-center md:flex">
          <div className="mr-5 flex min-w-[155px] justify-end">
            <div
              className={[
                "transition-all duration-300",
                showReplayButton
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={handleReplayIntro}
                tabIndex={
                  showReplayButton ? 0 : -1
                }
                className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-slate-400 transition-colors hover:text-brand-blue"
              >
                <RotateCcw
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />
                Prehrať intro znova
              </button>
            </div>
          </div>

          <nav className="flex items-center gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={
                  link.external
                    ? "_blank"
                    : undefined
                }
                rel={
                  link.external
                    ? "noopener noreferrer"
                    : undefined
                }
                className="text-sm text-slate-700 transition-colors hover:text-brand-blue"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <div
            className={[
              "transition-all duration-300",
              showReplayButton
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={handleReplayIntro}
              tabIndex={
                showReplayButton ? 0 : -1
              }
              className="rounded-md p-2 text-slate-400 transition-colors hover:text-brand-blue"
              aria-label="Prehrať intro znova"
              title="Prehrať intro znova"
            >
              <RotateCcw
                aria-hidden="true"
                className="h-5 w-5"
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              setOpen((current) => !current)
            }
            className="-mr-2 rounded-md p-2 text-brand-navy transition hover:bg-slate-100"
            aria-label={
              open
                ? "Zavrieť menu"
                : "Otvoriť menu"
            }
            aria-expanded={open}
          >
            {open ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-slate-200/70 bg-white/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={
                  link.external
                    ? "_blank"
                    : undefined
                }
                rel={
                  link.external
                    ? "noopener noreferrer"
                    : undefined
                }
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
