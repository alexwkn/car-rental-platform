// src/hooks/useEntity.js
import { useEffect, useState } from "react";

export default function useEntity(controller) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // On passe toujours (page, query), même si le controller ne les utilise pas
      const result = await controller.getAll(page, query);

      // Si le backend renvoie un array simple
      if (Array.isArray(result)) {
        setData(result);
        setTotalPages(1);
      } 
      // Si le backend renvoie { items, totalPages }
      else if (result && Array.isArray(result.items)) {
        setData(result.items);
        setTotalPages(result.totalPages ?? 1);
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // controller est stable (import), donc pas besoin dans le tableau de deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query]);

  const handleSetQuery = (value) => {
    setPage(1);          // dès qu'on change le filtre, on repart page 1
    setQuery(value);
  };

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
