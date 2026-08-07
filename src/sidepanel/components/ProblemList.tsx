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
  const filteredProblems = problems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(query) ||
      problem.slug.toLowerCase().includes(query)
  );

  if (problems.length === 0) {
    return (
      <EmptyState
        title="No history recorded"
        message="Solve or attempt problems on LeetCode / GFG to track your progress here."
      />
    );
  }

  if (filteredProblems.length === 0) {
    return (
      <EmptyState
        icon="search_off"
        title="No matches found"
        message={`No problems match "${searchQuery}". Try a different search term.`}
      />
    );
  }

  return (
    <div className="space-y-3">
      {filteredProblems.map((problem) => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  );
}