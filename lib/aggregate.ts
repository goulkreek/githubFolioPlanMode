import { colorForLanguage } from "@/constants/theme";
import type {
  GithubRepo,
  LanguageBytes,
  LanguageSlice,
} from "./types";

export function totalStars(repos: GithubRepo[]): number {
  return repos.reduce((sum, r) => sum + r.stargazers_count, 0);
}

export function totalForks(repos: GithubRepo[]): number {
  return repos.reduce((sum, r) => sum + r.forks_count, 0);
}

export function topReposByStars(repos: GithubRepo[], n = 6): GithubRepo[] {
  return [...repos]
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, n);
}

const MAX_LANGUAGES = 8;

export function languageDistribution(
  bytes: LanguageBytes,
  max = MAX_LANGUAGES,
): LanguageSlice[] {
  const entries = Object.entries(bytes).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return [];

  const top = entries.slice(0, max);
  const rest = entries.slice(max);
  const restBytes = rest.reduce((sum, [, b]) => sum + b, 0);
  if (restBytes > 0) {
    top.push(["Other", restBytes]);
  }

  const total = top.reduce((sum, [, b]) => sum + b, 0);
  if (total === 0) return [];

  return top.map(([name, b]) => ({
    name,
    bytes: b,
    percent: (b / total) * 100,
    color: colorForLanguage(name),
  }));
}
