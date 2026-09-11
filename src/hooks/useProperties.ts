import { useCallback, useEffect, useState } from "react";
import { siteAPI, type CatalogProperty } from "@/lib/api";
import { toApiCategory } from "@/lib/property";

export interface UseCatalogOptions {
  limit?: number;
  category?: string;
  city?: string;
}

export function useCatalog({ limit = 20, category, city }: UseCatalogOptions = {}) {
  const [properties, setProperties] = useState<CatalogProperty[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCategory = toApiCategory(category);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await siteAPI.getCatalog({
          limit,
          offset: 0,
          category: apiCategory,
          city,
        });
        if (mounted) {
          setProperties(data.items);
          setTotal(data.total);
          setError(null);
        }
      } catch {
        if (mounted) {
          setProperties([]);
          setTotal(0);
          setError("Не удалось загрузить объекты");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [limit, apiCategory, city]);

  const loadMore = useCallback(async () => {
    if (loadingMore || properties.length >= total) return;
    try {
      setLoadingMore(true);
      const data = await siteAPI.getCatalog({
        limit,
        offset: properties.length,
        category: apiCategory,
        city,
      });
      setProperties((prev) => [...prev, ...data.items]);
      setTotal(data.total);
      setError(null);
    } catch {
      setError("Не удалось загрузить объекты");
    } finally {
      setLoadingMore(false);
    }
  }, [apiCategory, city, limit, loadingMore, properties.length, total]);

  return {
    properties,
    total,
    loading,
    loadingMore,
    error,
    hasMore: properties.length < total,
    loadMore,
  };
}

export function useProperties(limit = 20) {
  return useCatalog({ limit });
}
