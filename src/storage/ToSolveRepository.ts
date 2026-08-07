import { chromeStorage } from "./ChromeStorage";
import { STORAGE_KEYS } from "../shared/constants/storageKeys";
import type { ToSolveProblem, ToSolveStore } from "../shared/types";

export class ToSolveRepository {
  /**
   * Returns all to-solve problems as a map.
   */
  async findAll(): Promise<ToSolveStore> {
    const data = await chromeStorage.get<ToSolveStore>(STORAGE_KEYS.TO_SOLVE);
    return data ?? {};
  }

  /**
   * Returns all to-solve problems as an array sorted by newest first.
   */
  async getAll(): Promise<ToSolveProblem[]> {
    const store = await this.findAll();
    return Object.values(store).sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Adds a problem to the to-solve bookmark list.
   */
  async add(problem: ToSolveProblem): Promise<void> {
    const store = await this.findAll();
    store[problem.id] = problem;
    await chromeStorage.set(STORAGE_KEYS.TO_SOLVE, store);
  }

  /**
   * Removes a problem from the to-solve bookmark list by ID.
   */
  async remove(problemId: string): Promise<void> {
    const store = await this.findAll();
    delete store[problemId];
    await chromeStorage.set(STORAGE_KEYS.TO_SOLVE, store);
  }

  /**
   * Checks whether a problem exists in the to-solve list.
   */
  async exists(problemId: string): Promise<boolean> {
    const store = await this.findAll();
    return Boolean(store[problemId]);
  }

  /**
   * Clears all to-solve bookmarks.
   */
  async clear(): Promise<void> {
    await chromeStorage.remove(STORAGE_KEYS.TO_SOLVE);
  }
}

export const toSolveRepository = new ToSolveRepository();
