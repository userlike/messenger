/**
 * This is the interface for observables as defined in
 * https://github.com/tc39/proposal-observable. It's a proposal, but lots of
 * libraries implement this interface. Most prominent one is rxjs, which is also
 * used by Angular.
 */
export interface Observable<T> {
  // Subscribes to the sequence with an observer
  subscribe(observer: Observer<T>): Subscription;

  // Subscribes to the sequence with callbacks
  subscribe(
    onNext: (v: T) => void,
    onError?: (err: unknown) => void,
    onComplete?: () => void
  ): Subscription;
}

export interface Subscription {
  // Cancels the subscription
  unsubscribe(): void;

  // A boolean value indicating whether the subscription is closed
  closed: boolean;
}

export interface Observer<T> {
  // Receives the next value in the sequence
  next(value: T): void;

  // Receives the sequence error
  error(errorValue: unknown): void;

  // Receives a completion notification
  complete(): void;
}
