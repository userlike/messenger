import { ActionResult, AllApis } from "@userlike/messenger-types";

const EVENT_NAME = "userlike:messenger:script";

export async function loadWidget(
  window: Window,
  widgetKey: string,
  baseUrl?: string
): Promise<WidgetLoader> {
  const url = getUrl(widgetKey, baseUrl);

  return new Promise<WidgetLoader>((resolve) => {
    setPureLoader();
    onScriptLoad(widgetKey, (result) => resolve(result));
    loadScript(window, url);
  });
}

export const notifyScriptLoad = (
  payload: WidgetLoader,
  target: EventTarget = window
): void => {
  target.dispatchEvent(
    new CustomEvent(EVENT_NAME, {
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
  cb: (r: WidgetLoader) => void,
  target: EventTarget = window
): (() => void) => {
  const handler = (event: Event) => {
    if (!isScriptEvent(event)) {
      return;
    }
    if (event.detail.widget_key !== widgetKey) return;
    target.removeEventListener(EVENT_NAME, handler);
    cb(event.detail);
  };

  target.addEventListener(EVENT_NAME, handler);
  return () => target.removeEventListener(EVENT_NAME, handler);
};

const isScriptEvent = (evt: Event): evt is CustomEvent<WidgetLoader> =>
  evt.type === EVENT_NAME;

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

export interface WidgetLoaderSettings {
  app_key: string;
  widget_key: string;
  config: unknown;
}

/**
 * For internal use.
 */
export interface WidgetLoader {
  app_key: string;
  widget_key: string;
  config: unknown;

  load: (opts?: LegacyOptions) => Promise<void>;
  createMessenger: (
    version: number
  ) => (
    settings: WidgetLoaderSettings
  ) => Promise<ActionResult<string, AllApis>>;
}
