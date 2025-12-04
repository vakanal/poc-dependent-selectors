// Command Handlers - Handle state changes
import type { ICommandHandler, Result } from './index';
import type { 
  SelectCategoryCommand, 
  UnselectCategoryCommand, 
  SelectSubCategoryCommand 
} from './commands';
import type { ICategoryRepository, IEventPublisher } from '../usecases';
import { CategoryIdVO } from '../../domain/entities';

export class SelectCategoryHandler implements ICommandHandler<SelectCategoryCommand> {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async handle(command: SelectCategoryCommand): Promise<Result<void>> {
    try {
      const categoryIdVO = new CategoryIdVO(command.categoryId);
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

      // Publish domain event
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

export class UnselectCategoryHandler implements ICommandHandler<UnselectCategoryCommand> {
  async handle(command: UnselectCategoryCommand): Promise<Result<void>> {
    try {
      // Logic to unselect category
      console.log(`Unselecting category: ${command.categoryId}`);
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }
}

export class SelectSubCategoryHandler implements ICommandHandler<SelectSubCategoryCommand> {
  async handle(command: SelectSubCategoryCommand): Promise<Result<void>> {
    try {
      // Logic to select subcategory
      console.log(`Selecting subcategory: ${command.subCategoryId} for category: ${command.categoryId}`);
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }
}