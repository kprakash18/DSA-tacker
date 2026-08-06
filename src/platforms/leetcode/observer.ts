import { extractProblemMetadata } from "./extractor";
import { MESSAGE_TYPES } from "../../shared/messages";
import type { ProblemDetectedPayload } from "../../shared/types";

let lastProblemSlug: string | null = null;
let currentProblemId: string | null = null;
let currentProblemMetadata: ProblemDetectedPayload | null = null;

export function getCurrentProblemId(): string | null {
  return currentProblemId;
}

export function getCurrentProblemMetadata(): ProblemDetectedPayload | null {
  return currentProblemMetadata;
}

function detectProblem(): void {
  if (!location.pathname.startsWith("/problems/")) {
    lastProblemSlug = null;
    currentProblemId = null;
    currentProblemMetadata = null;
    return;
  }

  const metadata = extractProblemMetadata();

  if (!metadata) {
    return;
  }

  // Assign problem ID immediately from URL slug (URL is synchronous & reliable)
  currentProblemId = `${metadata.platform}:${metadata.slug}`;
  currentProblemMetadata = metadata;

  const hasCompleteMetadata =
    metadata.title.trim() !== "" &&
    metadata.difficulty !== "unknown";

  if (!hasCompleteMetadata) {
    return;
  }

  // Same problem, ignore
  if (metadata.slug === lastProblemSlug) {
    return;
  }

  lastProblemSlug = metadata.slug;

  chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.PROBLEM_DETECTED,
    payload: metadata,
  });

  console.log("Problem detected:", metadata);
}

export function startProblemObserver() {
  detectProblem();

  let timeoutId: number | undefined;

  const observer = new MutationObserver(() => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      detectProblem();
    }, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}