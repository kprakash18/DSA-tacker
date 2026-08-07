import { problemRepository } from "../../storage/ProblemRepository";
import { toSolveRepository } from "../../storage/ToSolveRepository";

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

      const isAccepted = payload.verdict === "accepted";
      const newProblem: Problem = {
        id: payload.problemId,
        platform,
        slug,
        title: metadata?.title ?? slug,
        url: metadata?.url ?? `https://leetcode.com/problems/${slug}/`,
        difficulty: metadata?.difficulty ?? "unknown",
        tags: metadata?.tags ?? [],
        status: isAccepted ? "solved" : "attempted",
        attempts: 1,
        firstSeenAt: now,
        lastOpenedAt: now,
        lastAttemptAt: now,
        solvedAt: isAccepted ? now : null,
        notes: "",
      };

      await problemRepository.save(newProblem);
    } else {
      await problemRepository.updateAttempt(payload.problemId, payload.verdict);
    }

    // M7.6: Automatic Transition — Remove from To Solve list once attempted/solved
    if (await toSolveRepository.exists(payload.problemId)) {
      await toSolveRepository.remove(payload.problemId);
      logger.info("Automatically removed from To Solve bookmark list:", payload.problemId);
    }

    logger.info("Submission recorded:", {
      problemId: payload.problemId,
      verdict: payload.verdict,
    });
  } catch (error) {
    logger.error("Failed to process submission attempt:", error);
  }
}
