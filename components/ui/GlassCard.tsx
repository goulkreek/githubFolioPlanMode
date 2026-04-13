import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: "cyan" | "violet" | "none";
}

export function GlassCard({
  children,
  className,
  glow = "none",
  ...rest
}: GlassCardProps) {
  return (
    <div
      {...rest}
      className={cn(
        "glass rounded-2xl p-5 transition-all duration-300",
        glow === "cyan" && "hover:glow-cyan",
        glow === "violet" && "hover:glow-violet",
        className,
      )}
    >
      {children}
    </div>
  );
}
