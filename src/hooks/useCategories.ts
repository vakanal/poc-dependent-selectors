import { CategoryRepository } from "@data/categoryRepository";
import type { Category } from "@domain/models";
import { useFetchData } from "@hooks/useFetchData";

const repository = new CategoryRepository();

export function useCategories() {
  const { data, loading, error } = useFetchData<Category[]>({
    fetcher: () => repository.fetchCategories(),
    deps: [], // ← array literal (eslint feliz)
    initialData: [],
  });

  return { categories: data, loading, error };
}
