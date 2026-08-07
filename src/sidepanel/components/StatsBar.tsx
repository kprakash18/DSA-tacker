export default function StatsBar() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Stat title="Total" value="0" />
      <Stat title="Solved" value="0" />
      <Stat title="Attempted" value="0" />
    </div>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-gray-50 p-3 text-center">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{title}</p>
    </div>
  );
}