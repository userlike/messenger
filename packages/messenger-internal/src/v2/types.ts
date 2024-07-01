import {
  ActionResult,
  Credentials,
  MessengerApi,
  MountOptions,
  Observable,
} from "../shared";

export interface Api {
  version: 2;

  /**
   * Returns an observable. The messenger mounts when the observable is
   * subscribed to and unmounts when the unsubscribing from the observable.
   *
   * When credentials are provided those will be used for authentication.
   *
   * The messenger can recreate itself under certain conditions. For example
   * when a website router switches to another widget, the observable will emit
   * a new {@link Messenger} instance.
   */
  mount(opts?: MountOptions): Observable<ActionResult<string, Messenger>>;

  /**
   * Experimental.
   * Consumes a short living token to returns long living Credentials.
   */
  __unstableConsumeToken(
    token: string,
  ): Promise<ActionResult<string, Credentials>>;
}

export interface Messenger extends MessengerApi {}
