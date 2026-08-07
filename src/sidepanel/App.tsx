import { useEffect, useState } from "react";
import Header from "./components/Header";
import Navigation, { type TabId } from "./components/Navigation";
import DashboardView from "./components/DashboardView";
import HistoryView from "./components/HistoryView";
import ToSolveView from "./components/ToSolveView";
import StatsView from "./components/StatsView";
import { useCurrentProblem } from "./hooks/useCurrentProblem";
import { useProblems } from "./hooks/useProblems";
import { useToSolve } from "./hooks/useToSolve";

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  const { problems } = useProblems();
  const { currentProblem } = useCurrentProblem();
  const { toSolveList, add, remove } = useToSolve();

  useEffect(() => {
    let port: chrome.runtime.Port | null = null;
    chrome.tabs?.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (tab?.id) {
        port = chrome.runtime.connect({ name: `SIDEPANEL_${tab.id}` });
      }
    }).catch(() => {});

    return () => {
      if (port) {
        port.disconnect();
      }
    };
  }, []);

  const currentProblemId = currentProblem ? `${currentProblem.platform}:${currentProblem.slug}` : null;

  const historyProblem = currentProblemId
    ? problems.find((p) => p.id === currentProblemId)
    : null;

  const isBookmarked = currentProblemId
    ? toSolveList.some((item) => item.id === currentProblemId)
    : false;

  const handleAddCurrentToSolve = () => {
    if (!currentProblem) return;
    add({
      platform: currentProblem.platform,
      slug: currentProblem.slug,
      title: currentProblem.title,
      difficulty: currentProblem.difficulty,
      url: currentProblem.url,
      tags: currentProblem.tags,
    });
  };

  const handleRemoveCurrentToSolve = () => {
    if (currentProblemId) {
      remove(currentProblemId);
    }
  };

  return (
    <main className="flex h-screen flex-col bg-gray-50 font-sans text-gray-900">
      <Header />

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        toSolveCount={toSolveList.length}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "dashboard" && (
          <DashboardView
            currentProblem={currentProblem}
            historyProblem={historyProblem}
            isBookmarked={isBookmarked}
            onAddBookmark={handleAddCurrentToSolve}
            onRemoveBookmark={handleRemoveCurrentToSolve}
            problems={problems}
            toSolveList={toSolveList}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === "history" && (
          <HistoryView problems={problems} />
        )}

        {activeTab === "toSolve" && (
          <ToSolveView
            toSolveList={toSolveList}
            onRemove={remove}
          />
        )}

        {activeTab === "stats" && (
          <StatsView problems={problems} />
        )}
      </div>
    </main>
  );
}

export default App;