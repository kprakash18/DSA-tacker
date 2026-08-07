import type { ProblemDetectedPayload } from "../../shared/types";

interface CurrentProblemCardProps {
  currentProblem: ProblemDetectedPayload;
  isBookmarked: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

export default function CurrentProblemCard({
  currentProblem,
  isBookmarked,
  onAdd,
  onRemove,
}: CurrentProblemCardProps) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
        Currently Viewing
      </div>

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 leading-snug">
          {currentProblem.url ? (
            <a
              href={currentProblem.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              {currentProblem.title}
            </a>
          ) : (
            currentProblem.title
          )}
        </h3>

        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
            currentProblem.difficulty === "easy"
              ? "bg-green-100 text-green-700"
              : currentProblem.difficulty === "medium"
              ? "bg-yellow-100 text-yellow-700"
              : currentProblem.difficulty === "hard"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {currentProblem.difficulty}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        {isBookmarked ? (
          <>
            <span className="text-xs font-medium text-green-700 flex items-center gap-1">
              ✓ Saved to To Solve
            </span>
            <button
              onClick={onRemove}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Remove
            </button>
          </>
        ) : (
          <button
            onClick={onAdd}
            className="w-full rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
          >
            [ Solve Later ]
          </button>
        )}
      </div>
    </div>
  );
}
