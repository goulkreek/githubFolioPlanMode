import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  getContributions,
  getLanguagesForRepos,
  getPinned,
  getProfile,
  getRepos,
  formatGithubError,
} from "@/lib/github";
import {
  languageDistribution,
  topReposByStars,
  totalForks,
  totalStars,
} from "@/lib/aggregate";
import type { PortfolioData } from "@/lib/types";
import { PortfolioView } from "@/components/portfolio/PortfolioView";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  return {
    title: `${username} · GitFolio`,
    description: `Portfolio dev animé de ${username} généré depuis GitHub.`,
  };
}

export default async function UsernamePage({ params }: PageProps) {
  const { username } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  console.log(
    `[portfolio] ${username} | token=${token ? `set (${token.length} chars)` : "none"}`,
  );

  const [profileRes, reposRes] = await Promise.all([
    getProfile(username, token),
    getRepos(username, token),
  ]);

  if (reposRes.ok) {
    console.log(
      `[portfolio] ${username} | fetched ${reposRes.data.length} repos (profile.public_repos=${profileRes.ok ? profileRes.data.public_repos : "?"})`,
    );
  }

  if (!profileRes.ok) {
    if (profileRes.error.kind === "not_found") notFound();
    throw new Error(formatGithubError(profileRes.error));
  }
  if (!reposRes.ok) {
    throw new Error(formatGithubError(reposRes.error));
  }

  const warnings: string[] = [];

  const [languageBytes, pinnedRes, contribRes] = await Promise.all([
    getLanguagesForRepos(reposRes.data, 10, token),
    getPinned(username),
    getContributions(username),
  ]);

  const languages = languageDistribution(languageBytes);
  const topRepos = topReposByStars(reposRes.data, 6);

  const pinned = pinnedRes.ok ? pinnedRes.data : [];
  if (!pinnedRes.ok) warnings.push("Repos épinglés indisponibles (fallback top stars).");

  const contributions = contribRes.ok ? contribRes.data : null;
  if (!contribRes.ok) warnings.push("Timeline de contributions indisponible.");

  const data: PortfolioData = {
    profile: profileRes.data,
    repos: reposRes.data,
    topRepos,
    pinned,
    languages,
    contributions,
    totals: {
      stars: totalStars(reposRes.data),
      forks: totalForks(reposRes.data),
      languages: languages.length,
      pinned: pinned.length,
    },
    warnings,
  };

  return <PortfolioView data={data} />;
}
