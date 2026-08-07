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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-[#2db55d] border border-emerald-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2db55d] animate-pulse"></span>
          <span>LeetCode Active</span>
        </span>
      </div>
    </header>
  );
} 