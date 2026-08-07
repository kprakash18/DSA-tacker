import { extractProblemMetadata } from "./problemExtractor";
import { MESSAGE_TYPES } from "../../shared/messages";
import type { ProblemDetectedPayload } from "../../shared/types";
import { logger } from "../../shared/utils/logger";

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

  chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.PROBLEM_DETECTED,
    payload: metadata,
  });

  logger.info("Problem detected:", metadata);
  return true;
}

let isHistoryPatched = false;

function patchHistoryMethods(): void {
  if (isHistoryPatched) {
    return;
  }

  isHistoryPatched = true;

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    window.dispatchEvent(new Event("locationchange"));
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    window.dispatchEvent(new Event("locationchange"));
  };
}

export function startProblemObserver() {
  patchHistoryMethods();

  let timeoutId: number | undefined;
  let isObserving = false;

  const observer = new MutationObserver(() => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      const isComplete = detectProblem();
      if (isComplete && isObserving) {
        observer.disconnect();
        isObserving = false;
      }
    }, 100);
  });

  function startObserving() {
    const isComplete = detectProblem();
    if (!isComplete && !isObserving) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      isObserving = true;
    }
  }

  startObserving();

  const onLocationChange = () => {
    startObserving();
  };

  const onFocus = () => {
    if (location.pathname.startsWith("/problems/")) {
      const metadata = extractProblemMetadata();
      if (metadata && metadata.title.trim() !== "" && metadata.difficulty !== "unknown") {
        currentProblemId = `${metadata.platform}:${metadata.slug}`;
        currentProblemMetadata = metadata;
        lastProblemSlug = metadata.slug;
        chrome.runtime.sendMessage({
          type: MESSAGE_TYPES.PROBLEM_DETECTED,
          payload: metadata,
        });
      }
    }
  };

  window.addEventListener("popstate", onLocationChange);
  window.addEventListener("locationchange", onLocationChange);
  window.addEventListener("focus", onFocus);

  return () => {
    window.removeEventListener("popstate", onLocationChange);
    window.removeEventListener("locationchange", onLocationChange);
    window.removeEventListener("focus", onFocus);
    if (isObserving) {
      observer.disconnect();
      isObserving = false;
    }
  };
}