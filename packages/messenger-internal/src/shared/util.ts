import { State } from "./types";

export const getUnreadMessageCount = (state: State): number =>
  state.conversations.reduce((acc, c) => acc + c.unread.length, 0);
