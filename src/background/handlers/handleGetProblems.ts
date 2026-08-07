import { problemRepository } from "../../storage/ProblemRepository";
import type { Problem } from "../../shared/types";

export async function handleGetProblems(): Promise<Problem[]> {
  return await problemRepository.getAll();
}
