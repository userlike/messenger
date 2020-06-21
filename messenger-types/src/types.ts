import { ActionResult } from "./ActionResult";
import {
  SupportedMessengerInfo,
  DeprecatedMessengerInfo,
  EndOfLifeMessengerInfo,
  VersionedApi,
} from "./versioning";
import * as V1 from "./versions/v1";

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
  version: 1;
  /**
   * SHA-256 encoded widget id.
   */
  widgetId: string;
}
