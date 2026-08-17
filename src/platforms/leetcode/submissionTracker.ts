import { MESSAGE_TYPES } from "../../shared/constants";
import type { SubmissionVerdict } from "../../shared/types";
import { logger, safeSendMessage } from "../../shared/utils";
import { getCurrentProblemId, getCurrentProblemMetadata } from "./problemObserver";

const SUBMIT_BUTTON_SELECTOR = '[data-e2e-locator="console-submit-button"]';
const CONSOLE_RESULT_SELECTOR = '[data-e2e-locator="console-result"]';
const SUBMISSION_TAB_SELECTOR = "#submission-detail_tab";

function getResultText(): string {
  const el =
    document.querySelector<HTMLElement>(SUBMISSION_TAB_SELECTOR) ??
    document.querySelector<HTMLElement>(CONSOLE_RESULT_SELECTOR);
  return el?.textContent?.trim() ?? "";
}

function extractVerdict(): SubmissionVerdict | null {
  const text = getResultText();
  if (!text || text.includes("Pending") || text.includes("Judging") || text.includes("Running")) {
    return null;
  }
  if (text.includes("Accepted")) return "accepted";
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

export function startSubmissionTracker() {
  let waitingForVerdict = false;
  let initialResultText = "";
  let isJudgingStarted = false;
  let activeSubmissionId: string | null = null;
  let pollingInterval: number | null = null;
  let pollingTimeout: number | null = null;

  function stopWaiting(): void {
    if (pollingInterval !== null) {
      window.clearInterval(pollingInterval);
      pollingInterval = null;
    }
    if (pollingTimeout !== null) {
      window.clearTimeout(pollingTimeout);
      pollingTimeout = null;
    }
    waitingForVerdict = false;
    isJudgingStarted = false;
    activeSubmissionId = null;
  }

  function checkVerdict(): void {
    if (!waitingForVerdict) return;

    const currentText = getResultText();
    if (
      !isJudgingStarted &&
      (currentText !== initialResultText ||
        currentText.includes("Pending") ||
        currentText.includes("Judging") ||
        currentText === "")
    ) {
      isJudgingStarted = true;
    }

    if (!isJudgingStarted) return;

    const verdict = extractVerdict();
    if (!verdict) return;

    const problemId = getCurrentProblemId();
    if (!problemId) {
      logger.warn("No active problem detected when verdict arrived");
      stopWaiting();
      return;
    }

    const metadata = getCurrentProblemMetadata();
    const submissionId = activeSubmissionId ?? crypto.randomUUID();
    stopWaiting();

    safeSendMessage({
      type: MESSAGE_TYPES.ATTEMPT_SUBMITTED,
      payload: {
        submissionId,
        problemId,
        verdict,
        metadata: metadata ?? undefined,
      },
    });
    logger.info(`Attempt submitted with verdict: ${verdict} for: ${problemId}`);
  }

  function onSubmitClick(): void {
    if (waitingForVerdict) return;
    waitingForVerdict = true;
    isJudgingStarted = false;
    initialResultText = getResultText();
    activeSubmissionId = crypto.randomUUID();

    pollingInterval = window.setInterval(checkVerdict, 200);
    pollingTimeout = window.setTimeout(() => {
      logger.warn("Submission verdict polling timed out");
      stopWaiting();
    }, 30000);
  }

  let currentSubmitBtn: HTMLButtonElement | null = null;
  let clickListener: (() => void) | null = null;
  let keydownListener: ((e: KeyboardEvent) => void) | null = null;

  function attachListeners() {
    const btn = document.querySelector<HTMLButtonElement>(SUBMIT_BUTTON_SELECTOR);
    if (btn && btn !== currentSubmitBtn) {
      if (currentSubmitBtn && clickListener) currentSubmitBtn.removeEventListener("click", clickListener);
      currentSubmitBtn = btn;
      clickListener = onSubmitClick;
      btn.addEventListener("click", clickListener);
    }

    if (!keydownListener) {
      keydownListener = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && location.pathname.startsWith("/problems/")) {
          onSubmitClick();
        }
      };
      window.addEventListener("keydown", keydownListener, true);
    }
  }

  attachListeners();

  const buttonObserver = new MutationObserver(attachListeners);
  const container = document.querySelector("#qd-content") || document.body;
  if (container) {
    buttonObserver.observe(container, { childList: true, subtree: true });
  }

  return () => {
    stopWaiting();
    if (currentSubmitBtn && clickListener) currentSubmitBtn.removeEventListener("click", clickListener);
    if (keydownListener) window.removeEventListener("keydown", keydownListener, true);
    buttonObserver.disconnect();
  };
}
