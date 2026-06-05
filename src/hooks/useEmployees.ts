import { useState, useEffect } from "react";
import { siteAPI, type ApiEmployee } from "@/lib/api";

export function useEmployees(limit?: number) {
  const [employees, setEmployees] = useState<ApiEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await siteAPI.getPublicEmployees(limit);
        if (!cancelled) {
          setEmployees(data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Ошибка загрузки");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [limit]);

  return { employees, loading, error };
}
