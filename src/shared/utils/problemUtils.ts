import type { Problem } from "../types";

export function hasAttempts(problem: Problem): boolean {
  return problem.attempts > 0;
}

export function isSolved(problem: Problem): boolean {
  return problem.status === "solved";
}

export function isRevisit(problem: Problem): boolean {
  return problem.status === "revisit";
}

export function isOpened(problem: Problem): boolean {
  return problem.status === "attempted" && problem.attempts === 0;
}

export function isAttempted(problem: Problem): boolean {
  return problem.status === "attempted" && problem.attempts > 0;
}
