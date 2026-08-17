import { STORAGE_KEYS } from "../shared/constants/storageKeys";
import type { Problem, ProblemStore } from "../shared/types";
import { logger } from "../shared/utils/logger";

export const problemRepository = {
  async findAll(): Promise<ProblemStore> {
    const res = await chrome.storage.local.get(STORAGE_KEYS.PROBLEMS);
    return (res[STORAGE_KEYS.PROBLEMS] as ProblemStore) ?? {};
  },

  async getAll(): Promise<Problem[]> {
    const problems = await this.findAll();
    return (Object.values(problems) as Problem[]).filter(
      (p) => p.attempts > 0 && Boolean(p.status)
    );
  },

  async getStatistics(): Promise<{ total: number; solved: number; attempted: number }> {
    const problems = await this.getAll();
    let solved = 0;
    let attempted = 0;

    for (const problem of problems) {
      if (problem.status === "solved") {
        solved += 1;
      } else if (problem.status === "attempted") {
        attempted += 1;
      }
    }

    return {
      total: problems.length,
      solved,
      attempted,
    };
  },

  async findById(problemId: string): Promise<Problem | null> {
    const problems = await this.findAll();
    return problems[problemId] ?? null;
  },

  async save(problem: Problem): Promise<void> {
    const problems = await this.findAll();
    problems[problem.id] = problem;
    await chrome.storage.local.set({ [STORAGE_KEYS.PROBLEMS]: problems });
  },

  async updateAttempt(
    problemId: string,
    verdict: "accepted" | "failed"
  ): Promise<void> {
    const problem = await this.findById(problemId);
    if (!problem) {
      logger.warn("Cannot update attempt: Problem not found", problemId);
      return;
    }

    const now = Date.now();
    problem.attempts += 1;
    problem.lastAttemptAt = now;

    if (verdict === "accepted") {
      problem.status = "solved";
      if (!problem.solvedAt) {
        problem.solvedAt = now;
      }
    } else if (verdict === "failed" && problem.status !== "solved") {
      problem.status = "attempted";
    }

    await this.save(problem);
  },

  async updateLastOpened(problemId: string): Promise<void> {
    const problem = await this.findById(problemId);
    if (problem) {
      problem.lastOpenedAt = Date.now();
      await this.save(problem);
    }
  },
};