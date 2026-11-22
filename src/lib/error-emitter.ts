import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

// Define the types for the events you want to emit
type AppEvents = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// Extend the EventEmitter class with our defined event types
class TypedEventEmitter<TEvents extends Record<string, any>> {
  private emitter = new EventEmitter();

  on<TEventName extends keyof TEvents>(
    eventName: TEventName,
    listener: TEvents[TEventName]
  ) {
    this.emitter.on(eventName as string, listener);
  }

  off<TEventName extends keyof TEvents>(
    eventName: TEventName,
    listener: TEvents[TEventName]
  ) {
    this.emitter.off(eventName as string, listener);
  }

  emit<TEventName extends keyof TEvents>(
    eventName: TEventName,
    ...args: Parameters<TEvents[TEventName]>
  ) {
    this.emitter.emit(eventName as string, ...args);
  }
}

// Create a singleton instance of our typed event emitter
export const errorEmitter = new TypedEventEmitter<AppEvents>();
