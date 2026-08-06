import { MESSAGE_TYPES } from "../shared/messages";
import type { RuntimeMessage } from "../shared/types";
import { handleProblemDetected } from "./handlers/handleProblemDetected";
import { handleAttemptSubmitted } from "./handlers/handleAttemptSubmitted";
import { logger } from "../shared/utils/logger";

logger.info("Problem Tracker Background Started");

chrome.runtime.onMessage.addListener(async (message: RuntimeMessage) => {
  switch (message.type) {
    case MESSAGE_TYPES.PROBLEM_DETECTED:
      await handleProblemDetected(message.payload);
      break;

    case MESSAGE_TYPES.ATTEMPT_SUBMITTED:
      await handleAttemptSubmitted(message.payload);
      break;

    default:
      logger.warn("Unknown message:", message.type);
  }
});
