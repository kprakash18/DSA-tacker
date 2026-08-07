export default function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="text-5xl">🚀</div>

      <h2 className="mt-4 text-lg font-semibold">
        No problems tracked
      </h2>

      <p className="mt-2 max-w-xs text-sm text-gray-500">
        Solve your first LeetCode or GeeksforGeeks problem to begin building your history.
      </p>
    </div>
  );
}