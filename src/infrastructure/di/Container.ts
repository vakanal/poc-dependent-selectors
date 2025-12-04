// Infrastructure Layer - Dependency Injection Container
import { GetCategoriesUseCase, SelectCategoryUseCase, type ICategoryRepository, type IEventPublisher } from '../../application/usecases';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { EventPublisher } from '../events/EventPublisher';
import { CQRSRegistry } from '../../application/cqrs/registry';

// Service Locator Pattern
export class DIContainer {
  private static instance: DIContainer;
  private services = new Map<string, unknown>();
  private factories = new Map<string, () => unknown>();

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  register<T>(key: string, factory: () => T): void {
    this.factories.set(key, factory);
  }

  registerSingleton<T>(key: string, factory: () => T): void {
    const instance = factory();
    this.services.set(key, instance);
  }

  get<T>(key: string): T {
    // Check if singleton exists
    if (this.services.has(key)) {
      return this.services.get(key) as T;
    }

    // Check if factory exists
    if (this.factories.has(key)) {
      const factory = this.factories.get(key);
      if (factory) {
        const instance = factory() as T;
        this.services.set(key, instance);
        return instance;
      }
    }

    throw new Error(`Service ${key} not registered`);
  }

  clear(): void {
    this.services.clear();
    this.factories.clear();
  }
}

// Service Registration
export function registerServices(): void {
  const container = DIContainer.getInstance();

  // Infrastructure Services
  container.registerSingleton<ICategoryRepository>(
    'CategoryRepository',
    () => new CategoryRepository()
  );

  container.registerSingleton<IEventPublisher>(
    'EventPublisher',
    () => new EventPublisher()
  );

  // CQRS Services
  container.registerSingleton<CQRSRegistry>(
    'CQRSRegistry',
    () => new CQRSRegistry(
      container.get<ICategoryRepository>('CategoryRepository'),
      container.get<IEventPublisher>('EventPublisher')
    )
  );

  // Application Services (Use Cases)
  container.register<GetCategoriesUseCase>(
    'GetCategoriesUseCase',
    () => new GetCategoriesUseCase(container.get<ICategoryRepository>('CategoryRepository'))
  );

  container.register<SelectCategoryUseCase>(
    'SelectCategoryUseCase',
    () => new SelectCategoryUseCase(
      container.get<ICategoryRepository>('CategoryRepository'),
      container.get<IEventPublisher>('EventPublisher')
    )
  );
}

// Service Factory
export class ServiceFactory {
  static getCategoriesUseCase(): GetCategoriesUseCase {
    return DIContainer.getInstance().get<GetCategoriesUseCase>('GetCategoriesUseCase');
  }

  static getSelectCategoryUseCase(): SelectCategoryUseCase {
    return DIContainer.getInstance().get<SelectCategoryUseCase>('SelectCategoryUseCase');
  }

  static getCQRSRegistry(): CQRSRegistry {
    return DIContainer.getInstance().get<CQRSRegistry>('CQRSRegistry');
  }
}