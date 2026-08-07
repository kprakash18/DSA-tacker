export default function Loading() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 rounded-full"></div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
