"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import { MathUtils } from "three";
import {
  IntroExperienceProvider,
} from "@/components/home/IntroExperienceContext";

const FinixScrollIntro = dynamic(
  () => import("@/components/three/FinixScrollIntro"),
  {
    ssr: false,
    loading: () => (
      <div
        className="fixed inset-0 z-[100] bg-[#01050a]"
        aria-hidden="true"
      />
    ),
  },
);

type HomeExperienceProps = {
  children: ReactNode;
  hasReferral: boolean;
};

type TimelineDirection = "forward" | "reverse";

const INTRO_DURATION_MS = 2200;
const REPLAY_DURATION_MS = 1800;

const SWIPE_TRIGGER_PX = 42;
const TOP_TOLERANCE_PX = 4;
const UPWARD_ATTEMPTS_TO_SHOW_BUTTON = 2;
const ATTEMPT_COOLDOWN_MS = 300;

const HOMEPAGE_REVEAL_START = 0.68;
const HOMEPAGE_REVEAL_LENGTH = 0.32;

function easeInOutSine(value: number) {
  return -(Math.cos(Math.PI * value) - 1) / 2;
}

function getHomepageReveal(progress: number) {
  return MathUtils.smootherstep(
    MathUtils.clamp(
      (progress - HOMEPAGE_REVEAL_START) /
        HOMEPAGE_REVEAL_LENGTH,
      0,
      1,
    ),
    0,
    1,
  );
}

