"use client";

import { motion } from "motion/react";
import { SceneCanvas } from "@/components/three/SceneCanvas";
import { LanguageOrbs } from "@/components/three/LanguageOrbs";
import type { LanguageSlice } from "@/lib/types";

interface LanguagesChartProps {
  languages: LanguageSlice[];
}

export function LanguagesChart({ languages }: LanguagesChartProps) {
  return (
    <div className="grid md:grid-cols-5 gap-6 items-stretch">
      <div className="md:col-span-3 relative h-[420px] glass rounded-2xl overflow-hidden">
        <SceneCanvas cameraPosition={[0, 0, 10]} fov={45}>
          <LanguageOrbs languages={languages} />
        </SceneCanvas>
      </div>

      <ul className="md:col-span-2 space-y-3">
        {languages.map((lang, i) => (
          <motion.li
            key={lang.name}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            className="glass rounded-xl p-3"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: lang.color, boxShadow: `0 0 12px ${lang.color}` }}
                />
                {lang.name}
              </span>
              <span className="font-mono text-muted">
                {lang.percent.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${lang.percent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: lang.color }}
              />
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
