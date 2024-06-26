import { ActionResult, Credentials } from "../shared";
import { CoreApiActions, CoreApiState, MountOptions } from "../shared/types";

export interface Api extends ApiActions, CoreApiState {
  version: 1;
}

export type ApiState = CoreApiState;

export interface ApiActions extends CoreApiActions {
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
