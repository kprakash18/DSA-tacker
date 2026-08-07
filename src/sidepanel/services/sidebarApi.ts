import { MESSAGE_TYPES } from "../../shared/messages";
import type { AddToSolvePayload, Problem, ProblemDetectedPayload, ToSolveProblem } from "../../shared/types";

export interface ProblemStatistics {
  total: number;
  solved: number;
  attempted: number;
}

export async function getProblems(): Promise<Problem[]> {
  const problems = await chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.GET_PROBLEMS,
  });
  return problems ?? [];
}

export async function getStatistics(): Promise<ProblemStatistics> {
  const stats = await chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.GET_STATISTICS,
  });
  return stats ?? { total: 0, solved: 0, attempted: 0 };
}

export async function getToSolve(): Promise<ToSolveProblem[]> {
  const list = await chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.GET_TO_SOLVE,
  });
  return list ?? [];
}

export async function addToSolve(payload: AddToSolvePayload): Promise<void> {
  await chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.ADD_TO_SOLVE,
    payload,
  });
}

export async function removeFromToSolve(problemId: string): Promise<void> {
  await chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.REMOVE_FROM_TO_SOLVE,
    payload: { problemId },
  });
}

export async function getCurrentProblem(): Promise<ProblemDetectedPayload | null> {
  const current = await chrome.runtime.sendMessage({
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
