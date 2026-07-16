"use client";

import { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { ScrollBodyType } from "embla-carousel";
import { urlFor } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

type TeamMember = {
  _id: string;
  name: string;
  titleBefore?: string;
  titleAfter?: string;
  slug: { current: string };
  photo?: any;
  specialization?: string[] | string;
  specializationOther?: string;
  serviceArea?: string;
};

type EdgeZone = "left-fast" | "center" | "right-fast";

function getZone(normalizedX: number): EdgeZone {
  if (normalizedX < -0.6) return "left-fast";
  if (normalizedX > 0.6) return "right-fast";
  return "center";
}

function getSpecializations(member: TeamMember): string[] {
  const values = Array.isArray(member.specialization)
    ? member.specialization
    : typeof member.specialization === "string"
      ? member.specialization
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  return values.flatMap((item) => {
    if (item === "Iné") {
      const customValue = member.specializationOther?.trim();
      return customValue ? [customValue] : [];
    }

    return item ? [item] : [];
  });
}

function MemberCard({ member }: { member: TeamMember }) {
  const displayName = `${[member.titleBefore, member.name]
    .filter(Boolean)
    .join(" ")}${member.titleAfter ? `, ${member.titleAfter}` : ""}`;

  const specializations = getSpecializations(member);

  return (
    <Link
      href={`/tim/${member.slug.current}`}
      draggable={false}
      className="group flex w-[168px] flex-none flex-col items-center text-center sm:w-[190px]"
    >
      <div className="relative h-[150px] w-[150px] overflow-hidden rounded-full bg-slate-100 shadow-sm ring-1 ring-slate-200 transition duration-300 group-hover:scale-[1.03] group-hover:shadow-md group-hover:ring-brand-blue sm:h-[170px] sm:w-[170px]">
        {member.photo ? (
          <Image
            src={urlFor(member.photo).width(400).height(400).url()}
            alt={displayName}
            fill
            sizes="(max-width: 640px) 150px, 170px"
            draggable={false}
            className="pointer-events-none object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-semibold text-slate-300">
            {member.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="mt-4 min-h-[94px] px-1">
  <h3 className="text-sm font-bold text-slate-900">
    {displayName}
  </h3>

  {specializations.length > 0 && (
    <p className="mt-1 text-xs leading-5 text-slate-500">
      {specializations.join(", ")}
    </p>
  )}

  {member.serviceArea && (
    <div className="mt-1.5 flex items-center justify-center gap-1 text-[11px] leading-4 text-slate-400">
      <MapPin
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0 text-brand-teal"
      />

      <span className="line-clamp-1">
        {member.serviceArea}
      </span>
    </div>
  )}
</div>
    </Link>
  );
}

export default function TeamCarousel({ members }: { members: TeamMember[] }) {
  const currentZoneRef = useRef<EdgeZone | null>(null);
  const isDesktopPointerRef = useRef(false);
  const defaultScrollBodyRef = useRef<ScrollBodyType | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: members.length > 1,
    dragFree: true,
    align: "start",
    containScroll: false,
    skipSnaps: true,
  });

  const stopDesktopScroll = useCallback(() => {
    if (!emblaApi) return;

    const engine = emblaApi.internalEngine();
    engine.animation.stop();

    if (defaultScrollBodyRef.current) {
      engine.scrollBody = defaultScrollBodyRef.current;
      defaultScrollBodyRef.current = null;
    }
  }, [emblaApi]);

  const startDesktopScroll = useCallback(
    (direction: "forward" | "backward", speed = 0.55) => {
      if (!emblaApi) return;

      const engine = emblaApi.internalEngine();
      engine.animation.stop();

      if (!defaultScrollBodyRef.current) {
        defaultScrollBodyRef.current = engine.scrollBody;
      }

      const directionSign = direction === "forward" ? -1 : 1;
      const velocity = directionSign * speed;

      let rawLocation = engine.location.get();
      let rawLocationPrevious = rawLocation;
      let scrollDirection = 0;

      const noop = (): ScrollBodyType => body;

      const body: ScrollBodyType = {
        direction: () => scrollDirection,
        duration: () => -1,
        velocity: () => velocity,
        settled: () => false,
        seek: () => {
          engine.previousLocation.set(engine.location);
          rawLocation += velocity;
          engine.location.add(velocity);
          engine.target.set(engine.location);

          scrollDirection = Math.sign(rawLocation - rawLocationPrevious);
          rawLocationPrevious = rawLocation;

          const currentIndex = engine.scrollTarget.byDistance(0, false).index;

          if (engine.index.get() !== currentIndex) {
            engine.indexPrevious.set(engine.index.get());
            engine.index.set(currentIndex);
            emblaApi.emit("select");
          }

          return body;
        },
        useBaseFriction: noop,
        useBaseDuration: noop,
        useFriction: noop,
        useDuration: noop,
      };

      engine.scrollBody = body;
      engine.animation.start();
    },
    [emblaApi],
  );

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");

    const update = () => {
      isDesktopPointerRef.current = media.matches;
      currentZoneRef.current = null;

      if (media.matches) {
        startDesktopScroll("forward");
      } else {
        stopDesktopScroll();
      }
    };

    update();
    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
      stopDesktopScroll();
    };
  }, [startDesktopScroll, stopDesktopScroll]);

  const applyZone = useCallback(
    (zone: EdgeZone) => {
      if (
        !emblaApi ||
        !isDesktopPointerRef.current ||
        currentZoneRef.current === zone
      ) {
        return;
      }

      currentZoneRef.current = zone;

      if (zone === "center") {
        stopDesktopScroll();
        return;
      }

      startDesktopScroll(
        zone === "left-fast" ? "backward" : "forward",
        4,
      );
    },
    [emblaApi, startDesktopScroll, stopDesktopScroll],
  );

  if (!members.length) return null;

  return (
    <div
      ref={emblaRef}
      className="select-none overflow-hidden touch-pan-y"
      onMouseEnter={() => applyZone("center")}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const normalizedX =
          ((event.clientX - rect.left) / rect.width) * 2 - 1;

        applyZone(getZone(normalizedX));
      }}
      onMouseLeave={() => {
        currentZoneRef.current = null;

        if (isDesktopPointerRef.current) {
          startDesktopScroll("forward");
        }
      }}
    >
      <div className="flex gap-6 px-2 py-4 [backface-visibility:hidden]">
        {members.map((member) => (
          <div key={member._id} className="min-w-0 flex-[0_0_auto]">
            <MemberCard member={member} />
          </div>
        ))}
      </div>
    </div>
  );
}