// Infrastructure Layer - Event Publisher
import type { DomainEvent } from '../../domain/entities';
import type { IEventPublisher } from '../../application/usecases';

export class EventPublisher implements IEventPublisher {
  private subscribers = new Map<string, Set<(event: DomainEvent) => void>>();

  async publish(event: DomainEvent): Promise<void> {
    const subscribers = this.subscribers.get(event.type);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error(`Error in event subscriber for ${event.type}:`, error);
        }
      });
    }
  }

  subscribe(eventType: string, callback: (event: DomainEvent) => void): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    
    this.subscribers.get(eventType)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.get(eventType)?.delete(callback);
    };
  }

  clear(): void {
    this.subscribers.clear();
  }
}