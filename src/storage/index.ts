import { STORAGE_KEYS } from "../shared/constants";
import type { Problem, ProblemStore, ToSolveProblem, ToSolveStore } from "../shared/types";
import { logger } from "../shared/utils";

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



  async findById(problemId: string): Promise<Problem | null> {
    const problems = await this.findAll();
    return problems[problemId] ?? null;
  },

  async save(problem: Problem): Promise<void> {
    const problems = await this.findAll();
    problems[problem.id] = problem;
    await chrome.storage.local.set({ [STORAGE_KEYS.PROBLEMS]: problems });
  },

  async updateAttempt(problemId: string, verdict: "accepted" | "failed"): Promise<void> {
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
      if (!problem.solvedAt) problem.solvedAt = now;
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

export const toSolveRepository = {
  async findAll(): Promise<ToSolveStore> {
    const data = await chrome.storage.local.get(STORAGE_KEYS.TO_SOLVE);
    return (data[STORAGE_KEYS.TO_SOLVE] as ToSolveStore) ?? {};
  },

  async getAll(): Promise<ToSolveProblem[]> {
    const store = await this.findAll();
    return (Object.values(store) as ToSolveProblem[]).sort((a, b) => b.createdAt - a.createdAt);
  },

  async add(problem: ToSolveProblem): Promise<void> {
    const store = await this.findAll();
    store[problem.id] = problem;
    await chrome.storage.local.set({ [STORAGE_KEYS.TO_SOLVE]: store });
  },

  async remove(problemId: string): Promise<void> {
    const store = await this.findAll();
    delete store[problemId];
    await chrome.storage.local.set({ [STORAGE_KEYS.TO_SOLVE]: store });
  },

  async exists(problemId: string): Promise<boolean> {
    const store = await this.findAll();
    return Boolean(store[problemId]);
  },
};
