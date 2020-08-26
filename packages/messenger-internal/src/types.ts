import type { ActionResult } from "./ActionResult";
import type {
  SupportedMessengerInfo,
  DeprecatedMessengerInfo,
  EndOfLifeMessengerInfo,
  VersionedApi,
} from "./versioning";

import type * as V1 from "./v1";

/**
 * Creates a messenger. This won't render the messenger. Use `mount` to render it.
 */
export interface CreateMessenger {
  (opts: MessengerOptions): Promise<ActionResult<string, AllApis>>;
}

export type AllApis = MessengerInfo<1, V1.Api>;

export type MessengerInfo<VersionId, Api extends VersionedApi<VersionId>> =
  | SupportedMessengerInfo<VersionId, Api>
  | DeprecatedMessengerInfo<VersionId, Api>
  | EndOfLifeMessengerInfo<VersionId>;

interface MessengerOptions {
  /**
   * API version to use.
   */
  version: 0 | 1;
  /**
   * SHA-256 encoded widget id.
   */
  widgetKey: string;
  /**
   * For internal use only.
   */
  baseUrl?: string;
}
