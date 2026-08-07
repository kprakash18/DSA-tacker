import { MESSAGE_TYPES } from "../../shared/messages";
import type { Problem } from "../../shared/types";

export async function getProblems(): Promise<Problem[]> {
  const problems = await chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.GET_PROBLEMS,
  });
  return problems ?? [];
}
