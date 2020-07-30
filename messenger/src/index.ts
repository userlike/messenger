import { loadWidget } from "@userlike/messenger-internal";
import {
  CreateMessenger,
  ActionResult,
  AllApis,
} from "@userlike/messenger-types";

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
