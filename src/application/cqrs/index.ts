// CQRS - Command Query Responsibility Segregation
// Commands represent intentions to change state
export interface ICommand {
  type: string;
  timestamp: Date;
  aggregateId: string;
}

export interface IQuery {
  type: string;
  timestamp: Date;
}

// Command Handlers
export interface ICommandHandler<TCommand extends ICommand, TResult = void> {
  handle(command: TCommand): Promise<Result<TResult>>;
}

// Query Handlers
export interface IQueryHandler<TQuery extends IQuery, TResult> {
  handle(query: TQuery): Promise<Result<TResult>>;
}

// Command Bus
export interface ICommandBus {
  dispatch<TCommand extends ICommand>(command: TCommand): Promise<Result<void>>;
  register<TCommand extends ICommand>(
    commandType: string,
    handler: ICommandHandler<TCommand>
  ): void;
}

// Query Bus
export interface IQueryBus {
  execute<TQuery extends IQuery, TResult>(query: TQuery): Promise<Result<TResult>>;
  register<TQuery extends IQuery, TResult>(
    queryType: string,
    handler: IQueryHandler<TQuery, TResult>
  ): void;
}

// Result type for error handling
export type Result<T, E = Error> = {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
};