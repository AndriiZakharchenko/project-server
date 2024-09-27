type TypeListener = Record<string, {
  event: Function,
  once?: Boolean
}[]>;

export class EventEmitter {
  private listeners: TypeListener = {}

  /**
   * Adds a new listener function to the specified event.
   * @param {string} eventName - Name of the event.
   * @param {EventListener} fn - Listener function.
   * @param {boolean} [once=false] - A boolean flag indicating if the listener should be invoked only once.
   * @returns {EventEmitter} - EventEmitter instance.
   */
  addListener(eventName: string, fn: Function, once?: boolean) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push({
      event: fn,
      once
    });
  }

  /**
   * Alias for addListener method.
   * @param {string} eventName - Name of the event.
   * @param {EventListener} fn - Listener function.
   * @returns {EventEmitter} - Current EventEmitter instance.
   */
  on(eventName: string, fn: Function) {
    this.addListener(eventName, fn);
  }

  /**
   * Adds a one-time listener function for the event. Once invoked, it is removed.
   * @param {string} eventName - Name of the event.
   * @param {EventListener} fn - Listener function.
   * @returns {EventEmitter} - EventEmitter instance.
   */
  once(eventName: string, fn: Function) {
    this.addListener(eventName, fn, true);
  }

  /**
   * Synchronously calls each of the listeners registered for the event named eventName,
   * in the order they were registered, passing the supplied arguments to each.
   * @param {string} eventName - Name of the event.
   * @param {...any[]} args - The arguments to be passed to each listener function.
   * @returns {boolean} - True if the event had listeners, false otherwise.
   */
  emit(eventName: string, ...args: any[]) {
    if (this.listeners.hasOwnProperty(eventName)) {
      let updatedListeners = [];

      for (const listener of this.listeners[eventName]) {
        listener.event.call(this.listeners[eventName], args);

        if (!listener.once) {
          updatedListeners.push(listener);
        }
      }

      this.listeners[eventName] = updatedListeners;
    } else {
      console.error(`Event ${eventName} was not found`);
      return false;
    }
  }

  /**
   * Removes the specified listener for the event.
   * @param {string} eventName - Name of the event.
   * @param {EventListener} fn - Listener function.
   * @returns {EventEmitter} - EventEmitter instance.
   */
  removeListener(eventName: string, fn: Function) {
    if (this.listeners.hasOwnProperty(eventName)) {
      for (let i = 0; i < this.listeners[eventName].length; i++) {
        if (this.listeners[eventName][i].event === fn) {
          this.listeners[eventName].splice(i, 1);
        }
      }
    } else {
      console.error(`Event ${eventName} was not found`);
    }
  }

  /**
   * Alias for removeListener method.
   * @param {string} eventName - Name of the event.
   * @param {EventListener} fn - Listener function.
   * @returns {EventEmitter} - EventEmitter instance.
   */
  off(eventName: string, fn: Function) {
    this.removeListener(eventName, fn);
  }

  /**
   * Returns the number of listeners listening to the type of event.
   * @param {string} eventName - Name of the event.
   * @returns {number} - The number of listeners for the event.
   */
  listenerCount(eventName: string) {
    if (this.listeners.hasOwnProperty(eventName)) {
      return Object.keys(this.listeners[eventName]).length;
    } else {
      return 0;
    }
  }

  /**
   * Returns a copy of the array of listeners for the event.
   * @param {string} eventName - Name of the event.
   * @returns {EventListener[]} - An array of listener functions for the event.
   */
  rawListeners(eventName: string) {
    if (this.listeners.hasOwnProperty(eventName)) {
      return this.listeners[eventName].map((listener) => listener.event);
    } else {
      return [];
    }
  }
}
