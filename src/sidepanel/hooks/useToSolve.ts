import { useEffect, useState } from "react";
import { getToSolve, addToSolve, removeFromToSolve } from "../services/sidebarApi";
import type { ToSolveProblem } from "../../shared/types";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

export function useToSolve() {
  const [toSolveList, setToSolveList] = useState<ToSolveProblem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchToSolve = () => {
      getToSolve().then((data) => {
        if (isMounted) setToSolveList(data);
      });
    };

    fetchToSolve();

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if ((areaName === "local" || !areaName) && changes[STORAGE_KEYS.TO_SOLVE]) {
        fetchToSolve();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      isMounted = false;
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return {
    toSolveList,
    add: addToSolve,
    remove: removeFromToSolve,
  };
}
