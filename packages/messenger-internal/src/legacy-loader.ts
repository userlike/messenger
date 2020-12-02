/**
 * Functions used internally by UMM to support
 * @userlike/messenger@1.0.0
 */

import type { ActionResult } from "./ActionResult";
import { WidgetLoader } from "./loader";

const EVENT_NAME = "userlike:messenger:script";

/**
 * @deprecated
 */
export const notifyScriptLoad = (
  payload: ActionResult<{ widget_key: string; original?: Error }, WidgetLoader>,
  target: EventTarget = window
): void => {
  target.dispatchEvent(
    new CustomEvent(EVENT_NAME, {
      detail: payload,
    })
  );
};

/**
 * @deprecated
 */
export function isPureLoader(
  widgetKey: string,
  global: Window = window
): boolean {
  return getCustomWindow(global).__USERLIKE_PURE__[widgetKey] === true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dictionary<K extends keyof any, T> = {
  [P in K]?: T;
};

type CustomWindow = Window &
  typeof globalThis & {
    __USERLIKE_PURE__: Dictionary<string, true>;
  };

function getCustomWindow(window: Window) {
  const customWindow = (window as unknown) as CustomWindow;
  customWindow.__USERLIKE_PURE__ = { ...customWindow.__USERLIKE_PURE__ };
  return customWindow;
}
