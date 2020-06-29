import { ActionResult, AllApis } from "@userlike/messenger-types";

class UserlikeMessengerScriptEvent extends CustomEvent<
  LegacyLoaderFactoryResult
> {}

const EVENT_NAME = "userlike:messenger:script";

export const notifyScriptLoad = (
  payload: LegacyLoaderFactoryResult,
  target: EventTarget = window
): void => {
  target.dispatchEvent(
    new UserlikeMessengerScriptEvent(EVENT_NAME, {
      detail: payload,
    })
  );
};

export const onScriptLoad = (
  widgetKey: string,
  cb: (r: LegacyLoaderFactoryResult) => void,
  target: EventTarget = window
): (() => void) => {
  const handler = (event: Event) => {
    if (!(event instanceof UserlikeMessengerScriptEvent)) {
      return;
    }
    if (event.detail.widget_key !== widgetKey) return;
    target.removeEventListener(EVENT_NAME, handler);
    cb(event.detail);
  };

  target.addEventListener(EVENT_NAME, handler);
  return () => target.removeEventListener(EVENT_NAME, handler);
};

export const isPureLoader = (global: Window = window) => {
  return "__USERLIKE_PURE__" in global;
};

export const setPureLoader = (global: Window = window) => {
  (global as any).__USERLIKE_PURE__ = true;
};

export interface LegacyOptions {
  ready?: () => void;
  onError?: (err: unknown) => void;
}

/**
 * For internal use.
 */
export interface LegacyLoaderFactory {
  (config?: unknown, global?: Window): LegacyLoaderFactoryResult;
}

/**
 * For internal use.
 */
export interface LegacyLoaderFactoryResult {
  app_key: string;
  widget_key: string;
  load: (opts?: LegacyOptions) => Promise<void>;
  config: unknown;
  createMessenger: (
    version: number
  ) => (config: unknown) => Promise<ActionResult<string, AllApis>>;
}
