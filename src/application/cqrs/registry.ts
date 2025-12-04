// CQRS Registration - Register all handlers with buses
import { CommandBus, QueryBus } from './buses';
import { 
  SelectCategoryHandler, 
  UnselectCategoryHandler, 
  SelectSubCategoryHandler 
} from './commandHandlers';
import { 
  GetCategoriesHandler, 
  GetSubCategoriesHandler, 
  GetSelectedCategoryHandler 
} from './queryHandlers';
import type { ICategoryRepository, IEventPublisher } from '../usecases';

export class CQRSRegistry {
  private commandBus: CommandBus;
  private queryBus: QueryBus;

  constructor(
    categoryRepository: ICategoryRepository,
    eventPublisher: IEventPublisher
  ) {
    this.commandBus = new CommandBus();
    this.queryBus = new QueryBus();
    
    this.registerHandlers(categoryRepository, eventPublisher);
  }

  private registerHandlers(
    categoryRepository: ICategoryRepository,
    eventPublisher: IEventPublisher
  ): void {
    // Register Command Handlers
    this.commandBus.register(
      'SelectCategory',
      new SelectCategoryHandler(categoryRepository, eventPublisher)
    );
    
    this.commandBus.register(
      'UnselectCategory',
      new UnselectCategoryHandler()
    );
    
    this.commandBus.register(
      'SelectSubCategory',
      new SelectSubCategoryHandler()
    );

    // Register Query Handlers
    this.queryBus.register(
      'GetCategories',
      new GetCategoriesHandler(categoryRepository)
    );
    
    this.queryBus.register(
      'GetSubCategories',
      new GetSubCategoriesHandler()
    );
    
    this.queryBus.register(
      'GetSelectedCategory',
      new GetSelectedCategoryHandler()
    );
  }

  getCommandBus(): CommandBus {
    return this.commandBus;
  }

  getQueryBus(): QueryBus {
    return this.queryBus;
  }
}