// Logging and Monitoring System
import type { Result } from '../application/usecases';
import type { SecurityEvent } from './security';

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

// Log entry interface
export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  error?: Error;
  performance?: {
    duration?: number;
    memoryUsage?: number;
  };
}

// Metrics interface
export interface MetricEntry {
  name: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
  unit?: string;
}

// Logger configuration
export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  maxLogSize: number;
  retentionDays: number;
}

// Abstract logger interface
export interface ILogger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error, context?: Record<string, unknown>): void;
  fatal(message: string, error?: Error, context?: Record<string, unknown>): void;
}

// Performance monitoring decorator
export function LogPerformance<T extends (...args: unknown[]) => Promise<unknown>>(
  _target: unknown,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> {
  const method = descriptor.value!;
  
  descriptor.value = async function (this: unknown, ...args: unknown[]) {
    const startTime = performance.now();
    const startMemory = (performance as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize || 0;
    
    try {
      const result = await method.apply(this, args);
      const endTime = performance.now();
      const endMemory = (performance as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize || 0;
      
      logger.info(`Method ${propertyName} executed successfully`, {
        method: propertyName,
        duration: endTime - startTime,
        memoryDelta: endMemory - startMemory,
        args: args.length
      });
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      
      logger.error(`Method ${propertyName} failed`, error as Error, {
        method: propertyName,
        duration: endTime - startTime,
        args: args.length
      });
      
      throw error;
    }
  } as T;
  
  return descriptor;
}

// Enterprise Logger implementation
export class EnterpriseLogger implements ILogger {
  private logs: LogEntry[] = [];
  private metrics: MetricEntry[] = [];
  private config: LoggerConfig;
  
  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: false,
      enableRemote: false,
      maxLogSize: 10000,
      retentionDays: 30,
      ...config
    };
  }
  
  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }
  
  private createLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date(),
      level,
      message,
      context,
      sessionId: this.getSessionId(),
      requestId: this.getRequestId()
    };
  }
  
  private writeLog(entry: LogEntry): void {
    // Add to memory buffer
    this.logs.push(entry);
    
    // Trim if exceeds max size
    if (this.logs.length > this.config.maxLogSize) {
      this.logs = this.logs.slice(-this.config.maxLogSize);
    }
    
    // Console output
    if (this.config.enableConsole) {
      const logMethod = this.getConsoleMethod(entry.level);
      const contextStr = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : '';
      logMethod(`[${entry.timestamp.toISOString()}] ${entry.message}${contextStr}`);
    }
    
    // Remote logging (in production)
    if (this.config.enableRemote && this.config.remoteEndpoint && import.meta.env.PROD) {
      this.sendToRemote(entry).catch(console.error);
    }
  }
  
  private getConsoleMethod(level: LogLevel): Console['log'] {
    switch (level) {
      case LogLevel.DEBUG: return console.debug;
      case LogLevel.INFO: return console.info;
      case LogLevel.WARN: return console.warn;
      case LogLevel.ERROR: return console.error;
      case LogLevel.FATAL: return console.error;
      default: return console.log;
    }
  }
  
  private async sendToRemote(entry: LogEntry): Promise<void> {
    try {
      await fetch(this.config.remoteEndpoint!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      console.error('Failed to send log to remote endpoint:', error);
    }
  }
  
  private getSessionId(): string {
    // In a real app, this would come from auth/session management
    return sessionStorage.getItem('sessionId') || 'anonymous';
  }
  
  private getRequestId(): string {
    // In a real app, this would be generated per request
    return crypto.randomUUID();
  }
  
  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    this.writeLog(this.createLogEntry(LogLevel.DEBUG, message, context));
  }
  
  info(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    this.writeLog(this.createLogEntry(LogLevel.INFO, message, context));
  }
  
  warn(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    this.writeLog(this.createLogEntry(LogLevel.WARN, message, context));
  }
  
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    const entry = this.createLogEntry(LogLevel.ERROR, message, context);
    if (error) entry.error = error;
    this.writeLog(entry);
  }
  
  fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.FATAL)) return;
    const entry = this.createLogEntry(LogLevel.FATAL, message, context);
    if (error) entry.error = error;
    this.writeLog(entry);
  }
  
  // Metrics collection
  recordMetric(name: string, value: number, tags?: Record<string, string>, unit?: string): void {
    const metric: MetricEntry = {
      name,
      value,
      timestamp: new Date(),
      tags,
      unit
    };
    
    this.metrics.push(metric);
    
    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }
  
  // Analytics methods
  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filtered = this.logs;
    if (level !== undefined) {
      filtered = filtered.filter(log => log.level === level);
    }
    return limit ? filtered.slice(-limit) : filtered;
  }
  
  getMetrics(name?: string, since?: Date): MetricEntry[] {
    let filtered = this.metrics;
    if (name) {
      filtered = filtered.filter(metric => metric.name === name);
    }
    if (since) {
      filtered = filtered.filter(metric => metric.timestamp >= since);
    }
    return filtered;
  }
  
  getErrorRate(since?: Date): number {
    const totalLogs = since ? this.getLogs(undefined, undefined).filter(log => log.timestamp >= since) : this.logs;
    const errorLogs = totalLogs.filter(log => log.level >= LogLevel.ERROR);
    return totalLogs.length > 0 ? errorLogs.length / totalLogs.length : 0;
  }
  
  getAverageResponseTime(operationName: string, since?: Date): number {
    const relevantMetrics = this.getMetrics(`${operationName}_duration`, since);
    if (relevantMetrics.length === 0) return 0;
    
    const total = relevantMetrics.reduce((sum, metric) => sum + metric.value, 0);
    return total / relevantMetrics.length;
  }
  
  clear(): void {
    this.logs = [];
    this.metrics = [];
  }
}

