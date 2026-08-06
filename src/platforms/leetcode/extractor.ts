import type { Difficulty } from "../../shared/types";

const PLATFORM = "leetcode" as const;

function extractSlug(): string | null {
  const url = new URL(window.location.href);

  const segments = url.pathname.split("/");

  const problemsIndex = segments.indexOf("problems");

  if (problemsIndex === -1 || problemsIndex + 1 >= segments.length) {
    return null;
  }

  return segments[problemsIndex + 1];
}

function extractTitle(slug: string): string {
  const anchor = document.querySelector<HTMLAnchorElement>(
    `a[href="/problems/${slug}/"]`,
  );

  if (!anchor) {
    return "";
  }

  const text = anchor.textContent?.trim() ?? "";

  return text.replace(/^\d+\.\s*/, "");
}

function extractDifficulty(): Difficulty {
  const elements = document.querySelectorAll<HTMLElement>("div");

  for (const element of Array.from(elements)) {
    const text = element.textContent?.trim();

    switch (text) {
      case "Easy":
        return "easy";

      case "Medium":
        return "medium";

      case "Hard":
        return "hard";
    }
  }

  return "unknown";
}

function extractTags(): string[] {
  const tagElements =
    document.querySelectorAll<HTMLAnchorElement>('a[href^="/tag/"]');

  return Array.from(tagElements)
    .map((tag) => tag.textContent?.trim() ?? "")
    .filter(Boolean);
}

export function extractProblemMetadata() {
  const slug = extractSlug();

  if (!slug) {
    return null;
  }

  return {
    platform: PLATFORM,
    slug,
    title: extractTitle(slug),
    url: window.location.href,
    difficulty: extractDifficulty(),
    tags: extractTags(),
  };
}
