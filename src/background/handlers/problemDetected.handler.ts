import { problemRepository } from "../../storage/ProblemRepository";

import type { ProblemDetectedPayload } from "../../shared/types";

export async function handleProblemDetected(
  payload: ProblemDetectedPayload
): Promise<void> {
  const problemId = `${payload.platform}:${payload.slug}`;

  // Cache detected metadata in session storage for service worker hibernation survival
  await chrome.storage.session.set({
    [problemId]: payload,
  });

  const existingProblem = await problemRepository.findById(problemId);

  if (existingProblem) {
    await problemRepository.updateLastOpened(problemId);
  }
}