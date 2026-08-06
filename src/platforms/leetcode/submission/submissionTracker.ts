import { MESSAGE_TYPES } from "../../../shared/messages";
import { logger } from "../../../shared/utils/logger";
import { getCurrentProblemId, getCurrentProblemMetadata } from "../problemObserver";
import { attachSubmitListener, detachSubmitListener } from "./submitButtonListener";
import { extractVerdict } from "./verdictExtractor";

type SubmissionState = "idle" | "waiting" | "completed";

export interface SubmissionTracker {
  dispose(): void;
}

export function startSubmissionTracker(): SubmissionTracker {
  let state: SubmissionState = "idle";
  let activeSubmissionId: string | null = null;
  let pollingInterval: number | null = null;
  let pollingTimeout: number | null = null;

  function stopPolling(): void {
    if (pollingInterval !== null) {
      window.clearInterval(pollingInterval);
      pollingInterval = null;
    }

    if (pollingTimeout !== null) {
      window.clearTimeout(pollingTimeout);
      pollingTimeout = null;
    }

    state = "idle";
    activeSubmissionId = null;
  }

  function startPolling(): void {
    if (state === "waiting") {
      return;
    }

    state = "waiting";
    activeSubmissionId = crypto.randomUUID();

    pollingInterval = window.setInterval(() => {
      if (state !== "waiting") {
        stopPolling();
        return;
      }

      const verdict = extractVerdict();

      if (!verdict) {
        return;
      }

      const problemId = getCurrentProblemId();

      if (!problemId) {
        logger.warn("No active problem detected during submission");
        stopPolling();
        return;
      }

      const metadata = getCurrentProblemMetadata();
      const submissionId = activeSubmissionId ?? crypto.randomUUID();

      stopPolling();
      state = "completed";

      try {
        chrome.runtime.sendMessage({
          type: MESSAGE_TYPES.ATTEMPT_SUBMITTED,
          payload: {
            submissionId,
            problemId,
            verdict,
            metadata: metadata ?? undefined,
          },
        });
      } catch (error) {
        logger.error("Failed to dispatch ATTEMPT_SUBMITTED message:", error);
      } finally {
        state = "idle";
      }
    }, 200);

    // 30-second safety timeout
    pollingTimeout = window.setTimeout(() => {
      logger.warn("Submission polling timed out after 30 seconds");
      stopPolling();
    }, 30000);
  }

  function onSubmitClick(): void {
    if (state === "waiting") {
      return;
    }

    startPolling();
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

    stopPolling();
    detachSubmitListener();
    buttonObserver.disconnect();
  }

  return {
    dispose,
  };
}
