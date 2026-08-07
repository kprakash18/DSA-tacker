import { useEffect, useState } from "react";
import { getProblems } from "../services/sidebarApi";
import type { Problem } from "../../shared/types";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProblems = () => {
      getProblems().then((data) => {
        if (isMounted) {
          setProblems(data);
          setLoading(false);
        }
      });
    };

    fetchProblems();

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if ((areaName === "local" || !areaName) && changes[STORAGE_KEYS.PROBLEMS]) {
        fetchProblems();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      isMounted = false;
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return {
    problems,
    loading,
  };
}
