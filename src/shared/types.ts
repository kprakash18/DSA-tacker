import { MESSAGE_TYPES } from "./constants";

export type Platform = "leetcode";
export type Difficulty = "easy" | "medium" | "hard" | "unknown";
export type ProblemStatus = "attempted" | "solved" | "revisit";
export type SubmissionVerdict = "accepted" | "failed";

export interface Problem {
  id: string;
  platform: Platform;
  slug: string;
  title: string;
  url: string;
  difficulty: Difficulty;
  tags: string[];
  status: ProblemStatus;
  attempts: number;
  firstSeenAt: number;
  lastOpenedAt: number;
  lastAttemptAt: number | null;
  solvedAt?: number | null;
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

export interface ProblemDetectedPayload {
  platform: Platform;
  slug: string;
  title: string;
  url: string;
  difficulty: Difficulty;
  tags: string[];
}

export interface AttemptSubmittedPayload {
  submissionId?: string;
  problemId: string;
  verdict: SubmissionVerdict;
  metadata?: ProblemDetectedPayload;
}

export interface AddToSolvePayload {
  platform: Platform;
  slug: string;
  title: string;
  difficulty: Difficulty;
  url: string;
  tags?: string[];
}

export interface RemoveFromToSolvePayload {
  problemId: string;
}

export type RuntimeMessage =
  | { type: typeof MESSAGE_TYPES.GET_PROBLEMS }
  | { type: typeof MESSAGE_TYPES.PROBLEM_DETECTED; payload: ProblemDetectedPayload }
  | { type: typeof MESSAGE_TYPES.ATTEMPT_SUBMITTED; payload: AttemptSubmittedPayload }
  | { type: typeof MESSAGE_TYPES.ADD_TO_SOLVE; payload: AddToSolvePayload }
  | { type: typeof MESSAGE_TYPES.REMOVE_FROM_TO_SOLVE; payload: RemoveFromToSolvePayload }
  | { type: typeof MESSAGE_TYPES.GET_TO_SOLVE }
  | { type: typeof MESSAGE_TYPES.GET_CURRENT_PROBLEM };
