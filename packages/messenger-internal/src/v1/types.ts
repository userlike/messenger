import { Result, Credentials } from "../shared";
import {
  MessengerActionsApi,
  MessengerStateApi,
  MountOptions,
} from "../shared/types";

export interface Api extends ApiActions, MessengerStateApi {
  version: 1;
}

export type ApiState = MessengerStateApi;

export interface ApiActions extends MessengerActionsApi {
  /**
   * Create the messenger.
   * When credentials are provided those will be used for authentication.
   */
  mount(opts?: MountOptions): Promise<Result<void, string>>;

  /**
   * Destroy the messenger.
   */
  unmount(): Promise<Result<void, string>>;

  /**
   * Experimental.
   * Consumes a short living token to returns long living Credentials.
   */
  __unstableConsumeToken(token: string): Promise<Result<Credentials, string>>;
}
