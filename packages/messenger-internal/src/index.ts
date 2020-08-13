import { ActionResult, AllApis } from "@userlike/messenger-types";

const EVENT_NAME = "userlike:messenger:script";

export async function loadWidget(
  window: Window,
  widgetKey: string,
  baseUrl?: string
): Promise<WidgetLoader> {
  const url = getUrl(widgetKey, baseUrl);

  return new Promise<WidgetLoader>((resolve) => {
    setPureLoader(widgetKey);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

function onScriptLoad(
  widgetKey: string,
  cb: (r: WidgetLoader) => void,
  target: EventTarget = window
): () => void {
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
}

function isScriptEvent(evt: Event): evt is CustomEvent<WidgetLoader> {
  return evt.type === EVENT_NAME;
}

export function isPureLoader(
  widgetKey: string,
  global: Window = window
): boolean {
  return getCustomWindow(global).__USERLIKE_PURE__[widgetKey] === true;
}

export function setPureLoader(
  widgetKey: string,
  global: Window = window
): void {
  getCustomWindow(global).__USERLIKE_PURE__[widgetKey] = true;
}

export interface LegacyOptions {
  ready?: () => void;
  onError?: (err: unknown) => void;
}

export interface WidgetLoaderSettings {
  widget_key: string;
  config: unknown;
}

/**
 * For internal use.
 */
export interface WidgetLoader {
  widget_key: string;
  config: unknown;

  load: (opts?: LegacyOptions) => Promise<void>;
  createMessenger: (
    version: number
  ) => (
    settings: WidgetLoaderSettings
  ) => Promise<ActionResult<string, AllApis>>;
}

type CustomWindow = Window &
  typeof globalThis & {
    __USERLIKE_PURE__: Dictionary<string, true>;
  };

function getCustomWindow(window: Window) {
  const customWindow = (window as unknown) as CustomWindow;
  Object.assign(customWindow, {
    __USERLIKE_PURE__: { ...customWindow.__USERLIKE_PURE__ },
  });
  return customWindow;
}
