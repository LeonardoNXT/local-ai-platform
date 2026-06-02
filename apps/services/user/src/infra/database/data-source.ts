import { DataSource } from "typeorm";
import { UserOrmEntity } from "./entities/user.orm-entity";
import { OutboxOrmEntity } from "@local-ai/shared-messenger";
import { EnvironmentException } from "../../errors/infra/env-exception";

if (
  !process.env.POSTGRES_HOST ||
  !process.env.POSTGRES_PORT ||
  !process.env.POSTGRES_USERNAME ||
  !process.env.POSTGRES_PASSWORD ||
  !process.env.POSTGRES_DATABASE
) {
  throw new EnvironmentException(
    "Database environment variables are not configured correctly.",
  );
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: true,
  logging: false,
  entities: [UserOrmEntity, OutboxOrmEntity],
});
