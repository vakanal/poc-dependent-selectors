import type { Category, SubCategory } from "@domain/models";
import { mockApi } from "@data/mockApi";

export interface ICategoryRepository {
  fetchCategories(): Promise<Category[]>;
  fetchSubCategories(categoryId: string): Promise<SubCategory[]>;
}

export class CategoryRepository implements ICategoryRepository {
  async fetchCategories(): Promise<Category[]> {
    const response = await mockApi.getCategories();

    return response.data;
  }

  async fetchSubCategories(categoryId: string): Promise<SubCategory[]> {
    const response = await mockApi.getSubCategoriesByCategoryId(categoryId);

    return response.data;
  }
}
