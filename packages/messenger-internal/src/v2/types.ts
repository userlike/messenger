import {
  Result,
  Credentials,
  MessengerApi,
  MountOptions,
  Observable,
} from "../shared";

export type MountResult =
| { kind: 'success', value: Messenger }
| { kind: 'success', value: null, reason: string }
| { kind: 'error', error: string }

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
  mount(opts?: MountOptions): Observable<MountResult>;

  /**
   * Experimental.
   * Consumes a short living token to returns long living Credentials.
   */
  __unstableConsumeToken(token: string): Promise<Result<Credentials, string>>;
}

export interface Messenger extends MessengerApi {}
