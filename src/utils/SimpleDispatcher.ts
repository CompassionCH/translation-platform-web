
type Listener<T> = (data: T) => void;

class SimpleDispatcher<T> {
  private listeners: Listener<T>[] = [];

  subscribe(listener: Listener<T>) {
    this.listeners.push(listener);
  }

  unsubscribe(listener: Listener<T>) {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }

  emit(event: T) {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
};

export default SimpleDispatcher;