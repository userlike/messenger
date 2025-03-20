import { Result } from "./Result";
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
  setVisibility(conf: VisibilityConfiguration): Promise<Result<void, string>>;

  /**
   * Delete contact's session and restart messenger.
   */
  logout(): Promise<Result<void, string>>;

  /**
   * Simulate as if the contact clicked the messenger button.
   *
   * This is a no-op if it's already maximized.
   */
  maximize(): Promise<Result<void, string>>;

  /**
   * Simulate as if the contact clicked the minimize button.
   */
  minimize(): Promise<Result<void, string>>;

  /**
   * Set custom data.
   */
  setCustomData(data: Record<string, unknown>): Promise<Result<void, string>>;

  /**
   * Set contact info.
   */
  setContactInfo(data: Partial<ContactInfo>): Promise<Result<void, string>>;

  /**
   * Experimental.
   */
  __unstableStartConversation(): Promise<Result<void, string>>;

  /**
   * Experimental.
   */
  __unstableStartConversationWithOperator(
    operatorId: number,
  ): Promise<Result<void, string>>;

  /**
   * Experimental.
   * Opens a conversation by id.
   */
  __unstableOpenConversation(id: number): Promise<Result<void, string>>;

  /**
   * Experimental.
   */
  __unstableSetRegistration(enabled: boolean): Promise<Result<void, string>>;

  /**
   * Experimental.
   */
  __unstableSetProactive(enabled: boolean): Promise<Result<void, string>>;
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
  city: string | null;
  street: string | null;
  country: string | null;
  salutation: "mr" | "ms" | "pr" | "prof" | null;
  gender: "m" | "f" | "d" | null;
  custom_field_data: Record<string, null | string | string[]>;
  instagram_username: string | null;
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
