"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { SceneCanvas } from "@/components/three/SceneCanvas";
import { ParticlesHero } from "@/components/three/ParticlesHero";
import type { GithubProfile, LanguageSlice } from "@/lib/types";

interface HeroProps {
  profile: GithubProfile;
  languages: LanguageSlice[];
}

export function Hero({ profile, languages }: HeroProps) {
  const palette: [string, string, string] = [
    languages[0]?.color ?? "#22d3ee",
    languages[1]?.color ?? "#a855f7",
    languages[2]?.color ?? "#f472b6",
  ];

  return (
    <header className="relative min-h-[80vh] w-full overflow-hidden flex items-center">
      <SceneCanvas className="opacity-80">
        <ParticlesHero colors={palette} />
      </SceneCanvas>

      <div className="relative z-10 mx-auto max-w-6xl w-full px-6 py-24 flex flex-col md:flex-row items-center md:items-start gap-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative shrink-0"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan to-violet blur-2xl opacity-70" />
          <Image
            src={profile.avatar_url}
            alt={profile.login}
            width={180}
            height={180}
            className="relative rounded-full border border-white/10"
            priority
          />
        </motion.div>

        <div className="text-center md:text-left flex-1">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm uppercase tracking-[0.3em] text-muted"
          >
            @{profile.login}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-2 text-4xl md:text-6xl font-bold bg-gradient-to-br from-white via-cyan to-violet bg-clip-text text-transparent"
          >
            {profile.name ?? profile.login}
          </motion.h1>
          {profile.bio && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="mt-4 text-base md:text-lg text-muted max-w-2xl"
            >
              {profile.bio}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start text-sm text-muted"
          >
            {profile.location && <span>📍 {profile.location}</span>}
            {profile.company && <span>🏢 {profile.company}</span>}
            {profile.blog && (
              <a
                href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan hover:underline"
              >
                🔗 {profile.blog}
              </a>
            )}
            <Link
              href={profile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet hover:underline"
            >
              ↗ GitHub
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
