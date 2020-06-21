import {
  LegacyLoaderFactory,
  LegacyLoaderFactoryResult,
} from "@userlike/messenger-internal";
import {
  CreateMessenger,
  ActionResult,
  AllApis,
} from "@userlike/messenger-types";

export const createMessenger: CreateMessenger = async (
  opts
): Promise<ActionResult<string, AllApis>> => {
  const { createMessenger, config } = await loadModule(window, opts.widgetId);
  return createMessenger(opts.version)(config);
};

async function loadModule(
  window: Window,
  sha256: string
): Promise<LegacyLoaderFactoryResult> {
  const url = getUrl(sha256);
  const uslkWindow = getUslkWindow(window);

  return new Promise<LegacyLoaderFactoryResult>((resolve) => {
    uslkWindow.__USERLIKE_DEFINE__ = (factory: LegacyLoaderFactory) => {
      const mod = factory();
      resolve(mod);
    };
    loadScript(window, url);
  });
}

async function loadScript(window: Window, url: string) {
  new Promise<boolean>((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = reject;
    script.src = url;
    window.document.getElementsByTagName("head")[0].appendChild(script);
  });
}

interface UserlikeWindow extends Window {
  __USERLIKE_DEFINE__?: (factory: LegacyLoaderFactory) => void;
}

function getUslkWindow(window: Window) {
  return window as UserlikeWindow;
}

type Dictionary<K extends keyof any, T> = {
  [P in K]?: T;
};

declare const process: { env: Dictionary<string, string> };

function getUrl(sha256: string) {
  const baseUrl =
    process.env.USERLIKE_WIDGET_URL ??
    "https://userlike-cdn-widgets.s3-eu-west-1.amazonaws.com";
  return `${baseUrl}/${sha256}.js`;
}
