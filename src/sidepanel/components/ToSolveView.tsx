import { useState } from "react";
import type { ToSolveProblem } from "../../shared/types";
import DifficultyBadge from "./DifficultyBadge";
import TopicTags from "./TopicTags";
import EmptyState from "./EmptyState";
import { openProblemTab } from "../services/sidebarApi";

interface ToSolveViewProps {
  toSolveList: ToSolveProblem[];
  onRemove: (id: string) => void;
}

export default function ToSolveView({ toSolveList, onRemove }: ToSolveViewProps) {
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");

  const filteredList = toSolveList.filter((item) => {
    if (filterDifficulty === "all") return true;
    return item.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
  });

  return (
    <div className="space-y-4">
      {/* Header bar with pending count & filter toggle */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-xs font-bold text-gray-900">To Solve Queue</h2>
          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-gray-400 font-medium">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                toSolveList.length > 0 ? "bg-amber-500 animate-pulse" : "bg-gray-300"
              }`}
            ></span>
            <span>{toSolveList.length} pending</span>
          </div>
        </div>

        {/* Difficulty Filter Dropdown */}
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Queue List */}
      {filteredList.length > 0 ? (
        <div className="space-y-2">
          {filteredList.map((item) => (
            <div
              key={item.id}
              onClick={() => item.url && openProblemTab(item.url)}
              className="group bg-white border border-gray-100 rounded-xl p-3.5 shadow-xs hover:border-blue-200 hover:shadow-xs transition-all cursor-pointer flex items-start justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <DifficultyBadge difficulty={item.difficulty} />
                  <span className="text-[10px] font-medium text-gray-400 capitalize">
                    {item.platform}
                  </span>
                </div>

                <h3 className="text-xs font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <TopicTags tags={item.tags} />
              </div>

              {/* Remove Action Button */}
              <button
                aria-label="Remove bookmark"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.id);
                }}
                className="px-2 py-1 text-[11px] font-semibold rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="check_circle"
          title={toSolveList.length === 0 ? "Queue Cleared" : "No matching bookmarks"}
          message={
            toSolveList.length === 0
              ? "You've cleared your queue. Bookmark problems on LeetCode to solve them later."
              : `No bookmarked problems found for difficulty "${filterDifficulty}".`
          }
        />
      )}
    </div>
  );
}
