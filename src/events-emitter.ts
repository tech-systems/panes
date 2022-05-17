// Add listeners
export function on(events, handler, priority): void {
  if (!this.eventsListeners) {
    return;
  }
  if (typeof handler !== 'function') {
    return;
  }
  const method = priority ? 'unshift' : 'push';
  events.split(' ').forEach((event) => {
    if (!this.eventsListeners[event]) {
      this.eventsListeners[event] = [];
    }
    this.eventsListeners[event][method](handler);
  });
}

// Emit events
export function emit(...args): void {
  if (!this.eventsListeners) {
    return;
  }
  let events = args[0];
  let data = args.slice(1, args.length);
  const eventsArray = Array.isArray(events) ? events : events.split(' ');
  eventsArray.forEach((event) => {
    if (this.eventsListeners?.[event]) {
      this.eventsListeners[event].forEach(
        (eventHandler) => eventHandler.apply(this, data)
      );
    }
  });
}