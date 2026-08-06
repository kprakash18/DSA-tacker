import { extractProblemMetadata } from "./extractor";
import { MESSAGE_TYPES } from "../../shared/messages";
import { attachSubmitListener } from "./submission";

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

  // Attach submit listener once
  attachSubmitListener();

  let timeoutId: number | undefined;

  const observer = new MutationObserver(() => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      detectProblem();

      // React may replace the submit button
      attachSubmitListener();
    }, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}