import type { Category, SubCategory } from "@domain/models";

const CATEGORIES: Category[] = [
  { id: "cat-tech", name: "Tecnología" },
  { id: "cat-home", name: "Hogar" },
  { id: "cat-fashion", name: "Moda" },
  { id: "cat-sports", name: "Deportes" },
];

const SUBCATEGORIES: SubCategory[] = [
  { id: "sub-frontend", categoryId: "cat-tech", name: "Frontend" },
  { id: "sub-backend", categoryId: "cat-tech", name: "Backend" },
  { id: "sub-devops", categoryId: "cat-tech", name: "DevOps" },
  { id: "sub-ai", categoryId: "cat-tech", name: "IA / Machine Learning" },
  { id: "sub-furniture", categoryId: "cat-home", name: "Muebles" },
  { id: "sub-kitchen", categoryId: "cat-home", name: "Cocina" },
  { id: "sub-garden", categoryId: "cat-home", name: "Jardinería" },
  { id: "sub-men", categoryId: "cat-fashion", name: "Hombres" },
  { id: "sub-women", categoryId: "cat-fashion", name: "Mujeres" },
  { id: "sub-accessories", categoryId: "cat-fashion", name: "Accesorios" },
  { id: "sub-football", categoryId: "cat-sports", name: "Fútbol" },
  { id: "sub-running", categoryId: "cat-sports", name: "Running" },
  { id: "sub-gym", categoryId: "cat-sports", name: "Gimnasio" },
];

function fakeRequest<T>(data: T, delay = 500): Promise<{ data: T }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data }), delay);
  });
}

export const mockApi = {
  getCategories: async () => {
    return fakeRequest(CATEGORIES);
  },

  getSubCategoriesByCategoryId: async (categoryId: string) => {
    const filtered = SUBCATEGORIES.filter((s) => s.categoryId === categoryId);

    return fakeRequest(filtered);
  },

  getSubCategoriesWithPossibleError: async (categoryId: string) => {
    return new Promise<{ data: SubCategory[] }>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.1) {
          reject(new Error("Simulated network error"));
        } else {
          resolve({
            data: SUBCATEGORIES.filter((s) => s.categoryId === categoryId),
          });
        }
      }, 500);
    });
  },
};
