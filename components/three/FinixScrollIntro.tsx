"use client";

import { MathUtils } from "three";
import FinixLogoScene from "./FinixLogoScene";

type FinixScrollIntroProps = {
  progress: number;
  isAnimating: boolean;
};

const CONTENT_FADE_START = 0;
const CONTENT_FADE_END = 0.16;

const INTRO_FADE_START = 0.68;
const INTRO_FADE_LENGTH = 0.32;

export default function FinixScrollIntro({
  progress,
  isAnimating,
}: FinixScrollIntroProps) {
  const contentFadeProgress = MathUtils.smootherstep(
    MathUtils.clamp(
      (progress - CONTENT_FADE_START) /
        (CONTENT_FADE_END - CONTENT_FADE_START),
      0,
      1,
    ),
    0,
    1,
  );

  const contentOpacity = 1 - contentFadeProgress;

  const titleTranslateY = MathUtils.lerp(
    0,
    -10,
    contentFadeProgress,
  );

  const hintTranslateY = MathUtils.lerp(
    0,
    10,
    contentFadeProgress,
  );

  const transitionProgress = MathUtils.smootherstep(
    MathUtils.clamp(
      (progress - INTRO_FADE_START) /
        INTRO_FADE_LENGTH,
      0,
      1,
    ),
    0,
    1,
  );

  const introOpacity = 1 - transitionProgress;

  const veilOpacity =
    Math.sin(transitionProgress * Math.PI) * 0.34;

  return (
    <section
      className="fixed inset-0 z-[100] overflow-hidden bg-[#081f36]"
      style={{
        opacity: introOpacity,
        willChange: "opacity",
      }}
      aria-label="Úvodná 3D animácia FINIX"
      aria-busy={isAnimating}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#164f76_0%,#0b3457_38%,#061f38_72%,#041526_100%)]" />

      <FinixLogoScene
        timelineProgress={progress}
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-[4%] z-10 px-6 text-center"
        style={{
          opacity: contentOpacity,
          transform: `translate3d(0, ${titleTranslateY}px, 0)`,
          willChange: "opacity, transform",
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-teal/80">
          FINIX
        </p>

        <h1 className="mx-auto mt-4 max-w-3xl font-serif text-3xl leading-tight text-white sm:text-5xl">
          Finančné riešenia v novom rozmere
        </h1>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-8 z-10 text-center"
        style={{
          opacity: contentOpacity,
          transform: `translate3d(0, ${hintTranslateY}px, 0)`,
          willChange: "opacity, transform",
        }}
      >
        <p className="text-xs uppercase tracking-[0.26em] text-white/45">
          Posuňte sa nižšie
        </p>

        <div className="mx-auto mt-3 h-10 w-px overflow-hidden bg-white/15">
          <div className="h-1/2 w-full animate-pulse bg-brand-teal/70" />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_50%_50%,rgba(113,245,231,0.32)_0%,rgba(37,126,194,0.18)_30%,rgba(5,23,42,0)_72%)]"
        style={{
          opacity: veilOpacity,
          willChange: "opacity",
        }}
      />
    </section>
  );
}
