import { createIFrame } from "./create-frame";
import { isUnsupported } from "./unsupported";
import { Json } from "../types";
import { Run, WidgetLoader } from "./types";

export function loadScripts(
  window: Window,
  widgetKey: string,
  baseUrl?: string
): Promise<WidgetLoader> {
  if (isUnsupported()) {
    return Promise.reject(
      new Error("Browser is not suported by Userlike messenger.")
    );
  }
  return Promise.all([loadAssetsManifest(baseUrl), createIFrame()]).then(
    ([manifest, iframe]) =>
      new Promise((resolve, reject) => {
        const { contentWindow, contentDocument } = iframe;

        if (!contentWindow || !contentDocument) {
          return Promise.reject(new Error("iframe did not initialize"));
        }

        const lastIdx = manifest.length - 1;
        manifest.slice(0, lastIdx).forEach((script) => {
          addScriptSrc(contentDocument, script);
        });

        addScriptSrc(contentDocument, manifest[lastIdx], () => {
          const { run }: Window & { run: Run } = unsafeCoerce(contentWindow);

          run({ widget_key: widgetKey }, window)
            .then((widgetLoader) => resolve(widgetLoader))
            .catch(reject);
        });
      })
  );
}

function addScriptSrc(doc: Document, href: string, onLoad?: () => void) {
  const el = doc.createElement("script");
  el.async = false;
  el.src = href;
  if (onLoad) {
    el.onload = onLoad;
  }
  doc.head.appendChild(el);
}

function unsafeCoerce<O>(x: unknown): O {
  return x as O;
}

export async function loadAssetsManifest(
  baseUrl?: string
): Promise<Array<string>> {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dictionary<K extends keyof any, T> = {
  [P in K]?: T;
};

declare const process: { env: Dictionary<string, string> };

function getManifestUrl(
  baseUrl = "https://userlike-cdn-widgets.s3-eu-west-1.amazonaws.com"
) {
  return `${baseUrl}/umm-manifest.json`;
}

function getConfigUrl(
  widgetKey: string,
  baseUrl = "https://userlike-cdn-widgets.s3-eu-west-1.amazonaws.com"
) {
  return `${baseUrl}/${widgetKey}.json`;
}
