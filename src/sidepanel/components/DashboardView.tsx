import { useMemo } from "react";
import type { Problem, ProblemDetectedPayload, ToSolveProblem } from "../../shared/types";
import CurrentViewingCard from "./CurrentViewingCard";
import DifficultyBadge from "./DifficultyBadge";
import StatusIndicator from "./StatusIndicator";
import { openProblemTab } from "../services/sidebarApi";

interface DashboardViewProps {
  currentProblem: ProblemDetectedPayload | null;
  historyProblem?: Problem | null;
  isBookmarked: boolean;
  onAddBookmark: () => void;
  onRemoveBookmark: () => void;
  problems: Problem[];
  toSolveList: ToSolveProblem[];
  onNavigateTab: (tab: "history" | "toSolve" | "stats") => void;
}

export default function DashboardView({
  currentProblem,
  historyProblem,
  isBookmarked,
  onAddBookmark,
  onRemoveBookmark,
  problems,
  toSolveList,
  onNavigateTab,
}: DashboardViewProps) {
  const total = problems.length;

  const solved = useMemo(
    () => problems.filter((p) => p.status === "solved").length,
    [problems]
  );

  const attempted = useMemo(
    () => problems.filter((p) => p.status === "attempted").length,
    [problems]
  );

  // Recent activity: top 5 sorted by lastAttemptAt / lastOpenedAt
  const recentProblems = useMemo(
    () =>
      [...problems]
        .sort((a, b) => (b.lastAttemptAt || b.lastOpenedAt) - (a.lastAttemptAt || a.lastOpenedAt))
        .slice(0, 5),
    [problems]
  );

  // To Solve top 3 preview
  const toSolvePreview = useMemo(
    () => toSolveList.slice(0, 3),
    [toSolveList]
  );

  return (
    <div className="space-y-4">
      {/* Quick Statistics Summary */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Quick Stats
          </h2>
          <button
            onClick={() => onNavigateTab("stats")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            <span>Full Stats</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-gray-100">
          <div>
            <span className="text-xl font-bold text-gray-900 block">{total}</span>
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Total</span>
          </div>
          <div>
            <span className="text-xl font-bold text-[#2db55d] block">{solved}</span>
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Solved</span>
          </div>
          <div>
            <span className="text-xl font-bold text-orange-500 block">{attempted}</span>
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Attempted</span>
          </div>
        </div>
      </section>

      {/* Current Viewing Card if active on a problem page and not solved */}
      {currentProblem && (
        <CurrentViewingCard
          currentProblem={currentProblem}
          historyProblem={historyProblem}
          isBookmarked={isBookmarked}
          onAdd={onAddBookmark}
          onRemove={onRemoveBookmark}
        />
      )}

      {/* To Solve Preview */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-500 font-bold">⭐</span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              To Solve Queue
            </h2>
            {toSolveList.length > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-full">
                {toSolveList.length}
              </span>
            )}
          </div>

          <button
            onClick={() => onNavigateTab("toSolve")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            <span>View All</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {toSolvePreview.length > 0 ? (
          <div className="space-y-2">
            {toSolvePreview.map((item) => (
              <div
                key={item.id}
                onClick={() => item.url && openProblemTab(item.url)}
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-200 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                  <span className="text-xs font-semibold text-gray-900 truncate group-hover:text-blue-600">
                    {item.title}
                  </span>
                </div>
                <DifficultyBadge difficulty={item.difficulty} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic py-2 text-center">
            No pending problems in your queue.
          </p>
        )}
      </section>

      {/* Recent Activity */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Recent Activity
          </h2>
          <button
            onClick={() => onNavigateTab("history")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            <span>History</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {recentProblems.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentProblems.map((p) => (
              <div
                key={p.id}
                onClick={() => p.url && openProblemTab(p.url)}
                className="py-2.5 flex items-center justify-between gap-2 hover:bg-gray-50 px-1 rounded-md cursor-pointer transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-900 truncate">{p.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-gray-500 font-medium capitalize">{p.platform}</span>
                    <DifficultyBadge difficulty={p.difficulty} className="text-[10px] px-1.5 py-0" />
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <StatusIndicator status={p.status} />
                  <span className="block text-[10px] text-gray-400 mt-0.5">
                    {p.attempts} {p.attempts === 1 ? "attempt" : "attempts"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic py-2 text-center">
            No recent activity recorded yet.
          </p>
        )}
      </section>
    </div>
  );
}
