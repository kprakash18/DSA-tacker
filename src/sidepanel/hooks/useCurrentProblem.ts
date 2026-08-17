import { useEffect, useState } from "react";
import { getCurrentProblem } from "../services/sidebarApi";
import type { ProblemDetectedPayload } from "../../shared/types";

export function useCurrentProblem() {
  const [currentProblem, setCurrentProblem] = useState<ProblemDetectedPayload | null>(null);

  useEffect(() => {
    let isMounted = true;
    getCurrentProblem().then((data) => {
      if (isMounted) setCurrentProblem(data);
    });

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if ((areaName === "session" || areaName === "local" || !areaName) && changes.activeProblem && isMounted) {
        setCurrentProblem((changes.activeProblem.newValue as ProblemDetectedPayload) ?? null);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => {
      isMounted = false;
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return { currentProblem };
}
