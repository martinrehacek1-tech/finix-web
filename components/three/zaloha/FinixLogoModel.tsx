"use client";

import {
  useMemo,
  useRef,
} from "react";
import {
  Center,
  useGLTF,
} from "@react-three/drei";
import {
  useFrame,
} from "@react-three/fiber";
import {
  Box3,
  Color,
  Float32BufferAttribute,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  Vector3,
  type Group,
  type Object3D,
} from "three";

const MODEL_PATH = "/models/finix-logo-bevel-1.glb";

/*
 * Presné farby gradientu FINIX.
 */
const COLOR_START = new Color("#00dfc3");
const COLOR_MIDDLE = new Color("#0097d4");
const COLOR_END = new Color("#0752d8");

/*
 * Smer gradientu:
 * väčší HORIZONTAL_WEIGHT = viac vodorovný,
 * väčší VERTICAL_WEIGHT = viac diagonálny.
 * Súčet nech zostane približne 1.
 */
const HORIZONTAL_WEIGHT = 0.50;
const VERTICAL_WEIGHT = 0.50;

/*
 * Kalibrácia preletu cez otvor.
 * Upravuj po malých krokoch, napríklad 0.02.
 */
const FLIGHT_OFFSET_X = 0;
const FLIGHT_OFFSET_Y = 0;

const FRONT_ROTATION_X = 0;
const FRONT_ROTATION_Y = 0;
const FRONT_ROTATION_Z = 0;

type FinixLogoModelProps = {
  timelineProgress: number;
};

function applyFinixMaterial(root: Object3D) {
  root.updateMatrixWorld(true);

  const bounds = new Box3().setFromObject(root);
  const size = bounds.getSize(new Vector3());
  const worldPosition = new Vector3();

  root.traverse((child) => {
    if (!(child instanceof Mesh)) return;

    const geometry = child.geometry.clone();
    const position =
      geometry.getAttribute("position");

    const colors =
      new Float32Array(position.count * 3);

    for (
      let index = 0;
      index < position.count;
      index += 1
    ) {
      worldPosition
        .fromBufferAttribute(position, index)
        .applyMatrix4(child.matrixWorld);

      const horizontal =
        size.x > 0
          ? (worldPosition.x - bounds.min.x) /
            size.x
          : 0.5;

      const vertical =
        size.y > 0
          ? (worldPosition.y - bounds.min.y) /
            size.y
          : 0.5;

      const gradientPosition =
        MathUtils.clamp(
          horizontal * HORIZONTAL_WEIGHT +
            (1 - vertical) *
              VERTICAL_WEIGHT,
          0,
          1,
        );

      const color = new Color();

      if (gradientPosition < 0.52) {
        color
          .copy(COLOR_START)
          .lerp(
            COLOR_MIDDLE,
            gradientPosition / 0.52,
          );
      } else {
        color
          .copy(COLOR_MIDDLE)
          .lerp(
            COLOR_END,
            (gradientPosition - 0.52) / 0.48,
          );
      }

      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    geometry.setAttribute(
      "color",
      new Float32BufferAttribute(colors, 3),
    );
    geometry.computeVertexNormals();

    child.geometry = geometry;
    child.material =
      child.material =
  new MeshPhysicalMaterial({
    vertexColors: true,

    metalness: 0.4,
    roughness: 0.2,

    clearcoat: 1,
    clearcoatRoughness: 0.045,

    envMapIntensity: 0.82,

    ior: 1.45,
    reflectivity: 0.72,

    specularIntensity: 1.55,
    specularColor: new Color("#eaffff"),

    sheen: 0.08,
    sheenColor: new Color("#54eee6"),
    sheenRoughness: 0.48,

    emissive: new Color("#001019"),
    emissiveIntensity: 0.015,
  });

    child.castShadow = false;
    child.receiveShadow = false;
  });

  return root;
}

export default function FinixLogoModel({
  timelineProgress,
}: FinixLogoModelProps) {
  const groupRef = useRef<Group>(null);
  const elapsedRef = useRef(0);
  const { scene } = useGLTF(MODEL_PATH);

  const preparedScene = useMemo(() => {
    const clone = scene.clone(true);
    return applyFinixMaterial(clone);
  }, [scene]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    elapsedRef.current += delta;

    const alignmentProgress =
      MathUtils.smootherstep(
        MathUtils.clamp(
          (timelineProgress - 0.16) / 0.24,
          0,
          1,
        ),
        0,
        1,
      );

    const interactionStrength =
      1 - alignmentProgress;

    const idleYaw =
      Math.sin(elapsedRef.current * 0.34) *
      0.12;

    const idlePitch =
      Math.sin(elapsedRef.current * 0.46) *
      0.025;

    const interactiveRotationX =
      idlePitch + state.pointer.y * -0.1;

    const interactiveRotationY =
      idleYaw + state.pointer.x * 0.16;

    const interactiveRotationZ =
      state.pointer.x * -0.025;

    group.rotation.set(
      MathUtils.lerp(
        interactiveRotationX,
        FRONT_ROTATION_X,
        alignmentProgress,
      ),
      MathUtils.lerp(
        interactiveRotationY,
        FRONT_ROTATION_Y,
        alignmentProgress,
      ),
      MathUtils.lerp(
        interactiveRotationZ,
        FRONT_ROTATION_Z,
        alignmentProgress,
      ),
    );

    const floatingY =
      Math.sin(elapsedRef.current * 0.68) *
      0.025 *
      interactionStrength;

    group.position.set(
      MathUtils.lerp(
        0,
        FLIGHT_OFFSET_X,
        alignmentProgress,
      ),
      MathUtils.lerp(
        floatingY,
        FLIGHT_OFFSET_Y,
        alignmentProgress,
      ),
      0,
    );

    const flightProgress =
      MathUtils.smootherstep(
        MathUtils.clamp(
          (timelineProgress - 0.3) / 0.62,
          0,
          1,
        ),
        0,
        1,
      );

    group.scale.setScalar(
      MathUtils.lerp(18, 48, flightProgress),
    );
  });

  return (
    <group
      ref={groupRef}
      scale={18}
      rotation={[
        FRONT_ROTATION_X,
        FRONT_ROTATION_Y,
        FRONT_ROTATION_Z,
      ]}
    >
      <Center>
        <primitive object={preparedScene} />
      </Center>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
