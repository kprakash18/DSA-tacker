import { extractProblemMetadata } from "./problemExtractor";
import { MESSAGE_TYPES } from "../../shared/messages";
import type { ProblemDetectedPayload } from "../../shared/types";
import { logger } from "../../shared/utils/logger";
import { safeSendMessage } from "../../shared/utils/safeSendMessage";

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

  if (!metadata) {
    return false;
  }

  // Assign problem ID immediately from URL slug (URL is synchronous & reliable)
  currentProblemId = `${metadata.platform}:${metadata.slug}`;
  currentProblemMetadata = metadata;

  const hasCompleteMetadata =
    metadata.title.trim() !== "" &&
    metadata.difficulty !== "unknown";

  if (!hasCompleteMetadata) {
    return false;
  }

  // Same problem, ignore
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

  function cleanup(): void {
    window.clearTimeout(timeoutId);
    window.clearInterval(urlCheckInterval);
    observer.disconnect();
    window.removeEventListener("popstate", check);
    window.removeEventListener("focus", check);
  }

  function check(): void {
    if (!chrome.runtime?.id) {
      cleanup();
      return;
    }
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

  // Observe DOM for asynchronous rendering of problem details
  const observer = new MutationObserver(() => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(check, 150);
  });

  const targetNode = document.body || document.documentElement;
  if (targetNode) {
    observer.observe(targetNode, {
      childList: true,
      subtree: true,
    });
  }

  // Periodic fallback check for SPA navigation in case DOM mutations are subtle
  const urlCheckInterval = window.setInterval(check, 500);

  window.addEventListener("popstate", check);
  window.addEventListener("focus", check);

  // Initial check
  check();

  return cleanup;
}