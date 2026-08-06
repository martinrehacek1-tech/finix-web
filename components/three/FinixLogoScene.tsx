"use client";

import {
  Suspense,
  useCallback,
} from "react";
import {
  Canvas,
  useFrame,
} from "@react-three/fiber";
import {
  
  Environment,
} from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  SMAA,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import {
  HalfFloatType,
  MathUtils,
  NoToneMapping,
  type WebGLRenderer,
} from "three";

import FinixLogoModel from "./FinixLogoModel";

type FinixLogoSceneProps = {
  timelineProgress: number;
};

const CAMERA_SETTINGS = {
  position: [0, 0, 4.2] as [number, number, number],
  fov: 38,
  near: 0.02,
  far: 100,
};

const GL_SETTINGS = {
  antialias: false,
  alpha: true,
  powerPreference: "high-performance" as const,
};

function CameraRig({
  timelineProgress,
}: FinixLogoSceneProps) {
  useFrame((state, delta) => {
    const rawProgress = MathUtils.clamp(
      timelineProgress / 0.92,
      0,
      1,
    );

    /*
     * Zjemní iba prvý okamih pohybu.
     * Nevytvorí dlhú pauzu pred animáciou.
     */
    const flightProgress = MathUtils.smootherstep(
      rawProgress,
      0,
      1,
    );

    const camera = state.camera;

    const targetZ = MathUtils.lerp(
      4.2,
      0.38,
      flightProgress,
    );

    const targetFov = MathUtils.lerp(
      38,
      51,
      flightProgress,
    );

    camera.position.x = MathUtils.damp(
      camera.position.x,
      0,
      12,
      delta,
    );

    camera.position.y = MathUtils.damp(
      camera.position.y,
      0,
      12,
      delta,
    );

    camera.position.z = MathUtils.damp(
      camera.position.z,
      targetZ,
      12,
      delta,
    );

    if ("fov" in camera) {
      camera.fov = MathUtils.damp(
        camera.fov,
        targetFov,
        10,
        delta,
      );

      camera.updateProjectionMatrix();
    }
  });

  return null;
}

function FinixPostProcessing() {
  return (
    <EffectComposer
      multisampling={0}
      frameBufferType={HalfFloatType}
      enableNormalPass={false}
    >
      <Bloom
        intensity={0.28}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.25}
        mipmapBlur
      />

      <Vignette
        eskil={false}
        offset={0.22}
        darkness={0.2}
      />

      <ToneMapping
        adaptive={false}
        middleGrey={0.4}
        maxLuminance={16}
        averageLuminance={1}
      />

      <SMAA />
    </EffectComposer>
  );
}

export default function FinixLogoScene({
  timelineProgress,
}: FinixLogoSceneProps) {
  const handleCreated = useCallback(
    ({ gl }: { gl: WebGLRenderer }) => {
      gl.toneMapping = NoToneMapping;
      gl.toneMappingExposure = 1;
    },
    [],
  );

  return (
    <div className="absolute inset-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(30,180,220,0.16),transparent_52%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_16%,rgba(0,4,12,0.85)_100%)]" />
      <div className="pointer-events-none absolute inset-x-[24%] bottom-[7%] h-[12%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(20,145,205,0.16)_0%,rgba(8,70,120,0.06)_42%,transparent_76%)] blur-3xl" />
      
      
      <Canvas
        camera={CAMERA_SETTINGS}
        dpr={[1, 1.5]}
        gl={GL_SETTINGS}
        onCreated={handleCreated}
      >
        <ambientLight intensity={5} />

        <directionalLight
          position={[4.5, 6, 7]}
          intensity={5}
          color="#ffffff"
        />

        <directionalLight
          position={[-5, 2, 3]}
          intensity={0.48}
          color="#35f0dc"
        />

        <directionalLight
          position={[4, 0, -4]}
          intensity={0.72}
          color="#167de5"
        />

        <directionalLight
          position={[0, 2, -6]}
          intensity={0.55}
          color="#74dfff"
        />

        <pointLight
          position={[0, 0.5, 5]}
          intensity={0}
          distance={12}
          decay={5}
          color="#d9fbff"
        />

        <spotLight
          position={[-1.5, 6, 5]}
          angle={0.32}
          penumbra={0.72}
          intensity={18}
          distance={16}
          decay={2}
          color="#ffffff"
        />

        <CameraRig
          timelineProgress={timelineProgress}
        />

        <Suspense fallback={null}>
          <Environment
            preset="city"
            environmentIntensity={0.88}
          />

          <FinixLogoModel
            timelineProgress={timelineProgress}
          />

          

          <FinixPostProcessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
