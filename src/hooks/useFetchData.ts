import { useEffect, useState } from "react";

export function useFetchData<T>({
  fetcher,
  deps,
  initialData,
}: {
  fetcher: () => Promise<T>;
  deps: readonly unknown[];
  initialData: T;
}) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetcher();
        if (mounted) setData(response);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Error desconocido");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
