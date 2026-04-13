"use client";

import { animate, useMotionValue, useTransform } from "motion/react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { cn } from "@/lib/cn";

interface StatBadgeProps {
  label: string;
  value: number;
  icon?: string;
  accent?: "cyan" | "violet" | "magenta";
}

const accentClasses: Record<NonNullable<StatBadgeProps["accent"]>, string> = {
  cyan: "from-cyan/20 to-transparent text-cyan",
  violet: "from-violet/20 to-transparent text-violet",
  magenta: "from-magenta/20 to-transparent text-magenta",
};

export function StatBadge({
  label,
  value,
  icon,
  accent = "cyan",
}: StatBadgeProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString("fr-FR"));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [count, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "glass rounded-2xl p-5 bg-gradient-to-br",
        accentClasses[accent],
      )}
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
        {icon && <span aria-hidden>{icon}</span>}
        {label}
      </div>
      <motion.div className="mt-2 text-3xl font-bold font-mono text-foreground">
        {rounded}
      </motion.div>
    </motion.div>
  );
}
