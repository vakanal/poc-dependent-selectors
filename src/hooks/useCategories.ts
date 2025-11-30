import { useEffect, useState } from "react";
import type { Category } from "@domain/models";
import { CategoryRepository } from "@data/categoryRepository";

const repository = new CategoryRepository();

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await repository.fetchCategories();

        if (mounted) setCategories(data);
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
  }, []);

  return { categories, loading, error };
}
