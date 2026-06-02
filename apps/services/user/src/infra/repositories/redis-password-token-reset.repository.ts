import { type RedisClientType } from "redis";
import { type PasswordResetTokenRepository } from "../../application/gateway/password-reset-repository.gateway";

export class RedisPasswordResetTokenRepository implements PasswordResetTokenRepository {
  constructor(private readonly redis: RedisClientType) {}

  async save(tokenHash: string, userId: string, ttl: number): Promise<void> {
    await this.redis.setEx(tokenHash, ttl, userId);
  }

  async find(token: string): Promise<string | null> {
    return await this.redis.get(token);
  }

  async delete(token: string): Promise<void> {
    await this.redis.del(token);
  }
}
