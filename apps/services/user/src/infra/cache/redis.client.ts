import { createClient } from "redis";
import { EnvironmentException } from "../../errors/infra/env-exception";

if (!process.env.REDIS_URL) {
  throw new EnvironmentException("REDIS_URL is not defined");
}

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});
