export type Platform = "leetcode" | "gfg";

export type difficulty = "easy" | "medium" | "hard";
export type ProblemStatus = "attempted" | "solved" | "revisit";

export interface Problem {
  id: string;
  platform: Platform;
  title: string;
  url: string;

  difficulty: difficulty;

  tags: string[];

  status: ProblemStatus;

  attempts: number;

  firstSeenAt: number;

  lastAttemptAt: number;

  notes: string;
}
