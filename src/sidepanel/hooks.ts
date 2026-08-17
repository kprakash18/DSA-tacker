import { useEffect, useState } from "react";
import type { AddToSolvePayload, Problem, ProblemDetectedPayload, ToSolveProblem } from "../shared/types";
import { MESSAGE_TYPES, STORAGE_KEYS } from "../shared/constants";
import { safeSendMessage } from "../shared/utils";

export async function getProblems(): Promise<Problem[]> {
  const problems = await safeSendMessage<Problem[]>({ type: MESSAGE_TYPES.GET_PROBLEMS });
  return problems ?? [];
}

export async function getToSolve(): Promise<ToSolveProblem[]> {
  const list = await safeSendMessage<ToSolveProblem[]>({ type: MESSAGE_TYPES.GET_TO_SOLVE });
  return list ?? [];
}

export async function addToSolve(payload: AddToSolvePayload): Promise<void> {
  await safeSendMessage({ type: MESSAGE_TYPES.ADD_TO_SOLVE, payload });
}

export async function removeFromToSolve(problemId: string): Promise<void> {
  await safeSendMessage({ type: MESSAGE_TYPES.REMOVE_FROM_TO_SOLVE, payload: { problemId } });
}

export async function getCurrentProblem(): Promise<ProblemDetectedPayload | null> {
  const current = await safeSendMessage<ProblemDetectedPayload>({ type: MESSAGE_TYPES.GET_CURRENT_PROBLEM });
  return current ?? null;
}

export async function openProblemTab(url: string): Promise<void> {
  if (!url) return;
  try {
    const tabs = await chrome.tabs.query({});
    const existingTab = tabs.find((t) => t.url && t.url.includes(url));
    if (existingTab?.id) {
      await chrome.tabs.update(existingTab.id, { active: true });
      if (existingTab.windowId) await chrome.windows.update(existingTab.windowId, { focused: true });
    } else {
      await chrome.tabs.create({ url });
    }
  } catch {
    window.open(url, "_blank");
  }
}

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetch = () => getProblems().then((d) => isMounted && setProblems(d));
    fetch();

    const onChange = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
      if ((area === "local" || !area) && changes[STORAGE_KEYS.PROBLEMS]) fetch();
    };

    chrome.storage.onChanged.addListener(onChange);
    return () => {
      isMounted = false;
      chrome.storage.onChanged.removeListener(onChange);
    };
  }, []);

  return { problems };
}

export function useCurrentProblem() {
  const [currentProblem, setCurrentProblem] = useState<ProblemDetectedPayload | null>(null);

  useEffect(() => {
    let isMounted = true;
    getCurrentProblem().then((d) => isMounted && setCurrentProblem(d));

    const onChange = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
      if ((area === "session" || area === "local" || !area) && changes.activeProblem && isMounted) {
        setCurrentProblem((changes.activeProblem.newValue as ProblemDetectedPayload) ?? null);
      }
    };

    chrome.storage.onChanged.addListener(onChange);
    return () => {
      isMounted = false;
      chrome.storage.onChanged.removeListener(onChange);
    };
  }, []);

  return { currentProblem };
}

export function useToSolve() {
  const [toSolveList, setToSolveList] = useState<ToSolveProblem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetch = () => getToSolve().then((d) => isMounted && setToSolveList(d));
    fetch();

    const onChange = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
      if ((area === "local" || !area) && changes[STORAGE_KEYS.TO_SOLVE]) fetch();
    };

    chrome.storage.onChanged.addListener(onChange);
    return () => {
      isMounted = false;
      chrome.storage.onChanged.removeListener(onChange);
    };
  }, []);

  return { toSolveList, add: addToSolve, remove: removeFromToSolve };
}
