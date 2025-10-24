import { EventEmitter } from "events";

export class SafeEventEmitter extends EventEmitter {
  override emit(event: string, ...args: any[]): boolean {
    const listeners = this.listeners(event);
    for (const listener of listeners) {
      try {
        listener(...args);
      } catch (err) {
        console.error(`[Event:${event}] Script error:`, err);
      }
    }
    return listeners.length > 0;
  }
}