import { MESSAGE_TYPES } from "../../shared/constants";
import type { Difficulty, ProblemDetectedPayload } from "../../shared/types";
import { logger, formatProblemId, safeSendMessage } from "../../shared/utils";

function extractSlug(): string | null {
  const segments = window.location.pathname.split("/");
  const idx = segments.indexOf("problems");
  return idx !== -1 && idx + 1 < segments.length ? segments[idx + 1] : null;
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
    'div[class*="text-olive"]', 'div[class*="text-yellow"]', 'div[class*="text-pink"]',
    'div[class*="text-emerald"]', 'div[class*="text-amber"]', 'div[class*="text-rose"]',
    'div[class*="text-difficulty"]',
    'span[class*="text-olive"]', 'span[class*="text-yellow"]', 'span[class*="text-pink"]',
    'span[class*="text-emerald"]', 'span[class*="text-amber"]', 'span[class*="text-rose"]',
  ];

  for (const selector of selectors) {
    const text = document.querySelector(selector)?.textContent?.trim().toLowerCase();
    if (text === "easy" || text === "medium" || text === "hard") return text;
  }

  const container = document.querySelector("#qd-content") || document.querySelector("main") || document.body;
  if (container) {
    const elements = container.querySelectorAll<HTMLElement>("div, span");
    const limit = Math.min(elements.length, 100);
    for (let i = 0; i < limit; i++) {
      const text = elements[i].textContent?.trim().toLowerCase();
      if (text === "easy" || text === "medium" || text === "hard") return text;
    }
  }

  return "unknown";
}

function extractTags(): string[] {
  const tags = document.querySelectorAll<HTMLAnchorElement>('a[href^="/tag/"]');
  return Array.from(tags).map((t) => t.textContent?.trim() ?? "").filter(Boolean);
}

export function extractProblemMetadata(): ProblemDetectedPayload | null {
  const slug = extractSlug();
  if (!slug) return null;

  return {
    platform: "leetcode",
    slug,
    title: extractTitle(slug),
    url: window.location.href,
    difficulty: extractDifficulty(),
    tags: extractTags(),
  };
}

let lastProblemSlug: string | null = null;
let currentProblemId: string | null = null;
let currentProblemMetadata: ProblemDetectedPayload | null = null;

export function getCurrentProblemId(): string | null {
  return currentProblemId;
}

export function getCurrentProblemMetadata(): ProblemDetectedPayload | null {
  return currentProblemMetadata;
}

function detectProblem(): boolean {
  if (!location.pathname.startsWith("/problems/")) {
    lastProblemSlug = null;
    currentProblemId = null;
    currentProblemMetadata = null;
    return false;
  }

  const metadata = extractProblemMetadata();
  if (!metadata) return false;

  currentProblemId = formatProblemId(metadata.platform, metadata.slug);
  currentProblemMetadata = metadata;

  if (!metadata.title.trim() || metadata.difficulty === "unknown") {
    return false;
  }

  if (metadata.slug === lastProblemSlug) {
    return true;
  }

  lastProblemSlug = metadata.slug;
  safeSendMessage({
    type: MESSAGE_TYPES.PROBLEM_DETECTED,
    payload: metadata,
  });

  logger.info("Problem detected:", metadata);
  return true;
}

export function startProblemObserver() {
  let timeoutId: number | undefined;
  let lastCheckedHref = "";

  function check(): void {
    const currentHref = window.location.href;
    if (currentHref !== lastCheckedHref) {
      lastCheckedHref = currentHref;
      const metadata = extractProblemMetadata();
      if (metadata?.slug && metadata.slug !== lastProblemSlug) {
        lastProblemSlug = null;
      }
    }
    detectProblem();
  }

  const observer = new MutationObserver(() => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(check, 150);
  });

  const targetNode = document.body || document.documentElement;
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  }

  const urlCheckInterval = window.setInterval(check, 500);
  window.addEventListener("popstate", check);
  window.addEventListener("focus", check);

  check();

  return () => {
    window.clearTimeout(timeoutId);
    window.clearInterval(urlCheckInterval);
    observer.disconnect();
    window.removeEventListener("popstate", check);
    window.removeEventListener("focus", check);
  };
}