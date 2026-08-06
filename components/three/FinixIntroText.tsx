"use client";

import { useMemo } from "react";
import { Center, useGLTF } from "@react-three/drei";
import {
  Box3,
  Color,
  Mesh,
  MeshPhysicalMaterial,
  Vector3,
  type Object3D,
} from "three";

const TEXT_MODEL_PATH = "/models/text-animacia.glb";

const TEXT_POSITION: [number, number, number] = [0, 1.1, 0.4];
const TARGET_TEXT_WIDTH = 1.5;

function prepareText(root: Object3D) {
  const clone = root.clone(true);

  clone.traverse((child) => {
    if (!(child instanceof Mesh)) return;

    child.geometry = child.geometry.clone();
    child.geometry.computeVertexNormals();

    child.material = new MeshPhysicalMaterial({
      color: new Color("#ffffff"),
      metalness: 0.0,
      roughness: 1,
      clearcoat: 0,
      clearcoatRoughness: 0,
      envMapIntensity:1,
      reflectivity: 0,
      emissive: new Color("#071725"),
      emissiveIntensity: 0.025,
    });

    child.castShadow = false;
    child.receiveShadow = false;
  });

  clone.updateMatrixWorld(true);

  const bounds = new Box3().setFromObject(clone);
  const size = bounds.getSize(new Vector3());
  const normalizedScale =
    size.x > 0 ? TARGET_TEXT_WIDTH / size.x : 1;

  return {
    object: clone,
    scale: normalizedScale,
  };
}

export default function FinixIntroText() {
  const { scene } = useGLTF(TEXT_MODEL_PATH);

  const prepared = useMemo(
    () => prepareText(scene),
    [scene],
  );

  return (
    <group
      position={TEXT_POSITION}
      scale={prepared.scale}
    >
      <Center>
        <primitive object={prepared.object} />
      </Center>
    </group>
  );
}

useGLTF.preload(TEXT_MODEL_PATH);
