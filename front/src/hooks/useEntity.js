import { useEffect, useMemo, useState, useCallback } from "react";

export default function useEntity(controller) {
  const PAGE_SIZE = 10;

  const [rawData, setRawData] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isServerPaginated, setIsServerPaginated] = useState(false);
  const [serverTotalPages, setServerTotalPages] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await controller.getAll(page, query);

      if (Array.isArray(result)) {
        setRawData(result);
        setIsServerPaginated(false);
        setServerTotalPages(1);
      }
      else if (result && Array.isArray(result.items)) {
        setRawData(result.items);
        setIsServerPaginated(true);
        setServerTotalPages(result.totalPages ?? 1);
      } else {
        setRawData([]);
        setIsServerPaginated(false);
        setServerTotalPages(1);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query]);

  useEffect(() => {
    if (isServerPaginated) {
      fetchData();
    }
  }, [page, isServerPaginated]);

  const handleSetQuery = useCallback((value) => {
  setPage(1);
  setQuery(value ?? "");
}, []);

  const filteredData = useMemo(() => {
    if (isServerPaginated) return rawData;

    const q = query.trim().toLowerCase();
    if (!q) return rawData;

    return rawData.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(q)
    );
  }, [rawData, query, isServerPaginated]);

  const totalPages = useMemo(() => {
    if (isServerPaginated) return serverTotalPages;
    return Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  }, [filteredData.length, isServerPaginated, serverTotalPages]);

  const data = useMemo(() => {
    if (isServerPaginated) return filteredData;

    const start = (page - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, page, isServerPaginated]);

  useEffect(() => {
    if (!isServerPaginated && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages, isServerPaginated]);

  const addEntity = async (entity) => {
    try {
      await controller.add(entity);
      await fetchData();
    } catch (err) {
      setError(err);
    }
  };

  const updateEntity = async (entity) => {
    try {
      await controller.update(entity);
      await fetchData();
    } catch (err) {
      setError(err);
    }
  };

  const deleteEntity = async (id) => {
    try {
      await controller.remove(id);
      await fetchData();
    } catch (err) {
      setError(err);
    }
  };

  return {
    data,             
    totalPages,      
    page,
    setPage,
    setQuery: handleSetQuery,
    addEntity,
    updateEntity,
    deleteEntity,
    loading,
    error,
  };
}
