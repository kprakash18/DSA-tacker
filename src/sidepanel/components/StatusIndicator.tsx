import type { ProblemStatus } from "../../shared/types";

interface StatusIndicatorProps {
  status: ProblemStatus | string;
  className?: string;
}

export default function StatusIndicator({ status, className = "" }: StatusIndicatorProps) {
  switch (status) {
    case "solved":
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-xs text-[#2db55d] ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#2db55d] shadow-[0_0_6px_rgba(45,181,93,0.4)]"></span>
          <span>Solved</span>
        </span>
      );
    case "revisit":
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-xs text-purple-600 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
          <span>Revisit</span>
        </span>
      );
    case "attempted":
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-xs text-orange-500 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          <span>Attempted</span>
        </span>
      );
  }
}
