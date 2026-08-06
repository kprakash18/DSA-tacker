export type Platform = "leetcode" | "gfg";

export type Difficulty = "easy" | "medium" | "hard" | "unknown";
export type ProblemStatus = "attempted" | "solved" | "revisit";
export type SubmissionVerdict = "accepted" | "failed";

export interface Problem {
  
  id: string;
  platform: Platform;
  slug : string ;


  title: string;
  url: string;
  difficulty: Difficulty;
  tags?: string[];

  status: ProblemStatus ;
  attempts: number;
  firstSeenAt: number; // first time the extension detects the problem
  lastOpenedAt: number; // last time the problem was opened
  lastAttemptAt: number | null; // last submission timestamp

  notes: string;

}
