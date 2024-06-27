import { ActionResult, Credentials } from "../shared";
import { MessengerActionsApi, MessengerStateApi, MountOptions } from "../shared/types";

export interface Api extends ApiActions, MessengerStateApi {
  version: 1;
}

export type ApiState = MessengerStateApi;

export interface ApiActions extends MessengerActionsApi {
  /**
   * Create the messenger.
   * When credentials are provided those will be used for authentication.
   */
  mount(opts?: MountOptions): Promise<ActionResult<string, void>>;

  /**
   * Destroy the messenger.
   */
  unmount(): Promise<ActionResult<string, void>>;

  /**
   * Experimental.
   * Consumes a short living token to returns long living Credentials.
   */
  __unstableConsumeToken(
    token: string,
  ): Promise<ActionResult<string, Credentials>>;
}
