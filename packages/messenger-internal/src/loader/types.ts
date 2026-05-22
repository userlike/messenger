import type { MessengerInfo } from "../types";
import type { VersionedApi } from "../versioning";
import type * as v0 from "../v0";
import type * as v1 from "../v1";
import type * as v2 from "../v2";
import { Result } from "../shared";

/**
 * @deprecated Use `CreateMessengerSettings` or `RunSettings` instead.
 * Will be removed in a future minor version.
 */
export interface WidgetLoaderSettings {
  widget_key: string;
  nonce?: string;
}

export interface CreateMessengerSettings {
  widget_key: string;
}

export interface WidgetLoader {
  load: (opts?: LegacyOptions) => Promise<void>;
  createMessenger(
    version: 0,
  ): (
    settings: CreateMessengerSettings & { nonce?: string },
  ) => Promise<Result<MessengerInfo<0, v0.Api>, string>>;

  createMessenger(
    version: 1,
  ): (
    settings: CreateMessengerSettings,
  ) => Promise<Result<MessengerInfo<1, v1.Api>, string>>;

  createMessenger(
    version: 2,
  ): (
    settings: CreateMessengerSettings,
  ) => Promise<Result<MessengerInfo<2, v2.Api>, string>>;

  createMessenger(
    version: number,
  ): (
    settings: CreateMessengerSettings,
  ) => Promise<Result<MessengerInfo<number, VersionedApi<number>>, string>>;
}

export interface LegacyOptions {
  nonce?: string;
  ready?: () => void;
  onError?: (err: unknown) => void;
}

export interface RunSettings {
  widget_key: string;
}

export type Run = (
  settings: RunSettings,
  hostWindow: Window,
) => Promise<WidgetLoader>;
