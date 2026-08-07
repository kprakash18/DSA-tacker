import { MESSAGE_TYPES } from "../shared/messages";
import type { RuntimeMessage } from "../shared/types";
import { handleProblemDetected } from "./handlers/handleProblemDetected";
import { handleAttemptSubmitted } from "./handlers/handleAttemptSubmitted";
import { handleGetProblems } from "./handlers/handleGetProblems";
import { logger } from "../shared/utils/logger";

logger.info("Problem Tracker Background Started");

chrome.runtime.onMessage.addListener((message: RuntimeMessage, _sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        case MESSAGE_TYPES.GET_PROBLEMS: {
          const problems = await handleGetProblems();
          sendResponse(problems);
          break;
        }

        case MESSAGE_TYPES.PROBLEM_DETECTED:
          await handleProblemDetected(message.payload);
          sendResponse();
          break;

        case MESSAGE_TYPES.ATTEMPT_SUBMITTED:
          await handleAttemptSubmitted(message.payload);
          sendResponse();
          break;

        default:
          logger.warn("Unknown message:", (message as { type: string }).type);
          sendResponse();
          break;
      }
    } catch (error) {
      logger.error("Error handling message:", error);
      sendResponse({ error: (error as Error).message });
    }
  })();

  return true;
});
