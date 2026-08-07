export type Platform = "leetcode";

export type Difficulty = "easy" | "medium" | "hard" | "unknown";
export type ProblemStatus = "attempted" | "solved" | "revisit";

export interface Problem {
  
  id: string;
  platform: Platform;
  slug : string ;


  title: string;
  url: string;
  difficulty: Difficulty;
  tags: string[];

  status: ProblemStatus ;
  attempts: number;
  firstSeenAt: number; // first time the extension detects the problem
  lastOpenedAt: number; // last time the problem was opened
  lastAttemptAt: number | null; // last submission timestamp
  solvedAt?: number | null; // first solved timestamp

  notes: string;

}

export type ProblemStore = Record<string, Problem>;

export interface ToSolveProblem {
  id: string;
  platform: Platform;
  slug: string;
  title: string;
  difficulty: Difficulty;
  url: string;
  tags?: string[];
  createdAt: number;
}

export type ToSolveStore = Record<string, ToSolveProblem>;
