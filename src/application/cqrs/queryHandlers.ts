// Query Handlers - Handle data retrieval
import type { IQueryHandler, Result } from './index';
import type { 
  GetCategoriesQuery, 
  GetSubCategoriesQuery, 
  GetSelectedCategoryQuery 
} from './commands';
import type { ICategoryRepository } from '../usecases';
import { CategoryEntity } from '../../domain/entities';

export class GetCategoriesHandler implements IQueryHandler<GetCategoriesQuery, CategoryEntity[]> {
  constructor(
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async handle(query: GetCategoriesQuery): Promise<Result<CategoryEntity[]>> {
    try {
      void query.type; // Use the parameter to avoid unused warning
      const result = await this.categoryRepository.findAll();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }
}

export class GetSubCategoriesHandler implements IQueryHandler<GetSubCategoriesQuery, unknown[]> {
  async handle(query: GetSubCategoriesQuery): Promise<Result<unknown[]>> {
    try {
      // Logic to get subcategories by category
      console.log(`Getting subcategories for category: ${query.categoryId}`);
      void query.categoryId; // Use the parameter to avoid unused warning
      return { success: true, data: [] as unknown[] };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }
}

export class GetSelectedCategoryHandler implements IQueryHandler<GetSelectedCategoryQuery, string | null> {
  async handle(query: GetSelectedCategoryQuery): Promise<Result<string | null>> {
    try {
      // Logic to get selected category
      console.log('Getting selected category');
      void query.type; // Use the parameter to avoid unused warning
      return { success: true, data: null };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }
}