import { toSolveRepository } from "../../storage/ToSolveRepository";
import type { RemoveFromToSolvePayload } from "../../shared/types";

export async function handleRemoveFromToSolve(payload: RemoveFromToSolvePayload): Promise<void> {
  await toSolveRepository.remove(payload.problemId);
}