// Specialized loggers
export class SecurityLogger {
  constructor(private logger: ILogger) {}
  
  logSecurityEvent(event: SecurityEvent): void {
    this.logger.warn(`Security event: ${event.type}`, {
      type: event.type,
      ip: event.ip,
      userAgent: event.userAgent,
      details: event.details
    });
  }
  
  logXSSAttempt(input: string, ip?: string): void {
    this.logger.warn('XSS attempt detected', {
      input,
      ip,
      type: 'XSS_ATTEMPT'
    });
  }
  
  logSQLInjectionAttempt(input: string, ip?: string): void {
    this.logger.warn('SQL injection attempt detected', {
      input,
      ip,
      type: 'SQL_INJECTION_ATTEMPT'
    });
  }
}

export class PerformanceLogger {
  constructor(private logger: ILogger, private enterpriseLogger: EnterpriseLogger) {}
  
  logOperationStart(operation: string, context?: Record<string, unknown>): string {
    const operationId = crypto.randomUUID();
    this.logger.debug(`Starting operation: ${operation}`, {
      operationId,
      operation,
      ...context
    });
    return operationId;
  }
  
  logOperationEnd(operationId: string, operation: string, duration: number, success: boolean): void {
    this.logger.info(`Operation completed: ${operation}`, {
      operationId,
      operation,
      duration,
      success
    });
    
    this.enterpriseLogger.recordMetric(`${operation}_duration`, duration, { success: success.toString() }, 'ms');
    this.enterpriseLogger.recordMetric(`${operation}_success`, success ? 1 : 0, { success: success.toString() }, 'count');
  }
  
  logMemoryUsage(operation: string): void {
    const memory = (performance as { memory?: { usedJSHeapSize?: number; totalJSHeapSize?: number; jsHeapSizeLimit?: number } }).memory;
    if (memory) {
      this.logger.debug(`Memory usage for ${operation}`, {
        operation,
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      });
      
      this.enterpriseLogger.recordMetric('memory_used', memory.usedJSHeapSize || 0, { operation }, 'bytes');
    }
  }
}

// Create and export singleton instances
export const logger = new EnterpriseLogger({
  level: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: true,
  enableRemote: import.meta.env.PROD,
  remoteEndpoint: import.meta.env.VITE_LOGGING_ENDPOINT
});

export const securityLogger = new SecurityLogger(logger);
export const performanceLogger = new PerformanceLogger(logger, logger);

// Utility function for logging function results
export const logResult = <T>(
  operation: string,
  result: Result<T>,
  context?: Record<string, unknown>
): T | null => {
  if (result.success) {
    logger.info(`${operation} succeeded`, context);
    return result.data;
  } else {
    logger.error(`${operation} failed`, result.error, context);
    return null;
  }
};