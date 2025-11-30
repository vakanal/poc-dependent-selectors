import { CategoryRepository } from "@data/categoryRepository";
import type { SubCategory } from "@domain/models";
import { useFetchData } from "@hooks/useFetchData";

const repository = new CategoryRepository();

export function useSubCategories(categoryId?: string) {
  const { data, loading, error } = useFetchData<SubCategory[]>({
    fetcher: () =>
      categoryId
        ? repository.fetchSubCategories(categoryId)
        : Promise.resolve([]), // ← sin categoría => lista vacía sin hacer fetch
    deps: [categoryId], // ← array literal (eslint feliz)
    initialData: [],
  });

  return { subCategories: data, loading, error };
}
