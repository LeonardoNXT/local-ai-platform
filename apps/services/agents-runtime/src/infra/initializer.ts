import { DataSource, type EntitySchema, type EntityTarget } from "typeorm";

export abstract class TypeOrmInitializer {
  public static create<T extends EntityTarget<T>>(entities: T[]): DataSource {
    return new DataSource({
      type: "postgres",
      host: process.env.DATABASE_HOST ?? "localhost",
      port: process.env.DATABASE_PORT
        ? Number(process.env.DATABASE_PORT)
        : 5432,
      username: process.env.DATABASE_USER ?? "admin",
      password: process.env.DATABASE_PASSWORD ?? "admin",
      database: process.env.DATABASE_NAME ?? "local_ai_agents_runtime",
      entities: entities as EntitySchema[],
      synchronize: true, // desabilitar quando vier com as migrations (provavelmente me esquecerei...)
    });
  }
}
