import type { ProblemDetectedPayload } from "../../shared/types";

export async function handleGetCurrentProblem(): Promise<ProblemDetectedPayload | null> {
  const session = await chrome.storage.session.get("activeProblem");
  return (session.activeProblem as ProblemDetectedPayload) ?? null;
}
