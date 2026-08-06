"use client";

import dynamic from "next/dynamic";

const FinixScrollIntro = dynamic(
  () => import("@/components/three/FinixScrollIntro"),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen bg-[#081f36]" />
    ),
  },
);

export default function ThreeDTestPage() {
  return (
    <FinixScrollIntro
      progress={0}
      isAnimating={false}
    />
  );
}
