import { STORAGE_KEYS } from "../shared/constants/storageKeys";
import type { ToSolveProblem, ToSolveStore } from "../shared/types";

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
