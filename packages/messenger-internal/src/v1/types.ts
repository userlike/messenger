import type { ActionResult } from "../ActionResult";
import type { Observable } from "./Observable";

export interface Api extends ApiActions, ApiState {
  version: 1;
}

export interface ApiState {
  state$: Observable<State>;
  getState(): State;
}

export interface AuthParams {
  token: string;
  uuid: string;
}

export interface ApiActions {
  /**
   * Create the messenger.
   */
  mount(opts?:  {
    credentials?: AuthParams;
  }): Promise<ActionResult<string, void>>;

  /**
   * Destroy the messenger.
   */
  unmount(): Promise<ActionResult<string, void>>;

  /**
   * Consumes a short living token to returns long living AuthParams.
   */
  consumeToken(token: string): Promise<ActionResult<string, AuthParams>>;

  setVisibility(
    conf: VisibilityConfiguration
  ): Promise<ActionResult<string, void>>;

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
   * Simulate as if the contact clicked the minimize button.
   */
  minimize(): Promise<ActionResult<string, void>>;

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
  state: MessengerState;
  conversations: Conversation[];
  contact: {
    name: string | null;
    email: string | null;
  };
}

export enum MessengerState {
  Hidden = "hidden",
  Minimized = "minimized",
  Maximized = "maximized",
}

export interface Conversation {
  id: number;
  unread: Message[];
  __unstableMessages: Message[];
}

export interface Message {
  id: string;
}

export enum EnableRegistration {
  Normal,
  Registration,
  Proactive,
}

export interface VisibilityConfiguration {
  main: boolean;
  button: boolean;
  notifications: boolean;
}
