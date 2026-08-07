import { useEffect, useState } from "react";
import { getCurrentProblem } from "../services/sidebarApi";
import type { ProblemDetectedPayload } from "../../shared/types";

export function useCurrentProblem() {
  const [currentProblem, setCurrentProblem] = useState<ProblemDetectedPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getCurrentProblem().then((data) => {
      if (isMounted) {
        setCurrentProblem(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    currentProblem,
    loading,
  };
}
