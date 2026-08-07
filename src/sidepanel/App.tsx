import { useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import StatsBar from "./components/StatsBar";
import ProblemList from "./components/ProblemList";
import ToSolveList from "./components/ToSolveList";
import CurrentProblemCard from "./components/CurrentProblemCard";
import { useCurrentProblem } from "./hooks/useCurrentProblem";
import { useProblems } from "./hooks/useProblems";
import { useToSolve } from "./hooks/useToSolve";

function App() {
  const [activeTab, setActiveTab] = useState<"history" | "toSolve">("history");
  const [searchQuery, setSearchQuery] = useState("");

  const { problems } = useProblems();
  const { currentProblem } = useCurrentProblem();
  const { toSolveList, add, remove } = useToSolve();

  const currentProblemId = currentProblem ? `${currentProblem.platform}:${currentProblem.slug}` : null;

  const historyProblem = currentProblemId
    ? problems.find((p) => p.id === currentProblemId)
    : null;

  const isBookmarked = currentProblemId
    ? toSolveList.some((item) => item.id === currentProblemId)
    : false;

  const showCurrentViewing =
    Boolean(currentProblem) &&
    (!historyProblem || historyProblem.status === "attempted");

  return (
    <main className="flex h-screen flex-col bg-gray-50">
      <Header />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {showCurrentViewing && currentProblem && (
          <CurrentProblemCard
            currentProblem={currentProblem}
            historyProblem={historyProblem}
            isBookmarked={isBookmarked}
            onAdd={() =>
              add({
                platform: currentProblem.platform,
                slug: currentProblem.slug,
                title: currentProblem.title,
                difficulty: currentProblem.difficulty,
                url: currentProblem.url,
              })
            }
            onRemove={() => currentProblemId && remove(currentProblemId)}
          />
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === "history"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab("toSolve")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1 ${
              activeTab === "toSolve"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>To Solve</span>
            {toSolveList.length > 0 && (
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                  activeTab === "toSolve" ? "bg-blue-800 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {toSolveList.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === "history" ? (
          <div className="space-y-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <StatsBar problems={problems} />
            <ProblemList searchQuery={searchQuery} />
          </div>
        ) : (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
              <span>⭐</span> To Solve Bookmarks
            </h2>
            <ToSolveList toSolveList={toSolveList} onRemove={remove} />
          </div>
        )}
      </div>
    </main>
  );
}

export default App;