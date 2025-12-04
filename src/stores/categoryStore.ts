// Enterprise State Management with Zustand
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type { CategoryEntity } from '../domain/entities';

// State interface
interface CategoryState {
  // Data
  categories: CategoryEntity[];
  selectedCategoryId: string | null;
  selectedSubCategoryId: string | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Computed
  hasCategories: boolean;
  hasSelectedCategory: boolean;
}

// Actions interface
interface CategoryActions {
  // Data actions
  setCategories: (categories: CategoryEntity[]) => void;
  selectCategory: (categoryId: string) => void;
  selectSubCategory: (subCategoryId: string) => void;
  clearSelection: () => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Reset
  reset: () => void;
}

// Store type
type CategoryStore = CategoryState & CategoryActions;

// Initial state
const initialState: CategoryState = {
  categories: [],
  selectedCategoryId: null,
  selectedSubCategoryId: null,
  isLoading: false,
  error: null,
  hasCategories: false,
  hasSelectedCategory: false,
};

// Enterprise Zustand Store
export const useCategoryStore = create<CategoryStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,
      
      // Computed properties
      get hasCategories() {
        return get().categories.length > 0;
      },
      
      get hasSelectedCategory() {
        return !!get().selectedCategoryId;
      },
      
      // Data actions
      setCategories: (categories) => set({ categories }, false, 'setCategories'),
      
      selectCategory: (categoryId) => set(
        () => ({
          selectedCategoryId: categoryId,
          selectedSubCategoryId: null, // Clear subcategory when category changes
        }),
        false,
        'selectCategory'
      ),
      
      selectSubCategory: (subCategoryId) => set(
        { selectedSubCategoryId: subCategoryId },
        false,
        'selectSubCategory'
      ),
      
      clearSelection: () => set(
        { selectedCategoryId: null, selectedSubCategoryId: null },
        false,
        'clearSelection'
      ),
      
      // UI actions
      setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),
      setError: (error) => set({ error }, false, 'setError'),
      clearError: () => set({ error: null }, false, 'clearError'),
      
      // Reset
      reset: () => set(initialState, false, 'reset'),
    })),
    {
      name: 'category-store',
      enabled: import.meta.env.DEV,
    }
  )
);

// Selectors for optimized re-renders
export const useCategories = () => useCategoryStore((state) => state.categories);
export const useSelectedCategoryId = () => useCategoryStore((state) => state.selectedCategoryId);
export const useSelectedSubCategoryId = () => useCategoryStore((state) => state.selectedSubCategoryId);
export const useCategoryLoading = () => useCategoryStore((state) => state.isLoading);
export const useCategoryError = () => useCategoryStore((state) => state.error);
export const useHasCategories = () => useCategoryStore((state) => state.hasCategories);
export const useHasSelectedCategory = () => useCategoryStore((state) => state.hasSelectedCategory);

// Actions hook
export const useCategoryActions = () => useCategoryStore((state) => ({
  setCategories: state.setCategories,
  selectCategory: state.selectCategory,
  selectSubCategory: state.selectSubCategory,
  clearSelection: state.clearSelection,
  setLoading: state.setLoading,
  setError: state.setError,
  clearError: state.clearError,
  reset: state.reset,
}));