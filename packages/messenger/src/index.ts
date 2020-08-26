import {
  CreateMessenger,
  ActionResult,
  AllApis,
  loadWidget,
} from "@userlike/messenger-internal";

export * from "@userlike/messenger-internal";

export const createMessenger: CreateMessenger = async (
  opts
): Promise<ActionResult<string, AllApis>> => {
  const { createMessenger, widget_key, config } = await loadWidget(
    window,
    opts.widgetKey,
    opts.baseUrl
  );

  return createMessenger(opts.version)({
    widget_key,
    config,
  });
};
