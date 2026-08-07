import { problemRepository } from "../../storage/ProblemRepository";

export async function handleGetStatistics() {
  return await problemRepository.getStatistics();
}
