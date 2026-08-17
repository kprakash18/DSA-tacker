import { MESSAGE_TYPES } from "../shared/messages";
import type { RuntimeMessage, Problem, Platform, ProblemDetectedPayload, AttemptSubmittedPayload } from "../shared/types";
import { problemRepository } from "../storage/ProblemRepository";
import { toSolveRepository } from "../storage/ToSolveRepository";
import { initTabIconManager } from "./iconManager";
import { logger } from "../shared/utils/logger";

logger.info("Problem Tracker Background Started");
if (chrome.storage?.session?.setAccessLevel) {
  chrome.storage.session.setAccessLevel({ accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS" }).catch(() => {});
}
initTabIconManager();

async function handleProblemDetected(payload: ProblemDetectedPayload): Promise<void> {
  const problemId = `${payload.platform}:${payload.slug}`;
  await chrome.storage.session.set({
    activeProblem: payload,
    [problemId]: payload,
  });
  const existing = await problemRepository.findById(problemId);
  if (existing) {
    await problemRepository.updateLastOpened(problemId);
  }
}

async function handleAttemptSubmitted(payload: AttemptSubmittedPayload): Promise<void> {
  if (!payload?.problemId || !payload?.verdict) return;

  try {
    const existing = await problemRepository.findById(payload.problemId);
    if (!existing) {
      let metadata = payload.metadata ?? null;
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

    if (await toSolveRepository.exists(payload.problemId)) {
      await toSolveRepository.remove(payload.problemId);
    }
  } catch (error) {
    logger.error("Failed to record submission attempt:", error);
  }
}

chrome.runtime.onMessage.addListener((message: RuntimeMessage, _sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        case MESSAGE_TYPES.GET_PROBLEMS:
          sendResponse(await problemRepository.getAll());
          break;

        case MESSAGE_TYPES.GET_STATISTICS:
          sendResponse(await problemRepository.getStatistics());
          break;

        case MESSAGE_TYPES.GET_TO_SOLVE:
          sendResponse(await toSolveRepository.getAll());
          break;

        case MESSAGE_TYPES.ADD_TO_SOLVE:
          await toSolveRepository.add({
            id: `${message.payload.platform}:${message.payload.slug}`,
            ...message.payload,
            createdAt: Date.now(),
          });
          sendResponse();
          break;

        case MESSAGE_TYPES.REMOVE_FROM_TO_SOLVE:
          await toSolveRepository.remove(message.payload.problemId);
          sendResponse();
          break;

        case MESSAGE_TYPES.GET_CURRENT_PROBLEM: {
          const session = await chrome.storage.session.get("activeProblem");
          sendResponse((session.activeProblem as ProblemDetectedPayload) ?? null);
          break;
        }

        case MESSAGE_TYPES.PROBLEM_DETECTED:
          await handleProblemDetected(message.payload);
          sendResponse();
          break;

        case MESSAGE_TYPES.ATTEMPT_SUBMITTED:
          await handleAttemptSubmitted(message.payload);
          sendResponse();
          break;

        default:
          sendResponse();
          break;
      }
    } catch (error) {
      logger.error("Error handling message:", error);
      sendResponse({ error: (error as Error).message });
    }
  })();

  return true;
});
