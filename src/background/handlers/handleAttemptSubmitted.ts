import { problemRepository } from "../../storage/ProblemRepository";

import type {
  AttemptSubmittedPayload,
  Platform,
  Problem,
  ProblemDetectedPayload,
} from "../../shared/types";
import { logger } from "../../shared/utils/logger";

export async function handleAttemptSubmitted(
  payload: AttemptSubmittedPayload
): Promise<void> {
  if (!payload || !payload.problemId || !payload.verdict) {
    logger.warn("Invalid ATTEMPT_SUBMITTED payload received:", payload);
    return;
  }

  try {
    const existingProblem = await problemRepository.findById(payload.problemId);

    if (!existingProblem) {
      // Retrieve metadata fallback from payload or chrome.storage.session
      let metadata: ProblemDetectedPayload | null = payload.metadata ?? null;

      if (!metadata) {
        const sessionStore = await chrome.storage.session.get(payload.problemId);
        metadata = (sessionStore[payload.problemId] as ProblemDetectedPayload) ?? null;
      }

      const now = Date.now();
      const parts = payload.problemId.split(":");
      const platform = (metadata?.platform ?? parts[0] ?? "leetcode") as Platform;
      const slug = metadata?.slug ?? parts[1] ?? "";

      const newProblem: Problem = {
        id: payload.problemId,
        platform,
        slug,
        title: metadata?.title ?? slug,
        url: metadata?.url ?? `https://leetcode.com/problems/${slug}/`,
        difficulty: metadata?.difficulty ?? "unknown",
        tags: metadata?.tags ?? [],
        status: "open",
        attempts: 0,
        firstSeenAt: now,
        lastOpenedAt: now,
        lastAttemptAt: null,
        notes: "",
      };

      await problemRepository.save(newProblem);
    }

    await problemRepository.updateAttempt(payload.problemId, payload.verdict);
    logger.info("Submission recorded:", {
      problemId: payload.problemId,
      verdict: payload.verdict,
    });
  } catch (error) {
    logger.error("Failed to process submission attempt:", error);
  }
}
