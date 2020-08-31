import type { ActionResult } from "../ActionResult";
import type { Observable } from "./Observable";

export interface Api extends ApiActions, ApiState {
  version: 1;
}

export interface ApiState {
  state$: Observable<State>;
  getState(): State;
}

export interface ApiActions {
  /**
   * Create the messenger.
   */
  mount(): Promise<ActionResult<string, void>>;

  /**
   * Destroy the messenger.
   */
  unmount(): Promise<ActionResult<string, void>>;

  /**
   * If the messenger is hidden, show it.
   */
  show(): Promise<ActionResult<string, void>>;

  /**
   * Hide the messenger.
   */
  hide(): Promise<ActionResult<string, void>>;

  /**
   * Delete contact's session and restart messenger.
   */
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

  /**
   * Experimental.
   */
  __unstableSetRegistration(
    enabled: boolean
  ): Promise<ActionResult<string, void>>;

  /**
   * Experimental.
   */
  __unstableSetProactive(enabled: boolean): Promise<ActionResult<string, void>>;
}

export interface State {
  ui: UIState;
  conversations: Conversation[];
  contact: {
    name: string | null;
    email: string | null;
  };
}

export enum UIState {
  Hidden = "hidden",
  Minimized = "minimized",
  Maximized = "maximized",
}

export interface Conversation {
  id: number;
  messages: Message[];
  unread: Message[];
}

export interface Message {
  id: string;
}

export enum EnableRegistration {
  Normal,
  Registration,
  Proactive,
}
