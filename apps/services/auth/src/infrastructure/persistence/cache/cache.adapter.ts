import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from "@nestjs/common";
import { createClient, RedisClientType } from "redis";

import { authConfig } from "../../config/auth.config";
import { PersistenceCachePort } from "../../../application/ports/persistence-cache.port";

@Injectable()
export class PersistenceCache
  implements PersistenceCachePort, OnModuleInit, OnApplicationShutdown
{
  private readonly logger = new Logger(PersistenceCache.name);

  private readonly redis: RedisClientType;

  public constructor() {
    this.redis = createClient({
      url: authConfig.redisURL,
    });

    this.redis.on("connect", () => {
      this.logger.log("Connecting to Redis...");
    });

    this.redis.on("ready", () => {
      this.logger.log("Redis connection established");
    });

    this.redis.on("reconnecting", () => {
      this.logger.warn("Reconnecting to Redis...");
    });

    this.redis.on("error", (error: Error) => {
      this.logger.error(
        `Redis connection error: ${error.message}`,
        error.stack,
      );
    });

    this.redis.on("end", () => {
      this.logger.warn("Redis connection closed");
    });
  }

  public async onModuleInit(): Promise<void> {
    if (this.redis.isOpen) {
      return;
    }

    await this.redis.connect();
  }

  public async onApplicationShutdown(): Promise<void> {
    if (!this.redis.isOpen) {
      return;
    }

    await this.redis.quit();
  }

  public async save<T>(
    key: string,
    value: T,
    ttlInSeconds: number,
  ): Promise<void> {
    this.ensureConnection();

    const result = await this.redis.set(key, JSON.stringify(value), {
      EX: ttlInSeconds,
      NX: true,
    });

    if (result !== "OK") {
      throw new Error(`Cache entry with key "${key}" already exists`);
    }
  }

  public async consume<T>(key: string): Promise<T | null> {
    this.ensureConnection();

    const value = await this.redis.getDel(key);

    if (!value) {
      return null;
    }

    return this.deserialize<T>(value);
  }

  public async get<T>(key: string): Promise<T | null> {
    this.ensureConnection();

    const value = await this.redis.get(key);

    if (!value) {
      return null;
    }

    return this.deserialize<T>(value);
  }

  public async delete(key: string): Promise<void> {
    this.ensureConnection();

    await this.redis.del(key);
  }

  private deserialize<T>(value: string): T {
    return JSON.parse(value) as T;
  }

  private ensureConnection(): void {
    if (!this.redis.isReady) {
      throw new Error("Redis connection is not ready");
    }
  }
}
