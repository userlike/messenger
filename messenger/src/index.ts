import {
  LegacyLoaderFactoryResult,
  onScriptLoad,
} from "@userlike/messenger-internal";
import {
  CreateMessenger,
  ActionResult,
  AllApis,
} from "@userlike/messenger-types";

export const createMessenger: CreateMessenger = async (
  opts
): Promise<ActionResult<string, AllApis>> => {
  const { createMessenger, config } = await loadModule(
    window,
    opts.widgetKey,
    opts.baseUrl
  );
  return createMessenger(opts.version)(config);
};

async function loadModule(
  window: Window,
  widgetKey: string,
  baseUrl?: string
): Promise<LegacyLoaderFactoryResult> {
  const url = getUrl(widgetKey, baseUrl);

  return new Promise<LegacyLoaderFactoryResult>((resolve) => {
    onScriptLoad(widgetKey, (result) => resolve(result));
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
