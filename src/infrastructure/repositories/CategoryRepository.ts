// Infrastructure Layer - Repository Implementation
import { CategoryEntity, CategoryIdVO, CategoryNameVO } from '../../domain/entities';
import type { ICategoryRepository, Result } from '../../application/usecases';
import { mockApi } from '../../data/mockApi';

export class CategoryRepository implements ICategoryRepository {
  async findAll(): Promise<Result<CategoryEntity[], Error>> {
    try {
      const response = await mockApi.getCategories();
      const categories = response.data.map((category: { id: string; name: string }) => 
        new CategoryEntity(
          new CategoryIdVO(category.id),
          new CategoryNameVO(category.name)
        )
      );
      
      return { success: true, data: categories };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to fetch categories')
      };
    }
  }

  async findById(id: CategoryIdVO): Promise<Result<CategoryEntity | null, Error>> {
    try {
      const response = await mockApi.getCategories();
      const categoryData = response.data.find((c: { id: string }) => c.id === id.value);
      
      if (!categoryData) {
        return { success: true, data: null };
      }

      const category = new CategoryEntity(
        new CategoryIdVO(categoryData.id),
        new CategoryNameVO(categoryData.name)
      );
      
      return { success: true, data: category };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to fetch category')
      };
    }
  }
}