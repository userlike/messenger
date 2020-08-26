import type { ActionResult } from "../ActionResult";
import type { Observable } from "./Observable";

export interface Api extends ApiActions, ApiState {
  version: 1;
}

export enum UIState {
  Hidden = "hidden",
  Minimized = "minimized",
  Maximized = "maximized",
}

export interface State {
  ui: UIState;
  conversations: Conversation[];
}

export interface Conversation {
  id: number;
  messages: Message[];
  unread: Message[];
}

export interface Message {
  id: string;
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

  /**
   * Experimental.
   */
  __unstableStartConversation(): Promise<ActionResult<string, void>>;

  /**
   * Experimental.
   */
  __unstableStartConversationWithOperator(
    operatorId: number
  ): Promise<ActionResult<string, void>>;
}
