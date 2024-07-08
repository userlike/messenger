import { ActionResult } from "./Result";
import { Observable } from "./Observable";

export interface MountOptions {
  credentials?: Credentials;
  externalToken?: {
    getToken: () => Promise<string>;
    onError?: (e: string) => void;
  };
}

export interface MessengerApi extends MessengerActionsApi, MessengerStateApi {}

export interface MessengerStateApi {
  state$: Observable<State>;
  getState(): State;
}

export interface MessengerActionsApi {
  /**
   * Control the visibility of messenger features.
   */
  setVisibility(
    conf: VisibilityConfiguration,
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
    data: Record<string, unknown>,
  ): Promise<ActionResult<string, void>>;

  /**
   * Set contact info.
   */
  setContactInfo(
    data: Partial<ContactInfo>,
  ): Promise<ActionResult<string, void>>;

  /**
   * Experimental.
   */
  __unstableStartConversation(): Promise<ActionResult<string, void>>;

  /**
   * Experimental.
   */
  __unstableStartConversationWithOperator(
    operatorId: number,
  ): Promise<ActionResult<string, void>>;

  /**
   * Experimental.
   * Opens a conversation by id.
   */
  __unstableOpenConversation(id: number): Promise<ActionResult<string, void>>;

  /**
   * Experimental.
   */
  __unstableSetRegistration(
    enabled: boolean,
  ): Promise<ActionResult<string, void>>;

  /**
   * Experimental.
   */
  __unstableSetProactive(enabled: boolean): Promise<ActionResult<string, void>>;
}

export interface State {
  state: MessengerState;
  conversations: Conversation[];
  contact: ContactInfo;
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

export interface ContactInfo {
  name: string | null;
  email: string | null;
  phone_number: string | null;
  mobile_number: string | null;
  company: string | null;
  external_customer_id: string | null;
}

export interface Message {
  id: string;
}

/**
 * @deprecated
 */
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

export interface Credentials {
  token: string;
  uuid: string;
}
