export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: GithubError };

export type GithubError =
  | { kind: "not_found"; message: string }
  | { kind: "rate_limit"; message: string; resetAt: number | null }
  | { kind: "network"; message: string }
  | { kind: "unavailable"; message: string };

export interface GithubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  company: string | null;
  blog: string | null;
  location: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  pushed_at: string;
  archived: boolean;
}

export type LanguageBytes = Record<string, number>;

export interface PinnedRepo {
  owner: string;
  repo: string;
  link: string;
  description: string | null;
  language: string | null;
  languageColor: string | null;
  stars: number;
  forks: number;
}

export interface ContribDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContribData {
  total: number;
  days: ContribDay[];
}

export interface LanguageSlice {
  name: string;
  bytes: number;
  percent: number;
  color: string;
}

export interface PortfolioData {
  profile: GithubProfile;
  repos: GithubRepo[];
  topRepos: GithubRepo[];
  pinned: PinnedRepo[];
  languages: LanguageSlice[];
  contributions: ContribData | null;
  totals: {
    stars: number;
    forks: number;
    languages: number;
    pinned: number;
  };
  warnings: string[];
}
