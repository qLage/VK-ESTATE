import { useEffect, useState } from "react";
import { siteAPI, type CatalogProperty } from "@/lib/api";

export function useProperty(id: string | undefined) {
  const [property, setProperty] = useState<CatalogProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProperty(null);
      setLoading(false);
      setError("Объект не найден");
      return;
    }

    const propertyId = id;
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await siteAPI.getCatalogItem(propertyId);
        if (mounted) {
          setProperty(data);
          setError(null);
        }
      } catch {
        if (mounted) {
          setProperty(null);
          setError("Объект не найден");
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
  }, [id]);

  return { property, loading, error };
}
