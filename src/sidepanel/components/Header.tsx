export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img
          src="/icons/active/icon32.png"
          alt="Problem Tracker Logo"
          className="w-6 h-6 rounded-md object-contain shrink-0"
        />
        <span className="font-bold text-sm text-gray-900 tracking-tight">
          Problem Tracker
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          aria-label="Settings"
          className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
        </button>
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
          <span className="material-symbols-outlined text-[16px]">person</span>
        </div>
      </div>
    </header>
  );
} 