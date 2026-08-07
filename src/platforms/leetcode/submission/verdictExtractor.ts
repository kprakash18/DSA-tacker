import type { SubmissionVerdict } from "../../../shared/types";

const CONSOLE_RESULT_SELECTOR = '[data-e2e-locator="console-result"]';
const SUBMISSION_TAB_SELECTOR = "#submission-detail_tab";

export function getResultText(): string {
  const resultContainer =
    document.querySelector<HTMLElement>(SUBMISSION_TAB_SELECTOR) ??
    document.querySelector<HTMLElement>(CONSOLE_RESULT_SELECTOR);

  return resultContainer?.textContent?.trim() ?? "";
}

export function extractVerdict(): SubmissionVerdict | null {
  const text = getResultText();

  if (!text) {
    return null;
  }

  // If LeetCode is still judging, returning null avoids premature detection
  if (
    text.includes("Pending") ||
    text.includes("Judging") ||
    text.includes("Running")
  ) {
    return null;
  }

  if (text.includes("Accepted")) {
    return "accepted";
  }

  if (
    text.includes("Wrong Answer") ||
    text.includes("Compile Error") ||
    text.includes("Compilation Error") ||
    text.includes("Runtime Error") ||
    text.includes("Time Limit Exceeded") ||
    text.includes("Memory Limit Exceeded")
  ) {
    return "failed";
  }

  return null;
}
