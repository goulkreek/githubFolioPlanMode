export const NEON = {
  cyan: "#22d3ee",
  violet: "#a855f7",
  magenta: "#f472b6",
  lime: "#a3e635",
  amber: "#fbbf24",
} as const;

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Lua: "#000080",
  Zig: "#ec915c",
  Scala: "#c22d40",
  "Jupyter Notebook": "#DA5B0B",
  MDX: "#fcb32c",
  Nix: "#7e7eff",
};

export const FALLBACK_LANG_COLOR = "#94a3b8";

export function colorForLanguage(name: string): string {
  return LANGUAGE_COLORS[name] ?? FALLBACK_LANG_COLOR;
}

export const CONTRIB_LEVEL_COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "#1a1b2e",
  1: "#0e4a3a",
  2: "#22d3ee",
  3: "#a855f7",
  4: "#f472b6",
};
