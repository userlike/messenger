import { ActionResult } from "../ActionResult";
import { Observable } from "../Observable";

export interface Api extends ApiActions, ApiState {
  version: 1;
}

export enum UI {
  Hidden = "hidden",
  Minimized = "minimized",
  Maximized = "maximized",
}

export interface State {
  ui: UI;
}

export interface ApiState {
  state$: Observable<State>;
  getState(): State;
}

export interface ApiActions {
  /**
   * Render the messenger.
   *
   * Messenger must not be mounted.
   */
  mount(): Promise<ActionResult<string, void>>;

  /**
   * Remove the messenger.
   *
   * Messenger must be mounted.
   */
  unmount(): Promise<ActionResult<string, void>>;

  logout(): Promise<ActionResult<string, void>>;

  /**
   * Simulate as if the contact clicked the messenger button.
   *
   * This is a no-op if it's already maximized.
   */
  maximize(): Promise<ActionResult<string, void>>;

  /**
   * Set custom data.
   */
  setCustomData(
    data: Record<string, unknown>
  ): Promise<ActionResult<string, void>>;

  /**
   * Set contact info.
   */
  setContactInfo(data: {
    name?: string;
    email?: string;
  }): Promise<ActionResult<string, void>>;
}
