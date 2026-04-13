"use client";

import { StatBadge } from "@/components/ui/StatBadge";
import type { PortfolioData } from "@/lib/types";

interface StatsStripProps {
  totals: PortfolioData["totals"];
  followers: number;
  reposFetched: number;
  contribTotal: number;
}

export function StatsStrip({
  totals,
  followers,
  reposFetched,
  contribTotal,
}: StatsStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      <StatBadge label="Repos" value={reposFetched} icon="📦" accent="cyan" />
      <StatBadge label="Stars" value={totals.stars} icon="⭐" accent="violet" />
      <StatBadge label="Forks" value={totals.forks} icon="🍴" accent="cyan" />
      <StatBadge label="Followers" value={followers} icon="👥" accent="magenta" />
      <StatBadge label="Langages" value={totals.languages} icon="💻" accent="cyan" />
      <StatBadge label="Contributions" value={contribTotal} icon="📊" accent="violet" />
    </div>
  );
}
