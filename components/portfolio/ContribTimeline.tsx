"use client";

import { SceneCanvas } from "@/components/three/SceneCanvas";
import { ContribGrid3D } from "@/components/three/ContribGrid3D";
import type { ContribData } from "@/lib/types";
import { CONTRIB_LEVEL_COLORS } from "@/constants/theme";

interface Props {
  contributions: ContribData;
}

export function ContribTimeline({ contributions }: Props) {
  const firstDate = contributions.days[0]?.date;
  const lastDate = contributions.days[contributions.days.length - 1]?.date;

  return (
    <div className="glass rounded-2xl p-4 overflow-hidden">
      <div className="relative h-[320px] md:h-[380px]">
        <SceneCanvas cameraPosition={[0, -3, 7]} fov={45}>
          <ContribGrid3D contributions={contributions} />
        </SceneCanvas>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted">
        <span className="font-mono">{firstDate}</span>
        <div className="flex items-center gap-2">
          <span>Moins</span>
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <span
              key={level}
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: CONTRIB_LEVEL_COLORS[level] }}
            />
          ))}
          <span>Plus</span>
        </div>
        <span className="font-mono">{lastDate}</span>
      </div>
    </div>
  );
}
