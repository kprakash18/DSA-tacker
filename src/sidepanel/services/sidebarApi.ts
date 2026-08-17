import { MESSAGE_TYPES } from "../../shared/messages";
import type { AddToSolvePayload, Problem, ProblemDetectedPayload, ToSolveProblem } from "../../shared/types";
import { safeSendMessage } from "../../shared/utils/safeSendMessage";

export async function getProblems(): Promise<Problem[]> {
  const problems = await safeSendMessage<Problem[]>({
    type: MESSAGE_TYPES.GET_PROBLEMS,
  });
  return problems ?? [];
}

export async function getToSolve(): Promise<ToSolveProblem[]> {
  const list = await safeSendMessage<ToSolveProblem[]>({
    type: MESSAGE_TYPES.GET_TO_SOLVE,
  });
  return list ?? [];
}

export async function addToSolve(payload: AddToSolvePayload): Promise<void> {
  await safeSendMessage({
    type: MESSAGE_TYPES.ADD_TO_SOLVE,
    payload,
  });
}

export async function removeFromToSolve(problemId: string): Promise<void> {
  await safeSendMessage({
    type: MESSAGE_TYPES.REMOVE_FROM_TO_SOLVE,
    payload: { problemId },
  });
}

export async function getCurrentProblem(): Promise<ProblemDetectedPayload | null> {
  const current = await safeSendMessage<ProblemDetectedPayload>({
    type: MESSAGE_TYPES.GET_CURRENT_PROBLEM,
  });
  return current ?? null;
}

export async function openProblemTab(url: string): Promise<void> {
  if (!url) return;
  try {
    const tabs = await chrome.tabs.query({});
    const existingTab = tabs.find((t) => t.url && t.url.includes(url));
    if (existingTab && existingTab.id) {
      await chrome.tabs.update(existingTab.id, { active: true });
      if (existingTab.windowId) {
        await chrome.windows.update(existingTab.windowId, { focused: true });
      }
    } else {
      await chrome.tabs.create({ url });
    }
  } catch (error) {
    console.error("Failed to navigate/focus tab:", error);
    window.open(url, "_blank");
  }
}
