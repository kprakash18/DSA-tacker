import { MESSAGE_TYPES } from "../shared/messages";

import type { RuntimeMessage } from "../shared/types";

import { handleProblemDetected } from "./handlers/problemDetected.handler";
import { handleAttemptSubmitted } from "./handlers/attemptSubmitted.handler";

console.log("Problem Tracker Background Started");

chrome.runtime.onMessage.addListener(async (message: RuntimeMessage) => {
  switch (message.type) {
    case MESSAGE_TYPES.PROBLEM_DETECTED:
      await handleProblemDetected(message.payload);
      break;

    case MESSAGE_TYPES.ATTEMPT_SUBMITTED:
      await handleAttemptSubmitted(message.payload);
      break;

    default:
      console.warn("Unknown message:", message.type);
  }
});
