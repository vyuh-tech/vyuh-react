import { Plugin } from '@/core/plugin';

/**
 * Base class for all events in a Vyuh application
 */
export class VyuhEvent<T = any> {
  /**
   * The name of the event, used for identification and logging
   */
  readonly name: string;

  /**
   * When the event was created
   */
  readonly timestamp: Date;

  /**
   * Optional data associated with the event
   */
  readonly data?: T;

  /**
   * Creates a new event
   *
   * @param name The name of the event
   * @param data Optional data associated with the event
   */
  constructor(name: string, data?: T) {
    this.name = name;
    this.timestamp = new Date();
    this.data = data;
  }
}

/**
 * A function that handles events of type T
 */
export type EventListener = (event: VyuhEvent) => void;

/**
 * A function that can be called to dispose of (cancel) an event subscription
 */
export type DisposeFunction = () => void;

/**
 * Plugin for event handling in Vyuh applications
 *
 * The event plugin provides a pub/sub system for decoupled communication
 * between different parts of the application.
 */
export abstract class EventPlugin extends Plugin {
  /**
   * Subscribe to events of type T
   *
   * @param name The name of the event
   * @param listener The function to call when an event is emitted
   * @returns A dispose function that can be called to cancel the subscription
   */
  abstract on(name: string, listener: EventListener): DisposeFunction;

  /**
   * Subscribe to a single occurrence of an event of type T
   *
   * @param name The name of the event
   * @param listener The function to call when an event is emitted
   */
  abstract once(name: string, listener: EventListener): void;

  /**
   * Emit an event to all subscribers
   *
   * @param event The event to emit
   */
  abstract emit(event: VyuhEvent): void;
}
