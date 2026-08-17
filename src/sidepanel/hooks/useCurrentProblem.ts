import { useEffect, useState } from "react";
import { getCurrentProblem } from "../services/sidebarApi";
import type { ProblemDetectedPayload } from "../../shared/types";

export function useCurrentProblem() {
  const [currentProblem, setCurrentProblem] = useState<ProblemDetectedPayload | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Direct initial read from session storage
    if (chrome.storage?.session) {
      chrome.storage.session.get("activeProblem").then((res) => {
        if (isMounted && res.activeProblem) {
          setCurrentProblem(res.activeProblem as ProblemDetectedPayload);
        }
      }).catch(() => {});
    }

    // 2. Active tab query & sync
    getCurrentProblem().then((data) => {
      if (isMounted && data) {
        setCurrentProblem(data);
      }
    });

    // 3. Reactive storage change subscription
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
