export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
      <div className="text-4xl">🚀</div>

      <h2 className="mt-3 text-base font-bold text-gray-800">
        No solved or attempted problems yet.
      </h2>

      <p className="mt-1.5 max-w-xs text-xs text-gray-500 leading-relaxed">
        Start solving problems to build your history.
      </p>
    </div>
  );
}