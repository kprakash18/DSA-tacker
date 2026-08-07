import { MESSAGE_TYPES } from "../shared/messages";
import type { RuntimeMessage } from "../shared/types";
import { handleProblemDetected } from "./handlers/handleProblemDetected";
import { handleAttemptSubmitted } from "./handlers/handleAttemptSubmitted";
import { handleGetProblems } from "./handlers/handleGetProblems";
import { handleGetStatistics } from "./handlers/handleGetStatistics";
import { handleAddToSolve } from "./handlers/handleAddToSolve";
import { handleRemoveFromToSolve } from "./handlers/handleRemoveFromToSolve";
import { handleGetToSolve } from "./handlers/handleGetToSolve";
import { handleGetCurrentProblem } from "./handlers/handleGetCurrentProblem";
import { initTabIconManager } from "./iconManager";
import { logger } from "../shared/utils/logger";

logger.info("Problem Tracker Background Started");
initTabIconManager();

chrome.runtime.onMessage.addListener((message: RuntimeMessage, _sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        case MESSAGE_TYPES.GET_PROBLEMS: {
          const problems = await handleGetProblems();
          sendResponse(problems);
          break;
        }

        case MESSAGE_TYPES.GET_STATISTICS: {
          const stats = await handleGetStatistics();
          sendResponse(stats);
          break;
        }

        case MESSAGE_TYPES.GET_TO_SOLVE: {
          const list = await handleGetToSolve();
          sendResponse(list);
          break;
        }

        case MESSAGE_TYPES.ADD_TO_SOLVE:
          await handleAddToSolve(message.payload);
          sendResponse();
          break;

        case MESSAGE_TYPES.REMOVE_FROM_TO_SOLVE:
          await handleRemoveFromToSolve(message.payload);
          sendResponse();
          break;

        case MESSAGE_TYPES.GET_CURRENT_PROBLEM: {
          const current = await handleGetCurrentProblem();
          sendResponse(current);
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
