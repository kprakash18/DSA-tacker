import { MESSAGE_TYPES } from "../shared/messages";

import type { RuntimeMessage } from "../shared/types";

import { handleProblemDetected } from "./handlers/problemDetected.handler";

console.log("Problem Tracker Background Started");

chrome.runtime.onMessage.addListener(async (message: RuntimeMessage) => {
  switch (message.type) {
    case MESSAGE_TYPES.PROBLEM_DETECTED:
      await handleProblemDetected(message.payload);
      break;

    default:
      console.warn("Unknown message:", message.type);
  }
});
