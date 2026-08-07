import { useEffect, useState } from "react";
import { getProblems } from "../services/sidebarApi";
import type { Problem } from "../../shared/types";

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProblems();
      setProblems(data);
      setLoading(false);
    }

    load();
  }, []);

  return {
    problems,
    loading,
  };
}
