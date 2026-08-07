import type {
  Difficulty,
  Platform,
  ProblemStatus,
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


export interface NotesUpdatedPayload {
  problemId: string;
  notes: string;
}


export interface StatusUpdatedPayload {
  problemId: string;
  status: ProblemStatus;
}


export interface ProblemDeletedPayload {
  problemId: string;
}


export type RuntimeMessage =
  | {
      type: typeof MESSAGE_TYPES.GET_PROBLEMS;
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
      type: typeof MESSAGE_TYPES.NOTES_UPDATED;
      payload: NotesUpdatedPayload;
    }
  | {
      type: typeof MESSAGE_TYPES.STATUS_UPDATED;
      payload: StatusUpdatedPayload;
    }
  | {
      type: typeof MESSAGE_TYPES.PROBLEM_DELETED;
      payload: ProblemDeletedPayload;
    };