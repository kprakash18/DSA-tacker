import type { Problem } from "../../shared/types";

interface StatsBarProps {
  problems: Problem[];
}

export default function StatsBar({ problems }: StatsBarProps) {
  const total = problems.length;
  const solved = problems.filter((p) => p.status === "solved").length;
  const attempted = problems.filter((p) => p.status === "attempted").length;

  return (
    <div className="grid grid-cols-3 gap-3">
      <Stat title="Total" value={total.toString()} color="text-gray-900" />
      <Stat title="Solved" value={solved.toString()} color="text-green-600" />
      <Stat title="Attempted" value={attempted.toString()} color="text-orange-500" />
    </div>
  );
}

function Stat({
  title,
  value,
  color = "text-gray-900",
}: {
  title: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 text-center shadow-xs">
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs font-medium text-gray-500">{title}</p>
    </div>
  );
}