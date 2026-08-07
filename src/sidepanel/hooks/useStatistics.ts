import { useEffect, useState } from "react";
import { getStatistics, type ProblemStatistics } from "../services/sidebarApi";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

export function useStatistics() {
  const [stats, setStats] = useState<ProblemStatistics>({
    total: 0,
    solved: 0,
    attempted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = () => {
      getStatistics().then((data) => {
        if (isMounted) {
          setStats(data);
          setLoading(false);
        }
      });
    };

    fetchStats();

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if ((areaName === "local" || !areaName) && changes[STORAGE_KEYS.PROBLEMS]) {
        fetchStats();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      isMounted = false;
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return {
    stats,
    loading,
  };
}
