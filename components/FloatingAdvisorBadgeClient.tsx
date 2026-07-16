"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type FloatingAdvisorBadgeClientProps = {
  displayName: string;
  profileHref: string;
  photoUrl?: string;
};

export default function FloatingAdvisorBadgeClient({
  displayName,
  profileHref,
  photoUrl,
}: FloatingAdvisorBadgeClientProps) {
  const [expanded, setExpanded] = useState(true);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setExpanded(false);
      setIntroFinished(true);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Link
      href={profileHref}
      onMouseEnter={() => {
        if (introFinished) setExpanded(true);
      }}
      onMouseLeave={() => {
        if (introFinished) setExpanded(false);
      }}
      aria-label={`Zobraziť profil poradcu ${displayName}`}
      className={[
        "group flex items-center overflow-hidden border border-slate-200/80",
        "bg-white/90 shadow-md backdrop-blur-md",
        "transition-all duration-500 ease-out",
        "hover:border-brand-teal/40 hover:shadow-lg",
        expanded
          ? "w-[270px] gap-4 rounded-2xl px-4 py-3"
          : "w-[190px] gap-3 rounded-full px-2.5 py-2",
      ].join(" ")}
    >
      <span
        className={[
          "relative shrink-0 overflow-hidden rounded-full bg-slate-100",
          "transition-all duration-500",
          expanded ? "h-14 w-14" : "h-9 w-9",
        ].join(" ")}
      >
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={displayName}
            fill
            sizes={expanded ? "56px" : "36px"}
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-brand-navy">
            {displayName.charAt(0)}
          </span>
        )}
      </span>

      <span className="min-w-0 text-left">
        <span
          className={[
            "block overflow-hidden font-medium uppercase tracking-[0.12em]",
            "text-slate-400 transition-all duration-500",
            expanded
              ? "mb-1 max-h-5 text-[10px] opacity-100"
              : "max-h-0 text-[9px] opacity-0",
          ].join(" ")}
        >
          Váš finančný poradca
        </span>

        <span
          className={[
            "block truncate font-semibold text-brand-navy",
            "transition-all duration-500",
            expanded ? "text-sm" : "text-xs",
          ].join(" ")}
        >
          {displayName}
        </span>

        <span
          className={[
            "block overflow-hidden text-xs text-brand-blue",
            "transition-all duration-500",
            expanded
              ? "mt-1 max-h-5 opacity-100"
              : "max-h-0 opacity-0",
          ].join(" ")}
        >
          Zobraziť profil →
        </span>
      </span>
    </Link>
  );
}