// application/ports/persistence-cache.port.ts

export abstract class PersistenceCachePort {
  public abstract save<T>(
    key: string,
    value: T,
    ttlInSeconds: number,
  ): Promise<void>;

  public abstract consume<T>(key: string): Promise<T | null>;

  public abstract get<T>(key: string): Promise<T | null>;

  public abstract delete(key: string): Promise<void>;
}
