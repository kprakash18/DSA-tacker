import { useEffect, useState, useCallback } from "react";
import { getToSolve, addToSolve, removeFromToSolve } from "../services/sidebarApi";
import type { AddToSolvePayload, ToSolveProblem } from "../../shared/types";

export function useToSolve() {
  const [toSolveList, setToSolveList] = useState<ToSolveProblem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(async () => {
    const data = await getToSolve();
    setToSolveList(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchToSolve = () => {
      getToSolve().then((data) => {
        if (isMounted) {
          setToSolveList(data);
          setLoading(false);
        }
      });
    };

    fetchToSolve();

    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.to_solve) {
        fetchToSolve();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      isMounted = false;
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const add = async (payload: AddToSolvePayload) => {
    await addToSolve(payload);
    await fetchList();
  };

  const remove = async (problemId: string) => {
    await removeFromToSolve(problemId);
    await fetchList();
  };

  return {
    toSolveList,
    loading,
    add,
    remove,
    refetch: fetchList,
  };
}
