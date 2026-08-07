import { useState } from "react";
import type { Problem } from "../../shared/types";
import SearchBar from "./SearchBar";
import DifficultyBadge from "./DifficultyBadge";
import StatusIndicator from "./StatusIndicator";
import TopicTags from "./TopicTags";
import EmptyState from "./EmptyState";
import { openProblemTab } from "../services/sidebarApi";

interface HistoryViewProps {
  problems: Problem[];
}

export default function HistoryView({ problems }: HistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProblems = problems.filter((problem) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      problem.title.toLowerCase().includes(query) ||
      problem.slug.toLowerCase().includes(query) ||
      problem.platform.toLowerCase().includes(query) ||
      problem.difficulty.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-3">
      {/* Search Input Bar */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Scannable Compact History List */}
      {filteredProblems.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 shadow-xs overflow-hidden">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              onClick={() => problem.url && openProblemTab(problem.url)}
              className="flex items-center justify-between p-3.5 hover:bg-blue-50/40 transition-colors cursor-pointer group"
            >
              <div className="min-w-0 pr-3 flex-1">
                <h3 className="text-xs font-semibold text-gray-900 leading-snug truncate group-hover:text-blue-600 transition-colors">
                  {problem.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-medium text-gray-500 capitalize">
                    {problem.platform}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <DifficultyBadge difficulty={problem.difficulty} />
                </div>
                <TopicTags tags={problem.tags} />
              </div>

              <div className="flex flex-col items-end shrink-0">
                <StatusIndicator status={problem.status} />
                <span className="text-[10px] font-medium text-gray-400 mt-0.5">
                  {problem.attempts} {problem.attempts === 1 ? "attempt" : "attempts"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="search_off"
          title={searchQuery ? "No matches found" : "No history recorded yet"}
          message={
            searchQuery
              ? `No problems match "${searchQuery}". Try a different keyword.`
              : "Solve or attempt problems on LeetCode to populate your history."
          }
        />
      )}
    </div>
  );
}
