import { extractProblemMetadata } from "./extractor";
import { MESSAGE_TYPES } from "../../shared/messages";
import { attachSubmitListener } from "./submission";

let lastProblemSlug: string | null = null;
let currentProblemId: string | null = null;

export function getCurrentProblemId(): string | null {
  return currentProblemId;
}

function detectProblem(): void {
  if (!location.pathname.startsWith("/problems/")) {
    lastProblemSlug = null;
    currentProblemId = null;
    return;
  }

  const metadata = extractProblemMetadata();

  if (!metadata) {
    return;
  }

  // Assign problem ID immediately from URL slug (URL is synchronous & reliable)
  currentProblemId = `${metadata.platform}:${metadata.slug}`;

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

  console.log("Before PROBLEM_DETECTED");

  chrome.runtime.sendMessage(
    {
      type: MESSAGE_TYPES.PROBLEM_DETECTED,
      payload: metadata,
    },
    () => {
      console.log("PROBLEM_DETECTED callback");
      console.log("lastError:", chrome.runtime.lastError);
    }
  );

  console.log("After PROBLEM_DETECTED");
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