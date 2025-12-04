// Command and Query Buses - CQRS Infrastructure
import type { ICommandBus, IQueryBus, ICommandHandler, IQueryHandler, Result } from './index';
import type { ICommand, IQuery } from './index';

export class CommandBus implements ICommandBus {
  private handlers = new Map<string, ICommandHandler<ICommand>>();

  register<TCommand extends ICommand>(
    commandType: string,
    handler: ICommandHandler<TCommand>
  ): void {
    this.handlers.set(commandType, handler as ICommandHandler<ICommand>);
  }

  async dispatch<TCommand extends ICommand>(command: TCommand): Promise<Result<void>> {
    const handler = this.handlers.get(command.type);
    
    if (!handler) {
      return {
        success: false,
        error: new Error(`No handler registered for command type: ${command.type}`)
      };
    }

    try {
      await handler.handle(command);
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }
}

export class QueryBus implements IQueryBus {
  private handlers = new Map<string, IQueryHandler<IQuery, unknown>>();

  register<TQuery extends IQuery, TResult>(
    queryType: string,
    handler: IQueryHandler<TQuery, TResult>
  ): void {
    this.handlers.set(queryType, handler as IQueryHandler<IQuery, unknown>);
  }

  async execute<TQuery extends IQuery, TResult>(query: TQuery): Promise<Result<TResult>> {
    const handler = this.handlers.get(query.type);
    
    if (!handler) {
      return {
        success: false,
        error: new Error(`No handler registered for query type: ${query.type}`)
      };
    }

    try {
      const result = await handler.handle(query);
      return result as Result<TResult>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }
}