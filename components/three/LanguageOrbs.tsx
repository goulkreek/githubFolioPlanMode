"use client";

import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { LanguageSlice } from "@/lib/types";

interface LanguageOrbsProps {
  languages: LanguageSlice[];
}

interface OrbLayout {
  lang: LanguageSlice;
  position: [number, number, number];
  radius: number;
}

function layoutOrbs(languages: LanguageSlice[]): OrbLayout[] {
  const count = languages.length;
  const spread = Math.max(4, count * 0.9);
  return languages.map((lang, i) => {
    const angle = (i / count) * Math.PI * 2;
    const ring = i % 2 === 0 ? 1 : 1.6;
    const radius = 0.5 + Math.sqrt(lang.percent) / 4;
    return {
      lang,
      position: [
        Math.cos(angle) * spread * 0.35 * ring,
        Math.sin(angle * 1.3) * 1.4,
        Math.sin(angle) * spread * 0.35 * ring,
      ],
      radius,
    };
  });
}

function Orb({ data }: { data: OrbLayout }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.2;
    ref.current.rotation.y = t * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} position={data.position}>
        <sphereGeometry args={[data.radius, 48, 48]} />
        <MeshDistortMaterial
          color={data.lang.color}
          emissive={data.lang.color}
          emissiveIntensity={0.4}
          roughness={0.25}
          metalness={0.6}
          distort={0.35}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

export function LanguageOrbs({ languages }: LanguageOrbsProps) {
  const orbs = useMemo(() => layoutOrbs(languages), [languages]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[6, 6, 6]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-6, -4, 4]} intensity={0.7} color="#a855f7" />
      {orbs.map((orb) => (
        <Orb key={orb.lang.name} data={orb} />
      ))}
    </>
  );
}
