import { ActionResult, AllApis } from "@userlike/messenger-types";

class UserlikeMessengerScriptEvent extends CustomEvent<
  LegacyLoaderFactoryResult
> {}

const EVENT_NAME = "userlike:messenger:script";

export async function loadWidget(
  window: Window,
  widgetKey: string,
  baseUrl?: string
): Promise<LegacyLoaderFactoryResult> {
  const url = getUrl(widgetKey, baseUrl);

  return new Promise<LegacyLoaderFactoryResult>((resolve) => {
    setPureLoader();
    onScriptLoad(widgetKey, (result) => resolve(result));
    loadScript(window, url);
  });
}

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

type Dictionary<K extends keyof any, T> = {
  [P in K]?: T;
};

declare const process: { env: Dictionary<string, string> };

function getUrl(
  sha256: string,
  baseUrl = process.env.USERLIKE_WIDGET_URL ??
    "https://userlike-cdn-widgets.s3-eu-west-1.amazonaws.com"
) {
  return `${baseUrl}/${sha256}.js`;
}

async function loadScript(window: Window, url: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(undefined);
    script.onerror = reject;
    script.src = url;
    window.document.getElementsByTagName("head")[0].appendChild(script);
  });
}

const onScriptLoad = (
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
