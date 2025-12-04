// Application Layer - Use Cases
import { CategoryEntity, CategoryIdVO, type DomainEvent } from '../domain/entities';

// Result Pattern for Error Handling
export type Result<T, E = Error> = {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
};

// Repository Interfaces (Ports)
export interface ICategoryRepository {
  findAll(): Promise<Result<CategoryEntity[], Error>>;
  findById(id: CategoryIdVO): Promise<Result<CategoryEntity | null, Error>>;
}

export interface IEventPublisher {
  publish(event: DomainEvent): Promise<void>;
}

// Use Cases (Application Services)
export interface GetCategoriesQuery {
  execute(): Promise<Result<CategoryEntity[], Error>>;
}

export interface SelectCategoryCommand {
  execute(categoryId: string): Promise<Result<void, Error>>;
}

export class GetCategoriesUseCase implements GetCategoriesQuery {
  constructor(
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(): Promise<Result<CategoryEntity[], Error>> {
    try {
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

export class SelectCategoryUseCase implements SelectCategoryCommand {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(categoryId: string): Promise<Result<void, Error>> {
    try {
      const categoryIdVO = new CategoryIdVO(categoryId);
      const categoryResult = await this.categoryRepository.findById(categoryIdVO);
      
      if (!categoryResult.success) {
        return categoryResult;
      }

      if (!categoryResult.data) {
        return {
          success: false,
          error: new Error('Category not found')
        };
      }

      const event = categoryResult.data.select();
      await this.eventPublisher.publish(event);

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }
}