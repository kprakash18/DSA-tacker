import type { Difficulty } from "../../shared/types";

interface DifficultyBadgeProps {
  difficulty: Difficulty | string;
  className?: string;
}

export default function DifficultyBadge({ difficulty, className = "" }: DifficultyBadgeProps) {
  const diffLower = (difficulty || "unknown").toLowerCase();

  let styles = "bg-gray-100 text-gray-700";
  let label = "Unknown";

  if (diffLower === "easy") {
    styles = "bg-[#2db55d]/10 text-[#2db55d]";
    label = "Easy";
  } else if (diffLower === "medium" || diffLower === "med") {
    styles = "bg-yellow-100 text-yellow-700";
    label = "Medium";
  } else if (diffLower === "hard") {
    styles = "bg-red-100 text-red-700";
    label = "Hard";
  }

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles} ${className}`}
    >
      {label}
    </span>
  );
}
