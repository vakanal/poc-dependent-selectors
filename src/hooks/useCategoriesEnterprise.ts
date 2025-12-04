// Presentation Layer - Enterprise Hooks
import { useEffect, useState, useCallback } from 'react';
import { ServiceFactory } from '../infrastructure/di/Container';
import type { CategoryEntity } from '../domain/entities';

// Initialize services
import { registerServices } from '../infrastructure/di/Container';

// Register services on module load
registerServices();

export function useCategoriesEnterprise() {
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const useCase = ServiceFactory.getCategoriesUseCase();
      const result = await useCase.execute();

      if (result.success) {
        setCategories(result.data);
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    loading,
    error,
    refetch: loadCategories
  };
}

export function useCategorySelection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectCategory = useCallback(async (categoryId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const useCase = ServiceFactory.getSelectCategoryUseCase();
      const result = await useCase.execute(categoryId);

      if (result.success) {
        return true;
      } else {
        setError(result.error.message);
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    selectCategory,
    loading,
    error
  };
}