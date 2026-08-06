import { MESSAGE_TYPES } from "../../shared/messages";
import type { SubmissionVerdict } from "../../shared/types";
import { getCurrentProblemId } from "./observer";

const SUBMIT_BUTTON_SELECTOR =
  '[data-e2e-locator="console-submit-button"]';

const SUBMISSION_TAB_SELECTOR = "#submission-detail_tab";

let currentSubmitButton: HTMLButtonElement | null = null;

let pollingInterval: number | null = null;
let pollingTimeout: number | null = null;

function startVerdictPolling(): void {
  // Already polling
  if (pollingInterval !== null) {
    return;
  }

  console.log("Started verdict polling");

  pollingInterval = window.setInterval(() => {
    const verdict = extractSubmissionVerdict();

    if (!verdict) {
      return;
    }

    const problemId = getCurrentProblemId();

    if (!problemId) {
      console.warn("No active problem");
      stopVerdictPolling();
      return;
    }

    stopVerdictPolling();

    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.ATTEMPT_SUBMITTED,
      payload: {
        problemId,
        verdict,
      },
    });
  }, 200);

  // Safety timeout (30 seconds)
  pollingTimeout = window.setTimeout(() => {
    console.log("Submission polling timed out");

    stopVerdictPolling();
  }, 30000);
}

function stopVerdictPolling(): void {
  if (pollingInterval !== null) {
    window.clearInterval(pollingInterval);
    pollingInterval = null;
  }

  if (pollingTimeout !== null) {
    window.clearTimeout(pollingTimeout);
    pollingTimeout = null;
  }
}

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
    console.log("Submit button clicked");

    startVerdictPolling();
  });
}

export function extractSubmissionVerdict(): SubmissionVerdict | null {
  const submissionTab = document.querySelector<HTMLElement>(
    SUBMISSION_TAB_SELECTOR
  );

  if (!submissionTab) {
    return null;
  }

  const text = submissionTab.textContent ?? "";

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