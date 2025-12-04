import { CategoryRepository } from "@data/categoryRepository";
import type { SubCategory } from "@domain/models";
import { useFetchData } from "@hooks/useFetchData";

const repository = new CategoryRepository();

export function useSubCategories(categoryId?: string) {
  const { data, loading, error, refetch } = useFetchData<SubCategory[]>({
    fetcher: () =>
      categoryId
        ? repository.fetchSubCategories(categoryId)
        : Promise.resolve([]),
    deps: [categoryId],
    initialData: [],
    enabled: !!categoryId,
    retryCount: 1,
    retryDelay: 300,
    cacheTime: 15000,
    onSuccess: (data) => console.log(`Subcategorías cargadas para ${categoryId}:`, data.length),
    onError: (error) => console.error(`Error cargando subcategorías para ${categoryId}:`, error),
  });

  return { 
    subCategories: data, 
    loading, 
    error, 
    refetch 
  };
}
