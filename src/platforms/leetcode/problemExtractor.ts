import type { Difficulty } from "../../shared/types";

const PLATFORM = "leetcode" as const;

function extractSlug(): string | null {
  const url = new URL(window.location.href);

  const segments = url.pathname.split("/");

  const problemsIndex = segments.indexOf("problems");

  if (problemsIndex === -1 || problemsIndex + 1 >= segments.length) {
    return null;
  }

  const slug = segments[problemsIndex + 1]?.trim();
  return slug && slug !== "" ? slug : null;
}

function extractTitle(slug: string): string {
  const anchor =
    document.querySelector<HTMLAnchorElement>(`a[href="/problems/${slug}/"]`) ||
    document.querySelector<HTMLAnchorElement>(`a[href="/problems/${slug}"]`) ||
    document.querySelector<HTMLAnchorElement>(`a[href*="/problems/${slug}"]`);

  if (anchor?.textContent?.trim()) {
    return anchor.textContent.trim().replace(/^\d+\.\s*/, "");
  }

  const titleEl =
    document.querySelector<HTMLElement>('[data-cy="question-title"]') ||
    document.querySelector<HTMLElement>('div[class*="text-title-large"]') ||
    document.querySelector<HTMLElement>('span[class*="text-title-large"]');

  if (titleEl?.textContent?.trim()) {
    return titleEl.textContent.trim().replace(/^\d+\.\s*/, "");
  }

  const docTitle = document.title.split(" - LeetCode")[0]?.trim();
  if (docTitle && docTitle !== "LeetCode") {
    return docTitle.replace(/^\d+\.\s*/, "");
  }

  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function extractDifficulty(): Difficulty {
  const selectors = [
    'div[class*="text-olive"]',
    'div[class*="text-yellow"]',
    'div[class*="text-pink"]',
    'div[class*="text-emerald"]',
    'div[class*="text-amber"]',
    'div[class*="text-rose"]',
    'div[class*="text-difficulty"]',
    'span[class*="text-olive"]',
    'span[class*="text-yellow"]',
    'span[class*="text-pink"]',
    'span[class*="text-emerald"]',
    'span[class*="text-amber"]',
    'span[class*="text-rose"]',
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    const text = el?.textContent?.trim().toLowerCase();
    if (text === "easy") return "easy";
    if (text === "medium") return "medium";
    if (text === "hard") return "hard";
  }

  const container =
    document.querySelector("#qd-content") ||
    document.querySelector("main") ||
    document.body;

  if (container) {
    const elements = container.querySelectorAll<HTMLElement>("div, span");
    const limit = Math.min(elements.length, 100);
    for (let i = 0; i < limit; i++) {
      const text = elements[i].textContent?.trim().toLowerCase();
      if (text === "easy") return "easy";
      if (text === "medium") return "medium";
      if (text === "hard") return "hard";
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
