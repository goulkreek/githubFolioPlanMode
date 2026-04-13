import type {
  ContribData,
  ContribDay,
  GithubError,
  GithubProfile,
  GithubRepo,
  LanguageBytes,
  PinnedRepo,
  Result,
} from "./types";

const GH_API = "https://api.github.com";
const REVALIDATE_SECONDS = 3600;

function buildHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

type FetchOpts = { revalidate?: number; token?: string };

async function ghFetch<T>(
  url: string,
  opts: FetchOpts = {},
): Promise<Result<T>> {
  try {
    const cacheOption = opts.token
      ? { cache: "no-store" as const }
      : { next: { revalidate: opts.revalidate ?? REVALIDATE_SECONDS } };
    const res = await fetch(url, {
      headers: buildHeaders(opts.token),
      ...cacheOption,
    });

    if (res.status === 404) {
      return { ok: false, error: { kind: "not_found", message: "Introuvable" } };
    }
    if (res.status === 403 || res.status === 429) {
      const reset = res.headers.get("x-ratelimit-reset");
      const resetAt = reset ? Number(reset) * 1000 : null;
      return {
        ok: false,
        error: {
          kind: "rate_limit",
          message:
            "Limite d'API GitHub atteinte. Configure un token pour passer à 5000 req/h.",
          resetAt,
        },
      };
    }
    if (!res.ok) {
      return {
        ok: false,
        error: { kind: "network", message: `HTTP ${res.status}` },
      };
    }

    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur réseau";
    return { ok: false, error: { kind: "network", message } };
  }
}

export function getProfile(
  username: string,
  token?: string,
): Promise<Result<GithubProfile>> {
  return ghFetch<GithubProfile>(`${GH_API}/users/${username}`, { token });
}

const REPOS_PER_PAGE = 100;
const REPOS_MAX_PAGES = 10;

async function paginateRepos(
  buildUrl: (page: number) => string,
  token?: string,
): Promise<Result<GithubRepo[]>> {
  const all: GithubRepo[] = [];
  for (let page = 1; page <= REPOS_MAX_PAGES; page++) {
    const res = await ghFetch<GithubRepo[]>(buildUrl(page), { token });
    if (!res.ok) {
      if (all.length > 0 && res.error.kind === "rate_limit") break;
      return res;
    }
    all.push(...res.data);
    if (res.data.length < REPOS_PER_PAGE) break;
  }
  return { ok: true, data: all };
}

export function getAuthenticatedLogin(
  token: string,
): Promise<Result<{ login: string }>> {
  return ghFetch<{ login: string }>(`${GH_API}/user`, { token });
}

export function getPublicRepos(
  username: string,
  token?: string,
): Promise<Result<GithubRepo[]>> {
  return paginateRepos(
    (page) =>
      `${GH_API}/users/${username}/repos?per_page=${REPOS_PER_PAGE}&page=${page}&sort=updated&type=owner`,
    token,
  );
}

export function getOwnRepos(token: string): Promise<Result<GithubRepo[]>> {
  return paginateRepos(
    (page) =>
      `${GH_API}/user/repos?per_page=${REPOS_PER_PAGE}&page=${page}&sort=updated&affiliation=owner&visibility=all`,
    token,
  );
}

export async function getRepos(
  username: string,
  token?: string,
): Promise<Result<GithubRepo[]>> {
  if (!token) return getPublicRepos(username, token);

  const meRes = await getAuthenticatedLogin(token);
  if (meRes.ok && meRes.data.login.toLowerCase() === username.toLowerCase()) {
    return getOwnRepos(token);
  }
  return getPublicRepos(username, token);
}

export async function getLanguagesForRepos(
  repos: GithubRepo[],
  maxRepos = 10,
  token?: string,
): Promise<LanguageBytes> {
  const targets = repos
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, maxRepos);

  const results = await Promise.all(
    targets.map((repo) =>
      ghFetch<LanguageBytes>(`${GH_API}/repos/${repo.full_name}/languages`, {
        token,
      }),
    ),
  );

  const merged: LanguageBytes = {};
  for (const result of results) {
    if (!result.ok) continue;
    for (const [lang, bytes] of Object.entries(result.data)) {
      merged[lang] = (merged[lang] ?? 0) + bytes;
    }
  }
  return merged;
}

interface RawPinned {
  owner: string;
  repo: string;
  link: string;
  description?: string | null;
  language?: string | null;
  languageColor?: string | null;
  stars?: number;
  forks?: number;
}

function isRawPinnedArray(value: unknown): value is RawPinned[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "owner" in item &&
        "repo" in item,
    )
  );
}

export async function getPinned(username: string): Promise<Result<PinnedRepo[]>> {
  try {
    const res = await fetch(
      `https://gh-pinned-repos.egoist.dev/?username=${encodeURIComponent(username)}`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    if (!res.ok) {
      return {
        ok: false,
        error: { kind: "unavailable", message: "Service pinned indisponible" },
      };
    }
    const json: unknown = await res.json();
    if (!isRawPinnedArray(json)) {
      return {
        ok: false,
        error: { kind: "unavailable", message: "Format pinned invalide" },
      };
    }
    const data: PinnedRepo[] = json.map((item) => ({
      owner: item.owner,
      repo: item.repo,
      link: item.link,
      description: item.description ?? null,
      language: item.language ?? null,
      languageColor: item.languageColor ?? null,
      stars: typeof item.stars === "number" ? item.stars : 0,
      forks: typeof item.forks === "number" ? item.forks : 0,
    }));
    return { ok: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur réseau";
    return { ok: false, error: { kind: "network", message } };
  }
}

interface RawContribResponse {
  total?: Record<string, number>;
  contributions?: Array<{
    date: string;
    count: number;
    level: number;
  }>;
}

function isRawContribResponse(value: unknown): value is RawContribResponse {
  if (typeof value !== "object" || value === null) return false;
  const rec = value as Record<string, unknown>;
  return Array.isArray(rec.contributions);
}

function clampLevel(level: number): ContribDay["level"] {
  if (level <= 0) return 0;
  if (level === 1) return 1;
  if (level === 2) return 2;
  if (level === 3) return 3;
  return 4;
}

export async function getContributions(
  username: string,
): Promise<Result<ContribData>> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    if (res.status === 404) {
      return { ok: false, error: { kind: "not_found", message: "Introuvable" } };
    }
    if (!res.ok) {
      return {
        ok: false,
        error: { kind: "unavailable", message: "Service contributions indisponible" },
      };
    }
    const json: unknown = await res.json();
    if (!isRawContribResponse(json)) {
      return {
        ok: false,
        error: { kind: "unavailable", message: "Format contributions invalide" },
      };
    }
    const contributions = json.contributions ?? [];
    const days: ContribDay[] = contributions.map((d) => ({
      date: d.date,
      count: d.count,
      level: clampLevel(d.level),
    }));
    const total = days.reduce((sum, d) => sum + d.count, 0);
    return { ok: true, data: { total, days } };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur réseau";
    return { ok: false, error: { kind: "network", message } };
  }
}

export function formatGithubError(error: GithubError): string {
  switch (error.kind) {
    case "not_found":
      return "Cet utilisateur GitHub n'existe pas.";
    case "rate_limit": {
      if (!error.resetAt) return error.message;
      const minutes = Math.max(
        1,
        Math.ceil((error.resetAt - Date.now()) / 60000),
      );
      return `Limite API GitHub atteinte. Réessaie dans ~${minutes} min.`;
    }
    case "network":
      return `Erreur réseau : ${error.message}`;
    case "unavailable":
      return error.message;
  }
}
