import { toSolveRepository } from "../../storage/ToSolveRepository";
import type { AddToSolvePayload, ToSolveProblem } from "../../shared/types";

export async function handleAddToSolve(payload: AddToSolvePayload): Promise<void> {
  const id = `${payload.platform}:${payload.slug}`;
  const problem: ToSolveProblem = {
    id,
    platform: payload.platform,
    slug: payload.slug,
    title: payload.title,
    difficulty: payload.difficulty,
    url: payload.url,
    tags: payload.tags,
    createdAt: Date.now(),
  };
  await toSolveRepository.add(problem);
}
