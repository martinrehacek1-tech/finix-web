"use client";

import {
  createContext,
  type ReactNode,
  useContext,
} from "react";

type IntroExperienceContextValue = {
  canReplayIntro: boolean;
  replayIntro: () => void;
  dismissReplayPrompt: () => void;
  introLocked: boolean;
};

const IntroExperienceContext =
  createContext<IntroExperienceContextValue>({
    canReplayIntro: false,
    replayIntro: () => undefined,
    dismissReplayPrompt: () => undefined,
    introLocked: false,
  });

export function IntroExperienceProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: IntroExperienceContextValue;
}) {
  return (
    <IntroExperienceContext.Provider value={value}>
      {children}
    </IntroExperienceContext.Provider>
  );
}

export function useIntroExperience() {
  return useContext(IntroExperienceContext);
}
