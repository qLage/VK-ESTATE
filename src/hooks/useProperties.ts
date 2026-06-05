import { useState, useEffect } from "react";
import { siteAPI, type ApiProperty } from "@/lib/api";

export function useProperties(limit = 20) {
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await siteAPI.getApprovedProperties(limit);
        if (mounted) {
          setProperties(data);
          setError(null);
        }
      } catch (e) {
        if (mounted) {
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
  }, [limit]);

  return { properties, loading, error };
}
