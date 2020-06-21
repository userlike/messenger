import { ActionResult, AllApis } from "@userlike/messenger-types";

export interface LegacyOptions {
  ready?: () => void;
  onError?: (err: unknown) => void;
}

/**
 * For internal use.
 */
export interface LegacyLoaderFactory {
  (config?: unknown, global?: Window): LegacyLoaderFactoryResult;
}

/**
 * For internal use.
 */
export interface LegacyLoaderFactoryResult {
  load: (opts?: LegacyOptions) => Promise<void>;
  config: unknown;
  createMessenger: (
    version: number
  ) => (config: unknown) => Promise<ActionResult<string, AllApis>>;
}
