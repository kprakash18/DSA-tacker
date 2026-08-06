import { extractProblemMetadata } from "./extractor";
import { MESSAGE_TYPES } from "../../shared/messages";

const metadata = extractProblemMetadata();

if (!metadata) {
  console.warn("No problem detected.");
} else {
  chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.PROBLEM_DETECTED,
    payload: metadata,
  });

  console.log("Problem sent:", metadata);
}
