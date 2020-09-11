export interface Api {
  version: 0;

  userlikeStartChat(): void;
  userlikeQuitChat(): void;
  userlikeRequestOperatorChat(operatorId: number): void;
  userlikeShowButton(): void;
  userlikeHideButton(): void;
  userlikeChatState(): void;
  setData(data: Dictionary<string, unknown>): void;
  userlikeUpdateAPI(): void;
  userlikeRemoteApiModeNormal(): void;
  userlikeRemoteApiModeRegister(): void;
  userlikeRemoteApiModeProactivePassive(): void;
  userlikeRemoteApiModeProactivePassiveAndRegister(): void;
  userlikeRemoteApiResetState(): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dictionary<K extends keyof any, T> = {
  [P in K]?: T;
};
