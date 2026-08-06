"use client";

import { MathUtils } from "three";
import FinixLogoScene from "./FinixLogoScene";

type FinixScrollIntroProps = {
  progress: number;
  isAnimating: boolean;
};

const TEXT_MOVE_START = 0.08;
const TEXT_MOVE_END = 0.72;

const TEXT_FADE_START = 0.58;
const TEXT_FADE_END = 0.8;

const INTRO_FADE_START = 0.68;
const INTRO_FADE_LENGTH = 0.32;

export default function FinixScrollIntro({
  progress,
  isAnimating,
}: FinixScrollIntroProps) {
  const textMoveProgress = MathUtils.smootherstep(
    MathUtils.clamp(
      (progress - TEXT_MOVE_START) /
        (TEXT_MOVE_END - TEXT_MOVE_START),
      0,
      1,
    ),
    0,
    1,
  );

  const textFadeProgress = MathUtils.smootherstep(
    MathUtils.clamp(
      (progress - TEXT_FADE_START) /
        (TEXT_FADE_END - TEXT_FADE_START),
      0,
      1,
    ),
    0,
    1,
  );

  const textOpacity = 1 - textFadeProgress;

  const textScale = MathUtils.lerp(
    1,
    2.15,
    textMoveProgress,
  );

  const textTranslateY = MathUtils.lerp(
    0,
    -115,
    textMoveProgress,
  );

  const textRotateX = MathUtils.lerp(
    0,
    -7,
    textMoveProgress,
  );

  const hintProgress = MathUtils.smootherstep(
    MathUtils.clamp(progress / 0.1, 0, 1),
    0,
    1,
  );

  const hintOpacity = 1 - hintProgress;

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
          perspective: "1000px",
        }}
      >
        <div
          style={{
            opacity: textOpacity,
            transform: `
              translate3d(0, ${textTranslateY}px, 0)
              scale(${textScale})
              rotateX(${textRotateX}deg)
            `,
            transformOrigin: "center top",
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
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-8 z-10 text-center"
        style={{
          opacity: hintOpacity,
          transform: `translate3d(0, ${
            hintProgress * 10
          }px, 0)`,
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