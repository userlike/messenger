import type {
  SupportedMessengerInfo,
  DeprecatedMessengerInfo,
  EndOfLifeMessengerInfo,
  VersionedApi,
} from "./versioning";

export type MessengerInfo<VersionId, Api extends VersionedApi<VersionId>> =
  | SupportedMessengerInfo<VersionId, Api>
  | DeprecatedMessengerInfo<VersionId, Api>
  | EndOfLifeMessengerInfo<VersionId>;

export interface MessengerOptions<Version> {
  /**
   * API version to use.
   */
  version: Version;
  /**
   * SHA-256 encoded widget id.
   */
  widgetKey: string;
  /**
   * For internal use only.
   */
  baseUrl?: string;
}
