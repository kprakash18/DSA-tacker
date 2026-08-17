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
    <nav className="px-4 py-2 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-11 z-20">
      <div className="flex p-1 bg-gray-100/80 rounded-xl gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-1.5 px-2 text-center text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1 ${
                isActive
                  ? "bg-white text-gray-900 shadow-xs font-bold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.badge === "number" && tab.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 text-[9px] rounded-full font-extrabold leading-none ${
                    isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
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
