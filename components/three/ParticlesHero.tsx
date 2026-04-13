"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface ParticlesHeroProps {
  count?: number;
  colors?: [string, string, string];
  radius?: number;
}

const DEFAULT_COLORS: [string, string, string] = ["#22d3ee", "#a855f7", "#f472b6"];

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ParticlesHero({
  count = 5000,
  colors = DEFAULT_COLORS,
  radius = 6,
}: ParticlesHeroProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colorAttr } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = colors.map((c) => new THREE.Color(c));
    const rand = mulberry32(count ^ palette.length);
    for (let i = 0; i < count; i++) {
      const r = radius * Math.cbrt(rand());
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const paletteIndex = Math.floor(rand() * palette.length);
      const color = palette[paletteIndex];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return { positions: pos, colorAttr: col };
  }, [count, colors, radius]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.06;
    pointsRef.current.rotation.x += delta * 0.02;
    const t = state.clock.elapsedTime;
    pointsRef.current.position.y = Math.sin(t * 0.4) * 0.15;
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[8, 8, 8]} intensity={1.1} color="#a855f7" />
      <pointLight position={[-8, -6, 4]} intensity={0.8} color="#22d3ee" />
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={positions.length / 3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colorAttr, 3]}
            count={colorAttr.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
