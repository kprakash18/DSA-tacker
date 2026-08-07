import type { ToSolveProblem } from "../../shared/types";
import ToSolveCard from "./ToSolveCard";

interface ToSolveListProps {
  toSolveList: ToSolveProblem[];
  onRemove: (id: string) => void;
}

export default function ToSolveList({ toSolveList, onRemove }: ToSolveListProps) {
  if (toSolveList.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        No bookmarked problems yet. Click "Solve Later" on any problem page to bookmark it.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {toSolveList.map((problem) => (
        <ToSolveCard
          key={problem.id}
          problem={problem}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
