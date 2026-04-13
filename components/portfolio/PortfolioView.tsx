"use client";

import type { PortfolioData } from "@/lib/types";
import { Hero } from "./Hero";
import { StatsStrip } from "./StatsStrip";
import { LanguagesChart } from "./LanguagesChart";
import { ContribTimeline } from "./ContribTimeline";
import { RepoGallery } from "./RepoGallery";
import { SectionReveal } from "./SectionReveal";

interface Props {
  data: PortfolioData;
}

export function PortfolioView({ data }: Props) {
  return (
    <main className="relative min-h-screen w-full">
      <Hero profile={data.profile} languages={data.languages} />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 space-y-24">
        <SectionReveal>
          <StatsStrip
            totals={data.totals}
            followers={data.profile.followers}
            reposFetched={data.repos.length}
            contribTotal={data.contributions?.total ?? 0}
          />
        </SectionReveal>

        {data.languages.length > 0 && (
          <SectionReveal title="Langages" subtitle="Distribution pondérée par bytes, top 10 repos.">
            <LanguagesChart languages={data.languages} />
          </SectionReveal>
        )}

        {data.contributions && (
          <SectionReveal
            title="Contributions"
            subtitle={`${data.contributions.total.toLocaleString("fr-FR")} contributions sur l'année.`}
          >
            <ContribTimeline contributions={data.contributions} />
          </SectionReveal>
        )}

        <SectionReveal
          title={data.pinned.length > 0 ? "Repos épinglés" : "Top repos"}
          subtitle={
            data.pinned.length > 0
              ? "Sélection mise en avant par l'auteur."
              : "Trié par stars."
          }
        >
          <RepoGallery pinned={data.pinned} topRepos={data.topRepos} />
        </SectionReveal>

        {data.warnings.length > 0 && (
          <div className="text-xs text-muted/70 text-center space-y-1">
            {data.warnings.map((w) => (
              <p key={w}>⚠ {w}</p>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
