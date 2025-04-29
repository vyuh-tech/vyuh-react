import {
  DisposeFunction,
  EventListener,
  EventPlugin,
  VyuhEvent,
} from '@/plugins/event/event-plugin';

/**
 * Default implementation of EventPlugin
 */
export class DefaultEventPlugin extends EventPlugin {
  private eventListeners: Map<string, Set<EventListener>> = new Map();

  constructor() {
    super(
      'vyuh.plugin.event.default',
      'Default Event Plugin',
      true, // Event plugin should be preloaded
    );
  }

  async init(): Promise<void> {
    console.log(`[${this.name}] Initialized`);
  }

  async dispose(): Promise<void> {
    // Clear all event listeners
    this.eventListeners.clear();
    console.log(`[${this.name}] Disposed`);
  }

  /**
   * Subscribe to events of a specific type
   */
  on(name: string, listener: EventListener): DisposeFunction {
    // We use the constructor name as the event type
    const eventType = name;

    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }

    const listeners = this.eventListeners.get(eventType)!;
    listeners.add(listener);

    // Return a dispose function
    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          this.eventListeners.delete(eventType);
        }
      }
    };
  }

  /**
   * Subscribe to a single occurrence of an event
   */
  once(name: string, listener: EventListener): void {
    let dispose: DisposeFunction;

    dispose = this.on(name, (event) => {
      // Call the listener
      listener(event);

      // Unsubscribe after first call
      dispose();
    });
  }

  /**
   * Emit an event to all subscribers
   */
  emit(event: VyuhEvent): void {
    // If no timestamp is provided, add one
    if (!event.timestamp) {
      (event as any).timestamp = new Date();
    }

    // Get event type from the event's constructor
    const eventType = event.name;

    // Get listeners for this event type
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      // Call all listeners
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error(`Error in event listener for ${eventType}:`, error);
        }
      });
    }
  }
}

/**
 * Create a new event
 */
export function createEvent<T = void>(name: string, data?: T): VyuhEvent<T> {
  return new VyuhEvent<T>(name, data);
}

export const SystemReadyEventType = 'vyuh.event.systemReady';
