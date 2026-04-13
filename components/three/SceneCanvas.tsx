"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from "@react-three/drei";
import { Suspense, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SceneCanvasProps {
  children: ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
  dprRange?: [number, number];
  orbitless?: boolean;
}

export function SceneCanvas({
  children,
  className,
  cameraPosition = [0, 0, 8],
  fov = 50,
  dprRange = [1, 2],
}: SceneCanvasProps) {
  const [dpr, setDpr] = useState<number>(dprRange[1]);

  const canvasProps: CanvasProps = {
    dpr,
    gl: { antialias: true, powerPreference: "high-performance", alpha: true },
    camera: { position: cameraPosition, fov },
  };

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      <Canvas {...canvasProps}>
        <PerformanceMonitor
          onDecline={() => setDpr(dprRange[0])}
          onIncline={() => setDpr(dprRange[1])}
        />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
