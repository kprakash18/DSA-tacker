export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <h1 className="font-bold text-sm text-gray-900 tracking-tight">
          Problem Tracker
        </h1>
      </div>
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
        v1.0.0
      </span>
    </header>
  );
} 