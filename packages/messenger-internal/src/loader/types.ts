import type { ActionResult } from "../ActionResult";
import type { MessengerInfo } from "../types";
import type { VersionedApi } from "../versioning";
import type * as v0 from "../v0";
import type * as v1 from "../v1";

export interface WidgetLoaderSettings {
  widget_key: string;
}

export interface WidgetLoader {
  load: (opts?: LegacyOptions) => Promise<void>;
  createMessenger(
    version: 0
  ): (
    settings: WidgetLoaderSettings
  ) => Promise<ActionResult<string, MessengerInfo<0, v0.Api>>>;

  createMessenger(
    version: 1
  ): (
    settings: WidgetLoaderSettings
  ) => Promise<ActionResult<string, MessengerInfo<1, v1.Api>>>;

  createMessenger(
    version: number
  ): (
    settings: WidgetLoaderSettings
  ) => Promise<
    ActionResult<string, MessengerInfo<number, VersionedApi<number>>>
  >;
}

export interface LegacyOptions {
  ready?: () => void;
  onError?: (err: unknown) => void;
}

export type Run = (
  settings: WidgetLoaderSettings,
  hostWindow: Window
) => Promise<WidgetLoader>;
