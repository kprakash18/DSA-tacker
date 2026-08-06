import { problemRepository } from "../../storage/ProblemRepository";

import type {
  Problem,
  ProblemDetectedPayload,
} from "../../shared/types";

export async function handleProblemDetected(
  payload: ProblemDetectedPayload
): Promise<void> {
  const problemId = `${payload.platform}:${payload.slug}`;

  const existingProblem = await problemRepository.findById(problemId);

  if (existingProblem) {
    await problemRepository.updateLastOpened(problemId);

    console.log("Updated existing problem:", problemId);
    return;
  }

  const now = Date.now();

  const problem: Problem = {
    id: problemId,

    platform: payload.platform,
    slug: payload.slug,

    title: payload.title,
    url: payload.url,

    difficulty: payload.difficulty,
    tags: payload.tags,

    status: "open",
    attempts: 0,

    firstSeenAt: now,
    lastOpenedAt: now,
    lastAttemptAt: null,

    notes: "",
  };

  await problemRepository.save(problem);

  console.log("Saved new problem:", problemId);
}