import { useEffect, useState } from "react";
import { getCurrentProblem } from "../services/sidebarApi";
import type { ProblemDetectedPayload } from "../../shared/types";

export function useCurrentProblem() {
  const [currentProblem, setCurrentProblem] = useState<ProblemDetectedPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCurrent = () => {
      getCurrentProblem().then((data) => {
        if (isMounted) {
          setCurrentProblem(data);
          setLoading(false);
        }
      });
    };

    fetchCurrent();

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if ((areaName === "session" || areaName === "local" || !areaName) && changes.activeProblem) {
        if (isMounted) {
          setCurrentProblem((changes.activeProblem.newValue as ProblemDetectedPayload) ?? null);
          setLoading(false);
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      isMounted = false;
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return {
    currentProblem,
    loading,
  };
}
