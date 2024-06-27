import {
  ActionResult,
  Credentials,
  MountOptions,
  Observable,
} from "../shared";

export interface Api {
  version: 2;

  /**
   * Returns an observable. The messenger mounts when the observable is
   * subscribed to and unmounts when the unsubscribing from the observable.
   *
   * The messenger can recreate itself under certain conditions. For example
   * when a website router switches to another widget, the observable will emit
   * a new {@link Api} instance.
   *
   * When credentials are provided those will be used for authentication.
   */
  mount(opts?: MountOptions): Observable<ActionResult<string, Api>>;

  /**
   * Experimental.
   * Consumes a short living token to returns long living Credentials.
   */
  __unstableConsumeToken(
    token: string,
  ): Promise<ActionResult<string, Credentials>>;
}

export type { MessengerApi } from "../shared";
