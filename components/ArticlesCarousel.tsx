"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";

function ArticleCard({ post }: { post: any }) {
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group flex w-[320px] flex-none select-none rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-blue hover:shadow-md"
    >
      <div className="flex w-full gap-4">
        {post.coverImage ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <Image
              src={urlFor(post.coverImage)
                .width(240)
                .height(240)
                .fit("crop")
                .auto("format")
                .url()}
              alt={post.title}
              fill
              sizes="80px"
              draggable={false}
              className="pointer-events-none object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-brand-teal/10 text-xs font-semibold text-brand-navy">
            FINIX
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.12em] text-brand-teal">
            {post.category?.title || "Blog"}
          </span>

          <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900 transition duration-200 group-hover:text-brand-blue">
            {post.title}
          </h3>

          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-xs text-slate-400">Čítať článok</span>
            <span className="font-bold text-brand-blue transition-transform group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ArticlesCarousel({ posts }: { posts: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const isHovered = useRef(false);
  const currentX = useRef(0);
  const virtualScrollLeft = useRef(0);
  const currentInteractiveSpeed = useRef(0);
  const targetInteractiveSpeed = useRef(0);
  const oneSetStep = useRef(0);
  const normalizingScroll = useRef(false);

  const autoSpeed = 0.35;
  const maxInteractiveSpeed = 5;
  const easingFactor = 0.12;
  const edgeZonePercentage = 0.2;
  const setGap = 16;

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsDesktop(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const firstSet = firstSetRef.current;

    if (!container || !firstSet) return;

    const setWidth = firstSet.getBoundingClientRect().width;
    const overflowing = setWidth > container.clientWidth;

    oneSetStep.current = setWidth + setGap;
    setIsOverflowing(overflowing);

    if (overflowing) {
      const middleStart = oneSetStep.current;
      container.scrollLeft = middleStart;
      virtualScrollLeft.current = middleStart;
    } else {
      container.scrollLeft = 0;
      virtualScrollLeft.current = 0;
    }
  }, []);

  useEffect(() => {
    measure();

    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(measure);
    observer.observe(container);

    if (firstSetRef.current) {
      observer.observe(firstSetRef.current);
    }

    return () => observer.disconnect();
  }, [measure, posts]);

  const normalizePosition = useCallback(() => {
    const container = containerRef.current;
    const step = oneSetStep.current;

    if (
      !container ||
      !isOverflowing ||
      step <= 0 ||
      normalizingScroll.current
    ) {
      return;
    }

    let next = container.scrollLeft;

    if (next < step * 0.5) {
      next += step;
    } else if (next > step * 1.5) {
      next -= step;
    } else {
      virtualScrollLeft.current = next;
      return;
    }

    normalizingScroll.current = true;
    container.scrollLeft = next;
    virtualScrollLeft.current = next;

    requestAnimationFrame(() => {
      normalizingScroll.current = false;
    });
  }, [isOverflowing]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !isDesktop || !isOverflowing) return;

    let animationFrame = 0;
    let previousTime = performance.now();

    virtualScrollLeft.current = container.scrollLeft;

    const animate = (time: number) => {
      const delta = Math.min((time - previousTime) / 16.667, 2);
      previousTime = time;

      let targetSpeed = autoSpeed;

      if (isHovered.current) {
        const width = container.clientWidth;
        const leftBoundary = width * edgeZonePercentage;
        const rightBoundary = width * (1 - edgeZonePercentage);
        const mouseX = currentX.current;

        if (mouseX < leftBoundary) {
          const intensity = (leftBoundary - mouseX) / leftBoundary;
          targetSpeed = -maxInteractiveSpeed * intensity;
        } else if (mouseX > rightBoundary) {
          const intensity = (mouseX - rightBoundary) / leftBoundary;
          targetSpeed = maxInteractiveSpeed * intensity;
        } else {
          targetSpeed = 0;
        }
      }

      targetInteractiveSpeed.current = targetSpeed;
      currentInteractiveSpeed.current +=
        (targetInteractiveSpeed.current - currentInteractiveSpeed.current) *
        easingFactor;

      if (Math.abs(currentInteractiveSpeed.current) < 0.002) {
        currentInteractiveSpeed.current = 0;
      }

      virtualScrollLeft.current += currentInteractiveSpeed.current * delta;

      const step = oneSetStep.current;

      if (step > 0) {
        if (virtualScrollLeft.current < step * 0.5) {
          virtualScrollLeft.current += step;
        } else if (virtualScrollLeft.current > step * 1.5) {
          virtualScrollLeft.current -= step;
        }
      }

      container.scrollLeft = virtualScrollLeft.current;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isDesktop, isOverflowing]);

  if (!posts?.length) return null;

  const copies = isOverflowing ? 3 : 1;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="p-8 md:p-12">
        <h2 className="mb-6 text-center font-serif text-lg tracking-tight text-gray-900">
          Prečítajte si moje články
        </h2>

        <div
          ref={containerRef}
          className={`touch-pan-y select-none overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
            isOverflowing && isDesktop ? "cursor-ew-resize" : ""
          }`}
          onScroll={() => {
            if (!isDesktop) normalizePosition();
          }}
          onMouseEnter={(event) => {
            if (!isDesktop || !containerRef.current) return;

            isHovered.current = true;
            currentX.current =
              event.clientX -
              containerRef.current.getBoundingClientRect().left;
            virtualScrollLeft.current = containerRef.current.scrollLeft;
          }}
          onMouseMove={(event) => {
            if (
              !isDesktop ||
              !containerRef.current ||
              !isHovered.current
            ) {
              return;
            }

            currentX.current =
              event.clientX -
              containerRef.current.getBoundingClientRect().left;
          }}
          onMouseLeave={() => {
            isHovered.current = false;
          }}
        >
          <div
            className={`flex w-max gap-4 px-1 py-2 ${
              !isOverflowing ? "min-w-full justify-center" : ""
            }`}
          >
            {Array.from({ length: copies }).map((_, copyIndex) => (
              <div
                key={copyIndex}
                ref={copyIndex === 0 ? firstSetRef : undefined}
                className="flex flex-none gap-4"
                aria-hidden={
                  copyIndex !== 1 && copies > 1 ? true : undefined
                }
              >
                {posts.map((post) => (
                  <ArticleCard
                    key={`${copyIndex}-${post._id}`}
                    post={post}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}