"use client";

import { useGLTF } from "@react-three/drei";

export default function FinixIntroText() {
  const { scene } = useGLTF(
    "/models/text-animacia.glb",
  );

  return (
    <primitive
      object={scene}
      position={[0, 1.28, 0]}
      scale={0.85}
    />

    
  );
}

useGLTF.preload("/models/text-animacia.glb");