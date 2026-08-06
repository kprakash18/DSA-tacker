import { extractProblemMetadata } from "./extractor";
import { MESSAGE_TYPES } from "../../shared/messages";

import {
  attachSubmitListener,
  extractSubmissionVerdict,
  isSubmissionPending,
  clearSubmissionPending,
} from "./submission";

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

function detectSubmission(): void {
  // Always make sure the submit button has a listener
  attachSubmitListener();

  // User has not  clicked submit button
  if (!isSubmissionPending()) {
    return;
  }

  const verdict = extractSubmissionVerdict();

  if (!verdict) {
    return;
  }

  console.log("Submission verdict:", verdict);

  clearSubmissionPending();
}

export function startProblemObserver() {
  detectProblem();
  detectSubmission();

  let timeoutId: number | undefined;

  const observer = new MutationObserver(() => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      detectProblem();
      detectSubmission();
    }, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}