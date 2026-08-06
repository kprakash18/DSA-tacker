import { extractProblemMetadata } from "./extractor";
import { MESSAGE_TYPES } from "../../shared/messages";

let lastProblemSlug: string | null = null;

function detectProblem(): void {
  if (!location.pathname.startsWith("/problems/")) {
    lastProblemSlug = null;
    return;
  }

  const metadata = extractProblemMetadata();

  if (!metadata) {
    return;
  }

  // Ignore duplicate detections for already completely processed problem
  if (metadata.slug === lastProblemSlug) {
    return;
  }

  // Check if metadata is complete
  const hasCompleteMetadata =
    metadata.title.trim() !== "" && metadata.difficulty !== "unknown";

  if (!hasCompleteMetadata) {
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

  let lastUrl = location.href;
  let timeoutId: number | undefined;

  const observer = new MutationObserver(() => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      const currentUrl = location.href;

      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        lastProblemSlug = null;
      }

      detectProblem();
    }, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}