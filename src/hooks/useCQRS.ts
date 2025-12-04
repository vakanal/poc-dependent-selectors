// CQRS Hooks - React hooks for CQRS operations
import { useCallback } from 'react';
import { ServiceFactory } from '../infrastructure/di/Container';
import type { 
  SelectCategoryCommand, 
  GetCategoriesQuery,
  GetSubCategoriesQuery 
} from '../application/cqrs/commands';
import type { CategoryEntity } from '../domain/entities';

export function useCQRSCommands() {
  const cqrsRegistry = ServiceFactory.getCQRSRegistry();
  const commandBus = cqrsRegistry.getCommandBus();

  const selectCategory = useCallback(async (categoryId: string): Promise<boolean> => {
    const command: SelectCategoryCommand = {
      type: 'SelectCategory',
      timestamp: new Date(),
      aggregateId: categoryId,
      categoryId
    };

    const result = await commandBus.dispatch(command);
    return result.success;
  }, [commandBus]);

  return {
    selectCategory
  };
}

export function useCQRSQueries() {
  const cqrsRegistry = ServiceFactory.getCQRSRegistry();
  const queryBus = cqrsRegistry.getQueryBus();

  const getCategories = useCallback(async (): Promise<CategoryEntity[]> => {
    const query: GetCategoriesQuery = {
      type: 'GetCategories',
      timestamp: new Date()
    };

    const result = await queryBus.execute(query);
    return result.success ? (result.data as CategoryEntity[]) : [];
  }, [queryBus]);

  const getSubCategories = useCallback(async (categoryId: string): Promise<unknown[]> => {
    const query: GetSubCategoriesQuery = {
      type: 'GetSubCategories',
      timestamp: new Date(),
      categoryId
    };

    const result = await queryBus.execute(query);
    return result.success ? (result.data as unknown[]) : [];
  }, [queryBus]);

  return {
    getCategories,
    getSubCategories
  };
}