export default function HomeExperience({
  children,
  hasReferral,
}: HomeExperienceProps) {
  const animationFrameRef = useRef<number | null>(null);
  const animationRunningRef = useRef(false);
  const introVisibleRef = useRef(true);
  const introProgressRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const touchAtHomepageTopRef = useRef(false);
  const attemptsRef = useRef(0);
  const lastAttemptAtRef = useRef(0);

  const [introVisible, setIntroVisible] = useState(true);
  const [introProgress, setIntroProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [introLocked, setIntroLocked] = useState(false);
  const [canReplayIntro, setCanReplayIntro] = useState(false);

  void hasReferral;

  const updateProgress = useCallback((progress: number) => {
    const clamped = MathUtils.clamp(progress, 0, 1);
    introProgressRef.current = clamped;
    setIntroProgress(clamped);
  }, []);

  const setIntroVisibility = useCallback((visible: boolean) => {
    introVisibleRef.current = visible;
    setIntroVisible(visible);
  }, []);

  const resetReplayAttempts = useCallback(() => {
    attemptsRef.current = 0;
    lastAttemptAtRef.current = 0;
  }, []);

  const dismissReplayPrompt = useCallback(() => {
    setCanReplayIntro(false);
    resetReplayAttempts();
  }, [resetReplayAttempts]);

  const registerUpwardAttempt = useCallback(() => {
    const now = Date.now();

    if (
      now - lastAttemptAtRef.current <
      ATTEMPT_COOLDOWN_MS
    ) {
      return;
    }

    lastAttemptAtRef.current = now;
    attemptsRef.current += 1;

    if (
      attemptsRef.current >=
      UPWARD_ATTEMPTS_TO_SHOW_BUTTON
    ) {
      setCanReplayIntro(true);
    }
  }, []);

  const runTimeline = useCallback(
    ({
      direction,
      onComplete,
    }: {
      direction: TimelineDirection;
      onComplete: () => void;
    }) => {
      if (animationRunningRef.current) return;

      const from = introProgressRef.current;
      const to = direction === "forward" ? 1 : 0;
      const fullDuration =
        direction === "forward"
          ? INTRO_DURATION_MS
          : REPLAY_DURATION_MS;

      const distance = Math.abs(to - from);
      const duration = Math.max(280, fullDuration * distance);
      const startedAt = performance.now();

      animationRunningRef.current = true;
      setIsAnimating(true);

      const animate = (now: number) => {
        const timeProgress = Math.min(
          1,
          (now - startedAt) / duration,
        );

        const eased =
          direction === "forward"
            ? easeInOutSine(timeProgress)
            : 1 - easeInOutSine(1 - timeProgress);

        updateProgress(from + (to - from) * eased);

        if (timeProgress < 1) {
          animationFrameRef.current =
            window.requestAnimationFrame(animate);
          return;
        }

        animationFrameRef.current = null;
        animationRunningRef.current = false;
        setIsAnimating(false);
        updateProgress(to);
        onComplete();
      };

      animationFrameRef.current =
        window.requestAnimationFrame(animate);
    },
    [updateProgress],
  );

  const playIntroForward = useCallback(() => {
    if (
      animationRunningRef.current ||
      !introVisibleRef.current
    ) {
      return;
    }

    runTimeline({
      direction: "forward",
      onComplete: () => {
        setIntroLocked(true);
        setIntroVisibility(false);
        updateProgress(1);
        window.scrollTo({ top: 0, behavior: "auto" });
      },
    });
  }, [
    runTimeline,
    setIntroVisibility,
    updateProgress,
  ]);

  const replayIntro = useCallback(() => {
    if (animationRunningRef.current) return;

    dismissReplayPrompt();
    setIntroLocked(false);
    updateProgress(1);
    setIntroVisibility(true);
    window.scrollTo({ top: 0, behavior: "auto" });

    window.requestAnimationFrame(() => {
      runTimeline({
        direction: "reverse",
        onComplete: () => {
          updateProgress(0);
        },
      });
    });
  }, [
    dismissReplayPrompt,
    runTimeline,
    setIntroVisibility,
    updateProgress,
  ]);

  useEffect(() => {
    const previousScrollRestoration =
      window.history.scrollRestoration;

    const previousScrollbarGutter =
      document.documentElement.style.scrollbarGutter;

    document.documentElement.style.scrollbarGutter = "stable";
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "auto" });

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      updateProgress(1);
      setIntroLocked(true);
      setIntroVisibility(false);
    }

    const handleWheel = (event: WheelEvent) => {
      if (introVisibleRef.current) {
        event.preventDefault();

        if (event.deltaY > 0) {
          playIntroForward();
        }

        return;
      }

      if (
        !introLocked ||
        event.deltaY >= 0 ||
        window.scrollY > TOP_TOLERANCE_PX
      ) {
        return;
      }

      event.preventDefault();
      registerUpwardAttempt();
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current =
        event.touches[0]?.clientY ?? null;

      touchAtHomepageTopRef.current =
        !introVisibleRef.current &&
        introLocked &&
        window.scrollY <= TOP_TOLERANCE_PX;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (touchStartYRef.current === null) return;

      const currentY = event.touches[0]?.clientY;
      if (currentY === undefined) return;

      if (introVisibleRef.current) {
        event.preventDefault();

        const upwardSwipe =
          touchStartYRef.current - currentY;

        if (upwardSwipe >= SWIPE_TRIGGER_PX) {
          touchStartYRef.current = null;
          playIntroForward();
        }

        return;
      }

      if (!touchAtHomepageTopRef.current) return;

      const pullDownDistance =
        currentY - touchStartYRef.current;

      if (pullDownDistance < 18) return;

      event.preventDefault();
      touchStartYRef.current = currentY;
      registerUpwardAttempt();
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
      touchAtHomepageTopRef.current = false;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!introVisibleRef.current) return;

      const triggerKeys = [
        "ArrowDown",
        "PageDown",
        " ",
        "Enter",
      ];

      if (!triggerKeys.includes(event.key)) return;

      event.preventDefault();
      playIntroForward();
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    window.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    window.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    window.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.history.scrollRestoration =
        previousScrollRestoration;

      document.documentElement.style.scrollbarGutter =
        previousScrollbarGutter;

      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener(
        "touchstart",
        handleTouchStart,
      );
      window.removeEventListener(
        "touchmove",
        handleTouchMove,
      );
      window.removeEventListener(
        "touchend",
        handleTouchEnd,
      );
      window.removeEventListener("keydown", handleKeyDown);

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(
          animationFrameRef.current,
        );
      }
    };
  }, [
    introLocked,
    playIntroForward,
    registerUpwardAttempt,
    setIntroVisibility,
    updateProgress,
  ]);

  const homepageReveal = getHomepageReveal(introProgress);
  const homepageOpacity = introVisible
    ? homepageReveal
    : 1;

  const homepageTranslateY = introVisible
    ? (1 - homepageReveal) * 14
    : 0;

  const homepageBlur = introVisible
    ? (1 - homepageReveal) * 4
    : 0;

  const contextValue = useMemo(
    () => ({
      canReplayIntro,
      replayIntro,
      dismissReplayPrompt,
      introLocked,
    }),
    [
      canReplayIntro,
      dismissReplayPrompt,
      introLocked,
      replayIntro,
    ],
  );

  return (
    <IntroExperienceProvider value={contextValue}>
      <div
        style={{
          opacity: homepageOpacity,
          transform: `translate3d(0, ${homepageTranslateY}px, 0)`,
          filter: `blur(${homepageBlur}px)`,
          willChange: introVisible
            ? "opacity, transform, filter"
            : undefined,
        }}
        aria-hidden={introVisible}
        className={introVisible ? "pointer-events-none" : undefined}
      >
        {children}
      </div>

      {introVisible && (
        <FinixScrollIntro
          progress={introProgress}
          isAnimating={isAnimating}
        />
      )}
    </IntroExperienceProvider>
  );
}
