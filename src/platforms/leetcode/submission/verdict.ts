import type { SubmissionVerdict } from "../../../shared/types";

const CONSOLE_RESULT_SELECTOR = '[data-e2e-locator="console-result"]';
const SUBMISSION_TAB_SELECTOR = "#submission-detail_tab";

export function extractVerdict(): SubmissionVerdict | null {
  const resultContainer =
    document.querySelector<HTMLElement>(SUBMISSION_TAB_SELECTOR) ??
    document.querySelector<HTMLElement>(CONSOLE_RESULT_SELECTOR);

  if (!resultContainer) {
    return null;
  }

  const text = resultContainer.textContent?.trim() ?? "";

  if (!text) {
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
