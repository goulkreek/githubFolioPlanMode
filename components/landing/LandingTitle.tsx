"use client";

import { motion } from "motion/react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function LandingTitle() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mb-10"
    >
      <motion.p
        variants={item}
        className="text-xs uppercase tracking-[0.3em] text-muted mb-4"
      >
        GitFolio
      </motion.p>
      <motion.h1
        variants={item}
        className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-white via-cyan to-violet bg-clip-text text-transparent"
      >
        Ton portfolio dev,
        <br />
        en 3D, depuis GitHub.
      </motion.h1>
      <motion.p
        variants={item}
        className="mt-5 text-base md:text-lg text-muted max-w-xl mx-auto"
      >
        Entre un username GitHub. On fetch tes repos, tes langages et tes
        contributions — et on génère un site immersif.
      </motion.p>
    </motion.div>
  );
}
