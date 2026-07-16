"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { ScrollBodyType } from "embla-carousel";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

type Testimonial = {
  _id: string;
  clientName: string;
  clientRole?: string;
  clientPhoto?: any;
  quote: string;
  advisor?: {
    name: string;
    titleBefore?: string;
    titleAfter?: string;
  };
};

interface TestimonialSliderProps {
  testimonials: Testimonial[];
  title?: string;
}

type EdgeZone = "left-fast" | "center" | "right-fast";

function getZone(normalizedX: number): EdgeZone {
  // Krajných 20 % ovláda rýchly pohyb, stredných 60 % carousel zastaví.
  if (normalizedX < -0.6) return "left-fast";
  if (normalizedX > 0.6) return "right-fast";
  return "center";
}

export default function TestimonialSlider({
  testimonials,
  title,
}: TestimonialSliderProps) {
  const [shuffled, setShuffled] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollCarousel, setCanScrollCarousel] = useState(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const currentZoneRef = useRef<EdgeZone | null>(null);
  const isDesktopPointerRef = useRef(false);
  const defaultScrollBodyRef = useRef<ScrollBodyType | null>(null);

  useEffect(() => {
    if (!testimonials?.length) {
      setShuffled([]);
      setActiveIndex(0);
      return;
    }

    const arrayToShuffle = [...testimonials];

    for (let index = arrayToShuffle.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [arrayToShuffle[index], arrayToShuffle[randomIndex]] = [
        arrayToShuffle[randomIndex],
        arrayToShuffle[index],
      ];
    }

    setShuffled(arrayToShuffle);
    setActiveIndex(0);
  }, [testimonials]);

  const items = shuffled.length > 0 ? shuffled : testimonials;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: canScrollCarousel,
    dragFree: canScrollCarousel,
    align: "center",
    containScroll: canScrollCarousel ? false : "trimSnaps",
    skipSnaps: canScrollCarousel,
  });

  const setCarouselViewport = useCallback(
    (node: HTMLDivElement | null) => {
      viewportRef.current = node;
      emblaRef(node);
    },
    [emblaRef],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const measureCarousel = () => {
      const track = viewport.firstElementChild as HTMLElement | null;

      if (!track || items.length <= 1) {
        setCanScrollCarousel(false);
        return;
      }

      // Malá tolerancia zabráni zapnutiu loopu pri rozdiele iba pár pixelov.
      const shouldScroll = track.scrollWidth > viewport.clientWidth + 8;
      setCanScrollCarousel(shouldScroll);
    };

    measureCarousel();

    const resizeObserver = new ResizeObserver(measureCarousel);
    resizeObserver.observe(viewport);

    const track = viewport.firstElementChild;
    if (track) resizeObserver.observe(track);

    return () => resizeObserver.disconnect();
  }, [items.length]);

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
    (direction: "forward" | "backward", speed = 0.45) => {
      if (!emblaApi || !canScrollCarousel) return;

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
    [canScrollCarousel, emblaApi],
  );

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");

    const updateDesktopBehaviour = () => {
      isDesktopPointerRef.current = media.matches;
      currentZoneRef.current = null;

      if (media.matches && canScrollCarousel) {
        startDesktopScroll("forward");
      } else {
        stopDesktopScroll();
      }
    };

    updateDesktopBehaviour();
    media.addEventListener("change", updateDesktopBehaviour);

    return () => {
      media.removeEventListener("change", updateDesktopBehaviour);
      stopDesktopScroll();
    };
  }, [canScrollCarousel, startDesktopScroll, stopDesktopScroll]);

  useEffect(() => {
    if (items.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        let nextIndex = currentIndex;

        while (nextIndex === currentIndex) {
          nextIndex = Math.floor(Math.random() * items.length);
        }

        return nextIndex;
      });
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, [items.length]);

  const applyZone = useCallback(
    (zone: EdgeZone) => {
      if (
        !emblaApi ||
        !canScrollCarousel ||
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
        1.8,
      );
    },
    [canScrollCarousel, emblaApi, startDesktopScroll, stopDesktopScroll],
  );

  if (!testimonials?.length) return null;

  const current = items[activeIndex] ?? items[0];

  const advisorDisplayName = current.advisor
    ? `${[current.advisor.titleBefore, current.advisor.name]
        .filter(Boolean)
        .join(" ")}${
        current.advisor.titleAfter ? `, ${current.advisor.titleAfter}` : ""
      }`
    : null;

  return (
    <div className="w-full select-none overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="p-8 md:p-12">
        <h2 className="mb-6 text-center font-serif text-lg tracking-tight text-gray-900">
          {title || "Čo o nás povedali naši klienti"}
        </h2>

        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="block h-8 font-serif text-6xl text-brand-teal/20">
            “
          </span>

          <div className="mt-4 flex min-h-[140px] items-center justify-center">
            <p
              key={current._id}
              className="animate-fade-in text-base italic leading-relaxed text-slate-700 md:text-lg"
            >
              {current.quote}
            </p>
          </div>

          <div className="mt-6 min-h-[92px]">
            <p className="text-sm font-bold text-slate-900">
              {current.clientName}
            </p>

            {current.clientRole && (
              <p className="mt-0.5 text-xs text-slate-400">
                {current.clientRole}
              </p>
            )}

            {advisorDisplayName && (
              <p className="mt-3 inline-flex rounded-full border border-brand-teal/20 bg-brand-teal/5 px-3 py-1 text-[11px] font-medium text-brand-navy">
                Poradca: {advisorDisplayName}
              </p>
            )}
          </div>

          <div
            ref={setCarouselViewport}
            className="relative mt-8 w-full touch-pan-y overflow-hidden"
            onMouseEnter={() => applyZone("center")}
            onMouseMove={(event) => {
              if (!canScrollCarousel) return;

              const rect = event.currentTarget.getBoundingClientRect();
              const normalizedX =
                ((event.clientX - rect.left) / rect.width) * 2 - 1;

              applyZone(getZone(normalizedX));
            }}
            onMouseLeave={() => {
              currentZoneRef.current = null;

              if (isDesktopPointerRef.current && canScrollCarousel) {
                startDesktopScroll("forward");
              }
            }}
          >
            <div
              className={`flex items-center gap-3 py-3 [backface-visibility:hidden] ${
                canScrollCarousel ? "" : "justify-center"
              }`}
            >
              {items.map((testimonial, index) => {
                const isSelected = index === activeIndex;

                return (
                  <div
                    key={testimonial._id}
                    className="flex h-16 w-16 flex-[0_0_64px] items-center justify-center"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 transition-[opacity,border-color,box-shadow] duration-300 ${
                        isSelected
                          ? "border-brand-teal opacity-100 ring-4 ring-brand-teal/10"
                          : "border-gray-200 opacity-40"
                      }`}
                      aria-label={`Zobraziť referenciu: ${testimonial.clientName}`}
                    >
                      <span
                        className={`absolute inset-0 transition-transform duration-300 ease-out ${
                          isSelected ? "scale-110" : "scale-95"
                        }`}
                      >
                        {testimonial.clientPhoto ? (
                          <Image
                            src={urlFor(testimonial.clientPhoto)
                              .width(112)
                              .height(112)
                              .url()}
                            alt={testimonial.clientName}
                            fill
                            sizes="56px"
                            draggable={false}
                            className="pointer-events-none object-cover"
                          />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-400">
                            {testimonial.clientName.charAt(0)}
                          </span>
                        )}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}