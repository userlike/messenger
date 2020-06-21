export interface VersionedApi<VersionId> {
  version: VersionId;
}

export interface SupportedMessengerInfo<
  VersionId,
  Api extends VersionedApi<VersionId>
> {
  version: {
    id: VersionId;
    status: VersionStatus.Supported;
    deprecation: Date | null;
    endOfLife: Date | null;
  };
  api: Api;
}

export interface DeprecatedMessengerInfo<
  VersionId,
  Api extends VersionedApi<VersionId>
> {
  version: {
    id: VersionId;
    status: VersionStatus.Deprecated;
    deprecation: Date;
    endOfLife: Date | null;
  };
  api: Api;
}

export interface EndOfLifeMessengerInfo<VersionId> {
  version: {
    id: VersionId;
    status: VersionStatus.EndOfLife;
    deprecation: Date;
    endOfLife: Date;
  };
  api: null;
}

export enum VersionStatus {
  Supported = "supported",
  Deprecated = "deprecated",
  EndOfLife = "end-of-life",
}
