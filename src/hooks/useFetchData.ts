import { useEffect, useState, useCallback, useRef } from "react";

export interface UseFetchDataConfig<T> {
  fetcher: () => Promise<T>;
  deps?: readonly unknown[];
  initialData?: T;
  retryCount?: number;
  retryDelay?: number;
  cacheTime?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  enabled?: boolean;
}

export function useFetchData<T>({
  fetcher,
  deps = [],
  initialData,
  retryCount = 0,
  retryDelay = 1000,
  cacheTime = 0,
  onSuccess,
  onError,
  enabled = true,
}: UseFetchDataConfig<T>) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);

  const executeWithRetry = useCallback(async (): Promise<T> => {
    try {
      abortControllerRef.current = new AbortController();
      const response = await fetcher();
      
      if (abortControllerRef.current.signal.aborted) {
        throw new Error("Request aborted");
      }

      retryCountRef.current = 0;
      onSuccess?.(response);
      
      if (cacheTime > 0) {
        const cacheKey = JSON.stringify(deps);
        cacheRef.current.set(cacheKey, { data: response, timestamp: Date.now() });
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return executeWithRetry();
      }
      
      onError?.(errorMessage);
      throw err;
    }
  }, [fetcher, retryCount, retryDelay, cacheTime, deps, onSuccess, onError]);

  const loadData = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);

    try {
      if (cacheTime > 0) {
        const cacheKey = JSON.stringify(deps);
        const cached = cacheRef.current.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < cacheTime) {
          setData(cached.data);
          setLoading(false);
          return;
        }
      }

      const response = await executeWithRetry();
      setData(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [enabled, cacheTime, deps, executeWithRetry]);

  const refetch = useCallback(() => {
    retryCountRef.current = 0;
    return loadData();
  }, [loadData]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  useEffect(() => {
    loadData();

    return () => {
      cancel();
    };
  }, [loadData, cancel]);

  useEffect(() => {
    if (cacheTime > 0) {
      const interval = setInterval(() => {
        const now = Date.now();
        cacheRef.current.forEach((value, key) => {
          if (now - value.timestamp >= cacheTime) {
            cacheRef.current.delete(key);
          }
        });
      }, cacheTime);

      return () => clearInterval(interval);
    }
  }, [cacheTime]);

  return { 
    data, 
    loading, 
    error, 
    refetch, 
    cancel 
  };
}
