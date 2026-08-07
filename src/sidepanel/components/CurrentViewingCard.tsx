import type { Problem, ProblemDetectedPayload } from "../../shared/types";
import DifficultyBadge from "./DifficultyBadge";
import TopicTags from "./TopicTags";

interface CurrentViewingCardProps {
  currentProblem: ProblemDetectedPayload;
  historyProblem?: Problem | null;
  isBookmarked: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

export default function CurrentViewingCard({
  currentProblem,
  historyProblem,
  isBookmarked,
  onAdd,
  onRemove,
}: CurrentViewingCardProps) {
  // If problem is already solved, auto-hide the card
  if (historyProblem?.status === "solved") {
    return null;
  }

  const isAttempted = historyProblem?.status === "attempted";

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 shadow-xs space-y-3">
      {/* Header Eyebrow */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
          Currently Viewing
        </span>
        <span className="text-[11px] font-semibold text-gray-500 capitalize">
          {currentProblem.platform}
        </span>
      </div>

      {/* Problem Title & Difficulty Badge */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm text-gray-900 leading-snug">
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

          <DifficultyBadge difficulty={currentProblem.difficulty} />
        </div>
        <TopicTags tags={currentProblem.tags} />
      </div>

      {/* Attempt Warning Banner */}
      {isAttempted && historyProblem && (
        <div className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-center gap-2">
          <span className="text-base leading-none">⚠️</span>
          <span>
            You've attempted this problem ({historyProblem.attempts}{" "}
            {historyProblem.attempts === 1 ? "attempt" : "attempts"}).
          </span>
        </div>
      )}

      {/* Bookmark / Save Action Row */}
      <div className="pt-1 flex items-center justify-between">
        {isBookmarked ? (
          <>
            <span className="text-xs font-semibold text-[#2db55d] flex items-center gap-1">
              ✓ Saved to To Solve
            </span>
            <button
              onClick={onRemove}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
            >
              Remove
            </button>
          </>
        ) : (
          <button
            onClick={onAdd}
            className="w-full rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>☆</span>
            <span>{isAttempted ? "Save to Solve Later" : "Save for Later"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
