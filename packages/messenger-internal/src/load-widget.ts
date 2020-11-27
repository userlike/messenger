import type { ActionResult } from "./ActionResult";
import type { MessengerInfo, Json } from "./types";
import type * as v0 from "./v0";
import type * as v1 from "./v1";
import { VersionedApi } from "./versioning";

const EVENT_NAME = "userlike:messenger:script";

export async function loadWidget(
  window: Window,
  widgetKey: string,
  baseUrl?: string
): Promise<WidgetLoader> {
  const url = getWidgetLoaderUrl(widgetKey, baseUrl);
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

export async function loadAssetsManifest(baseUrl?: string): Promise<Json> {
  const url = getManifestUrl(baseUrl);

  const response = await fetch(url, {
    mode: "cors",
  });

  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

export async function loadWidgetConfig(
  widgetKey: string,
  baseUrl?: string
): Promise<Json> {
  const url = getConfigUrl(widgetKey, baseUrl);

  const response = await fetch(url, {
    mode: "cors",
  });

  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(new Error(response.statusText));
  }
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

function getWidgetLoaderUrl(
  sha256: string,
  baseUrl = process.env.USERLIKE_WIDGET_URL ??
    "https://userlike-cdn-widgets.s3-eu-west-1.amazonaws.com"
) {
  return `${baseUrl}/${sha256}.js`;
}

function getConfigUrl(
  widgetKey: string,
  baseUrl = process.env.USERLIKE_WIDGET_URL ??
    "https://userlike-cdn-widgets.s3-eu-west-1.amazonaws.com"
) {
  return `${baseUrl}/${widgetKey}.json`;
}

function getManifestUrl(
  baseUrl = process.env.USERLIKE_WIDGET_URL ??
    "https://userlike-cdn-widgets.s3-eu-west-1.amazonaws.com"
) {
  return `${baseUrl}/umm.json`;
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

  createMessenger(
    version: 0
  ): (
    settings: WidgetLoaderSettings
  ) => Promise<ActionResult<string, MessengerInfo<0, v0.Api>>>;

  createMessenger(
    version: 1
  ): (
    settings: WidgetLoaderSettings
  ) => Promise<ActionResult<string, MessengerInfo<1, v1.Api>>>;

  createMessenger(
    version: number
  ): (
    settings: WidgetLoaderSettings
  ) => Promise<
    ActionResult<string, MessengerInfo<number, VersionedApi<number>>>
  >;
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
