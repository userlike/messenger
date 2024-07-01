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

export type Json = boolean | number | string | null | JsonArray | JsonRecord;

export interface JsonRecord {
  readonly [key: string]: Json;
}

export interface JsonArray extends ReadonlyArray<Json> {}
