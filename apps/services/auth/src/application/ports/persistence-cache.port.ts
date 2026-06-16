export type CreatePersistenceModulePayload = {
  key: string;
  value: string;
  config: {
    expirateInSec: number;
  };
};

export type GetPersistenceModulePayload = {
  key: string;
};

export type DeletePersistenceModulePayload = {
  key: string;
};
export abstract class PersistenceCachePort {
  public abstract create(
    payload: CreatePersistenceModulePayload,
  ): Promise<void>;
  public abstract getDel(
    payload: GetPersistenceModulePayload,
  ): Promise<string | null>;
}
