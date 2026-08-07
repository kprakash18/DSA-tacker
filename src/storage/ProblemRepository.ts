import { chromeStorage } from "./ChromeStorage";

import { STORAGE_KEYS } from "../shared/constants/storageKeys";

import type {
  Problem,
  ProblemStatus,
  ProblemStore,
} from "../shared/types";
import { logger } from "../shared/utils/logger";

export class ProblemRepository {
  /**
   * Returns all tracked problems.
   */
  async findAll(): Promise<ProblemStore> {
    const problems = await chromeStorage.get<ProblemStore>(
      STORAGE_KEYS.PROBLEMS
    );

    return problems ?? {};
  }

  /**
   * Returns all tracked problems as an array.
   */
  async getAll(): Promise<Problem[]> {
    const problems = await this.findAll();
    return Object.values(problems).filter(
      (p) => p.attempts > 0 && p.status !== ("open" as unknown as ProblemStatus)
    );
  }
  /**
   * Returns problem statistics (total, solved, attempted).
   */
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
  }

  /**
   * Finds a problem by its unique id.
   */
  async findById(problemId: string): Promise<Problem | null> {
    const problems = await this.findAll();

    return problems[problemId] ?? null;
  }

  /**
   * Checks whether a problem already exists.
   */
  async exists(problemId: string): Promise<boolean> {
    const problem = await this.findById(problemId);

    return problem !== null;
  }

  /**
   * Creates or updates a problem.
   */
  async save(problem: Problem): Promise<void> {
    const problems = await this.findAll();

    problems[problem.id] = problem;

    await chromeStorage.set(STORAGE_KEYS.PROBLEMS, problems);
  }

  /**
   * Deletes a problem.
   */
  async delete(problemId: string): Promise<void> {
    const problems = await this.findAll();

    delete problems[problemId];

    await chromeStorage.set(STORAGE_KEYS.PROBLEMS, problems);
  }

  /**
   * Updates only the notes of a problem.
   */
  async updateNotes(
    problemId: string,
    notes: string
  ): Promise<void> {
    const problem = await this.findById(problemId);

    if (!problem) return;

    problem.notes = notes;

    await this.save(problem);
  }

  /**
   * Updates the status of a problem.
   */
  async updateStatus(
    problemId: string,
    status: ProblemStatus
  ): Promise<void> {
    const problem = await this.findById(problemId);

    if (!problem) return;

    problem.status = status;

    await this.save(problem);
  }

  /**
   * Updates problem attempt statistics and status.
   */
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
    } else if (verdict === "failed") {
      if (problem.status !== "solved") {
        problem.status = "attempted";
      }
    }

    await this.save(problem);
  }

  /**
   * Updates the last opened timestamp.
   */
  async updateLastOpened(problemId: string): Promise<void> {
    const problem = await this.findById(problemId);

    if (!problem) return;

    problem.lastOpenedAt = Date.now();

    await this.save(problem);
  }

  /**
   * Removes all tracked problems.
   */
  async clear(): Promise<void> {
    await chromeStorage.remove(STORAGE_KEYS.PROBLEMS);
  }
}

export const problemRepository = new ProblemRepository();