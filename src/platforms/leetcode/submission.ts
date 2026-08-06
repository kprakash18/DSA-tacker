import type { SubmissionVerdict } from "../../shared/types";

const SUBMIT_BUTTON_SELECTOR = '[data-e2e-locator="console-submit-button"]';

const SUBMISSION_RESULT_SELECTOR = '[data-e2e-locator="submission-result"]';

let currentSubmitButton: HTMLButtonElement | null = null;
let submissionStarted = false;

export function attachSubmitListener(): void {
  const submitButton = document.querySelector<HTMLButtonElement>(
    SUBMIT_BUTTON_SELECTOR
  );

  if (!submitButton) {
    return;
  }

  if (submitButton === currentSubmitButton) {
    return;
  }

  currentSubmitButton = submitButton;

  submitButton.addEventListener("click", () => {
    submissionStarted = true;

    console.log("Submit button clicked");
  });
}
export function isSubmissionPending(): boolean {
  return submissionStarted;
}

export function clearSubmissionPending(): void {
  submissionStarted = false;
}

export function extractSubmissionVerdict(): SubmissionVerdict | null {
  if (!submissionStarted) {
    return null;
  }

  const result = document.querySelector<HTMLElement>(
    SUBMISSION_RESULT_SELECTOR
  );

  if (!result) {
    return null;
  }

  const verdict = result.textContent?.trim();

  switch (verdict) {
    case "Accepted":
      return "accepted";

    case "Wrong Answer":
    case "Runtime Error":
    case "Time Limit Exceeded":
    case "Memory Limit Exceeded":
    case "Compilation Error":
      return "failed";

    default:
      return null;
  }
}