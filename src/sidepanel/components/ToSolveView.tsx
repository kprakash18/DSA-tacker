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
      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-sm font-bold text-gray-900">To Solve Queue</h1>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                toSolveList.length > 0 ? "bg-red-500 animate-pulse" : "bg-gray-300"
              }`}
            ></span>
            <span>{toSolveList.length} pending</span>
          </div>
        </div>

        {/* Difficulty Filter Dropdown */}
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Queue List */}
      {filteredList.length > 0 ? (
        <div className="space-y-2.5">
          {filteredList.map((item) => (
            <div
              key={item.id}
              onClick={() => item.url && openProblemTab(item.url)}
              className="group relative bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex items-start justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <DifficultyBadge difficulty={item.difficulty} />
                  <span className="text-[11px] font-medium text-gray-400 capitalize">
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
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="done_all"
          title={toSolveList.length === 0 ? "All Caught Up!" : "No matching bookmarks"}
          message={
            toSolveList.length === 0
              ? "You've cleared your queue. Bookmark problems on LeetCode or GFG to solve them later."
              : `No bookmarked problems found for difficulty "${filterDifficulty}".`
          }
        />
      )}
    </div>
  );
}
