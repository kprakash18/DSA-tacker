import type { Problem } from "../../shared/types";
import { openProblemTab } from "../services/sidebarApi";

interface ProblemCardProps {
  problem: Problem;
}

function formatPlatform(platform: string): string {
  if (!platform) return "";
  const lower = platform.toLowerCase();
  if (lower === "leetcode") return "LeetCode";
  if (lower === "gfg") return "GeeksforGeeks";
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

function renderStatus(status: string) {
  switch (status) {
    case "solved":
      return <span className="font-medium text-[#2db55d]">🟢 Solved</span>;
    case "revisit":
      return <span className="font-medium text-purple-600">🟣 Revisit</span>;
    case "attempted":
    default:
      return <span className="font-medium text-orange-500">🟠 Attempted</span>;
  }
}

export default function ProblemCard({ problem }: ProblemCardProps) {
  const handleClick = () => {
    if (problem.url) {
      openProblemTab(problem.url);
    }
  };

  return (
    <article
      onClick={handleClick}
      className="group rounded-lg border border-gray-200 bg-white p-4 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
          {problem.title}
        </h3>

        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
            problem.difficulty === "easy"
              ? "bg-[#2db55d]/10 text-[#2db55d]"
              : problem.difficulty === "medium"
              ? "bg-yellow-100 text-yellow-700"
              : problem.difficulty === "hard"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {problem.difficulty}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-1 text-sm">
        <span className="text-gray-500 font-medium">
          {formatPlatform(problem.platform)}
        </span>

        <div>{renderStatus(problem.status)}</div>

        <div className="mt-1 text-xs text-gray-400">
          🎯 {problem.attempts} {problem.attempts === 1 ? "attempt" : "attempts"}
        </div>
      </div>
    </article>
  );
}