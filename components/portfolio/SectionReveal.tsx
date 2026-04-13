"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface SectionRevealProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function SectionReveal({ children, title, subtitle }: SectionRevealProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {title && (
        <header className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-violet bg-clip-text text-transparent">
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
        </header>
      )}
      {children}
    </motion.section>
  );
}
