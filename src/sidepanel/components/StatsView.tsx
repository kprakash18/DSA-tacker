import type { Problem } from "../../shared/types";
import DifficultyBadge from "./DifficultyBadge";
import StatusIndicator from "./StatusIndicator";
import { openProblemTab } from "../services/sidebarApi";

interface StatsViewProps {
  problems: Problem[];
}

export default function StatsView({ problems }: StatsViewProps) {
  const totalCount = problems.length;
  const solvedList = problems.filter((p) => p.status === "solved");
  const solvedCount = solvedList.length;
  const attemptedCount = problems.filter((p) => p.status === "attempted").length;

  const easySolved = solvedList.filter((p) => (p.difficulty || "").toLowerCase() === "easy").length;
  const medSolved = solvedList.filter((p) => {
    const d = (p.difficulty || "").toLowerCase();
    return d === "medium" || d === "med";
  }).length;
  const hardSolved = solvedList.filter((p) => (p.difficulty || "").toLowerCase() === "hard").length;

  const easyPct = solvedCount > 0 ? Math.round((easySolved / solvedCount) * 100) : 0;
  const medPct = solvedCount > 0 ? Math.round((medSolved / solvedCount) * 100) : 0;
  const hardPct = solvedCount > 0 ? Math.round((hardSolved / solvedCount) * 100) : 0;

  // Timeline entries
  const recentTimeline = [...problems]
    .sort((a, b) => (b.lastAttemptAt || b.lastOpenedAt) - (a.lastAttemptAt || a.lastOpenedAt))
    .slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Hero Header */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-3">
        <div>
          <h1 className="text-base font-bold text-gray-900">Statistics</h1>
          <p className="text-xs text-gray-500">Your problem-solving journey</p>
        </div>

        <div className="flex items-baseline gap-3 pt-1">
          <span className="text-4xl font-extrabold text-blue-600 tracking-tight">
            {solvedCount}
          </span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Total Solved
          </span>
        </div>

        <div className="flex items-baseline gap-2 pt-1 border-t border-gray-100">
          <span className="text-lg font-bold text-gray-800">{attemptedCount}</span>
          <span className="text-xs text-gray-500 font-medium">Attempted Problems ({totalCount} total)</span>
        </div>
      </section>

      {/* Difficulty Distribution Progress Bars */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Difficulty Distribution
        </h2>

        <div className="space-y-3">
          {/* Easy Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#2db55d]">Easy</span>
              <span className="text-gray-600">{easySolved} ({easyPct}%)</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2db55d] rounded-full transition-all duration-500"
                style={{ width: `${easyPct}%` }}
              ></div>
            </div>
          </div>

          {/* Medium Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-amber-600">Medium</span>
              <span className="text-gray-600">{medSolved} ({medPct}%)</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${medPct}%` }}
              ></div>
            </div>
          </div>

          {/* Hard Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-rose-600">Hard</span>
              <span className="text-gray-600">{hardSolved} ({hardPct}%)</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${hardPct}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Timeline */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Recent Activity
        </h2>

        {recentTimeline.length > 0 ? (
          <div className="relative border-l-2 border-gray-200 ml-2 pl-4 space-y-4">
            {recentTimeline.map((item) => (
              <div
                key={item.id}
                onClick={() => item.url && openProblemTab(item.url)}
                className="relative group cursor-pointer"
              >
                {/* Timeline Dot */}
                <span className="absolute -left-5.25 top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white"></span>

                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-gray-500 capitalize">{item.platform}</span>
                      <DifficultyBadge difficulty={item.difficulty} />
                    </div>
                  </div>

                  <StatusIndicator status={item.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic py-2 text-center">
            No activity logged yet.
          </p>
        )}
      </section>
    </div>
  );
}
