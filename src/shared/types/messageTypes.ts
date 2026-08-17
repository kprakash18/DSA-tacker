import type {
  Difficulty,
  Platform,
} from "./problemTypes";

import { MESSAGE_TYPES } from "../messages";

export interface ProblemDetectedPayload {
  platform: Platform;
  slug: string;
  title: string;
  url: string;
  difficulty: Difficulty;
  tags: string[];
}

export type SubmissionVerdict = "accepted" | "failed";

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
  | {
      type: typeof MESSAGE_TYPES.GET_PROBLEMS;
    }
  | {
      type: typeof MESSAGE_TYPES.GET_STATISTICS;
    }
  | {
      type: typeof MESSAGE_TYPES.PROBLEM_DETECTED;
      payload: ProblemDetectedPayload;
    }
  | {
      type: typeof MESSAGE_TYPES.ATTEMPT_SUBMITTED;
      payload: AttemptSubmittedPayload;
    }
  | {
      type: typeof MESSAGE_TYPES.ADD_TO_SOLVE;
      payload: AddToSolvePayload;
    }
  | {
      type: typeof MESSAGE_TYPES.REMOVE_FROM_TO_SOLVE;
      payload: RemoveFromToSolvePayload;
    }
  | {
      type: typeof MESSAGE_TYPES.GET_TO_SOLVE;
    }
  | {
      type: typeof MESSAGE_TYPES.GET_CURRENT_PROBLEM;
    };