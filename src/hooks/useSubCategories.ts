import { useEffect, useState } from "react";
import type { SubCategory } from "@domain/models";
import { CategoryRepository } from "@data/categoryRepository";

const repository = new CategoryRepository();

export function useSubCategories(categoryId?: string) {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!categoryId) {
        setSubCategories([]);

        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await repository.fetchSubCategories(categoryId);

        if (mounted) setSubCategories(data);
      } catch (err: unknown) {
        if (mounted) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Error al cargar subcategorías");
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [categoryId]);

  return { subCategories, loading, error };
}
