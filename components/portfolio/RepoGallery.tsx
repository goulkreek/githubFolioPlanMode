"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { GithubRepo, PinnedRepo } from "@/lib/types";
import { colorForLanguage } from "@/constants/theme";
import type { MouseEvent } from "react";

interface RepoGalleryProps {
  pinned: PinnedRepo[];
  topRepos: GithubRepo[];
}

interface CardData {
  key: string;
  title: string;
  subtitle: string;
  description: string | null;
  language: string | null;
  languageColor: string;
  stars: number;
  forks: number;
  url: string;
}

function pinnedToCard(p: PinnedRepo): CardData {
  return {
    key: `${p.owner}/${p.repo}`,
    title: p.repo,
    subtitle: p.owner,
    description: p.description,
    language: p.language,
    languageColor: p.languageColor ?? colorForLanguage(p.language ?? ""),
    stars: p.stars,
    forks: p.forks,
    url: p.link,
  };
}

function repoToCard(r: GithubRepo): CardData {
  return {
    key: r.full_name,
    title: r.name,
    subtitle: r.full_name.split("/")[0],
    description: r.description,
    language: r.language,
    languageColor: colorForLanguage(r.language ?? ""),
    stars: r.stargazers_count,
    forks: r.forks_count,
    url: r.html_url,
  };
}

export function RepoGallery({ pinned, topRepos }: RepoGalleryProps) {
  const cards: CardData[] =
    pinned.length > 0 ? pinned.map(pinnedToCard) : topRepos.map(repoToCard);

  if (cards.length === 0) {
    return <p className="text-muted text-center">Aucun repo public trouvé.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((card, i) => (
        <RepoCard key={card.key} card={card} index={i} />
      ))}
    </div>
  );
}

function RepoCard({ card, index }: { card: CardData; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="glass rounded-2xl p-5 block group hover:border-white/20 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted font-mono">{card.subtitle}</p>
          <h3 className="mt-1 text-lg font-semibold text-foreground group-hover:text-cyan transition-colors">
            {card.title}
          </h3>
        </div>
        <span className="text-muted opacity-0 group-hover:opacity-100 transition-opacity">
          ↗
        </span>
      </div>
      {card.description && (
        <p className="mt-3 text-sm text-muted line-clamp-3">{card.description}</p>
      )}
      <div className="mt-4 flex items-center gap-4 text-xs text-muted">
        {card.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: card.languageColor }}
            />
            {card.language}
          </span>
        )}
        <span>⭐ {card.stars.toLocaleString("fr-FR")}</span>
        <span>🍴 {card.forks.toLocaleString("fr-FR")}</span>
      </div>
    </motion.a>
  );
}
