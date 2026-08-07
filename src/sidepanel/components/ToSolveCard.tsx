import type { ToSolveProblem } from "../../shared/types";

interface ToSolveCardProps {
  problem: ToSolveProblem;
  onRemove: (id: string) => void;
}

export default function ToSolveCard({ problem, onRemove }: ToSolveCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 leading-snug">
          {problem.url ? (
            <a
              href={problem.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
            >
              <span>⭐</span>
              <span>{problem.title}</span>
            </a>
          ) : (
            <span className="flex items-center gap-1.5">
              <span>⭐</span>
              <span>{problem.title}</span>
            </span>
          )}
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

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span className="capitalize">{problem.platform}</span>
        <button
          onClick={() => onRemove(problem.id)}
          className="text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Remove
        </button>
      </div>
    </article>
  );
}
