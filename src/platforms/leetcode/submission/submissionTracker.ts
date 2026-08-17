import { MESSAGE_TYPES } from "../../../shared/messages";
import { logger } from "../../../shared/utils/logger";
import { safeSendMessage } from "../../../shared/utils/safeSendMessage";
import { getCurrentProblemId, getCurrentProblemMetadata } from "../problemObserver";
import { attachSubmitListener, detachSubmitListener } from "./submitButtonListener";
import { extractVerdict, getResultText } from "./verdictExtractor";

export interface SubmissionTracker {
  dispose(): void;
}

export function startSubmissionTracker(): SubmissionTracker {
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
    if (!chrome.runtime?.id) {
      dispose();
      return;
    }

    if (!waitingForVerdict) {
      return;
    }

    const currentText = getResultText();

    // Mark judging as started if text clears, changes, or displays pending state
    if (
      !isJudgingStarted &&
      (currentText !== initialResultText ||
        currentText.includes("Pending") ||
        currentText.includes("Judging") ||
        currentText === "")
    ) {
      isJudgingStarted = true;
    }

    // Do not attempt extraction until judging has actually started to avoid stale old verdicts
    if (!isJudgingStarted) {
      return;
    }

    const verdict = extractVerdict();

    if (!verdict) {
      return;
    }

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
    logger.info(`Attempt submitted successfully with verdict: ${verdict} for problem: ${problemId}`);
  }

  function onSubmitClick(): void {
    if (waitingForVerdict) {
      return;
    }

    waitingForVerdict = true;
    isJudgingStarted = false;
    initialResultText = getResultText();
    activeSubmissionId = crypto.randomUUID();

    // Poll every 200ms to detect judge completion
    pollingInterval = window.setInterval(checkVerdict, 200);

    // 30-second safety timeout
    pollingTimeout = window.setTimeout(() => {
      logger.warn("Submission verdict polling timed out after 30 seconds");
      stopWaiting();
    }, 30000);
  }

  // Attach submit listener initially
  attachSubmitListener(onSubmitClick);

  let retryTimeout: number | null = null;

  // Targeted MutationObserver to re-bind if React replaces the submit button node
  const buttonObserver = new MutationObserver(() => {
    attachSubmitListener(onSubmitClick);
  });

  function observeSubmitContainer(): void {
    attachSubmitListener(onSubmitClick);

    const submitBtn = document.querySelector('[data-e2e-locator="console-submit-button"]');
    const container = submitBtn?.parentElement ?? document.querySelector("#qd-content");

    if (!container) {
      retryTimeout = window.setTimeout(observeSubmitContainer, 500);
      return;
    }

    buttonObserver.observe(container, {
      childList: true,
      subtree: true,
    });
  }

  observeSubmitContainer();

  function dispose(): void {
    if (retryTimeout !== null) {
      window.clearTimeout(retryTimeout);
      retryTimeout = null;
    }

    stopWaiting();
    detachSubmitListener();
    buttonObserver.disconnect();
  }

  return {
    dispose,
  };
}
