import { useProblems } from "../hooks/useProblems";
import EmptyState from "./EmptyState";
import Loading from "./Loading";
import ProblemCard from "./ProblemCard";

interface ProblemListProps {
  searchQuery?: string;
}

export default function ProblemList({ searchQuery = "" }: ProblemListProps) {
  const { problems, loading } = useProblems();

  if (loading) {
    return <Loading />;
  }

  const query = searchQuery.trim().toLowerCase();
  const filteredProblems = problems.filter((problem) =>
    problem.title.toLowerCase().includes(query)
  );

  if (problems.length === 0) {
    return <EmptyState />;
  }

  if (filteredProblems.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        No problems found matching "{searchQuery}"
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredProblems.map((problem) => (
        <ProblemCard
          key={problem.id}
          problem={problem}
        />
      ))}
    </div>
  );
}