import { problemRepository } from "../../storage/ProblemRepository";

import type { AttemptSubmittedPayload } from "../../shared/types";

export async function handleAttemptSubmitted(
  payload: AttemptSubmittedPayload
): Promise<void> {
  if (!payload || !payload.problemId || !payload.verdict) {
    console.warn("Invalid ATTEMPT_SUBMITTED payload received:", payload);
    return;
  }

  try {
    await problemRepository.updateAttempt(payload.problemId, payload.verdict);
    console.log("Updated submission attempt:", payload.problemId, payload.verdict);
  } catch (error) {
    console.error("Failed to process submission attempt:", error);
  }
}
