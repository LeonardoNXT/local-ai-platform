import { Injectable } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";
import type {
  CreatePersistenceModulePayload,
  GetPersistenceModulePayload,
  PersistenceCachePort,
} from "../../../application/ports/persistence-cache.port";
import { authConfig } from "../../config/auth.config";

@Injectable()
export class RedisPersistenceCache implements PersistenceCachePort {
  private readonly client: RedisClientType;

  public constructor() {
    this.client = createClient({
      url: authConfig.redisURL,
      password: authConfig.redisPassword,
    });

    this.start()
      .then(() => {
        console.log("[REDIS CLIENT] WAS STARTED ON AUTH SERVICE");
      })
      .catch((err) => {
        const error = err instanceof Error ? err.message : "UNKNOWN";

        console.log(
          "[REDIS CLIENT] There was an error on start a initializer function",
          error,
        );
      });
  }

  private async start() {
    this.client.on("error", (err) => console.log("Redis Cluster Error", err));

    await this.client.connect();
  }

  public async create(payload: CreatePersistenceModulePayload): Promise<void> {
    console.log(
      `[REDIS] THERE WAS CREATED AN CACHE TO ${payload.key} and ${payload.value}`,
    );

    await this.client.set(payload.key, payload.value, {
      expiration: {
        type: "EX",
        value: payload.config.expirateInSec,
      },
    });
  }

  public async getDel(
    payload: GetPersistenceModulePayload,
  ): Promise<string | null> {
    return await this.client.getDel(payload.key);
  }
}
