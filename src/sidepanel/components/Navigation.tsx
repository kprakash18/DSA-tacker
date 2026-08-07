export type TabId = "dashboard" | "history" | "toSolve" | "stats";

export interface TabOption {
  id: TabId;
  label: string;
  badge?: number;
}

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  toSolveCount?: number;
}

export default function Navigation({ activeTab, onTabChange, toSolveCount }: NavigationProps) {
  const tabs: TabOption[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "history", label: "History" },
    { id: "toSolve", label: "To Solve", badge: toSolveCount },
    { id: "stats", label: "Stats" },
  ];

  return (
    <nav className="px-4 pb-2 bg-white border-b border-gray-200 sticky top-12 z-20">
      <div className="flex p-1 bg-gray-100 rounded-lg gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-1.5 px-2 text-center text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${
                isActive
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.badge === "number" && tab.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold leading-none ${
                    isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
