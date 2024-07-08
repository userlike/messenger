import {
  Result,
  loadScripts,
  MessengerOptions,
  VersionedApi,
  MessengerInfo,
  v0,
  v1,
  v2,
} from "@userlike/messenger-internal";

export * from "@userlike/messenger-internal";

/**
 * Given a version and a widget key, returns the API in addition to
 * version information and relevant dates.
 */
export async function createMessenger(
  opts: MessengerOptions<2>,
): Promise<Result<MessengerInfo<2, v2.Api>, string>>;

/**
 * For internal use only.
 *
 * @deprecated
 */
export async function createMessenger(
  opts: MessengerOptions<1>,
): Promise<Result<MessengerInfo<1, v1.Api>, string>>;

/**
 * For internal use only.
 *
 * @deprecated
 */
export async function createMessenger(
  opts: MessengerOptions<0>,
): Promise<Result<MessengerInfo<0, v0.Api>, string>>;

export async function createMessenger(
  opts: MessengerOptions<number>,
): Promise<Result<MessengerInfo<number, VersionedApi<number>>, string>>;

export async function createMessenger(
  opts: MessengerOptions<number>,
): Promise<Result<MessengerInfo<number, VersionedApi<number>>, string>> {
  const { createMessenger } = await loadScripts(
    window,
    opts.widgetKey,
    opts.baseUrl,
  );

  return createMessenger(opts.version)({
    widget_key: opts.widgetKey,
  });
}
