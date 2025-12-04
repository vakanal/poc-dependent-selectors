import { CategoryRepository } from "@data/categoryRepository";
import type { Category } from "@domain/models";
import { useFetchData } from "@hooks/useFetchData";

const repository = new CategoryRepository();

export function useCategories() {
  const { data, loading, error, refetch } = useFetchData<Category[]>({
    fetcher: () => repository.fetchCategories(),
    deps: [],
    initialData: [],
    retryCount: 2,
    retryDelay: 500,
    cacheTime: 30000,
    onSuccess: (data) => console.log("Categorías cargadas:", data.length),
    onError: (error) => console.error("Error cargando categorías:", error),
  });

  return { 
    categories: data, 
    loading, 
    error, 
    refetch 
  };
}
