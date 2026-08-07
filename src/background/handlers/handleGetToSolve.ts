import { toSolveRepository } from "../../storage/ToSolveRepository";
import type { ToSolveProblem } from "../../shared/types";

export async function handleGetToSolve(): Promise<ToSolveProblem[]> {
  return await toSolveRepository.getAll();
}
