import { useEffect, useState, useCallback } from "react";

const PAGE_SIZE = 10;

// Filtre une liste d'entités sur une recherche texte (cherche dans toutes les valeurs)
function filterEntities(entities, query) {
  const q = query.trim().toLowerCase();
  if (!q) return entities;
  return entities.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(q)
  );
}

// Découpe une liste déjà filtrée pour ne garder que la page demandée
function paginateEntities(entities, page) {
  const start = (page - 1) * PAGE_SIZE;
  return entities.slice(start, start + PAGE_SIZE);
}

export default function useEntity(controller) {
  const [allEntities, setAllEntities] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Recharge la liste complète depuis l'API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await controller.getAll();
      setAllEntities(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Changer la recherche revient toujours à la page 1
  const handleSetQuery = useCallback((value) => {
    setQuery(value ?? "");
    setPage(1);
  }, []);

  const filtered = filterEntities(allEntities, query);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const data = paginateEntities(filtered, safePage);

  // Petit utilitaire pour éviter de répéter le try/catch + refetch 3 fois
  const runAndRefetch = async (action) => {
    try {
      await action();
      await fetchData();
    } catch (err) {
      setError(err);
    }
  };

  return {
    data,
    totalPages,
    page: safePage,
    setPage,
    setQuery: handleSetQuery,
    addEntity: (entity) => runAndRefetch(() => controller.add(entity)),
    updateEntity: (entity) => runAndRefetch(() => controller.update(entity)),
    deleteEntity: (id) => runAndRefetch(() => controller.remove(id)),
    refetch: fetchData,
    loading,
    error,
  };
}
