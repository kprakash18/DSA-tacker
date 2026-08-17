import type { Platform, RuntimeMessage } from "./types";

const isDev = Boolean(
  typeof process !== "undefined" && process.env?.NODE_ENV !== "production"
);

export const logger = {
  info: (...args: unknown[]) => {
    if (isDev) console.info("[ProblemTracker]", ...args);
  },
  warn: (...args: unknown[]) => console.warn("[ProblemTracker]", ...args),
  error: (...args: unknown[]) => console.error("[ProblemTracker]", ...args),
  debug: (...args: unknown[]) => {
    if (isDev) console.debug("[ProblemTracker]", ...args);
  },
};

export function formatProblemId(platform: Platform | string, slug: string): string {
  return `${platform}:${slug}`;
}

export function parseProblemId(problemId: string): { platform: Platform; slug: string } {
  const [platform = "leetcode", ...rest] = problemId.split(":");
  return {
    platform: platform as Platform,
    slug: rest.join(":"),
  };
}

export async function safeSendMessage<T = unknown>(message: RuntimeMessage): Promise<T | null> {
  try {
    if (!chrome?.runtime?.id) {
      logger.warn("Extension context invalid, cannot send message:", message);
      return null;
    }
    return (await chrome.runtime.sendMessage(message)) as T;
  } catch (error) {
    logger.warn("safeSendMessage failed:", (error as Error).message);
    return null;
  }
}
