import {
  ActionResult,
  loadWidget,
  MessengerOptions,
  VersionedApi,
  MessengerInfo,
  v0,
  v1,
} from "@userlike/messenger-internal";

export * from "@userlike/messenger-internal";

export async function createMessenger(
  opts: MessengerOptions<0>
): Promise<ActionResult<string, MessengerInfo<0, v0.Api>>>;

export async function createMessenger(
  opts: MessengerOptions<0>
): Promise<ActionResult<string, MessengerInfo<1, v1.Api>>>;

export async function createMessenger(
  opts: MessengerOptions<number>
): Promise<ActionResult<string, MessengerInfo<number, VersionedApi<number>>>>;

export async function createMessenger(
  opts: MessengerOptions<number>
): Promise<ActionResult<string, MessengerInfo<number, VersionedApi<number>>>> {
  const { createMessenger, widget_key, config } = await loadWidget(
    window,
    opts.widgetKey,
    opts.baseUrl
  );

  return createMessenger(opts.version)({
    widget_key,
    config,
  });
}
