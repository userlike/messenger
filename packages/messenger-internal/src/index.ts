import { ActionResult, AllApis } from "@userlike/messenger-types";

const EVENT_NAME = "userlike:messenger:script";

export async function loadWidget(
  window: Window,
  widgetKey: string,
  baseUrl?: string
): Promise<WidgetLoader> {
  const url = getUrl(widgetKey, baseUrl);
  setPureLoader(widgetKey);

  return new Promise<WidgetLoader>((resolve, reject) => {
    window.addEventListener(EVENT_NAME, handler);

    function handler(event: Event): void {
      if (!isScriptEvent(event)) {
        return;
      }
      if (
        event.detail.kind === "error" &&
        event.detail.error.widget_key === widgetKey
      ) {
        window.removeEventListener(EVENT_NAME, handler);
        return reject(new Error("Could not load widget script"));
      }
      if (
        event.detail.kind === "success" &&
        event.detail.value.widget_key === widgetKey
      ) {
        window.removeEventListener(EVENT_NAME, handler);
        return resolve(event.detail.value);
      }
    }

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.onerror = reject;
    script.src = url;
    window.document.getElementsByTagName("head")[0].appendChild(script);
  });
}

export const notifyScriptLoad = (
  payload: ActionResult<{ widget_key: string }, WidgetLoader>,
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

function isScriptEvent(
  evt: Event
): evt is CustomEvent<ActionResult<{ widget_key: string }, WidgetLoader>> {
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
  customWindow.__USERLIKE_PURE__ = { ...customWindow.__USERLIKE_PURE__ };
  return customWindow;
}
