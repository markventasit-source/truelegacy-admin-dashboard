import { useEffect, useState } from "react";

/**
 * Persist list pagination across edit/create navigations (sessionStorage).
 */
export function usePersistedPagination(
  storageKey,
  { defaultPage = 1, defaultRows = 10 } = {}
) {
  const [page, setPage] = useState(() => {
    try {
      const n = Number(sessionStorage.getItem(`${storageKey}:page`));
      return Number.isFinite(n) && n > 0 ? n : defaultPage;
    } catch {
      return defaultPage;
    }
  });

  const [rowsPerPage, setRowsPerPage] = useState(() => {
    try {
      const n = Number(sessionStorage.getItem(`${storageKey}:rows`));
      return Number.isFinite(n) && n > 0 ? n : defaultRows;
    } catch {
      return defaultRows;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(`${storageKey}:page`, String(page));
    } catch {
      /* ignore */
    }
  }, [storageKey, page]);

  useEffect(() => {
    try {
      sessionStorage.setItem(`${storageKey}:rows`, String(rowsPerPage));
    } catch {
      /* ignore */
    }
  }, [storageKey, rowsPerPage]);

  return { page, setPage, rowsPerPage, setRowsPerPage };
}
