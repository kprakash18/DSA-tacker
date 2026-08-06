import { chromeStorage } from "./chromeStorage";

import { STORAGE_KEYS } from "../shared/constants/storageKeys";

import type {
  Problem,
  ProblemStatus,
  ProblemStore,
} from "../shared/types";

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
   * Records a new submission attempt.
   */
  async incrementAttempts(
    problemId: string,
    solved: boolean
  ): Promise<void> {
    const problem = await this.findById(problemId);

    if (!problem) return;

    problem.attempts += 1;
    problem.lastAttemptAt = Date.now();

    if (solved) {
      problem.status = "solved";
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