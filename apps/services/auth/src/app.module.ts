import { Module, OnModuleInit } from "@nestjs/common";
import { HealthCheckController } from "./infrastructure/http/controllers/life-cycle.controller";
import { OidcModule } from "./modules/oidc.module";
import { PersistenceModule } from "./modules/persistence.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SigningKeyOrmEntity } from "./infrastructure/persistence/entities/signing-key.orm-entity";
import { CryptoModule } from "./modules/crypto.module";
import { EnsureSigningKeyUsecase } from "./application/usecases/discovery/ensure-signing-key.usecase";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST ?? "localhost",
      port: Number(process.env.DATABASE_PORT ?? 5432),
      username: process.env.DATABASE_USER ?? "admin",
      password: process.env.DATABASE_PASSWORD ?? "admin",
      database: process.env.DATABASE_NAME ?? "local_ai",
      entities: [SigningKeyOrmEntity],
      synchronize: true,
    }),
    OidcModule,
    CryptoModule,
    PersistenceModule,
  ],
  controllers: [HealthCheckController],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly ensureSigningKey: EnsureSigningKeyUsecase) {}

  async onModuleInit() {
    await this.ensureSigningKey.execute();
  }
}
