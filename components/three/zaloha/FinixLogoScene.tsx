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
  ContactShadows,
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

import FinixIntroText from "./FinixIntroText";
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
  // Vyhladenie rieši SMAA na konci postprocessing pipeline.
  antialias: false,
  alpha: true,
  powerPreference: "high-performance" as const,
};

function CameraRig({
  timelineProgress,
}: FinixLogoSceneProps) {
  useFrame((state) => {
    const flightProgress = MathUtils.smootherstep(
      MathUtils.clamp(
        (timelineProgress - 0.3) / 0.62,
        0,
        1,
      ),
      0,
      1,
    );

    const camera = state.camera;

    camera.position.set(
      0,
      0,
      MathUtils.lerp(4.2, 0.38, flightProgress),
    );

    if ("fov" in camera) {
      camera.fov = MathUtils.lerp(
        38,
        51,
        flightProgress,
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
      {/* Jemný lesk iba na najsvetlejších hranách. */}
      <Bloom
         intensity={0.28}
    luminanceThreshold={0.55}
    luminanceSmoothing={0.25}
    mipmapBlur
      />

      {/* Dodatočné filmové stmavenie okrajov WebGL scény. */}
      <Vignette
        eskil={false}
        offset={0.22}
        darkness={0.2}
      />

      {/* HDR obraz prevedie na výsledný zobraziteľný rozsah. */}
      <ToneMapping
        adaptive={false}
        middleGrey={0.4}
        maxLuminance={16}
        averageLuminance={1}
      />

      {/* Vyhladenie hrán po vykonaní ostatných efektov. */}
      <SMAA />
    </EffectComposer>
  );
}

export default function FinixLogoScene({
  timelineProgress,
}: FinixLogoSceneProps) {
  const handleCreated = useCallback(
    ({ gl }: { gl: WebGLRenderer }) => {
      // Tone mapping vykonáva ToneMapping efekt na konci pipeline.
      gl.toneMapping = NoToneMapping;
      gl.toneMappingExposure = 1;
    },
    [],
  );

  return (
    <div className="absolute inset-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(30,180,220,0.16),transparent_52%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_16%,rgba(0,4,12,0.85)_100%)]" />


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

          <Suspense fallback={null}>

    

    <FinixIntroText />

    <FinixLogoModel
        timelineProgress={timelineProgress}
    />

</Suspense>

          <FinixLogoModel
            timelineProgress={timelineProgress}
          />

          

         <ContactShadows
  position={[0, -1.32, 0]}
  opacity={
    0.08 *
    (1 -
      MathUtils.smoothstep(
        timelineProgress,
        0.4,
        0.78,
      ))
  }
  scale={8}
  blur={7}
  far={6}
/>

          <FinixPostProcessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
