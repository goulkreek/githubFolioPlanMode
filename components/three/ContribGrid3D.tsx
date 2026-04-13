"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import type { ContribData, ContribDay } from "@/lib/types";
import { CONTRIB_LEVEL_COLORS } from "@/constants/theme";

interface ContribGrid3DProps {
  contributions: ContribData;
}

const CELL_SIZE = 0.22;
const GAP = 0.05;
const MAX_HEIGHT = 1.8;
const DAYS_PER_WEEK = 7;

interface CellData {
  day: ContribDay;
  matrix: THREE.Matrix4;
  color: THREE.Color;
}

function buildCells(contributions: ContribData): CellData[] {
  const days = contributions.days;
  const max = Math.max(1, ...days.map((d) => d.count));
  const dummy = new THREE.Object3D();
  const cellStep = CELL_SIZE + GAP;
  const totalWeeks = Math.ceil(days.length / DAYS_PER_WEEK);
  const offsetX = -((totalWeeks - 1) * cellStep) / 2;
  const offsetY = -((DAYS_PER_WEEK - 1) * cellStep) / 2;

  return days.map((day, index) => {
    const week = Math.floor(index / DAYS_PER_WEEK);
    const dayOfWeek = index % DAYS_PER_WEEK;
    const intensity = day.count / max;
    const height = Math.max(0.04, intensity * MAX_HEIGHT);
    dummy.position.set(
      offsetX + week * cellStep,
      offsetY + (DAYS_PER_WEEK - 1 - dayOfWeek) * cellStep,
      height / 2,
    );
    dummy.scale.set(CELL_SIZE, CELL_SIZE, height);
    dummy.updateMatrix();
    return {
      day,
      matrix: dummy.matrix.clone(),
      color: new THREE.Color(CONTRIB_LEVEL_COLORS[day.level]),
    };
  });
}

export function ContribGrid3D({ contributions }: ContribGrid3DProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<{ day: ContribDay; index: number } | null>(null);

  const cells = useMemo(() => buildCells(contributions), [contributions]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.count = cells.length;
    cells.forEach((cell, i) => {
      mesh.setMatrixAt(i, cell.matrix);
      mesh.setColorAt(i, cell.color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [cells]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x = -0.6 + Math.sin(state.clock.elapsedTime * 0.3) * 0.04;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.03;
  });

  const handleMove = (event: ThreeEvent<PointerEvent>) => {
    const id = event.instanceId;
    if (typeof id !== "number") return;
    event.stopPropagation();
    const cell = cells[id];
    if (!cell) return;
    setHover({ day: cell.day, index: id });
  };

  const hoverPos = useMemo<[number, number, number] | null>(() => {
    if (!hover) return null;
    const cell = cells[hover.index];
    if (!cell) return null;
    const pos = new THREE.Vector3();
    pos.setFromMatrixPosition(cell.matrix);
    return [pos.x, pos.y, pos.z + 0.6];
  }, [hover, cells]);

  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[6, 6, 8]} intensity={1.1} />
      <pointLight position={[-5, -4, 6]} intensity={0.6} color="#22d3ee" />
      <group ref={groupRef}>
        <instancedMesh
          ref={meshRef}
          args={[undefined, undefined, cells.length]}
          onPointerMove={handleMove}
          onPointerOut={() => setHover(null)}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial toneMapped={false} metalness={0.3} roughness={0.4} />
        </instancedMesh>
        {hoverPos && hover && (
          <Html position={hoverPos} center style={{ pointerEvents: "none" }}>
            <div className="glass rounded-md px-2 py-1 text-xs whitespace-nowrap">
              <span className="font-mono text-cyan">{hover.day.count}</span>{" "}
              {hover.day.count > 1 ? "contribs" : "contrib"}
              <span className="text-muted ml-2">{hover.day.date}</span>
            </div>
          </Html>
        )}
      </group>
    </>
  );
}
